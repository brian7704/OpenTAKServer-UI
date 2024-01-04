import React from 'react';
import {
    Group,
    Button,
    Divider,
    Box,
    Burger,
    Drawer,
    ScrollArea,
    rem, ActionIcon, useComputedColorScheme, useMantineColorScheme, Image,
} from '@mantine/core';
import { MantineLogo } from '@mantinex/mantine-logo';
import Logo from '../assets/ots-logo.png';
import { useDisclosure } from '@mantine/hooks';
import { IconSun, IconMoon } from '@tabler/icons-react';
import cx from 'clsx';

import {Link, useLocation, useNavigate} from 'react-router-dom';
import classes from './Header.module.css';
import axios from '../axios_config';
import { apiRoutes } from '@/config';

export const Header = () => {
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
        <Box pb={0}>
            <header className={classes.header}>
                <Group justify="space-between" h="100%">
                    <Image src={Logo} h={50} w='auto' />

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
            </header>
        </Box>
    );
};

export default Header;
