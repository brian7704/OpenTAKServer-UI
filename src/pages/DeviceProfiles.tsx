import {
    Modal,
    Select,
    Table,
    TableData,
    TextInput,
    useComputedColorScheme,
    Button,
    Pagination, Center, Switch, ComboboxItem,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { IconCircleMinus, IconUpload, IconX } from '@tabler/icons-react';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { formatISO, parseISO } from 'date-fns';
import { apiRoutes } from '../apiRoutes';
import {t} from "i18next";

interface ProfileInterface {
    preference_key: string;
    preference_value: string;
    value_class: string;
    enrollment: boolean;
    connection: boolean;
    active: boolean;
    eud_uid: string | null;
    publish_time: string;
    callsign: string | null;
}

export default function DeviceProfiles() {
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const [addProfile, setAddProfile] = useState(false);
    const [activePage, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [callsigns, setCallsigns] = useState<ComboboxItem[]>([]);
    const [editProfile, setEditProfile] = useState<ProfileInterface>({
        preference_key: '',
        preference_value: '',
        value_class: 'String',
        enrollment: false,
        connection: false,
        active: false,
        callsign: null,
        publish_time: '',
        eud_uid: null });
    const [newProfile, setNewProfile] = useState<ProfileInterface>({
        preference_key: '',
        preference_value: '',
        value_class: 'String',
        enrollment: false,
        connection: false,
        active: false,
        callsign: null,
        publish_time: '',
        eud_uid: null });
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteProfile, setDeleteProfile] = useState<ProfileInterface>();
    const [profiles, setProfiles] = useState<TableData>({
        caption: '',
        head: [t('Key'), t('Value'), t('Value Type'), t('Callsign'), t('Install on Enrollment'), t('Install on Connection'), t('Active'), t('Publish Time'), t('Delete')],
        body: [],
    });

    function get_profiles() {
        axios.get(apiRoutes.deviceProfiles, { params: {page: activePage}})
        .then(r => {
            if (r.status === 200) {
                const tableData: TableData = {
                    caption: '',
                    head: [t('Key'), t('Value'), t('Value Type'), t('Callsign'), t('Install on Enrollment'), t('Install on Connection'), t('Active'), t('Publish Time'), t('Delete')],
                    body: [],
                };

                r.data.results.map((row: ProfileInterface) => {
                    if (tableData.body !== undefined) {
                        const delete_button = <Button
                          onClick={() => {
                                setDeleteModalOpen(true);
                                setDeleteProfile(row);
                            }}
                          key={`${row.preference_key}_delete`}
                          color="red"
                        ><IconCircleMinus />
                                              </Button>;

                        const enrollment = <Switch
                          checked={row.enrollment}
                          onChange={(e) => {
                            setEditProfile({ ...row, enrollment: e.target.checked });
                          }}
                        />;
                        const connection = <Switch
                          checked={row.connection}
                          onChange={(e) => {
                            setEditProfile({ ...row, connection: e.target.checked });
                            }}
                        />;
                        const active = <Switch
                          checked={row.active}
                          onChange={(e) => {
                            setEditProfile({ ...row, active: e.target.checked });
                            }}
                        />;

                        tableData.body.push([row.preference_key, row.preference_value, row.value_class, row.callsign, enrollment, connection, active, formatISO(parseISO(row.publish_time)), delete_button]);
                    }
                });

                setPage(r.data.current_page);
                setTotalPages(r.data.total_pages);
                setProfiles(tableData);
            }
        }).catch(err => {
            console.log(err);
            notifications.show({
                icon: <IconX />,
                message: err.response.data.message,
                title: t('Failed to get device profiles'),
                color: 'red',
            });
        });
    }

    useEffect(() => {
        get_profiles();
    }, [activePage]);

    useEffect(() => {
        if (editProfile.preference_key) {add_profile(null, editProfile);}
    }, [editProfile]);

    useEffect(() => {
        get_euds();
    }, [addProfile]);

    function add_profile(e:any, profile:ProfileInterface) {
        if (e !== null) {e.preventDefault();}

        const body = new FormData();
        body.append('preference_key', profile.preference_key);
        body.append('preference_value', profile.preference_value);
        body.append('value_class', profile.value_class);
        body.append('enrollment', String(profile.enrollment));
        body.append('connection', String(profile.connection));
        body.append('active', String(profile.active));
        body.append('eud_uid', String(profile.eud_uid));
        axios.post(apiRoutes.deviceProfiles, body)
            .then(r => {
                if (r.status === 200) {
                    get_profiles();
                    setAddProfile(false);
                }
            }).catch(err => {
                console.log(err);
                notifications.show({
                    icon: <IconX />,
                    color: 'red',
                    title: t('Failed to add device profile'),
                    message: e.response.data.error,
                });
        });
    }

    function delete_profile() {
        axios.delete(apiRoutes.deviceProfiles, { params: { preference_key: deleteProfile?.preference_key, eud_uid: deleteProfile?.eud_uid} })
            .then(r => {
                if (r.status === 200) {
                    get_profiles();
                    setDeleteModalOpen(false);
                }
            }).catch(err => {
                console.log(err);
                notifications.show({
                    icon: <IconX />,
                    title: t('Failed to delete device profile'),
                    message: err.response.data.error,
                    color: 'red',
                });
        });
    }

    function get_euds() {
        axios.get(apiRoutes.eud, {params: {'all': true}})
            .then(r => {
                if (r.status === 200) {
                    const all_callsigns: ComboboxItem[] = []
                    r.data.map((row:any) => {
                        all_callsigns.push({value: row.uid, label: row.callsign});
                    });
                    setCallsigns(all_callsigns);
                }
            })
    }

    const value_class = <Select
      label="Value Type"
      value={newProfile.value_class}
      data={['String', 'Boolean', 'Float', 'Integer']}
      defaultValue="String"
      onChange={(value, option) => setNewProfile({ ...newProfile, value_class: option.label })}
      mb="md"
      allowDeselect={false}
      required
    />;

    return (
        <>
            <Button onClick={() => setAddProfile(true)} variant="filled" leftSection={<IconUpload size={14} />} mb="md">Add Device Profile</Button>
            <Table.ScrollContainer minWidth="100%">
                <Table stripedColor={computedColorScheme === 'light' ? 'gray.2' : 'dark.8'} highlightOnHoverColor={computedColorScheme === 'light' ? 'gray.4' : 'dark.6'} striped="odd" data={profiles} highlightOnHover withTableBorder mb="md" />
            </Table.ScrollContainer>
            <Center><Pagination total={totalPages} value={activePage} onChange={setPage} withEdges /></Center>
            <Modal opened={addProfile} onClose={() => setAddProfile(false)} title={t("Add Device Profile")}>
                <TextInput required label={t("Key")} onChange={e => { setNewProfile({ ...newProfile, preference_key: e.currentTarget.value }); }} />
                <TextInput required label={t("Value")} onChange={e => { setNewProfile({ ...newProfile, preference_value: e.currentTarget.value }); }} />
                {value_class}
                <Select
                    placeholder={t("Search")}
                    searchable
                    clearable
                    nothingFoundMessage={t("Nothing found...")}
                    label={t("Callsign")}
                    onChange={(value, option) => {setNewProfile({...newProfile, eud_uid: value})}}
                    data={callsigns}
                    allowDeselect={true}
                    mb="md" />
                <Switch label={t("Install on Enrollment")} onChange={(e) => setNewProfile({ ...newProfile, enrollment: e.target.checked })} mb="md" />
                <Switch label={t("Install on Connection")} onChange={(e) => setNewProfile({ ...newProfile, connection: e.target.checked })} mb="md" />
                <Switch label="Active" onChange={(e) => setNewProfile({ ...newProfile, active: e.target.checked })} mb="md" />
                <Button onClick={(e) => { add_profile(e, newProfile); }}>Add Device Profile</Button>
            </Modal>
            <Modal opened={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title={`Are you sure you want to delete ${deleteProfile?.preference_key}?`}>
                <Button onClick={() => delete_profile()} mr="md">Yes</Button>
                <Button onClick={() => setDeleteModalOpen(false)}>No</Button>
            </Modal>
        </>
    );
}
