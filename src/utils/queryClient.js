import { QueryClient } from 'react-query';
// import ShowToast from '../components/ShowToast';

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (e) => {
        if (e.response) {
          if (e.response.data.message) {
            // ShowToast(e.response.data.message, 'error');
          }
        }
      },
    },
    queries: {
      retry: false,
      staleTime: 60 * 1000 * 5,
      cacheTime: 0,
      onError: (e) => {
        if (e.response) {
          if (e.response.data.message) {
            // ShowToast(e.response.data.message, 'error');
          }
        }
      },
    },
  },
});

export default queryClient;
