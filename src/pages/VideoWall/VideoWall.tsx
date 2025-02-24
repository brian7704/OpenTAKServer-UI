//import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
import ReactGridLayout, {Responsive, WidthProvider, Layout} from "react-grid-layout";
import styled from "styled-components";
import {AspectRatio, Button, ComboboxItem, Modal, Select} from "@mantine/core";
import classes from './video_wall.module.css'
import React, {useCallback, useEffect, useState} from "react";
import axios from "@/axios_config.tsx";
import {apiRoutes} from "@/apiRoutes.tsx";
import { ResizableBox } from 'react-resizable';

const ResponsiveGridLayout = WidthProvider(Responsive);

const GridItemWrapper = styled.div`
  background: #f5f5f5;
  .react-grid-item:hover { z-index: 999 !important }
`;

const GridItemContent = styled.div`
  padding: 8px;
`;

export default function VideoWall() {
    const [addVideoOpened, setAddVideoOpened] = useState(false);
    const [streams, setStreams] = useState<ComboboxItem[]>([]);
    const [stream, setStream] = useState<ComboboxItem | null>()
    const [videos, setVideos] = useState<JSX.Element[]>([])
    const [layouts, setLayouts] = useState<Layout[]>([]);
    const aspectRatio = 16/9

    function removeVideo(key: string) {
        console.log("Removed video key", key);
        console.log(videos)
        console.log(layouts)
        setVideos(videos.filter((video) => {
            console.log("VIDEO IS", video)
            console.log("KEY IS", key)
            console.log("retval is", video.key === key)
            return video.key === key
        }));
        layouts.filter((l) => l.i === key);
    }

    function addVideo() {
        const key = crypto.randomUUID();
        console.log("Adding video", key)
        const newVideo = <ResizableBox width={480}
                                       height={152}
                                       key={key}
                                       minConstraints={[50, 50 / aspectRatio]}
                                       maxConstraints={[Infinity, Infinity / aspectRatio]}
                                       data-grid={{i: key, x: (videos.length * 2) % 12, y: Infinity, w: 3, h: 1}}
                                       className={classes.reactGridItem}>
            <GridItemContent>
                <AspectRatio ratio={aspectRatio} h="100%">
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
        </ResizableBox>
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

    const handleResize = useCallback(
        (l:Layout[], oldLayoutItem:Layout, layoutItem:Layout, placeholder:Layout, event: MouseEvent, element: HTMLElement) => {
            const heightDiff = layoutItem.h - oldLayoutItem.h;
            const widthDiff = layoutItem.w - oldLayoutItem.w;
            //const changeCoef = oldLayoutItem.w / oldLayoutItem.h;
            if (Math.abs(heightDiff) < Math.abs(widthDiff)) {
                layoutItem.h = layoutItem.w / aspectRatio;
                placeholder.h = layoutItem.w / aspectRatio;
            } else {
                layoutItem.w = layoutItem.h * aspectRatio;
                placeholder.w = layoutItem.h * aspectRatio;
            }
        },
        []
    );

    /*function handleResize(size: any) {
        // Lock aspect ratio
        console.log("Handle resize", size)
        const newWidth = size.width;
        const newHeight = newWidth / aspectRatio;
        //this.props.onResize(e, { size: { width: newWidth, height: newHeight } });
    }*/

    useEffect(() => {
        console.log("Videos", videos)
    }, [videos]);

    useEffect(() => {
        if (addVideoOpened) {getVideoStreams();}
    }, [addVideoOpened]);

    const onResponsiveGridLayoutResize = useCallback((layout: ReactGridLayout.Layout[], oldItem: ReactGridLayout.Layout, newItem: ReactGridLayout.Layout, placeholder: ReactGridLayout.Layout, event: MouseEvent, element: HTMLElement) => {
        const heightDiff = newItem.h - oldItem.h;
        const widthDiff = newItem.w - oldItem.w;
        //const changeCoef = oldItem.w / oldItem.h;
        if (Math.abs(heightDiff) < Math.abs(widthDiff)) {
            newItem.h = newItem.w / aspectRatio;
            placeholder.h = newItem.w / aspectRatio;
        } else {
            newItem.w = newItem.h * aspectRatio;
            placeholder.w = newItem.h * aspectRatio;
        }
    }, []);


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
                //layouts={{ lg: layouts }}
                breakpoints={{ lg: 1080, md: 900, sm: 720, xs: 540, xxs: 360 }}
                cols={{ lg: 13, md: 12, sm: 11, xs: 10, xxs: 9 }}
                rowHeight={220}

                margin={[0,0]}
                //width={1000}
                allowOverlap={false}
                onResize={handleResize}>
                {videos}
            </ResponsiveGridLayout>
        </>
    )
}
