import {Button, Checkbox, Combobox, ComboboxHeader, Flex, Grid, Group,
    InputBase, Modal, NumberInput, Radio, ScrollArea, Select, Switch, Table, TextInput, Title} from '@mantine/core';
import {DataTable, DataTableSortStatus} from "mantine-datatable";
import {t} from "i18next";
import React, {useState} from "react";

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
    display_name: string | undefined;
    address: string | undefined;
    port: number | undefined;
    enabled: boolean;
    protocol_version: string | undefined;
    reconnect_interval: number;
    unlimited_retries: boolean;
    max_retries: number;
    use_token_auth: boolean;
    auth_token_type: string | undefined;
    auth_token: string | undefined;
    last_error: string | undefined;
    description: string | undefined;
    uid: string | undefined;
    federate: Federate | undefined;
}

export default function Federation () {
    const [activePage, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [federationConnections, setFederationConnections] = useState<FederationConnection[]>([]);
    const [federationCount, setFederationCount] = useState(0);
    const [federationConnectionModalOpen, setFederationConnectionModalOpen] = useState(false);
    const [federateModalOpen, setFederateModalOpen] = useState(false);
    const [newFederationConnection, setNewFederationConnection] = useState<FederationConnection>(
        {
            address: undefined,
            auth_token: undefined,
            auth_token_type: "automatic",
            description: undefined,
            display_name: undefined,
            enabled: true,
            federate: undefined,
            last_error: undefined,
            max_retries: 3,
            port: 9102,
            protocol_version: undefined,
            reconnect_interval: 30,
            uid: undefined,
            unlimited_retries: true,
            use_token_auth: false

        }
    );
    const [newFederate, setNewFederate] = useState<Federate>({
        archive: false,
        automatic_group_matching: false,
        certificate_file: "",
        fallback_group_matching: false,
        federate_group_matching: false,
        max_hops: 0,
        name: "",
        notes: "",
        shared_alerts: false,
        use_group_hop_limiting: false

    })
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus<FederationConnection>>({
        columnAccessor: 'start_time',
        direction: 'desc',
    });

    return (
        <ScrollArea>
            <Grid mb="md">
                <Grid.Col span={{"sm": 6, "lg": 10}}><Title mb="xl" order={2}>{t("Outgoing Federation Connections")}</Title></Grid.Col>
                <Grid.Col span={{"sm": 6, "lg": 2}}><Button onClick={() => setFederationConnectionModalOpen(true)}>{t('Add Connection')}</Button></Grid.Col>
            </Grid>
            <Table.ScrollContainer minWidth="100%" mb="md">
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

            <Grid mb="md">
                <Grid.Col span={{"sm": 6, "lg": 10}}><Title mb="xl" order={2}>{t("Federate Configuration")}</Title></Grid.Col>
                <Grid.Col span={{"sm": 6, "lg": 2}}><Button onClick={() => setFederateModalOpen(true)}>{t('Add Federate')}</Button></Grid.Col>
            </Grid>
            <Table.ScrollContainer minWidth="100%">
                <DataTable
                    withTableBorder
                    borderRadius="md"
                    shadow="sm"
                    striped
                    highlightOnHover
                    records={federationConnections}
                    columns={[{accessor: "name", title: t("Name"), sortable: true}, {accessor: "shared_alerts", title: t("Shared Alerts"), sortable: true},
                        {accessor: "archive", title: t("Archive"), sortable: true}, {accessor: "federate_group_matching", title: t("Federate Group Matching"), sortable: true},
                        {accessor: "automatic_group_matching", title: t("Automatic Group Matching"), sortable: true}, {accessor: "fallback_group_matching", title: t("Fallback Group Matching"), sortable: true},
                        {accessor: "max_hops", title: t("Max Hops"), sortable: true}, {accessor: "use_group_hop_limiting", title: t("Group Hop Limiting"), sortable: true},
                        {accessor: "notes", title: t("Notes"), sortable: true}, {accessor: "certificate_file", title: t("Certificate"), sortable: true}]}
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
            <Modal opened={federationConnectionModalOpen} onClose={() => setFederationConnectionModalOpen(false)} title={t("New Federation Connection")}>
                <TextInput required label={t("Name")} onChange={e => { setNewFederationConnection(prevState => ({ ...prevState, display_name: e.target.value }))}} mb="md" />
                <TextInput required label={t("Address")} onChange={e => { setNewFederationConnection(prevState => ({ ...prevState, address: e.target.value }))}} mb="md" />
                <NumberInput required value={9102} label={t("Port")} onChange={e => { setNewFederationConnection(prevState => ({ ...prevState, port: +e }))}} mb="md" min={1} max={65535} />
                <Switch checked label={t("Enabled")} onChange={(e) => {setNewFederationConnection(prevState => ({ ...prevState, enabled : e.target.checked }))}} mb="md" />
                <NumberInput disabled label={t("Protocol Version")} mb="md" value={2} description={t("OpenTAKServer supports only protocol version 2")} />
                <NumberInput required value={30} label={t("Reconnect Interval")} onChange={e => { setNewFederationConnection(prevState => ({ ...prevState, reconnect_interval: +e }))}} mb="md" min={0} description={t("Set to zero to disable")} />
                <Switch checked label={t("Unlimited Retries")} onChange={(e) => {setNewFederationConnection(prevState => ({ ...prevState, unlimited_retries : e.target.checked }))}} mb="md" />
                <NumberInput required value={3} label={t("Max Retries")} onChange={e => { setNewFederationConnection(prevState => ({ ...prevState, max_retries: +e }))}} mb="md" min={0} description={t("Has no effect when unlimited retries is enabled")} />
                <Select label={t("Federate")} placeholder={t("Choose Federate")} mb="md"></Select>
                <Select label={t("Fallback Connection")} placeholder={t("Choose Fallback Connection")} mb="md"></Select>
                <Switch label={t("Use Token Auth")} onChange={(e) => {setNewFederationConnection(prevState => ({ ...prevState, use_token_auth : e.target.checked }))}} mb="md" />
                <Radio.Group defaultValue="automatic" name="auth_token_type" label={t("Auth Token Type")} disabled={!newFederationConnection.use_token_auth} onChange={(e) => setNewFederationConnection(prevState => ({...prevState, auth_token_type: e}))} mb="md">
                    <Group>
                        <Radio label={t("Automatic Token")} value="automatic" />
                        <Radio label={t("Manual Token")} value="manual" />
                    </Group>
                </Radio.Group>
                <TextInput disabled={!newFederationConnection.use_token_auth || newFederationConnection.auth_token_type === "automatic"} required label={t("Auth Token")} onChange={e => { setNewFederationConnection(prevState => ({ ...prevState, display_name: e.target.value }))}} mb="md" />
                <TextInput required label={t("Description")} onChange={e => { setNewFederationConnection(prevState => ({ ...prevState, description  : e.target.value }))}} mb="md" />
            </Modal>
        </ScrollArea>
    )
}
