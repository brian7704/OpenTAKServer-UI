import React, { useEffect, useState } from 'react';
import {
    Badge,
    AppShell,
    Burger,
    Group,
    Image,
    Menu,
    rem,
    useComputedColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    IconCheck,
    IconLogout,
    IconMessageCircle,
    IconSettings,
    IconAlertTriangle,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import Logo from './images/ots-logo.png';
import { AppContent } from './components/AppContent';
import axios from './axios_config';
import { apiRoutes } from './config';
import Navbar from './components/Navbar/Navbar';
import { socket } from './socketio';

export function DefaultLayout() {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    const navigate = useNavigate();

    const [socketConnected, setSocketConnected] = useState(false);

    useEffect(() => {
        function onConnect() {
            setSocketConnected(true);
        }

        function onDisconnect() {
            setSocketConnected(false);
        }

        function onAlert(alert:any) {
            let message = `${alert.alert_type} from ${alert.callsign}`;
            let color = 'red';
            let icon = <IconAlertTriangle style={{ width: rem(20), height: rem(20) }} />;

            if (alert.cancel_time !== null) {
                message = `${alert.alert_type} from ${alert.callsign} canceled`;
                color = 'green';
                icon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;
            }

            notifications.show({
                title: 'Alert',
                message,
                color,
                icon,
            });
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('alert', onAlert);

        if (!socketConnected) {
            socket.connect();
        }

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('alert', onAlert);
        };
    }, []);

    const logout = () => {
        axios.post(
            apiRoutes.logout
        ).then(r => {
            if (r.status === 200) {
                localStorage.clear();
                navigate('/');
            }
        });
    };

    return (
        <AppShell
          header={{ height: 60 }}
          navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
            }}
          padding="md"
        >
            <AppShell.Header pb={0} bg={computedColorScheme === 'light' ? '#2a2d43' : 'dark.8'}>
                <Group justify="space-between" pr={5} h="100%">
                    <Group h="100%" w={300}>
                        <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" pl={5} />
                        <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
                        <Image src={Logo} h={50} w="auto" />
                    </Group>
                    <Group>
                        <Menu shadow="md" width={200} trigger="click-hover">
                            <Menu.Target>
                                <Badge autoContrast variant="light" size="md">
                                    {localStorage.getItem('username')}
                                </Badge>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Label>Application</Menu.Label>
                                <Menu.Item leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>
                                    Settings
                                </Menu.Item>
                                <Menu.Item leftSection={<IconMessageCircle style={{ width: rem(14), height: rem(14) }} />}>
                                    Messages
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.Item
                                  disabled={localStorage.getItem('loggedIn') !== 'true'}
                                  leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
                                  onClick={() => {
                                        logout();
                                    }}
                                >
                                    Log Out
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar pl="md" pr="md" bg={computedColorScheme === 'light' ? '#f1f4f8' : 'dark.8'}>
                <Navbar />
            </AppShell.Navbar>
            <AppShell.Main bg={computedColorScheme === 'light' ? 'gray.1' : 'dark.7'}><AppContent /></AppShell.Main>
        </AppShell>
    );
}

export default DefaultLayout;
