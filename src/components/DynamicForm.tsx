import {
    Modal,
    Select,
    Table,
    TableData,
    TextInput,
    useComputedColorScheme,
    Button,
    Pagination, Center, Switch, ComboboxItem, NumberInput, VisuallyHidden
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { IconCircleMinus, IconUpload, IconX } from '@tabler/icons-react';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { formatISO, parseISO } from 'date-fns';
import { apiRoutes } from '../apiRoutes';
import {t} from "i18next";

interface Form {
    label: string;
    name: string;
    type: string;
    description: string;
    required: boolean;
    disabled: boolean;
    min: number;
    max: number;
    data: any;
}

interface Props {
    formUrl: string;
    dataUrl: string;
    onChange: Function;
}

interface Data {
    [key: string]: any;
}

export default function DynamicForm(props: Props) {
    const [profileForm, setProfileForm] = useState<any[]>([]);
    const [serverSettings, setServerSettings] = useState<Data>({});

    useEffect(() => {
        get_form();
    }, []);

    function get_form() {
        axios.get(props.formUrl).then(r => {
            let fields: any[] = [];
            let settings: Data = {}
            r.data.map((row: Form) => {

                settings[row.name] = row.data;

                if (row.type === "StringField") {
                    fields.push(<TextInput label={row.label} mb="md" id={row.name} disabled={row.disabled === true} required={row.required} defaultValue={row.data}
                                           onChange={(e) => setServerSettings((oldServerSettings) => ({
                                                                ...oldServerSettings,
                                                                [row.name]: e.currentTarget.value}))}/>);
                }
                else if (row.type === "BooleanField") {
                    fields.push(<Switch label={row.label} id={row.name} disabled={row.disabled === true}
                                        required={row.required} defaultChecked={row.data}
                                        mb="md" onChange={(e) => setServerSettings((oldServerSettings) => ({...oldServerSettings, [row.name]: e.currentTarget.checked}))}/>)
                }
                else if (row.type === "IntegerField" || row.type === "FloatField") {
                    fields.push(<NumberInput disabled={row.disabled === true} required={row.required} min={row.min} max={row.max}
                                             label={row.label} id={row.name}
                                             value={row.data} mb="md"
                                             onChange={(e) => setServerSettings((oldServerSettings) => ({
                                                 ...serverSettings,
                                                 [row.name]: e
                                             }))}/>)
                }
            })
            setServerSettings({...settings, csrf_token: localStorage.getItem("csrfToken")})
            setProfileForm(fields);
        })
    }

    useEffect(() => {
        console.log("1")
        console.log(serverSettings);
        props.onChange(serverSettings);
        console.log("2")
        console.log(serverSettings);
        if (profileForm.length === 0 && Object.keys(serverSettings).length > 0) {
            get_form();
        }
    }, [serverSettings])

    function get_data() {
        axios.get(props.dataUrl).then(r => {
            setServerSettings({...r.data, csrf_token: localStorage.getItem("csrfToken")});
        }).catch((error) => {
            console.log(error);
        })
    }

    return (
        <>{profileForm}</>
    )
}
