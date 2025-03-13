import {useEffect, useState, DOMElement, ReactElement} from "react";
import CodeMirror from '@uiw/react-codemirror';
import { yaml } from '@codemirror/lang-yaml';
import {useSearchParams} from "react-router-dom";
import {Tabs, Table, TextInput, Button, Flex} from "@mantine/core";
import {IconAlignLeft, IconSettings, IconDeviceFloppy, IconRestore} from "@tabler/icons-react";
import { parse, stringify } from 'yaml'
import axios from "axios";

export default function Plugin() {
    const [params, setParams] = useSearchParams();
    const [originalConfig, setOriginalConfig] = useState("");
    const [editedConfig, setEditedConfig] = useState("");
    const [rows, setRows] = useState<ReactElement[]>()

    useEffect(() => {
        getConfig();
    }, []);

    function getConfig() {
        axios.get(`/api/plugins/${params.get("name")}/config`).then((r) => {
            if (r.status === 200) {
                setOriginalConfig(r.data);
                parseConfig(r.data)
            }
        })
    }

    function parseConfig(config:Object) {
        let tableRows:ReactElement[] = [];
        Object.entries(config).forEach(([key, value]) => {
            tableRows.push(<Table.Tr>
                <Table.Td>
                    <TextInput onChange={(e) => setEditedConfig(e.target.value)} label={key} value={JSON.stringify(value)} />
                </Table.Td>
            </Table.Tr>)
        })
        setRows(tableRows)
    }

    function restoreDefaults() {
        parseConfig(originalConfig);
    }

    return (
        <div>
            <Tabs defaultValue="ui">
                <Tabs.List>
                    <Tabs.Tab value="ui" leftSection={<IconAlignLeft size={16} />}>

                    </Tabs.Tab>
                    <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>

                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="ui">

                    <Flex style={{height:"100%"}}>
                        <iframe style={{position: "relative", flex: 1, width: "100%", height: "100vh", border: 0}} src={`/api/plugins/${params.get("name")}/ui`} />
                    </Flex>
                </Tabs.Panel>

                <Tabs.Panel value="settings">
                    {/*<CodeMirror value={editedConfigFile} height="100%" extensions={[yaml()]} onChange={(e) => onChange(e)} />*/}
                    <Table>
                        <Table.Tbody>
                            {rows}
                        </Table.Tbody>
                    </Table>

                    <Button leftSection={<IconDeviceFloppy />}>Save</Button>
                    <Button mb="md" leftSection={<IconRestore />} onClick={() => restoreDefaults()}>Restore Defaults</Button>

                </Tabs.Panel>

            </Tabs>
        </div>
    )
}
