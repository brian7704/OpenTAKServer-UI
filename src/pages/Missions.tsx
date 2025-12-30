import {
    Button,
    Center, ComboboxItem, Modal, MultiSelect,
    Pagination, Paper, PasswordInput, Select,
    Table,
    TableData, TextInput,
    useComputedColorScheme,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import {apiRoutes} from "@/apiRoutes.tsx";
import {IconCircleMinus, IconQrcode, IconMail, IconCheck, IconX, IconPlus, IconEdit} from "@tabler/icons-react";
import { QRCode } from 'react-qrcode-logo';
import Logo from "@/images/ots-logo.png";
import {t} from "i18next";

interface MissionProperties {
    name: string;
    description: string;
    creator_uid: string;
    tool: string;
    default_role: string;
    password: string;
    hash_tags: string;
}

export default function Missions() {
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const [activePage, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showQrCode, setShowQrCode] = useState(false);
    const [qrTitle, setQrTitle] = useState('');
    const [qrContent, setQrContent] = useState('');
    const [missionToDelete, setMissionToDelete] = useState('');
    const [deleteMissionOpen, setDeleteMissionOpen] = useState(false);
    const [showInvite, setShowInvite] = useState(false);
    const [inviteMission, setInviteMission] = useState('')
    const [inviteMissionPasswordProtected, setInviteMissionPasswordProtected] = useState(false)
    const [inviteMissionPasssword, setInviteMissionPassword] = useState('')
    const [inviteEud, setInviteEud] = useState<ComboboxItem | null>()
    const [callsigns, setCallsigns] = useState<ComboboxItem[]>([]);
    const [inviting, setInviting] = useState(false);
    const [showAddMission, setShowAddMission] = useState(false);
    const [allGroups, setAllGroups] = useState<ComboboxItem[]>([]);
    const [groups, setGroups] = useState<string[]>([]);
    const [addEditTitle, setAddEditTitle] = useState(t("Add Mission"));
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
    const [missionProperties, setMissionProperties] = useState<MissionProperties>({
        name: '',
        description: '',
        creator_uid: '',
        tool: 'public',
        default_role: 'MISSION_SUBSCRIBER',
        password: '',
        hash_tags: '',
    })
    const [missions, setMissions] = useState<TableData>({
        caption: '',
        head: [t('Name'), t('Description'), t('Owner'), t('Default Role'), t('Tool'), t('Creation Time'), t('Password Protected')],
        body: [],
    });

    function send_invitation() {
        if (inviteEud) {
            axios.post(apiRoutes.mission_invite, {
                mission_name: inviteMission, uid: inviteEud.value, password: inviteMissionPasssword,
            }).then(r => {
                if (r.status === 200) {
                    setInviting(false);
                    notifications.show({
                        title: t('Success'),
                        message: `Successfully invited ${inviteEud.label}`,
                        icon: <IconCheck/>,
                        color: 'green',
                    })
                }
            }).catch(err => {
                console.log(err);
                setInviting(false);
                notifications.show({
                    title: t('Failed to send mission invitation'),
                    message: err.response.data.error,
                    icon: <IconX/>,
                    color: 'red',
                })
            })
        }
    }

    function edit_mission(mission_row: any) {
        let mission_props: MissionProperties = {
            name: mission_row.name,
            description: mission_row.description,
            creator_uid: mission_row.creator_uid,
            tool: mission_row.tool,
            default_role: mission_row.default_role,
            password: mission_row.password,
            hash_tags: mission_row.hashtags,
        }
    }

    function get_missions() {
        axios.get(apiRoutes.missions, { params: {page: activePage} })
            .then((r) => {
                if (r.status === 200) {
                    const tableData: TableData = {
                        caption: '',
                        head: [t('Name'), t('Description'), t('Owner'), t('Default Role'), t('Tool'), t('Creation Time'), t('Password Protected')],
                        body: [],
                    }

                    r.data.results.map((row: any) => {
                        if (tableData.body !== undefined) {
                            const password_protected = row.passwordProtected ? <IconCheck color="green" /> : <IconX color="red" />;

                            const qrButton = <Button
                                rightSection={<IconQrcode size={14} />}
                                onClick={() => {
                                    setShowQrCode(true);
                                    setQrContent(row.qr_code);
                                    setQrTitle(row.name);
                                }}
                            >{t("QR Code")}
                            </Button>;

                            const edit_button = <Button
                                rightSection={<IconEdit size={14} />}
                                onClick={() => {
                                    setMissionProperties({
                                        name: row.name,
                                        description: row.description,
                                        creator_uid: row.creatorUid,
                                        tool: row.tool,
                                        default_role: row.defaultRole.type,
                                        password: row.password,
                                        hash_tags: row.hashtags
                                    });
                                    setShowAddMission(true);
                                    setAddEditTitle(t("Edit Mission"));
                                    let selected_groups: string[] = [];
                                    row.groups.map((group: any) => {
                                        selected_groups.push("" + group.id);
                                    })
                                    setSelectedGroups(selected_groups);
                                }}
                            >Edit</Button>

                            const invitation_button = <Button
                                rightSection={<IconMail size={14} /> }
                                onClick={() => {
                                    setShowInvite(true);
                                    setInviteMission(row.name);
                                    setInviteMissionPasswordProtected(row.passwordProtected)
                                }}>{t("Invite")}</Button>

                            const delete_button = <Button
                                onClick={() => {
                                    setMissionToDelete(row.name);
                                    setDeleteMissionOpen(true);
                                }}
                                disabled={localStorage.getItem('administrator') !== 'true'}
                                key={`${row.name}_delete`}
                                rightSection={<IconCircleMinus size={14} />}
                                color="red"
                            >Delete
                            </Button>;

                            tableData.body.push([row.name, row.description, row.owner.callsign, row.defaultRole.type, row.tool, row.createTime, password_protected, edit_button, invitation_button, qrButton, delete_button]);
                        }
                    });
                    setPage(r.data.current_page);
                    setTotalPages(r.data.total_pages);
                    setMissions(tableData);
                }
            })
    }

    function delete_mission() {
        axios.delete(apiRoutes.missions, {params: {name: missionToDelete}})
            .then(r => {
                if (r.status === 200) {
                    setDeleteMissionOpen(false);
                    notifications.show({
                        title: t('Success'),
                        message: `Successfully deleted ${missionToDelete}`,
                        icon: <IconCheck/>,
                        color: 'green',
                    })
                    get_missions();
                }
            }).catch(err => {
                notifications.show({
                    title: t('Failed to delete mission'),
                    message: err.response.data.error,
                    icon: <IconX/>,
                    color: 'red',
                })
        })
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

    useEffect(() => {
        get_missions();
    }, [activePage]);

    useEffect(() => {
        if (showInvite) {
            get_euds();
        }
    }, [showInvite]);

    useEffect(() => {
        get_euds();
        getAllGroups();
    }, [showAddMission]);

    function add_mission() {
        axios.post(apiRoutes.missions,
            {
                name: missionProperties.name,
                description: missionProperties.description,
                tool: missionProperties.tool,
                default_role: missionProperties.default_role,
                password: missionProperties.password,
                creator_uid: missionProperties.creator_uid,
                groups,
            }).then(r => {
                if (r.status === 200) {
                    setShowAddMission(false);
                    get_missions();
                    notifications.show({
                        title: t('Success'),
                        message: `Successfully added mission ${missionProperties.name}`,
                        icon: <IconCheck/>,
                        color: 'green',
                    })
                }
                setMissionProperties({
                    name: '',
                    description: '',
                    creator_uid: '',
                    default_role: 'MISSION_SUBSCRIBER',
                    password: '',
                    hash_tags: '',
                    tool: 'public',
                })
                setGroups([]);
        }).catch(err => {
            setShowAddMission(false);
            notifications.show({
                title: t('Failed to add mission'),
                message: err.response.data.error,
                icon: <IconX/>,
                color: 'red',
            })
            setMissionProperties({
                name: '',
                description: '',
                creator_uid: '',
                default_role: 'MISSION_SUBSCRIBER',
                password: '',
                hash_tags: '',
                tool: 'public',
            })
        })
    }

    function getAllGroups() {
        axios.get(apiRoutes.allGroups).then(r => {
            console.log(r);
            if (r.status === 200) {
                "".toLowerCase()
                const all_groups: ComboboxItem[] = [];
                r.data.map((row: any) => {
                    all_groups.push({value: '' + row.id, label: row.name});
                });
                setAllGroups(all_groups);
            }
        }).catch(err => {
            console.log(err);
            notifications.show({
                title: t('Failed to get group list'),
                message: err.response.data.error,
                icon: <IconX />,
                color: 'red',
            })
        });
    }

    return (
        <>
            <Modal opened={showQrCode} onClose={() => setShowQrCode(false)} title={qrTitle}>
                <Center>
                    <Paper p="md" shadow="xl" withBorder bg="white">
                        <QRCode value={qrContent} size={350} quietZone={10} logoImage={Logo} eyeRadius={50} ecLevel="L" qrStyle="dots" logoWidth={100} logoHeight={100} />
                    </Paper>
                </Center>
            </Modal>
            <Modal opened={showInvite} onClose={() => setShowInvite(false)} title={`Invite EUD to ${inviteMission}`}>
                <Select
                    placeholder={t("Search")}
                    searchable
                    nothingFoundMessage={t("Nothing found...")}
                    label={t("Callsign")}
                    onChange={(value, option) => {setInviteEud(option);}}
                    data={callsigns}
                    allowDeselect={false}
                    mb="md" />
                {(localStorage.getItem('administrator') !== 'true') ?
                    <PasswordInput disabled={!inviteMissionPasswordProtected} label={t("Password")} onChange={e => { setInviteMissionPassword(e.target.value); }} mb="md" />
                    : ''
                }
                <Button onClick={() => {setInviting(true); send_invitation();}} loading={inviting}>Invite</Button>
            </Modal>
            <Modal opened={deleteMissionOpen} onClose={() => setDeleteMissionOpen(false)} title={`Are you sure you want to delete ${missionToDelete}?`}>
                <Center>
                    <Button mr="md" onClick={() => delete_mission()}>Yes</Button>
                    <Button onClick={() => setDeleteMissionOpen(false)}>No</Button>
                </Center>
            </Modal>
            <Modal opened={showAddMission} onClose={() => {setShowAddMission(false);}} title={addEditTitle}>
                <TextInput defaultValue={missionProperties.name} required placeholder={t("Mission")} label={t("Name")} onChange={e => { missionProperties.name = e.target.value; }} mb="md" />
                <TextInput defaultValue={missionProperties.description} placeholder={t("Description")} label={t("Description")} onChange={e => { missionProperties.description = e.target.value; }} mb="md" />
                <MultiSelect
                    pb="md"
                    placeholder={t("Search")}
                    searchable
                    clearable
                    nothingFoundMessage={t("Nothing found...")}
                    label={t("Groups")}
                    defaultValue={selectedGroups}
                    onChange={(value) => {setGroups(value)}}
                    data={allGroups} />
                <Select
                    required
                    label={t("Default Role")}
                    onChange={e => { missionProperties.default_role = String(e); }}
                    data={[{value: 'MISSION_SUBSCRIBER', label: t('Subscriber')}, {value: 'MISSION_OWNER', label: t('Owner')}, {value: 'MISSION_READ_ONLY', label: t('Read Only')}]}
                    mb="md"
                    defaultValue={missionProperties.default_role || "MISSION_SUBSCRIBER"}
                    allowDeselect={false}
                />
                <Select
                    placeholder={t("Search")}
                    searchable
                    required
                    nothingFoundMessage={t("Nothing found...")}
                    label={t("Creator")}
                    description={t("The callsign of the EUD that owns this mission")}
                    onChange={(value, option) => {missionProperties.creator_uid = option.value;}}
                    data={callsigns}
                    defaultValue={missionProperties.creator_uid}
                    allowDeselect={false}
                    mb="md" />
                <PasswordInput defaultValue={missionProperties.password} label={t("Password")} onChange={e => { missionProperties.password = e.target.value; }} mb="md" />
                <Button onClick={() => {add_mission()}}>{addEditTitle}</Button>
            </Modal>
            <Button leftSection={<IconPlus size={14} />} onClick={() => {
                setShowAddMission(true);
                setMissionProperties({
                    name: "",
                    description: "",
                    creator_uid: "",
                    tool: "",
                    default_role: "MISSION_SUBSCRIBER",
                    password: "",
                    hash_tags: ""
                })
                setSelectedGroups([]);
            }} mr="md">{t("New Mission")}</Button>
            <Table.ScrollContainer minWidth="100%">
                <Table data={missions} stripedColor={computedColorScheme === 'light' ? 'gray.2' : 'dark.8'} highlightOnHoverColor={computedColorScheme === 'light' ? 'gray.4' : 'dark.6'} striped="odd" highlightOnHover withTableBorder mt="md" mb="md" />
            </Table.ScrollContainer>
            <Center><Pagination total={totalPages} value={activePage} onChange={setPage} withEdges /></Center>
        </>
    )
}
