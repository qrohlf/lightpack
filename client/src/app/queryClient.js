import { QueryClient } from 'react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // todo bail early if error is from the API and not the network
    },
  },
})
