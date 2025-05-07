import React, {ReactElement, useEffect, useState} from 'react';
import {
    IconAlertTriangle,
    IconHeartbeat,
    IconPackage,
    IconVideo,
    IconDeviceMobile,
    IconDashboard,
    IconPuzzle,
    IconUsers,
    IconMap,
    IconLogout,
    IconMoonStars,
    Icon2fa,
    IconCalendarDue,
    IconMovie,
    IconQrcode,
    IconX,
    IconCertificate,
    IconHelp,
    IconBook,
    IconBrandDiscord,
    IconBrandGithub,
    IconRefresh,
    IconSettings,
    IconPlugConnected,
    IconPlug,
    IconEdit, IconCircle, IconCircleMinus
} from '@tabler/icons-react';
import {NavLink, ScrollArea, Modal, Center, NumberInput, Flex, Button, Switch, Paper, Text} from '@mantine/core';
import { Link, useLocation, useNavigate } from 'react-router';
import { notifications } from '@mantine/notifications';
import QRCode from 'react-qr-code';
import classes from './Navbar.module.css';
import DarkModeSwitch from '../DarkModeSwitch';
import axios from '../../axios_config';
import { apiRoutes } from '../../apiRoutes';
import MeshtasticLogo from './MeshtasticLogo';
import {DateTimePicker} from "@mantine/dates";

const navbarLinks = [
    { link: '/dashboard', label: 'Dashboard', icon: IconDashboard },
    { link: '/map', label: 'Map', icon: IconMap },
    { link: '/euds', label: 'EUDs', icon: IconDeviceMobile },
    { link: '/alerts', label: 'Alerts', icon: IconAlertTriangle },
    { link: '/casevac', label: 'CasEvac', icon: IconHeartbeat },
    { link: '/data_packages', label: 'Data Packages', icon: IconPackage },
    { link: '/video_streams', label: 'Video Streams', icon: IconVideo },
    { link: '/video_recordings', label: 'Video Recordings', icon: IconMovie },
    { link: '/meshtastic', label: 'Meshtastic', icon: MeshtasticLogo },
    { link: '/missions', label: 'Missions', icon: IconRefresh },
];

const adminLinks = [
    { link: '/users', label: 'Users', icon: IconUsers },
    { link: '/jobs', label: 'Scheduled Jobs', icon: IconCalendarDue },
    { link: '/plugin_updates', label: 'Plugin Updates', icon: IconPuzzle },
    { link: '/device_profiles', label: 'Device Profiles', icon: IconDeviceMobile },
    { link: '/server_plugin_manager', label: 'Server Plugin Manager', icon: IconPlugConnected },
];

export default function Navbar() {
    const administrator = localStorage.getItem('administrator') === 'true';
    const location = useLocation();
    const [showAtakQr, setShowAtakQr] = useState(false);
    const [atakQrString, setAtakQrString] = useState('');
    const [showItakQr, setShowItakQr] = useState(false);
    const [itakQrString, setItakQrString] = useState('');
    const [plugins, setPlugins] = useState([]);
    const [pluginNavLinks, setPluginNavLinks] = useState<ReactElement[]>([]);

    useEffect(() => {
        get_plugins();
    }, []);

    useEffect(() => {
        generatePluginLinks();
    }, [plugins]);

    function generatePluginLinks() {
        if (plugins !== null) {
            const links = plugins.map((plugin: any) => (
                <NavLink
                    className={classes.link}
                    component={Link}
                    key={plugin.distro}
                    active={location.pathname + location.search === `/plugin?name=${plugin.distro}` || undefined}
                    to={`/plugin?name=${plugin.distro}`}
                    label={plugin.name}
                    leftSection={<IconPlugConnected className={classes.linkIcon} stroke={1.5}/>}
                    mt="md"
                    onClick={() => {generatePluginLinks()}}
                />
            ))
            setPluginNavLinks(links)
        }
    }

    const links = navbarLinks.map((item) => (
        <NavLink
          className={classes.link}
          component={Link}
          key={item.label}
          active={location.pathname === item.link}
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
                setItakQrString(r.data);
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

    const get_plugins = () => {
        axios.get(apiRoutes.plugins).then(r => {
            if (r.status === 200) {
                setPlugins(r.data.plugins)
            }
        })
    }

    function getAtakQr() {
        axios.get(apiRoutes.atakQrString, {}).then(r => {
            if (r.status === 200) {
                setAtakQrString(r.data.qr_string);
                setShowAtakQr(true);
            }
        }).catch(err => {
            console.log(err);
            notifications.show({
                title: 'Failed to get QR code string',
                message: err.response.data.error,
                icon: <IconX />,
                color: 'red',
            });
        })
    }

    return (
        <ScrollArea type="never">
            <div>
                {links}
            </div>
            {administrator ?
                <div className={classes.footer}>
                    <NavLink className={classes.link} key="admin" leftSection={<IconSettings className={classes.linkIcon} stroke={1.5} />} label="Admin" >
                        {admin_links}
                    </NavLink>
                    <NavLink className={classes.link} key="plugins" leftSection={<IconPlug className={classes.linkIcon} stroke={1.5} />} label="Plugins" >
                        {pluginNavLinks}
                    </NavLink>
                </div> : ''}
            <div className={classes.footer}>
                <NavLink className={classes.link} key="downloadTruststore" onClick={() => window.open(apiRoutes.truststore, "_blank")} leftSection={<IconCertificate className={classes.linkIcon} stroke={1.5} />} label="Download Truststore" />
                <NavLink className={classes.link} key="atakQrCode" onClick={() => getAtakQr()} leftSection={<IconQrcode className={classes.linkIcon} stroke={1.5} />} label="ATAK QR Code" />
                <NavLink className={classes.link} key="itakQrCode" onClick={() => itak_qr_string()} leftSection={<IconQrcode className={classes.linkIcon} stroke={1.5} />} label="iTAK QR Code" />
                <NavLink className={classes.link} key="2faSettings" component={Link} to="/tfa_setup" leftSection={<Icon2fa className={classes.linkIcon} stroke={1.5} />} label="Setup 2FA" />
                <NavLink className={classes.link} key="darkModeSwitch" leftSection={<IconMoonStars className={classes.linkIcon} stroke={1.5} />} rightSection={<DarkModeSwitch />} label="Dark Mode" />
                <NavLink className={classes.link} key="support" leftSection={<IconHelp className={classes.linkIcon} stroke={1.5} />} label="Support" >
                    <NavLink className={classes.link} key="docs" onClick={() => window.open("https://docs.opentakserver.io", "_blank")} leftSection={<IconBook className={classes.linkIcon} stroke={1.5} />} label="Documentation" />
                    <NavLink className={classes.link} key="discord" onClick={() => window.open("https://discord.gg/6uaVHjtfXN", "_blank")} leftSection={<IconBrandDiscord className={classes.linkIcon} stroke={1.5} />} label="Discord" />
                    <NavLink className={classes.link} key="github" onClick={() => window.open("https://github.com/brian7704/OpenTAKServer", "_blank")} leftSection={<IconBrandGithub className={classes.linkIcon} stroke={1.5} />} label="Github" />
                </NavLink>
                <NavLink className={classes.link} key="logout" leftSection={<IconLogout className={classes.linkIcon} stroke={1.5} />} label="Log Out" onClick={() => logout()} />
            </div>
            <Modal opened={showItakQr} onClose={() => setShowItakQr(false)} p="md" title="iTAK Connection Details">
                <Center>
                    <Paper p="md" shadow="xl" withBorder bg="white">
                        <QRCode value={itakQrString} />
                    </Paper>
                </Center>
            </Modal>
            <Modal opened={showAtakQr} onClose={() => setShowAtakQr(false)} title="ATAK QR Code">
                <DateTimePicker disabled={atakQrString !== ''} label="Expiration Date" clearable />
                <NumberInput disabled={atakQrString !== ''} label="Max Uses" />
                <Switch mt="md" disabled={atakQrString === ''} label="Enabled" />

                <Center>
                    <Button mt="md" mr="md" mb="md" leftSection={<IconRefresh size={14} />}>Generate</Button>
                    <Button mt="md" mr="md" mb="md" disabled={atakQrString === ''} leftSection={<IconEdit size={14} />}>Edit</Button>
                    <Button mt="md" mr="md" mb="md" disabled={atakQrString === ''} leftSection={<IconCircleMinus size={14} />}>Delete</Button>
                </Center>
                <Flex direction="column" gap="md" align="center" display={atakQrString === '' ? "none" : "flex"}>
                    <Paper p="md" shadow="xl" withBorder bg="white">
                        <QRCode value={atakQrString} />
                    </Paper>
                    <Button component="a" href="</Center>">Open ATAK</Button>
                    <Text ta="center" fw={700}>Remember to treat this QR code like a password and don't share it with anyone.</Text>
                </Flex>
            </Modal>
        </ScrollArea>
    );
}
