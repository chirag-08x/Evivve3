/* eslint-disable dot-notation */
import axios from 'axios';
import store from 'src/store/Store';

const apiURL = `${process.env.REACT_APP_GAMITAR_BACKEND}/api`;

export default function axiosClient(paramsToken) {
  const defaultOptions = {
    withCredentials: false,
    baseURL: apiURL,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Create instance
  const instance = axios.create(defaultOptions);

  // Set the AUTH token for any request
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    config.headers.Authorization = token || paramsToken;
    return config;
  });

  instance.interceptors.response.use(undefined, (err) => {
        const error = err.response;
        // if error is 401
        if (error.status === 401) {
            // loggedIn = false;
            // alert('session expired');
            // dispatch({
            //     type: SET_USER_LOGIN,
            //     payload: false
            // });
            // dispatch(requestLogout())
        }
        return Promise.reject(error.data)
    })

  instance.defaults.headers.common['Authorization'] =
    store.getState()?.auth?.accessToken || paramsToken;

  return instance;
}
