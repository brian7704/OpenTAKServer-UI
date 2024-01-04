import React, { useState } from 'react';
import {
    IconAlertTriangle,
    IconHeartbeat,
    IconPackage,
    IconVideo,
    IconDeviceMobile,
    IconDashboard,
    IconUsers,
    IconUserPlus,
} from '@tabler/icons-react';
import { NavLink, Title } from '@mantine/core';
import { useLocation } from 'react-router-dom';
import classes from './Navbar.module.css';

const navbarLinks = [
    { link: '/dashboard', label: 'Dashboard', icon: IconDashboard },
    { link: '/euds', label: 'EUDs', icon: IconDeviceMobile },
    { link: '/alerts', label: 'Alerts', icon: IconAlertTriangle },
    { link: '/casevac', label: 'Casevac', icon: IconHeartbeat },
    { link: '/data_packages', label: 'Data Packages', icon: IconPackage },
    { link: '/video_streams', label: 'Video Streams', icon: IconVideo },
];

const adminLinks = [
    { link: '/users', label: 'Users', icon: IconUsers },
    { link: '/users/create', label: 'Create User', icon: IconUserPlus },
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
        </>
    );
}
