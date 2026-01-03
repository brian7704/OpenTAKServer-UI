import {
    AspectRatio,
    Button,
    Center, CopyButton,
    Modal,
    Pagination,
    Switch,
    Table,
    TableData,
    TextInput,
    Tooltip,
    useComputedColorScheme,
    Image, LoadingOverlay
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { IconCheck, IconCircleMinus, IconPlus, IconVideo, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import axios from '../axios_config';
import { apiRoutes } from '../apiRoutes';
import {t} from "i18next";
import {DataTable, DataTableSortStatus} from "mantine-datatable";

interface VideoStream {
    thumbnail: string;
    thumbnail_image: React.ReactNode;
    username: string;
    path: string;
    rtsp_link: string;
    rtsp_button: React.ReactNode;
    webrtc_link: string;
    webrtc_button: React.ReactNode;
    hls_link: string;
    hls_button: React.ReactNode;
    source: string;
    ready: boolean;
    ready_icon: React.ReactNode;
    record: boolean;
    record_switch: React.ReactNode;
    watch_button: React.ReactNode;
    delete_button: React.ReactNode;
}

export default function VideoStreams() {
    const [videoStreams, setVideoStreams] = useState<VideoStream[]>([]);
    const [activePage, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [addVideoOpened, setAddVideoOpened] = useState(false);
    const [deleteVideoOpened, setDeleteVideoOpened] = useState(false);
    const [deletePath, setDeletePath] = useState('');
    const [path, setPath] = useState('');
    const [source, setSource] = useState<string|null>(null);
    const [showVideo, setShowVideo] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [thumbnailOpened, setThumbnailOpened] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [streamCount, setStreamCount] = useState(0);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus<VideoStream>>({
        columnAccessor: 'path',
        direction: 'asc',
    });

    function setRecord(path:string, record:boolean) {
        setLoading(true)
        axios.patch(
            apiRoutes.updateVideoStream,
            { path, record, sourceOnDemand: !record }
        ).then(r => {
            setLoading(false);
            if (r.status === 200) {
                if (record) {
                    notifications.show({
                        message: t(`${path} is now recording`),
                        color: 'green',
                    });
                } else {
                    notifications.show({
                        message: t(`${path} is no longer recording`),
                        color: 'red',
                    });
                }
                getVideoStreams();
            }
        }).catch(err => {
            setLoading(false);
            console.log(err);
            notifications.show({
                title: t('Recording Failed'),
                message: err.response.data.error,
                color: 'red',
            });
        });
    }

    function getVideoStreams() {
        setLoading(true)
        axios.get(
            apiRoutes.video_streams,
            { params: {
                    page: activePage,
                    per_page: pageSize,
                    sort_by: sortStatus.columnAccessor,
                    sort_direction: sortStatus.direction
                } }
        ).then(r => {
            setLoading(false);
            if (r.status === 200) {
                let streams: VideoStream[] = [];
                setStreamCount(r.data.total);

                r.data.results.map((row: VideoStream) => {

                    row.thumbnail_image = <Image src={row.thumbnail} onClick={() => {
                        setThumbnail(row.thumbnail);
                        setThumbnailOpened(true);
                    }} />

                    row.delete_button = <Button
                      onClick={() => {
                            setDeleteVideoOpened(true);
                            setDeletePath(row.path);
                        }}
                      key={`${row.path}_delete`}
                      rightSection={<IconCircleMinus size={14} />}
                      color="red"
                    >Delete
                                          </Button>;

                    row.watch_button = <Button
                      key={`${row.path}_watch`}
                      onClick={() => {
                        setVideoUrl(`${row.hls_link}?jwt=${localStorage.getItem('token')}`);
                        setShowVideo(true);
                        setPath(row.path);
                    }}
                    >Watch
                                         </Button>;
                    if (row.ready) {
                        row.ready_icon = <IconCheck size={14} color="green" />;
                    } else {
                        row.ready_icon = <IconX size={14} color="red" />;
                    }

                    row.record_switch = <Switch
                      checked={row.record}
                      onChange={(e) => {
                          setRecord(row.path, e.target.checked); getVideoStreams();
                      }}
                    />;

                    row.webrtc_button = <CopyButton value={row.webrtc_link}>{({ copied, copy }) => (
                        <Tooltip label={row.webrtc_link}>
                            <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                                {copied ? t('Copied WebRTC Link') : t('Copy WebRTC Link')}
                            </Button>
                        </Tooltip>
                    )}
                                          </CopyButton>;

                    row.rtsp_button = <CopyButton value={row.rtsp_link}>{({ copied, copy }) => (
                        <Tooltip label={row.rtsp_link}>
                            <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                                {copied ? t('Copied RTSP Link') : t('Copy RTSP Link')}
                            </Button>
                        </Tooltip>
                    )}
                    </CopyButton>;

                    row.hls_button = <CopyButton value={`${row.hls_link}?jwt=${localStorage.getItem('token')}`}>{({ copied, copy }) => (
                        <Tooltip label={`${row.hls_link}?jwt=${localStorage.getItem('token')}`}>
                            <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                                {copied ? t('Copied HLS Link') : t('Copy HLS Link')}
                            </Button>
                        </Tooltip>
                    )}
                    </CopyButton>;

                    streams.push(row);
                });

                setPage(r.data.current_page);
                setTotalPages(r.data.total_pages);
                setVideoStreams(streams);
            }
        }).catch(err => {
            setLoading(false);
            console.log(err);
            notifications.show({
                title: t('Failed to get video streams'),
                message: err.response.data.error,
                color: 'red',
            });
        });
    }

    useEffect(() => {
        getVideoStreams();
    }, [activePage, sortStatus]);

    useEffect(() => {
        setPage(1);
        getVideoStreams();
    }, [pageSize]);

    function deleteVideoStream() {
        setLoading(true);
        axios.delete(
            apiRoutes.deleteVideoStream,
            { params: {
                    path: deletePath,
                } },
        ).then(r => {
            setLoading(false);
            notifications.show({
                title: '',
                message: t('Successfully deleted video stream'),
                color: 'green',
            });
            getVideoStreams();
        }).catch(err => {
            setLoading(false);
            console.log(err)
            notifications.show({
                title: t('Failed to delete video stream'),
                message: err.response.data.error,
                color: 'red',
            });
            console.log(err);
        });
    }

    function addVideo(e:any) {
        setLoading(true);
        e.preventDefault();
        axios.post(
            apiRoutes.addVideoStream,
            { path, source, sourceOnDemand: true }
        ).then(r => {
            setLoading(false);
            if (r.status === 200) {
                setAddVideoOpened(false);
                getVideoStreams();
            }
        }).catch(err => {
            setLoading(false);
            console.log(err);
            notifications.show({
                title: t('Failed to add video stream'),
                message: err.response.data.error,
                color: 'red',
            });
        });
        setPath("");
        setSource(null);
    }

    function startStreaming() {
        window.open(`${window.location.origin}:8889/${localStorage.getItem('username')}_browser/publish?jwt=${localStorage.getItem('token')}`, '_blank');
    }

    return (
        <>
            <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2, fixed: true }} />

            <Button onClick={() => { setAddVideoOpened(true); }} mb="md" mr="md" leftSection={<IconPlus size={14} />}>Add Video</Button>
            <Tooltip
              multiline
              w={220}
              withArrow
              label={t("Start streaming in the browser using your device's camera")}
            >
                <Button onClick={() => { startStreaming(); }} mb="md" leftSection={<IconVideo size={14} />}>Start Streaming</Button>
            </Tooltip>
            <Table.ScrollContainer minWidth="100%">
                <DataTable
                    withTableBorder
                    borderRadius="md"
                    shadow="sm"
                    striped
                    highlightOnHover
                    records={videoStreams}
                    columns={[{accessor: "thumbnail_image", title: t("Thumbnail")}, {accessor: "username", title: t("Username"), sortable: true},
                        {accessor: "path", title: t("Path"), sortable: true}, {accessor: "rtsp_button", title: t("RTSP Link"), sortable: true},
                        {accessor: "webrtc_button", title: t("WebRTC Link"), sortable: true}, {accessor: "hls_button", title: t("HLS Link"), sortable: true},
                        {accessor: "source", title: t("Source")}, {accessor: "ready_icon", title: t("Ready"), sortable: true},
                        {accessor: "record_switch", title: t("Record"), sortable: true}, {accessor: "watch_button", title: t("Watch")},
                        {accessor: "delete_button", title: t("Delete")}]}
                    page={activePage}
                    onPageChange={(p) => setPage(p)}
                    onRecordsPerPageChange={setPageSize}
                    totalRecords={streamCount}
                    recordsPerPage={pageSize}
                    recordsPerPageOptions={[10, 15, 20, 25, 30, 35, 40, 45, 50]}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    fetching={loading}
                    minHeight={180}
                />
            </Table.ScrollContainer>
            <Modal opened={addVideoOpened} onClose={() => setAddVideoOpened(false)} title={t("Add Video")}>
                <TextInput required label={t("Path")} onChange={e => { setPath(e.target.value); }} />
                <TextInput label={t("Source")} onChange={e => { setSource(e.target.value); }} mb="md" />
                <Button onClick={(e) => { addVideo(e); }}>{t("Add Video Stream")}</Button>
            </Modal>
            <Modal opened={deleteVideoOpened} onClose={() => setDeleteVideoOpened(false)} title={t(`Are you sure you want to delete ${deletePath}?`)}>
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
            <Modal opened={thumbnailOpened} onClose={() => setThumbnailOpened(false)} title={t("Thumbnail")} size="xl">
                <Image src={thumbnail} />
            </Modal>

            <AspectRatio ratio={16 / 9} display={showVideo ? 'block' : 'none'} h="100%" mb="xl" mt="md">
                <iframe
                    src={videoUrl}
                    title={path}
                    style={{border: 0}}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
                <Button
                    fullWidth
                    onClick={() => {
                        setShowVideo(false);
                        setVideoUrl('');
                    }}

                >{t("Close Stream")}</Button>
            </AspectRatio>
        </>
);
}
