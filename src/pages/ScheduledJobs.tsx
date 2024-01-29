import { Button, Switch, Table, TableData, useComputedColorScheme } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { IconCheck, IconPlayerPlay, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { formatISO, parseISO } from 'date-fns';
import { apiRoutes } from '../config';
import axios from '../axios_config';

export default function ScheduledJobs() {
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const [jobs, setJobs] = useState<TableData>({
        caption: '',
        head: ['Name', 'Start Date', 'Next Run', 'Trigger', 'Minutes', 'Seconds', 'Run Now', 'Active'],
        body: [],
    });

    function runJob(e:any, jobId:string, jobName:string) {
        e.preventDefault();

        axios.post(
            apiRoutes.runJob,
            { job_id: jobId }
        ).then(r => {
            if (r.status === 200) {
                notifications.show({
                    title: 'Success',
                    message: `${jobName} was started`,
                    color: 'green',
                    icon: <IconCheck />,
                });
            }
        }).catch(error => {
            console.log(error);
            notifications.show({
                title: 'Error',
                message: error.response.data.errors,
                color: 'red',
                icon: <IconX />,
            });
        });
    }

    function activateJob(jobId:string, jobName:string) {
        axios.post(
            apiRoutes.resumeJob,
            { job_id: jobId }
        ).then(r => {
            if (r.status === 200) {
                getJobs();
                notifications.show({
                    title: 'Success',
                    message: `${jobName} has been activated`,
                    color: 'green',
                    icon: <IconCheck />,
                });
            }
        }).catch(error => {
            console.log(error);
            notifications.show({
                title: 'Error',
                message: error.response.data.errors,
                color: 'red',
                icon: <IconX />,
            });
        });
    }

    function deactivateJob(jobId:string, jobName:string) {
        axios.post(
            apiRoutes.pauseJob,
            { job_id: jobId }
        ).then(r => {
            if (r.status === 200) {
                getJobs();
                notifications.show({
                    title: 'Success',
                    message: `${jobName} has been deactivated`,
                    color: 'green',
                    icon: <IconCheck />,
                });
            }
        }).catch(error => {
            console.log(error);
            notifications.show({
                title: 'Error',
                message: error.response.data.errors,
                color: 'red',
                icon: <IconX />,
            });
        });
    }

    function getJobs() {
        axios.get(
            apiRoutes.getScheduledJobs
        ).then(r => {
            if (r.status === 200) {
                const tableData: TableData = {
                    caption: '',
                    head: ['Name', 'Start Date', 'Next Run', 'Trigger', 'Minutes', 'Seconds', 'Run Now', 'Active'],
                    body: [],
                };

                r.data.map((row:any) => {
                    const start = (row.start_date !== null) ? formatISO(parseISO(row.start_date)) : '';
                    const next = (row.next_run_time !== null) ? formatISO(parseISO(row.next_run_time)) : '';

                    const run_now = <Button
                      onClick={(e) => {
                                                runJob(e, row.id, row.name);
                                            }}
                      mb="md"
                    ><IconPlayerPlay size={14} />
                                    </Button>;

                    const active_switch = <Switch
                      checked={row.next_run_time !== null}
                      onChange={(e) => {
                            if (e.target.checked) { activateJob(row.id, row.name); } else { deactivateJob(row.id, row.name); }
                        }}
                    />;

                    tableData.body?.push([row.name, start, next, row.trigger, row.minutes, row.seconds, run_now, active_switch]);
                });

                setJobs(tableData);
            }
        });
    }

    useEffect(() => {
        getJobs();
    }, []);

    return (
        <>
            <Table data={jobs} stripedColor={computedColorScheme === 'light' ? 'gray.2' : 'dark.8'} highlightOnHoverColor={computedColorScheme === 'light' ? 'gray.4' : 'dark.6'} striped="odd" highlightOnHover withTableBorder mb="md" />
        </>
    );
}
