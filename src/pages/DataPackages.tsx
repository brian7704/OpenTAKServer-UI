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

interface data_package {
    filename: string;
    creator_uid: string;
    expiration: string;
    hash: string;
    keywords: string;
    mime_type: string;
    size: number;
    submission_time: string;
    submission_user: string;
    tool: string;
    eud: {
        callsign: string;
    }
}

export default function DataPackages() {
    const [dataPackages, setDataPackages] = useState<TableData>({
        caption: '',
        head: ['File Name', 'Size', 'Uploader Username', 'Uploader Callsign', 'Upload Time'],
        body: [],
    });
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

    useEffect(() => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            axios.post(apiRoutes.data_packages, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => {
                if (r.status === 200) {
                    getDatapackages();
                    notifications.show({
                        title: 'Success',
                        message: 'Data package successfully uploaded',
                        icon: <IconCheck />,
                        color: 'green',
                    });
                } else {
                    notifications.show({
                        title: 'Failed to upload data package',
                        message: r.data.error,
                        icon: <IconX />,
                        color: 'red',
                    });
                }
            }).catch(err => {
                notifications.show({
                    title: 'Failed to upload data package',
                    message: err.response.data.error,
                    icon: <IconX />,
                    color: 'red',
                });
            });
        }
    }, [file]);

    useEffect(() => {
        getDatapackages();
    }, [activePage]);

    function deleteDataPackage() {
        axios.delete(apiRoutes.deleteDataPackage,
            { params: {
                    hash: dataPackageToDelete,
                } }).then(r => {
                    if (r.status === 200) {
                        getDatapackages();
                        notifications.show({
                            title: 'Success',
                            message: 'Successfully deleted data package',
                            icon: <IconCheck />,
                            color: 'green',
                        });
                    } else {
                        notifications.show({
                            title: 'Delete Failed',
                            message: r.data.error,
                            icon: <IconX />,
                            autoClose: false,
                            color: 'red',
                        });
                    }
        }).catch(err => {
            console.log(err);
            notifications.show({
                title: 'Delete Failed',
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
                    title: 'Failed to update data package',
                    message: err.response.data.error,
                    color: 'red',
                });
        });
    }

    function getDatapackages() {
        axios.get(
            apiRoutes.data_packages,
            { params: {
                    page: activePage,
                } }
        ).then(r => {
            if (r.status === 200) {
                const tableData: TableData = {
                    caption: '',
                    head: ['File Name', 'Size', 'Uploader Username', 'Uploader Callsign', 'Upload Time', 'Install on Enrollment', 'Install on Connection'],
                    body: [],
                };

                r.data.results.map((row:any) => {
                    if (tableData.body !== undefined) {
                        const link = `${apiRoutes.download_data_packages}?hash=${row.hash}`;
                        const download = <Button component="a" href={link} key={row.hash} rightSection={<IconDownload size={14} />}>Download</Button>;
                        const qrButton = <Button
                          rightSection={<IconQrcode size={14} />}
                          onClick={() => {
                            setShowQrCode(true);
                            const dp_link = encodeURIComponent(`${window.location.protocol}//${window.location.hostname}:8443/Marti/api/sync/metadata/${row.hash}/tool`)
                            setQrLink(`tak://com.atakmap.app/import?url=${dp_link}`);
                            setQrHash(row.hash);
                            setQrTitle(row.filename);
                        }}
                        >QR Code
                                         </Button>;

                        const delete_button = <Button
                          onClick={() => {
                            setDataPackageToDelete(row.hash);
                            setDeleteDataPackageOpen(true);
                        }}
                          key={`${row.hash}_delete`}
                          rightSection={<IconCircleMinus size={14} />}
                        >Delete
                                              </Button>;

                        const enrollment = <Switch
                          disabled={localStorage.getItem('administrator') !== 'true' || row.filename.endsWith('_CONFIG.zip')}
                          checked={row.install_on_enrollment}
                          onChange={(e) => {
                            updateDataPackage(row.hash, e.target.checked, row.install_on_connection);
                        }}
                        />;

                        const connection = <Switch
                          disabled={localStorage.getItem('administrator') !== 'true' || row.filename.endsWith('_CONFIG.zip')}
                          checked={row.install_on_connection}
                          onChange={(e) => {
                                updateDataPackage(row.hash, row.install_on_enrollment, e.target.checked);
                            }}
                        />;
                        const eud_callsign = row.eud ? row.eud.callsign : '';
                        tableData.body.push([row.filename, bytes_formatter(row.size),
                            row.submission_user, eud_callsign, row.submission_time, enrollment, connection,
                            download, delete_button, qrButton]);
                    }
                });

                setPage(r.data.current_page);
                setTotalPages(r.data.total_pages);
                setDataPackages(tableData);
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
                    message: 'Successfully created data package',
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
            <Modal opened={deleteDataPackageOpen} onClose={() => setDeleteDataPackageOpen(false)} title="Are you sure you want to delete this data package?">
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
                        <QRCode value={qrLink} size={350} quietZone={0} logoImage={Logo} eyeRadius={50} ecLevel="L" qrStyle="dots" removeQrCodeBehindLogo logoPaddingStyle="circle" logoWidth={100} logoHeight={100} />
                    </Paper>
                </Center>
            </Modal>
            <Table.ScrollContainer minWidth="100%">
                <Table data={dataPackages} stripedColor={computedColorScheme === 'light' ? 'gray.2' : 'dark.8'} highlightOnHoverColor={computedColorScheme === 'light' ? 'gray.4' : 'dark.6'} striped="odd" highlightOnHover withTableBorder mt="md" mb="md" />
            </Table.ScrollContainer>
            <Center><Pagination total={totalPages} value={activePage} onChange={setPage} withEdges /></Center>
        </>
    );
}
