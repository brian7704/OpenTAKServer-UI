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
    IconCircleMinus,
    IconUsersGroup, IconLink
} from '@tabler/icons-react';
import {
    NavLink,
    ScrollArea,
    Modal,
    Center,
    NumberInput,
    Flex,
    Button,
    Paper,
    Text,
    Tooltip
} from '@mantine/core';
import Logo from '../../images/ots-logo.png';
import { formatISO, parseISO } from 'date-fns';
import { Link, useLocation, useNavigate } from 'react-router';
import { notifications } from '@mantine/notifications';
import { QRCode } from 'react-qrcode-logo';
import classes from './Navbar.module.css';
import DarkModeSwitch from '../DarkModeSwitch';
import axios from '../../axios_config';
import { apiRoutes } from '../../apiRoutes';
import MeshtasticLogo from './MeshtasticLogo';
import {DateTimePicker} from "@mantine/dates";
import {t} from "i18next";

const navbarLinks = [
    { link: '/dashboard', label: t('Dashboard'), icon: IconDashboard },
    { link: '/map', label: t('Map'), icon: IconMap },
    { link: '/euds', label: t('EUDs'), icon: IconDeviceMobile },
    { link: '/alerts', label: t('Alerts'), icon: IconAlertTriangle },
    { link: '/casevac', label: t('CasEvac'), icon: IconHeartbeat },
    { link: '/data_packages', label: t('Data Packages'), icon: IconPackage },
    { link: '/video_streams', label: t('Video Streams'), icon: IconVideo },
    { link: '/video_recordings', label: t('Video Recordings'), icon: IconMovie },
    { link: '/meshtastic', label: t('Meshtastic'), icon: MeshtasticLogo },
    { link: '/missions', label: t('Missions'), icon: IconRefresh },
];

const adminLinks = [
    { link: '/users', label: t('Users'), icon: IconUsers },
    { link: '/groups', label: t('Groups'), icon: IconUsersGroup },
    { link: '/jobs', label: t('Scheduled Jobs'), icon: IconCalendarDue },
    { link: '/plugin_updates', label: t('Plugin Updates'), icon: IconPuzzle },
    { link: '/device_profiles', label: t('Device Profiles'), icon: IconDeviceMobile },
    { link: '/server_plugin_manager', label: t('Server Plugin Manager'), icon: IconPlugConnected },
    { link: '/link_account', 'label': t('Link TAK.gov Account'), icon: IconLink}
];

interface ATAKQrCode {
    qr_string: string;
    sub: string;
    iat: number;
    iss: string;
    aud: string;
    max: number|string;
    nbf: number|null;
    exp: number|null;
    disabled: boolean;
    total_uses: number;
}

export default function Navbar() {
    const administrator = localStorage.getItem('administrator') === 'true';
    const location = useLocation();
    const [showItakQr, setShowItakQr] = useState(false);
    const [itakQrString, setItakQrString] = useState('');
    const [plugins, setPlugins] = useState([]);
    const [pluginNavLinks, setPluginNavLinks] = useState<ReactElement[]>([]);

    const [showAtakQr, setShowAtakQr] = useState(false);
    const [atakQR, setAtakQR] = useState<ATAKQrCode>({
        qr_string: "",
        sub: "",
        iat: 0,
        iss: "",
        aud: "",
        max: "",
        nbf: null,
        exp: null,
        disabled: false,
        total_uses: 0
    });

    useEffect(() => {
        get_plugins();
    }, []);

    useEffect(() => {
        generatePluginLinks();
    }, [plugins]);

    const generatePluginLinks = () => {
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
        axios.get<ATAKQrCode>(apiRoutes.atakQrString, {}).then(r => {
            if (r.status === 200) {
                setAtakQR(r.data)
                setShowAtakQr(true);
            }
        }).catch(err => {
            console.log(err);
            setShowAtakQr(true)
        })
    }

    function generateAtakQr() {
        axios.post<ATAKQrCode>(apiRoutes.atakQrString, atakQR).then(r => {
            if (r.status === 200) {
                setAtakQR(r.data);
            }
        }).catch(err => {
            console.log(err);
            notifications.show({
                title: 'Failed to generate QR code',
                message: err.response.data.error,
                icon: <IconX />,
                color: 'red',
            });
        })
    }

    function deleteAtakQr() {
        axios.delete(apiRoutes.atakQrString).then(r => {
            if (r.status === 200) {
                setAtakQR({
                    qr_string: "",
                    sub: "",
                    iat: 0,
                    iss: "",
                    aud: "",
                    max: "",
                    nbf: null,
                    exp: null,
                    disabled: false,
                    total_uses: 0
                });
            }
        }).catch(err => {
            console.log(err);
            notifications.show({
                title: 'Failed to delete QR code',
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
                    <NavLink className={classes.link} key="admin" leftSection={<IconSettings className={classes.linkIcon} stroke={1.5} />} label={t("Admin")} >
                        {admin_links}
                    </NavLink>
                    <NavLink className={classes.link} key="plugins" leftSection={<IconPlug className={classes.linkIcon} stroke={1.5} />} label={t("Plugins")} >
                        {pluginNavLinks}
                    </NavLink>
                </div> : ''}
            <div className={classes.footer}>
                <NavLink className={classes.link} key="downloadTruststore" onClick={() => window.open(apiRoutes.truststore, "_blank")} leftSection={<IconCertificate className={classes.linkIcon} stroke={1.5} />} label={t("Download Truststore")} />
                <NavLink className={classes.link} key="atakQrCode" onClick={() => getAtakQr()} leftSection={<IconQrcode className={classes.linkIcon} stroke={1.5} />} label={t("ATAK QR Code")} />
                <NavLink className={classes.link} key="itakQrCode" onClick={() => itak_qr_string()} leftSection={<IconQrcode className={classes.linkIcon} stroke={1.5} />} label={t("iTAK QR Code")} />
                <NavLink className={classes.link} key="2faSettings" component={Link} to="/tfa_setup" leftSection={<Icon2fa className={classes.linkIcon} stroke={1.5} />} label={t("Setup 2FA")} />
                <NavLink className={classes.link} key="darkModeSwitch" leftSection={<IconMoonStars className={classes.linkIcon} stroke={1.5} />} rightSection={<DarkModeSwitch />} label={t("Dark Mode")} />
                <NavLink className={classes.link} key="support" leftSection={<IconHelp className={classes.linkIcon} stroke={1.5} />} label={t("Support")} >
                    <NavLink className={classes.link} key="docs" onClick={() => window.open("https://docs.opentakserver.io", "_blank")} leftSection={<IconBook className={classes.linkIcon} stroke={1.5} />} label={t("Documentation")} />
                    <NavLink className={classes.link} key="discord" onClick={() => window.open("https://discord.gg/6uaVHjtfXN", "_blank")} leftSection={<IconBrandDiscord className={classes.linkIcon} stroke={1.5} />} label={t("Discord")} />
                    <NavLink className={classes.link} key="github" onClick={() => window.open("https://github.com/brian7704/OpenTAKServer", "_blank")} leftSection={<IconBrandGithub className={classes.linkIcon} stroke={1.5} />} label={t("Github")} />
                </NavLink>
                <NavLink className={classes.link} key="logout" leftSection={<IconLogout className={classes.linkIcon} stroke={1.5} />} label={t("Log Out")} onClick={() => logout()} />
            </div>
            <Modal opened={showItakQr} onClose={() => setShowItakQr(false)} p="md" title={t("iTAK Connection Details")}>
                <Center>
                    <Paper p="md" shadow="xl" withBorder bg="white">
                        <QRCode size={350} value={itakQrString} quietZone={10} logoImage={Logo} qrStyle="dots" ecLevel="H" eyeRadius={50} logoWidth={100} logoHeight={100} />
                    </Paper>
                </Center>
            </Modal>
            <Modal opened={showAtakQr} onClose={() => setShowAtakQr(false)} title={t("ATAK QR Code")}>
                <DateTimePicker onChange={(date) => {
                    if (date !== "Invalid Date" && date !== null) {
                        setAtakQR({...atakQR, exp: Math.floor(parseISO(date).getTime() / 1000)});
                    }}}
                    minDate={new Date()}
                    valueFormat="YYYY-MM-DD HH:mm:ss ZZ"
                    value={atakQR.exp !== null ? formatISO(new Date(atakQR.exp * 1000)) : null}
                    disabled={atakQR?.qr_string !== ""}
                    label="Expiration Date"
                    clearable
                    firstDayOfWeek={0}
                    clearButtonProps={{
                        onClick: () => {
                            setAtakQR({...atakQR, exp: null})
                        }
                    }} timePickerProps={{
                        withDropdown: true,
                        popoverProps: { withinPortal: false },
                        format: '24h',
                    }} />
                <NumberInput hideControls min={1} value={atakQR.max} disabled={atakQR.qr_string !== ''} label={t("Max Uses")} onChange={(value) => {
                    const max = `${value}`
                    setAtakQR({...atakQR, max: parseInt(max, 10)})
                }} />

                <NumberInput display={Number(atakQR.max) > 0 && atakQR.qr_string !== '' ? "block" : "none"} min={0} value={atakQR.total_uses} disabled label={t("Total Uses")} onChange={(value) => {
                    const max = `${value}`
                    setAtakQR({...atakQR, max: parseInt(max, 10)})
                }} />

                <Center>
                    <Button mt="md" mr="md" mb="md" onClick={() => generateAtakQr()} disabled={atakQR.qr_string !== ''} leftSection={<IconRefresh size={14} />}>Generate</Button>
                    <Button mt="md" mr="md" mb="md" onClick={() => deleteAtakQr()} disabled={atakQR.qr_string === ''} leftSection={<IconCircleMinus size={14} />}>Delete</Button>
                </Center>
                <Flex direction="column" gap="md" align="center" display={atakQR.qr_string === '' ? "none" : "flex"}>
                    <Paper p="md" shadow="xl" withBorder bg="white">
                        <QRCode size={350} value={atakQR.qr_string} quietZone={10} logoImage={Logo} eyeRadius={50} ecLevel="L" qrStyle="dots" logoWidth={100} logoHeight={100} />
                    </Paper>
                    <Tooltip label={t("Tap here if you're reading this on the EUD you want to connect to OpenTAKServer")}>
                        <Button component="a" href={atakQR.qr_string}>{t("Open ATAK")}</Button>
                    </Tooltip>
                    <Text ta="center" fw={700}>{t("Remember to treat this QR code like a password and don't share it with anyone.")}</Text>
                </Flex>
            </Modal>
        </ScrollArea>
    );
}
