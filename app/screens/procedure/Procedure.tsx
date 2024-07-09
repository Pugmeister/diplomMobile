import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList, ProcedureData } from '../../navigation/types';
import { getProcedures } from '../../api';

type ProcedureScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Услуги'>;

const ProcedureScreen = () => {
    const [procedures, setProcedures] = useState<ProcedureData[]>([]);
    const [openProcedureIds, setOpenProcedureIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigation = useNavigation<ProcedureScreenNavigationProp>();

    useEffect(() => {
        const fetchProcedures = async () => {
            try {
                const response = await getProcedures();
                const updatedData = response.data.map((item: ProcedureData) => ({
                    ...item,
                    image: require('../../images/массаж.png')
                }));
                setProcedures(updatedData);
            } catch (error) {
                setError('Ошибка при загрузке данных');
            } finally {
                setLoading(false);
            }
        };

        fetchProcedures();
    }, []);

    const handleOverlayClick = (id: number) => {
        setOpenProcedureIds(prevState =>
            prevState.includes(id) ? prevState.filter(procedureId => procedureId !== id) : [...prevState, id]
        );
    };

    const handleSelectProcedure = async (data: ProcedureData) => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (userId) {
                navigation.navigate('Appointment', { procedureData: data, userId: parseInt(userId, 10) });
            } else {
                throw new Error('User ID not found');
            }
        } catch (error) {
            console.error('Error retrieving user ID:', error);
        }
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
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                {procedures.map((data) => (
                    <TouchableOpacity key={data.id} style={styles.serviceItem} onPress={() => handleOverlayClick(data.id)}>
                        <View style={styles.contentContainer}>
                            <Image source={data.image as unknown as { uri: string }} style={styles.bgImage} />
                            <View style={[styles.overlay, openProcedureIds.includes(data.id) && styles.overlayOpen]}>
                                {openProcedureIds.includes(data.id) ? (
                                    <>
                                        <Text style={styles.name}>{data.name}</Text>
                                        <Text style={styles.description}>{data.description}</Text>
                                        <Text style={styles.price}>{data.price} ₽</Text>
                                        <TouchableOpacity
                                            style={styles.button}
                                            onPress={() => handleSelectProcedure(data)}
                                        >
                                            <Text style={styles.buttonText}>Выбрать</Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <Text style={styles.preview}>{data.name}</Text>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    scrollView: {
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    serviceItem: {
        marginBottom: 20,
        borderRadius: 10,
        overflow: 'hidden',
    },
    contentContainer: {
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#f8f8f8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    bgImage: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
    overlay: {
        padding: 15,
        backgroundColor: '#3CB371',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayOpen: {
        backgroundColor: '#238e64',
    },
    preview: {
        fontSize: 18,
        color: '#FFF',
        textAlign: 'center',
    },
    name: {
        fontSize: 20,
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 10,
    },
    price: {
        fontSize: 16,
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#3CB371',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    buttonText: {
        fontSize: 16,
        color: '#FFF',
    },
});

export default ProcedureScreen;
