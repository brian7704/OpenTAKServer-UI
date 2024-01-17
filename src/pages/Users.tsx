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
import { IconUserPlus } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import axios from '../axios_config';
import { apiRoutes } from '../config';

export default function Users() {
    const [users, setUsers] = useState<TableData>({
        caption: '',
        head: ['Username', 'Protocol', 'Address', 'Port', 'Path', 'Link'],
        body: [],
    });
    const [activePage, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [addUserOpen, setAddUserOpen] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
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
                        const reset_password_button = <Button onClick={() => {
                            setShowResetPassword(true);
                            setUsername(row.username);
                        }}
                        >Reset Password
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
                            active_switch, row.last_login_at, row.last_login_ip, row.current_login_at, row.current_login_ip, row.login_count, reset_password_button]);
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
            <Table data={users} stripedColor={computedColorScheme === 'light' ? 'gray.2' : 'dark.4'} highlightOnHoverColor={computedColorScheme === 'light' ? 'gray.4' : 'dark.6'} striped="odd" highlightOnHover withTableBorder mb="md" />
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
        </>
    );
}
