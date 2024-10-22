import {
    Button,
    Center, Combobox, ComboboxData, ComboboxItem, CopyButton, Modal, NumberInput,
    Pagination, Select, Switch,
    Table,
    TableData, TextInput, Tooltip,
    useComputedColorScheme,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import {apiRoutes} from "@/apiRoutes.tsx";
import {IconCircleMinus, IconQrcode, IconMail, IconCheck, IconX} from "@tabler/icons-react";
import QRCode from "react-qr-code";

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
    const [inviteEud, setInviteEud] = useState<ComboboxItem | null>()
    const [callsigns, setCallsigns] = useState<ComboboxItem[]>([]);
    const [inviting, setInviting] = useState(false);
    const [missions, setMissions] = useState<TableData>({
        caption: '',
        head: ['Name', 'Description', 'Default Role', 'Creation Time', 'Expiration', 'Password Protected'],
        body: [],
    });

    function send_invitation() {
        if (inviteEud) {
            axios.post(apiRoutes.mission_invite, {
                mission_name: inviteMission, uid: inviteEud.value
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
                    title: 'Error',
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
                        head: ['Name', 'Description', 'Default Role', 'Creation Time', 'Password Protected'],
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
                                disabled={(row.passwordProtected && localStorage.getItem('administrator') !== 'true')}
                                onClick={() => {
                                    setShowInvite(true);
                                    setInviteMission(row.name);
                                }}>Invite</Button>

                            const delete_button = <Button
                                onClick={() => {
                                    setMissionToDelete(row.name);
                                    setDeleteMissionOpen(true);
                                }}
                                disabled={localStorage.getItem('administrator') !== 'true'}
                                key={`${row.name}_delete`}
                                rightSection={<IconCircleMinus size={14} />}
                            >Delete
                            </Button>;

                            tableData.body.push([row.name, row.description, row.defaultRole.type, row.createTime, password_protected, invitation_button, qrButton, delete_button]);
                        }
                    });
                    setPage(r.data.current_page);
                    setTotalPages(r.data.total_pages);
                    setMissions(tableData);
                }
            })
    }

    useEffect(() => {
        get_missions();
    }, []);

    useEffect(() => {
        if (showInvite) {
            axios.get(apiRoutes.eud, {params: {'per_page': 200}})
                .then(r => {
                    if (r.status === 200) {
                        const all_callsigns: ComboboxItem[] = []
                        r.data.results.map((row:any) => {
                            all_callsigns.push({value: row.uid, label: row.callsign});
                        });
                        setCallsigns(all_callsigns);
                    }
                })
        }
    }, [showInvite]);

    return (
        <>
            <Modal opened={showQrCode} onClose={() => setShowQrCode(false)} title={qrTitle}>
                <Center><QRCode value={qrContent} /></Center>
            </Modal>
            <Modal opened={showInvite} onClose={() => setShowInvite(false)} title={`Invite EUD to ${inviteMission}`}>
                <Select placeholder="Search" searchable nothingFoundMessage="Nothing found..." label="Callsign" onChange={(value, option) => {setInviteEud(option);}} data={callsigns} mb="md" />
                <Button onClick={() => {setInviting(true); send_invitation();}} loading={inviting}>Invite</Button>
            </Modal>
            <Table.ScrollContainer minWidth="100%">
                <Table data={missions} stripedColor={computedColorScheme === 'light' ? 'gray.2' : 'dark.8'} highlightOnHoverColor={computedColorScheme === 'light' ? 'gray.4' : 'dark.6'} striped="odd" highlightOnHover withTableBorder mt="md" mb="md" />
            </Table.ScrollContainer>
            <Center><Pagination total={totalPages} value={activePage} onChange={setPage} withEdges /></Center>
        </>
    )
}
