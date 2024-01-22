import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, ScaleControl, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FullscreenControl } from 'react-leaflet-fullscreen';
import L, { polyline } from 'leaflet';
import 'react-leaflet-fullscreen/styles.css';
import 'leaflet.marker.slideto';
import { Paper } from '@mantine/core';
import { socket } from '../../socketio';

export default function Map() {
    const [markers, setMarkers] = useState<{ [uid: string]: L.Marker }>({});
    const [rbLines, setRBLines] = useState<{ [uid: string]: L.Polyline }>({});

    function MapContext() {
        const map = useMap();

        useEffect(() => {
            const pointsLayer = new L.LayerGroup();
            map.addLayer(pointsLayer);

            function onPointEvent(value: any) {
                const { uid } = value;
                if (Object.hasOwn(markers, uid)) {
                    // @ts-ignore trust me bro
                    markers[uid].slideTo([value.latitude, value.longitude]);
                } else {
                    const arrowIcon = L.icon({
                        iconUrl: '/map_icons/arrow.svg',
                        iconSize: [40, 40],
                        iconAnchor: [12, 24],
                        popupAnchor: [7, -20],
                        tooltipAnchor: [-4, -10],
                    });
                    const description = `<strong>Callsign:</strong>${value.callsign}`;
                    const marker = L.marker([value.latitude, value.longitude], { icon: arrowIcon });
                    marker.bindPopup(description);
                    marker.bindTooltip(value.callsign, { opacity: 0.7, permanent: true, direction: 'bottom', offset: [12, 35] });
                    pointsLayer.addLayer(marker);
                    markers[uid] = marker;
                    setMarkers(markers);
                }
            }

            function onRBLine(value:any) {
                const { uid } = value;
                if (Object.hasOwn(rbLines, uid)) {
                    map.removeLayer(rbLines[uid]);
                }
                const start_point = [value.point.latitude, value.point.longitude];
                const end_point = [value.end_latitude, value.end_longitude];
                const polyline = L.polyline([start_point, end_point], { color: `#${value.color_hex.slice(2)}`, weight: value.stroke_weight }).addTo(map);
                rbLines[uid] = polyline;
                setRBLines(rbLines);
            }

            socket.on('point', onPointEvent);
            socket.on('rb_line', onRBLine);
            socket.on('marker', onMarker)

            return () => {
                socket.off('point', onPointEvent);
                socket.off('rb_line', onRBLine);
                socket.off('marker', onMarker)
            };
        }, []);

        function onMarker(value:any) {
            const { uid } = value;
            if (Object.hasOwn(markers, uid)) {
                map.removeLayer(markers[uid])
            }

            console.log(value);
            let iconurl = value.iconset_path.split("/")
            iconurl.shift();
            iconurl = iconurl.join("/");
            console.log(iconurl);

            const icon = L.icon({
                iconUrl: `/map_icons/${iconurl}`,
                iconSize: [40, 40],
                iconAnchor: [12, 24],
                popupAnchor: [7, -20],
                tooltipAnchor: [-4, -10],
            })
            const marker = L.marker([value.point.latitude, value.point.longitude], { icon });
            marker.bindTooltip(value.callsign, { opacity: 0.7, permanent: true, direction: 'bottom', offset: [12, 35] });
            markers[uid] = marker;
            setMarkers(markers);
            marker.addTo(map);
        }

        return null;
    }

    return (
        <Paper shadow="xl" radius="md" p="md" withBorder>
            <MapContainer
              center={[10, 0]}
              zoom={3}
              scrollWheelZoom
              style={{ height: 'calc(100vh - 10rem)', width: '100%', zIndex: 125 }}
            >
                <MapContext />
                <ScaleControl />
                <FullscreenControl />
                <LayersControl>
                    <LayersControl.BaseLayer name="OSM" checked>
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Google Hybrid">
                        <TileLayer url="http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga" />
                    </LayersControl.BaseLayer>
                </LayersControl>
                <LayersControl position="topright">
                    <LayersControl.Overlay name="Street Maps Coverage">
                        <TileLayer
                          url="https://www.google.com/maps/vt?pb=!1m7!8m6!1m3!1i{z}!2i{x}!3i{y}!2i9!3x1!2m8!1e2!2ssvv!4m2!1scc!2s*211m3*211e2*212b1*213e2*212b1*214b1!4m2!1ssvl!2s*211b0*212b1!3m8!2sen!3sus!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m4!1e0!8m2!1e1!1e1!6m6!1e12!2i2!11e0!39b0!44e0!50e0"
                          zIndex={9999}
                        />
                    </LayersControl.Overlay>
                </LayersControl>
            </MapContainer>
        </Paper>
    );
}
