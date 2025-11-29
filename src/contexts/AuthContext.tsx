// context/AuthContext.tsx
import React, { createContext, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export interface User {
    id: string;
    email: string;
    role: string;
}

export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Bỏ hàm checkTokenExpiration vì không thể đọc HttpOnly token
/*
interface CustomJwtPayload extends JwtPayload {
    id: string;
    email: string;
}
const checkTokenExpiration = (token: string | undefined): boolean => { ... };
*/

// const TOKEN_COOKIE_NAME = 'tokenUser'; // Không cần đọc token này nữa
const USER_DATA_COOKIE_NAME = 'userData'; // Chỉ cần cookie này

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const BASE_URL = import.meta.env.BACKEND_URL || 'https://clinic-system-backend-virid.vercel.app';

    // Hàm khôi phục trạng thái từ Cookie
    const getInitialAuthState = () => {
        // const tokenFromCookie = Cookies.get(TOKEN_COOKIE_NAME) || null; // BỎ
        const userJsonFromCookie = Cookies.get(USER_DATA_COOKIE_NAME);
        const userFromCookie = userJsonFromCookie ? JSON.parse(userJsonFromCookie) : null;

        // CHỈ CẦN KIỂM TRA userFromCookie
        if (userFromCookie) {
            // Giả định nếu có user cookie thì cũng có HttpOnly token
            return {
                user: userFromCookie as User,
            };
        }

        Cookies.remove(USER_DATA_COOKIE_NAME, { path: '/' });
        return {
            user: null,
        };
    };

    const { user: initialUser } = getInitialAuthState();

    const [user, setUser] = useState<User | null>(initialUser);
    // const [token, setToken] = useState<string | null>(initialToken); // BỎ
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Hàm thực hiện Logout - Gọi API và Xóa trạng thái
    const handleLogout = useCallback(async () => {
        setIsLoading(true);
        try {
            await axios.get(`${BASE_URL}/accounts/logout`, {
                withCredentials: true,
            });
            console.log("Đã gọi API logout thành công.");
        } catch (error) {
            console.error('Lỗi khi gọi API logout:', error);
        } finally {
            setUser(null);
            // setToken(null); // BỎ
            // Quan trọng: Xóa cookie user data khi logout
            Cookies.remove(USER_DATA_COOKIE_NAME, { path: '/' });
            setIsLoading(false);
        }
    }, [BASE_URL]);

    // Bỏ useEffect kiểm tra hết hạn
    /*
    useEffect(() => {
        if (token && checkTokenExpiration(token)) {
            handleLogout();
        }
    }, [token, handleLogout]);
    */

    // --- Hàm Login ---

    const login = useCallback(async (email: string, password: string) => {
        try {
            setIsLoading(true);
            const response = await axios.post(`${BASE_URL}/accounts/login`, {
                email,
                password,
            }, {
                withCredentials: true
            });

            if (response.data.message === 'Đăng nhập thành công!') {
                const { user: userDataFromApi } = response.data;

                // THAY ĐỔI ĐIỀU KIỆN KIỂM TRA: Chỉ cần kiểm tra user data từ body
                if (!userDataFromApi || !userDataFromApi.id || !userDataFromApi.email) {
                    throw new Error('Đăng nhập thành công nhưng API không trả về dữ liệu user.');
                }

                const userObject: User = {
                    id: userDataFromApi.id,
                    email: userDataFromApi.email,
                    role: userDataFromApi.role
                };

                // THÊM LẠI: Tự set cookie userData để duy trì đăng nhập khi tải lại trang
                // Backend chỉ set tokenUser, không set userData
                Cookies.set(USER_DATA_COOKIE_NAME, JSON.stringify(userObject), {
                    expires: 7, // Set thời hạn cho cookie này
                    path: '/'
                });

                // Cập nhật trạng thái client
                setUser(userObject);
                // setToken('token_is_httponly'); // Bỏ, không cần thiết

                // Bỏ kiểm tra hết hạn token

            } else {
                throw new Error(response.data.message || 'Đăng nhập thất bại');
            }
        } catch (err: any) {
            console.error('Lỗi đăng nhập:', err);
            // Nếu là lỗi từ axios, ưu tiên lấy message trả về từ backend
            let message = 'Lỗi đăng nhập';
            if (axios.isAxiosError && axios.isAxiosError(err)) {
                const resp = err.response as any;
                if (resp && resp.data) {
                    const data = resp.data;
                    if (typeof data === 'object' && data.message) {
                        message = String(data.message);
                    } else if (typeof data === 'string') {
                        message = data;
                    }
                } else if (err.message) {
                    message = err.message;
                }
            } else if (err instanceof Error && err.message) {
                message = err.message;
            }

            // Ném Error mới với thông điệp rõ ràng để component gọi login có thể hiển thị
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, [BASE_URL /*, handleLogout*/]); // Bỏ handleLogout khỏi dependency

    // --- Hàm Logout ---

    const logout = useCallback(async () => {
        await handleLogout();
    }, [handleLogout]);

    // Giá trị cung cấp cho Context
    const value = useMemo(
        () => ({
            user,
            // token: null, // Bỏ token
            login,
            logout,
            isLoading,
            // isAuthenticated giờ chỉ phụ thuộc vào 'user'
            isAuthenticated: !!user
        }),
        [user, login, logout, isLoading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- Custom hook để sử dụng AuthContext ---

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
