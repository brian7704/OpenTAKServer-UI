import React, {useEffect, useState, ReactElement} from "react";
import CodeMirror from '@uiw/react-codemirror';
import { yaml } from '@codemirror/lang-yaml';
import {useSearchParams} from "react-router-dom";
import {Tabs, Table, TextInput, Button, Flex, useComputedColorScheme} from "@mantine/core";
import {IconAlignLeft, IconSettings, IconDeviceFloppy, IconRestore, IconX, IconCheck} from "@tabler/icons-react";
import { parse, stringify } from 'yaml'
import axios from "axios";
import {notifications} from "@mantine/notifications";

export default function Plugin() {
    const [params, setParams] = useSearchParams();
    const [originalConfig, setOriginalConfig] = useState("");
    const [editedConfig, setEditedConfig] = useState("");
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    useEffect(() => {
        getConfig();
    }, []);

    function getConfig() {
        axios.get(`/api/plugins/${params.get("name")}/config`).then((r) => {
            if (r.status === 200) {
                setOriginalConfig(r.data);
                setEditedConfig(stringify(r.data));
            }
        })
    }

    function undoChanges() {
        setEditedConfig(stringify(originalConfig));
    }

    function submit() {
        // parse yaml to make sure it's valid
        // post to backend
        // backend plugin validates
        // display success or failure message
        try {
            let config = parse(editedConfig);
            axios.post(`/api/plugins/${params.get("name")}/config`, config).then((r) => {
                if (r.status === 200) {
                    notifications.show({
                        title: 'Success',
                        message: 'Successfully Updated Plugin Config',
                        icon: <IconCheck />,
                        color: 'green'
                    })
                }
            }).catch((err) => {
                notifications.show({
                    title: 'Failed to update plugin config',
                    message: err.data.error,
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
                message: message,
                icon: <IconX />,
                color: 'red',
            });
        }
    }

    return (
        <div>
            <Tabs defaultValue="ui">
                <Tabs.List>
                    <Tabs.Tab value="ui" leftSection={<IconAlignLeft size={16} />}>
                        UI
                    </Tabs.Tab>
                    <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>
                        Settings
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="ui">

                    <Flex style={{height:"100%"}}>
                        <iframe style={{position: "relative", flex: 1, width: "100%", height: "100vh", border: 0}} src={`/api/plugins/${params.get("name")}/ui`} />
                    </Flex>
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
