import {
    Modal,
    Table,
    TableData,
    useComputedColorScheme,
    Button, Text, Switch, Divider, ScrollArea,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import {IconCircleMinus, IconDownload, IconInfoCircle, IconUpload, IconX} from '@tabler/icons-react';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { formatISO, parseISO } from 'date-fns';
import { apiRoutes } from '../apiRoutes';
import {Link} from "react-router-dom";
import Markdown from "react-markdown";
import { compareSemVer, isValidSemVer, parseSemVer } from 'semver-parser';

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
    requires_dist: Array<string>;
    requires_python: string;
    summary: string;
    version: string;
}

export default function ServerPlugins() {
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const [showInfo, setShowInfo] = useState(false);
    const [about, setAbout] = useState<About>();
    const [docUrl, setDocUrl] = useState("");
    const [repoUrl, setRepoUrl] = useState("");
    const [plugins, setPlugins] = useState<TableData>({
        caption: '',
        head: ['Name', 'Show Info', 'Install'],
        body: [],
    });

    useEffect(() => {
        getPluginList()
    }, [])

    useEffect(() => {
        console.log(`SHOWINFO ${showInfo}`)
    }, [showInfo]);

    useEffect(() => {
        about?.project_urls.forEach((value) => {
            if (value.startsWith("Documentation")) {
                setDocUrl(value.split(", ")[1])
            }
            else if (value.startsWith("Repository")) {
                setRepoUrl(value.split(", ")[1])
            }
        })
    }, [about]);

    function getPluginInfo(pluginName:string) {
        console.log(`Getting ${pluginName}`);
        axios.get(`https://repo.opentakserver.io/brian/prod/${pluginName}`, {headers: {"Accept": "application/json"}})
            .then((r) => {
            if (r.status === 200) {
                console.log(r.data);
                let highestVersion: string|null = null;
                let metadata;
                Object.entries(r.data.result).forEach(([key, value]) => {
                    if (highestVersion === null) {
                        highestVersion = key;
                        metadata = value;
                    } else if (compareSemVer(highestVersion, key, false) === 1) {
                        highestVersion = key;
                        metadata = key;
                    }
                });

                console.log(`Highest version is ${highestVersion}`)
                console.log(metadata)
                setAbout(metadata);
                return metadata;
            }
        })
    }

    function getPluginList() {
        axios.get("https://repo.opentakserver.io/brian/prod", {headers: {"Accept": "application/json"}}).then((r) => {
            if (r.status === 200) {
                const tableData: TableData = {
                    caption: '',
                    head: ['Name', 'Show Info', 'Install'],
                    body: [],
                };

                r.data.result.projects.map((p:string) => {
                    if (tableData.body !== undefined) {
                        tableData.body.push([p, <Button><IconInfoCircle onClick={() => {setShowInfo(true); getPluginInfo(p)}} /></Button>, <Button><IconDownload /></Button>]);
                    }
                });

                setPlugins(tableData);
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    return (
        <>
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
