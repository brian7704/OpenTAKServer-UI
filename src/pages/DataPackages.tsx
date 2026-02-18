import {
    Button,
    Center,
    FileButton, Modal,
    Pagination,
    Table,
    Switch,
    TableData, useComputedColorScheme, Paper,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import React, { useEffect, useState } from 'react';
import { IconDownload, IconCircleMinus, IconX, IconCheck, IconQrcode } from '@tabler/icons-react';
import { QRCode } from 'react-qrcode-logo';
import axios from '@/axios_config';
import { apiRoutes } from '@/apiRoutes';
import bytes_formatter from '@/bytes_formatter';
import Logo from "@/images/ots-logo.png";
import {t} from "i18next";
import { DataTable, type DataTableSortStatus } from 'mantine-datatable';

interface DataPackage {
    filename: string;
    creator_uid: string;
    expiration: string;
    hash: string;
    keywords: string;
    mime_type: string;
    size: number;
    formatted_size: string;
    submission_time: string;
    submission_user: string;
    tool: string;
    install_on_enrollment: boolean;
    install_on_connection: boolean;
    callsign: string;
    eud: {
        callsign: string;
    }
    download_button: React.ReactNode;
    delete_button: React.ReactNode;
    qr_button: React.ReactNode;
    install_on_enrollment_switch: React.ReactNode;
    install_on_connection_switch: React.ReactNode;
}

export default function DataPackages() {
    const [dataPackages, setDataPackages] = useState<DataPackage[]>([]);
    const [dataPackageCount, setDataPackageCount] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [activePage, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const [deleteDataPackageOpen, setDeleteDataPackageOpen] = useState(false);
    const [dataPackageToDelete, setDataPackageToDelete] = useState('');
    const [generatingDataPackage, setGeneratingDataPackage] = useState(false);
    const [showQrCode, setShowQrCode] = useState(false);
    const [qrLink, setQrLink] = useState('');
    const [qrHash, setQrHash] = useState('')
    const [qrTitle, setQrTitle] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus<DataPackage>>({
        columnAccessor: 'filename',
        direction: 'asc',
    });

    useEffect(() => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            axios.post(apiRoutes.data_packages, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => {
                if (r.status === 200) {
                    getDatapackages();
                    notifications.show({
                        title: t('Success'),
                        message: t('Data package successfully uploaded'),
                        icon: <IconCheck />,
                        color: 'green',
                    });
                } else {
                    notifications.show({
                        title: t('Failed to upload data package'),
                        message: r.data.error,
                        icon: <IconX />,
                        color: 'red',
                    });
                }
            }).catch(err => {
                notifications.show({
                    title: t('Failed to upload data package'),
                    message: err.response.data.error,
                    icon: <IconX />,
                    color: 'red',
                });
            });
        }
    }, [file]);

    useEffect(() => {
        setPage(1);
        getDatapackages();
    }, [pageSize]);

    useEffect(() => {
        getDatapackages();
    }, [activePage, sortStatus]);

    function deleteDataPackage() {
        axios.delete(apiRoutes.deleteDataPackage,
            { params: {
                    hash: dataPackageToDelete,
                } }).then(r => {
                    if (r.status === 200) {
                        getDatapackages();
                        notifications.show({
                            title: t('Success'),
                            message: t('Successfully deleted data package'),
                            icon: <IconCheck />,
                            color: 'green',
                        });
                    } else {
                        notifications.show({
                            title: t('Delete Failed'),
                            message: r.data.error,
                            icon: <IconX />,
                            autoClose: false,
                            color: 'red',
                        });
                    }
        }).catch(err => {
            console.log(err);
            notifications.show({
                title: t('Delete Failed'),
                message: err.response.data.error,
                icon: <IconX />,
                autoClose: false,
                color: 'red',
            });
        });
    }

    function updateDataPackage(hash: string, install_on_enrollment: boolean | null = null, install_on_connection: boolean | null = null) {
        axios.patch(apiRoutes.data_packages,
            { hash, install_on_enrollment, install_on_connection })
            .then(r => {
                if (r.status === 200) {
                    getDatapackages();
                }
            }).catch(err => {
                notifications.show({
                    icon: <IconX />,
                    title: t('Failed to update data package'),
                    message: err.response.data.error,
                    color: 'red',
                });
        });
    }

    function getDatapackages() {
        setLoading(true);
        axios.get(apiRoutes.data_packages,{ params: {page: activePage, per_page: pageSize, sort_by: sortStatus.columnAccessor, sort_direction: sortStatus.direction} }
        ).then(r => {
            if (r.status === 200) {
                setLoading(false);
                setDataPackageCount(r.data.total);
                let rows: DataPackage[] = [];

                r.data.results.map((row: DataPackage) => {
                    const link = `${apiRoutes.download_data_packages}?hash=${row.hash}`;
                    row.download_button = <Button component="a" href={link} key={row.hash}><IconDownload size={14} /></Button>;
                    row.qr_button = <Button
                      onClick={() => {
                        setShowQrCode(true);
                        const dp_link = encodeURIComponent(`${window.location.protocol}//${window.location.hostname}:8443/Marti/api/sync/metadata/${row.hash}/tool`)
                        setQrLink(`tak://com.atakmap.app/import?url=${dp_link}`);
                        setQrHash(row.hash);
                        setQrTitle(row.filename);
                    }}
                    ><IconQrcode size={14} /> </Button>;

                    row.delete_button = <Button
                      onClick={() => {
                        setDataPackageToDelete(row.hash);
                        setDeleteDataPackageOpen(true);
                    }}
                      key={`${row.hash}_delete`}
                      color='red'
                    ><IconCircleMinus size={14} /></Button>;

                    row.install_on_enrollment_switch = <Switch
                      disabled={localStorage.getItem('administrator') !== 'true' || row.filename.endsWith('_CONFIG.zip')}
                      checked={row.install_on_enrollment}
                      onChange={(e) => {
                        updateDataPackage(row.hash, e.target.checked, row.install_on_connection);
                    }}
                    />;

                    row.install_on_connection_switch = <Switch
                      disabled={localStorage.getItem('administrator') !== 'true' || row.filename.endsWith('_CONFIG.zip')}
                      checked={row.install_on_connection}
                      onChange={(e) => {
                            updateDataPackage(row.hash, row.install_on_enrollment, e.target.checked);
                        }}
                    />;
                    row.callsign = row.eud ? row.eud.callsign : '';
                    row.formatted_size = bytes_formatter(row.size)
                    rows.push(row);
                });

                setPage(r.data.current_page);
                setTotalPages(r.data.total_pages);
                setDataPackages(rows);
            }
        });
    }

    function generateDataPackage() {
        setGeneratingDataPackage(true);
        axios.post(
            apiRoutes.generate_certificate,
            { username: localStorage.getItem('username') }
        ).then(r => {
            if (r.status === 200) {
                notifications.show({
                    message: t('Successfully created data package'),
                    icon: <IconCheck />,
                    color: 'green',
                });
                getDatapackages();
                setGeneratingDataPackage(false);
            }
        }).catch(err => {
            console.log(err);
            notifications.show({
                title: 'Error',
                message: err.response.data.error,
                icon: <IconCheck />,
                color: 'red',
            });
            setGeneratingDataPackage(false);
        });
    }

    return (
        <>
            <FileButton onChange={setFile}>
                {(props) => <Button mr="md" {...props}>Upload Data Package</Button>}
            </FileButton>
            <Button onClick={() => generateDataPackage()} loading={generatingDataPackage}>Generate Configuration Data Package</Button>
            <Modal opened={deleteDataPackageOpen} onClose={() => setDeleteDataPackageOpen(false)} title={t("Are you sure you want to delete this data package?")}>
                <Center>
                    <Button
                      mr="md"
                      onClick={() => {
                            deleteDataPackage();
                            setDeleteDataPackageOpen(false);
                        }}
                    >Yes
                    </Button>
                    <Button onClick={() => setDeleteDataPackageOpen(false)}>No</Button>
                </Center>
            </Modal>
            <Modal title={qrTitle} opened={showQrCode} onClose={() => setShowQrCode(false)} p="md" pb="lg">
                <Center>
                    <Paper p="md" shadow="xl" withBorder bg="white">
                        <QRCode value={qrLink} size={350} quietZone={10} logoImage={Logo} eyeRadius={50} ecLevel="L" qrStyle="dots" logoWidth={100} logoHeight={100} />
                    </Paper>
                </Center>
            </Modal>
            <Table.ScrollContainer minWidth="100%" mt="md">
                <DataTable
                    withTableBorder
                    borderRadius="md"
                    shadow="sm"
                    striped
                    highlightOnHover
                    records={dataPackages}
                    columns={[{accessor: "filename", title: t("File Name"), sortable: true}, {accessor: "formatted_size", title: t("Size"), sortable: true},
                        {accessor: "submission_user", title: t("Uploader Username"), sortable: true}, {accessor: "callsign", title: t("Uploader Callsign")},
                        {accessor: "submission_time", title: t("Upload Time"), sortable: true}, {accessor: "install_on_enrollment_switch", title: t("Install on Enrollment")},
                        {accessor: "install_on_connection_switch", title: t("Install on Connection")}, {accessor: "download_button", title: t("Download")},
                        {accessor: "delete_button", title: t("Delete")}, {accessor: "qr_button", title: t("QR Code")}]}
                    page={activePage}
                    onPageChange={(p) => setPage(p)}
                    onRecordsPerPageChange={setPageSize}
                    totalRecords={dataPackageCount}
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
