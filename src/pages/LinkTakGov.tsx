import {
    useComputedColorScheme,
    Container,
    TableData,
    Table,
    Button,
    Title,
    Text,
    LoadingOverlay,
    Center,
    Select,
    Flex, Modal, Group, Divider, Box
} from "@mantine/core";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {apiRoutes} from "@/apiRoutes.tsx";
import {notifications} from "@mantine/notifications";
import {IconCheck, IconCircleMinus, IconX, IconDownload} from "@tabler/icons-react";
import TakGovLogo from '../images/takgov_logo.tsx'
import bytes_formatter from "@/bytes_formatter.tsx";
import {t} from "i18next";

interface Plugin {
    apk_hash: string;
    apk_size_bytes: number;
    apk_type: string;
    apk_url: string;
    description: string;
    display_name: string;
    icon_url: string;
    identifier: string;
    os_requirement: number;
    package_name: string;
    platform: string;
    revision_code: number;
    tak_prerequisite: string;
    version: string;
    atak_version: string|null|undefined;
}

export default function LinkTakGov() {
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const [linked, setLinked] = useState(false);
    const [deviceCode, setDeviceCode] = useState<string>();
    const [userCode, setUserCode] = useState<string|null>(null);
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState<string|null>("ATAK-CIV");
    const [productVersion, setProductVersion] = useState<string|null>("5.5.0");
    const [showUnlink, setShowUnlink] = useState(false);
    const [plugins, setPlugins] = useState<TableData>({
        caption: '',
        head: [t('Name'), t('Description'), t('Version'), t('TAK Prerequisite'), t('Size')],
        body: [],
    });

    function check_if_linked() {
        setLoading(true);
        axios.get(apiRoutes.takgov).then((r) => {
            if (r.status === 200) {
                setLinked(r.data.tak_gov_account_linked);
            }
            setLoading(false);
        }).catch((err) => {
            console.error(err);
            notifications.show({
                title: t('Failed check link status'),
                message: err.response.data.error,
                icon: <IconX />,
                color: 'red',
            })
            setLoading(false);
        })
    }

    function get_plugin_list() {
        setLoading(true);
        axios.get(apiRoutes.takgovPlugins, {params:{product: product, "product_version": productVersion}}).then((r) => {
            setLoading(false);
            if (r.status === 200) {

                const tableData: TableData = {
                    caption: '',
                    head: [t('Name'), t('Description'), t('Version'), t('TAK Prerequisite'), t('Size')],
                    body: [],
                };

                r.data.map((plugin: Plugin) => {
                    if (tableData.body !== undefined) {
                        let download_button = <Button
                            rightSection={<IconDownload size={14} />}
                            onClick={() => {
                                plugin.atak_version = productVersion;
                                download_plugin(plugin);
                            }}
                        >
                            {t("Download Plugin")}
                        </Button>
                        tableData.body.push([plugin.display_name, plugin.description, plugin.version, plugin.tak_prerequisite, bytes_formatter(plugin.apk_size_bytes), download_button]);
                    }
                })

                setPlugins(tableData);
            }
        }).catch((err) => {
            console.error(err);
            setLoading(false);
            notifications.show({
                title: t('Failed to get plugin list'),
                message: err.response.data.error,
                icon: <IconX />,
                color: 'red',
            })
        })
    }

    function download_plugin(plugin: Plugin) {
        setLoading(true);
        axios.post(apiRoutes.takgovPlugin, plugin).then((r) => {
            setLoading(false);
            if (r.status === 200) {
                notifications.show({
                    title: t('Success'),
                    message: t("Plugin downloaded Successfully"),
                    icon: <IconCheck />,
                    color: 'green',
                })
            }
        }).catch((err) => {
            console.error(err);
            setLoading(false);
            notifications.show({
                title: t('Failed to download plugin'),
                message: err.response.data.error,
                icon: <IconX />,
                color: 'red',
            })
        })
    }

    function get_codes() {
        setLoading(true);
        axios.get(apiRoutes.takgovLink).then((r) => {
            setLoading(false);
            if (r.status === 200) {
                let device_code = r.data.device_code;
                let user_code = r.data.user_code;

                setDeviceCode(device_code);
                setUserCode(user_code);
            }
        }).catch((err) => {
            setLoading(false);
            console.error(err);
            notifications.show({
                title: t('Failed to link account'),
                message: err.response.data.error,
                icon: <IconX />,
                color: 'red',
            })
        })
    }

    function get_token() {
        setLoading(true);
        axios.get(apiRoutes.takgovToken, {params: {device_code:deviceCode}}).then((r) => {
            setLoading(false);
            if (r.status === 200) {
                setLinked(true);
                notifications.show({
                    title: t("Success"),
                    message: t('Successfully Linked Account'),
                    icon: <IconCheck />,
                    color: 'green',
                })
            }
        }).catch((err) => {
            setLoading(false);
            console.error(err);
            notifications.show({
                title: t('Failed to get auth token'),
                message: err.response.data.error,
                icon: <IconX />,
                color: 'red',
            })
        })
    }

    function unlink_account() {
        setLoading(true);
        axios.delete(apiRoutes.takgov).then((r => {
            if (r.status === 200) {
                setLinked(false);
                setUserCode(null);
                setLoading(false);
                notifications.show({
                    title: t("Success"),
                    message: t('Successfully Unlinked Account'),
                    icon: <IconCheck />,
                    color: 'green',
                })
            }
        })).catch((err) => {
            console.error(err);
            notifications.show({
                title: t('Failed to unlink account'),
                message: err.response.data.error,
                icon: <IconX />,
                color: 'red',
            })
        })
    }

    useEffect(() => {
        check_if_linked();
    }, []);

    useEffect(() => {
        if (linked) {
            get_plugin_list();
        }
        else {
            // show instructions for linking
        }
    }, [linked]);

    useEffect(() => {
        if (linked)
            get_plugin_list();
    }, [productVersion, product]);

    return (
        <Box>
            <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2, fixed: true }} />

            <Modal opened={showUnlink} onClose={() => setShowUnlink(false)} title={t("Are you sure you want to unlink your account?")}>
                <Button onClick={() => {unlink_account(); setShowUnlink(false)}} mr="md">{t("Yes")}</Button>
                <Button onClick={() => setShowUnlink(false)}>{t("No")}</Button>
            </Modal>

            <Center display={linked ? "none" : "flex"}><TakGovLogo width={253} height={256} /></Center>

            <Flex w="100%" align="center" direction="row" gap="md">
                <Select
                    w="max-content"
                    display={linked ? "block" : "none"}
                    pb="md"
                    value={product}
                    data={["ATAK-CIV", "ATAK-GOV", "ATAK-MIL"]}
                    onChange={(value) => {setProduct(value);}}
                />
                <Select
                    w="max-content"
                    display={linked ? "block" : "none"}
                    pb="md"
                    value={productVersion}
                    data={["5.0.0", "5.1.0", "5.2.0", "5.3.0", "5.4.0", "5.5.0", "5.5.1", "5.6.0", "5.7.0", "5.8.0"]}
                    onChange={(value) => {setProductVersion(value);}}
                    inputContainer={(children) => (
                        <Group align="flex-start">
                            {children}
                            <Button display={linked ? "flex" : "none"} onClick={() => setShowUnlink(true)} color="red" rightSection={<IconCircleMinus size={14} />}>Unlink Account</Button>
                        </Group>
                    )}
                />
            </Flex>
            <Table.ScrollContainer minWidth="100%" display={linked ? "block" : "none"} mt="md">
                <Table stripedColor={computedColorScheme === 'light' ? 'gray.2' : 'dark.8'} highlightOnHoverColor={computedColorScheme === 'light' ? 'gray.4' : 'dark.6'} striped="odd" data={plugins} highlightOnHover withTableBorder mb="md" />
            </Table.ScrollContainer>

            <Container display={linked ? "none" : "block"} mt="md">
                <Title ta="center" order={2}>Link your TAK.gov account</Title>
                <Text ta="center">{t("Linking your TAK.gov account allows you to download plugins directly from your TAK.gov account \
                to this server and make them available to EUDs. Please log into your TAK.gov account before starting.")}"</Text>

                <Divider label={t("Step 1")} labelPosition="center" pt="md" />
                <Center><Button onClick={() => {get_codes()}} mt="md">{t("Get Link Code")}</Button></Center>
            </Container>

            <Container display={!linked && userCode !== null ? "block" : "none"} mt="md">
                <Divider label={t("Step 2")} labelPosition="center" mt="md" />
                <Text ta="center">{t("Enter the following code at")} <a href="https://tak.gov/register-device" target="_blank">https://tak.gov/register-device</a>.
                    {t("This code will expire in 3 minutes.")}</Text>
                <Title ta="center" order={2}>{userCode}</Title>

                <Divider label={t("Step 3")} labelPosition="center" pt="md" />
                <Text ta="center" mt="md">{t("Click the Link Account button after you have entered the above code on TAK.gov")}</Text>
                <Center mt="md"><Button onClick={() => get_token()}>{t("Link Account")}</Button></Center>
            </Container>
        </Box>
    )
}
