    import api from '../api';
    import { AxiosResponse } from 'axios';

    interface UserData {
    id: number;
    name: string;
    appointments: Appointment[];
    }

    interface Appointment {
    id: number;
    procedure: {
        name: string;
        price: number;
    };
    date: string;
    employee: {
        name: string;
    };
    }

    class UserService {
    async getProfile(): Promise<UserData> {
        const response: AxiosResponse<UserData> = await api.get('/profile');
        return response.data;
    }
    }

    export default new UserService();
