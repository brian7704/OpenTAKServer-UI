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
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { upperFirst } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft, IconCheck, IconX } from '@tabler/icons-react';
import { Header } from '../../components/Header';
import { apiRoutes } from '../../apiRoutes';
import axios from '../../axios_config';
import Logo from '../../images/ots-logo.png';

type CurrentUser = {
    email?: string;
    roles?: Array<{ name: string }>;
    token?: string;
    username?: string;
};

export default function Login(props: PaperProps) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const [type, setType] = useState('login');
    const [email, setEmail] = useState('');
    const [emailEnabled, setEmailEnabled] = useState(false);
    const [authCode, setAuthCode] = useState<string>();
    const [ldapEnabled, setLdapEnabled] = useState(false);
    const [oidcEnabled, setOidcEnabled] = useState(false);
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    const hydrateLoggedInUser = useCallback((user: CurrentUser) => {
        const roles = user.roles ?? [];
        const isAdministrator = roles.some((role) => role.name === 'administrator');

        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('username', user.username ?? '');
        localStorage.setItem('email', user.email ?? '');
        localStorage.setItem('token', user.token ?? '');
        localStorage.setItem('administrator', String(isAdministrator));
    }, []);

    const getUser = useCallback(() => {
        axios.get(
            apiRoutes.me,
        ).then(r => {
            if (r.status === 200) {
                hydrateLoggedInUser(r.data);
                navigate('/dashboard');
            }
        });
    }, [hydrateLoggedInUser, navigate]);

    useEffect(() => {
        axios.get(
            apiRoutes.login,
            {
                headers: { 'Content-Type': 'application/json' },
            },
        ).then(r => {
            const identityAttributes = r.data.response.identity_attributes ?? [];
            const isEmailEnabled = identityAttributes.includes('email');
            const isLdapEnabled = identityAttributes.includes('ldap');
            const isOidcEnabled = identityAttributes.includes('oidc');

            setEmailEnabled(isEmailEnabled);
            setLdapEnabled(isLdapEnabled);
            setOidcEnabled(isOidcEnabled);
            localStorage.setItem('emailEnabled', String(isEmailEnabled));

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
        }).catch(err => {
            console.log(err);
        });

        axios.get(
            apiRoutes.me,
        ).then(r => {
            if (r.status === 200) {
                hydrateLoggedInUser(r.data);
                navigate('/dashboard');
            }
        }).catch(() => {
            // Ignore unauthenticated requests on the login page.
        });
    }, [hydrateLoggedInUser, navigate]);

    function handleLogin(e:any) {
        e.preventDefault();

        if (oidcEnabled) {
            window.location.assign(`${apiRoutes.oidcLogin}?next=/login`);
            return;
        }

        let loginUrl = apiRoutes.login;
        if (ldapEnabled) {
            loginUrl = apiRoutes.ldapLogin;
        }

        axios.post(
            loginUrl,
            JSON.stringify({ username, password, submit: 'Login', csrf_token: csrfToken }),
        ).then(r => {
            if (r.status === 200) {
                if (Object.hasOwn(r.data.response, 'tf_required') && r.data.response.tf_required) {
                    localStorage.setItem('loggedIn', 'true');
                    localStorage.setItem('username', username);
                    if (r.data.response.tf_method === 'authenticator') {
                        setType('authenticator');
                    } else if (r.data.response.tf_method === 'email') {
                        setType('email');
                    }
                } else {
                    getUser();
                }
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
            { username, password, email },
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
            { code: authCode },
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
            { email },
        ).then(r => {
            if (r.status === 200) {
                notifications.show({
                    message: `Password reset instructions have been sent to ${email}`,
                    color: 'green',
                    icon: <IconCheck />,
                });
            }
        }).catch(() => {
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

                        {type === 'login' && oidcEnabled && (
                            <Text ta="center">Continue to sign in with the configured OpenID Connect provider.</Text>
                        )}

                        {(type === 'register' || (type === 'login' && !oidcEnabled)) && (
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

                    {(type === 'login' && !oidcEnabled) ?
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
                            if (type === 'login') { setType('register'); }
                            else if (type === 'register') { setType('login'); }
                            else if (type === 'Reset Password') { setType('login'); }
                        }}
                          size="xs"
                        >
                            {type === 'register' && 'Already have an account? Login'}
                            {(type === 'login' && emailEnabled) && "Don't have an account? Register"}
                            {type === 'Reset Password' && <Center inline>
                                <IconArrowLeft style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                                <Box ml={5}>Back to the login page</Box>
                                                          </Center>}
                        </Anchor>
                        <Button
                          radius="xl"
                          onClick={(e) => {
                            if (type === 'login') { handleLogin(e); }
                            else if (type === 'register') { handleRegister(e); }
                            else if (type === 'Reset Password') { handleReset(e); }
                          }}
                          display={type === 'login' || type === 'register' || type === 'Reset Password' ? 'block' : 'None'}
                        >
                            {type === 'login' && oidcEnabled ? 'Continue' : upperFirst(type)}
                        </Button>
                    </Group>
                </Paper>
            </Container>
        </Box>
    );
}
