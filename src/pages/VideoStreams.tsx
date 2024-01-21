import {
    Button,
    Center,
    Modal,
    Pagination,
    Switch,
    Table,
    TableData,
    TextInput,
    useComputedColorScheme,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { IconCheck, IconCircleMinus, IconPlus, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import axios from '../axios_config';
import { apiRoutes } from '../config';

export default function VideoStreams() {
    const [videoStreams, setVideoStreams] = useState<TableData>({
        caption: '',
        head: ['Username', 'Protocol', 'Address', 'Port', 'Path', 'Link'],
        body: [],
    });
    const [activePage, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [addVideoOpened, setAddVideoOpened] = useState(false);
    const [deleteVideoOpened, setDeleteVideoOpened] = useState(false);
    const [deletePath, setDeletePath] = useState('');
    const [path, setPath] = useState('');
    const [source, setSource] = useState('');
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    function setRecord(path:string, record:boolean) {
        axios.patch(
            apiRoutes.updateVideoStream,
            { path, record, sourceOnDemand: !record }
        ).then(r => {
            if (r.status === 200) {
                if (record) {
                    notifications.show({
                        message: `${path} is now recording`,
                        color: 'green',
                    });
                } else {
                    notifications.show({
                        message: `${path} is no longer recording`,
                        color: 'red',
                    });
                }
            }
        }).catch(err => {
            console.log(err);
            notifications.show({
                title: 'Recording Failed',
                message: err.response.error,
                color: 'red',
            });
        });
    }

    function getVideoStreams() {
        axios.get(
            apiRoutes.video_streams,
            { params: {
                    page: activePage,
                } }
        ).then(r => {
            if (r.status === 200) {
                const tableData: TableData = {
                    caption: '',
                    head: ['Username', 'Path', 'RTSP Link', 'WebRTC Link', 'Source', 'Ready', 'Record'],
                    body: [],
                };

                r.data.results.map((row:any) => {
                    if (tableData.body !== undefined) {
                        const delete_button = <Button
                          onClick={() => {
                                setDeleteVideoOpened(true);
                                setDeletePath(row.path);
                            }}
                          key={`${row.path}_delete`}
                          rightSection={<IconCircleMinus size={14} />}
                        >Delete
                                              </Button>;

                        const watch_button = <Button key={`${row.path}_watch`} onClick={() => window.open(row.webrtc_link, '_blank')}>Watch</Button>;
                        let online_icon = null;

                        if (row.ready) {
                            online_icon = <IconCheck size={14} color="green" />;
                        } else {
                            online_icon = <IconX size={14} color="red" />;
                        }

                        const record = <Switch checked={row.record} onChange={(e) => { setRecord(row.path, e.target.checked); getVideoStreams(); }} />;
                        tableData.body.push([row.username, row.path, row.rtsp_link, row.webrtc_link, row.source, online_icon, record, watch_button, delete_button]);
                    }
                });

                setPage(r.data.current_page);
                setTotalPages(r.data.total_pages);
                setVideoStreams(tableData);
            }
        });
    }

    useEffect(() => {
        getVideoStreams();
    }, [activePage]);

    function deleteVideoStream() {
        axios.delete(
            apiRoutes.deleteVideoStream,
            { params: {
                    path: deletePath,
                } },
        ).then(r => {
            notifications.show({
                title: '',
                message: 'Successfully deleted video stream',
                color: 'green',
            });
            getVideoStreams();
        }).catch(err => {
            notifications.show({
                title: 'Failed to delete video stream',
                message: err.response.data.error,
                color: 'red',
            });
            console.log(err);
        });
    }

    function addVideo(e:any) {
        e.preventDefault();
        axios.post(
            apiRoutes.addVideoStream,
            { path, source, sourceOnDemand: true }
        ).then(r => {
            if (r.status === 200) {
                setAddVideoOpened(false);
                getVideoStreams();
            }
        }).catch(err => {
            notifications.show({
                title: 'Failed to add video stream',
                message: err.response.data.error,
                color: 'red',
            });
        });
    }

    return (
        <>
            <Button onClick={() => { setAddVideoOpened(true); }} mb="md" leftSection={<IconPlus size={14} />}>Add Video</Button>
            <Table stripedColor={computedColorScheme === 'light' ? 'gray.2' : 'dark.8'} highlightOnHoverColor={computedColorScheme === 'light' ? 'gray.4' : 'dark.6'} striped="odd" data={videoStreams} highlightOnHover withTableBorder mb="md" />
            <Center><Pagination total={totalPages} value={activePage} onChange={setPage} withEdges /></Center>
            <Modal opened={addVideoOpened} onClose={() => setAddVideoOpened(false)} title="Add Video">
                <TextInput required label="Path" onChange={e => { setPath(e.target.value); }} />
                <TextInput label="Source" onChange={e => { setSource(e.target.value); }} mb="md" />
                <Button onClick={(e) => { addVideo(e); }}>Add Video Stream</Button>
            </Modal>
            <Modal opened={deleteVideoOpened} onClose={() => setDeleteVideoOpened(false)} title={`Are you sure you want to delete ${deletePath}?`}>
                <Center>
                    <Button
                      mr="md"
                      onClick={() => {
                        deleteVideoStream();
                        setDeleteVideoOpened(false);
                    }}
                    >Yes
                    </Button>
                    <Button onClick={() => setDeleteVideoOpened(false)}>No</Button>
                </Center>
            </Modal>
        </>
    );
}