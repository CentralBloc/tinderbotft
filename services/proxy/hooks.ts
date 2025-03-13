
// -------QUERY & MUTATION KEYS------- //

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    addProxy,
    createProxyCredentials,
    getAllProxies,
    getProxyById,
    removeProxy,
    rotateProxy,
    testProxy,
    updateProxy
} from "@/services/proxy/queries";

export const proxyQueryKeys = {
    proxiesKey: ["proxies-list"],
    proxyKey: (id: string) => ["proxy", id],
    addProxyKey: ["add-proxy"],
    updateProxyKey: (id: string) => ["update-proxy", id],
    removeProxyKey: (id: string) => ["remove-proxy", id],
    testProxy: (id: string) => ["test-proxy", id],
    rotateProxy: (id: string) => ["rotate-proxy", id],
}

// --------------- QUERIES HOOKS --------------- //
export const useProxies = () => {
    return useQuery({
        queryKey: proxyQueryKeys.proxiesKey,
        queryFn: () => getAllProxies(),
    });
};

export const useProxy = (id: string) => {
    return useQuery({
        queryKey: proxyQueryKeys.proxyKey(id),
        queryFn: () => getProxyById(id),
    });
};



// --------------- MUTATIONS HOOKS --------------- //

export const useAddProxy = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: proxyQueryKeys.addProxyKey,
        mutationFn: (credentials: createProxyCredentials) => addProxy(credentials),
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: proxyQueryKeys.proxiesKey,
            });
        },
    });
};

export const useUpdateProxy = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: createProxyCredentials) => updateProxy(id, credentials),
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: proxyQueryKeys.proxiesKey,
            });
            queryClient.invalidateQueries({
                queryKey: proxyQueryKeys.proxyKey(id),
            });
        },
    });
};

export const useRemoveProxy = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => removeProxy(id),
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: proxyQueryKeys.proxiesKey,
            });
        },
    });
};

export const useTestProxy = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => testProxy(id),
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: proxyQueryKeys.proxiesKey,
            });
        },
    });
}

export const useRotateProxy = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => rotateProxy(id),
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: proxyQueryKeys.proxiesKey,
            });
        },
    });
};