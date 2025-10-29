import {
    Modal,
    Select,
    Table,
    TableData,
    TextInput,
    useComputedColorScheme,
    FileInput,
    Button,
    Pagination, Center, Image, Switch,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { IconCheck, IconCircleMinus, IconUpload, IconX } from '@tabler/icons-react';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { apiRoutes } from '@/apiRoutes.tsx';

interface PluginInterface {
    plugin: File,
    package_name: string;
    icon: string;
    name: string;
    description: string;
    version: string;
    platform: string;
    os_requirement: string;
    revision_code: string;
    install_on_enrollment: boolean;
    install_on_connection: boolean;
}

export default function PluginUpdates() {
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const [uploadPluginOpen, setUploadPluginOpen] = useState(false);
    const [activePage, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [plugin, setPlugin] = useState<any>(new File([''], ''));
    const [icon, setIcon] = useState<any>(new File([''], ''));
    const [description, setDescription] = useState('');
    const [atakVersion, setAtakVersion] = useState("");
    const [platform, setPlatform] = useState('Android');
    const [pluginType, setPluginType] = useState('plugin');
    const [uploading, setUploading] = useState<boolean>(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletePackage, setDeletePackage] = useState<any>();
    const [deleteName, setDeleteName] = useState<string | null>();
    const [packages, setPackages] = useState<TableData>({
        caption: '',
        head: ['Icon', 'Name', 'Description', 'Version', 'Platform', 'OS Requirement', 'Revision Code', 'Install on Enrollment', 'Install on Connection', 'Delete'],
        body: [],
    });

    function update_plugin(package_name: string, install_on_enrollment: boolean, install_on_connection: boolean): void {
        axios.patch(apiRoutes.pluginPackage,
            { package_name, install_on_enrollment, install_on_connection },
            ).then(r => {
                if (r.status === 200) {
                    get_plugins();
                }
        }).catch(err => {
            notifications.show({
                icon: <IconX />,
                title: 'Failed to update package',
                message: err.response.data.error,
                color: 'red',
            });
        });
    }

    function get_plugins() {
        axios.get(apiRoutes.pluginPackage,
            { params: {
                    page: activePage,
                } })
            .then(r => {
                if (r.status === 200) {
                    const tableData: TableData = {
                        caption: '',
                        head: ['Icon', 'Name', 'Description', 'Version', 'Platform', 'OS Requirement', 'Revision Code', 'Install on Enrollment', 'Install on Connection', 'Delete'],
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
                            const install_on_enrollment = <Switch
                              checked={row.install_on_enrollment}
                              onChange={(e) => {
                                    update_plugin(row.package_name, e.target.checked, row.install_on_connection);
                                }}
                            />;

                            const install_on_connection = <Switch
                              checked={row.install_on_connection}
                              onChange={(e) => {
                                    update_plugin(row.package_name, row.install_on_enrollment, e.target.checked);
                                }}
                            />;

                            tableData.body.push([<Image src={row.icon} h={50} fit="contain" w="auto" />, row.name, row.description,
                                row.version, row.platform, row.os_requirement, row.revision_code, install_on_enrollment,
                                install_on_connection, delete_button]);
                        }
                    });

                    setPage(r.data.current_page);
                    setTotalPages(r.data.total_pages);
                    setPackages(tableData);
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
    }, [activePage]);

    function upload_plugin(e:any) {
        e.preventDefault();
        setUploading(true);
        const body = new FormData();
        body.append('apk', plugin);
        body.append('icon', icon);
        body.append('description', description);
        body.append('platform', "Android");
        body.append('plugin_type', pluginType);
        body.append('atak_version', atakVersion);

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
                    setUploadPluginOpen(false);
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

    const plugin_type = <Select
        value={pluginType}
        label="Plugin Type"
        data={[{ value: 'plugin', label: 'Plugin' }, { value: 'app', label: 'App' }]}
        onChange={(value, option) => setPluginType(option.value)}
    />;

    return (
        <>
            <Button onClick={() => setUploadPluginOpen(true)} variant="filled" leftSection={<IconUpload size={14} />} mb="md">Upload Plugin</Button>
            <Table.ScrollContainer minWidth="100%">
                <Table stripedColor={computedColorScheme === 'light' ? 'gray.2' : 'dark.8'} highlightOnHoverColor={computedColorScheme === 'light' ? 'gray.4' : 'dark.6'} striped="odd" data={packages} highlightOnHover withTableBorder mb="md" />
            </Table.ScrollContainer>
            <Center><Pagination total={totalPages} value={activePage} onChange={setPage} withEdges /></Center>
            <Modal opened={uploadPluginOpen} onClose={() => setUploadPluginOpen(false)} title="Upload Plugin">
                {plugin_type}
                <FileInput label="Plugin File" value={plugin} onChange={setPlugin} required accept="application/vnd.android.package-archive" />
                <TextInput label="Description" onChange={(e) => setDescription(e.currentTarget.value)} />
                <FileInput label="Icon" value={icon} onChange={setIcon} mb="md" />
                <Select
                    pb="md"
                    value={atakVersion}
                    label="ATAK Version"
                    data={["Any", "5.4.0", "5.5.0", "5.5.1", "5.6.0", "5.7.0", "5.8.0"]}
                    onChange={(value) => {
                        if (value && value !== "Any")
                            setAtakVersion(value);
                        else
                            setAtakVersion("");
                    }
                }
                />
                <Button loading={uploading} onClick={(e) => { upload_plugin(e); }}>Upload Plugin</Button>
            </Modal>
            <Modal opened={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title={`Are you sure you want to delete ${deleteName}?`}>
                <Button onClick={() => delete_plugin()} mr="md">Yes</Button>
                <Button onClick={() => setDeleteModalOpen(false)}>No</Button>
            </Modal>
        </>
    );
}
