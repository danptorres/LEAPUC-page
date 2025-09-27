import React, {createContext, useState, useEffect, Children} from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        isAdmin: false,
        token: null,
    });

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setAuthState({
                    isAuthenticated: true,
                    isAdmin: decoded.is_admin || decoded.isAdmin || false,
                    token,
                });
            } catch {
                setAuthState({
                    isAuthenticated: false,
                    isAdmin: false,
                    token: false,
                });
            }
        }
    }, []);

    const login = (token) => {
        sessionStorage.setItem('token', token);
        try {
            const decoded = jwtDecode(token);
            setAuthState({
                isAuthenticated: true,
                isAdmin: decoded.is_admin || decoded.isAdmin || false,
                token,
            });
        } catch {
            setAuthState({
                isAuthenticated: false,
                isAdmin: false,
                token: null,
            })
        }
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        setAuthState({
            isAuthenticated: false,
            isAdmin: false,
            token: null,
        });
    };

    return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );

}