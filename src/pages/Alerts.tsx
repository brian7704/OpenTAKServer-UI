import { Center, Pagination, Table, TableData, useComputedColorScheme } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import axios from '../axios_config';
import { apiRoutes } from '../config';

interface alert {
    callsign: string;
    alert_type: string;
    start_time: string;
    cancel_time: string;
    phone_number: number;
}

export default function Alerts() {
    const [alerts, setAlerts] = useState<TableData>({
        caption: '',
        head: ['Callsign', 'Type', 'Start Time', 'Cancel Time'],
        body: [],
    });
    const [activePage, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    useEffect(() => {
        axios.get(
            apiRoutes.alerts,
            { params: {
                    page: activePage,
                } }
        ).then(r => {
            if (r.status === 200) {
                const tableData: TableData = {
                    caption: '',
                    head: ['Callsign', 'Type', 'Start Time', 'Cancel Time'],
                    body: [],
                };

                r.data.results.map((row:any) => {
                    if (tableData.body !== undefined) {
                        tableData.body.push([row.callsign, row.alert_type, row.start_time, row.cancel_time]);
                    }
                });

                setPage(r.data.current_page);
                setTotalPages(r.data.total_pages);
                setAlerts(tableData);
            }
});
}, [activePage]);
    return (
        <>
            <Table stripedColor={computedColorScheme === 'light' ? 'gray.2' : 'dark.8'} highlightOnHoverColor={computedColorScheme === 'light' ? 'gray.4' : 'dark.6'} striped="odd" data={alerts} highlightOnHover withTableBorder mb="md" />
            <Center><Pagination total={totalPages} value={activePage} onChange={setPage} withEdges /></Center>
        </>
    );
}
