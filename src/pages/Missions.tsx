import {
    Button,
    Center, ComboboxItem, Modal,
    Pagination, Paper, PasswordInput, Select,
    Table,
    TableData, TextInput,
    useComputedColorScheme,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import {apiRoutes} from "@/apiRoutes.tsx";
import {IconCircleMinus, IconQrcode, IconMail, IconCheck, IconX, IconPlus} from "@tabler/icons-react";
import { QRCode } from 'react-qrcode-logo';
import Logo from "@/images/ots-logo.png";

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
    const [missionProperties, setMissionProperties] = useState({
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
        head: ['Name', 'Description', 'Owner', 'Default Role', 'Tool', 'Creation Time', 'Expiration', 'Password Protected'],
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
                        title: 'Success',
                        message: `Successfully invited ${inviteEud.label}`,
                        icon: <IconCheck/>,
                        color: 'green',
                    })
                }
            }).catch(err => {
                console.log(err);
                setInviting(false);
                notifications.show({
                    title: 'Failed to send mission invitation',
                    message: err.response.data.error,
                    icon: <IconX/>,
                    color: 'red',
                })
            })
        }
    }

    function get_missions() {
        axios.get(apiRoutes.missions, { params: {page: activePage} })
            .then((r) => {
                if (r.status === 200) {
                    const tableData: TableData = {
                        caption: '',
                        head: ['Name', 'Description', 'Owner', 'Default Role', 'Tool', 'Creation Time', 'Password Protected'],
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
                            >QR Code
                            </Button>;

                            const invitation_button = <Button
                                rightSection={<IconMail size={14} /> }
                                onClick={() => {
                                    setShowInvite(true);
                                    setInviteMission(row.name);
                                    setInviteMissionPasswordProtected(row.passwordProtected)
                                }}>Invite</Button>

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

                            tableData.body.push([row.name, row.description, row.owner.callsign, row.defaultRole.type, row.tool, row.createTime, password_protected, invitation_button, qrButton, delete_button]);
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
                        title: 'Success',
                        message: `Successfully deleted ${missionToDelete}`,
                        icon: <IconCheck/>,
                        color: 'green',
                    })
                    get_missions();
                }
            }).catch(err => {
                notifications.show({
                    title: 'Failed to delete mission',
                    message: err.response.data.error,
                    icon: <IconX/>,
                    color: 'red',
                })
        })
    }

    function get_euds() {
        axios.get(apiRoutes.eud, {params: {'per_page': 200}})
            .then(r => {
                if (r.status === 200) {
                    const all_callsigns: ComboboxItem[] = []
                    r.data.results.map((row:any) => {
                        if (row.callsign) {
                            all_callsigns.push({value: row.uid, label: row.callsign});
                        }
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
            }).then(r => {
                if (r.status === 200) {
                    setShowAddMission(false);
                    get_missions();
                    notifications.show({
                        title: 'Success',
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
                    tool: 'public'
                })
        }).catch(err => {
            setShowAddMission(false);
            notifications.show({
                title: 'Failed to add mission',
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
                tool: 'public'
            })
        })
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
                    placeholder="Search"
                    searchable
                    nothingFoundMessage="Nothing found..."
                    label="Callsign"
                    onChange={(value, option) => {setInviteEud(option);}}
                    data={callsigns}
                    allowDeselect={false}
                    mb="md" />
                {(localStorage.getItem('administrator') !== 'true') ?
                    <PasswordInput disabled={!inviteMissionPasswordProtected} label="Password" onChange={e => { setInviteMissionPassword(e.target.value); }} mb="md" />
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
            <Modal opened={showAddMission} onClose={() => setShowAddMission(false)} title="Add Mission">
                <TextInput required placeholder="Mission" label="Name" onChange={e => { missionProperties.name = e.target.value; }} mb="md" />
                <TextInput placeholder="Description" label="Description" onChange={e => { missionProperties.description = e.target.value; }} mb="md" />
                <Select
                    required
                    label="Default Role"
                    onChange={e => { missionProperties.default_role = String(e); }}
                    data={[{value: 'MISSION_SUBSCRIBER', label: 'Subscriber'}, {value: 'MISSION_OWNER', label: 'Owner'}, {value: 'MISSION_READ_ONLY', label: 'Read Only'}]}
                    mb="md"
                    defaultValue="MISSION_SUBSCRIBER"
                    allowDeselect={false}
                />
                <Select
                    placeholder="Search"
                    searchable
                    required
                    nothingFoundMessage="Nothing found..."
                    label="Creator"
                    description="The callsign of the EUD that owns this mission"
                    onChange={(value, option) => {missionProperties.creator_uid = option.value;}}
                    data={callsigns}
                    allowDeselect={false}
                    mb="md" />
                <PasswordInput label="Password" onChange={e => { missionProperties.password = e.target.value; }} mb="md" />
                <Button onClick={() => {add_mission()}}>Add Mission</Button>
            </Modal>
            <Button leftSection={<IconPlus size={14} />} onClick={() => setShowAddMission(true)} mr="md">New Mission</Button>
            <Table.ScrollContainer minWidth="100%">
                <Table data={missions} stripedColor={computedColorScheme === 'light' ? 'gray.2' : 'dark.8'} highlightOnHoverColor={computedColorScheme === 'light' ? 'gray.4' : 'dark.6'} striped="odd" highlightOnHover withTableBorder mt="md" mb="md" />
            </Table.ScrollContainer>
            <Center><Pagination total={totalPages} value={activePage} onChange={setPage} withEdges /></Center>
        </>
    )
}
