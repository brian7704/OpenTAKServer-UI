import { io } from 'socket.io-client';
import { server_address } from './config';

const { protocol } = location;
const { port } = location;

export const socket = io(`${protocol}//${server_address}:${port}/socket.io`, { autoConnect: false });
