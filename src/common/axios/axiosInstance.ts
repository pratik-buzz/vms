import axios, { AxiosHeaders } from 'axios'

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 30000, // You can adjust the timeout as needed
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    // withCredentials: true,
})

// Optionally, you can add interceptors
axiosInstance.interceptors.request.use(
    (config) => {
        // Ensure headers is defined
        if (!config.headers) {
            config.headers = {} as AxiosHeaders
        }

        // Return the modified config
        // Modify the request config before sending it
        // For example, you can add authorization tokens here
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

axiosInstance.interceptors.response.use(
    (response) => {
        // Handle successful response
        return response
    },
    (error) => {
        // Handle error response
        return Promise.reject(error)
    },
)

export default axiosInstance
