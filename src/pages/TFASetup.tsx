import React, { useEffect, useState } from 'react';
import { Badge, Button, Center, LoadingOverlay, Paper, PinInput, Radio, Stack, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import QRCode from 'react-qr-code';
import axios from '../axios_config';
import { apiRoutes } from '../config';

export default function TFASetup() {
    const [tfPrimaryMethod, setTfPrimaryMethod] = useState<string | undefined>(undefined);
    const [setup, setSetup] = useState<string | undefined>(undefined);
    const [qrValue, setQrValue] = useState<string>('');
    const [qrKey, setQrKey] = useState<string>('');
    const [authCode, setAuthCode] = useState<string>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(
            apiRoutes.tfSetup,
        ).then(r => {
            setTfPrimaryMethod(r.data.response.tf_primary_method);
        }).catch(err => {
            let message = '';
            if (err.status === 401) message = 'Not logged in';

            notifications.show({
                title: 'Failed to get 2FA methods',
                message,
                color: 'red',
                icon: <IconX />,
            });
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (tfPrimaryMethod !== undefined) {
            setLoading(false);
        }
    }, [tfPrimaryMethod]);

    useEffect(() => {
        if (setup !== undefined) {
            setQrValue('');

            axios.post(
                apiRoutes.tfSetup,
                { setup }
            ).then(r => {
                if (r.status === 200) {
                    if (setup === 'authenticator') {
                        const issuer = r.data.response.tf_authr_issuer;
                        const username = r.data.response.tf_authr_username;
                        const key = r.data.response.tf_authr_key;
                        setQrKey(key);
                        setQrValue(`otpauth://totp/${issuer}:${username}?secret=${key}&issuer=${issuer}`);
                    } else if (setup === 'disable') {
                        notifications.show({
                            message: 'You have successfully disabled two-factor authentication',
                            color: 'green',
                            icon: <IconCheck />,
                        });
                    }
                }
            }).catch(err => {
                let message = '';
                if (err.status === 401) message = 'Not logged in';

                notifications.show({
                    title: 'Failed to set 2FA method',
                    message,
                    color: 'red',
                    icon: <IconX />,
                });
                setLoading(false);
            });
        }
    }, [setup]);

    function submitCode() {
        axios.post(
            apiRoutes.tfValidate,
            { code: authCode }
        ).then(r => {
            if (r.status === 200) {
                notifications.show({
                    message: 'You successfully changed your two-factor method',
                    color: 'green',
                    icon: <IconCheck />,
                });
            }
        }).catch(err => {
            notifications.show({
                message: 'Failed to change your two-factor method',
                color: 'red',
                icon: <IconX />,
            });
        });
    }

    if (loading) {
        return (
            <LoadingOverlay visible zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
        );
    }
        return (
            <div>
                <Title ta="center" order={2}>Two-factor authentication adds an extra layer of security to your
                    account
                </Title>
                <Text ta="center">In addition to your username and password, you'll need to use a code.</Text>
                <Text ta="center">Current 2FA method enabled for this account: <Badge
                  color="blue"
                >{tfPrimaryMethod !== undefined && tfPrimaryMethod !== null ? tfPrimaryMethod : 'None'}
                                                                               </Badge>
                </Text>
                <Radio.Group
                  mt="md"
                  mb="md"
                  pb="md"
                  defaultValue={tfPrimaryMethod === 'email' || tfPrimaryMethod === 'authenticator' ? tfPrimaryMethod : 'disable'}
                >
                    <Radio
                      disabled={localStorage.getItem('emailEnabled') !== 'true' || localStorage.getItem('email') === 'null'}
                      value="email"
                      label="Set up using email"
                      onClick={() => setSetup('email')}
                      mb="md"
                    />
                    <Radio
                      mb="md"
                      onClick={() => setSetup('authenticator')}
                      value="authenticator"
                      label="Set up using an authenticator app (e.g. google, lastpass, authy)"
                    />
                    <Radio
                      mb="md"
                      onClick={() => setSetup('disable')}
                      value="disable"
                      label="Disable two factor authentication"
                    />
                </Radio.Group>
                <div style={{ display: (qrValue === '' ? 'none' : 'block') }}>
                    <Stack align="center" pb="md">
                        <Text>Open an authenticator app on your device and scan the following QRcode (or enter the code
                            below manually) to start receiving codes
                        </Text>
                        <Paper shadow="xl" radius="md" p="xl" withBorder w="min-content">
                            <Stack align="center">
                                <QRCode value={qrValue} />
                                <Text ta="center">{qrKey}</Text>
                            </Stack>
                        </Paper>
                    </Stack>
                </div>
                <div style={{ display: (setup === 'email' || setup === 'authenticator' ? 'block' : 'none') }}>
                    <Center>
                        <Paper radius="md" p="xl" withBorder shadow="xl" w="min-content">
                            <Stack>
                                <PinInput
                                  type="number"
                                  length={6}
                                  onChange={(e) => setAuthCode(e)}
                                  radius="md"
                                />
                                <Button onClick={() => submitCode()}>Submit Code</Button>
                            </Stack>
                        </Paper>
                    </Center>
                </div>
            </div>
        );
}
