import {
    Button,
    Center, CopyButton, Modal, NumberInput,
    Pagination, Select, Switch,
    Table,
    TableData, TextInput, Tooltip,
    useComputedColorScheme,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import {apiRoutes} from "@/apiRoutes.tsx";
import {IconCircleMinus, IconX} from "@tabler/icons-react";

export default function Groups() {
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const [activePage, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [groupToDelete, setGroupToDelete] = useState('');
    const [deleteGroupOpen, setDeleteGroupOpen] = useState(false);
    const [showAddGroup, setShowAddGroup] = useState(false);
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
                                onClick={() => {
                                    setGroupToDelete(row.name);
                                    setDeleteGroupOpen(true);
                                }}
                                key={`${row.name}_delete`}
                                rightSection={<IconCircleMinus size={14} />}
                            >Delete
                            </Button>;

                            tableData.body.push([row.name, row.created, row.type, parseInt(row.bitpos, 2), row.description, delete_button]);
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
                >Add Channel
                </Button>
            </Modal>
            <Table.ScrollContainer minWidth="100%">
                <Table data={groups} stripedColor={computedColorScheme === 'light' ? 'gray.2' : 'dark.8'} highlightOnHoverColor={computedColorScheme === 'light' ? 'gray.4' : 'dark.6'} striped="odd" highlightOnHover withTableBorder mt="md" mb="md" />
            </Table.ScrollContainer>
        </>
    )
}
