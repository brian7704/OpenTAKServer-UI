import React from 'react'
import {MapContainer, TileLayer, useMap, ScaleControl, Marker, Popup} from 'react-leaflet'
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
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </MapContainer>
        </Paper>
    )
}

export default Map
