import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLES, DEMO_CREDENTIALS, STORAGE_KEYS } from '../utils/constants';
import { getItem, setItem, removeItem, logAction } from '../services/storageService';
import { ADMIN_DEFAULT_PERMISSIONS, FACULTY_DEFAULT_PERMISSIONS, STUDENT_DEFAULT_PERMISSIONS } from '../permissions/rolePermissions';
import { getAllPermissionsForUser } from '../permissions/rolePermissions';
import { useLocalStorage } from '../hooks/useLocalStorage';

// ===== CREATE CONTEXT =====
const AuthContext = createContext(null);

// ===== PROVIDER COMPONENT =====
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rememberMe, setRememberMe] = useLocalStorage(STORAGE_KEYS.REMEMBER_ME, false);
  const navigate = useNavigate();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = getItem(STORAGE_KEYS.USER);
        if (storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Persist user to localStorage when it changes
  useEffect(() => {
    if (user) {
      setItem(STORAGE_KEYS.USER, user);
      // Log login action
      logAction({
        action: 'LOGIN',
        userId: user.id,
        role: user.role,
        target: 'System',
        status: 'Success',
        details: { method: 'localStorage' }
      });
    } else {
      removeItem(STORAGE_KEYS.USER);
    }
  }, [user]);

  // ===== LOGIN FUNCTION =====
  const login = useCallback(async (email, password, remember = false) => {
    setIsLoading(true);

    try {
      // Check demo credentials first
      const demoUser = Object.entries(DEMO_CREDENTIALS).find(([role, creds]) =>
        creds.email === email && creds.password === password
      );

      if (demoUser) {
        const [role, creds] = demoUser;
        const userData = getItem(STORAGE_KEYS.USERS, []).find(u => u.email === email);

        if (userData) {
          // Use existing user data
          const userToSet = {
            ...userData,
            // Ensure permissions are set
            permissions: userData.permissions ||
              (role === ROLES.ADMIN ? ADMIN_DEFAULT_PERMISSIONS :
               role === ROLES.FACULTY ? FACULTY_DEFAULT_PERMISSIONS :
               STUDENT_DEFAULT_PERMISSIONS)
          };

          setUser(userToSet);
          setIsAuthenticated(true);
          setRememberMe(remember);

          // Log action
          logAction({
            action: 'LOGIN',
            userId: userToSet.id,
            role: userToSet.role,
            target: 'System',
            status: 'Success',
            details: { method: 'demo' }
          });

          // Redirect based on role
          const redirectPath = userToSet.role === ROLES.ADMIN ? '/admin/dashboard' :
                               userToSet.role === ROLES.FACULTY ? '/faculty/dashboard' :
                               '/student/dashboard';

          navigate(redirectPath);
          setIsLoading(false);
          return { success: true, user: userToSet };
        }
      }

      // Check regular users
      const users = getItem(STORAGE_KEYS.USERS, []);
      const user = users.find(u => u.email === email);

      if (user) {
        // In a real app, you would verify the password hash here
        // For this frontend-only version, we'll just check if passwords match
        // Note: This is NOT secure for production - just for demo purposes
        if (user.password === password) {
          setUser(user);
          setIsAuthenticated(true);
          setRememberMe(remember);

          // Log action
          logAction({
            action: 'LOGIN',
            userId: user.id,
            role: user.role,
            target: 'System',
            status: 'Success',
            details: { method: 'credentials' }
          });

          // Redirect based on role
          const redirectPath = user.role === ROLES.ADMIN ? '/admin/dashboard' :
                               user.role === ROLES.FACULTY ? '/faculty/dashboard' :
                               '/student/dashboard';

          navigate(redirectPath);
          setIsLoading(false);
          return { success: true, user };
        } else {
          setIsLoading(false);
          return { success: false, error: 'Invalid email or password' };
        }
      }

      setIsLoading(false);
      return { success: false, error: 'Invalid email or password' };
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }, [navigate, rememberMe, setRememberMe]);

  // ===== LOGOUT FUNCTION =====
  const logout = useCallback(() => {
    try {
      // Log action before clearing
      if (user) {
        logAction({
          action: 'LOGOUT',
          userId: user.id,
          role: user.role,
          target: 'System',
          status: 'Success'
        });
      }

      setUser(null);
      setIsAuthenticated(false);
      removeItem(STORAGE_KEYS.USER);

      // Only clear remember me if not set
      if (!rememberMe) {
        setRememberMe(false);
      }

      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [user, navigate, rememberMe, setRememberMe]);

  // ===== DEMO LOGIN FUNCTIONS =====
  const demoLogin = useCallback((role) => {
    const creds = DEMO_CREDENTIALS[role];
    if (creds) {
      return login(creds.email, creds.password, false);
    }
    return { success: false, error: 'Invalid demo role' };
  }, [login]);

  const loginAsAdmin = useCallback(() => demoLogin(ROLES.ADMIN), [demoLogin]);
  const loginAsFaculty = useCallback(() => demoLogin(ROLES.FACULTY), [demoLogin]);
  const loginAsStudent = useCallback(() => demoLogin(ROLES.STUDENT), [demoLogin]);

  // ===== PERMISSION CHECKS =====
  const hasPermission = useCallback((permission) => {
    if (!user) return false;

    // Check user's permissions
    const allPermissions = getAllPermissionsForUser(user.role, user.permissions || []);
    return allPermissions.includes(permission);
  }, [user]);

  const hasAllPermissions = useCallback((permissions) => {
    if (!user) return false;

    const permissionsArray = Array.isArray(permissions) ? permissions : [permissions];
    return permissionsArray.every(p => hasPermission(p));
  }, [user, hasPermission]);

  const hasAnyPermission = useCallback((permissions) => {
    if (!user) return false;

    const permissionsArray = Array.isArray(permissions) ? permissions : [permissions];
    return permissionsArray.some(p => hasPermission(p));
  }, [user, hasPermission]);

  const getAllUserPermissions = useCallback(() => {
    if (!user) return [];
    return getAllPermissionsForUser(user.role, user.permissions || []);
  }, [user]);

  // ===== ROLE CHECKS =====
  const isAdmin = useCallback(() => user?.role === ROLES.ADMIN, [user]);
  const isFaculty = useCallback(() => user?.role === ROLES.FACULTY, [user]);
  const isStudent = useCallback(() => user?.role === ROLES.STUDENT, [user]);

  const hasRole = useCallback((roles) => {
    if (!user) return false;
    const rolesArray = Array.isArray(roles) ? roles : [roles];
    return rolesArray.includes(user.role);
  }, [user]);

  // ===== USER PROPERTIES =====
  const getUserId = useCallback(() => user?.id, [user]);
  const getUserEmail = useCallback(() => user?.email, [user]);
  const getUserName = useCallback(() => user?.name, [user]);
  const getUserLevel = useCallback(() => user?.level || 1, [user]);
  const getUserDepartment = useCallback(() => user?.department, [user]);

  // ===== VALUE =====
  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    rememberMe,

    // Authentication functions
    login,
    logout,
    demoLogin,
    loginAsAdmin,
    loginAsFaculty,
    loginAsStudent,

    // Permission functions
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    getAllUserPermissions,

    // Role functions
    isAdmin,
    isFaculty,
    isStudent,
    hasRole,

    // User property getters
    getUserId,
    getUserEmail,
    getUserName,
    getUserLevel,
    getUserDepartment,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ===== CUSTOM HOOK =====
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ===== EXPORT =====
export default AuthContext;
export { AuthProvider, useAuth };