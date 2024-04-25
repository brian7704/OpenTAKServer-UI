import {
    Button,
    Center,
    Modal,
    Pagination,
    Table,
    Text,
    TableData, TextInput, useComputedColorScheme,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import React, { useEffect, useState } from 'react';
import { IconCircleMinus, IconX, IconCheck, IconQrcode, IconPlus} from '@tabler/icons-react';
import QRCode from 'react-qr-code';
import axios from '@/axios_config';
import { apiRoutes } from '@/apiRoutes';

export default function Meshtastic() {
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const [activePage, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showQrCode, setShowQrCode] = useState(false);
    const [qrTitle, setQrTitle] = useState('');
    const [channelUrl, setChannelUrl] = useState('');
    const [channelToDelete, setChannelToDelete] = useState('');
    const [deleteChannelOpen, setDeleteChanelOpen] = useState(false);
    const [channels, setChannels] = useState<TableData>({
        caption: '',
        head: ['Name', 'PSK', 'Uplink Enabled', 'Downlink Enabled', 'Position Precision', 'LoRa Region', 'Hop Limit', 'TX Enabled', 'TX Power', 'RX Gain Boost', 'Modem Preset', 'URL'],
        body: [],
    });

    function getChannels() {
        axios.get(
            apiRoutes.meshtasticChannels,
            { params: {
                    page: activePage,
                } }
        ).then(r => {
            if (r.status === 200) {
                const tableData: TableData = {
                    caption: '',
                    head: ['Name', 'PSK', 'Uplink Enabled', 'Downlink Enabled', 'Position Precision', 'LoRa Region', 'Hop Limit', 'TX Enabled', 'TX Power', 'RX Gain Boost', 'Modem Preset', 'URL'],
                    body: [],
                };

                r.data.results.map((row: any) => {
                    if (tableData.body !== undefined) {
                        const qrButton = <Button
                          rightSection={<IconQrcode size={14} />}
                          onClick={() => {
                                setShowQrCode(true);
                                setChannelUrl(row.url);
                                setQrTitle(row.name);
                            }}
                        >QR Code
                                         </Button>;

                        const delete_button = <Button
                          onClick={() => {
                                setChannelToDelete(row.id);
                                setDeleteChanelOpen(true);
                            }}
                          key={`${row.hash}_delete`}
                          rightSection={<IconCircleMinus size={14} />}
                        >Delete
                                              </Button>;

                        const uplink_enabled = row.upload_enabled ? <IconCheck color="green" /> : <IconX color="red" />;
                        const downlink_enabled = row.download_enabled ? <IconCheck color="green" /> : <IconX color="red" />;
                        let preset;
                        switch (row.lora_preset) {
                            case 0:
                                preset = 'Long/Fast';
                                break;
                            case 1:
                                preset = 'Long/Slow';
                                break;
                            case 2:
                                preset = 'Very Long/Slow';
                                break;
                            case 3:
                                preset = 'Medium/Slow';
                                break;
                            case 4:
                                preset = 'Medium/Fast';
                                break;
                            case 5:
                                preset = 'Short/Slow';
                                break;
                            case 6:
                                preset = 'Short/Fast';
                                break;
                            case 7:
                                preset = 'Long/Moderate';
                                break;
                        }

                        tableData.body.push([row.name, row.psk, uplink_enabled, downlink_enabled,
                            row.position_precision, row.lora_region, row.lora_hop_limit, row.lora_tx_enabled,
                            row.lora_tx_power, row.lora_sx126x_rx_boosted_gain, preset, row.url,
                            qrButton, delete_button,
                        ]);
                    }

                    setPage(r.data.current_page);
                    setTotalPages(r.data.total_pages);
                    setChannels(tableData);
                });
            }
        }).catch(err => {
            notifications.show({
                title: 'Error getting channel list',
                message: err.response.data.error,
                color: 'red',
                icon: <IconX />,
            });
        });
    }

    return (
        <>
            <Button leftSection={<IconPlus size={14} />}>Add Channel</Button>
            <Table.ScrollContainer minWidth="100%">
                <Table data={channels} stripedColor={computedColorScheme === 'light' ? 'gray.2' : 'dark.8'} highlightOnHoverColor={computedColorScheme === 'light' ? 'gray.4' : 'dark.6'} striped="odd" highlightOnHover withTableBorder mt="md" mb="md" />
            </Table.ScrollContainer>
            <Center><Pagination total={totalPages} value={activePage} onChange={setPage} withEdges /></Center>
        </>
    );
}
