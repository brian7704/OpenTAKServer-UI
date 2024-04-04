import {
    Button,
    Center,
    FileButton, Modal,
    Pagination,
    Table,
    Text,
    TableData, TextInput, useComputedColorScheme,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import React, { useEffect, useState } from 'react';
import { IconDownload, IconCircleMinus, IconX, IconCheck, IconQrcode } from '@tabler/icons-react';
import QRCode from 'react-qr-code';
import axios from '@/axios_config';
import { apiRoutes } from '@/apiRoutes';
import bytes_formatter from '@/bytes_formatter';

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
    const [qrHash, setQrHash] = useState(false);
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
                    head: ['File Name', 'Size', 'Uploader Username', 'Uploader Callsign', 'Upload Time'],
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
                            setQrHash(row.hash);
                            setQrTitle(row.filename);
                        }}
                        >QR Code</Button>;

                        const delete_button = <Button
                          onClick={() => {
                            setDataPackageToDelete(row.hash);
                            setDeleteDataPackageOpen(true);
                        }}
                          key={`${row.hash}_delete`}
                          rightSection={<IconCircleMinus size={14} />}
                        >Delete
                                              </Button>;
                        const eud_callsign = row.eud ? row.eud.callsign : '';
                        tableData.body.push([row.filename, bytes_formatter(row.size),
                            row.submission_user, eud_callsign, row.submission_time,
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
                <Center><QRCode value={`${window.location.protocol}//${window.location.hostname}/Marti/api/sync/metadata/${qrHash}/tool`} />;</Center>
            </Modal>
            <Table.ScrollContainer minWidth="100%">
                <Table data={dataPackages} stripedColor={computedColorScheme === 'light' ? 'gray.2' : 'dark.8'} highlightOnHoverColor={computedColorScheme === 'light' ? 'gray.4' : 'dark.6'} striped="odd" highlightOnHover withTableBorder mt="md" mb="md" />
            </Table.ScrollContainer>
            <Center><Pagination total={totalPages} value={activePage} onChange={setPage} withEdges /></Center>
        </>
    );
}
