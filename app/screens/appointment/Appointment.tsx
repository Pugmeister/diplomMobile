import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/core';
import { RootStackParamList } from '../../navigation/types';
import { getEmployees, getSchedulesByEmployee, createAppointment } from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AppointmentScreenRouteProp = RouteProp<RootStackParamList, 'Appointment'>;

type Employee = {
    id: number;
    name: string;
};

type ScheduleSlot = {
    id: number;
    startTime: string;
    isBooked: boolean;
};

const AppointmentScreen = () => {
    const route = useRoute<AppointmentScreenRouteProp>();
    const { procedureData, userId } = route.params;

    const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [schedule, setSchedule] = useState<ScheduleSlot[]>([]);
    const [date, setDate] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        const fetchEmployees = async () => {
            const response = await getEmployees();
            setEmployees(response.data);
        };

        fetchEmployees();
    }, []);

    useEffect(() => {
        if (selectedEmployee !== null) {
            const fetchSchedule = async () => {
                const response = await getSchedulesByEmployee(selectedEmployee, date.toISOString().split('T')[0]);
                setSchedule(response.data);
            };

            fetchSchedule();
        }
    }, [selectedEmployee, date]);

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };

    const handleConfirmAppointment = async () => {
        if (!selectedEmployee || !selectedTime) {
            Alert.alert('Ошибка', 'Выберите доступное время и сотрудника');
            return;
        }

        const userId = await AsyncStorage.getItem('userId');

        if (!userId) {
            Alert.alert('Ошибка', 'Пользователь не найден');
            return;
        }

        console.log('Selected time:', selectedTime);

        const appointmentDate = new Date(selectedTime);
        if (isNaN(appointmentDate.getTime())) {
            Alert.alert('Ошибка', 'Некорректное время');
            console.error('Invalid time format:', selectedTime);
            return;
        }

        appointmentDate.setHours(appointmentDate.getHours() + 3);

        const appointmentData = {
            userId: parseInt(userId, 10),
            procedureId: procedureData.id,
            employeeId: selectedEmployee,
            date: appointmentDate.toISOString(),
        };

        console.log('Appointment data:', appointmentData);

        try {
            await createAppointment(appointmentData);
            Alert.alert('Успех', 'Запись успешно подтверждена');
        } catch (error) {
            console.error('Failed to create appointment:', error);
            Alert.alert('Ошибка', 'Не удалось создать запись');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.procedureCard}>
                <Text style={styles.procedureName}>{procedureData.name}</Text>
                <Text style={styles.procedurePrice}>{procedureData.price} ₽</Text>
            </View>
            <Text style={styles.label}>Выберите сотрудника:</Text>
            <View style={styles.employeesContainer}>
                {employees.map((employee) => (
                    <TouchableOpacity
                        key={employee.id}
                        style={[
                            styles.employeeItem,
                            selectedEmployee === employee.id && styles.selectedEmployeeItem,
                        ]}
                        onPress={() => setSelectedEmployee(employee.id)}
                    >
                        <Text style={styles.employeeName}>{employee.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Text style={styles.label}>Выберите дату:</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
                <Text style={styles.dateText}>{date.toLocaleDateString('ru-RU')}</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}
            <Text style={styles.label}>Доступное время:</Text>
            <View style={styles.scheduleContainer}>
                {schedule.map((slot) => (
                    <TouchableOpacity
                        key={slot.id}
                        style={[
                            styles.scheduleItem,
                            slot.isBooked && styles.bookedScheduleItem,
                            selectedTime === slot.startTime && styles.selectedScheduleItem,
                        ]}
                        onPress={() => !slot.isBooked && setSelectedTime(slot.startTime)}
                    >
                        <Text style={styles.scheduleTime}>
                            {new Date(new Date(slot.startTime).setHours(new Date(slot.startTime).getHours() + 3)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmAppointment}>
                <Text style={styles.confirmButtonText}>Записаться</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    procedureCard: {
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    procedureName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    procedurePrice: {
        fontSize: 20,
        color: '#3CB371',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    employeesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    employeeItem: {
        backgroundColor: '#f8f8f8',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        width: '48%',
        alignItems: 'center',
    },
    selectedEmployeeItem: {
        backgroundColor: '#3CB371',
    },
    employeeName: {
        fontSize: 16,
        color: '#333',
    },
    datePicker: {
        backgroundColor: '#f8f8f8',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    dateText: {
        fontSize: 16,
        color: '#333',
    },
    scheduleContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    scheduleItem: {
        backgroundColor: '#f8f8f8',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        width: '48%',
        alignItems: 'center',
    },
    bookedScheduleItem: {
        backgroundColor: '#d3d3d3',
    },
    selectedScheduleItem: {
        borderWidth: 2,
        borderColor: '#3CB371',
    },
    scheduleTime: {
        fontSize: 16,
        color: '#333',
    },
    confirmButton: {
        backgroundColor: '#3CB371',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 20,
        width: '100%',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default AppointmentScreen;
