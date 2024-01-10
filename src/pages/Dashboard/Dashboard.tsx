import React, { useEffect, useState } from 'react';
import { Text, Alert, Grid, Center, Title, Divider, Paper } from '@mantine/core';
import axios from '../../axios_config';
import { apiRoutes } from '../../config';
import tools from '../../tools';

export default function Dashboard() {
    const [alerts, setAlerts] = useState({
        cot_router: false,
        tcp: false,
        ssl: false,
        online_euds: 0
    });
    const [serverStatus, setServerStatus] = useState({
        cpu_percent: 0
    });
    const [disk, setDisk] = useState({
        free: 0,
        used: 0,
        total: 0,
        percent: 0
    });
    const [memory, setMemory] = useState({
        available: 0,
        free: 0,
        used: 0,
        total: 0,
        percent: 0
    });

    useEffect(() => {
            axios.get(
                apiRoutes.status
            ).then(r => {
                if (r.status === 200) {
                    setAlerts({
                        cot_router: r.data.cot_router,
                        tcp: r.data.tcp,
                        ssl: r.data.ssl,
                        online_euds: r.data.online_euds
                    });
                    setServerStatus({cpu_percent: r.data.cpu_percent});
                    setDisk({
                        free: r.data.disk_usage.free,
                        used: r.data.disk_usage.used,
                        total: r.data.disk_usage.total,
                        percent: r.data.disk_usage.percent
                    })
                    setMemory({
                        available: r.data.memory.available,
                        free: r.data.memory.free,
                        used: r.data.memory.used,
                        total: r.data.memory.total,
                        percent: r.data.memory.percent
                    })
                }
            }).catch(err => {});
    }, []);

    return (
        <div>
            <Center>
                <Title mb="xl" order={2}>OpenTAKServer Status</Title>
            </Center>
            <Center>
                <Grid>
                    <Alert radius="md" p="xl" color={alerts.cot_router ? 'green' : 'red'} mr="md" mb="md" title="CoT Router">
                        <Center><Text>{alerts.cot_router ? 'Online' : 'Offline'}</Text></Center>
                    </Alert>
                    <Alert radius="md" p="xl" color={alerts.tcp ? 'green' : 'red'} mr="md" mb="md" title="TCP">
                        <Center><Text>{alerts.tcp ? 'Online' : 'Offline'}</Text></Center>
                    </Alert>
                    <Alert radius="md" p="xl" color={alerts.ssl ? 'green' : 'red'} mr="md" mb="md" title="SSL">
                        <Center><Text>{alerts.ssl ? 'Online' : 'Offline'}</Text></Center>
                    </Alert>
                    <Alert radius="md" p="xl" title="Online EUDs" mr="md" mb="md">
                        <Center><Text>{alerts.online_euds ? Object.keys(alerts.online_euds).length : 0}</Text></Center>
                    </Alert>
                </Grid>
            </Center>
            <Divider my="lg" />
            <Center>
                <Title mb="xl" order={2}>Server Status</Title>
            </Center>
            <Center mb="xl">
                <Grid>
                        <Alert radius="md" mr="md" mb="md" title="CPU Percent">
                            <Center>{`${serverStatus.cpu_percent}%`}</Center>
                        </Alert>
                        <Alert radius="md" mr="md" mb="md" title="Disk Free Space">
                            <Center>{`${tools(disk.free)}`}</Center>
                        </Alert>
                        <Alert radius="md" mr="md" mb="md" title="Disk Used Space">
                            <Center>{`${tools(disk.used)}`}</Center>
                        </Alert>
                        <Alert radius="md" mr="md" mb="md" title="Disk Total Space">
                            <Center>{`${tools(disk.total)}`}</Center>
                        </Alert>
                        <Alert radius="md" mr="md" mb="md" title="Disk Used Percentage">
                            <Center>{`${disk.percent}%`}</Center>
                        </Alert>
                </Grid>
            </Center>
            <Center>
                <Grid>
                        <Alert radius="md" mr="md" mb="md" title="Memory Available">
                            <Center>{`${tools(memory.available)}`}</Center>
                        </Alert>
                        <Alert radius="md" mr="md" mb="md" title="Free Memory">
                            <Center>{`${tools(memory.free)}`}</Center>
                        </Alert>
                        <Alert radius="md" mr="md" mb="md" title="Memory Used">
                            <Center>{`${tools(memory.used)}`}</Center>
                        </Alert>
                        <Alert radius="md" mr="md" mb="md" title="Memory Total">
                            <Center>{`${tools(memory.total)}`}</Center>
                        </Alert>
                        <Alert radius="md" mr="md" mb="md" title="Memory Used Percentage">
                            <Center>{`${memory.percent}%`}</Center>
                        </Alert>
                </Grid>
            </Center>
            <Center mb="xl">
                <Grid>
                    {}
                </Grid>
            </Center>
        </div>
    );
}
