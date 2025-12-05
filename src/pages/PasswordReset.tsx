import React, { useState } from 'react';
import {useNavigate, useSearchParams} from 'react-router';
import {
    Box, Button,
    Center,
    Container,
    Image,
    Paper,
    PasswordInput,
    Stack,
    Title, useComputedColorScheme,
} from '@mantine/core';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import Logo from '../images/ots-logo.png';
import { Header } from '../components/Header';
import { apiRoutes } from '@/apiRoutes';
import {t} from "i18next";

export default function PasswordReset() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [password, setPassword] = useState('');
    const [password_confirm, setPassword_confirm] = useState('');
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const navigate = useNavigate();

    const token = searchParams.get('token');

    function handleReset(e:any) {
        e.preventDefault();
        axios.post(
            `${apiRoutes.resetPassword}/${token}`,
            { password, password_confirm }
        ).then(r => {
            if (r.status === 200) {
                notifications.show({
                    message: t('Your password has been changed'),
                    color: 'green',
                    icon: <IconCheck />,
                });
                navigate('/login');
            }
        }).catch(err => {
            notifications.show({
                message: t('Failed to reset your password'),
                color: 'red',
                icon: <IconX />,
            });
        });
    }

    return (
        <Box bg={computedColorScheme === 'light' ? 'gray.1' : 'dark.5'} h="100vh">
            <Header />
            <Container size={420} my={40}>
                <Center>
                    <Image src={Logo} h={250} w="auto" />
                </Center>

                    <Stack align="center">
                        <Title order={2}>{t("Password Reset")}</Title>
                    </Stack>

                <Paper radius="md" p="xl" withBorder bg={computedColorScheme === 'light' ? 'white' : 'dark.8'}>
                    <Stack>
                        <div>
                            <PasswordInput
                              required
                              label={t("Password")}
                              placeholder={t("Your password")}
                              value={password}
                              onChange={(event) => setPassword(event.currentTarget.value)}
                              radius="md"
                              pb="md"
                            />
                            <PasswordInput
                              required
                              label={t("Confirm Password")}
                              placeholder={t("Confirm password")}
                              value={password_confirm}
                              onChange={(event) => setPassword_confirm(event.currentTarget.value)}
                              radius="md"
                              pb="md"
                            />
                            <Button
                              radius="xl"
                              onClick={(e) => {
                                    handleReset(e);
                                }}
                              display="block"
                            >
                                {t("Reset Password")}
                            </Button>
                        </div>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
}
