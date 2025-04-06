import {useQuery} from "@tanstack/react-query";
import {getSessionLogs} from "@/services/logs/queries";


export const logHoksKey = {
    getAccountLogs: ["getAccountLogs"],
    getSessionLogs: ["getSessionLogs"],
}

export const useSessionLogsHooks =  (accountId: string, sessionId: string) => {
    return useQuery({
        queryKey: [logHoksKey.getSessionLogs],
        queryFn: () => getSessionLogs(accountId, sessionId),
        enabled: !!accountId && !!sessionId, // Only run the query if both accountId and sessionId are provided
    })
}

export const useAccountLogsHooks = (accountId: string) => {
    return useQuery({
        queryKey: [logHoksKey.getAccountLogs, accountId],
        queryFn: () => getSessionLogs(accountId, ""), // Assuming "" fetches all logs for the account
        enabled: !!accountId, // Only run the query if accountId is provided
    });
};