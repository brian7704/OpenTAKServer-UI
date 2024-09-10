import React, { useState } from 'react';
import {
    IconAlertTriangle,
    IconHeartbeat,
    IconPackage,
    IconVideo,
    IconDeviceMobile,
    IconDashboard,
    IconPuzzle,
    IconUsers,
    IconMap, IconLogout, IconMoonStars, Icon2fa, IconCalendarDue, IconMovie, IconQrcode, IconX,
} from '@tabler/icons-react';
import { NavLink, ScrollArea, Title, Modal, Center } from '@mantine/core';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import QRCode from 'react-qr-code';
import classes from './Navbar.module.css';
import DarkModeSwitch from '../DarkModeSwitch';
import axios from '../../axios_config';
import { apiRoutes } from '../../apiRoutes';
import MeshtasticLogo from './MeshtasticLogo';

const navbarLinks = [
    { link: '/dashboard', label: 'Dashboard', icon: IconDashboard },
    { link: '/map', label: 'Map', icon: IconMap },
    { link: '/euds', label: 'EUDs', icon: IconDeviceMobile },
    { link: '/alerts', label: 'Alerts', icon: IconAlertTriangle },
    { link: '/casevac', label: 'Casevac', icon: IconHeartbeat },
    { link: '/data_packages', label: 'Data Packages', icon: IconPackage },
    { link: '/video_streams', label: 'Video Streams', icon: IconVideo },
    { link: '/video_recordings', label: 'Video Recordings', icon: IconMovie },
    { link: '/meshtastic', label: 'Meshtastic', icon: MeshtasticLogo },
];

const adminLinks = [
    { link: '/users', label: 'Users', icon: IconUsers },
    { link: '/jobs', label: 'Scheduled Jobs', icon: IconCalendarDue },
    { link: '/plugin_updates', label: 'Plugin Updates', icon: IconPuzzle },
];

export default function Navbar() {
    const administrator = localStorage.getItem('administrator') === 'true';
    const location = useLocation();
    const [showItakQr, setShowItakQr] = useState(false);
    const [qrString, setQrString] = useState('');

    const links = navbarLinks.map((item) => (
        <NavLink
          className={classes.link}
          component={Link}
          key={item.label}
          active={location.pathname === item.link || undefined}
          to={item.link}
          label={item.label}
          leftSection={<item.icon className={classes.linkIcon} stroke={1.5} />}
          mt="md"
        />
    ));

    const admin_links = adminLinks.map((item) => (
        <NavLink
          className={classes.link}
          component={Link}
          key={item.label}
          active={location.pathname === item.link || undefined}
          to={item.link}
          label={item.label}
          leftSection={<item.icon className={classes.linkIcon} stroke={1.5} />}
          mt="md"
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

    const itak_qr_string = () => {
        axios.get(apiRoutes.itakQrString).then(r => {
            if (r.status === 200) {
                setQrString(r.data);
                setShowItakQr(true);
            }
        }).catch(err => {
            console.log(err);
            notifications.show({
                message: 'Failed to get QR code string',
                icon: <IconX />,
                color: 'red',
            });
        });
    };

    return (
        <ScrollArea>
            <div>
                {links}
            </div>
            {administrator ?
                <div className={classes.footer}>
                    <Title order={6}>Admin</Title>
                    {admin_links}
                </div> : ''}
            <div className={classes.footer}>
                <NavLink className={classes.link} key="itakQrCode" onClick={() => itak_qr_string()} leftSection={<IconQrcode className={classes.linkIcon} stroke={1.5} />} label="iTAK QR Code" />
                <NavLink className={classes.link} key="2faSettings" component={Link} to="/tfa_setup" leftSection={<Icon2fa className={classes.linkIcon} stroke={1.5} />} label="Setup 2FA" />
                <NavLink className={classes.link} key="darkModeSwitch" leftSection={<IconMoonStars className={classes.linkIcon} stroke={1.5} />} rightSection={<DarkModeSwitch />} label="Dark Mode" />
                <NavLink className={classes.link} key="logout" leftSection={<IconLogout className={classes.linkIcon} stroke={1.5} />} label="Log Out" onClick={() => logout()} />
            </div>
            <Modal opened={showItakQr} onClose={() => setShowItakQr(false)} p="md" title="iTAK Connection Details">
                <Center><QRCode value={qrString} /></Center>
            </Modal>
        </ScrollArea>
    );
}
