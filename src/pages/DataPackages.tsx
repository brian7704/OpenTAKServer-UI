import {
    Button,
    Center,
    FileButton,
    Pagination,
    Table,
    TableData
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import React, { useEffect, useState } from 'react';
import axios from '@/axios_config';
import { apiRoutes } from '@/config';
import tools from "@/tools";
import {IconDownload, IconCircleMinus, IconX, IconCheck} from "@tabler/icons-react";

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
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            axios.post(`/api/data_packages/upload`, formData, {headers: {"Content-Type": "multipart/form-data"}}).then(r => {
                if (r.status === 200) {
                    getDatapackages();
                    notifications.show({
                        title: 'Success',
                        message: 'Data package successfully uploaded',
                        icon: <IconCheck />,
                        color: 'green'
                    })
                }
                else {
                    notifications.show({
                        title: 'Failed to upload data package',
                        message: r.data.error,
                        icon: <IconX />,
                        color: 'red'
                    })
                }
            }).catch(err => {
                notifications.show({
                    title: 'Failed to upload data package',
                    message: err.response.data.error,
                    icon: <IconX />,
                    color: 'red'
                })
            });
        }
    }, [file]);

    useEffect(() => {
        getDatapackages();
    }, [activePage]);

    function deleteDataPackage(hash:string) {
        axios.delete(apiRoutes.deleteDataPackage,
            {params: {
                    'hash': hash
                }}).then(r => {
                    if (r.status === 200) {
                        getDatapackages();
                        notifications.show({
                            title: 'Success',
                            message: 'Successfully deleted data package',
                            icon: <IconCheck />,
                            color: 'green'
                        })
                    }
                    else {
                        notifications.show({
                            title: 'Delete Failed',
                            message: r.data.error,
                            icon: <IconX />,
                            autoClose: false,
                            color: 'red'
                        })
                    }
        }).catch(err => {
            console.log(err);
            notifications.show({
                title: 'Delete Failed',
                message: err.response.data.error,
                icon: <IconX />,
                autoClose: false,
                color: 'red'
            })
        })
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
                        const link = `${apiRoutes.deleteDataPackage}?hash=${row.hash}`
                        const download = <Button component="a" href={link} key={row.hash} rightSection={<IconDownload size={14}/>}>Download</Button>

                        const delete_button = <Button onClick={() => deleteDataPackage(row.hash)} key={row.hash + "_delete"} rightSection={<IconCircleMinus size={14}/>}>Delete</Button>
                        let callsign = row.eud ? row.eud.callsign : ''
                        tableData.body.push([row.filename, tools(row.size), row.submission_user, callsign, row.submission_time, download, delete_button]);
                    }
                });

                setPage(r.data.current_page);
                setTotalPages(r.data.total_pages);
                setDataPackages(tableData);
            }
        });
    }

    return (
        <>
            <FileButton onChange={setFile}>
                {(props) => <Button {...props}>Upload Data Package</Button>}
            </FileButton>
            <Table data={dataPackages} striped highlightOnHover withTableBorder mt="md" mb="md" />
            <Center><Pagination total={totalPages} value={activePage} onChange={setPage} withEdges /></Center>
        </>
    );
}
