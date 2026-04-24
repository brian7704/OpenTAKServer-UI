import {
    Modal,
    Select,
    Table,
    TableData,
    TextInput,
    useComputedColorScheme,
    Button,
    Pagination,
    Center,
    Switch,
    ComboboxItem,
    ScrollArea
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { IconCircleMinus, IconUpload, IconX, IconDownload, IconCheck } from '@tabler/icons-react';
import axios from '../axios_config';
import { notifications } from '@mantine/notifications';
import { formatISO, parseISO } from 'date-fns';
import { apiRoutes } from '../apiRoutes';
import {t} from "i18next";
import DynamicForm from "../components/DynamicForm"

export default function ServerSettings() {
    const [serverSettings, setServerSettings] = useState({});

    useEffect(() => {
        console.log('Server Settings Loaded');
        console.log(serverSettings);
    }, [serverSettings]);

    function update_settings() {
        axios.post(apiRoutes.settings, serverSettings).then((r) => {
            if (r.status === 200) {
                notifications.show({
                    icon: <IconCheck />,
                    message: t('Successfully Updated Settings'),
                    color: 'green',
                })
            }
        }).catch((err) => {
            notifications.show({
                icon: <IconX />,
                message: err.response.data.message,
                title: t('Failed To Updated Settings'),
                color: 'red',
            })
        })
    }

    return (
        <ScrollArea>
            <Button mb="md" component="a" href={apiRoutes.downloadConfig} rightSection={<IconDownload size={14} />}>{t('Download config.yml')}</Button>
            <DynamicForm formUrl={apiRoutes.settingsForm} dataUrl={apiRoutes.settings} onChange={setServerSettings} />
            <Button mt="md" onClick={() => {update_settings();}}>{t('Submit')}</Button>
        </ScrollArea>
    )
}
