import {Button, Center, Checkbox, Combobox, ComboboxData, ComboboxHeader, ComboboxItem, FileInput, Flex, Grid, Group,
    InputBase, Modal, NumberInput, Radio, ScrollArea, Select, Switch, Table, TextInput, Title} from '@mantine/core';
import {DataTable, DataTableSortStatus} from "mantine-datatable";
import {t} from "i18next";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {apiRoutes} from "@/apiRoutes.tsx";
import {notifications} from "@mantine/notifications";
import {IconCircleMinus, IconX} from "@tabler/icons-react";

interface Federate {
    id: string;
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
    issuer: string;
    subject: string;
    serial_number: string;
    certificate_download_button: React.ReactNode | null;
    common_name: string;
    delete_button: React.ReactNode | undefined,
    shared_alerts_switch: React.ReactNode | undefined,
    archive_switch: React.ReactNode | undefined,
    automatic_group_matching_switch: React.ReactNode | undefined,
    fallback_group_matching_switch: React.ReactNode | undefined,
    group_hop_limiting_switch: React.ReactNode | undefined,
    federate_group_matching_switch: React.ReactNode | undefined,
    enabled_switch: React.ReactNode | undefined,
    enabled: boolean,
}

interface FederationConnection {
    id: string;
    display_name: string;
    address: string | undefined;
    port: number | undefined;
    enabled: boolean;
    enabled_button: React.ReactNode | null;
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
    federate_id: string | undefined | null;
    federate: Federate | undefined;
    delete_button: React.ReactNode | null;
}

export default function Federation () {
    const [activePage, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [fedConnectionsLoading, setFedConnectionsLoading] = useState(false);
    const [federatesLoading, setFederatesLoading] = useState(false);
    const [federationConnections, setFederationConnections] = useState<FederationConnection[]>([]);
    const [allFederationConnections, setAllFederationConnections] = useState<ComboboxItem[]>([]);
    const [federationCount, setFederationCount] = useState(0);
    const [federationConnectionModalOpen, setFederationConnectionModalOpen] = useState(false);
    const [federateModalOpen, setFederateModalOpen] = useState(false);
    const [newFederateCert, setNewFederateCert] = useState<File | null>(null);
    const [federates, setFederates] = useState<Federate[]>([]);
    const [allFederates, setAllFederates] = useState<ComboboxItem[]>([]);
    const [issuerError, setIssuerError] = useState<boolean>(false);
    const [subjectError, setSubjectError] = useState<boolean>(false);
    const [serialNumberError, setSerialNumberError] = useState<boolean>(false);
    const [nameError, setNameError] = useState<boolean>(false);
    const [deleteFedConnectionOpen, setDeleteFedConnectionOpen] = useState(false);
    const [fedConnectionToDelete, setFedConnectionToDelete] = useState<FederationConnection | undefined>(undefined);
    const [deleteFederateModalOpen, setDeleteFederateModalOpen] = useState(false);
    const [federateToDelete, setFederateToDelete] = useState<Federate | undefined>(undefined);
    const [newFederationConnection, setNewFederationConnection] = useState<FederationConnection>(
        {
            federate_id: undefined,
            id: "",
            address: undefined,
            auth_token: undefined,
            auth_token_type: "automatic",
            delete_button: undefined,
            description: undefined,
            display_name: "",
            enabled: true,
            enabled_button: undefined,
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
        enabled: false,
        enabled_switch: undefined,
        federate_group_matching_switch: undefined,
        archive_switch: undefined,
        automatic_group_matching_switch: undefined,
        fallback_group_matching_switch: undefined,
        group_hop_limiting_switch: undefined,
        shared_alerts_switch: undefined,
        id: "",
        issuer: "", serial_number: "", subject: "",
        archive: false,
        automatic_group_matching: true,
        certificate_file: "",
        certificate_download_button: null,
        common_name: "",
        delete_button: undefined,
        fallback_group_matching: false,
        federate_group_matching: false,
        max_hops: -1,
        name: "",
        notes: "",
        shared_alerts: true,
        use_group_hop_limiting: false

    })
    const [fedConnectionSortStatus, setFedConnectionSortStatus] = useState<DataTableSortStatus<FederationConnection>>({
        columnAccessor: 'display_name',
        direction: 'desc',
    });

    const [federateSortStatus, setFederateSortStatus] = useState<DataTableSortStatus<Federate>>({
        columnAccessor: 'name',
        direction: 'desc',
    });

    function getFederationConnections() {
        axios.get(apiRoutes.federation).then((r) => {
            if (r.status === 200) {
                const all_fed_connections: ComboboxItem[] = [];
                r.data.results.map((fedConnection: FederationConnection) => {
                    all_fed_connections.push({label: fedConnection.display_name, value: fedConnection.id})

                    fedConnection.delete_button = <Button color="red" onClick={() => {
                        setFedConnectionToDelete(fedConnection);
                        setDeleteFedConnectionOpen(true);
                    }}><IconCircleMinus size={14} /></Button>

                })
                setFederationConnections(r.data.results);
                setAllFederationConnections(all_fed_connections);
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    function getFederates() {
        setFederatesLoading(true);
        axios.get(apiRoutes.allFederates).then((r) => {
            if (r.status === 200) {
                const all_federates: ComboboxItem[] = [];
                r.data.results.map((federate: Federate) => {
                    all_federates.push({label: federate.name, value: federate.id})

                    federate.delete_button = <Button color="red" onClick={() => {
                        setFederateToDelete(federate)
                        setDeleteFederateModalOpen(true);
                    }}><IconCircleMinus size={14} /></Button>

                    federate.shared_alerts_switch = <Switch checked={federate.shared_alerts} />
                    federate.archive_switch = <Switch checked={federate.archive} />
                    federate.automatic_group_matching_switch = <Switch checked={federate.automatic_group_matching} />
                    federate.fallback_group_matching_switch = <Switch checked={federate.fallback_group_matching} />
                    federate.group_hop_limiting_switch = <Switch checked={federate.use_group_hop_limiting} />
                    federate.federate_group_matching_switch = <Switch checked={federate.federate_group_matching} />
                    federate.enabled_switch = <Switch checked={federate.enabled} />
                })
                setAllFederates(all_federates)
                setFederates(r.data.results);
            }
            setFederatesLoading(false);
        }).catch((err) => {
            console.log(err);
            notifications.show({
                message: err.message,
                color: "red",
                icon: <IconX />
            });
            setFederatesLoading(false);
        });
    }

    function deleteFedConnection() {
        axios.delete(apiRoutes.federation, {params: {"id": fedConnectionToDelete?.id}}).then((r) => {
            getFederationConnections();
        }).catch((err) => {
            console.log(err);
            notifications.show({
                title: t("Failed to delete federation connection"),
                message: err.response.data.error,
                color: 'red',
                icon: <IconX />
            })
        })
    }

    function deleteFederate() {
        axios.delete(apiRoutes.federate, {params: {"id": federateToDelete?.id}}).then((r) => {
            getFederates();
        }).catch((err) => {
            console.log(err);
            notifications.show({
                title: t("Failed to delete federate"),
                message: err.response.data.error,
                color: 'red',
                icon: <IconX />
            })
        })
    }

    function addFederationConnection() {
        setFedConnectionsLoading(true);
        axios.post(apiRoutes.federation, newFederationConnection).then((r) => {
            if (r.status === 200) {
                setFederationConnectionModalOpen(false);
                getFederationConnections();
            }
            setFedConnectionsLoading(false);
        }).catch((err) => {
            console.log(err);
            notifications.show({
                message: t("Failed to add federation connection"),
                color: "red",
                icon: <IconX />
            })
            setFedConnectionsLoading(false);
        })
    }

    function addFederate() {
        if (!newFederate.name || !newFederate.certificate_file || !newFederate.issuer || !newFederate.subject || !newFederate.serial_number) {
            if (!newFederate.name) setNameError(true);
            if (!newFederate.issuer) setIssuerError(true);
            if (!newFederate.subject) setSubjectError(true);
            if (!newFederate.serial_number) setSerialNumberError(true);
            return
        }
        setFederatesLoading(true);
        axios.post(apiRoutes.federate, newFederate).then((r) => {
            if (r.status === 200) {
                getFederates();
                setFederateModalOpen(false);
                setFederatesLoading(true);
            }
            setFederatesLoading(true);
        }).catch((err) => {
            console.log(err);
            notifications.show({
                message: t("Failed to add federate"),
                color: "red",
                icon: <IconX />
            })
            setFederatesLoading(true);
        })
    }

    function uploadFederateCert() {
        if (newFederateCert) {
            const formData = new FormData();
            formData.append('cert_file', newFederateCert);
            axios.post(apiRoutes.federationCertificate, formData).then((r) => {
                if (r.status === 200) {
                    setNewFederate(prevState => ({...prevState, issuer: r.data.issuer, certificate_file: r.data.certificate_file, subject: r.data.subject, serial_number: r.data.serial_number}));
                    setIssuerError(false);
                    setSubjectError(false);
                    setSerialNumberError(false);
                }
            }).catch((err) => {
                console.log(err);
                notifications.show({
                    title: t("Failed to upload certificate"),
                    message: err.response.data.error,
                    color: "red",
                    icon: <IconX />
                })
            })
        }
    }

    useEffect(() => {
        if (newFederateCert)
            uploadFederateCert();
        else {
            setNewFederate(prevState => ({...prevState, issuer: "", certificate_file: "", subject: "", serial_number: ""}));
        }
    }, [newFederateCert]);

    useEffect(() => {
        getFederationConnections();
        getFederates();
    }, [fedConnectionSortStatus, federateSortStatus]);

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
                        {accessor: "federate.name", title: t("Federate"), sortable: true}, {accessor: "protocol_version", title: t("Protocol Version"), sortable: true},
                        {accessor: "enabled", title: t("Enabled"), sortable: true}, {accessor: "last_error", title: t("Last Error"), sortable: true},
                        {accessor: "delete_button", title: t("Delete"), sortable: true}
                    ]}
                    page={0}
                    onPageChange={() => {}}
                    onRecordsPerPageChange={() => {}}
                    totalRecords={federationCount}
                    recordsPerPage={pageSize}
                    recordsPerPageOptions={[]}
                    sortStatus={fedConnectionSortStatus}
                    onSortStatusChange={setFedConnectionSortStatus}
                    fetching={fedConnectionsLoading}
                    minHeight={federationConnections.length > 0 ? 10 : 180}
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
                    records={federates}
                    columns={[{accessor: "name", title: t("Name"), sortable: true}, {accessor: "shared_alerts_switch", title: t("Shared Alerts"), sortable: true},
                        {accessor: "archive_switch", title: t("Archive"), sortable: true}, {accessor: "federate_group_matching_switch", title: t("Federate Group Matching"), sortable: true},
                        {accessor: "automatic_group_matching_switch", title: t("Automatic Group Matching"), sortable: true}, {accessor: "fallback_group_matching_switch", title: t("Fallback Group Matching"), sortable: true},
                        {accessor: "max_hops", title: t("Max Hops"), sortable: true}, {accessor: "group_hop_limiting_switch", title: t("Group Hop Limiting"), sortable: true},
                        {accessor: "notes", title: t("Notes"), sortable: true}, {accessor: "issuer", title: t("Issuer"), sortable: true},
                        {accessor: "subject", title: t("Subject"), sortable: true}, {accessor: "serial_number", title: t("Serial Number"), sortable: true},
                        {accessor: "certificate_download_button", title: t("Download Certificate"), sortable: true}, {accessor: "delete_button", title: t("Delete"), sortable: true},
                    ]}
                    page={0}
                    onPageChange={() => {}}
                    onRecordsPerPageChange={() => {}}
                    totalRecords={federationCount}
                    recordsPerPage={pageSize}
                    recordsPerPageOptions={[]}
                    sortStatus={federateSortStatus}
                    onSortStatusChange={setFederateSortStatus}
                    fetching={federatesLoading}
                    minHeight={federates.length > 0 ? 10 : 180}
                />
            </Table.ScrollContainer>

            <Modal opened={federationConnectionModalOpen} onClose={() => setFederationConnectionModalOpen(false)} title={t("New Federation Connection")}>
                <TextInput required label={t("Name")} onChange={e => { setNewFederationConnection(prevState => ({ ...prevState, display_name: e.target.value }))}} mb="md" />
                <TextInput required label={t("Address")} onChange={e => { setNewFederationConnection(prevState => ({ ...prevState, address: e.target.value }))}} mb="md" />
                <NumberInput required defaultValue={9102} label={t("Port")} onChange={e => { setNewFederationConnection(prevState => ({ ...prevState, port: +e }))}} mb="md" min={1} max={65535} />
                <Switch defaultChecked={true} label={t("Enabled")} onChange={(e) => {setNewFederationConnection(prevState => ({ ...prevState, enabled : e.target.checked }))}} mb="md" />
                <NumberInput disabled label={t("Protocol Version")} mb="md" value={2} description={t("OpenTAKServer supports only protocol version 2")} />
                <NumberInput required defaultValue={30} label={t("Reconnect Interval")} onChange={e => { setNewFederationConnection(prevState => ({ ...prevState, reconnect_interval: +e }))}} mb="md" min={0} description={t("Set to zero to disable")} />
                <Switch defaultChecked={true} label={t("Unlimited Retries")} onChange={(e) => {setNewFederationConnection(prevState => ({ ...prevState, unlimited_retries : e.target.checked }))}} mb="md" />
                <NumberInput required defaultValue={3} label={t("Max Retries")} onChange={e => { setNewFederationConnection(prevState => ({ ...prevState, max_retries: +e }))}} mb="md" min={0} description={t("Has no effect when unlimited retries is enabled")} />
                <Select required label={t("Federate")} onChange={(value, option) => {setNewFederationConnection(prevState => ({...prevState, federate_id: value}))}} data={allFederates} placeholder={t("Choose Federate")} nothingFoundMessage={t("Nothing found...")} mb="md"></Select>
                <Select label={t("Fallback Connection")} placeholder={t("Choose Fallback Connection")} data={allFederationConnections} nothingFoundMessage={t("Nothing found...")} mb="md"></Select>
                <Switch label={t("Use Token Auth")} onChange={(e) => {setNewFederationConnection(prevState => ({ ...prevState, use_token_auth : e.target.checked }))}} mb="md" />
                <Radio.Group defaultValue="automatic" name="auth_token_type" label={t("Auth Token Type")} disabled={!newFederationConnection.use_token_auth} onChange={(e) => setNewFederationConnection(prevState => ({...prevState, auth_token_type: e}))} mb="md">
                    <Group>
                        <Radio label={t("Automatic Token")} value="automatic" />
                        <Radio label={t("Manual Token")} value="manual" />
                    </Group>
                </Radio.Group>
                <TextInput disabled={!newFederationConnection.use_token_auth || newFederationConnection.auth_token_type === "automatic"} label={t("Auth Token")} onChange={e => { setNewFederationConnection(prevState => ({ ...prevState, display_name: e.target.value }))}} mb="md" />
                <TextInput label={t("Description")} onChange={e => { setNewFederationConnection(prevState => ({ ...prevState, description  : e.target.value }))}} mb="md" />
                <Button onClick={() => {addFederationConnection()}}>{t("Submit")}</Button>
            </Modal>

            <Modal opened={federateModalOpen} onClose={() => setFederateModalOpen(false)} title={t("New Federate")} size="lg">
                <TextInput required error={nameError} label={t("Name")} onChange={e => { setNewFederate(prevState => ({ ...prevState, name    : e.target.value })); setNameError(false)}} mb="md" />
                <Switch defaultChecked={true} label={t("Shared Alerts")} onChange={(e) => {setNewFederate(prevState => ({ ...prevState, shared_alerts : e.target.checked }))}} mb="md" />
                <Switch label={t("Archive")} onChange={(e) => {setNewFederate(prevState => ({ ...prevState, archive : e.target.checked }))}} mb="md" />
                <Switch defaultChecked={true} label={t("Automatic Group Matching")} onChange={(e) => {setNewFederate(prevState => ({ ...prevState, automatic_group_matching : e.target.checked }))}} mb="md" />
                <Switch label={t("Fallback Group Matching")} onChange={(e) => {setNewFederate(prevState => ({ ...prevState, fallback_group_matching : e.target.checked }))}} mb="md" />
                <NumberInput defaultValue={-1} label={t("Max Hops")} onChange={e => { setNewFederate(prevState => ({ ...prevState, max_hops: +e }))}} mb="md" min={-1} />
                <Switch label={t("Use Group Hop Limiting")} onChange={(e) => {setNewFederate(prevState => ({ ...prevState, fallback_group_matching : e.target.checked }))}} mb="md" />
                <TextInput label={t("Notes")} onChange={e => { setNewFederate(prevState => ({ ...prevState, notes: e.target.value }))}} mb="md" />
                <FileInput required clearable label={t("Certificate File")} description={t("Must be in PEM format")} accept="application/x-pem-file" mb="md" onChange={setNewFederateCert} />
                <TextInput disabled required error={issuerError} label={t("Issuer")} value={newFederate.issuer} mb="md" />
                <TextInput disabled required error={subjectError} label={t("Subject")} value={newFederate.subject} mb="md" />
                <TextInput disabled required error={serialNumberError} label={t("Serial Number")} value={newFederate.serial_number} mb="md" />
                <Button onClick={() => {addFederate()}}>{t("Submit")}</Button>
            </Modal>

            <Modal opened={deleteFederateModalOpen} onClose={() => {setDeleteFederateModalOpen(false)}} title={t("Are you sure you want to delete {{federate}}?", {"federate": federateToDelete?.name})}>
                <Center>
                    <Button
                        mr="md"
                        onClick={() => {
                            deleteFederate();
                            setDeleteFederateModalOpen(false);
                        }}
                    >{t("Yes")}
                    </Button>
                    <Button onClick={() => setDeleteFederateModalOpen(false)}>{t("No")}</Button>
                </Center>
            </Modal>

            <Modal opened={deleteFedConnectionOpen} onClose={() => {setDeleteFedConnectionOpen(false)}} title={t("Are you sure you want to delete {{fedConnection}}?", {"fedConnection": fedConnectionToDelete?.display_name})}>
                <Center>
                    <Button
                        mr="md"
                        onClick={() => {
                            deleteFedConnection();
                            setDeleteFedConnectionOpen(false);
                        }}
                    >{t("Yes")}
                    </Button>
                    <Button onClick={() => setDeleteFederateModalOpen(false)}>{t("No")}</Button>
                </Center>
            </Modal>
        </ScrollArea>
    )
}
