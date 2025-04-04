import axios from '@/lib/axios';

export const getAccountLogs = async (accountId: string) => {
    try {
        const response = await axios.get(`/get-account-swipe-session/${accountId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching account logs:", error);
        throw error;
    }
}

export const getSessionLogs = async (accountId: string, sessionId: string) => {
    try {
        const response = await axios.get(`/get-session-swipe-session${sessionId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching session logs:", error);
        throw error;
    }
}