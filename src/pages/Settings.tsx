import React, { useEffect, useRef, useState } from 'react';
import {
    Button,
    Grid,
    NumberInput,
    Paper,
    Select,
    Title,
} from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
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

const TILE_URLS: Record<string, string> = {
    'OSM': 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    'Google Streets': 'http://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    'Google Hybrid': 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga',
    'Google Terrain': 'http://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    'ESRI World Imagery (Clarity) Beta': 'http://clarity.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    'ESRI World Topo': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
};

function MapEvents({ onClickMap, onZoomEnd }: { onClickMap: (lat: number, lon: number) => void, onZoomEnd: (zoom: number) => void }) {
    useMapEvents({
        click(e) {
            onClickMap(e.latlng.lat, e.latlng.lng);
        },
        zoomend(e) {
            onZoomEnd(e.target.getZoom());
        },
    });
    return null;
}

function MapSync({ lat, lon, zoom }: { lat: number, lon: number, zoom: number }) {
    const map = useMap();
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        map.setView([lat, lon], zoom);
    }, [lat, lon, zoom]);

    return null;
}

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
            <Grid>
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Paper shadow="xs" p="md" withBorder>
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
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Paper shadow="xs" p="md" withBorder>
                        {!loading && <MapContainer
                            center={[lat, lon]}
                            zoom={zoom}
                            scrollWheelZoom
                            style={{ height: '500px', width: '100%' }}
                        >
                            <TileLayer
                                url={TILE_URLS[layer] || TILE_URLS['OSM']}
                                key={layer}
                                minZoom={0}
                                maxZoom={20}
                            />
                            <MapEvents
                                onClickMap={(newLat, newLon) => {
                                    setLat(parseFloat(newLat.toFixed(6)));
                                    setLon(parseFloat(newLon.toFixed(6)));
                                }}
                                onZoomEnd={(newZoom) => {
                                    setZoom(newZoom);
                                }}
                            />
                            <MapSync lat={lat} lon={lon} zoom={zoom} />
                        </MapContainer>}
                    </Paper>
                </Grid.Col>
            </Grid>
        </>
    );
}
