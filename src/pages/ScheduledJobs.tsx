import { Button, NumberInput, Switch, Table, TableData, useComputedColorScheme } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { IconCheck, IconDeviceFloppy, IconEdit, IconPlayerPlay, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { formatISO, parseISO } from 'date-fns';
import { apiRoutes } from '../apiRoutes';
import axios from '../axios_config';
import {t} from "i18next";

export default function ScheduledJobs() {
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const [jobs, setJobs] = useState<TableData>({
        caption: '',
        head: [t('Name'), t('Start Date'), t('Next Run'), t('Trigger'), t('Minutes'), t('Seconds'), t('Run Now'), t('Active'), t('Edit'), t('Save')],
        body: [],
    });
    const [editable, setEditable] = useState<string | null>(null);
    const [data, setData] = useState<Array<[]>>([]);
    const [runningJob, setRunningJob] = useState('');
    const [interval, setInterval] = useState({
        minutes: 0,
        seconds: 0,
        changeJob: false,
        job_id: '',
        trigger: 'interval',
    });

    const handleChange = (key:string, value:string | number) => {
        setInterval(prevState => ({ ...prevState, [key]: value }));
    };

    function runJob(e:any, jobId:string, jobName:string) {
        e.preventDefault();

        axios.post(
            apiRoutes.runJob,
            { job_id: jobId }
        ).then(r => {
            if (r.status === 200) {
                notifications.show({
                    title: t('Success'),
                    message: t(`${jobName} was started`),
                    color: 'green',
                    icon: <IconCheck />,
                });
                setRunningJob('');
            }
        }).catch(error => {
            console.log(error);
            notifications.show({
                title: t('Error'),
                message: error.response.data.errors,
                color: 'red',
                icon: <IconX />,
            });
            setRunningJob('');
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
                    title: t('Success'),
                    message: t(`${jobName} has been activated`),
                    color: 'green',
                    icon: <IconCheck />,
                });
            }
        }).catch(error => {
            console.log(error);
            notifications.show({
                title: t('Error'),
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
                    title: t('Success'),
                    message: t(`${jobName} has been deactivated`),
                    color: 'green',
                    icon: <IconCheck />,
                });
            }
        }).catch(error => {
            console.log(error);
            notifications.show({
                title: t('Error'),
                message: error.response.data.errors,
                color: 'red',
                icon: <IconX />,
            });
        });
    }

    function changeJob() {
        axios.post(
            apiRoutes.modifyJob,
            { job_id: interval.job_id, minutes: interval.minutes, seconds: interval.seconds, trigger: interval.trigger }
        ).then(r => {
            if (r.status === 200) {
                notifications.show({
                    title: t('Success'),
                    message: t('Successfully changed job'),
                    color: 'green',
                    icon: <IconCheck />,
                });
                setEditable(null);
                getJobs();
            }
        }).catch(err => {
            console.log(err);
            notifications.show({
                title: t('Error'),
                message: err.message,
                color: 'red',
                icon: <IconX />,
            });
        });
    }

    function parseJobs() {
        const tableData: TableData = {
            caption: '',
            head: [t('Name'), t('Start Date'), t('Next Run'), t('Trigger'), t('Minutes'), t('Seconds'), t('Run Now'), t('Active'), t('Edit'), t('Save')],
            body: [],
        };

        data.map((row:any) => {
            const start = (Object.hasOwn(row, 'start_date') && row.start_date !== null) ? formatISO(parseISO(row.start_date)) : '';
            const next = (Object.hasOwn(row, 'next_run_time') && row.next_run_time !== null) ? formatISO(parseISO(row.next_run_time)) : '';

            const run_now = <Button
              onClick={(e) => {
                  runJob(e, row.id, row.name);
                  setRunningJob(row.id);
                }}
              loading={runningJob === row.id}
            ><IconPlayerPlay size={14} />
                            </Button>;

            const active_switch = <Switch
              checked={row.next_run_time !== null}
              onChange={(e) => {
                    if (e.target.checked) {
                        activateJob(row.id, row.name);
                    } else {
                        deactivateJob(row.id, row.name);
                    }
                }}
            />;

            const editButton = <Button
              disabled={row.trigger !== 'interval'}
              onClick={(e) => {
                  if (row.trigger === 'interval') {
                      e.preventDefault();
                      setEditable(row.id);
                      setInterval({
                          minutes: row.minutes,
                          seconds: row.seconds,
                          changeJob: false,
                          job_id: row.id,
                          trigger: row.trigger,
                      });
                  }
            }}
            ><IconEdit size={14} />
                               </Button>;

            const saveButton = <Button
              disabled={row.trigger !== 'interval'}
              onClick={(e) => {
                e.preventDefault();
                setInterval(prevState => ({ ...prevState, changeJob: true }));
            }}
            ><IconDeviceFloppy size={14} />
                               </Button>;

            let minutes;
            let seconds;

            if (editable === row.id) {
                minutes = <NumberInput
                  onChange={(value) => handleChange('minutes', value)}
                  defaultValue={row.minutes}
                  min={0}
                  max={59}
                />;
                seconds = <NumberInput
                  onChange={(value) => handleChange('seconds', value)}
                  defaultValue={row.seconds}
                  min={0}
                  max={59}
                />;
            } else if (row.trigger === 'interval') {
                minutes = row.minutes;
                seconds = row.seconds;
            }

            tableData.body?.push([row.name, start, next, row.trigger,
                minutes, seconds, run_now, active_switch, editButton, saveButton]);
        });

        setJobs(tableData);
    }

    function getJobs() {
        axios.get(
            apiRoutes.getScheduledJobs
        ).then(r => {
            if (r.status === 200) {
                setData(r.data);
            }
        });
    }

    useEffect(() => {
        getJobs();
    }, []);

    useEffect(() => {
        parseJobs();
    }, [data, editable, runningJob]);

    useEffect(() => {
        if (interval.changeJob) changeJob();
    }, [interval]);

    return (
        <>
            <Table.ScrollContainer minWidth="100%">
                <Table data={jobs} stripedColor={computedColorScheme === 'light' ? 'gray.2' : 'dark.8'} highlightOnHoverColor={computedColorScheme === 'light' ? 'gray.4' : 'dark.6'} striped="odd" highlightOnHover withTableBorder mb="md" />
            </Table.ScrollContainer>
        </>
    );
}
