// import { User } from 'firebase/auth'
// import { onAuthStateChanged } from 'firebase/auth'
import axiosInstance from './axiosInstance'
// import { auth } from '../../components/Firebase'
import { addController, cancelAllControllers } from './cancelControllers'

export interface ApiResponse<T> {
    data: T
    code: number
    message: string
}

export const Get = async <T>(
    url: string,
    params?: Record<string, any>,
    headers?: Record<string, string>,
): Promise<ApiResponse<T>> => {
    try {
        const response = await axiosInstance.get<T>(url, { params, headers })
        return {
            data: response.data,
            code: response.status,
            message: response.statusText,
        }
    } catch (error) {
        throw error
    }
}

export const Post = async <T, B = any>(
    url: string,
    body: B,
    headers?: Record<string, string>,
): Promise<ApiResponse<T>> => {
    try {
        const response = await axiosInstance.post<T>(url, body, {
            headers: {
                ...headers,
                'Content-Type': headers?.['Content-Type'] || 'application/json', // Default to JSON
            },
        })
        return {
            data: response.data,
            code: response.status,
            message: response.statusText,
        }
    } catch (error) {
        throw error
    }
}


export const Delete = async <T>(
    url: string,
    headers?: Record<string, string>,
): Promise<ApiResponse<T>> => {
    const controller = new AbortController();
    addController(controller);
    try {
        const response = await axiosInstance.delete<T>(url, {
            headers: {
                ...headers,
                'Content-Type': headers?.['Content-Type'] || 'application/json', // Default to JSON
            },
            signal: controller.signal,
        })
        return {
            data: response.data,
            code: response.status,
            message: response.statusText,
        }
    } catch (error: any) {
        if (error.response && error.response.status === 440) {
            cancelAllControllers();// Cancel all pending API calls
            // showAlert(error?.response?.data?.error?.msg);
        }
        throw error
    }
}

export const PostWithToken = async <T, B = any>(
    url: string,
    body: B,
    headers?: Record<string, string>,
): Promise<ApiResponse<T>> => {
    const controller = new AbortController();
    addController(controller);
    try {
        // const currentUser = auth.currentUser;
        // const token = currentUser ? await currentUser.getIdToken() : '';
        // const sessionId = localStorage.getItem("sessionId");

        // Create auth headers
        const authHeaders: Record<string, string> = {};

        // Add token to headers if it exists
        // if (token) {
        // authHeaders['Authorization'] = `Bearer ${token}`;

        // Add sessionId to headers if it exists and token is present
        // if (sessionId) {
        //     try {
        //         const parsedSessionId = JSON.parse(sessionId);
        //         authHeaders['sessionid'] = parsedSessionId;
        //     } catch (e) {
        //         console.error('Error parsing sessionId:', e);
        //     }
        // }
        // }

        const response = await axiosInstance.post<T>(url, body, {
            headers: {
                ...headers,
                'Content-Type': headers?.['Content-Type'] || 'application/json',
                ...authHeaders,
            },
            signal: controller.signal,
        });

        return {
            data: response.data,
            code: response.status,
            message: response.statusText,
        };
    } catch (error: any) {
        if (error.response && error.response.status === 440) {
            cancelAllControllers();// Cancel all pending API calls
            // showAlert(error?.response?.data?.error?.msg);
        }
        if (error.code === 'ECONNABORTED') {
            throw new Error('Request timed out. Please try again.');
        }
        throw error; // Re-throw the error for error handling
    }
};

export const PostWithFormData = async <T, B = any>(
    url: string,
    body: B,
    headers?: Record<string, string>,
): Promise<ApiResponse<T>> => {
    const controller = new AbortController();
    addController(controller);
    try {
        const isFormData = body instanceof FormData;

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: {
                ...(isFormData
                    ? {} // Let the browser set the Content-Type for FormData
                    : { 'Content-Type': headers?.['Content-Type'] || 'application/json' }), // Default to JSON
                ...(headers || {}),
            },
            signal: controller.signal,
            body: isFormData ? body : JSON.stringify(body),
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, requestOptions);
        const responseData = await response.json();

        return {
            data: responseData,
            code: response.status,
            message: response.statusText,
        };
    } catch (error: any) {
        if (error.response && error.response.status === 440) {
            cancelAllControllers();// Cancel all pending API calls
            // showAlert(error?.response?.data?.error?.msg);
        }
        throw error; // Re-throw the error for error handling
    }
};

export const PostWithTokenFormData = async <T, B = any>(
    url: string,
    body: B,
    headers?: Record<string, string>,
): Promise<ApiResponse<T>> => {
    const controller = new AbortController();
    addController(controller);
    try {
        // const currentUser = auth.currentUser;
        // const token = currentUser ? await currentUser.getIdToken() : '';
        // const sessionId = localStorage.getItem("sessionId");

        // Create auth headers
        const authHeaders: Record<string, string> = {};

        // Add token to headers if it exists
        // if (token) {
        // authHeaders['Authorization'] = `Bearer ${token}`;

        // Add sessionId to headers if it exists and token is present
        // if (sessionId) {
        //     try {
        //         const parsedSessionId = JSON.parse(sessionId);
        //         authHeaders['sessionid'] = parsedSessionId;
        //     } catch (e) {
        //         console.error('Error parsing sessionId:', e);
        //     }
        // }
        // }


        const isFormData = body instanceof FormData;

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: {
                ...(isFormData
                    ? {} // Let the browser set the Content-Type for FormData
                    : { 'Content-Type': headers?.['Content-Type'] || 'application/json' }), // Default to JSON
                ...(headers || {}),
                ...authHeaders,
            },
            signal: controller.signal,
            body: isFormData ? body : JSON.stringify(body),
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, requestOptions);
        const responseData = await response.json();

        return {
            data: responseData,
            code: response.status,
            message: response.statusText,
        };
    } catch (error: any) {
        if (error.response && error.response.status === 440) {
            cancelAllControllers();// Cancel all pending API calls
            // showAlert(error?.response?.data?.error?.msg);
        }
        throw error; // Re-throw the error for error handling
    }
};

export const GetWithToken = async <T>(
    url: string,
    params?: Record<string, any>,
    headers?: Record<string, string>,
): Promise<ApiResponse<T>> => {
    const controller = new AbortController();
    addController(controller);
    try {
        // const token = await getCurrentUserToken();
        // const sessionId = localStorage.getItem("sessionId");
        const authHeaders: Record<string, string> = {};

        // if (token) {
        // authHeaders['Authorization'] = `Bearer ${token}`;

        // Add sessionId to headers if it exists and token is present
        // if (sessionId) {
        //     try {
        //         const parsedSessionId = JSON.parse(sessionId);
        //         authHeaders['sessionid'] = parsedSessionId;
        //     } catch (e) {
        //         console.error('Error parsing sessionId:', e);
        //     }
        // }
        // }
        const response = await axiosInstance.get<T>(url, {
            params,
            headers: {
                ...headers,
                'Content-Type': headers?.['Content-Type'] || 'application/json', // Default to JSON
                ...authHeaders,
            },
            signal: controller.signal,
        });
        return {
            data: response.data,
            code: response.status,
            message: response.statusText,
        }
    } catch (error: any) {
        if (error.response && error.response.status === 440) {
            cancelAllControllers();// Cancel all pending API calls
            // showAlert(error?.response?.data?.error?.msg);
        }
        throw error
    }
}

export const Patch = async <T, B = any>(
    url: string,
    body: B,
    headers?: Record<string, string>,
): Promise<ApiResponse<T>> => {
    const controller = new AbortController();
    addController(controller);
    try {
        const response = await axiosInstance.patch<T>(url, body, {
            headers: {
                ...headers,
                'Content-Type': headers?.['Content-Type'] || 'application/json', // Default to JSON
            },
            signal: controller.signal,
        })
        return {
            data: response.data,
            code: response.status,
            message: response.statusText,
        }
    } catch (error: any) {
        if (error.response && error.response.status === 440) {
            cancelAllControllers();// Cancel all pending API calls
            // showAlert(error?.response?.data?.error?.msg);
        }
        throw error
    }
}

export const Put = async <T, B = any>(
    url: string,
    body: B,
    headers?: Record<string, string>,
): Promise<ApiResponse<T>> => {
    const controller = new AbortController();
    addController(controller);
    try {
        const response = await axiosInstance.put<T>(url, body, {
            headers: {
                ...headers,
                'Content-Type': headers?.['Content-Type'] || 'application/json', // Default to JSON
            },
            signal: controller.signal,
        })
        return {
            data: response.data,
            code: response.status,
            message: response.statusText,
        }
    } catch (error: any) {
        if (error.response && error.response.status === 440) {
            cancelAllControllers();// Cancel all pending API calls
            // showAlert(error?.response?.data?.error?.msg);
        }
        throw error
    }
}




export const getCurrentUserToken = (): Promise<string | null> => {
    return new Promise((resolve) => {
        // const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
        // unsubscribe();
        // if (user) {
        // try {
        //     const token = await user.getIdToken();
        //     resolve(token);
        // } catch (err) {
        // console.error("Failed to get ID token", err);
        // resolve(null);
        // }
        // } else {
        // resolve(null);
        // }
        // });
    });
};