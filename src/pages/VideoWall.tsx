//import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
import {Responsive, WidthProvider, Layout} from "react-grid-layout";
import styled from "styled-components";
import {AspectRatio, Button, ComboboxItem, Modal, CloseButton, Select} from "@mantine/core";
import React, {useEffect, useState} from "react";
import axios from "@/axios_config.tsx";
import {apiRoutes} from "@/apiRoutes.tsx";

const ResponsiveGridLayout = WidthProvider(Responsive);

const GridItemWrapper = styled.div`
  background: #f5f5f5;
`;

const GridItemContent = styled.div`
  padding: 8px;
`;

export default function VideoWall() {
    const [videoUrl, setVideoUrl] = useState('');
    const [path, setPath] = useState('');
    const [addVideoOpened, setAddVideoOpened] = useState(false);
    const [streams, setStreams] = useState<ComboboxItem[]>([]);
    const [stream, setStream] = useState<ComboboxItem | null>()
    const [videos, setVideos] = useState<JSX.Element[]>([])

    var cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
    var layout: Layout[] = [];

    function removeVideo(key: string) {
        console.log("Removed video key", key);
        console.log(videos)
        console.log(layout)
        setVideos(videos.filter((video) => {
            console.log("VIDEO IS", video)
            console.log("KEY IS", key)
            console.log("retval is", video.key === key)
            return video.key === key
        }));
        layout.filter((l) => l.i == key);
    }

    function addVideo() {
        var key = crypto.randomUUID();
        console.log("Adding video", key)
        layout.push({i: key, x: (videos.length * 2) % 12, y: Infinity, w: 3, h: 1});
        const newVideo = <GridItemWrapper key={key}>
            <GridItemContent>
                <AspectRatio ratio={16 / 9} h="100%">
                <iframe
                    src={stream?.value}
                    title={stream?.label}
                    style={{border: 0}}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
                    <Button onClick={() => removeVideo(key)} fullWidth>Close</Button>
            </AspectRatio>
            </GridItemContent>
        </GridItemWrapper>
        setVideos(videos.concat(newVideo));
    }

    function getVideoStreams() {
        axios.get(
            apiRoutes.video_streams,
            { params: { page: 1, per_page: 500 } }
        ).then(r => {
            if (r.status === 200) {
                const all_streams: ComboboxItem[] = []
                r.data.results.map((row: any) => {
                    all_streams.push({value: `${row.hls_link}?jwt=${localStorage.getItem('token')}`, label: row.path})
                });
                setStreams(all_streams);
            }}
        )
    }

    useEffect(() => {
        console.log("Videos", videos)
    }, [videos]);

    useEffect(() => {
        if (addVideoOpened) getVideoStreams();
    }, [addVideoOpened]);

    return (
        <>
            <Button onClick={() => setAddVideoOpened(true)}>Add Video</Button>
            <Modal opened={addVideoOpened} onClose={() => setAddVideoOpened(false)} title="Add Video">
                <Select
                    placeholder="Search"
                    searchable
                    nothingFoundMessage="Nothing found..."
                    label="Choose a video"
                    onChange={(value, option) => {setStream(option);}}
                    data={streams}
                    allowDeselect={false}
                    mb="md" />
                <Button onClick={() => {addVideo(); setAddVideoOpened(false)}}>Ok</Button>
            </Modal>
            <ResponsiveGridLayout
                layouts={{ lg: layout }}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 5, md: 4, sm: 3, xs: 2, xxs: 1 }}
                rowHeight={300}
                width={1000}
                allowOverlap={false}
            >
                {videos}
            </ResponsiveGridLayout>
        </>
    )
}
