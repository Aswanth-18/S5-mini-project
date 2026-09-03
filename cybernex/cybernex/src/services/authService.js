/**
 * CyberNex - Authentication Service
 *
 * Service layer for authentication operations.
 * Provides abstraction between UI and data storage.
 */

import {
  getItem,
  setItem,
  removeItem,
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  logAction
} from './storageService';
import { ROLES, DEMO_CREDENTIALS, STORAGE_KEYS } from '../utils/constants';
import {
  ADMIN_DEFAULT_PERMISSIONS,
  FACULTY_DEFAULT_PERMISSIONS,
  STUDENT_DEFAULT_PERMISSIONS
} from '../permissions/rolePermissions';

// ===== AUTH SERVICE =====
class AuthService {
  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {boolean} remember - Remember login
   * @returns {Promise<object>} - Login result
   */
  static async login(email, password, remember = false) {
    try {
      // Check demo credentials first
      const demoMatch = Object.entries(DEMO_CREDENTIALS).find(([role, creds]) =>
        creds.email === email && creds.password === password
      );

      if (demoMatch) {
        const [role, creds] = demoMatch;
        const users = await getUsers();
        const user = users.find(u => u.email === email);

        if (user) {
          // Set remember me if requested
          if (remember) {
            setItem(STORAGE_KEYS.REMEMBER_ME, true);
          }

          // Update last active
          await updateUser(user.id, { lastActive: new Date().toISOString() });

          // Log login
          logAction({
            action: 'LOGIN',
            userId: user.id,
            role: user.role,
            target: 'System',
            status: 'Success',
            details: { method: 'demo' }
          });

          return { success: true, user };
        }
      }

      // Check regular users
      const users = await getUsers();
      const user = users.find(u => u.email === email);

      if (user) {
        // In a real app, verify password hash here
        // For demo, just compare plain text
        if (user.password === password) {
          // Set remember me if requested
          if (remember) {
            setItem(STORAGE_KEYS.REMEMBER_ME, true);
          }

          // Update last active
          await updateUser(user.id, { lastActive: new Date().toISOString() });

          // Log login
          logAction({
            action: 'LOGIN',
            userId: user.id,
            role: user.role,
            target: 'System',
            status: 'Success',
            details: { method: 'credentials' }
          });

          return { success: true, user };
        }
      }

      return { success: false, error: 'Invalid email or password' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }

  /**
   * Demo login as specific role
   * @param {string} role - Role to login as
   * @returns {Promise<object>} - Login result
   */
  static async demoLogin(role) {
    const creds = DEMO_CREDENTIALS[role];
    if (!creds) {
      return { success: false, error: 'Invalid demo role' };
    }
    return this.login(creds.email, creds.password, false);
  }

  /**
   * Login as admin
   * @returns {Promise<object>} - Login result
   */
  static async loginAsAdmin() {
    return this.demoLogin(ROLES.ADMIN);
  }

  /**
   * Login as faculty
   * @returns {Promise<object>} - Login result
   */
  static async loginAsFaculty() {
    return this.demoLogin(ROLES.FACULTY);
  }

  /**
   * Login as student
   * @returns {Promise<object>} - Login result
   */
  static async loginAsStudent() {
    return this.demoLogin(ROLES.STUDENT);
  }

  /**
   * Logout current user
   * @returns {Promise<object>} - Logout result
   */
  static async logout() {
    try {
      const user = getItem(STORAGE_KEYS.USER);

      // Log logout
      if (user) {
        logAction({
          action: 'LOGOUT',
          userId: user.id,
          role: user.role,
          target: 'System',
          status: 'Success'
        });
      }

      // Clear user session
      removeItem(STORAGE_KEYS.USER);

      // Clear remember me if not set
      const rememberMe = getItem(STORAGE_KEYS.REMEMBER_ME, false);
      if (!rememberMe) {
        removeItem(STORAGE_KEYS.REMEMBER_ME);
      }

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Logout failed' };
    }
  }

  /**
   * Get current user
   * @returns {object|null} - Current user or null
   */
  static getCurrentUser() {
    return getItem(STORAGE_KEYS.USER);
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if authenticated
   */
  static isAuthenticated() {
    return !!this.getCurrentUser();
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {object|null} - User or null
   */
  static async getUserById(userId) {
    const users = await getUsers();
    return users.find(u => u.id === userId) || null;
  }

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {object|null} - User or null
   */
  static async getUserByEmail(email) {
    const users = await getUsers();
    return users.find(u => u.email === email) || null;
  }

  /**
   * Create new user
   * @param {object} userData - User data
   * @returns {Promise<object>} - Created user
   */
  static async createUser(userData) {
    try {
      const users = await getUsers();

      // Check if email already exists
      if (users.some(u => u.email === userData.email)) {
        throw new Error('Email already exists');
      }

      const newUser = {
        ...userData,
        id: `USER-${Date.now()}`,
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
        permissions: userData.role === ROLES.ADMIN ? ADMIN_DEFAULT_PERMISSIONS :
                     userData.role === ROLES.FACULTY ? FACULTY_DEFAULT_PERMISSIONS :
                     STUDENT_DEFAULT_PERMISSIONS,
        status: 'active'
      };

      await addUser(newUser);

      // Log action
      logAction({
        action: 'USER_CREATED',
        userId: userData.createdBy || 'system',
        role: ROLES.ADMIN,
        target: 'User',
        targetId: newUser.id,
        status: 'Success',
        details: { name: newUser.name, email: newUser.email, role: newUser.role }
      });

      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update user
   * @param {string} userId - User ID
   * @param {object} updates - Updates to apply
   * @returns {Promise<object>} - Updated user
   */
  static async updateUser(userId, updates) {
    try {
      const oldUser = await this.getUserById(userId);
      if (!oldUser) {
        throw new Error('User not found');
      }

      const updatedUser = await updateUser(userId, updates);

      // Log action
      logAction({
        action: 'USER_UPDATED',
        userId: updatedUser.updatedBy || 'system',
        role: ROLES.ADMIN,
        target: 'User',
        targetId: userId,
        status: 'Success',
        details: {
          oldData: { name: oldUser.name, email: oldUser.email, role: oldUser.role },
          newData: { name: updatedUser.name, email: updatedUser.email, role: updatedUser.role }
        }
      });

      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Delete user
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} - Success status
   */
  static async deleteUser(userId) {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      await deleteUser(userId);

      // Log action
      logAction({
        action: 'USER_DELETED',
        userId: user.deletedBy || 'system',
        role: ROLES.ADMIN,
        target: 'User',
        targetId: userId,
        status: 'Success',
        details: { name: user.name, email: user.email }
      });

      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Reset user password (admin only)
   * @param {string} userId - User ID
   * @param {string} newPassword - New password
   * @returns {Promise<object>} - Updated user
   */
  static async resetPassword(userId, newPassword) {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const updatedUser = await updateUser(userId, {
        password: newPassword,
        passwordResetAt: new Date().toISOString()
      });

      // Log action
      logAction({
        action: 'PASSWORD_RESET',
        userId: userId,
        role: ROLES.ADMIN,
        target: 'User',
        targetId: userId,
        status: 'Success',
        details: { email: user.email }
      });

      return updatedUser;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }

  /**
   * Change user role
   * @param {string} userId - User ID
   * @param {string} newRole - New role
   * @returns {Promise<object>} - Updated user
   */
  static async changeRole(userId, newRole) {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Update permissions based on new role
      const newPermissions = newRole === ROLES.ADMIN ? ADMIN_DEFAULT_PERMISSIONS :
                           newRole === ROLES.FACULTY ? FACULTY_DEFAULT_PERMISSIONS :
                           STUDENT_DEFAULT_PERMISSIONS;

      const updatedUser = await updateUser(userId, {
        role: newRole,
        permissions: newPermissions,
        roleChangedAt: new Date().toISOString()
      });

      // Log action
      logAction({
        action: 'ROLE_CHANGED',
        userId: userId,
        role: ROLES.ADMIN,
        target: 'User',
        targetId: userId,
        status: 'Success',
        details: { oldRole: user.role, newRole }
      });

      return updatedUser;
    } catch (error) {
      console.error('Error changing role:', error);
      throw error;
    }
  }

  /**
   * Deactivate user
   * @param {string} userId - User ID
   * @returns {Promise<object>} - Updated user
   */
  static async deactivateUser(userId) {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const updatedUser = await updateUser(userId, {
        status: 'inactive',
        deactivatedAt: new Date().toISOString()
      });

      // Log action
      logAction({
        action: 'USER_DEACTIVATED',
        userId: userId,
        role: ROLES.ADMIN,
        target: 'User',
        targetId: userId,
        status: 'Success',
        details: { email: user.email }
      });

      return updatedUser;
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  }

  /**
   * Reactivate user
   * @param {string} userId - User ID
   * @returns {Promise<object>} - Updated user
   */
  static async reactivateUser(userId) {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const updatedUser = await updateUser(userId, {
        status: 'active',
        reactivatedAt: new Date().toISOString()
      });

      // Log action
      logAction({
        action: 'USER_REACTIVATED',
        userId: userId,
        role: ROLES.ADMIN,
        target: 'User',
        targetId: userId,
        status: 'Success',
        details: { email: user.email }
      });

      return updatedUser;
    } catch (error) {
      console.error('Error reactivating user:', error);
      throw error;
    }
  }

  /**
   * Get all users
   * @returns {Promise<Array>} - Array of users
   */
  static async getAllUsers() {
    return await getUsers();
  }

  /**
   * Get users by role
   * @param {string} role - Role to filter by
   * @returns {Promise<Array>} - Array of users with the role
   */
  static async getUsersByRole(role) {
    const users = await getUsers();
    return users.filter(u => u.role === role);
  }

  /**
   * Get users by department
   * @param {string} department - Department to filter by
   * @returns {Promise<Array>} - Array of users in the department
   */
  static async getUsersByDepartment(department) {
    const users = await getUsers();
    return users.filter(u => u.department === department);
  }

  /**
   * Search users
   * @param {string} query - Search query
   * @returns {Promise<Array>} - Array of matching users
   */
  static async searchUsers(query) {
    const users = await getUsers();
    const lowerQuery = query.toLowerCase();

    return users.filter(u =>
      u.name.toLowerCase().includes(lowerQuery) ||
      u.email.toLowerCase().includes(lowerQuery) ||
      (u.department && u.department.toLowerCase().includes(lowerQuery)) ||
      u.id.toLowerCase().includes(lowerQuery)
    );
  }
}

// ===== EXPORT =====
export default AuthService;