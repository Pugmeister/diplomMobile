import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { getProfile, submitReview, logout } from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import * as Animatable from 'react-native-animatable';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Профиль'>;

type UserProfile = {
    id: number;
    name: string;
    email: string;
    totalOrdersAmount: number;
    appointments: AppointmentData[];
};

type AppointmentData = {
    id: number;
    date: string;
    procedure: {
        id: number;
        name: string;
        price: number;
        description: string;
        image: string;
    };
    employee: {
        id: number;
        name: string;
        email: string;
        phone: string;
        photo: string;
    };
    completed: boolean;
};

const ProfileScreen = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [review, setReview] = useState('');
    const [rating, setRating] = useState<number | undefined>(undefined);
    const [showReviewForm, setShowReviewForm] = useState<{ [key: number]: boolean }>({});
    const navigation = useNavigation<ProfileScreenNavigationProp>();

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const profileResponse = await getProfile();
                setProfile(profileResponse.data);
            } catch (error) {
                console.error("Error fetching profile data:", error);
                setError('Ошибка при загрузке данных профиля');
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            await AsyncStorage.removeItem('token');
            navigation.navigate('Auth');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const handleReviewSubmit = async (appointmentId: number, procedureId: number) => {
        if (profile?.id === undefined) {
            return;
        }

        try {
            await submitReview({ userId: profile.id, procedureId, rating: rating!, comment: review });
            setReview('');
            setRating(undefined);
            Alert.alert('Успех', 'Ваш отзыв успешно добавлен!');
            setShowReviewForm(prevState => ({
                ...prevState,
                [appointmentId]: false
            }));
        } catch (error) {
            console.error('Отзыв уже есть:');
            Alert.alert('🥰Вы уже оставили отзыв на данную услугу, большое вам спасибо🥰');
        }
    };

    const toggleReviewForm = (id: number) => {
        setShowReviewForm(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const sortAppointmentsByDate = (appointments: AppointmentData[]) => {
        return appointments.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    };

    const calculateTotalSum = (appointments: AppointmentData[]) => {
        return appointments.reduce((total, appointment) => total + appointment.procedure.price, 0);
    };

    const getLoyaltyDiscount = (totalSum: number) => {
        if (totalSum >= 200000) {
            return 20;
        } else if (totalSum >= 100000) {
            return 15;
        } else if (totalSum >= 50000) {
            return 10;
        } else {
            return 0;
        }
    };

    const totalSum = profile ? calculateTotalSum(profile.appointments) : 0;
    const discount = getLoyaltyDiscount(totalSum);

    const formatTimeWithOffset = (timeString: string) => {
        const time = new Date(timeString);
        time.setHours(time.getHours() + 3);
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Загрузка...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Animatable.Image animation="fadeInDown" source={require('../../images/home-background.jpg')} style={styles.backgroundImage} />
            <Animatable.View animation="fadeInUp" style={styles.header}>
                <Text style={styles.profileName}>{profile?.name}</Text>
                <Text style={styles.totalAmount}>Общая сумма заказов: {totalSum} ₽</Text>
                {discount > 0 && (
                    <Text style={styles.discount}>Ваша скидка: {discount}%</Text>
                )}
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Image source={require('../../images/logout.png')} style={styles.logoutIcon} />
                </TouchableOpacity>
            </Animatable.View>
            <Text style={styles.heading}>Записи</Text>
            <View style={styles.appointmentsContainer}>
                {profile?.appointments && profile.appointments.length > 0 ? (
                    sortAppointmentsByDate(profile.appointments).map(appointment => (
                        <Animatable.View animation="fadeInUp" key={appointment.id} style={styles.appointmentCard}>
                            <Text style={styles.serviceName}>Услуга: {appointment.procedure.name}</Text>
                            <Text style={styles.serviceDetail}>Стоимость: {appointment.procedure.price} ₽</Text>
                            <Text style={styles.serviceDetail}>Дата приёма: {new Date(new Date(appointment.date).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString()} {formatTimeWithOffset(appointment.date)}</Text>
                            <Text style={styles.serviceDetail}>Мастер: {appointment.employee.name}</Text>
                            {new Date(appointment.date) < new Date() && (
                                <>
                                    <Text style={styles.status}>Выполнено</Text>
                                    <TouchableOpacity onPress={() => toggleReviewForm(appointment.id)}>
                                        <Text style={styles.leaveReview}>Оставить отзыв</Text>
                                    </TouchableOpacity>
                                    {showReviewForm[appointment.id] && (
                                        <Animatable.View animation="fadeInUp" style={styles.reviewForm}>
                                            <TextInput
                                                value={review}
                                                onChangeText={setReview}
                                                placeholder="Ваш отзыв"
                                                style={styles.input}
                                                multiline
                                            />
                                            <View style={styles.ratingContainer}>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                                        <Image
                                                            source={
                                                                star <= (rating || 0)
                                                                    ? require('../../images/star-filled.png')
                                                                    : require('../../images/star.png')
                                                            }
                                                            style={styles.star}
                                                        />
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                            <TouchableOpacity 
                                                style={styles.submitButton} 
                                                onPress={() => handleReviewSubmit(appointment.id, appointment.procedure.id)}
                                            >
                                                <Text style={styles.submitButtonText}>Отправить</Text>
                                            </TouchableOpacity>
                                        </Animatable.View>
                                    )}
                                </>
                            )}
                        </Animatable.View>
                    ))
                ) : (
                    <Text style={styles.noAppointments}>Нет записей</Text>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    backgroundImage: {
        width: '100%',
        height: 100,
        resizeMode: 'cover',
    },
    header: {
        backgroundColor: '#2E8B57',
        padding: 20,
        alignItems: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginTop: -10,
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    totalAmount: {
        fontSize: 16,
        color: '#fff',
    },
    discount: {
        fontSize: 16,
        color: '#FFD700',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 20,
        textAlign: 'center',
    },
    appointmentsContainer: {
        paddingHorizontal: 20,
    },
    appointmentCard: {
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    serviceName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    serviceDetail: {
        fontSize: 16,
        marginBottom: 5,
    },
    status: {
        marginTop: 10,
        fontSize: 16,
        color: '#3CB371',
    },
    leaveReview: {
        marginTop: 10,
        color: '#3CB371',
        textDecorationLine: 'underline',
    },
    reviewForm: {
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        color: '#333',
    },
    ratingContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    star: {
        width: 30,
        height: 30,
        marginHorizontal: 5,
    },
    submitButton: {
        backgroundColor: '#3CB371',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    noAppointments: {
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 16,
        color: '#888',
    },
    logoutButton: {
        position: 'absolute',
        top: -90,
        right: 20,
        padding: 10,
        borderRadius: 50,
    },
    logoutIcon: {
        width: 24,
        height: 24,
    },
});

export default ProfileScreen;
