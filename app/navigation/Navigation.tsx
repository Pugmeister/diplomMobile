import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from '../screens/home/Home';
import ProfileScreen from '../screens/profile/Profile';
import ProcedureScreen from '../screens/procedure/Procedure';
import AppointmentScreen from '../screens/appointment/Appointment';
import AuthScreen from '../screens/auth/Auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, ActivityIndicator } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ProfileStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: string = '';

                    if (route.name === 'Главная') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Услуги') {
                        iconName = focused ? 'list' : 'list-outline';
                    } else if (route.name === 'Профиль') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#3CB371',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Главная" component={HomeScreen} />
            <Tab.Screen name="Услуги" component={ProcedureScreen} />
            <Tab.Screen name="Профиль" component={ProfileStack} />
        </Tab.Navigator>
    );
};

const MainStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen
                name="Appointment"
                component={AppointmentScreen}
                options={{ 
                    headerTitle: 'Запись на приём',
                    headerBackTitle: 'Назад'
                }}
            />
        </Stack.Navigator>
    );
};

const Navigation = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem('token');
            setIsAuthenticated(!!token);
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#3CB371" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {isAuthenticated ? (
                <MainStack />
            ) : (
                <Stack.Navigator>
                    <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
                </Stack.Navigator>
            )}
        </NavigationContainer>
    );
};

export default Navigation;
