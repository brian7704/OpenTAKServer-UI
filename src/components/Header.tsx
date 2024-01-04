import React, { useEffect, useState } from 'react';
import {
    Group,
    Button,
    Divider,
    Box,
    Burger,
    Drawer,
    ScrollArea,
    rem, ActionIcon, useComputedColorScheme, useMantineColorScheme,
} from '@mantine/core';
import { MantineLogo } from '@mantinex/mantine-logo';
import { useDisclosure } from '@mantine/hooks';
import { IconSun, IconMoon } from '@tabler/icons-react';
import cx from 'clsx';

import { useLocation, useNavigate } from 'react-router-dom';
import classes from './Header.module.css';
import axios from '../axios_config';
import { apiRoutes } from '@/config';

export const Header = () => {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
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
        <Box pb={120}>
            <header className={classes.header}>
                <Group justify="space-between" h="100%">
                    <MantineLogo size={30} />

                    <Group visibleFrom="sm">
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

                    <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
                </Group>
            </header>

            <Drawer
              opened={drawerOpened}
              onClose={closeDrawer}
              size="100%"
              padding="md"
              title="Navigation"
              hiddenFrom="sm"
              zIndex={1000000}
            >
                <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
                    <Divider my="sm" />

                    <Group justify="center" grow pb="xl" px="md">
                        <Button variant="default">Log in</Button>
                        <Button>Sign up</Button>
                    </Group>
                </ScrollArea>
            </Drawer>
        </Box>
    );
};

export default Header;
