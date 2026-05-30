import {
    Button,
    Center, ComboboxItem, Grid, Modal, MultiSelect, Paper,
    Switch,
    Table,
    TableData, TextInput, Title, Tooltip,
    useComputedColorScheme,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import {apiRoutes} from "@/apiRoutes.tsx";
import {IconCircleMinus, IconUserCog, IconUserMinus, IconX} from "@tabler/icons-react";
import {t} from "i18next";
import { DataTable, type DataTableSortStatus } from 'mantine-datatable';

export interface Group {
    name: string;
    created: string;
    type: string;
    bitpos: number;
    description: string;
}

export default function Groups() {
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const [activePage, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Group>>({
        columnAccessor: 'name',
        direction: 'asc',
    });
    const [groupToDelete, setGroupToDelete] = useState('');
    const [deleteGroupOpen, setDeleteGroupOpen] = useState(false);
    const [showAddGroup, setShowAddGroup] = useState(false);
    const [showAddUserToGroup, setShowAddUserToGroup] = useState(false);
    const [users, setUsers] = useState<string[]>([])
    const [allUsers, setAllUsers] = useState<ComboboxItem[]>([]);
    const [inUsers, setInUsers] = useState<ComboboxItem[]>([]);
    const [outUsers, setOutUsers] = useState<ComboboxItem[]>([]);
    const [group, setGroup] = useState("");
    const [members, setMembers] = useState<TableData>({
        caption: '',
        head: [t('Username'), t('Direction'), t('Active')],
        body: [],
    });
    const [groups, setGroups] = useState<Group[]>([]);
    const [newGroupProperties, setNewGroupProperties] = useState(
        {   name: '',
            created: '',
            type: '',
            bitpos: 0,
            description: ''
        }
    );

    function get_groups() {
        if (loading) {
            return;
        }
        setLoading(true);
        axios.get(apiRoutes.groups, {
            params: {
                page: activePage,
                per_page: pageSize,
                sort_by: sortStatus.columnAccessor,
                sort_direction: sortStatus.direction,
            }
        })
            .then((r) => {
                setLoading(false);
                if (r.status === 200) {
                    const rows: Group[] = r.data.results.map((row: any) => ({
                        name: row.name,
                        created: row.created,
                        type: row.type,
                        bitpos: parseInt(row.bitpos, 2),
                        description: row.description,
                    }));
                    setPage(r.data.current_page);
                    setTotalRecords(r.data.total);
                    setGroups(rows);
                }
            }).catch((err) => {
                setLoading(false);
                console.log(err);
                notifications.show({
                    title: t('Failed to get groups'),
                    message: err.response.data.error,
                    icon: <IconX />,
                    color: 'red',
                });
            });
    }

    function addGroup() {
        console.log(newGroupProperties)
        axios.post(apiRoutes.groups, newGroupProperties).then((r) => {
            if (r.status === 200) {
                setShowAddGroup(false);
                get_groups();
            }
        }).catch((err) => {
            console.log(err);
            notifications.show({
                title: t('Failed to create group'),
                message: err.response.data.error,
                icon: <IconX />,
                color: 'red',
            });
        })
    }

    function addUsersToGroup(direction: string) {
        axios.put(apiRoutes.groups, {users, group_name: group, direction}).then((r) => {
            if (r.status === 200) {
                getGroupMembers(group);
                setUsers([]);
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

    function getAllUsers() {
        axios.get(apiRoutes.allUsers).then((r) => {
            if (r.status === 200) {
                const all_users: ComboboxItem[] = [];
                r.data.map((row: any) => {
                    all_users.push(row.username);
                });
                setAllUsers(all_users);
            }
        }).catch(err => {
            console.log(err);
            notifications.show({
                title: t('Failed to get user list'),
                message: err.response.data.error,
                icon: <IconX />,
                color: 'red',
            })
        });
    }

    function deleteGroup(group_name: string) {
        axios.delete(apiRoutes.groups, {params: {group_name}}).then((r) => {
            if (r.status === 200) {
                get_groups();
            }
        }).catch(err => {
            console.log(err);
            notifications.show({
                title: `Failed delete ${group_name}`,
                message: err.response.data.error,
                icon: <IconX />,
                color: 'red',
            })
        });
    }

    function removeUserFromGroup(username: string, group_name: string, direction: string) {
        axios.delete(apiRoutes.groupMembers, {params: {username, group_name, direction}}).then((r) => {
            if (r.status === 200) {
                getGroupMembers(group_name);
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

    function getGroupMembers(name: string) {
        axios.get(apiRoutes.groupMembers, {params: {name}}).then((r) => {
            if (r.status === 200) {
                const tableData: TableData = {
                    caption: '',
                    head: [t('Username'), t('Direction'), t('Active')],
                    body: [],
                }

                let inMembers = allUsers;
                let outMembers = allUsers;

                r.data.map((row: any) => {
                    if (tableData.body !== undefined) {
                        const active_switch = <Tooltip refProp="rootRef" label={t("This membership can be activated or deactivated from the user's EUD")}>
                            <Switch
                                checked={row.active}
                            />
                        </Tooltip>

                        const delete_button = <Button
                            color="red"
                            onClick={() => {
                                removeUserFromGroup(row.username, name, row.direction);
                            }}
                            key={`${row.username}_remove`}
                            rightSection={<IconUserMinus size={14} />}
                        >Remove
                        </Button>;

                        tableData.body.push([row.username, row.direction, active_switch, delete_button]);
                    }

                    if (row.direction === "IN") {
                        inMembers.filter((member) => member === row.username);
                        console.log(inMembers);
                    }

                    if (row.direction === "OUT") {
                        outMembers.filter((member) => member === row.username);
                        console.log(outMembers);
                    }
                });

                setInUsers(inMembers);
                setOutUsers(outMembers);
                setMembers(tableData);
            }
        }).catch(err => {
            console.log(err);
            notifications.show({
                title: t('Failed to get group members'),
                message: err.response.data.error,
                icon: <IconX />,
                color: 'red',
            })
        });
    }

    useEffect(() => {
        setPage(1);
        get_groups();
    }, [pageSize]);

    useEffect(() => {
        get_groups();
    }, [activePage, sortStatus]);

    return (
        <>
            <Button onClick={() => setShowAddGroup(true)}>Add Group</Button>
            <Modal opened={showAddGroup} onClose={() => setShowAddGroup(false)} title={t("Add Group")}>
                <TextInput required label={t("Name")} onChange={e => { newGroupProperties.name = e.target.value; }} mb="md" />
                <TextInput required label={t("Description")} onChange={e => { newGroupProperties.description = e.target.value; }} mb="md" />
                <Button
                    mb="md"
                    onClick={e => {
                        addGroup();
                    }}
                >Add Group
                </Button>
            </Modal>
            <Modal size="xl" opened={showAddUserToGroup} onClose={() => setShowAddUserToGroup(false)} title={`Manage ${group} Members`}>
                <Paper withBorder p="md" mb="md">
                    <Grid align="flex-end" justify="space-between">
                        <Grid.Col span={10}>
                            <Title order={6} mb="md">Direction: IN</Title>
                            <MultiSelect
                                placeholder="Search"
                                searchable
                                clearable
                                nothingFoundMessage={t("Nothing found...")}
                                label={t("Select Users")}
                                onChange={(value) => {setUsers(value)}}
                                data={allUsers} />
                        </Grid.Col>
                        <Grid.Col span={2}>
                            <Button onClick={() => addUsersToGroup("IN")}>{t("Add")}</Button>
                        </Grid.Col>
                    </Grid>
                </Paper>
                <Paper withBorder title={t("Direction: OUT")} mb="md" p="md">
                    <Grid align="flex-end" justify="space-between">
                        <Grid.Col span={10}>
                            <Title order={6} mb="md">Direction: OUT</Title>
                            <MultiSelect
                                placeholder="Search"
                                searchable
                                nothingFoundMessage={t("Nothing found...")}
                                label={t("Select Users")}
                                onChange={(value) => {setUsers(value)}}
                                data={allUsers} />
                        </Grid.Col>
                        <Grid.Col span={2}>
                            <Button onClick={() => addUsersToGroup("OUT")}>{t("Add")}</Button>
                        </Grid.Col>
                    </Grid>
                </Paper>
                <Title order={4} mb="md">{t("Members")}</Title>
                <Table.ScrollContainer minWidth="100%">
                    <Table data={members} stripedColor={computedColorScheme === 'light' ? 'gray.2' : 'dark.8'} highlightOnHoverColor={computedColorScheme === 'light' ? 'gray.4' : 'dark.6'} striped="odd" highlightOnHover withTableBorder mt="md" mb="md" />
                </Table.ScrollContainer>
            </Modal>
            <Modal opened={deleteGroupOpen} onClose={() => setDeleteGroupOpen(false)} title={`Delete Group ${groupToDelete}?`}>
                <Center>
                    <Button
                        mr="md"
                        onClick={() => {
                            deleteGroup(groupToDelete);
                            setDeleteGroupOpen(false);
                        }}
                    >Yes
                    </Button>
                    <Button onClick={() => setDeleteGroupOpen(false)}>{t("No")}</Button>
                </Center>
            </Modal>
            <Table.ScrollContainer minWidth="100%">
                <DataTable
                    withTableBorder
                    borderRadius="md"
                    shadow="sm"
                    striped
                    highlightOnHover
                    records={groups}
                    columns={[
                        { accessor: 'name', title: t('Name'), sortable: true },
                        { accessor: 'created', title: t('Created'), sortable: true },
                        { accessor: 'type', title: t('Type'), sortable: true },
                        { accessor: 'bitpos', title: t('Bit Position'), sortable: true },
                        { accessor: 'description', title: t('Description'), sortable: true },
                        {
                            accessor: 'actions_manage',
                            title: '',
                            render: (row: Group) => (
                                <Button
                                    onClick={() => {
                                        getGroupMembers(row.name);
                                        getAllUsers();
                                        setGroup(row.name);
                                        setShowAddUserToGroup(true);
                                    }}
                                    rightSection={<IconUserCog size={14} />}
                                >Manage Users</Button>
                            ),
                        },
                        {
                            accessor: 'actions_delete',
                            title: '',
                            render: (row: Group) => (
                                <Button
                                    color="red"
                                    onClick={() => {
                                        setGroupToDelete(row.name);
                                        setDeleteGroupOpen(true);
                                    }}
                                    disabled={row.name === "__ANON__"}
                                    rightSection={<IconCircleMinus size={14} />}
                                >Delete</Button>
                            ),
                        },
                    ]}
                    page={activePage}
                    onPageChange={(p) => setPage(p)}
                    onRecordsPerPageChange={setPageSize}
                    totalRecords={totalRecords}
                    recordsPerPage={pageSize}
                    recordsPerPageOptions={[10, 15, 20, 25, 30, 35, 40, 45, 50]}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    fetching={loading}
                    minHeight={180}
                />
            </Table.ScrollContainer>
        </>
    )
}
