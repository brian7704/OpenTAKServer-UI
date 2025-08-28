import React, { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import {Text, Center, Title, Divider, Paper, Flex, Switch, Space, ScrollArea} from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { DonutChart } from '@mantine/charts';
import { intervalToDuration, formatDuration } from 'date-fns';
import { versions } from '../../_versions';
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
    const [ots, setOts] = useState({
        version: '',
        uptime: 0,
        start_time: '',
        python_version: '',
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
    const [uptime, setUptime] = useState({
        boot_time: '',
        uptime: 0,
    });
    const [cotHealth, setCotHealth] = useState<Record<string, any>>({ status: '' });
    const [eudHealth, setEudHealth] = useState<Record<string, any>>({ status: '' });

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
                    setOts({
                        version: r.data.ots_version,
                        uptime: r.data.ots_uptime,
                        start_time: r.data.ots_start_time,
                        python_version: r.data.python_version,
                    });
                    setUptime({
                        uptime: r.data.system_uptime,
                        boot_time: r.data.system_boot_time,
                    });
                    setTcpEnabled(r.data.tcp);
                    setSslEnabled(r.data.ssl);
                    setUname(r.data.uname);
                    setOsRelease(r.data.os_release);
                }
            }).catch(err => {
                console.log(err);
            });
            axios.get(apiRoutes.health_cot).then(r => {
                if (r.status === 200) {
                    setCotHealth(r.data);
                }
            }).catch(err => {
                console.log(err);
            });
            axios.get(apiRoutes.health_eud).then(r => {
                if (r.status === 200) {
                    setEudHealth(r.data);
                }
            }).catch(err => {
                console.log(err);
            });
    }, []);

    const getStatusColor = (status: string) => {
        switch ((status || '').toLowerCase()) {
            case 'ok':
            case 'good':
            case 'healthy':
                return 'green.2';
            case 'warn':
            case 'warning':
            case 'degraded':
                return 'yellow.2';
            default:
                return 'red.2';
        }
    };

    return (
        <ScrollArea>
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
                    <Paper shadow="xl" withBorder radius="md" p="xl" mr="md" mb="md">
                        <Center mb="md"><Title order={4}>Uptime</Title></Center>
                        <Flex><Text fw={700}>Uptime:</Text><Space w="md" /><Text>{formatDuration(intervalToDuration({ start: 0, end: uptime.uptime * 1000 }))}</Text></Flex>
                        <Flex><Text fw={700}>Boot Time:</Text><Space w="md" />{uptime.boot_time}</Flex>
                    </Paper>
                </Flex>
            </Center>
            <Center>
                <Title mb="xl" order={2}>Service Health</Title>
            </Center>
            <Center mb="xl">
                <Flex direction={{ base: 'column', xs: 'row' }}>
                    <Paper withBorder shadow="xl" radius="md" p="xl" mr="md" mb="md" bg={getStatusColor(cotHealth.status)}>
                        <Center mb="md"><Title order={4}>CoT Parser</Title></Center>
                        {Object.entries(cotHealth).filter(([key]) => key !== 'status').map(([key, value]) => (
                            <Flex key={key}><Text fw={700}>{key}:</Text><Space w="md" /><Text>{String(value)}</Text></Flex>
                        ))}
                    </Paper>
                    <Paper withBorder shadow="xl" radius="md" p="xl" mr="md" mb="md" bg={getStatusColor(eudHealth.status)}>
                        <Center mb="md"><Title order={4}>EUD Handler</Title></Center>
                        {Object.entries(eudHealth).filter(([key]) => key !== 'status').map(([key, value]) => (
                            <Flex key={key}><Text fw={700}>{key}:</Text><Space w="md" /><Text>{String(value)}</Text></Flex>
                        ))}
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
                    <Paper shadow="xl" withBorder radius="md" p="xl" mr="md" mb="md">
                        <Center mb="md"><Title order={4}>OpenTAKServer</Title></Center>
                        <Flex><Text fw={700}>Version:</Text><Space w="md" /><Text>{ots.version}</Text></Flex>
                        <Flex><Text fw={700}>UI Version:</Text><Space w="md" /><Text>{versions.gitTag}</Text></Flex>
                        <Flex><Text fw={700}>UI Commit Hash:</Text><Space w="md" /><Text>{versions.gitCommitHash}</Text></Flex>
                        <Flex><Text fw={700}>UI Commit Date:</Text><Space w="md" /><Text>{versions.versionDate}</Text></Flex>
                        <Flex><Text fw={700}>Uptime:</Text><Space w="md" />
                            <Text>
                                {formatDuration(intervalToDuration({ start: 0, end: ots.uptime * 1000 }))}
                            </Text>
                        </Flex>
                        <Flex><Text fw={700}>Start Time:</Text><Space w="md" /><Text>{ots.start_time}</Text></Flex>
                        <Flex><Text fw={700}>Python Version:</Text><Space w="md" /><Text>{ots.python_version}</Text></Flex>
                    </Paper>
                </Flex>
            </Center>
        </ScrollArea>
    );
}
