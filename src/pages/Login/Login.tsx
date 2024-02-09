import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Container,
    Group,
    Button,
    Image,
    Center,
    Stack,
    PaperProps,
    PinInput,
    Text,
    Title,
    rem,
    Box,
    useComputedColorScheme,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { upperFirst } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft, IconCheck, IconX } from '@tabler/icons-react';
import { Header } from '../../components/Header';
import { apiRoutes } from '../../apiRoutes';
import axios from '../../axios_config';
import Logo from '../../images/ots-logo.png';

export default function Login(props: PaperProps) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const [type, setType] = useState('login');
    const [email, setEmail] = useState('');
    const [emailEnabled, setEmailEnabled] = useState(false);
    const [authCode, setAuthCode] = useState<string>();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    useEffect(() => {
        try {
            axios.get(
                apiRoutes.login,
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            ).then(r => {
                setEmailEnabled(r.data.response.identity_attributes.includes('email'));
                localStorage.setItem('emailEnabled', r.data.response.identity_attributes.includes('email'));
                axios.interceptors.request.use((config) => {
                    if (['post', 'delete', 'patch', 'put'].includes(config.method!)) {
                        if (r.data.response.csrf_token !== '') {
                            config.headers['X-XSRF-Token'] = r.data.response.csrf_token;
                            axios.defaults.headers.common = { 'X-XSRF-Token': r.data.response.csrf_token };
                        }
                    }
                    return config;
                }, (error) => Promise.reject(error));

                setCsrfToken(r.data.response.csrf_token);
            });
        } catch (err) {
            console.log(err);
        }
    }, []);

    const getUser = () => {
        axios.get(
            apiRoutes.me
        ).then(r => {
            if (r.status === 200) {
                const user = r.data;
                const { roles } = user;

                localStorage.setItem('email', user.email);

                for (let i = 0; i < roles.length; i += 1) {
                    if (roles[i].name === 'administrator') {
                        localStorage.setItem('administrator', 'true');
                        break;
                    }
                }
            }
            navigate('/dashboard');
        });
    };

    function handleLogin(e:any) {
        e.preventDefault();

        axios.post(
            apiRoutes.login,
            JSON.stringify({ username, password, submit: 'Login', csrf_token: csrfToken })
        ).then(r => {
            if (r.status === 200) {
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('username', username);
                if (Object.hasOwn(r.data.response, 'tf_required') && r.data.response.tf_required) {
                    if (r.data.response.tf_method === 'authenticator') {
                        setType('authenticator');
                    } else if (r.data.response.tf_method === 'email') {
                        setType('email');
                    }
                } else getUser();
            }
        }).catch(err => {
            notifications.show({
                title: 'Login Failed',
                message: err.response.data.response.errors[0],
                color: 'red',
                icon: <IconX />,
            });
        });
}

    function handleRegister(e:any) {
        e.preventDefault();
        axios.post(
            apiRoutes.register,
            { username, password, email }
        ).then(r => {
            if (r.status === 200) {
                notifications.show({
                    message: 'Registration Succeeded',
                    color: 'green',
                    icon: <IconCheck />,
                });
            }
        }).catch(err => {
            notifications.show({
                title: 'Registration Failed',
                message: err.response.data.response.errors[0],
                color: 'red',
                icon: <IconX />,
            });
        });
    }

    function handleAuthCode(e:any) {
        e.preventDefault();
        axios.post(
            apiRoutes.tfValidate,
            { code: authCode }
        ).then(r => {
            if (r.status === 200) {
                notifications.show({
                    message: 'Authentication Succeeded',
                    color: 'green',
                    icon: <IconCheck />,
                });
                getUser();
            }
        }).catch(err => {
            console.log(err);
            notifications.show({
                title: 'Authentication Failed',
                message: err.response.data.response.errors[0],
                color: 'red',
                icon: <IconX />,
            });
        });
    }

    function handleReset(e:any) {
        e.preventDefault();
        axios.post(
            apiRoutes.resetPassword,
            { email }
        ).then(r => {
            if (r.status === 200) {
                notifications.show({
                    message: `Password reset instructions have been sent to ${email}`,
                    color: 'green',
                    icon: <IconCheck />,
                });
            }
        }).catch(err => {
            notifications.show({
                message: 'Failed to send password reset instructions',
                color: 'red',
                icon: <IconX />,
            });
        });
    }

    return (
        <Box bg={computedColorScheme === 'light' ? 'gray.1' : 'dark.9'} h="100vh">
            <Header />
            <Container size={420} my={40}>
                <Center>
                    <Image src={Logo} h={250} w="auto" />
                </Center>

                {type === 'Reset Password' && (
                    <Stack align="center">
                        <Title order={2}>Forgot your password?</Title>
                        <Text>Enter your email to get a reset link</Text>
                    </Stack>
                )}

                <Paper radius="md" p="xl" withBorder {...props} bg={computedColorScheme === 'light' ? 'white' : 'dark.7'}>
                    <Stack>
                        {(type === 'register' || type === 'Reset Password') && emailEnabled && (
                            <TextInput
                              required
                              label="Email"
                              placeholder="me@example.com"
                              value={email}
                              onChange={(event) => setEmail(event.currentTarget.value)}
                              radius="md"
                            />
                        )}

                        {(type === 'register' || type === 'login') && (
                            <div>
                                <TextInput
                                  required
                                  label="Username"
                                  placeholder="Username"
                                  value={username}
                                  onChange={(event) => setUsername(event.currentTarget.value)}
                                  radius="md"
                                />

                                <PasswordInput
                                  required
                                  label="Password"
                                  placeholder="Your password"
                                  value={password}
                                  onChange={(event) => setPassword(event.currentTarget.value)}
                                  radius="md"
                                />
                            </div>
                    )}

                        {(type === 'authenticator') && (
                                <Text ta="center">Please check your authenticator app for an auth code</Text>
                        )}
                        {(type === 'email') && (
                            <Text ta="center">Please check your email for an auth code</Text>
                        )}

                        <div style={{ display: (type === 'email' || type === 'authenticator' ? 'block' : 'none') }}>
                            <Stack>
                                <Center>
                                    <PinInput
                                      type="number"
                                      length={6}
                                      onChange={(e) => setAuthCode(e)}
                                      radius="md"
                                    />
                                </Center>
                                <Button
                                  onClick={(e) => { handleAuthCode(e); }}
                                >
                                    Submit
                                </Button>
                            </Stack>
                        </div>

                    </Stack>

                    {type === 'login' ?
                        <Group justify="space-between" mt="lg">
                            <Checkbox label="Remember me" />
                            {emailEnabled ?
                            <Anchor component="button" size="sm" onClick={() => setType('Reset Password')}>
                                Forgot password?
                            </Anchor> : ''}
                        </Group>
                    : ''}
                    <Group justify="space-between" mt="xl">
                        <Anchor
                          component="button"
                          type="button"
                          c="dimmed"
                          onClick={() => {
                            if (type === 'login') setType('register');
                            else if (type === 'register') setType('login');
                            else if (type === 'Reset Password') setType('login');
                        }}
                          size="xs"
                        >
                            {type === 'register' && 'Already have an account? Login'}
                            {type === 'login' && "Don't have an account? Register"}
                            {type === 'Reset Password' && <Center inline>
                                <IconArrowLeft style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                                <Box ml={5}>Back to the login page</Box>
                                                          </Center>}
                        </Anchor>
                        <Button
                          radius="xl"
                          onClick={(e) => {
                            if (type === 'login') handleLogin(e);
                            else if (type === 'register') handleRegister(e);
                            else if (type === 'Reset Password') handleReset(e);
                          }}
                          display={type === 'login' || type === 'register' || type === 'Reset Password' ? 'block' : 'None'}
                        >
                            {upperFirst(type)}
                        </Button>
                    </Group>
                </Paper>
            </Container>
        </Box>
    );
}
