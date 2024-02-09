import {
    Table,
    TableData,
    Pagination,
    Center,
    useComputedColorScheme
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import axios from '../axios_config';
import { apiRoutes } from '../apiRoutes';

interface eud {
    callsign: string;
    device: string;
    platform: string;
    os: string;
    phone_number: number;
    username: string;
    uid: string;
    version: string;
    last_event_time: string;
    last_status: string;
}

export default function EUDs() {
    const [euds, setEuds] = useState<TableData>({
        caption: '',
        head: ['Callsign', 'Device', 'Platform', 'OS', 'Phone Number', 'Username', 'UID', 'Version', 'Last Event Time', 'Last Event'],
        body: [],
    });
    const [activePage, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    useEffect(() => {
        axios.get(
            apiRoutes.eud,
            { params: {
                    page: activePage,
                } }
        ).then(r => {
            if (r.status === 200) {
                const tableData: TableData = {
                    caption: '',
                    head: ['Callsign', 'Device', 'Platform', 'OS', 'Phone Number', 'Username', 'UID', 'Version', 'Last Event Time', 'Last Event'],
                    body: [],
                };

                r.data.results.map((row:any) => {
                    if (tableData.body !== undefined) {
                        tableData.body.push([row.callsign, row.device, row.platform, row.os, row.phone_number,
                            row.username, row.uid, row.version, row.last_event_time, row.last_status]);
                    }
                });

                setPage(r.data.current_page);
                setTotalPages(r.data.total_pages);
                setEuds(tableData);
            }
        });
    }, [activePage]);

    return (
        <>
            <Table.ScrollContainer minWidth="100%">
                <Table data={euds} stripedColor={computedColorScheme === 'light' ? 'gray.2' : 'dark.8'} highlightOnHoverColor={computedColorScheme === 'light' ? 'gray.4' : 'dark.6'} striped="odd" highlightOnHover withTableBorder mb="md" />
            </Table.ScrollContainer>
            <Center><Pagination total={totalPages} value={activePage} onChange={setPage} withEdges /></Center>
        </>
    );
}
