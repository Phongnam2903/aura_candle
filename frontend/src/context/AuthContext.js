import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user từ localStorage khi app khởi động
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedRole && storedUser) {
            setToken(storedToken);
            setRole(storedRole);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Login function
    const login = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        setRole(userData.role);
        localStorage.setItem('token', userToken);
        localStorage.setItem('role', userData.role);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // Logout function
    const logout = () => {
        setUser(null);
        setToken(null);
        setRole(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return !!token && !!user;
    };

    // Check if user has specific role
    const hasRole = (requiredRole) => {
        return role === requiredRole;
    };

    // Check if user has any of the roles
    const hasAnyRole = (requiredRoles) => {
        return requiredRoles.includes(role);
    };

    const value = {
        user,
        token,
        role,
        loading,
        login,
        logout,
        isAuthenticated,
        hasRole,
        hasAnyRole,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

