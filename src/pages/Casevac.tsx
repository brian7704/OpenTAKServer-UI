import {Center, Pagination, Table, TableData, useComputedColorScheme} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import axios from '@/axios_config';
import { apiRoutes } from '@/apiRoutes';
import {t} from "i18next";

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
        head: [t('Callsign'), t('Casevac'), t('Urgent'), t('Priority'), t('Routine'), t('Hoist'), t('Extraction Equipment'), t('Ventilator'),
        t('Equipment Detail'), t('Litter'), t('Ambulatory'), t('Security'), t('HLZ Marking'), t('HLZ Remarks'), t('Coalition Military'),
        t('Coalition Civilian'), t('Non-Coalition Military'), t('Non-Coalition Civilian'), t('Opposing Force or Detainee'),
        t('Children'), t('Terrain Slope Direction'), t('Rough Terrain'), t('Loose Terrain'), t('Terrain Remarks'), t('Remarks'),
        t('Injuries Sustained'), t('Mechanism of Injury'), t('Symptoms and Signs'), t('Treatment Given')],
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
                    head: [t('Title'), t('Timestamp'), t('Callsign'), t('Casevac'), t('Urgent'), t('Priority'), t('Routine'), t('Hoist'), t('Extraction Equipment'), t('Ventilator'),
                        t('Equipment Detail'), t('Litter'), t('Ambulatory'), t('Security'), t('HLZ Marking'), t('HLZ Remarks'), t('Coalition Military'),
                        t('Coalition Civilian'), t('Non-Coalition Military'), t('Non-Coalition Civilian'), t('Opposing Force or Detainee'),
                        t('Children'), t('Terrain Slope Direction'), t('Rough Terrain'), t('Loose Terrain'), t('Terrain Remarks'), t('Remarks'),
                        t('Injuries Sustained'), t('Mechanism of Injury'), t('Symptoms and Signs'), t('Treatment Given'), t('Title'), t('Zap Number')],
                    body: [],
                };

                r.data.results.map((row:any) => {
                    if (tableData.body !== undefined) {
                        const { zmist } = row;

                        tableData.body.push([row.title, row.timestamp, row.eud.callsign,
                        String(row.casevac), row.urgent, row.priority, row.routine,
                        String(row.hoist), String(row.extraction_equipment),
                        String(row.ventilator), row.equipment_detail, row.litter, row.ambulatory,
                        row.security, row.hlz_marking, row.hlz_remarks, row.us_military,
                        row.us_civilian, row.nonus_military, row.nonus_civilian, row.epw,
                        row.child, row.terrain_slope_dir, String(row.terrain_rough),
                        String(row.terrain_loose), String(row.terrain_other_detail),
                        row.medline_remarks, (zmist ? zmist.i : ''), (zmist ? zmist.m : ''),
                        (zmist ? zmist.s : ''), (zmist ? zmist.t : ''), (zmist ? zmist.title : ''),
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
