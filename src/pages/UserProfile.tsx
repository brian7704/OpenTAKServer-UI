import React, {useState, useEffect} from "react";
import {Link, useParams} from "react-router"
import {t} from "i18next";
import LanguageSelector from "../components/LanguageSelector.tsx";
import {
    Text,
    Center,
    Title,
    TableData,
    Table,
    Tabs,
    useComputedColorScheme,
    Button,
    Tooltip,
    Switch
} from "@mantine/core"
import axios from "axios";
import {apiRoutes} from "@/apiRoutes.tsx";
import {notifications} from "@mantine/notifications";
import {IconUsersMinus, IconX, IconDeviceMobile, IconUsersGroup} from "@tabler/icons-react";

interface User {
    id: number;
    username: string;
    active: boolean;
    current_login_at: string;
    current_login_ip: string;
    last_login_at: string;
    last_login_ip: string;
    login_count: number;
    email: string;
    euds: EUD[];
    groups: Group[];
    roles: Role[];
    group_memberships: GroupMemberships[];
}

interface EUD {
    callsign: string;
    device: string;
    last_event_time: string;
    last_status: string;
    os: string;
    phone_number: string;
    platform: string;
    team_id: number;
    team_role: string;
    uid: string;
    version: string;
}

interface Group {
    name: string;
    type: string;
    created: string;
    description: string;
    distinguishedName: string;
    bitpos: number;
}

interface Role {
    name: string;
    description: string;
    update_timestamp: string;
}

interface GroupMemberships {
    active: boolean;
    direction: string;
    group_name: string;
    username: string;
}

export default function UserProfile() {
    const [user, setUser] = useState<User>();
    const [rerender, setRerender] = useState(false);
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const [euds, setEuds] = useState<TableData>({
        caption: '',
        head: [t('Callsign'), t('Device'), t('Platform'), t('OS'), t('Phone Number'), t('UID'), t('Version'), t('Last Event Time'), t('Last Event')],
        body: [],
    });
    const [memberships, setMemberships] = useState<TableData>({
        caption: '',
        head: [t('Group Name'), t('Direction'), t('Active')],
        body: [],
    });

    let params = useParams();

    function get_user_info() {
        let username = localStorage.getItem("username");
        if (params.username)
            username = params.username;

        axios.get(apiRoutes.users, {params: {username}}).then(r => {
            if (r.status === 200) {
                setUser(r.data.results[0]);
            }
        }).catch(err => {
            console.log(err);
            notifications.show({
                title: t('Failed to get user info'),
                message: err.response.data.error,
                color: 'red',
                icon: <IconX />,
            })
        });
    }

    function generate_eud_table() {
        let body: any = [];
        user?.euds.forEach((eud: EUD) => {
            const callsign_link = <Link to={`/eud_stats?uid=${eud.uid}&callsign=${eud.callsign}`}>{eud.callsign}</Link>
            body.push([callsign_link, eud.device, eud.platform, eud.os, eud.phone_number,
                eud.uid, eud.version, eud.last_event_time, eud.last_status]);
        })

        setEuds({...euds, body: body});
    }

    function generate_groups_table() {
        let body: any = [];
        user?.group_memberships.forEach((membership: GroupMemberships) => {
            const delete_button = <Button
                color="red"
                onClick={() => {removeUserFromGroup(user?.username, membership.group_name, membership.direction);}}
                key={`${membership.group_name}_remove`}
                rightSection={<IconUsersMinus size={14} />}
            >Remove</Button>;

            const active_switch = <Tooltip refProp="rootRef" label={t("This membership can be activated or deactivated from the user's EUD")}>
                <Switch
                    checked={membership.active}
                />
            </Tooltip>

            body.push([membership.group_name, membership.direction, active_switch, delete_button]);
        });

        setMemberships({...memberships, body: body});
    }

    function removeUserFromGroup(username: string, group_name: string, direction: string) {
        axios.delete(apiRoutes.groupMembers, {params: {username, group_name, direction}}).then((r) => {
            if (r.status === 200) {
                get_user_info();
            }
        }).catch(err => {
            console.log(err);
            notifications.show({
                title: t('Failed remove user from group'),
                message: err.response.data.error,
                icon: <IconX />,
                color: 'red',
            })
        });
    }

    useEffect(() => {
        get_user_info();
    }, [])

    useEffect(() => {
        if (rerender)
            setRerender(false);
    }, [rerender]);

    useEffect(() => {
        generate_eud_table();
        generate_groups_table();
    }, [user]);

    return (
        <>
            <Center mb="md"><Title order={2}>{user?.username}</Title></Center>
            <Center mb="md"><Text>{t("Last Login: ") + user?.last_login_at}</Text></Center>
            <Center mb="md"><Text>{user?.email}</Text></Center>
            <Center mb="md" display={localStorage.getItem("username") === user?.username ? "flex" : "none"}><Text>{t("Language")}</Text><LanguageSelector /></Center>
            <Center mb="md" display={localStorage.getItem("username") === user?.username ? "flex" : "none"}><Text>{t("Time Zone")}</Text><LanguageSelector /></Center>

            <Tabs defaultValue="euds">
                <Tabs.List>
                    <Tabs.Tab value="euds" leftSection={<IconDeviceMobile size={12} />}>
                        {t("EUDs")}
                    </Tabs.Tab>
                    <Tabs.Tab value="groups" leftSection={<IconUsersGroup size={12} />}>
                        {t("Groups")}
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="euds">
                    <Table.ScrollContainer minWidth="100%">
                        <Table data={euds} stripedColor={computedColorScheme === 'light' ? 'gray.2' : 'dark.8'} highlightOnHoverColor={computedColorScheme === 'light' ? 'gray.4' : 'dark.6'} striped="odd" highlightOnHover withTableBorder mb="md" />
                    </Table.ScrollContainer>
                </Tabs.Panel>

                <Tabs.Panel value="groups">
                    <Table.ScrollContainer minWidth="100%">
                        <Table data={memberships} stripedColor={computedColorScheme === 'light' ? 'gray.2' : 'dark.8'} highlightOnHoverColor={computedColorScheme === 'light' ? 'gray.4' : 'dark.6'} striped="odd" highlightOnHover withTableBorder mb="md" />
                    </Table.ScrollContainer>
                </Tabs.Panel>
            </Tabs>
        </>
    )
}
