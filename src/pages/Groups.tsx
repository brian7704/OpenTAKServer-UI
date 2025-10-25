import {
    Button,
    Center, ComboboxItem, CopyButton, Grid, Modal, MultiSelect, NumberInput,
    Pagination, Paper, PasswordInput, Select, Switch,
    Table,
    TableData, TextInput, Title, Tooltip,
    useComputedColorScheme,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import {apiRoutes} from "@/apiRoutes.tsx";
import {IconCircleMinus, IconPlus, IconUserCog, IconUserMinus, IconX} from "@tabler/icons-react";

export default function Groups() {
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const [activePage, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [groupToDelete, setGroupToDelete] = useState('');
    const [deleteGroupOpen, setDeleteGroupOpen] = useState(false);
    const [showAddGroup, setShowAddGroup] = useState(false);
    const [showAddUserToGroup, setShowAddUserToGroup] = useState(false);
    const [users, setUsers] = useState<ComboboxItem[]>([]);
    const [group, setGroup] = useState("");
    const [members, setMembers] = useState<TableData>({
        caption: '',
        head: ['Username', 'Direction', 'Active'],
        body: [],
    });
    const [groups, setGroups] = useState<TableData>({
        caption: '',
        head: ['Name', 'Created', 'Type', 'Bit Position', 'Description'],
        body: [],
    });
    const [newGroupProperties, setNewGroupProperties] = useState(
        {   name: '',
            created: '',
            type: '',
            bitpos: 0,
            description: ''
        }
    );

    function get_groups() {
        axios.get(apiRoutes.groups, { params: {page: activePage,} })
            .then((r) => {
                if (r.status === 200) {
                    const tableData: TableData = {
                        caption: '',
                        head: ['Name', 'Created', 'Type', 'Bit Position', 'Description'],
                        body: [],
                    }

                    r.data.results.map((row: any) => {
                        if (tableData.body !== undefined) {
                            const delete_button = <Button
                                color="red"
                                onClick={() => {
                                    setGroupToDelete(row.name);
                                    setDeleteGroupOpen(true);
                                }}
                                key={`${row.name}_delete`}
                                rightSection={<IconCircleMinus size={14} />}
                            >Delete
                            </Button>;

                            const add_users_button = <Button
                                onClick={() => {
                                    getGroupMembers(row.name);
                                    getAllUsers();
                                    setGroup(row.name);
                                    setShowAddUserToGroup(true);
                                }}
                                key={`${row.name}_add`}
                                rightSection={<IconUserCog size={14} />}
                            >Manage Users</Button>;

                            tableData.body.push([row.name, row.created, row.type, parseInt(row.bitpos, 2), row.description, add_users_button, delete_button]);
                            console.log(tableData)
                        }
                    });
                    setPage(r.data.current_page);
                    setTotalPages(r.data.total_pages);
                    setGroups(tableData);
                }
            })
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
                title: 'Failed to create group',
                message: err.response.data.error,
                icon: <IconX />,
                color: 'red',
            });
        })
    }

    function getAllUsers() {
        axios.get(apiRoutes.allUsers).then((r) => {
            if (r.status === 200) {
                console.log(r);
                const all_users: ComboboxItem[] = [];
                r.data.map((row: any) => {
                    all_users.push({value: row.id+"", label: row.username});
                });
                setUsers(all_users);
            }
        }).catch(err => {
            console.log(err);
            notifications.show({
                title: 'Failed to get user list',
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
                    head: ['Username', 'Direction', 'Active'],
                    body: [],
                }

                r.data.map((row: any) => {
                    if (tableData.body !== undefined) {
                        const active_switch = <Tooltip refProp="rootRef" label="This membership can be activated or deactivated from the user's EUD">
                            <Switch
                                checked={row.active}
                            />
                        </Tooltip>

                        const delete_button = <Button
                            color="red"
                            onClick={() => {}}
                            key={`${row.username}_remove`}
                            rightSection={<IconUserMinus size={14} />}
                        >Remove
                        </Button>;

                        tableData.body.push([row.username, row.direction, active_switch, delete_button]);
                    }
                })

                setMembers(tableData);
            }
        }).catch(err => {
            console.log(err);
            notifications.show({
                title: 'Failed to get group members',
                message: err.response.data.error,
                icon: <IconX />,
                color: 'red',
            })
        });
    }

    useEffect(() => {
        get_groups();
    }, []);

    return (
        <>
            <Button onClick={() => setShowAddGroup(true)}>Add Group</Button>
            <Modal opened={showAddGroup} onClose={() => setShowAddGroup(false)} title="Add Group">
                <TextInput required label="Name" onChange={e => { newGroupProperties.name = e.target.value; }} mb="md" />
                <TextInput required label="Description" onChange={e => { newGroupProperties.description = e.target.value; }} mb="md" />
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
                                nothingFoundMessage="Nothing found..."
                                label="Select Users"
                                onChange={(value) => {console.log(value)}}
                                data={users} />
                        </Grid.Col>
                        <Grid.Col span={2}>
                            <Button>Add</Button>
                        </Grid.Col>
                    </Grid>
                </Paper>
                <Paper withBorder title="Direction: OUT" mb="md" p="md">
                    <Grid align="flex-end" justify="space-between">
                        <Grid.Col span={10}>
                            <Title order={6} mb="md">Direction: OUT</Title>
                            <MultiSelect
                                placeholder="Search"
                                searchable
                                nothingFoundMessage="Nothing found..."
                                label="Select Users"
                                onChange={(value) => {console.log(value)}}
                                data={users} />
                        </Grid.Col>
                        <Grid.Col span={2}>
                            <Button>Add</Button>
                        </Grid.Col>
                    </Grid>
                </Paper>
                <Title order={4} mb="md">Members</Title>
                <Table.ScrollContainer minWidth="100%">
                    <Table data={members} stripedColor={computedColorScheme === 'light' ? 'gray.2' : 'dark.8'} highlightOnHoverColor={computedColorScheme === 'light' ? 'gray.4' : 'dark.6'} striped="odd" highlightOnHover withTableBorder mt="md" mb="md" />
                </Table.ScrollContainer>
            </Modal>
            <Table.ScrollContainer minWidth="100%">
                <Table data={groups} stripedColor={computedColorScheme === 'light' ? 'gray.2' : 'dark.8'} highlightOnHoverColor={computedColorScheme === 'light' ? 'gray.4' : 'dark.6'} striped="odd" highlightOnHover withTableBorder mt="md" mb="md" />
            </Table.ScrollContainer>
        </>
    )
}
