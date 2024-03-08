import {
    AspectRatio,
    Button,
    Center,
    CloseButton,
    Flex,
    Modal,
    Pagination,
    Table,
    TableData,
    useComputedColorScheme,
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

export default function VideoRecordings() {
    const [videoStreams, setVideoStreams] = useState<TableData>({
        caption: '',
        head: ['Username', 'Protocol', 'Address', 'Port', 'Path', 'Link'],
        body: [],
    });
    const [activePage, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deleteRecordingOpen, setDeleteRecordingOpen] = useState(false);
    const [deleteRecording, setDeleteRecording] = useState('');
    const [showVideo, setShowVideo] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    //const [player, setPlayer] = useState<PlayerReference | null>();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    function getVideoRecordings() {
        axios.get(
            apiRoutes.getRecordings,
            { params: {
                    page: activePage,
                } }
        ).then(r => {
            if (r.status === 200) {
                const tableData: TableData = {
                    caption: '',
                    head: ['Start Time', 'End Time', 'Duration', 'Resolution', 'In Progress', 'Path', 'File Size', 'Video Codec', 'Video Bitrate', 'Audio Codec', 'Audio Bitrate', 'Watch', 'Delete', 'Download'],
                    body: [],
                };

                r.data.results.map((row:any) => {
                    if (tableData.body !== undefined) {
                        const delete_button = <Button
                          onClick={() => {
                                setDeleteRecordingOpen(true);
                                setDeleteRecording(row.id);
                            }}
                          key={`${row.path}_delete`}
                        ><IconCircleMinus />
                                              </Button>;

                        const watch_button = <Button
                          key={`${row.filename}_watch`}
                          onClick={() => {
                            setVideoUrl(`${apiRoutes.getRecording}?id=${row.id}`);
                            setShowVideo(true);
                        }}
                        ><IconPlayerPlay />
                                             </Button>;

                        let in_progress_icon;

                        if (row.in_progress) {
                            in_progress_icon = <IconCheck size={14} color="green" />;
                        } else {
                            in_progress_icon = <IconX size={14} color="red" />;
                        }

                        let formattedDuration = '';
                        if (row.duration) {
                            const duration = intervalToDuration({ start: 0, end: row.duration * 1000 });
                            formattedDuration = formatDuration(duration);
                        }

                        const download_button = <Button component="a" href={`${apiRoutes.getRecording}?id=${row.id}`}><IconDownload /></Button>;

                        tableData.body.push([row.start_time, row.stop_time, formattedDuration,
                            `${row.width} x ${row.height}`, in_progress_icon, row.path, bytes_formatter(row.file_size),
                            row.video_codec, bytes_formatter(row.video_bitrate, 2, true),
                            row.audio_codec, `${bytes_formatter(row.audio_bitrate, 2, true)}`,
                            watch_button, delete_button, download_button]);
                    }
                });

                setPage(r.data.current_page);
                setTotalPages(r.data.total_pages);
                setVideoStreams(tableData);
            }
        });
    }

    useEffect(() => {
        getVideoRecordings();
    }, [activePage]);

    function deleteVideoRecording() {
        axios.delete(
            apiRoutes.deleteRecording,
            { params: {
                    id: deleteRecording,
                } },
        ).then(r => {
            notifications.show({
                title: '',
                message: 'Successfully deleted recording',
                color: 'green',
            });
            getVideoRecordings();
        }).catch(err => {
            notifications.show({
                title: 'Failed to delete recording',
                message: err.response.data.error,
                color: 'red',
            });
            console.log(err);
        });
    }

    return (
        <>
            <Table.ScrollContainer minWidth="100%">
                <Table stripedColor={computedColorScheme === 'light' ? 'gray.2' : 'dark.8'} highlightOnHoverColor={computedColorScheme === 'light' ? 'gray.4' : 'dark.6'} striped="odd" data={videoStreams} highlightOnHover withTableBorder mb="md" />
            </Table.ScrollContainer>
            <Center><Pagination total={totalPages} value={activePage} onChange={setPage} withEdges /></Center>
            <Modal opened={deleteRecordingOpen} onClose={() => setDeleteRecordingOpen(false)} title="Are you sure you want to delete this recording?">
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

            <AspectRatio ratio={16 / 9} h="100%" display={showVideo ? 'block' : 'none'} mt="md" pb={100} mb="xl">
                <Flex justify="flex-end" align="flex-start">
                    <CloseButton
                      style={{ zIndex: 9999 }}
                      size={30}
                      onClick={() => {
                            setShowVideo(false);
                            setVideoUrl('');
                        }}
                    />
                </Flex>
                <ReactPlayer style={{ position: 'relative' }} controls url={videoUrl} width="100%" height="100%" />
            </AspectRatio>

        </>
    );
}
