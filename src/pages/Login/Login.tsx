import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button, Alert, Image, Center,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './Login.module.css';
import { Header } from '../../components/Header';
import { apiRoutes } from '../../config';
import axios from '../../axios_config';
import Logo from '../../assets/ots-logo.png';

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [errorVisible, setErrorVisible] = useState(false);

    useEffect(() => {
        try {
            axios.get(
                apiRoutes.login,
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            ).then(r => {
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
        console.log(axios);
        axios.get(
            apiRoutes.me
        ).then(r => {
            if (r.status === 200) {
                const { user } = r.data;
                const { roles } = user;

                for (let i = 0; i < roles.length; i += 1) {
                    if (roles[i].role.name === 'administrator') {
                        localStorage.setItem('administrator', 'true');
                        break;
                    }
                }
            }
            navigate('/dashboard');
        });
    };

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        setErrorVisible(false);

        try {
            await axios.post(
                apiRoutes.login,
                JSON.stringify({ username, password, submit: 'Login', csrf_token: csrfToken })
            ).then(r => {
                if (r.status === 200) {
                    localStorage.setItem('loggedIn', 'true');
                    localStorage.setItem('username', username);
                    getUser();
                    // socket.connect();
                }
            });
        } catch (err:any) {
            setErrorVisible(true);
            setErrorMessage(err.response.data.response.errors[0]);
            console.log(err);
        }
    };

    return (
        <div>
            <Header />
            <Container size={420} my={40}>
                <Center>
                    <Image src={Logo} h={250} w='auto' />
                </Center>
                <Title ta="center" className={classes.title}>
                    Welcome back!
                </Title>
                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    Do not have an account yet?{' '}
                    <Anchor size="sm" component="button">
                        Create account
                    </Anchor>
                </Text>

                <Paper withBorder shadow="md" p={30} mt={30} mb={10} radius="md">
                    <TextInput label="Username" placeholder="Your username" required onChange={(e) => setUsername(e.target.value)} />
                    <PasswordInput
                      label="Password"
                      placeholder="Your password"
                      required
                      mt="md"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                    />
                    <Group justify="space-between" mt="lg">
                        <Checkbox label="Remember me" />
                        <Anchor component="button" size="sm">
                            Forgot password?
                        </Anchor>
                    </Group>
                    <Button
                      onClick={(e) => {
                            handleSubmit(e);
                        }}
                      fullWidth
                      mt="xl"
                    >
                        Sign in
                    </Button>
                </Paper>
                <Alert style={errorVisible ? { display: 'block' } : { display: 'none' }} radius='md' variant="light" color="red" title="Login Failed">
                    {errorMessage}
                </Alert>
            </Container>
        </div>
    );
}
