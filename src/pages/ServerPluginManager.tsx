import {
    Modal,
    Table,
    TableData,
    useComputedColorScheme,
    Button, Text, Divider, ScrollArea, LoadingOverlay, Center, FileInput,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import {IconCheck, IconCircleMinus, IconDownload, IconInfoCircle, IconUpload, IconX} from '@tabler/icons-react';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { socket } from '@/socketio';
import { apiRoutes } from '../apiRoutes';
import {Link} from "react-router";
import Markdown from "react-markdown";
import CodeMirror, {ViewPlugin} from "@uiw/react-codemirror";

interface About {
    author: string;
    author_email: string;
    classifier: Array<string>;
    description: string;
    description_content_type: string;
    license: string;
    metadata_version: string
    name: string;
    project_urls: Array<string>;
    project_url: Array<string>;
    requires_dist: Array<string>;
    requires_python: string;
    summary: string;
    version: string;
}

interface InstalledPlugin {
    distro: string;
    name: string;
    routes: [""]
}

interface CommandOutput {
    message: string;
    success: boolean;
}

interface Plugin {
    plugin_name?: string|null;
    action: string|null;
    plugin_distro?: string|null;
    plugin_file?: File|null|undefined;
    plugin_file_name?: string|null;
}

export default function ServerPluginManager() {
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const [showInfo, setShowInfo] = useState(false);
    const [about, setAbout] = useState<About>({} as About);
    const [docUrl, setDocUrl] = useState("");
    const [repoUrl, setRepoUrl] = useState("");
    const [installedPlugins, setInstalledPlugins] = useState<string[]|null>(null)
    const [loading, setLoading] = useState(true);
    const [showCommandOutput, setShowCommandOutput] = useState(false);
    const [commandOutput, setCommandOutput] = useState("");
    const [plugin, setPlugin] = useState<Plugin|null>(null);
    const [commandOutputTitle, setCommandOutputTitle] = useState("");
    const [refreshButtonDisabled, setRefreshButtonDisabled] = useState(true);
    const [showModelClose, setShowModelClose] = useState(false);
    const [pluginRepo, setPluginRepo] = useState('https://repo.opentakserver.io/brian/prod/');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [installingPlugin, setInstallingPlugin] = useState(false);
    const [plugins, setPlugins] = useState<TableData>({
        caption: '',
        head: ['Name', 'Show Info', 'Install', 'Delete'],
        body: [],
    });

    function pluginPackageManager(data:CommandOutput){
        setCommandOutput((commandOutput) => commandOutput + data.message)
        if (Object.hasOwn(data, "success") && data.success) {
            setRefreshButtonDisabled(false);
            setInstallingPlugin(false);
            notifications.show({
                title: 'Success',
                message: `Please restart OpenTAKServer and refresh your browser`,
                icon: <IconCheck />,
                color: 'green',
            })
        }
        else if (Object.hasOwn(data, "success") && !data.success) {
            setRefreshButtonDisabled(true);
            setShowModelClose(true);
            setInstallingPlugin(false);
            notifications.show({
                title: 'Error',
                message: `Check command output`,
                icon: <IconX />,
                color: 'red',
            })
        }
    }

    function pep440_gt(version1: string, version2: string) {
        const PEP440_REGEX = /^([0-9])\.([0-9])\.([0-9])\.?(post[0-9]+)?\.?(dev)?(a|b|rc)?(\+[0-9a-zA-Z]{7}?)/
        if (!PEP440_REGEX.test(version1) || !PEP440_REGEX.test(version2)) {
            return false;
        }
        else if (version1 === version2) {
            return false;
        }

        const version1_regex = PEP440_REGEX.exec(version1);
        const version2_regex = PEP440_REGEX.exec(version2);

        if (version2_regex === null && version1_regex !== null) {
            return true;
        }
        else if (version1_regex === null || version2_regex === null) {
            return false;
        }

        // Major Version
        if (version1_regex[1] > version2_regex[1]) {
            return true;
        }
        // Minor Version
        else if (version1_regex[1] === version2_regex[1] && version1_regex[2] > version2_regex[2]) {
            return true;
        }
        // Patch number
        else if (version1_regex[1] === version2_regex[1] && version1_regex[2] === version2_regex[2] && version1_regex[3] > version2_regex[3]) {
            return true;
        }
        // Major, minor, and patch match. Check for post
        else if (version1_regex[1] === version2_regex[1] && version1_regex[2] === version2_regex[2] && version1_regex[3] === version2_regex[3]) {
            if (version1_regex[4] && !version2_regex[4]) {
                return true;
            }

            const version1_post = parseInt(version1_regex[4].replace("post", ""), 10);
            const version2_post = parseInt(version2_regex[4].replace("post", ""), 10);
            if (version1_post > version2_post) {
                return true;
            }
        }
        return false;
    }

    useEffect(() => {
        getPluginRepo();

        socket.on('plugin_package_manager', pluginPackageManager);

        return () => {
            socket.off('plugin_package_manager', pluginPackageManager);
        }
    }, [])

    useEffect(() => {
        getInstalledPlugins();
    }, [pluginRepo]);

    useEffect(() => {
        if (installedPlugins !== null) {
            getAvailablePlugins();
        }
    }, [installedPlugins]);

    useEffect(() => {
        let project_urls: string[] = [];
        if (Object.hasOwn(about, "project_urls")) {
            project_urls = about.project_urls;
        }
        else if (Object.hasOwn(about, "project_url")) {
            project_urls = about.project_url;
        }

        project_urls.forEach((value) => {
            if (value.startsWith("Documentation")) {
                setDocUrl(value.split(", ")[1])
            }
            else if (value.startsWith("Repository")) {
                setRepoUrl(value.split(", ")[1])
            }
        })
    }, [about]);

    useEffect(() => {
        if (plugin === null) {

        }
        else if (plugin.action !== "install_local") {
            socket.emit('plugin_package_manager', plugin);
        }
        else if (plugin.action === "install_local" && plugin.plugin_file != undefined) {
            const formData = new FormData();
            formData.append('file', plugin.plugin_file);
            axios.post(apiRoutes.plugins, formData).then((r) => {
                if (r.status === 200) {
                    socket.emit('plugin_package_manager', {...plugin, 'plugin_file': null});
                }
            }).catch((err) => {
                setInstallingPlugin(false);
                console.log(err);
                notifications.show({
                    title: 'Failed to upload plugin',
                    message: err.response.data.error,
                    icon: <IconX />,
                    color: 'red'
                })
            })
        }
    }, [plugin]);

    function getPluginRepo() {
        axios.get(apiRoutes.pluginRepo).then((r) => {
            if (r.status === 200) {
                setPluginRepo(r.data.repo_url);
            }
        }).catch((err) => {
            console.log(err);
            notifications.show({
                title: 'Failed to get repo URL',
                message: err.response.data.error,
                icon: <IconX />,
                color: 'red',
            })
        })
    }

    function getAvailablePluginInfo(pluginName:string) {
        axios.get(`${pluginRepo}/${pluginName}`, {headers: {"Accept": "application/json"}})
            .then((r) => {
                let metadata;
                if (r.status === 200) {
                    let highestVersion: string|null = null;
                    Object.entries(r.data.result).forEach(([key, value]) => {
                        console.log(key);
                        if (highestVersion === null) {
                            highestVersion = key;
                            metadata = value;
                        } else if (pep440_gt(key, highestVersion)) {
                            highestVersion = key;
                            metadata = value;
                        }
                    });

                    if (metadata) {
                        setAbout(metadata);
                    }
                }
                return metadata;
        }).catch((err) => {
            console.log(err);
            notifications.show({
                title: 'Failed to create data package',
                message: `Response Code: ${err.response.status}`,
                icon: <IconX />,
                color: 'red',
            })
        })
    }

    function getInstalledPluginInfo(pluginDistro: string) {
        axios.get(`${apiRoutes.plugins}/${pluginDistro}`).then((r) => {
            if (r.status === 200) {
                setAbout(r.data);
            }
        }).catch((err) => {
            console.log(err);
            notifications.show({
                title: 'Failed to get plugin info',
                message: err.response.data.error,
                icon: <IconX />,
                color: 'red',
            })
        })
    }

    function getInstalledPlugins() {
        axios.get(apiRoutes.plugins).then(r => {
            if (r.status === 200) {
                const plugins_list: string[] = []
                const tableData: TableData = {...plugins};
                r.data.plugins.forEach((installedPlugin: InstalledPlugin) => {
                    plugins_list.push(installedPlugin.name.toLowerCase())
                    tableData.body?.push([installedPlugin.name.toLowerCase(), <Button onClick={(e) => {e.preventDefault(); setShowInfo(true); getInstalledPluginInfo(installedPlugin.distro)}}><IconInfoCircle /></Button>,
                        <Button disabled><IconDownload /></Button>,
                        <Button color="red" onClick={(e) => {e.preventDefault(); setShowCommandOutput(true); setPlugin({...plugin, 'plugin_name': installedPlugin.name, 'action': 'delete', 'plugin_distro': installedPlugin.distro}); setCommandOutputTitle(`Deleting ${installedPlugin.name}`) }}><IconCircleMinus /></Button>])
                });
                setInstalledPlugins(plugins_list);
                setPlugins(tableData);
            }
            setLoading(false);
        }).catch((err) => {
            console.log(err);
            setLoading(false);
            notifications.show({
                message: 'Failed to get installed plugins',
                icon: <IconX />,
                color: 'red',
            })
        })
    }

    function getAvailablePlugins() {
        setLoading(true);
        axios.get(pluginRepo, {headers: {"Accept": "application/json"}}).then((r) => {
            if (r.status === 200) {
                const tableData: TableData = {...plugins};

                r.data.result.projects.map((p:string) => {
                    const plugin_distro = p.replace(/-/g, "_");
                    const row = [plugin_distro, <Button onClick={(e) => {e.preventDefault(); setShowInfo(true); getAvailablePluginInfo(plugin_distro)}}><IconInfoCircle /></Button>,
                        <Button onClick={(e) => {e.preventDefault(); setShowCommandOutput(true); setPlugin({...plugin, plugin_distro, 'action': 'install', 'plugin_name': p}); setCommandOutputTitle(`Installing ${p}`)}}><IconDownload /></Button>,
                        <Button disabled><IconCircleMinus /></Button>
                    ];
                    if (!installedPlugins?.includes(p)) {
                        tableData.body?.push(row);
                    }
                });
                setPlugins(tableData);
            }
            setLoading(false);
        }).catch((err) => {
            console.log(err);
            setLoading(false);
            notifications.show({
                message: 'Failed to get available plugins',
                icon: <IconX />,
                color: 'red',
            })
        })
    }

    // Scrolls the CodeMirror shell output to the bottom automatically
    const scrollBottom = ViewPlugin.fromClass(
        class {
            update(update:any) {
                if (update.docChanged) {
                    update.view.scrollDOM.scrollTop = update.view.scrollDOM.scrollHeight;
                }
            }
        }
    );

    return (
        <>
            <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

            <Button mb="md" onClick={() => setShowUploadModal(true)}>Upload Plugin</Button>
            <Modal title="Upload Plugin" w="50vw" size="xl" opened={showUploadModal} onClose={() => setShowUploadModal(false)} closeOnEscape={!installingPlugin} closeOnClickOutside={!installingPlugin} withCloseButton={!installingPlugin}>
                <FileInput mb="md" clearable={!installingPlugin} disabled={installingPlugin} label="Select your zip, whl, or tar.gz file" onChange={(file) => {setInstallingPlugin(true); setPlugin({...plugin, 'plugin_file': file, 'action': 'install_local', 'plugin_file_name': file?.name})}} />
                <CodeMirror basicSetup={{ lineNumbers: false }} extensions={[scrollBottom]} lang="shell" maxHeight="60vh" value={commandOutput} height="100%" theme={computedColorScheme} readOnly />
                <Center><Button mt="md" disabled={installingPlugin} onClick={() => window.location.reload()}>Refresh Browser</Button></Center>
            </Modal>

            <Table.ScrollContainer minWidth="100%">
                <Table data={plugins} stripedColor={computedColorScheme === 'light' ? 'gray.2' : 'dark.8'} highlightOnHoverColor={computedColorScheme === 'light' ? 'gray.4' : 'dark.6'} striped="odd" highlightOnHover withTableBorder mb="md" />
            </Table.ScrollContainer>
            <Modal opened={showInfo} onClose={() => setShowInfo(false)} fullScreen>
                <ScrollArea style={{width:'100%'}}>
                    <Text size="md"><Text span inherit fw={700}>Name:</Text> {about?.name}</Text>
                    <Text size="md"><Text span inherit fw={700}>Author:</Text> {about?.author}</Text>
                    <Text size="md"><Text span inherit fw={700}>Author Email:</Text> {about?.author_email}</Text>
                    <Text size="md"><Text span inherit fw={700}>License:</Text> {about?.license}</Text>
                    <Text size="md"><Text span inherit fw={700}>Version:</Text> {about?.version}</Text>
                    <Text size="md"><Text span inherit fw={700}>Documentation:</Text> <Link to={docUrl}>{docUrl}</Link></Text>
                    <Text size="md"><Text span inherit fw={700}>Repository:</Text> <Link to={repoUrl}>{repoUrl}</Link></Text>
                    <Divider mt="md" />
                    <Markdown>{about?.description}</Markdown>
                </ScrollArea>
            </Modal>

            <Modal withCloseButton={showModelClose} title={commandOutputTitle} closeOnClickOutside={false} closeOnEscape={false} w="50vw" size="xl" opened={showCommandOutput} onClose={() => {setShowCommandOutput(false); setCommandOutput("")}}>
                <CodeMirror extensions={[scrollBottom]} lang="shell" maxHeight="60vh" value={commandOutput} height="100%" theme={computedColorScheme} readOnly />
                <Text mt="md" ta="center" fw={700} display={refreshButtonDisabled ? "none" : "block"}>Please restart OpenTAKServer and refresh your browser.</Text>
                <Center><Button mt="md" disabled={refreshButtonDisabled} onClick={() => window.location.reload()}>Refresh Browser</Button></Center>
            </Modal>
        </>
    );
}
