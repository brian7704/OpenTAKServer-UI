import {
    Badge,
    Button,
    Checkbox,
    FileButton,
    Group,
    Modal,
    NumberInput,
    Select,
    Stack,
    Table,
    TableData,
    Text,
    Textarea,
    TextInput,
    Title,
    Tooltip,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import {
    IconCheck,
    IconCircleMinus,
    IconEdit,
    IconPlus,
    IconRefresh,
    IconToggleLeft,
    IconToggleRight,
    IconUpload,
    IconX,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import axios from '../axios_config';
import { apiRoutes } from '../apiRoutes';

interface FederationServer {
    id: number;
    name: string;
    description?: string;
    address: string;
    port: number;
    connection_type: string;
    protocol_version: string;
    transport_protocol: string;
    use_tls: boolean;
    verify_ssl: boolean;
    ca_certificate?: string;
    client_certificate?: string;
    client_key?: string;
    sync_missions: boolean;
    sync_cot: boolean;
    mission_filter?: any;
    enabled: boolean;
    status?: string;
}

interface FederationStatus {
    total_changes?: number;
    sent_changes?: number;
    pending_changes?: number;
}

export default function FederationPage() {
    const [federations, setFederations] = useState<TableData>({
        caption: '',
        head: ['Name', 'Address', 'Connection', 'Protocol', 'Transport', 'Status', 'Enabled', 'Actions'],
        body: [],
    });

    // Modals
    const [addModalOpened, setAddModalOpened] = useState(false);
    const [editModalOpened, setEditModalOpened] = useState(false);
    const [deleteModalOpened, setDeleteModalOpened] = useState(false);
    const [statsModalOpened, setStatsModalOpened] = useState(false);

    // Form state
    const [currentFederation, setCurrentFederation] = useState<FederationServer | null>(null);
    const [currentStats, setCurrentStats] = useState<FederationStatus | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        port: 9000,
        connection_type: 'OUTBOUND',
        protocol_version: 'FEDERATION_V2',
        transport_protocol: 'tcp',
        use_tls: true,
        verify_ssl: true,
        ca_certificate: '',
        client_certificate: '',
        client_key: '',
        sync_missions: true,
        sync_cot: true,
        mission_filter: '',
        enabled: true,
    });

    useEffect(() => {
        getFederations();
    }, []);

    function getFederations() {
        axios
            .get(apiRoutes.federationServers)
            .then((r) => {
                if (r.status === 200) {
                    const tableData: TableData = {
                        caption: '',
                        head: ['Name', 'Address', 'Connection', 'Protocol', 'Transport', 'Status', 'Enabled', 'Actions'],
                        body: [],
                    };

                    const servers = r.data.servers || [];
                    servers.forEach((fed: FederationServer) => {
                        const statusColor =
                            fed.status === 'connected'
                                ? 'green'
                                : fed.status === 'error'
                                ? 'red'
                                : 'gray';

                        const row = [
                            <div key={`${fed.id}_name`}>
                                <Text fw={500}>{fed.name}</Text>
                                {fed.description && (
                                    <Text size="xs" c="dimmed">
                                        {fed.description}
                                    </Text>
                                )}
                            </div>,
                            <Text key={`${fed.id}_addr`}>
                                {fed.address}:{fed.port}
                            </Text>,
                            <Badge key={`${fed.id}_conn_type`} color={fed.connection_type === 'outbound' ? 'blue' : 'purple'}>
                                {fed.connection_type.toUpperCase()}
                            </Badge>,
                            <div key={`${fed.id}_protocol`}>
                                <Badge color={fed.protocol_version === 'v2' ? 'green' : 'yellow'}>
                                    {fed.protocol_version === 'v2' ? 'V2' : 'V1'}
                                </Badge>
                            </div>,
                            <div key={`${fed.id}_transport`}>
                                <Badge color={
                                    fed.transport_protocol === 'tcp' ? 'blue' :
                                    fed.transport_protocol === 'udp' ? 'orange' : 'grape'
                                }>
                                    {(fed.transport_protocol || 'tcp').toUpperCase()}
                                </Badge>
                                {fed.use_tls && (
                                    <Badge color="cyan" ml="xs">
                                        {fed.transport_protocol === 'tcp' ? 'TLS' : 'DTLS'}
                                    </Badge>
                                )}
                                {(fed.transport_protocol === 'udp' || fed.transport_protocol === 'multicast') && (
                                    <Badge color="yellow" ml="xs">
                                        Config Only
                                    </Badge>
                                )}
                            </div>,
                            <Badge key={`${fed.id}_status`} color={statusColor}>
                                {fed.status || 'UNKNOWN'}
                            </Badge>,
                            <Badge key={`${fed.id}_enabled`} color={fed.enabled ? 'green' : 'red'}>
                                {fed.enabled ? 'Enabled' : 'Disabled'}
                            </Badge>,
                            <Group key={`${fed.id}_actions`} gap="xs">
                                <Tooltip label="View Statistics">
                                    <Button
                                        size="xs"
                                        variant="light"
                                        color="blue"
                                        onClick={() => handleViewStats(fed)}
                                    >
                                        <IconRefresh size={16} />
                                    </Button>
                                </Tooltip>
                                <Tooltip label="Edit">
                                    <Button
                                        size="xs"
                                        variant="light"
                                        onClick={() => handleEdit(fed)}
                                    >
                                        <IconEdit size={16} />
                                    </Button>
                                </Tooltip>
                                <Tooltip label={fed.enabled ? 'Disable' : 'Enable'}>
                                    <Button
                                        size="xs"
                                        variant="light"
                                        color={fed.enabled ? 'orange' : 'green'}
                                        onClick={() => handleToggle(fed)}
                                    >
                                        {fed.enabled ? <IconToggleRight size={16} /> : <IconToggleLeft size={16} />}
                                    </Button>
                                </Tooltip>
                                <Tooltip label="Delete">
                                    <Button
                                        size="xs"
                                        variant="light"
                                        color="red"
                                        onClick={() => {
                                            setCurrentFederation(fed);
                                            setDeleteModalOpened(true);
                                        }}
                                    >
                                        <IconCircleMinus size={16} />
                                    </Button>
                                </Tooltip>
                            </Group>,
                        ];

                        if (tableData.body !== undefined) {
                            tableData.body.push(row);
                        }
                    });

                    setFederations(tableData);
                }
            })
            .catch((err) => {
                console.error(err);
                notifications.show({
                    title: 'Error',
                    message: err.response?.data?.error || 'Failed to load federation servers',
                    color: 'red',
                });
            });
    }

    function handleViewStats(federation: FederationServer) {
        axios
            .get(`${apiRoutes.federationServers}/${federation.id}/status`)
            .then((r) => {
                if (r.status === 200) {
                    setCurrentFederation(federation);
                    setCurrentStats({
                        total_changes: r.data.total_changes,
                        sent_changes: r.data.sent_changes,
                        pending_changes: r.data.pending_changes,
                    });
                    setStatsModalOpened(true);
                }
            })
            .catch((err) => {
                notifications.show({
                    title: 'Error',
                    message: err.response?.data?.error || 'Failed to load statistics',
                    color: 'red',
                });
            });
    }

    function handleAdd() {
        const payload = {
            ...formData,
            mission_filter: formData.mission_filter ? JSON.parse(formData.mission_filter) : null,
        };

        axios
            .post(apiRoutes.federationServers, payload)
            .then((r) => {
                if (r.status === 201) {
                    notifications.show({
                        message: 'Federation server created successfully',
                        color: 'green',
                    });
                    setAddModalOpened(false);
                    resetForm();
                    getFederations();
                }
            })
            .catch((err) => {
                notifications.show({
                    title: 'Error',
                    message: err.response?.data?.error || 'Failed to create federation server',
                    color: 'red',
                });
            });
    }

    function handleEdit(federation: FederationServer) {
        setCurrentFederation(federation);
        setFormData({
            name: federation.name,
            description: federation.description || '',
            address: federation.address,
            port: federation.port,
            connection_type: federation.connection_type,
            protocol_version: federation.protocol_version,
            transport_protocol: federation.transport_protocol || 'tcp',
            use_tls: federation.use_tls,
            verify_ssl: federation.verify_ssl,
            ca_certificate: federation.ca_certificate || '',
            client_certificate: federation.client_certificate || '',
            client_key: federation.client_key || '',
            sync_missions: federation.sync_missions,
            sync_cot: federation.sync_cot,
            mission_filter: federation.mission_filter ? JSON.stringify(federation.mission_filter) : '',
            enabled: federation.enabled,
        });
        setEditModalOpened(true);
    }

    function handleUpdate() {
        if (!currentFederation) return;

        const payload = {
            ...formData,
            mission_filter: formData.mission_filter ? JSON.parse(formData.mission_filter) : null,
        };

        axios
            .put(`${apiRoutes.federationServers}/${currentFederation.id}`, payload)
            .then((r) => {
                if (r.status === 200) {
                    notifications.show({
                        message: 'Federation server updated successfully',
                        color: 'green',
                    });
                    setEditModalOpened(false);
                    setCurrentFederation(null);
                    resetForm();
                    getFederations();
                }
            })
            .catch((err) => {
                notifications.show({
                    title: 'Error',
                    message: err.response?.data?.error || 'Failed to update federation server',
                    color: 'red',
                });
            });
    }

    function handleDelete() {
        if (!currentFederation) return;

        axios
            .delete(`${apiRoutes.federationServers}/${currentFederation.id}`)
            .then((r) => {
                if (r.status === 200) {
                    notifications.show({
                        message: 'Federation server deleted successfully',
                        color: 'green',
                    });
                    setDeleteModalOpened(false);
                    setCurrentFederation(null);
                    getFederations();
                }
            })
            .catch((err) => {
                notifications.show({
                    title: 'Error',
                    message: err.response?.data?.error || 'Failed to delete federation server',
                    color: 'red',
                });
            });
    }

    function handleToggle(federation: FederationServer) {
        axios
            .put(`${apiRoutes.federationServers}/${federation.id}`, {
                enabled: !federation.enabled,
            })
            .then((r) => {
                if (r.status === 200) {
                    notifications.show({
                        message: r.data.enabled ? 'Federation enabled' : 'Federation disabled',
                        color: 'green',
                    });
                    getFederations();
                }
            })
            .catch((err) => {
                notifications.show({
                    title: 'Error',
                    message: err.response?.data?.error || 'Failed to toggle federation',
                    color: 'red',
                });
            });
    }

    function resetForm() {
        setFormData({
            name: '',
            description: '',
            address: '',
            port: 9000,
            connection_type: 'OUTBOUND',
            protocol_version: 'FEDERATION_V2',
            transport_protocol: 'tcp',
            use_tls: true,
            verify_ssl: true,
            ca_certificate: '',
            client_certificate: '',
            client_key: '',
            sync_missions: true,
            sync_cot: true,
            mission_filter: '',
            enabled: true,
        });
    }

    function handleFileUpload(file: File | null, fieldName: 'ca_certificate' | 'client_certificate' | 'client_key') {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            if (content) {
                setFormData({ ...formData, [fieldName]: content });
                notifications.show({
                    message: `${file.name} uploaded successfully`,
                    color: 'green',
                });
            }
        };
        reader.onerror = () => {
            notifications.show({
                title: 'Error',
                message: `Failed to read ${file.name}`,
                color: 'red',
            });
        };
        reader.readAsText(file);
    }

    function renderFormFields() {
        return (
            <Stack>
                <TextInput
                    label="Name"
                    placeholder="Federation Server Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.currentTarget.value })}
                />
                <Textarea
                    label="Description (optional)"
                    placeholder="Description of this federation server"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.currentTarget.value })}
                    minRows={2}
                />
                <TextInput
                    label="Address"
                    placeholder="tak.example.com"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.currentTarget.value })}
                />
                <NumberInput
                    label="Port"
                    required
                    value={formData.port}
                    onChange={(val) => setFormData({ ...formData, port: Number(val) })}
                />
                <Select
                    label="Connection Type"
                    required
                    data={[
                        { value: 'OUTBOUND', label: 'Outbound (Connect to remote server)' },
                        { value: 'INBOUND', label: 'Inbound (Accept connections)' },
                    ]}
                    value={formData.connection_type}
                    onChange={(val) => setFormData({ ...formData, connection_type: val || 'OUTBOUND' })}
                />
                <Select
                    label="Protocol Version"
                    required
                    data={[
                        { value: 'FEDERATION_V2', label: 'Federation V2 (Port 9001, Recommended)' },
                        { value: 'FEDERATION_V1', label: 'Federation V1 (Port 9000)' },
                    ]}
                    value={formData.protocol_version}
                    onChange={(val) => setFormData({ ...formData, protocol_version: val || 'FEDERATION_V2' })}
                />
                <Select
                    label="Transport Protocol"
                    required
                    data={[
                        { value: 'tcp', label: 'TCP (Transmission Control Protocol) - Fully Functional' },
                        { value: 'udp', label: 'UDP (User Datagram Protocol) - ⚠️ Config Only' },
                        { value: 'multicast', label: 'Multicast (UDP Multicast) - ⚠️ Config Only' },
                    ]}
                    value={formData.transport_protocol}
                    onChange={(val) => setFormData({ ...formData, transport_protocol: val || 'tcp' })}
                    description={
                        formData.transport_protocol === 'udp' || formData.transport_protocol === 'multicast'
                            ? '⚠️ Warning: UDP and Multicast transports are not yet implemented. Configuration will be saved but connections will not function.'
                            : undefined
                    }
                />
                <Checkbox
                    label={formData.transport_protocol === 'tcp' ? 'Use TLS (Recommended)' : 'Use DTLS (Datagram TLS)'}
                    checked={formData.use_tls}
                    onChange={(e) => setFormData({ ...formData, use_tls: e.currentTarget.checked })}
                />
                {formData.use_tls && (
                    <>
                        <Checkbox
                            label="Verify SSL Certificate"
                            checked={formData.verify_ssl}
                            onChange={(e) => setFormData({ ...formData, verify_ssl: e.currentTarget.checked })}
                        />
                        <div>
                            <Group mb="xs">
                                <Text size="sm" fw={500}>CA Certificate (PEM format)</Text>
                                <FileButton
                                    onChange={(file) => handleFileUpload(file, 'ca_certificate')}
                                    accept=".pem,.crt,.cer"
                                >
                                    {(props) => (
                                        <Button {...props} size="xs" leftSection={<IconUpload size={14} />} variant="light">
                                            Upload File
                                        </Button>
                                    )}
                                </FileButton>
                            </Group>
                            <Textarea
                                placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----"
                                value={formData.ca_certificate}
                                onChange={(e) => setFormData({ ...formData, ca_certificate: e.currentTarget.value })}
                                minRows={4}
                            />
                        </div>
                        <div>
                            <Group mb="xs">
                                <Text size="sm" fw={500}>Client Certificate (PEM format)</Text>
                                <FileButton
                                    onChange={(file) => handleFileUpload(file, 'client_certificate')}
                                    accept=".pem,.crt,.cer"
                                >
                                    {(props) => (
                                        <Button {...props} size="xs" leftSection={<IconUpload size={14} />} variant="light">
                                            Upload File
                                        </Button>
                                    )}
                                </FileButton>
                            </Group>
                            <Textarea
                                placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----"
                                value={formData.client_certificate}
                                onChange={(e) => setFormData({ ...formData, client_certificate: e.currentTarget.value })}
                                minRows={4}
                            />
                        </div>
                        <div>
                            <Group mb="xs">
                                <Text size="sm" fw={500}>Client Private Key (PEM format)</Text>
                                <FileButton
                                    onChange={(file) => handleFileUpload(file, 'client_key')}
                                    accept=".pem,.key"
                                >
                                    {(props) => (
                                        <Button {...props} size="xs" leftSection={<IconUpload size={14} />} variant="light">
                                            Upload File
                                        </Button>
                                    )}
                                </FileButton>
                            </Group>
                            <Textarea
                                placeholder="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----"
                                value={formData.client_key}
                                onChange={(e) => setFormData({ ...formData, client_key: e.currentTarget.value })}
                                minRows={4}
                            />
                        </div>
                    </>
                )}
                <Group>
                    <Checkbox
                        label="Sync Missions"
                        checked={formData.sync_missions}
                        onChange={(e) => setFormData({ ...formData, sync_missions: e.currentTarget.checked })}
                    />
                    <Checkbox
                        label="Sync CoT"
                        checked={formData.sync_cot}
                        onChange={(e) => setFormData({ ...formData, sync_cot: e.currentTarget.checked })}
                    />
                </Group>
                <Textarea
                    label="Mission Filter (JSON, optional)"
                    placeholder='{"include": ["mission1", "mission2"]}'
                    value={formData.mission_filter}
                    onChange={(e) => setFormData({ ...formData, mission_filter: e.currentTarget.value })}
                    minRows={3}
                />
                <Checkbox
                    label="Enabled"
                    checked={formData.enabled}
                    onChange={(e) => setFormData({ ...formData, enabled: e.currentTarget.checked })}
                />
            </Stack>
        );
    }

    return (
        <>
            <Group mb="md">
                <Title order={2}>Federation Management</Title>
                <Button leftSection={<IconPlus size={16} />} onClick={() => setAddModalOpened(true)}>
                    Add Federation Server
                </Button>
                <Button leftSection={<IconRefresh size={16} />} variant="light" onClick={getFederations}>
                    Refresh
                </Button>
            </Group>

            <Table data={federations} />

            {/* Add Modal */}
            <Modal opened={addModalOpened} onClose={() => setAddModalOpened(false)} title="Add Federation Server" size="lg">
                {renderFormFields()}
                <Group mt="md">
                    <Button onClick={handleAdd} leftSection={<IconCheck size={16} />}>
                        Create
                    </Button>
                    <Button variant="light" onClick={() => setAddModalOpened(false)} leftSection={<IconX size={16} />}>
                        Cancel
                    </Button>
                </Group>
            </Modal>

            {/* Edit Modal */}
            <Modal opened={editModalOpened} onClose={() => setEditModalOpened(false)} title="Edit Federation Server" size="lg">
                {renderFormFields()}
                <Group mt="md">
                    <Button onClick={handleUpdate} leftSection={<IconCheck size={16} />}>
                        Update
                    </Button>
                    <Button variant="light" onClick={() => setEditModalOpened(false)} leftSection={<IconX size={16} />}>
                        Cancel
                    </Button>
                </Group>
            </Modal>

            {/* Delete Modal */}
            <Modal opened={deleteModalOpened} onClose={() => setDeleteModalOpened(false)} title="Delete Federation Server">
                <Text>
                    Are you sure you want to delete the federation server "{currentFederation?.name}"? This action cannot be undone.
                </Text>
                <Group mt="md">
                    <Button color="red" onClick={handleDelete} leftSection={<IconCheck size={16} />}>
                        Delete
                    </Button>
                    <Button variant="light" onClick={() => setDeleteModalOpened(false)} leftSection={<IconX size={16} />}>
                        Cancel
                    </Button>
                </Group>
            </Modal>

            {/* Statistics Modal */}
            <Modal opened={statsModalOpened} onClose={() => setStatsModalOpened(false)} title={`Statistics: ${currentFederation?.name}`}>
                <Stack>
                    <div>
                        <Text size="sm" c="dimmed">Total Changes</Text>
                        <Text size="xl" fw={700}>{currentStats?.total_changes || 0}</Text>
                    </div>
                    <div>
                        <Text size="sm" c="dimmed">Sent Changes</Text>
                        <Text size="xl" fw={700}>{currentStats?.sent_changes || 0}</Text>
                    </div>
                    <div>
                        <Text size="sm" c="dimmed">Pending Changes</Text>
                        <Text size="xl" fw={700}>{currentStats?.pending_changes || 0}</Text>
                    </div>
                </Stack>
                <Group mt="md">
                    <Button variant="light" onClick={() => setStatsModalOpened(false)}>
                        Close
                    </Button>
                </Group>
            </Modal>
        </>
    );
}
