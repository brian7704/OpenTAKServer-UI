import {
    AspectRatio,
    Button,
    Center,
    Image, LoadingOverlay,
    Modal,
    Table,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { IconCheck, IconCircleMinus, IconDownload, IconPlayerPlay, IconX } from '@tabler/icons-react';
import './VideoRecordings.module.css';
import ReactPlayer from 'react-player';
import { intervalToDuration, formatDuration } from 'date-fns';
import { notifications } from '@mantine/notifications';
import axios from '../axios_config';
import { apiRoutes } from '../apiRoutes';
import bytes_formatter from '@/bytes_formatter';
import {t} from "i18next";
import {DataTable, DataTableSortStatus} from "mantine-datatable";

interface VideoRecording {
    id: number;
    thumbnail: string;
    thumbnail_image: React.ReactNode;
    start_time: string;
    stop_time: string;
    path: string;
    in_progress: boolean;
    in_progress_icon: React.ReactNode;
    duration: number;
    formatted_duration: string;
    filename: string;
    width: number;
    height: number;
    video_codec: string;
    video_bitrate: number;
    formatted_video_bitrate: string;
    audio_codec: string;
    audio_bitrate: number;
    formatted_audio_bitrate: string;
    audio_samplerate: number;
    audio_channels: number;
    file_size: number;
    formatted_file_size: string;
    delete_button: React.ReactNode;
    watch_button: React.ReactNode;
    download_button: React.ReactNode;
    resolution: string;
}

export default function VideoRecordings() {
    const [videoRecordings, setVideoRecordings] = useState<VideoRecording[]>([]);
    const [activePage, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deleteRecordingOpen, setDeleteRecordingOpen] = useState(false);
    const [deleteRecording, setDeleteRecording] = useState<number>();
    const [showVideo, setShowVideo] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [thumbnailOpened, setThumbnailOpened] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [recordingCount, setRecordingCount] = useState(0);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus<VideoRecording>>({
        columnAccessor: 'path',
        direction: 'asc',
    });

    function getVideoRecordings() {
        if (loading) return;

        setLoading(true);
        axios.get(
            apiRoutes.getRecordings,
            { params: {
                    page: activePage,
                    per_page: pageSize,
                    sort_by: sortStatus.columnAccessor,
                    sort_direction: sortStatus.direction

                } }
        ).then(r => {
            setLoading(false);
            if (r.status === 200) {
                setRecordingCount(r.data.total);
                let recordings: VideoRecording[] = [];

                r.data.results.map((row: VideoRecording) => {

                    row.thumbnail_image = <Image src={row.thumbnail} onClick={() => {
                        setThumbnail(row.thumbnail);
                        setThumbnailOpened(true);
                    }} />

                    row.delete_button = <Button
                      onClick={() => {
                            setDeleteRecordingOpen(true);
                            setDeleteRecording(row.id);
                        }}
                      key={`${row.path}_delete`}
                      color="red"
                    ><IconCircleMinus />
                                          </Button>;

                    row.watch_button = <Button
                      key={`${row.filename}_watch`}
                      onClick={() => {
                        setVideoUrl(`${apiRoutes.getRecording}?id=${row.id}`);
                        setShowVideo(true);
                    }}
                    ><IconPlayerPlay />
                                         </Button>;

                    if (row.in_progress) {
                        row.in_progress_icon = <IconCheck size={14} color="green" />;
                    } else {
                        row.in_progress_icon = <IconX size={14} color="red" />;
                    }

                    if (row.duration) {
                        const duration = intervalToDuration({ start: 0, end: row.duration * 1000 });
                        row.formatted_duration = formatDuration(duration);
                    }

                    row.download_button = <Button component="a" href={`${apiRoutes.getRecording}?id=${row.id}`}><IconDownload /></Button>;

                    row.resolution = `${row.width} x ${row.height}`

                    row.formatted_video_bitrate = bytes_formatter(row.video_bitrate, 2, true)
                    row.formatted_audio_bitrate = bytes_formatter(row.audio_bitrate, 2, true)
                    row.formatted_file_size = bytes_formatter(row.file_size)

                    recordings.push(row);
                });

                setPage(r.data.current_page);
                setTotalPages(r.data.total_pages);
                setVideoRecordings(recordings);
            }
        }).catch(err => {
            setLoading(false);
            console.log(err);
            notifications.show({
                title: t('Failed to get recordings'),
                message: err.response.data.error,
                color: 'red',
                icon: <IconX />
            })
        });
    }

    useEffect(() => {
        setPage(1);
        getVideoRecordings()
    }, [pageSize]);

    useEffect(() => {
        getVideoRecordings();
    }, [activePage, sortStatus]);

    function deleteVideoRecording() {
        setLoading(true);
        axios.delete(
            apiRoutes.deleteRecording,
            { params: {
                    id: deleteRecording,
                } },
        ).then(r => {
            setLoading(false);
            notifications.show({
                title: '',
                message: t('Successfully deleted recording'),
                color: 'green',
            });
            getVideoRecordings();
        }).catch(err => {
            setLoading(false);
            console.log(err);
            notifications.show({
                title: t('Failed to delete recording'),
                message: err.response.data.error,
                color: 'red',
            });
            console.log(err);
        });
    }

    return (
        <>
            <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2, fixed: true }} />

            <Table.ScrollContainer minWidth="100%">
                <DataTable
                    withTableBorder
                    borderRadius="md"
                    shadow="sm"
                    striped
                    highlightOnHover
                    records={videoRecordings}
                    columns={[{accessor: "thumbnail_image", title: t("Thumbnail")}, {accessor: "start_time", title: t("Start Time"), sortable: true},
                        {accessor: "stop_time", title: t("End Time"), sortable: true}, {accessor: "formatted_duration", title: t("Duration"), sortable: true},
                        {accessor: "resolution", title: t("Resolution"), sortable: true}, {accessor: "in_progress_icon", title: t("In Progress"), sortable: true},
                        {accessor: "path", title: t("Path"), sortable: true}, {accessor: "formatted_file_size", title: t("File Size"), sortable: true},
                        {accessor: "video_codec", title: t("Video Codec"), sortable: true}, {accessor: "formatted_video_bitrate", title: t("Video Bitrate"), sortable: true},
                        {accessor: "audio_codec", title: t("Audio Codec"), sortable: true}, {accessor: "formatted_audio_bitrate", title: t("Audio Bitrate"), sortable: true},
                        {accessor: "watch_button", title: t("Watch")}, {accessor: "download_button", title: t("Download")}
                    ]}
                    page={activePage}
                    onPageChange={(p) => setPage(p)}
                    onRecordsPerPageChange={setPageSize}
                    totalRecords={recordingCount}
                    recordsPerPage={pageSize}
                    recordsPerPageOptions={[10, 15, 20, 25, 30, 35, 40, 45, 50]}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    fetching={loading}
                    minHeight={180}
                />
            </Table.ScrollContainer>

            <Modal opened={deleteRecordingOpen} onClose={() => setDeleteRecordingOpen(false)} title={t("Are you sure you want to delete this recording?")}>
                <Center>
                    <Button
                      mr="md"
                      onClick={() => {
                            deleteVideoRecording();
                            setDeleteRecordingOpen(false);
                        }}
                    >Yes
                    </Button>
                    <Button onClick={() => setDeleteRecordingOpen(false)}>No</Button>
                </Center>
            </Modal>

            <Modal opened={thumbnailOpened} onClose={() => setThumbnailOpened(false)} title="Thumbnail" size="xl">
                <Image src={thumbnail} />
            </Modal>

            <AspectRatio ratio={16 / 9} h="100%" display={showVideo ? 'block' : 'none'} mt="md" pb={100} mb="xl">
                <ReactPlayer style={{ position: 'relative' }} controls url={videoUrl} width="100%" height="100%" />
                <Button
                    fullWidth
                    onClick={() => {
                        setShowVideo(false);
                        setVideoUrl('');
                    }}

                >Close Stream</Button>
            </AspectRatio>

        </>
    );
}
