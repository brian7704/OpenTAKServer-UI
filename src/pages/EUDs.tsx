import {Container, Title, Text, Button, Group, Table, TableData} from '@mantine/core';
import {useEffect, useState} from "react";
import axios from "@/axios_config";
import {apiRoutes} from "@/config";

interface eud {
    callsign: string;
    device: string;
    platform: string;
    os: string;
    phone_number: number;
    username: string;
    uid: string;
    version: string;
    last_event_time: string;
    last_status: string;
}

export default function EUDs() {
    const [euds, setEuds] = useState<TableData>({
        caption: '',
        head: ['Callsign', 'Device', 'Platform', 'OS', 'Phone Number', 'Username', 'UID', 'Version', 'Last Event Time', 'Last Event'],
        body: []
    });
    const [activePage, setPage] = useState(1);


    useEffect(() => {
        axios.get(
            apiRoutes.eud
        ).then(r => {
            if (r.status === 200) {
                const tableData: TableData = {
                    caption: '',
                    head: ['Callsign', 'Device', 'Platform', 'UID', 'Version'],
                    body: []
                }

                r.data.results.map((row:any) => {
                    if (tableData.body !== undefined) {
                        tableData.body.push([row.eud.callsign, row.eud.device, row.eud.platform, row.eud.os, row.eud.phone_number,
                            row.eud.username, row.eud.uid, row.eud.version, row.eud.last_event_time, row.eud.last_status])
                    }
                })


                setPage(r.data.current_page);
                setEuds(tableData);
    }})}, [])
    return (
        <>
        <Table data={euds} />
        </>
    );
}
