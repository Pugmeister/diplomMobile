import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';

export const useAuth = () => {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);

    const checkAuth = useCallback(async () => {
        const token = await AsyncStorage.getItem('token');
        setIsAuth(!!token);
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (email: string, password: string) => {
        const response = await api.post('login', { email, password });
        await AsyncStorage.setItem('token', response.data.token);
        setIsAuth(true);
    };

    const register = async (name: string, phone: string, email: string, password: string) => {
        const response = await api.post('register', { name, phone, email, password });
        await AsyncStorage.setItem('token', response.data.token);
        setIsAuth(true);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        setIsAuth(false);
    };

    return {
        isAuth,
        login,
        register,
        logout,
        checkAuth,
    };
};
