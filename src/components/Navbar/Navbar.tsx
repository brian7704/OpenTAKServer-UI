import React, { useState } from 'react';
import {Burger, Divider, Drawer, Group, rem, ScrollArea, SegmentedControl, Text} from '@mantine/core';
import {
    IconShoppingCart,
    IconLicense,
    IconMessage2,
    IconBellRinging,
    IconMessages,
    IconFingerprint,
    IconKey,
    IconSettings,
    Icon2fa,
    IconUsers,
    IconFileAnalytics,
    IconDatabaseImport,
    IconReceipt2,
    IconReceiptRefund,
    IconLogout,
    IconSwitchHorizontal,
} from '@tabler/icons-react';
import classes from './Navbar.module.css';
import {useDisclosure} from "@mantine/hooks";

const tabs = {
    account: [
        { link: '', label: 'Notifications', icon: IconBellRinging },
        { link: '', label: 'Billing', icon: IconReceipt2 },
        { link: '', label: 'Security', icon: IconFingerprint },
        { link: '', label: 'SSH Keys', icon: IconKey },
        { link: '', label: 'Databases', icon: IconDatabaseImport },
        { link: '', label: 'Authentication', icon: Icon2fa },
        { link: '', label: 'Other Settings', icon: IconSettings },
    ],
    general: [
        { link: '', label: 'Orders', icon: IconShoppingCart },
        { link: '', label: 'Receipts', icon: IconLicense },
        { link: '', label: 'Reviews', icon: IconMessage2 },
        { link: '', label: 'Messages', icon: IconMessages },
        { link: '', label: 'Customers', icon: IconUsers },
        { link: '', label: 'Refunds', icon: IconReceiptRefund },
        { link: '', label: 'Files', icon: IconFileAnalytics },
    ],
};

export function Navbar() {
    const [section, setSection] = useState<'account' | 'general'>('account');
    const [active, setActive] = useState('Billing');
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(true);

    const links = tabs[section].map((item) => (
        <a
            className={classes.link}
            data-active={item.label === active || undefined}
            href={item.link}
            key={item.label}
            onClick={(event) => {
                event.preventDefault();
                setActive(item.label);
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </a>
    ));

    return (
        <>
            <Burger opened={drawerOpened} onClick={toggleDrawer} />
            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                title="Navigation"
                zIndex={1000000}
            >
                <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
                    <Divider my="sm" />
                    <Group justify="center" grow pb="xl" px="md">
                        <nav className={classes.navbar}>
                            <div>
                                <Text fw={500} size="sm" className={classes.title} c="dimmed" mb="xs">
                                    bgluesticker@mantine.dev
                                </Text>

                                <SegmentedControl
                                    value={section}
                                    onChange={(value: any) => setSection(value)}
                                    transitionTimingFunction="ease"
                                    fullWidth
                                    data={[
                                        { label: 'Account', value: 'account' },
                                        { label: 'System', value: 'general' },
                                    ]}
                                />
                            </div>

                            <div className={classes.navbarMain}>{links}</div>

                            <div className={classes.footer}>
                                <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                                    <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
                                    <span>Change account</span>
                                </a>

                                <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                                    <IconLogout className={classes.linkIcon} stroke={1.5} />
                                    <span>Logout</span>
                                </a>
                            </div>
                        </nav>
                    </Group>
                </ScrollArea>
            </Drawer>
        </>
    );
}