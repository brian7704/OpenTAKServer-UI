import {
    Button,
    Center, CopyButton, Modal, NumberInput,
    Pagination, Paper, Select, Switch,
    Table,
    TextInput, Tooltip,
    useComputedColorScheme,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import React, { useEffect, useState } from 'react';
import { IconCircleMinus, IconX, IconCheck, IconQrcode, IconPlus, IconReload, IconCopy } from '@tabler/icons-react';
import { QRCode } from 'react-qrcode-logo';
import axios from '@/axios_config';
import { apiRoutes } from '@/apiRoutes';
import Logo from "@/images/ots-logo.png";
import {t} from "i18next";
import { DataTable, type DataTableSortStatus } from 'mantine-datatable';

interface MeshtasticChannel {
    name: string;
    psk: string;
    uplink_enabled: boolean;
    downlink_enabled: boolean;
    position_precision: number;
    lora_region: string;
    lora_hop_limit: number;
    lora_tx_enabled: boolean;
    lora_tx_power: number;
    lora_sx126x_rx_boosted_gain: boolean;
    modem_preset: string;
    url: string;
    delete_button: React.ReactNode | null;
    qr_button: React.ReactNode | null;
    psk_button: React.ReactNode | null;
    uplink_enabled_icon: React.ReactNode | null;
    downlink_enabled_icon: React.ReactNode | null;
    tx_enabled_icon: React.ReactNode | null;
    lora_sx126x_rx_boosted_gain_icon: React.ReactNode | null;
    url_button: React.ReactNode | null;
}

export default function Meshtastic() {
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const [activePage, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [channelCount, setChannelCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [showQrCode, setShowQrCode] = useState(false);
    const [qrTitle, setQrTitle] = useState('');
    const [channelUrl, setChannelUrl] = useState('');
    const [channelToDelete, setChannelToDelete] = useState('');
    const [deleteChannelOpen, setDeleteChanelOpen] = useState(false);
    const [channelNameError, setChannelNameError] = useState('');
    const [showAddChannel, setShowAddChannel] = useState(false);
    const [showNewChannel, setShowNewChannel] = useState(false);
    const [psk, setPsk] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus<MeshtasticChannel>>({
        columnAccessor: 'name',
        direction: 'asc',
    });
    const [channelProperties, setChannelProperties] = useState<MeshtasticChannel>({
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
        url: '',
        delete_button: null,
        qr_button: null,
        psk_button: null,
        uplink_enabled_icon: null,
        downlink_enabled_icon: null,
        tx_enabled_icon: null,
        lora_sx126x_rx_boosted_gain_icon: null,
        url_button: null
    });
    const [channels, setChannels] = useState<MeshtasticChannel[]>([]);

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
            setChannelNameError(t('Name cannot be blank'));
        } else {
            channelProperties.psk = psk;
            axios.post(
                apiRoutes.meshtasticChannels,
                { ...channelProperties }
            ).then(r => {
                if (r.status === 200) {
                    getChannels();
                    notifications.show({
                        message: t('Successfully added channel'),
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
                        url: '',
                        delete_button: null,
                        qr_button: null,
                        psk_button: null,
                        uplink_enabled_icon: null,
                        downlink_enabled_icon: null,
                        tx_enabled_icon: null,
                        lora_sx126x_rx_boosted_gain_icon: null,
                        url_button: null
                    });
                }
            }).catch(err => {
                console.log(err);
                notifications.show({
                    title: t('Failed to add channel'),
                    message: err.response.data.error,
                    icon: <IconX />,
                    color: 'red',
                });
            });
        }
    }

    useEffect(() => {
        getChannels();
    }, [activePage, sortStatus]);

    useEffect(() => {
        setPage(1);
        getChannels();
    }, [pageSize]);

    function addChannelByUrl(e:any) {
        e.preventDefault();
        axios.post(
            apiRoutes.meshtasticChannels,
            { url: channelUrl }
        ).then(r => {
            if (r.status === 200) {
                notifications.show({
                    message: t('Successfully added channel'),
                    icon: <IconCheck />,
                    color: 'green',
                });
                setShowAddChannel(false);
                getChannels();
            }
        }).catch(err => {
            console.log(err);
            notifications.show({
                title: t('Failed to add channel'),
                message: err.response.data.error,
                color: 'red',
                icon: <IconX />,
            });
        });
    }

    function getChannels() {
        setLoading(true);
        axios.get(
            apiRoutes.meshtasticChannels,
            { params: { page: activePage, per_page: pageSize, sort_by: sortStatus.columnAccessor, sort_direction: sortStatus.direction}}
        ).then(r => {
            setLoading(false);
            if (r.status === 200) {
                setChannelCount(r.data.total);
                let rows: MeshtasticChannel[] = [];

                r.data.results.map((row: MeshtasticChannel) => {

                    row.qr_button = <Button
                      onClick={() => {
                            setShowQrCode(true);
                            setChannelUrl(row.url);
                            setQrTitle(row.name);
                        }}
                    ><IconQrcode size={14} /></Button>;

                    row.delete_button = <Button
                      onClick={() => {
                            setChannelToDelete(row.url);
                            setDeleteChanelOpen(true);
                        }}
                      key={`${row.name}_delete`}
                      color="red"
                    ><IconCircleMinus size={14} /></Button>;

                    row.uplink_enabled_icon = row.uplink_enabled ? <IconCheck color="green" /> : <IconX color="red" />;
                    row.downlink_enabled_icon = row.downlink_enabled ? <IconCheck color="green" /> : <IconX color="red" />;
                    row.tx_enabled_icon = row.lora_tx_enabled ? <IconCheck color="green" /> : <IconX color="red" />;
                    row.lora_sx126x_rx_boosted_gain_icon = row.lora_sx126x_rx_boosted_gain ? <IconCheck color="green" /> : <IconX color="red" />;
                    row.url_button = <CopyButton value={row.url}>{({ copied, copy }) => (
                                            <Tooltip label={row.url}>
                                                <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                                                    {copied ? t('Copied URL') : <IconCopy size={14} />}
                                                </Button>
                                            </Tooltip>
                                            )}
                                </CopyButton>;


                    if (row.psk) {
                        row.psk_button = <CopyButton value={row.psk}>{({ copied, copy }) => (
                                <Tooltip label={row.psk}>
                                    <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                                        {copied ? t('Copied PSK') : <IconCopy size={14} />}
                                    </Button>
                                </Tooltip>
                                )}
                                     </CopyButton>;
                    } else {
                        row.psk_button = <Button disabled>Encryption Disabled</Button>;
                    }

                    rows.push(row);
                });

                setPage(r.data.current_page);
                setTotalPages(r.data.total_pages);
                setChannels(rows);
            }
        }).catch(err => {
            setLoading(false);
            notifications.show({
                title: t('Error getting channel list'),
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
                message: t('Channel successfully deleted'),
                icon: <IconCheck />,
                color: 'green',
            });
            setDeleteChanelOpen(false);
            getChannels();
        }).catch(err => {
            console.log(err);
            notifications.show({
                title: t('Failed to delete channel'),
                message: err.response.data.error,
                icon: <IconX />,
                color: 'red',
            });
        });
    }

    return (
        <>
            <Modal opened={showQrCode} onClose={() => setShowQrCode(false)} title={qrTitle}>
                <Center>
                    <Paper p="md" shadow="xl" withBorder bg="white">
                        <QRCode value={channelUrl} size={350} quietZone={10} logoImage={Logo} eyeRadius={50} ecLevel="L" qrStyle="dots" logoWidth={100} logoHeight={100} />
                    </Paper>
                </Center>
            </Modal>
            <Modal opened={deleteChannelOpen} onClose={() => setDeleteChanelOpen(false)} title={t("Are you sure you want to delete this channel?")}>
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
            <Modal opened={showAddChannel} onClose={() => setShowAddChannel(false)} title={t("Add Existing Channel")}>
                <TextInput required placeholder="https://meshtastic.org/e/#CgMSAQESDAgBOAFAA0gBUB5oAQ==" label={t("URL")} onChange={e => { setChannelUrl(e.target.value); }} mb="md" />
                <Button onClick={e => addChannelByUrl(e)}>{t("Add Channel")}</Button>
            </Modal>
            <Modal opened={showNewChannel} onClose={() => setShowNewChannel(false)} title={t("Add New Channel")}>
                <TextInput required label={t("Name")} onChange={e => { channelProperties.name = e.target.value; setChannelNameError(''); }} mb="md" error={channelNameError} />
                <TextInput label={t("PSK")} value={psk} rightSection={<IconReload onClick={() => generatePsk()} />} mb="md" onChange={(e) => setPsk(e.target.value)} />
                <Switch label={t("Uplink Enabled")} onChange={e => { channelProperties.uplink_enabled = e.target.checked; }} mb="md" />
                <Switch label={t("Downlink Enabled")} onChange={e => { channelProperties.downlink_enabled = e.target.checked; }} mb="md" />
                <NumberInput label={t("Position Precision")} min={0} max={32} defaultValue={channelProperties.position_precision} onChange={e => { channelProperties.position_precision = Number(e); }} mb="md" />
                <Select
                  label={t("Region")}
                  onChange={e => { channelProperties.lora_region = String(e); }}
                  data={['UNSET', 'US', 'EU_433', 'EU_868', 'CN', 'JP', 'ANZ', 'KR', 'TW', 'RU', 'IN', 'NZ_865', 'TH', 'LORA_24', 'UA_433', 'UA_868', 'MY_433', 'SG_923']}
                  mb="md"
                  defaultValue="UNSET"
                />
                <NumberInput label={t("Hop Limit")} min={0} max={10} defaultValue={channelProperties.lora_hop_limit} onChange={e => { channelProperties.lora_hop_limit = Number(e); }} mb="md" />
                <Switch label={t("TX Enabled")} onChange={e => { channelProperties.lora_tx_enabled = e.target.checked; }} mb="md" />
                <NumberInput label={t("TX Power")} min={0} max={100} defaultValue={channelProperties.lora_tx_power} onChange={e => { channelProperties.lora_tx_power = Number(e); }} mb="md" />
                <Switch label={t("RX Boost Gain")} onChange={e => { channelProperties.lora_sx126x_rx_boosted_gain = e.target.checked; }} mb="md" />
                <Select
                  label={t("Modem Preset")}
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
                >{t("Add Channel")}
                </Button>
            </Modal>
            <Button leftSection={<IconPlus size={14} />} onClick={() => setShowAddChannel(true)} mr="md">{t("Add Existing Channel")}</Button>
            <Button leftSection={<IconPlus size={14} />} onClick={() => setShowNewChannel(true)}>{t("Add New Channel")}</Button>
            <Table.ScrollContainer minWidth="100%" mt="md">
                <DataTable
                    withTableBorder
                    borderRadius="md"
                    shadow="sm"
                    striped
                    highlightOnHover
                    records={channels}
                    columns={[{accessor: "name", title: t("Name"), sortable: true}, {accessor: "psk_button", title: t("PSK")},
                        {accessor: "uplink_enabled_icon", title: t("Uplink Enabled"), sortable: true}, {accessor: "downlink_enabled_icon", title: t("Downlink Enabled"), sortable: true},
                        {accessor: "position_precision", title: t("Position Precision"), sortable: true}, {accessor: "lora_region", title: t("LoRa Region"), sortable: true},
                        {accessor: "lora_hop_limit", title: t("Hop Limit"), sortable: true}, {accessor: "tx_enabled_icon", title: t("TX Enabled"), sortable: true},
                        {accessor: "lora_tx_power", title: t("TX Power"), sortable: true}, {accessor: "lora_sx126x_rx_boosted_gain_icon", title: t("RX Gain Boost"), sortable: true},
                        {accessor: "modem_preset", title: t("Modem Preset"), sortable: true}, {accessor: "url_button", title: t("Copy URL")}, {accessor: "qr_button", title: t("QR Code")},
                        {accessor: "delete_button", title: t("Delete")}
                    ]}
                    page={activePage}
                    onPageChange={(p) => setPage(p)}
                    onRecordsPerPageChange={setPageSize}
                    totalRecords={channelCount}
                    recordsPerPage={pageSize}
                    recordsPerPageOptions={[10, 15, 20, 25, 30, 35, 40, 45, 50]}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    fetching={loading}
                    minHeight={180}
                />
            </Table.ScrollContainer>
        </>
    );
}
