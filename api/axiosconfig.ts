import axios from 'axios';
import { Alert } from 'react-native';

const port = '3000';
const myIP = '10.136.203.71'; // IP address of your local device connected to an ISP

export const baseURL = `http://${myIP}:${port}`;

// const baseURL = 'https://trackademic.site';

const api = axios.create({
    baseURL: baseURL,
    timeout: 8000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
        if (!error.response) {
            const isServerClosed =
                error.code === 'ECONNREFUSED' ||
                error.message?.toLowerCase().includes('network error') ||
                error.message?.toLowerCase().includes('failed to connect');

            Alert.alert(
                isServerClosed ? 'Server Closed' : 'Network Error',
                isServerClosed
                    ? 'The server is currently closed or unreachable. Please start the server and try again.'
                    : 'Can\'t connect to the server. Please check your network connection or ensure the server is running.',
            );
        }
        return Promise.reject(error);
    }
);

export default api;
