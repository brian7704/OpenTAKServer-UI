import React from 'react';
import {
    AppShell, Badge,
    Burger,
    Group,
    Image,
    Menu,
    rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    IconLogout,
    IconMessageCircle,
    IconSettings, IconUserCircle,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import Logo from './assets/ots-logo.png';
import { AppContent } from './components/AppContent';
import axios from './axios_config';
import { apiRoutes } from './config';
import Navbar from './components/Navbar/Navbar';

export function DefaultLayout() {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

    const navigate = useNavigate();

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
            <AppShell.Header>
                <Group justify="space-between" pl={5} pr={5}>
                    <Group h="100%">
                        <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
                        <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
                        <Image src={Logo} h={50} w="auto" />
                    </Group>
                    <Group>
                        <Menu shadow="md" width={200} trigger="click-hover">
                            <Menu.Target>
                                <Badge autoContrast variant="light" size="md" rightSection={<IconUserCircle size={15} />}>
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
            <AppShell.Navbar p="md">
                <Navbar />
            </AppShell.Navbar>
            <AppShell.Main><AppContent /></AppShell.Main>
        </AppShell>
    );
}

export default DefaultLayout;
