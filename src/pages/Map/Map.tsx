import React, { ReactElement, useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { LayersControl, MapContainer, ScaleControl, TileLayer, useMap, WMSTileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'react-leaflet-fullscreen/styles.css';
import 'leaflet.marker.slideto';
import 'leaflet-rotatedmarker';
import { Divider, Drawer, Image, Paper, Table, Text, useComputedColorScheme } from '@mantine/core';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import * as milsymbol from 'milsymbol';
import { useDisclosure } from '@mantine/hooks';
import { apiRoutes } from '@/apiRoutes';
import { socket } from '@/socketio';
import classes from './Map.module.css';
import 'leaflet.fullscreen';
import 'leaflet.fullscreen/Control.FullScreen.css';
import Arrow from './Arrow';

export default function Map() {
    const [markers, setMarkers] = useState<{ [uid: string]: L.Marker }>({});
    const [circles, setCircles] = useState<{ [uid: string]: L.Circle }>({});
    const [rbLines, setRBLines] = useState<{ [uid: string]: L.Polyline }>({});
    const [haveMapState, setHaveMapState] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);
    const [drawerTitle, setDrawerTitle] = useState('');
    const [detailRows, setDetailRows] = useState<ReactElement[]>([]);
    const [positionRows, setPositionRows] = useState<ReactElement[]>([]);
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    const eudsLayer = new L.LayerGroup();
    const rbLinesLayer = new L.LayerGroup();
    const markersLayer = new L.LayerGroup();

    function formatDrawer(data:any) {
        const detail_rows:ReactElement[] = [];
        const position_rows:ReactElement[] = [];

        Object.keys(data).map((key, index) => {
            if (key !== 'point' && key !== 'last_point' && key !== 'icon') {
                detail_rows.push(
                    <Table.Tr>
                        <Table.Td><Text fw={700}>{key}</Text></Table.Td>
                        <Table.Td>{data[key]}</Table.Td>
                    </Table.Tr>
                );
            } else if (key === 'icon' && data[key] !== null) {
                detail_rows.push(
                    <Table.Tr>
                        <Table.Td><Text fw={700}>{key}</Text></Table.Td>
                        <Table.Td><Image src={data[key].bitmap} w="auto" fit="contain" /></Table.Td>
                    </Table.Tr>
                );
            } else if (data[key] !== null) {
                Object.keys(data[key]).map((point_key, point_index) => {
                    position_rows.push(
                        <Table.Tr>
                            <Table.Td><Text fw={700}>{point_key}</Text></Table.Td>
                            <Table.Td>{data[key][point_key]}</Table.Td>
                        </Table.Tr>
                    );

                    return null;
                });
            }
        });

        setDetailRows(detail_rows);
        setPositionRows(position_rows);
        return null;
    }

    function addEud(eud:any) {
        let className = classes.disconnected;
        if (eud.last_status === 'Connected') className = classes.connected;

        const arrowIcon = L.divIcon({
            html: renderToString(<Arrow fillColor={eud.team_color} className={className} />),
            iconSize: [40, 40],
            iconAnchor: [12, 24],
            popupAnchor: [7, -20],
            tooltipAnchor: [-4, -20],
            className,
        });

        const { uid } = eud;

        if (Object.hasOwn(markers, uid)) {
            markers[uid].setIcon(arrowIcon);
        } else if (eud.last_point !== null) {
                const marker = L.marker(
                    [eud.last_point.latitude, eud.last_point.longitude],
                    { icon: arrowIcon, rotationOrigin: 'center center' });

                marker.on('click', (e) => {
                    setDrawerTitle(eud.callsign);
                    formatDrawer(eud);
                    open();
                });

                marker.bindTooltip(eud.callsign, {
                    opacity: 0.7,
                    permanent: true,
                    direction: 'bottom',
                    offset: [12, 35],
                });

                eudsLayer.addLayer(marker);
                markers[eud.uid] = marker;
                setMarkers(markers);
            }
    }

    function MapContext() {
        const map = useMap();
        const fullscreenControl = L.control.fullscreen();
        map.addControl(fullscreenControl);

        useEffect(() => {
            map.addLayer(eudsLayer);
            map.addLayer(rbLinesLayer);
            map.addLayer(markersLayer);

            function onPointEvent(value: any) {
                const { uid } = value;
                if (Object.hasOwn(markers, uid)) {
                    // @ts-ignore trust me bro
                    markers[uid].slideTo([value.latitude, value.longitude],
                        { duration: 1500, keepAtCenter: false });
                    markers[uid].setRotationAngle(value.course - 90);
                }
            }

            function onRBLine(value: any) {
                const { uid } = value;
                if (Object.hasOwn(rbLines, uid)) {
                    map.removeLayer(rbLines[uid]);
                }
                const start_point = [value.point.latitude, value.point.longitude];
                const end_point = [value.end_latitude, value.end_longitude];
                rbLines[uid] = L.polyline([start_point, end_point], {
                    color: `#${value.color_hex.slice(2)}`,
                    weight: value.stroke_weight,
                }).addTo(rbLinesLayer);
                setRBLines(rbLines);
            }

            function onMarker(value: any) {
                const { uid } = value;

                if (Object.hasOwn(value, 'iconset_path') &&
                    value.iconset_path !== null &&
                    value.iconset_path.includes('COT_MAPPING_SPOTMAP')) {
                        if (Object.hasOwn(circles, uid)) {
                            map.removeLayer(circles[uid]);
                        }
                        const circle = L.circle(
                            [value.point.latitude, value.point.longitude],
                            { radius: 5, color: `#${value.color_hex.slice(2)}` }
                        );
                        circle.bindTooltip(value.callsign, {
                            opacity: 0.7,
                            permanent: true,
                            direction: 'bottom',
                        });
                        circle.on('click', (e) => {
                            setDrawerTitle(value.callsign);
                            formatDrawer(value);
                            open();
                        });
                        circles[uid] = circle;
                        setCircles(circles);
                        circle.addTo(map);
                } else {
                    let marker = L.marker([value.point.latitude, value.point.longitude]);
                    if (Object.hasOwn(markers, uid)) {
                        marker = markers[uid];
                    }

                    marker.bindTooltip(value.callsign, {
                        opacity: 0.7,
                        permanent: true,
                        direction: 'bottom',
                        offset: [12, 35],
                    });

                    marker.on('click', (e) => {
                        setDrawerTitle(value.callsign);
                        formatDrawer(value);
                        open();
                    });

                    if (value.mil_std_2525c !== null && value.icon === null) {
                        const options = { size: 25, direction: undefined };
                        if (value.point !== null && value.point.course !== null) {
                            options.direction = value.point.course;
                        }
                        const symbol = new milsymbol.default.Symbol(value.mil_std_2525c, options);
                        marker.setIcon(L.divIcon({
                            className: '',
                            html: symbol.asSVG(),
                            iconAnchor: new L.Point(symbol.getAnchor().x, symbol.getAnchor().y),
                            tooltipAnchor: [-13, -13],
                        }));
                    } else if (value.icon !== null) {
                        marker.setIcon(L.icon({
                            iconUrl: value.icon.bitmap,
                            shadowUrl: value.icon.shadow,
                            iconAnchor: [12, 24],
                            popupAnchor: [7, -20],
                            tooltipAnchor: [-7, -15],
                        }));
                    } else {
                        marker.setIcon(L.icon({
                            iconUrl: '/map_icons/marker-icon.png',
                            shadowUrl: '/map_icons/marker-shadow.png',
                            iconAnchor: [12, 24],
                            popupAnchor: [7, -20],
                            tooltipAnchor: [-4, -10],
                        }));
                    }

                    if (Object.hasOwn(markers, uid)) {
                        // @ts-ignore trust me bro
                        markers[uid].slideTo([value.point.latitude, value.point.longitude],
                            { duration: 2000, keepAtCenter: false });
                    } else {
                        marker.addTo(markersLayer);
                    }
                    markers[uid] = marker;
                    setMarkers(markers);
                }
            }

            function onEud(value: any) {
                addEud(value);
            }

            if (!haveMapState) {
                axios.get(
                    apiRoutes.mapState
                ).then(r => {
                    if (r.status === 200) {
                        r.data.euds.map((eud: any, index: any) => {
                            addEud(eud);
                            return null;
                        });
                        r.data.markers.map((marker: any, index: any) => {
                            onMarker(marker);
                            return null;
                        });
                        r.data.rb_lines.map((rb_line: any, index: any) => {
                            onRBLine(rb_line);
                            return null;
                        });
                    }
                }).catch(err => {
                    console.log(err);
                    notifications.show({
                        message: 'Failed to get map state',
                        color: 'red',
                        icon: <IconX />,
                    });
                });
                setHaveMapState(true);
            }

            socket.on('point', onPointEvent);
            socket.on('rb_line', onRBLine);
            socket.on('marker', onMarker);
            socket.on('eud', onEud);

            return () => {
                socket.off('point', onPointEvent);
                socket.off('rb_line', onRBLine);
                socket.off('marker', onMarker);
                socket.off('eud', onEud);

                // janky fix for duplicate fullscreen buttons
                const elementsToRemove =
                    fullscreenControl.getContainer()?.getElementsByClassName('leaflet-control-zoom-fullscreen') ?? [];
                for (let i = 0; i < elementsToRemove.length; i++) {
                    elementsToRemove[i].remove();
                }
            };
        }, []);

        return null;
    }

    return (
        <>
            <Drawer
              radius="md"
              position="right"
              opened={opened}
              onClose={close}
              title={drawerTitle}
              overlayProps={{ backgroundOpacity: 0 }}
              shadow="xl"
            >
                <Divider label="Details" labelPosition="left" color={computedColorScheme === 'light' ? 'black' : 'gray.4'} />
                <Table>
                    {detailRows}
                </Table>
                <Divider label="Position" labelPosition="left" color={computedColorScheme === 'light' ? 'black' : 'gray.4'} />
                <Table>
                    {positionRows}
                </Table>
            </Drawer>
            <Paper shadow="xl" radius="md" p="md" withBorder>
                <MapContainer
                  center={[10, 0]}
                  zoom={3}
                  scrollWheelZoom
                  style={{ height: 'calc(100vh - 10rem)', width: '100%', zIndex: 90 }}
                >
                    <MapContext />
                    <ScaleControl />
                    <LayersControl>
                        <LayersControl.BaseLayer name="OSM" checked>
                            <TileLayer
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              zIndex={0}
                              minZoom={0}
                              maxZoom={20}
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name="Google Streets">
                            <TileLayer url="http://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" zIndex={0} minZoom={0} maxZoom={20} />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name="Google Hybrid">
                            <TileLayer url="http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga" zIndex={0} minZoom={0} maxZoom={20} />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name="Google Terrain">
                            <TileLayer url="http://mt1.google.com/vt/lyrs=p&amp;x={x}&amp;y={y}&amp;z={z}" zIndex={0} minZoom={0} maxZoom={20} />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name="ESRI World Imagery (Clarity) Beta">
                            <TileLayer url="http://clarity.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" minZoom={0} maxZoom={20} />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name="ESRI World Topo">
                            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}" minZoom={0} maxZoom={20} />
                        </LayersControl.BaseLayer>
                    </LayersControl>
                    <LayersControl position="topright">
                        <LayersControl.Overlay name="Google Street View Coverage">
                            <TileLayer
                              url="https://www.google.com/maps/vt?pb=!1m7!8m6!1m3!1i{z}!2i{x}!3i{y}!2i9!3x1!2m8!1e2!2ssvv!4m2!1scc!2s*211m3*211e2*212b1*213e2*212b1*214b1!4m2!1ssvl!2s*211b0*212b1!3m8!2sen!3sus!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m4!1e0!8m2!1e1!1e1!6m6!1e12!2i2!11e0!39b0!44e0!50e0"
                              pane="overlayPane"
                            />
                        </LayersControl.Overlay>
                        <LayersControl.Overlay name="Weather">
                            <WMSTileLayer
                              url="http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi"
                              params={{
                                layers: 'nexrad-n0r-900913',
                                format: 'image/png',
                                transparent: true }}
                              attribution="Weather data © 2012 IEM Nexrad"
                              pane="overlayPane"
                            />
                        </LayersControl.Overlay>
                        <LayersControl.Overlay name="Google Roads Overlay">
                            <TileLayer url="http://mt1.google.com/vt/lyrs=h&amp;x={x}&amp;y={y}&amp;z={z}" pane="overlayPane" />
                        </LayersControl.Overlay>
                        <LayersControl.Overlay name="Google Terrain Overlay">
                            <TileLayer url="http://mt1.google.com/vt/lyrs=t&amp;x={x}&amp;y={y}&amp;z={z}" pane="overlayPane" />
                        </LayersControl.Overlay>
                    </LayersControl>
                </MapContainer>
            </Paper>
        </>
    );
}
