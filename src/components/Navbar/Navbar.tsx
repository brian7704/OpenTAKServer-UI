import React from 'react';
import {
    IconAlertTriangle,
    IconHeartbeat,
    IconPackage,
    IconVideo,
    IconDeviceMobile,
    IconDashboard,
    IconUsers,
    IconMap, IconLogout, IconMoonStars, Icon2fa,
} from '@tabler/icons-react';
import { NavLink, Title } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import classes from './Navbar.module.css';
import DarkModeSwitch from '../DarkModeSwitch';
import axios from '../../axios_config';
import { apiRoutes } from '../../config';

const navbarLinks = [
    { link: '/dashboard', label: 'Dashboard', icon: IconDashboard },
    { link: '/map', label: 'Map', icon: IconMap },
    { link: '/euds', label: 'EUDs', icon: IconDeviceMobile },
    { link: '/alerts', label: 'Alerts', icon: IconAlertTriangle },
    { link: '/casevac', label: 'Casevac', icon: IconHeartbeat },
    { link: '/data_packages', label: 'Data Packages', icon: IconPackage },
    { link: '/video_streams', label: 'Video Streams', icon: IconVideo },
];

const adminLinks = [
    { link: '/users', label: 'Users', icon: IconUsers },
];

export default function Navbar() {
    const administrator = localStorage.getItem('administrator') === 'true';
    const location = useLocation();

    const links = navbarLinks.map((item) => (
        <NavLink
          key={item.label}
          active={location.pathname === item.link || undefined}
          href={item.link}
          label={item.label}
          leftSection={<item.icon className={classes.linkIcon} stroke={1.5} />}
        />
    ));

    const admin_links = adminLinks.map((item) => (
        <NavLink
          key={item.label}
          active={location.pathname === item.link || undefined}
          href={item.link}
          label={item.label}
          leftSection={<item.icon className={classes.linkIcon} stroke={1.5} />}
        />
    ));

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
        <>
            <div>
                {links}
            </div>
            {administrator ?
                <div className={classes.footer}>
                    <Title order={6}>Admin</Title>
                    {admin_links}
                </div> : ''}
            <div className={classes.footer}>
                <NavLink key="2faSettings" href="/tfa_setup" leftSection={<Icon2fa className={classes.linkIcon} stroke={1.5} />} label="Setup 2FA" />
                <NavLink key="darkModeSwitch" leftSection={<IconMoonStars className={classes.linkIcon} stroke={1.5} />} rightSection={<DarkModeSwitch />} label="Dark Mode" />
                <NavLink key="logout" leftSection={<IconLogout className={classes.linkIcon} stroke={1.5} />} label="Log Out" onClick={() => logout()} />
            </div>
        </>
    );
}
