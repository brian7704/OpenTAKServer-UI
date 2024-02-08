import {
    Anchor,
    Button,
    Center, Divider, Flex, Grid,
    Modal, NumberInput,
    Switch,
    Text,
    TextInput,
} from '@mantine/core';
import React, { ReactElement, useEffect, useState } from 'react';
import {IconCheck, IconX} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import axios from '../axios_config';
import { apiRoutes } from '../config';

interface SettingsObject {
    [key:string]: any;
}

export default function AdminSettings() {
    const [otsSettingsElements, setOtsSettingsElements] = useState<ReactElement[]>([]);
    const [mailSettingsElements, setMailSettingsElements] = useState<ReactElement[]>([]);
    const [settings, setSettings] = useState<SettingsObject>({});

    function changeSetting(key:string, value:string | boolean | number) {
        setSettings(settings => ({
            ...settings,
            [key]: value,
        }));
    }

    function getSettings() {
        axios.get(
            apiRoutes.adminSettings
        ).then(r => {
            if (r.status === 200) {
                setSettings(r.data.results);
            }
        }).catch(err => {
            console.log(err);
            notifications.show({
                title: 'Failed to get settings',
                message: err.message,
                icon: <IconX />,
                color: 'red',
            });
        });
    }

    function patchSettings() {
        axios.patch(
            apiRoutes.adminSettings,
            settings
        ).then(r => {
            if (r.status === 200) {
                getSettings();
                notifications.show({
                    title: 'Success',
                    message: 'Settings were successfully changed',
                    icon: <IconCheck />,
                    color: 'green',
                });
            }
        }).catch(err => {
            console.log(err);
            notifications.show({
                title: 'Error',
                message: 'Unable to change settings',
                icon: <IconX />,
                color: 'red',
            });
        });
    }

    useEffect(() => {
        getSettings();
    }, []);

    function settingDisabled(key:string) {
        return !(key.startsWith('MAIL') || key.startsWith('OTS_AIRPLANES_LIVE') || key === 'OTS_ENABLE_EMAIL' ||
            key === 'OTS_ENABLE_MUMBLE_AUTHENTICATION');
    }

    useEffect(() => {
        const otsSettings:ReactElement[] = [];
        const mailSettings:ReactElement[] = [];
        Object.keys(settings).map((key:string, index:number) => {
            if (typeof settings[key] === 'boolean') {
                const element = <Switch pb="md" disabled={settingDisabled(key)} key={key} label={<Text pr="md">{key}</Text>} checked={settings[key]} onClick={(e) => changeSetting(key, e.currentTarget.checked)} />;
                if (key.startsWith('OTS')) { otsSettings.push(element); } else if (key.startsWith('MAIL')) { mailSettings.push(element); }
            } else if (typeof settings[key] === 'number') {
                const element = <NumberInput disabled={settingDisabled(key)} pb="md" key={key} label={<Text pb="xs">{key}</Text>} value={settings[key]} onChange={(value) => changeSetting(key, value)} />;
                if (key.startsWith('OTS')) { otsSettings.push(element); } else if (key.startsWith('MAIL')) { mailSettings.push(element); }
            } else {
                const element = <TextInput disabled={settingDisabled(key)} pb="md" key={key} label={<Text pb="xs">{key}</Text>} value={settings[key]} onChange={(e) => { e.preventDefault(); changeSetting(key, e.currentTarget.value); }} />;
                if (key.startsWith('OTS')) { otsSettings.push(element); } else if (key.startsWith('MAIL')) { mailSettings.push(element); }
            }
        });
        setOtsSettingsElements(otsSettings);
        setMailSettingsElements(mailSettings);
    }, [settings]);

    return (
        <>
            <Grid>
                <Grid.Col span={3}>OTS Settings - See the <Anchor component="a" target="_blank" href="https://docs.opentakserver.io">documentation</Anchor> for details</Grid.Col>
                <Grid.Col span={9}>
                    {otsSettingsElements}
                </Grid.Col>
                <Grid.Col span={12}><Divider /></Grid.Col>
                <Grid.Col span={3}>
                    Flask-Mail settings - These settings will only take effect if OTS_ENABLE_EMAIL is set to True. See Flask-Mail's <Anchor component="a" target="_blank" href="https://pythonhosted.org/Flask-Mail/">documentation</Anchor> for details
                </Grid.Col>
                <Grid.Col span={9}>
                    {mailSettingsElements}
                </Grid.Col>
            </Grid>
            <Flex gap="md" justify="flex-start" align="center">
                    <Button mt="md" onClick={() => patchSettings()}>Apply</Button>
            </Flex>
        </>
    );
}
