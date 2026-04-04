import { Table } from '@mantine/core';
import {DataTable, DataTableSortStatus} from "mantine-datatable";
import {t} from "i18next";
import {useState} from "react";

interface Federate {
    name: string;
    shared_alerts: boolean;
    archive: boolean;
    federate_group_matching: boolean;
    automatic_group_matching: boolean;
    fallback_group_matching: boolean;
    max_hops: number;
    use_group_hop_limiting: boolean
    notes: string;
    certificate_file: string;
}

interface FederationConnection {
    display_name: string;
    address: string;
    port: number;
    enabled: boolean;
    protocol_version: string;
    reconnect_interval: number;
    unlimited_retries: boolean;
    max_retries: number;
    use_token_auth: boolean;
    auth_token_type: string;
    auth_token: string;
    last_error: string;
    description: string;
    uid: string;
    federate: Federate;
}

export default function Federation () {
    const [activePage, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [federationConnections, setFederationConnections] = useState<FederationConnection[]>([]);
    const [federationCount, setFederationCount] = useState(0);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus<FederationConnection>>({
        columnAccessor: 'start_time',
        direction: 'desc',
    });

    return (
        <Table.ScrollContainer minWidth="100%">
            <DataTable
                withTableBorder
                borderRadius="md"
                shadow="sm"
                striped
                highlightOnHover
                records={federationConnections}
                columns={[{accessor: "display_name", title: t("Name"), sortable: true}, {accessor: "address", title: t("Address"), sortable: true},
                    {accessor: "port", title: t("Port"), sortable: true}, {accessor: "status", title: t("Status"), sortable: true},
                    {accessor: "reconnect_interval", title: t("Reconnect Interval"), sortable: true}, {accessor: "max_retries", title: t("Max Retries"), sortable: true},
                    {accessor: "federate_name", title: t("Federate"), sortable: true}, {accessor: "protocol_version", title: t("Protocol Version"), sortable: true},
                    {accessor: "enabled", title: t("Enabled"), sortable: true}, {accessor: "last_error", title: t("Last Error"), sortable: true}]}
                page={activePage}
                onPageChange={(p) => setPage(p)}
                onRecordsPerPageChange={setPageSize}
                totalRecords={federationCount}
                recordsPerPage={pageSize}
                recordsPerPageOptions={[10, 15, 20, 25, 30, 35, 40, 45, 50]}
                sortStatus={sortStatus}
                onSortStatusChange={setSortStatus}
                fetching={loading}
                minHeight={180}
                />
        </Table.ScrollContainer>
    )
}
