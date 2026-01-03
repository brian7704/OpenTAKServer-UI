import { Center, Pagination, Table, TableData, useComputedColorScheme } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import axios from '../axios_config';
import { apiRoutes } from '../apiRoutes';
import {t} from "i18next";
import {DataTable, type DataTableSortStatus} from "mantine-datatable";

interface Alert {
    uid: string;
    sender_uid: string;
    start_time: string;
    cancel_time: string;
    alert_type: string;
    point: Object;
    callsign: string;
}

export default function Alerts() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [activePage, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [alertCount, setAlertCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Alert>>({
        columnAccessor: 'start_time',
        direction: 'desc',
    });

    useEffect(() => {
        if (loading) return;
        setLoading(true);
        axios.get(
            apiRoutes.alerts,
            { params: {
                    page: activePage,
                    per_page: pageSize,
                    sort_by: sortStatus.columnAccessor,
                    sort_direction: sortStatus.direction
                } }
        ).then(r => {
            setLoading(false);
            if (r.status === 200) {
                setAlertCount(r.data.total)
                let rows: Alert[] = [];
                r.data.results.map((row: Alert) => {
                    rows.push(row);
                });

                setPage(r.data.current_page);
                setTotalPages(r.data.total_pages);
                setAlerts(rows);
            }
        });
    }, [activePage]);

    return (
        <>
            <Table.ScrollContainer minWidth="100%">
                <DataTable
                    withTableBorder
                    borderRadius="md"
                    shadow="sm"
                    striped
                    highlightOnHover
                    records={alerts}
                    columns={[{accessor: "callsign", title: t("Callsign"), sortable: true}, {accessor: "alert_type", title: t("Type"), sortable: true},
                        {accessor: "start_time", title: t("Start Time"), sortable: true}, {accessor: "cancel_time", title: t("Cancel Time"), sortable: true}]}
                    page={activePage}
                    onPageChange={(p) => setPage(p)}
                    onRecordsPerPageChange={setPageSize}
                    totalRecords={alertCount}
                    recordsPerPage={pageSize}
                    recordsPerPageOptions={[10, 15, 20, 25, 30, 35, 40, 45, 50]}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    fetching={loading}
                    minHeight={180}
                />
            </Table.ScrollContainer>
        </>
    );
}
