import React, { useEffect, useState } from 'react';
import {
    Button,
    NumberInput,
    Paper,
    Select,
    Title,
} from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import axios from '../axios_config';
import { apiRoutes } from '../apiRoutes';
import { t } from 'i18next';

const LAYER_OPTIONS = [
    'OSM',
    'Google Streets',
    'Google Hybrid',
    'Google Terrain',
    'ESRI World Imagery (Clarity) Beta',
    'ESRI World Topo',
];

export default function Settings() {
    const [lat, setLat] = useState<number>(10);
    const [lon, setLon] = useState<number>(0);
    const [zoom, setZoom] = useState<number>(3);
    const [layer, setLayer] = useState<string>('OSM');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(apiRoutes.adminSettings)
            .then(r => {
                if (r.status === 200) {
                    setLat(r.data.OTS_MAP_DEFAULT_LAT);
                    setLon(r.data.OTS_MAP_DEFAULT_LON);
                    setZoom(r.data.OTS_MAP_DEFAULT_ZOOM);
                    setLayer(r.data.OTS_MAP_DEFAULT_LAYER);
                }
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                if (err.response && err.response.status === 404) {
                    notifications.show({
                        title: t('Settings unavailable'),
                        message: t('This feature requires a newer version of OpenTAKServer'),
                        icon: <IconX />,
                        color: 'orange',
                    });
                } else {
                    notifications.show({
                        title: t('Failed to load settings'),
                        message: err.response?.data?.error || String(err),
                        icon: <IconX />,
                        color: 'red',
                    });
                }
            });
    }, []);

    function saveSettings() {
        axios.put(apiRoutes.adminSettings, {
            OTS_MAP_DEFAULT_LAT: lat,
            OTS_MAP_DEFAULT_LON: lon,
            OTS_MAP_DEFAULT_ZOOM: zoom,
            OTS_MAP_DEFAULT_LAYER: layer,
        }).then(r => {
            if (r.status === 200) {
                notifications.show({
                    message: t('Settings saved'),
                    icon: <IconCheck />,
                    color: 'green',
                });
            }
        }).catch(err => {
            notifications.show({
                title: t('Failed to save settings'),
                message: err.response?.data?.error || String(err),
                icon: <IconX />,
                color: 'red',
            });
        });
    }

    return (
        <>
            <Title order={3} mb="md">{t('Map Defaults')}</Title>
            <Paper shadow="xs" p="md" withBorder maw={400}>
                <NumberInput
                    label={t('Default Latitude')}
                    value={lat}
                    onChange={(v) => setLat(Number(v))}
                    min={-90}
                    max={90}
                    decimalScale={6}
                    step={0.1}
                    mb="md"
                    disabled={loading}
                />
                <NumberInput
                    label={t('Default Longitude')}
                    value={lon}
                    onChange={(v) => setLon(Number(v))}
                    min={-180}
                    max={180}
                    decimalScale={6}
                    step={0.1}
                    mb="md"
                    disabled={loading}
                />
                <NumberInput
                    label={t('Default Zoom')}
                    value={zoom}
                    onChange={(v) => setZoom(Number(v))}
                    min={1}
                    max={20}
                    mb="md"
                    disabled={loading}
                />
                <Select
                    label={t('Default Map Layer')}
                    value={layer}
                    onChange={(v) => setLayer(v || 'OSM')}
                    data={LAYER_OPTIONS}
                    mb="md"
                    disabled={loading}
                    allowDeselect={false}
                />
                <Button onClick={saveSettings} disabled={loading}>{t('Save')}</Button>
            </Paper>
        </>
    );
}
