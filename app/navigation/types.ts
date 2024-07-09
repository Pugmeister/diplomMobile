export type ProcedureData = {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    categoryId: number;
};

export type RootStackParamList = {
    Главная: undefined;
    Услуги: undefined;
    Профиль: undefined;
    Auth: undefined;
    Appointment: { procedureData: ProcedureData, userId: number };
    MainTabs: undefined; 
};

export interface EmployeeData {
    id: number;
    name: string;
    email: string;
    phone: string;
    photo?: string;
}

export interface ScheduleData {
    id: number;
    employeeId: number;
    startTime: string;
    isBooked: boolean;
}

export interface ProfileData {
    id: number;
    name: string;
    email: string;
    phone: string;
}