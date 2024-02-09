import {Center, Pagination, Table, TableData, useComputedColorScheme} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import axios from '@/axios_config';
import { apiRoutes } from '@/apiRoutes';

interface alert {
    callsign: string;
    casevac: boolean;
    urgent: number;
    priority: number;
    routine: number;
    hoist: boolean;
    extraction_equipment: boolean;
    ventilator: boolean;
    equipment_detail: string;
    litter: number;
    ambulatory: number;
    security: number;
    hlz_marking: number;
    hlz_remarks: string;
    us_military: number;
    us_civilian: number
    nonus_military: number;
    nonus_civilian: number;
    epw: number;
    child: number;
    terrain_slope_dir: string;
    terrain_rough: boolean;
    terrain_loose: boolean;
    terrain_other: boolean;
    terrain_other_detail: string;
    medline_remarks: string;
    zmist: {
        i: string;
        m: string;
        s: string;
        t: string;
        title: string;
        z: string;
    }
}

export default function Casevac() {
    const [casevacs, setCasevacs] = useState<TableData>({
        caption: '',
        head: ['Callsign', 'Casevac', 'Urgent', 'Priority', 'Routine', 'Hoist', 'Extraction Equipment', 'Ventilator',
        'Equipment Detail', 'Litter', 'Ambulatory', 'Security', 'HLZ Marking', 'HLZ Remarks', 'Coalition Military',
        'Coalition Civilian', 'Non-Coalition Military', 'Non-Coalition Civilian', 'Opposing Force or Detainee',
        'Children', 'Terrain Slope Direction', 'Rough Terrain', 'Loose Terrain', 'Terrain Remarks', 'Remarks',
        'Injuries Sustained', 'Mechanism of Injury', 'Symptoms and Signs', 'Treatment Given'],
        body: [],
    });
    const [activePage, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    useEffect(() => {
        axios.get(
            apiRoutes.casevac,
            { params: {
                    page: activePage,
                } }
        ).then(r => {
            if (r.status === 200) {
                const tableData: TableData = {
                    caption: '',
                    head: ['Callsign', 'Casevac', 'Urgent', 'Priority', 'Routine', 'Hoist', 'Extraction Equipment', 'Ventilator',
                        'Equipment Detail', 'Litter', 'Ambulatory', 'Security', 'HLZ Marking', 'HLZ Remarks', 'Coalition Military',
                        'Coalition Civilian', 'Non-Coalition Military', 'Non-Coalition Civilian', 'Opposing Force or Detainee',
                        'Children', 'Terrain Slope Direction', 'Rough Terrain', 'Loose Terrain', 'Terrain Remarks', 'Remarks',
                        'Injuries Sustained', 'Mechanism of Injury', 'Symptoms and Signs', 'Treatment Given', 'Title', 'Zap Number'],
                    body: [],
                };

                r.data.results.map((row:any) => {
                    if (tableData.body !== undefined) {
                        const { zmist } = row;

                        tableData.body.push([row.eud.callsign, row.casevac, row.urgent,
                            row.priority, row.routine, row.hoist, row.extraction_equipment,
                        row.ventilator, row.equipment_detail, row.litter, row.ambulatory,
                        row.security, row.hlz_marking, row.hlz_remarks, row.us_military,
                        row.us_civilian, row.nonus_military, row.nonus_civilian, row.epw,
                        row.child, row.terrain_slope_dir, row.terrain_rough, row.terrain_loose,
                        row.terrain_other_detail, row.medline_remarks, (zmist ? zmist.i : ''),
                        (zmist ? zmist.m : ''), (zmist ? zmist.s : ''), (zmist ? zmist.t : ''), (zmist ? zmist.title : ''),
                        (zmist ? zmist.z : '')]);
                    }
                });

                setPage(r.data.current_page);
                setTotalPages(r.data.total_pages);
                setCasevacs(tableData);
            }
});
}, [activePage]);
    return (
        <>
            <Table.ScrollContainer minWidth="100%">
                <Table data={casevacs} stripedColor={computedColorScheme === 'light' ? 'gray.2' : 'dark.8'} highlightOnHoverColor={computedColorScheme === 'light' ? 'gray.4' : 'dark.6'} striped="odd" highlightOnHover withTableBorder mb="md" />
            </Table.ScrollContainer>
            <Center><Pagination total={totalPages} value={activePage} onChange={setPage} withEdges /></Center>
        </>
);
}
