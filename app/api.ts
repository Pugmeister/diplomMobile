import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.0.48:5173';
//const BASE_URL = 'http://172.20.10.5:5173';
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
}); 

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = async (email: string, password: string): Promise<AxiosResponse<any>> => {
    const response = await api.post('/login', { email, password });
    await AsyncStorage.setItem('token', response.data.token);
    await AsyncStorage.setItem('userId', response.data.user.id.toString());
    return response;
};

export const register = async (name: string, phone: string, email: string, password: string): Promise<AxiosResponse<any>> => {
    const response = await api.post('/register', { name, phone, email, password });
    await AsyncStorage.setItem('token', response.data.token);
    await AsyncStorage.setItem('userId', response.data.user.id.toString());
    return response;
};

export const getProfile = (): Promise<AxiosResponse<any>> => {
    return api.get('/profile');
};

export const getProcedures = (): Promise<AxiosResponse<any>> => {
    return api.get('/procedures');
};

export const getEmployees = (): Promise<AxiosResponse<any>> => {
    return api.get('/employee');
};

export const getSchedulesByEmployee = (employeeId: number, date: string): Promise<AxiosResponse<any>> => {
    return api.get(`/employee/${employeeId}/schedule`, { params: { date } });
};

export const createAppointment = (data: any): Promise<AxiosResponse<any>> => {
    return api.post('/appointment', data);
};

export const bookScheduleSlot = (scheduleId: number): Promise<AxiosResponse<any>> => {
    return api.post('/schedule/book', { scheduleId });
};



export const getAppointments = (): Promise<AxiosResponse<any>> => {
    return api.get('/appointment/');
};

export const getAppointmentById = (id: number): Promise<AxiosResponse<any>> => {
    return api.get(`/appointment/${id}`);
};

export const submitReview = (data: { userId: number; procedureId: number; rating: number; comment: string }): Promise<AxiosResponse<any>> => {
    return api.post('/review', data);
};

export const logout = (): Promise<AxiosResponse<any>> => {
    return api.post('/logout');
};

export default api;
