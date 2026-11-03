
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 30 * 60 * 1000,
            retry: (failureCount, error) => {
                if ([400, 401, 403, 404].includes(error?.status)) {
                    return false;
                }

                return failureCount < 2;
            },
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 0,
        },
    },
});

export default queryClient;
