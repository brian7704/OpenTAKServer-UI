import {Paper, Title, useComputedColorScheme} from "@mantine/core";
import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import axios from "axios";
import {apiRoutes} from "@/apiRoutes.tsx";
import {LineChart} from "@mantine/charts";

export default function EUDStats() {
    const computedColorScheme = useComputedColorScheme('light', {getInitialValueInEffect: true});
    const [activePage, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        get_stats();
    }, [])

    function get_stats() {

        axios.get(apiRoutes.eud_stats, { params: {page: activePage, eud_uid: searchParams.get("uid")}}).then((r => {
            if (r.status === 200) {
                const eud_stats: any[] = []
                r.data.results.map((row:any) => {
                    eud_stats.push(row)
                })
                setData(eud_stats);
            }
        })).catch(err => {
            console.error(err);
        });
    }

    return (
        <>
            <Title order={1}>{searchParams.get("callsign")}</Title>
            <Paper withBorder shadow="xl" radius="md" p="xl" mr="md" mb="md">
                <LineChart
                    h={300}
                    data={data}
                    dataKey="timestamp"
                    unit="MB"
                    dotProps={{ r: 0, strokeWidth: 0 }}
                    withLegend
                    series={[
                        { name: 'deviceDataRx', color: 'blue.6' },
                        { name: 'deviceDataTx', color: 'teal.6' },
                    ]}
                    curveType="linear"
                />
            </Paper>
            <Paper withBorder shadow="xl" radius="md" p="xl" mr="md" mb="md">
                <LineChart
                    h={300}
                    data={data}
                    unit="%"
                    dataKey="timestamp"
                    dotProps={{ r: 0, strokeWidth: 0 }}
                    withLegend
                    series={[
                        { name: 'battery', color: 'blue.6' },
                    ]}
                    curveType="linear"
                />
            </Paper>
            <Paper withBorder shadow="xl" radius="md" p="xl" mr="md" mb="md">
                <LineChart
                    h={300}
                    data={data}
                    dataKey="timestamp"
                    unit="MB"
                    dotProps={{ r: 0, strokeWidth: 0 }}
                    withLegend
                    series={[
                        { name: 'heap_current_size', color: 'blue.6' },
                        { name: 'heap_free_size', color: 'teal.6' },
                        { name: 'heap_max_size', color: 'indigo.6' },
                    ]}
                    curveType="linear"
                />
            </Paper>
            <Paper withBorder shadow="xl" radius="md" p="xl" mr="md" mb="md">
                <LineChart
                    h={300}
                    data={data}
                    dataKey="timestamp"
                    dotProps={{ r: 0, strokeWidth: 0 }}
                    withLegend
                    unit="GB"
                    series={[
                        { name: 'storage_available', color: 'blue.6' },
                        { name: 'storage_total', color: 'teal.6' },
                    ]}
                    curveType="linear"
                />
            </Paper>
        </>
    )
}
