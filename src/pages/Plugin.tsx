import { apiRoutes } from "@/apiRoutes.tsx";
import { yaml } from '@codemirror/lang-yaml';
import { Button, Divider, ScrollArea, Switch, Tabs, Text, useComputedColorScheme } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
    IconAlignLeft,
    IconCheck,
    IconDeviceFloppy,
    IconInfoCircle,
    IconRestore,
    IconSettings,
    IconX
} from "@tabler/icons-react";
import CodeMirror from '@uiw/react-codemirror';
import axios from "axios";
import { useEffect, useState } from "react";
import Markdown from 'react-markdown';
import { Link, useSearchParams } from "react-router";
import { parse, stringify } from 'yaml';

interface About {
    author: string;
    author_email: string;
    classifier: Array<string>;
    description: string;
    description_content_type: string;
    license: string;
    metadata_version: string
    name: string;
    project_url: Array<string>;
    requires_dist: Array<string>;
    requires_python: string;
    summary: string;
    version: string;
    distro: string;
}

export default function Plugin() {
    const [params, setParams] = useSearchParams();
    const [originalConfig, setOriginalConfig] = useState("");
    const [editedConfig, setEditedConfig] = useState("");
    const [about, setAbout] = useState<About>();
    const [docUrl, setDocUrl] = useState("");
    const [repoUrl, setRepoUrl] = useState("");
    const [showUITab, setShowUITab] = useState(true);
    const [enabled, setEnabled] = useState(true)
    const [pluginName, setPluginName] = useState<string|null>(null);
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    useEffect(() => {
        setPluginName(params.get('name'))
        getAbout();
    }, [params]);

    useEffect(() => {
        getConfig();
        checkUi();
    }, [about]);

    useEffect(() => {
        about?.project_url.forEach((value) => {
            if (value.startsWith("Documentation")) {
                setDocUrl(value.split(", ")[1])
            }
            else if (value.startsWith("Repository")) {
                setRepoUrl(value.split(", ")[1])
            }
        })
    }, [about]);

    function checkUi() {
        if (pluginName !== null) {
            axios.get(`/api/plugins/${pluginName}/ui`).then((r) => {
                if (r.status === 200) {
                    if (!r.data) {
                        setShowUITab(false);
                    } else {
                        setShowUITab(true);
                    }
                }
            })
        }
    }

    function getConfig() {
        axios.get(`/api/plugins/${params.get('name')}/config`).then((r) => {
            if (r.status === 200) {
                setOriginalConfig(r.data);
                setEditedConfig(stringify(r.data));
            }
        }).catch((err) => {
            console.log(err);
            notifications.show({
                title: "Failed to get plugin config",
                message: "Please restart OpenTAKServer",
                icon: <IconX />,
                color: 'red'
            })
        })
    }

    function getAbout() {
        axios.get(`/api/plugins/${params.get("name")}`).then((r) => {
            if (r.status === 200) {
                setAbout(r.data);
                setEnabled(r.data.enabled);
            }
        }).catch((err) => {
            console.log(err);
            notifications.show({
                title: "Error getting plugin data",
                message: err.response.data.error,
                icon: <IconX />,
                color: 'red'
            })
        })
    }

    // Undoes any unsaved changes the user has made to the config
    function undoChanges() {
        setEditedConfig(stringify(originalConfig));
    }

    // Updates the plugin's config
    function submit() {
        // parse yaml to make sure it's valid
        // post to backend
        // backend plugin validates
        // display success or failure message
        try {
            const config = parse(editedConfig);
            axios.post(`/api/plugins/${params.get('name')}/config`, config).then((r) => {
                if (r.status === 200) {
                    notifications.show({
                        title: 'Success',
                        message: 'Successfully Updated Plugin Config',
                        icon: <IconCheck />,
                        color: 'green'
                    });
                    window.location.reload();
                } else {
                    notifications.show({
                        title: 'Failed to update plugin config',
                        message: r.data.error,
                        icon: <IconX />,
                        color: 'red'
                    })
                }
            }).catch((err) => {
                console.log(err);
                notifications.show({
                    title: 'Failed to update plugin config',
                    message: err.response.data.error,
                    icon: <IconX />,
                    color: 'red'
                })
            })
        }
        catch (error: unknown) {
            let message = "";
            if (typeof error === "string") {
                message = error
            } else if (error instanceof Error) {
                message = error.message
            }

            console.error(error);
            notifications.show({
                title: 'Error',
                message,
                icon: <IconX />,
                color: 'red',
            });
        }
    }

    function togglePlugin() {
        axios.post((enabled) ? `${apiRoutes.plugins}/${params.get('name')}/disable` : `${apiRoutes.plugins}/${params.get('name')}/enable`)
            .then((r) => {
                if (r.status === 200) {
                    setEnabled(!enabled);
                    notifications.show({
                        title: 'Success',
                        message: '',
                        icon: <IconCheck />,
                        color: 'green'
                    })
                }
        }).catch((err) => {
            console.log(err);
            notifications.show({
                title: 'Failed',
                message: '',
                icon: <IconX />,
                color: 'red'
            })
        })
    }

    return (
        <div>
            <Tabs defaultValue="about">
                <Tabs.List>
                    <Tabs.Tab value="about" leftSection={<IconInfoCircle size={16} /> }>
                        About
                    </Tabs.Tab>
                    <Tabs.Tab value="ui" leftSection={<IconAlignLeft size={16} />} display={showUITab ? 'inherit' : 'none'}>
                        UI
                    </Tabs.Tab>
                    <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>
                        Settings
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="about">
                    <ScrollArea style={{width:'100%'}}>
                        <Text size="md"><Text span inherit fw={700}>Name:</Text> {about?.name}</Text>
                        <Text size="md"><Text span inherit fw={700}>Author:</Text> {about?.author}</Text>
                        <Text size="md"><Text span inherit fw={700}>Author Email:</Text> {about?.author_email}</Text>
                        <Text size="md"><Text span inherit fw={700}>License:</Text> {about?.license}</Text>
                        <Text size="md"><Text span inherit fw={700}>Version:</Text> {about?.version}</Text>
                        <Text size="md"><Text span inherit fw={700}>Documentation:</Text> <Link to={docUrl}>{docUrl}</Link></Text>
                        <Text size="md"><Text span inherit fw={700}>Repository:</Text> <Link to={repoUrl}>{repoUrl}</Link></Text>
                        <Switch styles={{ label: {fontWeight: 700}}} label="Enabled:" labelPosition="left" size="md" checked={enabled} onChange={() => togglePlugin()} />
                        <Divider mt="md" />
                        <Markdown>{about?.description}</Markdown>
                    </ScrollArea>
                </Tabs.Panel>

                <Tabs.Panel value="ui">

                    <ScrollArea type="never" scrollbars={false} style={{height:"90vh"}}>
                        {pluginName && <iframe title="PluginUI" style={{overflow:"hidden", position: "relative", flex: 1, width: "100%", height: "90vh", border: 0, scrollbarColor: "transparent"}} src={`/api/plugins/${pluginName}/ui`} />}
                    </ScrollArea>
                </Tabs.Panel>

                <Tabs.Panel value="settings">
                    <CodeMirror value={editedConfig} height="100%" extensions={[yaml()]} theme={computedColorScheme} onChange={(e) => setEditedConfig(e)} />

                    <Button mt="md" mr="md" leftSection={<IconDeviceFloppy size={14} />} onClick={() => submit()}>Save</Button>
                    <Button mt="md" leftSection={<IconRestore size={14} />} onClick={() => undoChanges()}>Undo Changes</Button>

                </Tabs.Panel>

            </Tabs>
        </div>
    )
}
