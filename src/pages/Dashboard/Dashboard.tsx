import React, { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import {Text, Center, Title, Divider, Paper, Flex, Switch, Space} from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { DonutChart } from '@mantine/charts';
import axios from '../../axios_config';
import { apiRoutes } from '../../apiRoutes';
import bytes_formatter from '../../bytes_formatter';
import '@mantine/charts/styles.css';

export default function Dashboard() {
    const [tcpEnabled, setTcpEnabled] = useState(true);
    const [sslEnabled, setSslEnabled] = useState(true);
    const [uname, setUname] = useState({
        machine: '',
        node: '',
        release: '',
        system: '',
        version: '',
    });
    const [osRelease, setOsRelease] = useState({
        NAME: '',
        PRETTY_NAME: '',
        VERSION: '',
        VERSION_CODENAME: '',
    });
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
                    setTcpEnabled(r.data.tcp);
                    setSslEnabled(r.data.ssl);
                    setUname(r.data.uname);
                    setOsRelease(r.data.os_release);
                }
            }).catch(err => {
                console.log(err);
            });
    }, []);

    function toggleSSL() {
        axios.get((sslEnabled) ? apiRoutes.stopSSL : apiRoutes.startSSL)
            .then(r => {
                if (r.status === 200) {
                    let message = 'The SSL server has been started';
                    if (sslEnabled) message = 'The SSL server has been stopped';

                    notifications.show({
                        title: 'Success',
                        message,
                        icon: <IconCheck />,
                        color: 'green',
                    });
                    setSslEnabled(!sslEnabled);
                }
            }).catch(err => {
                console.log(err);
                notifications.show({
                    title: 'Error',
                    message: err.response.data.error,
                    icon: <IconX />,
                    color: 'red',
                });
        });
    }

    function toggleTCP() {
        axios.get((tcpEnabled) ? apiRoutes.stopTCP : apiRoutes.startTCP)
            .then(r => {
                if (r.status === 200) {
                    let message = 'The TCP server has been started';
                    if (tcpEnabled) message = 'The TCP server has been stopped';

                    notifications.show({
                        title: 'Success',
                        message,
                        icon: <IconCheck />,
                        color: 'green',
                    });
                    setTcpEnabled(!tcpEnabled);
                }
            }).catch(err => {
            console.log(err);
            notifications.show({
                title: 'Error',
                message: err.response.data.error,
                icon: <IconX />,
                color: 'red',
            });
        });
    }

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
                        <Center>{tcpEnabled ? <IconCheck color="green" /> : <IconX color="red" />}</Center>
                        <Switch label="Enabled" checked={tcpEnabled} onChange={() => toggleTCP()} mt="md" />
                    </Paper>
                    <Paper withBorder shadow="xl" radius="md" p="xl" mr="md" mb="md">
                        <Center mb="md"><Title order={4}>SSL</Title></Center>
                        <Center>{sslEnabled ? <IconCheck color="green" /> : <IconX color="red" />}</Center>
                        <Switch label="Enabled" checked={sslEnabled} onChange={() => toggleSSL()} mt="md" />
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
                        <Center><Text fw={700} size="md" c="green.9">{`${serverStatus.cpu_percent}%`}</Text></Center>
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
                        <Center><Text fw={700} size="md" c="green.9">Total Space: {`${bytes_formatter(disk.total)}`}</Text></Center>
                        <Center><Text fw={700} size="md" c="green.9">Used Space: {`${bytes_formatter(disk.used)}`}</Text></Center>
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
            <Divider my="lg" />
            <Center>
                <Title mb="xl" order={2}>Server Details</Title>
            </Center>
            <Center mb="xl">
                <Flex direction={{ base: 'column', xs: 'row' }}>
                    <Paper shadow="xl" withBorder radius="md" p="xl" mr="md" mb="md">
                        <Center mb="md"><Title order={4}>uname</Title></Center>
                        <Flex><Text fw={700}>System:</Text><Space w="md" /><Text>{uname.system}</Text></Flex>
                        <Flex><Text fw={700}>Release:</Text><Space w="md" />{uname.release}</Flex>
                        <Flex><Text fw={700}>Version:</Text><Space w="md" />{uname.version}</Flex>
                        <Flex><Text fw={700}>Architecture:</Text><Space w="md" />{uname.machine}</Flex>
                        <Flex><Text fw={700}>Hostname:</Text><Space w="md" />{uname.node}</Flex>
                    </Paper>
                    <Paper shadow="xl" withBorder radius="md" p="xl" mr="md" mb="md">
                        <Center mb="md"><Title order={4}>OS Release</Title></Center>
                        <Flex><Text fw={700}>Name:</Text><Space w="md" /><Text>{osRelease.NAME}</Text></Flex>
                        <Flex><Text fw={700}>Pretty Name:</Text><Space w="md" /><Text>{osRelease.PRETTY_NAME}</Text></Flex>
                        <Flex><Text fw={700}>Version:</Text><Space w="md" /><Text>{osRelease.VERSION}</Text></Flex>
                        <Flex><Text fw={700}>Code Name:</Text><Space w="md" /><Text>{osRelease.VERSION_CODENAME}</Text></Flex>
                    </Paper>
                </Flex>
            </Center>
        </>
    );
}
