import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType>({
  isDark: true,
  toggleTheme: () => {},
});

export const AdminThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('earnx_admin_theme');
    return saved !== null ? saved === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('earnx_admin_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <AdminThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </AdminThemeContext.Provider>
  );
};

export const useAdminTheme = () => useContext(AdminThemeContext);
