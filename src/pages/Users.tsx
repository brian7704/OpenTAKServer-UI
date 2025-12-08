import {
    Button,
    Center, Grid,
    Modal, MultiSelect,
    Pagination, Paper,
    PasswordInput,
    Select,
    Switch,
    Table,
    TableData,
    ComboboxItem,
    TextInput, useComputedColorScheme, Title, Tooltip,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import {
    IconCheck,
    IconPassword,
    IconUserCog,
    IconUserMinus,
    IconUserPlus,
    IconUsersMinus,
    IconX
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import axios from '../axios_config';
import { apiRoutes } from '../apiRoutes';
import {t} from "i18next";

export default function Users() {
    const [users, setUsers] = useState<TableData>({
        caption: '',
        head: [t('Username'), t('Role'), t('Active'), t('Last Login'), t('Last Login IP'), t('Current Login'), t('Current Login IP'), t('Login Count')],
        body: [],
    });
    const [activePage, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [addUserOpen, setAddUserOpen] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [showDeleteUser, setShowDeleteUser] = useState(false);
    const [showManageGroups, setShowManageGroups] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm_password, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');
    const [allGroups, setAllGroups] = useState<ComboboxItem[]>([])
    const [groups, setGroups] = useState<string[]>([]);
    const [memberships, setMemberships] = useState<TableData>({
        caption: '',
        head: [t('Group Name'), t('Direction'), t('Active')],
        body: [],
    });
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    function getUsers() {
        axios.get(
            apiRoutes.users,
            { params: {
                    page: activePage,
                } }
        ).then(r => {
            if (r.status === 200) {
                const tableData: TableData = {
                    caption: '',
                    head: [t('Username'), t('Role'), t('Active'), t('Last Login'), t('Last Login IP'), t('Current Login'), t('Current Login IP'), t('Login Count')],
                    body: [],
                };

                r.data.results.map((row:any) => {
                    if (tableData.body !== undefined) {
                        const reset_password_button = <Button
                          onClick={() => {
                            setShowResetPassword(true);
                            setUsername(row.username);
                        }}
                          rightSection={<IconPassword />}
                        >Reset Password</Button>;

                        const manage_groups_button = <Button
                            rightSection={<IconUserCog />}
                            onClick={() => {
                                setShowManageGroups(true);
                                getAllGroups();
                                getMemberships(row.username);
                                setUsername(row.username);
                            }}
                        >Manage Groups</Button>;

                        const delete_user_button = <Button
                            color='red'
                          disabled={row.username === localStorage.getItem('username')}
                            rightSection={<IconUserMinus />}
                          onClick={() => {
                            setUsername(row.username);
                            setShowDeleteUser(true);
                        }}
                        >Delete User</Button>;

                        const active_switch = <Switch
                          disabled={row.username === localStorage.getItem('username')}
                          checked={row.active}
                          onChange={(e) => {
                            if (e.target.checked) { activateUser(row.username); } else { deactivateUser(row.username); }
                        }}
                        />;

                        const role_select = <Select
                          value={row.roles[0].name}
                          onChange={(_value, option) => {
                            changeRole(row.username, option.value);
                        }}
                          data={[{ value: 'administrator', label: 'Administrator' }, { value: 'user', label: 'User' }]}
                          placeholder="Role"
                        />;

                        tableData.body.push([row.username, (row.username === localStorage.getItem('username') ? row.roles[0].name : role_select),
                            active_switch, row.last_login_at, row.last_login_ip, row.current_login_at, row.current_login_ip, row.login_count,
                            reset_password_button, manage_groups_button, delete_user_button]);
                    }
                    });

                    setPage(r.data.current_page);
                    setTotalPages(r.data.total_pages);
                    setUsers(tableData);
                }
            }).catch((err) => {
            console.log(err);
            notifications.show({
                title: t('Failed to get users'),
                message: err.response.data.error,
                icon: <IconX />,
                color: 'red',
            });
        });
        }

    useEffect(() => {
        getUsers();
    }, [activePage]);

    function getAllGroups() {
        axios.get(apiRoutes.allGroups).then(r => {
            if (r.status === 200) {
                const all_groups: ComboboxItem[] = [];
                r.data.map((row: any) => {
                    all_groups.push(row.name);
                })
                setAllGroups(all_groups);
            }
        }).catch(err => {
            console.log(err);
            notifications.show({
                title: t('Failed to get group list'),
                message: err.response.data.error,
                icon: <IconX />,
                color: 'red',
            })
        });
    }

    function removeUserFromGroup(username: string, group_name: string, direction: string) {
        axios.delete(apiRoutes.groupMembers, {params: {username, group_name, direction}}).then((r) => {
            if (r.status === 200) {
                getMemberships(username);
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

    function getMemberships(user_name: string) {
        axios.get(apiRoutes.userGroups,{params: {username: user_name}}).then(r => {
            if (r.status === 200) {
                const tableData: TableData = {
                    caption: '',
                    head: [t('Group Name'), t('Direction'), t('Active')],
                    body: [],
                };

                r.data.results.map((row: any) => {
                    const active_switch = <Tooltip refProp="rootRef" label={t("This membership can be activated or deactivated from the user's EUD")}>
                        <Switch
                            checked={row.active}
                        />
                    </Tooltip>

                    const delete_button = <Button
                        color="red"
                        onClick={() => {removeUserFromGroup(user_name, row.group_name, row.direction);}}
                        key={`${row.group_name}_remove`}
                        rightSection={<IconUsersMinus size={14} />}
                    >Remove</Button>;

                    tableData.body?.push([row.group_name, row.direction, active_switch, delete_button]);
                })

                setMemberships(tableData);
            }
        })
    }

    function addUserToGroups(direction: string) {
        axios.put(apiRoutes.userGroups, {username, direction, groups}).then(r => {
            if (r.status === 200) {
                getMemberships(username);
                setGroups([]);
            }
        }).catch(err => {
            console.log(err);
            notifications.show({
                title: t('Failed to add user to group'),
                message: err.response.data.error,
                icon: <IconX />,
                color: 'red',
            })
        });
    }

    function deleteUser() {
        axios.post(apiRoutes.deleteUser, { username })
            .then(r => {
                if (r.status === 200) {
                    notifications.show({
                        message: t('Successfully deleted user'),
                        icon: <IconCheck />,
                        color: 'green',
                    });
                    getUsers();
                }
            }).catch(err => {
            console.log(err);
            notifications.show({
                title: t('Failed to delete user'),
                message: err.response.data.error,
                icon: <IconX />,
                color: 'red',
            });
        });
    }

    function addUser(e:any) {
        e.preventDefault();
        axios.post(
            apiRoutes.addUser,
            { username, password, confirm_password, roles: [role] }
        ).then(r => {
            if (r.status === 200) {
                setPassword('');
                setConfirmPassword('');
                setAddUserOpen(false);
                getUsers();
            }
        }).catch(err => {
            notifications.show({
                title: t('Failed to add user'),
                message: err.response.data.error,
                color: 'red',
            });
        });
    }

    function changeRole(username:string, role:string) {
        axios.post(
            apiRoutes.changeRole,
            { username, roles: [role] }
        ).then(r => {
            if (r.status === 200) {
                getUsers();
                notifications.show({
                    message: `Changed ${username}'s role to ${role}`,
                    color: 'green',
                });
            }
        }).catch(err => {
            notifications.show({
                title: `Failed to change ${username}'s role`,
                message: err.response.data.error,
                color: 'red',
            });
        });
    }

    function deactivateUser(username:string) {
        axios.post(
            apiRoutes.deactivateUser,
            { username }
        ).then(r => {
            if (r.status === 200) {
                getUsers();
                notifications.show({
                    message: `${username} has been deactivated`,
                    color: 'green',
                });
            }
        }).catch(err => {
            notifications.show({
                title: `Failed to deactivate ${username}`,
                message: err.response.data.error,
                color: 'red',
            });
        });
    }

    function activateUser(username:string) {
        axios.post(
            apiRoutes.activateUser,
            { username }
        ).then(r => {
            if (r.status === 200) {
                getUsers();
                notifications.show({
                    message: `${username} has been activated`,
                    color: 'green',
                });
            }
        }).catch(err => {
            notifications.show({
                title: `Failed to activate ${username}`,
                message: err.response.data.error,
                color: 'red',
            });
        });
    }

    function resetPassword(e:any) {
            e.preventDefault();
            axios.post(
                apiRoutes.adminResetPassword,
                { username, new_password: password }
            ).then(r => {
                if (r.status === 200) {
                    getUsers();
                    setShowResetPassword(false);
                    setPassword('');
                    notifications.show({
                        message: `${username}'s password has been changed`,
                        color: 'green',
                    });
                }
            }).catch(err => {
                notifications.show({
                    title: `Failed to change ${username}'s password`,
                    message: err.response.data.error,
                    color: 'red',
                });
            });
    }

    return (
        <>
            <Button onClick={() => { setAddUserOpen(true); }} mb="md" leftSection={<IconUserPlus size={14} />}>Add User</Button>
            <Table.ScrollContainer minWidth="100%">
                <Table data={users} stripedColor={computedColorScheme === 'light' ? 'gray.2' : 'dark.8'} highlightOnHoverColor={computedColorScheme === 'light' ? 'gray.4' : 'dark.6'} striped="odd" highlightOnHover withTableBorder mb="md" />
            </Table.ScrollContainer>
            <Center><Pagination total={totalPages} value={activePage} onChange={setPage} withEdges /></Center>
            <Modal size="lg" opened={showManageGroups} onClose={() => setShowManageGroups(false)} title={`Manage Groups for ${username}`}>
                <Paper withBorder p="md" mb="md">
                    <Grid align="flex-end" justify="space-between">
                        <Grid.Col span={10}>
                            <Title order={6} mb="md">Direction: IN</Title>
                            <MultiSelect
                                placeholder="Search"
                                searchable
                                clearable
                                nothingFoundMessage="Nothing found..."
                                label="Select Groups"
                                onChange={(value) => {setGroups(value)}}
                                data={allGroups} />
                        </Grid.Col>
                        <Grid.Col span={2}>
                            <Button onClick={() => addUserToGroups("IN")}>{t("Add")}</Button>
                        </Grid.Col>
                    </Grid>
                </Paper>
                <Paper withBorder p="md" mb="md">
                    <Grid align="flex-end" justify="space-between">
                        <Grid.Col span={10}>
                            <Title order={6} mb="md">{t("Direction")}: OUT</Title>
                            <MultiSelect
                                placeholder={t("Search")}
                                searchable
                                clearable
                                nothingFoundMessage={t("Nothing found...")}
                                label="Select Groups"
                                onChange={(value) => {setGroups(value)}}
                                data={allGroups} />
                        </Grid.Col>
                        <Grid.Col span={2}>
                            <Button onClick={() => addUserToGroups("OUT")}>Add</Button>
                        </Grid.Col>
                    </Grid>
                </Paper>
                <Title order={4} mb="md">{t("Memberships")}</Title>
                <Table.ScrollContainer minWidth="100%">
                    <Table data={memberships} stripedColor={computedColorScheme === 'light' ? 'gray.2' : 'dark.8'} highlightOnHoverColor={computedColorScheme === 'light' ? 'gray.4' : 'dark.6'} striped="odd" highlightOnHover withTableBorder mt="md" mb="md" />
                </Table.ScrollContainer>
            </Modal>
            <Modal opened={addUserOpen} onClose={() => setAddUserOpen(false)} title={t("Add User")}>
                <TextInput required label="Username" placeholder="Username" onChange={e => { setUsername(e.target.value); }} />
                <PasswordInput
                  label="Password"
                  placeholder="Password"
                  required
                  mt="md"
                  mb="md"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                <PasswordInput
                  label="Confirm Password"
                  placeholder="Confirm Password"
                  required
                  mt="md"
                  mb="md"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirm_password}
                />
                <Select
                  label="Role"
                  placeholder="Role"
                  data={['user', 'administrator']}
                  mb="md"
                  onChange={(_value, option) => { setRole(option.value); }}
                />
                <Button onClick={(e) => { addUser(e); }}>Add User</Button>
            </Modal>
            <Modal opened={showResetPassword} onClose={() => setShowResetPassword(false)} title={`Reset ${username}'s Password`}>
                <PasswordInput
                  label="Password"
                  placeholder="Password"
                  required
                  mt="md"
                  mb="md"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                <Button onClick={(e) => { resetPassword(e); }}>Change Password</Button>
            </Modal>
            <Modal opened={showDeleteUser} onClose={() => setShowDeleteUser(false)} title={`Are you sure you want to delete ${username}?`}>
                <Center>
                    <Button
                      mr="md"
                      onClick={() => {
                        deleteUser();
                        setShowDeleteUser(false);
                    }}
                    >Yes
                    </Button>
                    <Button onClick={() => setShowDeleteUser(false)}>No</Button>
                </Center>
            </Modal>
        </>
    );
}
