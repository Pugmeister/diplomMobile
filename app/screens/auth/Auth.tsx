import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../navigation/types';
import { login, register } from '../../api';

type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Профиль'>;

const AuthScreen = () => {
    const navigation = useNavigation<AuthScreenNavigationProp>();
    const [authType, setAuthType] = useState('login');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registrationError, setRegistrationError] = useState('');

    const handleTypeChange = (type: string) => {
        setAuthType(type);
    };

    const handleSubmit = async () => {
        try {
            const response = authType === 'register'
                ? await register(name, phone, email, password)
                : await login(email, password);

            const { token } = response.data;
            await AsyncStorage.setItem('token', token);
            navigation.navigate('MainTabs');
        } catch (error) {
            console.error(error);
            setRegistrationError('Ошибка при аутентификации');
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <Image source={require('../../images/spa-logo.png')} style={styles.logo} />
            <Text style={styles.subheading}>MelNiz</Text>
            <View style={styles.switchContainer}>
                <TouchableOpacity
                    style={[styles.switchButton, authType === 'login' && styles.activeSwitchButton]}
                    onPress={() => handleTypeChange('login')}
                >
                    <Text style={[styles.switchButtonText, authType === 'login' && styles.activeSwitchButtonText]}>Вход</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.switchButton, authType === 'register' && styles.activeSwitchButton]}
                    onPress={() => handleTypeChange('register')}
                >
                    <Text style={[styles.switchButtonText, authType === 'register' && styles.activeSwitchButtonText]}>Регистрация</Text>
                </TouchableOpacity>
            </View>
            {authType === 'register' && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Ваше имя"
                        placeholderTextColor="#aaa"
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Ваш телефон"
                        placeholderTextColor="#aaa"
                        value={phone}
                        onChangeText={setPhone}
                    />
                </>
            )}
            <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Пароль"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {registrationError && <Text style={styles.error}>{registrationError}</Text>}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>{authType === 'login' ? 'Войти' : 'Зарегистрироваться'}</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 10,
    },
    subheading: {
        textAlign: 'center',
        color: '#888',
        marginBottom: 20,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    switchButton: {
        padding: 10,
        marginHorizontal: 5,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeSwitchButton: {
        borderBottomColor: '#3CB371',
    },
    switchButtonText: {
        fontSize: 18,
        color: '#888',
    },
    activeSwitchButtonText: {
        color: '#3CB371',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        color: '#333',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
    submitButton: {
        marginTop: 20,
        backgroundColor: '#3CB371',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default AuthScreen;
