import {
    Button,
    Center, ComboboxData, ComboboxItem, CopyButton, Modal, NumberInput,
    Pagination, Select, Switch,
    Table,
    TableData, TextInput, Tooltip,
    useComputedColorScheme,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import {apiRoutes} from "@/apiRoutes.tsx";
import {IconCircleMinus, IconQrcode, IconMail} from "@tabler/icons-react";
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
    const [inviteCallsign, setInviteCallsign] = useState('')
    const [callsigns, setCallsigns] = useState<ComboboxItem[]>([]);
    const [missions, setMissions] = useState<TableData>({
        caption: '',
        head: ['Name', 'Description', 'Default Role', 'Creation Time', 'Invite Only', 'Expiration', 'Password Protected', 'Group'],
        body: [],
    });

    function get_missions() {
        axios.get(apiRoutes.missions, { params: {page: activePage} })
            .then((r) => {
                if (r.status === 200) {
                    const tableData: TableData = {
                        caption: '',
                        head: ['Name', 'Description', 'Default Role', 'Creation Time', 'Invite Only', 'Expiration', 'Password Protected', 'Group'],
                        body: [],
                    }

                    r.data.results.map((row: any) => {
                        if (tableData.body !== undefined) {
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
                                }}>Invite</Button>

                            const delete_button = <Button
                                onClick={() => {
                                    setMissionToDelete(row.name);
                                    setDeleteMissionOpen(true);
                                }}
                                key={`${row.name}_delete`}
                                rightSection={<IconCircleMinus size={14} />}
                            >Delete
                            </Button>;

                            tableData.body.push([row.name, row.description, row.defaultRole.type, row.createTime, row.inviteOnly, row.expiration, row.passwordProtected, row.group, invitation_button, qrButton, delete_button]);
                        }
                    });
                    setPage(r.data.current_page);
                    setTotalPages(r.data.total_pages);
                    setMissions(tableData);
                }
            })
    }

    function sendInvitation() {

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
                <Select placeholder="Search" searchable nothingFoundMessage="Nothing found..." label="Callsign" onChange={(value, option) => {console.log(option); setInviteCallsign(String(value));}} data={callsigns} mb="md" />
                <Button onClick={() => sendInvitation()}>Invite</Button>
            </Modal>
            <Table.ScrollContainer minWidth="100%">
                <Table data={missions} stripedColor={computedColorScheme === 'light' ? 'gray.2' : 'dark.8'} highlightOnHoverColor={computedColorScheme === 'light' ? 'gray.4' : 'dark.6'} striped="odd" highlightOnHover withTableBorder mt="md" mb="md" />
            </Table.ScrollContainer>
        </>
    )
}
