import {
    Table,
    TableData,
    Pagination,
    Center,
    useComputedColorScheme, LoadingOverlay,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import {IconCheck, IconDownload, IconPlus, IconX} from '@tabler/icons-react';
import axios from '../axios_config';
import { apiRoutes } from '../apiRoutes';
import {Link} from "react-router";
import {t} from "i18next";
import { DataTable, type DataTableSortStatus } from 'mantine-datatable';
import sortBy from "lodash.sortby";

interface EUD {
    callsign: React.ReactNode;
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
    const [euds, setEuds] = useState<EUD[]>([]);
    const [eudCount, setEUDCount] = useState<number>(0);
    const [activePage, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus<EUD>>({
        columnAccessor: 'last_event_time',
        direction: 'desc',
    });

    function getEuds() {
        if (loading) {
            return;
        }
        setLoading(true);

        axios.get(apiRoutes.eud, { params: { page: activePage, per_page: pageSize, sort_by: sortStatus.columnAccessor, sort_direction: sortStatus.direction} }).then(r => {
            setLoading(false);
            if (r.status === 200) {
                setEUDCount(r.data.total)
                let rows: EUD[] = []

                r.data.results.map((row:any) => {
                    const callsign_link = <Link to={`/eud_stats?uid=${row.uid}&callsign=${row.callsign}`}>{row.callsign}</Link>
                    let eud: EUD = {
                        callsign: callsign_link,
                        device: row.device,
                        platform: row.platform,
                        os: row.os,
                        phone_number: row.phone_number,
                        username: row.username,
                        uid: row.uid,
                        version: row.version,
                        last_event_time: row.last_event_time,
                        last_status: row.last_status
                    }
                    rows.push(eud);
                });

                setPage(r.data.current_page);
                setTotalPages(r.data.total_pages);
                setEuds(rows);
            }
        }).catch(err => {
            setLoading(false);
            notifications.show({
                title: t('Failed to get EUDs'),
                message: err.response.data.error,
                icon: <IconX />,
                color: 'red',
            })
        });
    }

    useEffect(() => {
        setPage(1);
        getEuds();
    }, [pageSize]);

    useEffect(() => {
        getEuds();
    }, [activePage, sortStatus]);

    return (
        <>
            <Table.ScrollContainer minWidth="100%">
                <DataTable
                    withTableBorder
                    borderRadius="md"
                    shadow="sm"
                    striped
                    highlightOnHover
                    records={euds}
                    columns={[{accessor: "callsign", title: t("Callsign"), sortable: true}, {accessor: "device", title: t("Device"), sortable: true},
                        {accessor: "platform", title: t("Platform"), sortable: true}, {accessor: "os", title: t("OS"), sortable: true},
                        {accessor: "phone_number", title: t("Phone Number"), sortable: true}, {accessor: "username", title: "username"},
                        {accessor: "uid", title: t("UID")}, {accessor: "version", title: t("Version"), sortable: true},
                        {accessor: "last_event_time", title: t("Last Event Time"), sortable: true}, {accessor: "last_status", title: t("Last Event"), sortable: true}]}
                    page={activePage}
                    onPageChange={(p) => setPage(p)}
                    onRecordsPerPageChange={setPageSize}
                    totalRecords={eudCount}
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
