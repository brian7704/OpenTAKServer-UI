import React, { useEffect, useState } from 'react';
import { Text, Alert, Grid, Center, Title, Divider } from '@mantine/core';
import axios from '../../axios_config';
import { apiRoutes } from '../../config';

export default function Dashboard() {
    const [alerts, setAlerts] = useState(null);
    const [serverStatus, setServerStatus] = useState(null);
    const [disk, setDisk] = useState(null);
    const [memory, setMemory] = useState(null);

    function formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
    }

    useEffect(() => {
        if (alerts === null) {
            axios.get(
                apiRoutes.status
            ).then(r => {
                if (r.status === 200) {
                    const ots_alerts = [];
                    ots_alerts.push(
                            <Alert radius="md" p="xl" color={r.data.cot_router ? 'green' : 'red'} title="CoT Router" mr="md" mb="md">
                                <Center><Text>{r.data.cot_router ? 'Online' : 'Offline'}</Text></Center>
                            </Alert>
                    );

                    ots_alerts.push(
                        <Alert radius="md" p="xl" color={r.data.tcp ? 'green' : 'red'} title="TCP" mr="md" mb="md">
                            <Center><Text>{r.data.tcp ? 'Online' : 'Offline'}</Text></Center>
                        </Alert>
                    );

                    ots_alerts.push(
                        <Alert radius="md" p="xl" color={r.data.ssl ? 'green' : 'red'} title="SSL" mr="md" mb="md">
                            <Center><Text>{r.data.ssl ? 'Online' : 'Offline'}</Text></Center>
                        </Alert>
                    );

                    ots_alerts.push(
                        <Alert radius="md" p="xl" title="Online EUDs" mr="md" mb="md">
                            <Center><Text>{Object.keys(r.data.online_euds).length}</Text></Center>
                        </Alert>
                    );
                    setAlerts(ots_alerts);

                    const server_status = [];
                    server_status.push(
                        <Alert radius="md" mr="md" mb="md" title="CPU Percent">
                            <Center>{`${r.data.cpu_percent}%`}</Center>
                        </Alert>
                    );

                    const disk_status = [];
                    disk_status.push(
                        <Alert radius="md" mr="md" mb="md" title="Disk Free Space">
                            <Center>{formatBytes(r.data.disk_usage.free)}</Center>
                        </Alert>
                    );

                    disk_status.push(
                        <Alert radius="md" mr="md" mb="md" title="Disk Used Space">
                            <Center>{formatBytes(r.data.disk_usage.used)}</Center>
                        </Alert>
                    );

                    disk_status.push(
                        <Alert radius="md" mr="md" mb="md" title="Disk Total Size">
                            <Center>{formatBytes(r.data.disk_usage.total)}</Center>
                        </Alert>
                    );

                    disk_status.push(
                        <Alert radius="md" mr="md" mb="md" title="Disk Used Percent">
                            <Center>{`${r.data.disk_usage.percent}%`}</Center>
                        </Alert>
                    );

                    setDisk(disk_status);

                    const memory_status = [];
                    memory_status.push(
                        <Alert radius="md" mr="md" mb="md" title="Memory Available">
                            <Center>{formatBytes(r.data.memory.available)}</Center>
                        </Alert>
                    );

                    memory_status.push(
                        <Alert radius="md" mr="md" mb="md" title="Memory Free">
                            <Center>{formatBytes(r.data.memory.free)}</Center>
                        </Alert>
                    );

                    memory_status.push(
                        <Alert radius="md" mr="md" mb="md" title="Memory Used">
                            <Center>{formatBytes(r.data.memory.used)}</Center>
                        </Alert>
                    );

                    memory_status.push(
                        <Alert radius="md" mr="md" mb="md" title="Total Memory">
                            <Center>{formatBytes(r.data.memory.total)}</Center>
                        </Alert>
                    );

                    memory_status.push(
                        <Alert radius="md" mr="md" mb="md" title="Memory Percent">
                            <Center>{`${r.data.memory.percent}%`}</Center>
                        </Alert>
                    );

                    setMemory(memory_status);

                    setServerStatus(server_status);
                }
            }).catch(err => {});
        }
    }, [alerts]);

    return (
        <div>
            <Center>
                <Title mb="xl" order={2}>OpenTAKServer Status</Title>
            </Center>
            <Center>
                <Grid>
                    {alerts}
                </Grid>
            </Center>
            <Divider my="lg" />
            <Center>
                <Title mb="xl" order={2}>Server Status</Title>
            </Center>
            <Center mb="xl">
                <Grid>
                    {disk}
                </Grid>
            </Center>
            <Center mb="xl">
                <Grid>
                    {memory}
                </Grid>
            </Center>
        </div>
    );
}
