import {
    Button,
    Center,
    Modal,
    Pagination,
    PasswordInput,
    Select,
    Switch,
    Table,
    TableData,
    TextInput, useComputedColorScheme,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { IconCheck, IconUserPlus, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import axios from '../axios_config';
import { apiRoutes } from '../apiRoutes';

export default function Users() {
    const [users, setUsers] = useState<TableData>({
        caption: '',
        head: ['Username', 'Role', 'Active', 'Last Login', 'Last Login IP', 'Current Login', 'Current Login IP', 'Login Count'],
        body: [],
    });
    const [activePage, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [addUserOpen, setAddUserOpen] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [showDeleteUser, setShowDeleteUser] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm_password, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');
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
                    head: ['Username', 'Role', 'Active', 'Last Login', 'Last Login IP', 'Current Login', 'Current Login IP', 'Login Count'],
                    body: [],
                };

                r.data.results.map((row:any) => {
                    if (tableData.body !== undefined) {
                        const reset_password_button = <Button
                          onClick={() => {
                            setShowResetPassword(true);
                            setUsername(row.username);
                        }}
                        >Reset Password
                                                      </Button>;

                        const delete_user_button = <Button
                          disabled={row.username === localStorage.getItem('username')}
                          onClick={() => {
                            setUsername(row.username);
                            setShowDeleteUser(true);
                        }}
                        >Delete User
                                                   </Button>;

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
                            active_switch, row.last_login_at, row.last_login_ip, row.current_login_at, row.current_login_ip, row.login_count, reset_password_button, delete_user_button]);
                    }
                    });

                    setPage(r.data.current_page);
                    setTotalPages(r.data.total_pages);
                    setUsers(tableData);
                }
            });
        }

    useEffect(() => {
        getUsers();
    }, [activePage]);

    function deleteUser() {
        axios.post(apiRoutes.deleteUser, { username })
            .then(r => {
                if (r.status === 200) {
                    notifications.show({
                        message: 'Successfully deleted user',
                        icon: <IconCheck />,
                        color: 'green',
                    });
                    getUsers();
                }
            }).catch(err => {
            console.log(err);
            notifications.show({
                title: 'Failed to delete user',
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
                title: 'Failed to add user',
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
            <Modal opened={addUserOpen} onClose={() => setAddUserOpen(false)} title="Add User">
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
