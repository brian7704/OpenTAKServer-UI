import React, { useState } from 'react';
import {
    ActionIcon,
    AppShell,
    Burger,
    Button,
    Group,
    Image,
    useComputedColorScheme,
    useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconMoon, IconSun } from '@tabler/icons-react';
import cx from 'clsx';
import { useNavigate } from 'react-router-dom';
import classes from '@/components/Header.module.css';
import Logo from './assets/ots-logo.png';
import { AppContent } from './components/AppContent';
import axios from '@/axios_config';
import { apiRoutes } from '@/config';
import Navbar from '@/components/Navbar/Navbar';

export function DefaultLayout() {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const loggedIn = localStorage.getItem('loggedIn') === 'true';

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
                        <Button
                          style={loggedIn ? { display: 'block' } : { display: 'none' }}
                          variant="default"
                          onClick={() => {
                                logout();
                            }}
                        >Log Out
                        </Button>
                        <ActionIcon
                          onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
                          variant="default"
                          size="xl"
                          aria-label="Toggle color scheme"
                        >
                            <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
                            <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
                        </ActionIcon>
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
