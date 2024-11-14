import {
    Button,
    Center, CopyButton, Modal, NumberInput,
    Pagination, Select, Switch,
    Table,
    TableData, TextInput, Tooltip,
    useComputedColorScheme,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import React, { useEffect, useState } from 'react';
import { IconCircleMinus, IconX, IconCheck, IconQrcode, IconPlus, IconReload } from '@tabler/icons-react';
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
    const [channelNameError, setChannelNameError] = useState('');
    const [showAddChannel, setShowAddChannel] = useState(false);
    const [showNewChannel, setShowNewChannel] = useState(false);
    const [psk, setPsk] = useState('');
    const [channelProperties, setChannelProperties] = useState({
        name: '',
        psk: '',
        uplink_enabled: false,
        downlink_enabled: false,
        position_precision: 32,
        lora_region: 'UNSET',
        lora_hop_limit: 3,
        lora_tx_enabled: false,
        lora_tx_power: 30,
        lora_sx126x_rx_boosted_gain: false,
        modem_preset: 'LONG_FAST',
    });
    const [channels, setChannels] = useState<TableData>({
        caption: '',
        head: ['Name', 'PSK', 'Uplink Enabled', 'Downlink Enabled', 'Position Precision', 'LoRa Region', 'Hop Limit', 'TX Enabled', 'TX Power', 'RX Gain Boost', 'Modem Preset'],
        body: [],
    });

    function generatePsk() {
        axios.get(
            apiRoutes.generateMeshtasticPsk
        ).then(r => {
            if (r.status === 200) {
                channelProperties.psk = r.data.psk;
                setPsk(r.data.psk);
            }
        });
    }

    function addChannel() {
        if (!channelProperties.name) {
            setChannelNameError('Name cannot be blank');
        } else {
            channelProperties.psk = psk;
            axios.post(
                apiRoutes.meshtasticChannels,
                { ...channelProperties }
            ).then(r => {
                if (r.status === 200) {
                    getChannels();
                    notifications.show({
                        message: 'Successfully added channel',
                        icon: <IconCheck />,
                        color: 'green',
                    });
                    setShowNewChannel(false);
                    setPsk('');
                    setChannelProperties({
                        name: '',
                        psk: '',
                        uplink_enabled: false,
                        downlink_enabled: false,
                        position_precision: 32,
                                                lora_region: 'UNSET',
                        lora_hop_limit: 3,
                        lora_tx_enabled: false,
                        lora_tx_power: 30,
                        lora_sx126x_rx_boosted_gain: false,
                        modem_preset: 'LONG_FAST',
                    });
                }
            }).catch(err => {
                console.log(err);
                notifications.show({
                    title: 'Failed to add channel',
                    message: err.response.data.error,
                    icon: <IconX />,
                    color: 'red',
                });
            });
        }
    }

    useEffect(() => {
        getChannels();
    }, [activePage]);

    function addChannelByUrl(e:any) {
        e.preventDefault();
        axios.post(
            apiRoutes.meshtasticChannels,
            { url: channelUrl }
        ).then(r => {
            if (r.status === 200) {
                notifications.show({
                    message: 'Successfully added channel',
                    icon: <IconCheck />,
                    color: 'green',
                });
                setShowAddChannel(false);
                getChannels();
            }
        }).catch(err => {
            console.log(err);
            notifications.show({
                title: 'Failed to add channel',
                message: err.response.data.error,
                color: 'red',
                icon: <IconX />,
            });
        });
    }

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
                    head: ['Name', 'PSK', 'Uplink Enabled', 'Downlink Enabled', 'Position Precision', 'LoRa Region', 'Hop Limit', 'TX Enabled', 'TX Power', 'RX Gain Boost', 'Modem Preset'],
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
                                setChannelToDelete(row.url);
                                setDeleteChanelOpen(true);
                            }}
                          key={`${row.hash}_delete`}
                          rightSection={<IconCircleMinus size={14} />}
                        >Delete
                                              </Button>;

                        const uplink_enabled = row.uplink_enabled ? <IconCheck color="green" /> : <IconX color="red" />;
                        const downlink_enabled = row.downlink_enabled ? <IconCheck color="green" /> : <IconX color="red" />;
                        const tx_enabled = row.lora_tx_enabled ? <IconCheck color="green" /> : <IconX color="red" />;
                        const lora_sx126x_rx_boosted_gain = row.lora_sx126x_rx_boosted_gain ? <IconCheck color="green" /> : <IconX color="red" />;
                        const url = <CopyButton value={row.url}>{({ copied, copy }) => (
                                                <Tooltip label={row.url}>
                                                    <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                                                        {copied ? 'Copied URL' : 'Copy URL'}
                                                    </Button>
                                                </Tooltip>
                                                )}
                                    </CopyButton>;

                        let psk_button;
                        if (row.psk) {
                            psk_button = <CopyButton value={row.psk}>{({ copied, copy }) => (
                                    <Tooltip label={row.psk}>
                                        <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                                            {copied ? 'Copied PSK' : 'Copy PSK'}
                                        </Button>
                                    </Tooltip>
                                    )}
                                         </CopyButton>;
                        } else {
                            psk_button = <Button disabled>Encryption Disabled</Button>;
                        }

                        tableData.body.push([row.name, psk_button, uplink_enabled, downlink_enabled,
                            row.position_precision, row.lora_region, row.lora_hop_limit, tx_enabled,
                            row.lora_tx_power, lora_sx126x_rx_boosted_gain, row.modem_preset, url,
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

    function deleteChannel() {
        axios.delete(
            apiRoutes.meshtasticChannels,
            { params: { url: channelToDelete } }
        ).then(r => {
            notifications.show({
                message: 'Channel successfully deleted',
                icon: <IconCheck />,
                color: 'green',
            });
            setDeleteChanelOpen(false);
            getChannels();
        }).catch(err => {
            console.log(err);
            notifications.show({
                title: 'Failed to delete channel',
                message: err.response.data.error,
                icon: <IconX />,
                color: 'red',
            });
        });
    }

    return (
        <>
            <Modal opened={showQrCode} onClose={() => setShowQrCode(false)} title={qrTitle}>
                <Center><QRCode value={channelUrl} /></Center>
            </Modal>
            <Modal opened={deleteChannelOpen} onClose={() => setDeleteChanelOpen(false)} title="Are you sure you want to delete this channel?">
                <Center>
                    <Button
                      mr="md"
                      onClick={() => {
                          deleteChannel();
                      }}
                    >Yes
                    </Button>
                    <Button onClick={() => setDeleteChanelOpen(false)}>No</Button>
                </Center>
            </Modal>
            <Modal opened={showAddChannel} onClose={() => setShowAddChannel(false)} title="Add Existing Channel">
                <TextInput required placeholder="https://meshtastic.org/e/#CgMSAQESDAgBOAFAA0gBUB5oAQ==" label="URL" onChange={e => { setChannelUrl(e.target.value); }} mb="md" />
                <Button onClick={e => addChannelByUrl(e)}>Add Channel</Button>
            </Modal>
            <Modal opened={showNewChannel} onClose={() => setShowNewChannel(false)} title="Add New Channel">
                <TextInput required label="Name" onChange={e => { channelProperties.name = e.target.value; setChannelNameError(''); }} mb="md" error={channelNameError} />
                <TextInput label="PSK" value={psk} rightSection={<IconReload onClick={() => generatePsk()} />} mb="md" onChange={(e) => setPsk(e.target.value)} />
                <Switch label="Uplink Enabled" onChange={e => { channelProperties.uplink_enabled = e.target.checked; }} mb="md" />
                <Switch label="Downlink Enabled" onChange={e => { channelProperties.downlink_enabled = e.target.checked; }} mb="md" />
                <NumberInput label="Position Precision" min={0} max={32} defaultValue={channelProperties.position_precision} onChange={e => { channelProperties.position_precision = Number(e); }} mb="md" />
                <Select
                  label="Region"
                  onChange={e => { channelProperties.lora_region = String(e); }}
                  data={['UNSET', 'US', 'EU_433', 'EU_868', 'CN', 'JP', 'ANZ', 'KR', 'TW', 'RU', 'IN', 'NZ_865', 'TH', 'LORA_24', 'UA_433', 'UA_868', 'MY_433', 'SG_923']}
                  mb="md"
                  defaultValue="UNSET"
                />
                <NumberInput label="Hop Limit" min={0} max={10} defaultValue={channelProperties.lora_hop_limit} onChange={e => { channelProperties.lora_hop_limit = Number(e); }} mb="md" />
                <Switch label="TX Enabled" onChange={e => { channelProperties.lora_tx_enabled = e.target.checked; }} mb="md" />
                <NumberInput label="TX Power" min={0} max={100} defaultValue={channelProperties.lora_tx_power} onChange={e => { channelProperties.lora_tx_power = Number(e); }} mb="md" />
                <Switch label="RX Boost Gain" onChange={e => { channelProperties.lora_sx126x_rx_boosted_gain = e.target.checked; }} mb="md" />
                <Select
                  label="Modem Preset"
                  onChange={e => { channelProperties.modem_preset = String(e); }}
                  data={['LONG_FAST', 'LONG_SLOW', 'VERY_LONG_SLOW', 'MEDIUM_SLOW', 'MEDIUM_FAST', 'SHORT_SLOW', 'SHORT_FAST', 'LONG_MODERATE', 'SHORT_TURBO']}
                  mb="md"
                  defaultValue="LONG_FAST"
                />
                <Button
                  mb="md"
                  onClick={e => {
                    addChannel();
                }}
                >Add Channel
                </Button>
            </Modal>
            <Button leftSection={<IconPlus size={14} />} onClick={() => setShowAddChannel(true)} mr="md">Add Existing Channel</Button>
            <Button leftSection={<IconPlus size={14} />} onClick={() => setShowNewChannel(true)}>Add New Channel</Button>
            <Table.ScrollContainer minWidth="100%">
                <Table data={channels} stripedColor={computedColorScheme === 'light' ? 'gray.2' : 'dark.8'} highlightOnHoverColor={computedColorScheme === 'light' ? 'gray.4' : 'dark.6'} striped="odd" highlightOnHover withTableBorder mt="md" mb="md" />
            </Table.ScrollContainer>
            <Center><Pagination total={totalPages} value={activePage} onChange={setPage} withEdges /></Center>
        </>
    );
}
