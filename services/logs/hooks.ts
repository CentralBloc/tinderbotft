import {useQuery} from "@tanstack/react-query";
import {getSessionLogs} from "@/services/logs/queries";


export const logHooksKey = {
    getAccountLogs: ["getAccountLogs"],
    getSessionLogs: ["getSessionLogs"],
}

export const useSessionLogsHooks =  (accountId: string, sessionId: string) => {
    return useQuery({
        queryKey: [logHooksKey.getSessionLogs],
        queryFn: () => getSessionLogs(accountId, sessionId),
        enabled: !!accountId && !!sessionId, // Only run the query if both accountId and sessionId are provided
    })
}

export const useAccountLogsHooks = (accountId: string) => {
    return useQuery({
        queryKey: [logHooksKey.getAccountLogs, accountId],
        queryFn: () => getSessionLogs(accountId, ""),
        enabled: !!accountId,
    });
};