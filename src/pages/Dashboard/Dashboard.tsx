import React, { useEffect, useState } from 'react';
import { Text, Center, Title, Divider, Paper, useComputedColorScheme, Flex } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { AreaChart, DonutChart } from '@mantine/charts';
import axios from '../../axios_config';
import { apiRoutes } from '../../config';
import bytes_formatter from '../../bytes_formatter';
import '@mantine/charts/styles.css';

export default function Dashboard() {
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const [alerts, setAlerts] = useState({
        cot_router: false,
        tcp: false,
        ssl: false,
        online_euds: 0,
    });
    const [serverStatus, setServerStatus] = useState({
        cpu_percent: 0,
    });
    const [disk, setDisk] = useState({
        free: 0,
        used: 0,
        total: 0,
        percent: 0,
    });
    const [memory, setMemory] = useState({
        available: 0,
        free: 0,
        used: 0,
        total: 0,
        percent: 0,
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
                        online_euds: r.data.online_euds,
                    });
                    setServerStatus({ cpu_percent: r.data.cpu_percent });
                    setDisk({
                        free: r.data.disk_usage.free,
                        used: r.data.disk_usage.used,
                        total: r.data.disk_usage.total,
                        percent: r.data.disk_usage.percent,
                    });
                    setMemory({
                        available: r.data.memory.available,
                        free: r.data.memory.free,
                        used: r.data.memory.used,
                        total: r.data.memory.total,
                        percent: r.data.memory.percent,
                    });
                }
            }).catch(err => {
                console.log(err);
            });
    }, []);

    return (
        <>
            <Center>
                <Title mb="xl" order={2}>OpenTAKServer Status</Title>
            </Center>
            <Center>
                <Flex direction={{ base: 'column', xs: 'row' }}>
                    <Paper withBorder shadow="xl" radius="md" p="xl" mr="md" mb="md">
                        <Center mb="md"><Title order={4}>CoT Router</Title></Center>
                        <Center>{alerts.cot_router ? <IconCheck color="green" /> : <IconX color="red" />}</Center>
                    </Paper>
                    <Paper withBorder shadow="xl" radius="md" p="xl" mr="md" mb="md">
                        <Center mb="md"><Title order={4}>TCP</Title></Center>
                        <Center>{alerts.tcp ? <IconCheck color="green" /> : <IconX color="red" />}</Center>
                    </Paper>
                    <Paper withBorder shadow="xl" radius="md" p="xl" mr="md" mb="md">
                        <Center mb="md"><Title order={4}>SSL</Title></Center>
                        <Center>{alerts.ssl ? <IconCheck color="green" /> : <IconX color="red" />}</Center>
                    </Paper>
                    <Paper withBorder shadow="xl" radius="md" p="xl" mr="md" mb="md">
                        <Center mb="md"><Title order={4}>Online EUDs</Title></Center>
                        <Center><Text>{alerts.online_euds ? Object.keys(alerts.online_euds).length : 0}</Text></Center>
                    </Paper>
                </Flex>
            </Center>
            <Divider my="lg" />
            <Center>
                <Title mb="xl" order={2}>Server Status</Title>
            </Center>
            <Center mb="xl">
                <Flex direction={{ base: 'column', xs: 'row' }}>
                    <Paper withBorder shadow="xl" radius="md" p="xl" mr="md" mb="md">
                        <Center mb="md"><Title order={4}>CPU Usage</Title></Center>
                        <Center>
                            <DonutChart
                                data={[
                                    { name: 'Used Percentage', value: serverStatus.cpu_percent, color: 'blue' },
                                    { name: 'Idle Percentage', value: 100 - serverStatus.cpu_percent, color: 'gray.6' },
                                ]}
                            />
                        </Center>
                        <Center><Text fw={700} size="md" c="blue.9">{`${serverStatus.cpu_percent}%`}</Text></Center>
                    </Paper>
                    <Paper withBorder shadow="xl" radius="md" p="xl" mr="md" mb="md">
                        <Center mb="md"><Title order={4}>Disk Usage</Title></Center>
                        <Center>
                            <DonutChart
                              data={[
                                    { name: 'Used Percentage', value: disk.percent, color: 'blue' },
                                    { name: 'Free Percentage', value: 100 - disk.percent, color: 'gray.6' },
                                ]}
                            />
                        </Center>
                        <Center><Text fw={700} size="md" c="red.9">Total Space: {`${bytes_formatter(disk.total)}`}</Text></Center>
                        <Center><Text fw={700} size="md" c="red.9">Used Space: {`${bytes_formatter(disk.used)}`}</Text></Center>
                    </Paper>
                    <Paper withBorder shadow="xl" radius="md" p="xl" mr="md" mb="md">
                        <Center mb="md"><Title order={4}>Memory Usage</Title></Center>
                        <Center>
                            <DonutChart
                              data={[
                                { name: 'Used Percentage', value: memory.percent, color: 'blue' },
                                { name: 'Free Percentage', value: 100 - memory.percent, color: 'gray.6' },
                            ]}
                            />
                        </Center>
                        <Center><Text fw={700} size="md" c="green.9">Available Memory: {`${bytes_formatter(memory.available)}`}</Text></Center>
                        <Center><Text fw={700} size="md" c="green.9">Used Memory: {`${bytes_formatter(memory.used)}`}</Text></Center>
                    </Paper>
                </Flex>
            </Center>
        </>
    );
}
