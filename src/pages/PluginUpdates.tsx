import {
    Modal,
    Select,
    Table,
    TableData,
    TextInput,
    useComputedColorScheme,
    FileInput,
    Button,
    Pagination, Center, Image,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { IconCheck, IconCircleMinus, IconUpload, IconX } from '@tabler/icons-react';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { apiRoutes } from '@/apiRoutes.tsx';

export default function PluginUpdates() {
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const [uploadPluginOpen, setUploadPluginOpen] = useState(false);
    const [activePage, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [plugin, setPlugin] = useState<any>(new File([''], ''));
    const [icon, setIcon] = useState<File | null>(null);
    const [description, setDescription] = useState('');
    const [platform, setPlatform] = useState<any>('Android');
    const [uploading, setUploading] = useState<boolean>(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletePackage, setDeletePackage] = useState<any>();
    const [deleteName, setDeleteName] = useState<string | null>();
    const [packages, setPackages] = useState<TableData>({});

    function get_plugins() {
        axios.get(apiRoutes.pluginPackage,
            { params: {
                    page: activePage,
                } })
            .then(r => {
                if (r.status === 200) {
                    const tableData: TableData = {
                        caption: '',
                        head: ['Icon', 'Name', 'Description', 'Version', 'Platform', 'OS Requirement', 'Revision Code', 'Delete', 'Download'],
                        body: [],
                    };

                    r.data.results.map((row:any) => {
                        if (tableData.body !== undefined) {
                            const delete_button = <Button
                              onClick={() => {
                                    setDeleteModalOpen(true);
                                    setDeletePackage(row.package_name);
                                    setDeleteName(row.name);
                                }}
                              key={`${row.package_name}_delete`}
                            ><IconCircleMinus />
                                                  </Button>;

                            tableData.body.push([<Image src={row.icon} h={50} fit="contain" w="auto" />, row.name, row.description,
                                row.version, row.platform, row.os_requirement, row.revision_code, delete_button]);

                            setPage(r.data.current_page);
                            setTotalPages(r.data.total_pages);
                            setPackages(tableData);
                        }
                    });
                }
            }).catch(err => {
            console.log(err);
            notifications.show({
                icon: <IconX />,
                title: 'Failed to get data',
                message: err.response.data.error,
                color: 'red',
            });
        });
    }

    useEffect(() => {
        get_plugins();
    }, []);

    function upload_plugin(e:any) {
        e.preventDefault();
        setUploading(true);
        const body = new FormData();
        body.append('apk', plugin);
        body.append('description', description);
        body.append('platform', platform);
        axios.post(apiRoutes.pluginPackage,
            body
            ).then(r => {
                if (r.status === 200) {
                    notifications.show({
                        icon: <IconCheck />,
                        color: 'green',
                        message: 'Successfully uploaded plugin',
                    });
                    get_plugins();
                    setUploading(false);
                }
        }).catch(err => {
            console.log(err);
            notifications.show({
                icon: <IconX />,
                color: 'red',
                title: 'Failed to upload plugin',
                message: err.response.data.errors[0],
            });
            setUploading(false);
        });
    }

    function delete_plugin() {
        axios.delete(apiRoutes.pluginPackage,
            { params: { package_name: deletePackage } }).then(r => {
            if (r.status === 200) {
                notifications.show({
                    icon: <IconCheck />,
                    message: 'Successfully deleted plugin',
                    color: 'green',
                });
                get_plugins();
                setDeleteModalOpen(false);
            }
        }).catch(err => {
            console.log(err);
            notifications.show({
                icon: <IconX />,
                title: 'Failed to delete plugin',
                message: err.response.data.error,
                color: 'red',
            });
            setDeleteModalOpen(false);
        });
    }

    const platforms = <Select
      value={platform}
      data={[{ value: 'Android', label: 'Android' }, { value: 'Windows', label: 'Windows' }]}
      placeholder="Role"
      onChange={(value, option) => setPlatform(option.label)}
    />;

    return (
        <>
            <Button onClick={() => setUploadPluginOpen(true)} variant="filled" leftSection={<IconUpload size={14} />} mb="md">Upload Plugin</Button>
            <Table.ScrollContainer minWidth="100%">
                <Table stripedColor={computedColorScheme === 'light' ? 'gray.2' : 'dark.8'} highlightOnHoverColor={computedColorScheme === 'light' ? 'gray.4' : 'dark.6'} striped="odd" data={packages} highlightOnHover withTableBorder mb="md" />
            </Table.ScrollContainer>
            <Center><Pagination total={totalPages} value={activePage} onChange={setPage} withEdges /></Center>
            <Modal opened={uploadPluginOpen} onClose={() => setUploadPluginOpen(false)} title="Upload new plugin">
                {platforms}
                <FileInput label="Plugin File" value={plugin} onChange={setPlugin} required />
                <TextInput label="Description" onChange={(e) => setDescription(e.currentTarget.value)} />
                <FileInput label="Icon" value={icon} onChange={setIcon} mb="md" />
                <Button loading={uploading} onClick={(e) => { upload_plugin(e); }}>Upload Plugin</Button>
            </Modal>
            <Modal opened={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title={`Are you sure you want to delete ${deleteName}?`}>
                <Button onClick={() => delete_plugin()} mr="md">Yes</Button>
                <Button onClick={() => setDeleteModalOpen(false)}>No</Button>
            </Modal>
        </>
    );
}
