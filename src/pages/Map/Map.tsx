import React from 'react'
import {MapContainer, TileLayer, useMap, ScaleControl, Marker, Popup, LayersControl} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/images/marker-icon.png'
import 'leaflet/dist/images/marker-shadow.png'
import { FullscreenControl } from "react-leaflet-fullscreen";
import "react-leaflet-fullscreen/styles.css";
import {Box, Paper} from "@mantine/core";

const Map = () => {
    return (
        <Paper shadow="md" radius="md" p="md" bg="gray.1">
                <MapContainer center={[10, 0]} zoom={3} scrollWheelZoom={true}
                              style={{height: 'calc(100vh - 10rem)', width: '100%'}}>
                    <ScaleControl />
                    <FullscreenControl />
                    <LayersControl>
                        <LayersControl.BaseLayer name="OSM" checked={true}>
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
                            <TileLayer url="https://www.google.com/maps/vt?pb=!1m7!8m6!1m3!1i{z}!2i{x}!3i{y}!2i9!3x1!2m8!1e2!2ssvv!4m2!1scc!2s*211m3*211e2*212b1*213e2*212b1*214b1!4m2!1ssvl!2s*211b0*212b1!3m8!2sen!3sus!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m4!1e0!8m2!1e1!1e1!6m6!1e12!2i2!11e0!39b0!44e0!50e0"
                            zIndex={9999}/>
                        </LayersControl.Overlay>
                    </LayersControl>
                </MapContainer>
        </Paper>
    )
}

export default Map
