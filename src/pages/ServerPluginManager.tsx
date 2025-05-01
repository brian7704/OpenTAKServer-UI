import {
    Modal,
    Table,
    TableData,
    useComputedColorScheme,
    Button, Text, Switch, Divider, ScrollArea, LoadingOverlay,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import {IconCircleMinus, IconDownload, IconInfoCircle, IconUpload, IconX} from '@tabler/icons-react';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { formatISO, parseISO } from 'date-fns';
import { apiRoutes } from '../apiRoutes';
import {Link} from "react-router";
import Markdown from "react-markdown";
import { compareSemVer } from 'semver-parser';

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

export default function ServerPluginManager() {
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const [showInfo, setShowInfo] = useState(false);
    const [about, setAbout] = useState<About>({} as About);
    const [docUrl, setDocUrl] = useState("");
    const [repoUrl, setRepoUrl] = useState("");
    const [installedPlugins, setInstalledPlugins] = useState<string[]|null>(null)
    const [loading, setLoading] = useState(true);
    const [plugins, setPlugins] = useState<TableData>({
        caption: '',
        head: ['Name', 'Show Info', 'Install', 'Delete'],
        body: [],
    });

    useEffect(() => {
        getInstalledPlugins();
    }, [])

    useEffect(() => {
        if (installedPlugins !== null) {
            getAvailablePlugins();
        }
    }, [installedPlugins]);

    useEffect(() => {
        console.log(`showInfo is ${showInfo}`)
    }, [showInfo]);

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

    function getAvailablePluginInfo(pluginName:string) {
        axios.get(`https://repo.opentakserver.io/brian/prod/${pluginName}`, {headers: {"Accept": "application/json"}})
            .then((r) => {
                let metadata;
                if (r.status === 200) {
                    let highestVersion: string|null = null;
                    Object.entries(r.data.result).forEach(([key, value]) => {
                        if (highestVersion === null) {
                            highestVersion = key;
                            metadata = value;
                        } else if (compareSemVer(highestVersion, key, false) === 1) {
                            highestVersion = key;
                            metadata = key;
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
        setLoading(true);
        axios.get(apiRoutes.plugins).then(r => {
            if (r.status === 200) {
                const plugins_list: string[] = []
                const tableData: TableData = {
                    caption: '',
                    head: ['Name', 'Show Info', 'Install', 'Delete'],
                    body: [],
                };
                r.data.plugins.forEach((plugin: InstalledPlugin) => {
                    plugins_list.push(plugin.name.toLowerCase())
                    tableData.body?.push([plugin.name.toLowerCase(), <Button onClick={(e) => {e.preventDefault(); console.log(`Clicked ${plugin.name}`); setShowInfo(true); getInstalledPluginInfo(plugin.distro)}}><IconInfoCircle /></Button>,
                        <Button disabled><IconDownload /></Button>,
                        <Button><IconCircleMinus /></Button>])
                });
                setInstalledPlugins(plugins_list);
                setPlugins(tableData);
            }
        })
    }

    function getAvailablePlugins() {
        axios.get("https://repo.opentakserver.io/brian/prod", {headers: {"Accept": "application/json"}}).then((r) => {
            if (r.status === 200) {
                const tableData: TableData = {...plugins};

                r.data.result.projects.map((p:string) => {
                    const row = [p, <Button onClick={(e) => {e.preventDefault(); console.log(`Clickeded ${p}`); setShowInfo(true); getAvailablePluginInfo(p)}}><IconInfoCircle /></Button>,
                        <Button disabled={installedPlugins?.includes(p)}><IconDownload /></Button>,
                        <Button disabled={!installedPlugins?.includes(p)}><IconCircleMinus /></Button>
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

    return (
        <>
            <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
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

                <Button leftSection={<IconDownload />}>Install</Button>
            </Modal>
        </>
    );
}
