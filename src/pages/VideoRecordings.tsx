import {
    AspectRatio,
    Box,
    Button,
    Center, CloseButton, Container, Flex,
    Modal,
    Pagination,
    Table,
    TableData,
    useComputedColorScheme,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { IconCheck, IconCircleMinus, IconX } from '@tabler/icons-react';
import 'video-react/dist/video-react.css';
import { Player, ControlBar, PlaybackRateMenuButton, PlayerReference, BigPlayButton } from 'video-react';
import { intervalToDuration, formatDuration } from 'date-fns';
import { notifications } from '@mantine/notifications';
import axios from '../axios_config';
import { apiRoutes } from '../config';

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
    const [player, setPlayer] = useState<PlayerReference | null>();
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
                    head: ['Start Time', 'End Time', 'Duration', 'Filename', 'In Progress', 'Path', 'Watch', 'Delete'],
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
                          rightSection={<IconCircleMinus size={14} />}
                        >Delete
                                              </Button>;

                        const watch_button = <Button
                          key={`${row.filename}_watch`}
                          onClick={() => {
                            setVideoUrl(`${apiRoutes.getRecording}?id=${row.id}`);
                            setShowVideo(true);
                        }}
                        >Watch
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

                        tableData.body.push([row.start_time, row.stop_time,
                            formattedDuration, row.filename, in_progress_icon, row.path, watch_button,
                            delete_button]);
                    }
                });

                setPage(r.data.current_page);
                setTotalPages(r.data.total_pages);
                setVideoStreams(tableData);
            }
        });
    }

    useEffect(() => {
        if (player) player.load();
    }, [videoUrl]);

    useEffect(() => {
        getVideoRecordings();
    }, [activePage]);

    function deleteVideoStream() {
        axios.delete(
            apiRoutes.deleteVideoStream,
            { params: {
                    path: deleteRecording,
                } },
        ).then(r => {
            notifications.show({
                title: '',
                message: 'Successfully deleted video stream',
                color: 'green',
            });
            getVideoRecordings();
        }).catch(err => {
            notifications.show({
                title: 'Failed to delete video stream',
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
            <Modal opened={deleteRecordingOpen} onClose={() => setDeleteRecordingOpen(false)} title={`Are you sure you want to delete ${deleteRecording}?`}>
                <Center>
                    <Button
                      mr="md"
                      onClick={() => {
                            deleteVideoStream();
                            setDeleteRecordingOpen(false);
                        }}
                    >Yes
                    </Button>
                    <Button onClick={() => setDeleteRecordingOpen(false)}>No</Button>
                </Center>
            </Modal>
            <Container fluid>
                <AspectRatio ratio={16 / 9} display={showVideo ? 'block' : 'none'} mt="md">
                    <Player
                      ref={playerRef => {
                            setPlayer(playerRef);
                      }}
                      playsInline
                    >
                        <source
                          src={videoUrl}
                          type="video/mp4"
                        />
                        <BigPlayButton position="center" />
                        <ControlBar>
                            <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} />
                        </ControlBar>
                    </Player>
                </AspectRatio>
            </Container>
        </>
    );
}
