import {
    Modal,
    Select,
    Table,
    TableData,
    TextInput,
    useComputedColorScheme,
    Button,
    Pagination, Center, Switch,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import {IconCheck, IconCircleMinus, IconEdit, IconUpload, IconX} from '@tabler/icons-react';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { apiRoutes } from '@/apiRoutes.tsx';
import { formatISO, parseISO } from 'date-fns';

export default function DeviceProfiles() {
    const computedColorScheme = useComputedColorScheme('light', {getInitialValueInEffect: true});
    const [addProfile, setAddProfile] = useState(false);
    const [activePage, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [valueType, setValueType] = useState<any>("class java.lang.String");
    const [editProfile, setEditProfile] = useState({key: '', value: '', value_class: 'class java.lang.String',
    enrollment: false, connection: false, active: false})
    const [newProfile, setNewProfile] = useState({key: '', value: '', value_class: 'class java.lang.String',
        enrollment: false, connection: false, active: false})
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteProfile, setDeleteProfile] = useState<any>();
    const [profiles, setProfiles] = useState<TableData>({});
    const [editable, setEditable] = useState<string | null>();

    function get_profiles() {
        axios.get(apiRoutes.deviceProfiles)
        .then(r => {
            if (r.status === 200) {
                const tableData: TableData = {
                    caption: '',
                    head: ['Key', 'Value', 'Value Type', 'Install on Enrollment', 'Install on Connection', 'Active', 'Publish Time', 'Delete'],
                    body: [],
                };

                r.data.results.map((row:any) => {
                    if (tableData.body !== undefined) {
                        const delete_button = <Button
                            onClick={() => {
                                setDeleteModalOpen(true);
                                setDeleteProfile(row.preference_key);
                            }}
                            key={`${row.preference_key}_delete`}
                        ><IconCircleMinus />
                        </Button>;

                        let enrollment = <Switch checked={row.enrollment} onChange={(e) => {
                            setEditProfile({key: row.preference_key, value: row.preference_value, value_class: row.value_class, enrollment: e.target.checked,
                                connection: row.connection, active: row.active});
                        }} />
                        let connection = <Switch checked={row.connection} onChange={(e) => {
                            setEditProfile({key: row.preference_key, value: row.preference_value, value_class: row.value_class, enrollment: row.enrollment,
                                connection: e.target.checked, active: row.active});
                        }}/>
                        let active = <Switch checked={row.active} onChange={(e) => {
                            setEditProfile({key: row.preference_key, value: row.preference_value, value_class: row.value_class, enrollment: row.enrollment,
                                connection: row.connection, active: e.target.checked});
                        }} />

                        tableData.body.push([row.preference_key, row.preference_value, row.value_class, enrollment, connection, active, formatISO(parseISO(row.publish_time)), delete_button]);

                        setPage(r.data.current_page);
                        setTotalPages(r.data.total_pages);
                        setProfiles(tableData);
                    }
                });
            }
        }).catch(err => {
            console.log(err)
            notifications.show({
                icon: <IconX />,
                message: err.response.data.message,
                title: 'Failed to get device profiles',
                color: 'red',
            })
        })
    }

    useEffect(() => {
        get_profiles();
    }, []);

    useEffect(() => {
        add_profile(null, editProfile);
    }, [editProfile]);

    function add_profile(e:any, profile:any) {
        if (e !== null)
            e.preventDefault();

        let body = new FormData();
        body.append('preference_key', profile['key']);
        body.append('preference_value', profile['value']);
        body.append('value_class', profile['value_class']);
        body.append('enrollment', String(profile['enrollment']));
        body.append('connection', String(profile['connection']));
        body.append('active', String(profile['active']));
        axios.post(apiRoutes.deviceProfiles, body)
            .then(r => {
                if (r.status === 200) {
                    get_profiles();
                    setDeleteModalOpen(false);
                }
            }).catch(err => {
                console.log(err);
                notifications.show({
                    icon: <IconX />,
                    color: 'red',
                    title: 'Failed to add device profile',
                    message: e.response.data.error,
                })
        })
    }

    function delete_profile() {
        axios.delete(apiRoutes.deviceProfiles, {params: {preference_key: deleteProfile}})
            .then(r => {
                if (r.status === 200) {
                    get_profiles();
                    setDeleteModalOpen(false);
                }
            }).catch(err => {
                console.log(err);
                notifications.show({
                    icon: <IconX />,
                    title: 'Failed to delete device profile',
                    message: err.response.data.error,
                    color: 'red',
                })
        })
    }

    const value_class = <Select
        label="Value Type"
        value={newProfile['value_class']}
        data={[ 'String', 'Boolean', 'Float', 'Integer' ]}
        defaultValue="String"
        onChange={(value, option) => setNewProfile({...newProfile, value_class: option.label})}
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
            <Modal opened={addProfile} onClose={() => setAddProfile(false)} title="Upload new plugin">
                <TextInput required label="Key" onChange={e => { setNewProfile({...newProfile, key: e.currentTarget.value}) }} />
                <TextInput required label="Value" onChange={e => { setNewProfile({...newProfile, value: e.currentTarget.value}) }} />
                {value_class}
                <Switch label="Install on Enrollment" onChange={(e) => setNewProfile({...newProfile, enrollment: e.target.checked})} mb="md" />
                <Switch label="Install on Connection" onChange={(e) => setNewProfile({...newProfile, connection: e.target.checked})} mb="md" />
                <Switch label="Active" onChange={(e) => setNewProfile({...newProfile, active: e.target.checked})} mb="md" />
                <Button onClick={(e) => { add_profile(e, newProfile); }}>Add Device Profile</Button>
            </Modal>
            <Modal opened={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title={`Are you sure you want to delete ${deleteProfile}?`}>
                <Button onClick={() => delete_profile()} mr="md">Yes</Button>
                <Button onClick={() => setDeleteModalOpen(false)}>No</Button>
            </Modal>
        </>
    )

}