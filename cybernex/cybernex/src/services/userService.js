/**
 * CyberNex - User Service
 *
 * Service layer for user management operations.
 * Provides business logic and data access for users.
 */

import {
  getUsers, setUsers, addUser, updateUser, deleteUser,
  getFaculty, addFaculty, updateFaculty, deleteFaculty,
  getStudentGroups, addStudentGroup, updateStudentGroup, deleteStudentGroup,
  getRestrictions, addRestriction, updateRestriction, deleteRestriction,
  getStudentProgress, updateStudentProgress,
  logAction
} from './storageService';
import { ROLES, ATTENDANCE_STATUSES, RESTRICTION_TYPES } from '../utils/constants';
import {
  ADMIN_DEFAULT_PERMISSIONS,
  FACULTY_DEFAULT_PERMISSIONS,
  STUDENT_DEFAULT_PERMISSIONS
} from '../permissions/rolePermissions';
import AuthService from './authService';

// ===== USER SERVICE =====
class UserService {
  /**
   * Get all users
   * @param {object} options - Filter options
   * @param {string} options.role - Filter by role
   * @param {string} options.department - Filter by department
   * @param {string} options.status - Filter by status
   * @param {string} options.search - Search query
   * @returns {Promise<Array>} - Array of users
   */
  static async getAllUsers(options = {}) {
    try {
      let users = await getUsers();

      // Apply filters
      if (options.role) {
        users = users.filter(u => u.role === options.role);
      }

      if (options.department) {
        users = users.filter(u => u.department === options.department);
      }

      if (options.status) {
        users = users.filter(u => u.status === options.status);
      }

      if (options.search) {
        const query = options.search.toLowerCase();
        users = users.filter(u =>
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query) ||
          (u.department && u.department.toLowerCase().includes(query)) ||
          u.id.toLowerCase().includes(query)
        );
      }

      return users;
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<object|null>} - User or null
   */
  static async getUserById(userId) {
    try {
      const users = await getUsers();
      return users.find(u => u.id === userId) || null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise<object|null>} - User or null
   */
  static async getUserByEmail(email) {
    try {
      const users = await getUsers();
      return users.find(u => u.email === email) || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  /**
   * Create a new user
   * @param {object} userData - User data
   * @param {string} createdBy - ID of user creating this user
   * @returns {Promise<object>} - Created user
   */
  static async createUser(userData, createdBy = null) {
    try {
      const users = await getUsers();

      // Validate required fields
      if (!userData.name || !userData.email || !userData.role) {
        throw new Error('Name, email, and role are required');
      }

      // Check if email already exists
      if (users.some(u => u.email === userData.email)) {
        throw new Error('Email already exists');
      }

      // Set default values
      const newUser = {
        id: `USER-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        password: userData.password || 'tempPassword', // In real app, hash this
        role: userData.role,
        department: userData.department || 'General',
        level: userData.level || (userData.role === ROLES.ADMIN ? 12 : 1),
        status: userData.status || 'active',
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
        permissions: userData.permissions ||
          (userData.role === ROLES.ADMIN ? ADMIN_DEFAULT_PERMISSIONS :
           userData.role === ROLES.FACULTY ? FACULTY_DEFAULT_PERMISSIONS :
           STUDENT_DEFAULT_PERMISSIONS),
        progress: userData.progress || {
          learning: { completed: 0, total: 0 },
          practice: { completed: 0, total: 0 },
          assessments: { completed: 0, total: 0 }
        },
        securityScore: userData.securityScore || 0,
        xp: userData.xp || 0,
        streak: userData.streak || 0,
        createdBy: createdBy,
        createdAt: new Date().toISOString()
      };

      // Add to storage
      await addUser(newUser);

      // Log action
      logAction({
        action: 'USER_CREATED',
        userId: createdBy || 'system',
        role: ROLES.ADMIN,
        target: 'User',
        targetId: newUser.id,
        status: 'Success',
        details: {
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          department: newUser.department
        }
      });

      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update a user
   * @param {string} userId - User ID
   * @param {object} updates - Updates to apply
   * @param {string} updatedBy - ID of user making the update
   * @returns {Promise<object>} - Updated user
   */
  static async updateUser(userId, updates, updatedBy = null) {
    try {
      const oldUser = await this.getUserById(userId);
      if (!oldUser) {
        throw new Error('User not found');
      }

      // Prevent role escalation
      if (updates.role && updates.role !== oldUser.role) {
        const currentUser = await AuthService.getCurrentUser();
        if (currentUser && currentUser.role !== ROLES.ADMIN) {
          throw new Error('Only admins can change user roles');
        }
      }

      // Update permissions if role changed
      if (updates.role && updates.role !== oldUser.role) {
        updates.permissions = updates.role === ROLES.ADMIN ? ADMIN_DEFAULT_PERMISSIONS :
                             updates.role === ROLES.FACULTY ? FACULTY_DEFAULT_PERMISSIONS :
                             STUDENT_DEFAULT_PERMISSIONS;
      }

      // Add metadata
      updates.updatedBy = updatedBy;
      updates.updatedAt = new Date().toISOString();

      const updatedUser = await updateUser(userId, updates);

      // Log action
      logAction({
        action: 'USER_UPDATED',
        userId: updatedBy || 'system',
        role: ROLES.ADMIN,
        target: 'User',
        targetId: userId,
        status: 'Success',
        details: {
          oldData: {
            name: oldUser.name,
            email: oldUser.email,
            role: oldUser.role,
            department: oldUser.department,
            status: oldUser.status
          },
          newData: {
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            department: updatedUser.department,
            status: updatedUser.status
          }
        }
      });

      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Delete a user
   * @param {string} userId - User ID
   * @param {string} deletedBy - ID of user deleting
   * @returns {Promise<boolean>} - Success status
   */
  static async deleteUser(userId, deletedBy = null) {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Prevent self-deletion
      const currentUser = await AuthService.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        throw new Error('Cannot delete your own account');
      }

      await deleteUser(userId);

      // Log action
      logAction({
        action: 'USER_DELETED',
        userId: deletedBy || 'system',
        role: ROLES.ADMIN,
        target: 'User',
        targetId: userId,
        status: 'Success',
        details: {
          name: user.name,
          email: user.email,
          role: user.role
        }
      });

      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Reset user password
   * @param {string} userId - User ID
   * @param {string} newPassword - New password
   * @param {string} resetBy - ID of user resetting
   * @returns {Promise<object>} - Updated user
   */
  static async resetPassword(userId, newPassword, resetBy = null) {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const updates = {
        password: newPassword,
        passwordResetAt: new Date().toISOString(),
        passwordResetBy: resetBy
      };

      const updatedUser = await updateUser(userId, updates);

      // Log action
      logAction({
        action: 'PASSWORD_RESET',
        userId: resetBy || 'system',
        role: ROLES.ADMIN,
        target: 'User',
        targetId: userId,
        status: 'Success',
        details: {
          email: user.email,
          resetBy: resetBy
        }
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
   * @param {string} changedBy - ID of user making the change
   * @returns {Promise<object>} - Updated user
   */
  static async changeRole(userId, newRole, changedBy = null) {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (user.role === newRole) {
        return user; // No change needed
      }

      // Prevent removing last admin
      if (newRole !== ROLES.ADMIN) {
        const admins = (await getUsers()).filter(u => u.role === ROLES.ADMIN);
        if (admins.length <= 1 && user.role === ROLES.ADMIN) {
          throw new Error('Cannot change role: at least one admin must remain');
        }
      }

      // Update permissions based on new role
      const newPermissions = newRole === ROLES.ADMIN ? ADMIN_DEFAULT_PERMISSIONS :
                          newRole === ROLES.FACULTY ? FACULTY_DEFAULT_PERMISSIONS :
                          STUDENT_DEFAULT_PERMISSIONS;

      const updates = {
        role: newRole,
        permissions: newPermissions,
        roleChangedAt: new Date().toISOString(),
        roleChangedBy: changedBy
      };

      const updatedUser = await updateUser(userId, updates);

      // Log action
      logAction({
        action: 'ROLE_CHANGED',
        userId: changedBy || 'system',
        role: ROLES.ADMIN,
        target: 'User',
        targetId: userId,
        status: 'Success',
        details: {
          oldRole: user.role,
          newRole,
          email: user.email
        }
      });

      return updatedUser;
    } catch (error) {
      console.error('Error changing role:', error);
      throw error;
    }
  }

  /**
   * Deactivate a user
   * @param {string} userId - User ID
   * @param {string} reason - Reason for deactivation
   * @param {string} deactivatedBy - ID of user deactivating
   * @returns {Promise<object>} - Updated user
   */
  static async deactivateUser(userId, reason = '', deactivatedBy = null) {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (user.status === 'inactive') {
        return user; // Already deactivated
      }

      const updates = {
        status: 'inactive',
        deactivatedAt: new Date().toISOString(),
        deactivatedBy: deactivatedBy,
        deactivationReason: reason
      };

      const updatedUser = await updateUser(userId, updates);

      // Log action
      logAction({
        action: 'USER_DEACTIVATED',
        userId: deactivatedBy || 'system',
        role: ROLES.ADMIN,
        target: 'User',
        targetId: userId,
        status: 'Success',
        details: {
          email: user.email,
          reason: reason
        }
      });

      return updatedUser;
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  }

  /**
   * Reactivate a user
   * @param {string} userId - User ID
   * @param {string} reactivatedBy - ID of user reactivating
   * @returns {Promise<object>} - Updated user
   */
  static async reactivateUser(userId, reactivatedBy = null) {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (user.status === 'active') {
        return user; // Already active
      }

      const updates = {
        status: 'active',
        reactivatedAt: new Date().toISOString(),
        reactivatedBy: reactivatedBy,
        deactivationReason: null
      };

      const updatedUser = await updateUser(userId, updates);

      // Log action
      logAction({
        action: 'USER_REACTIVATED',
        userId: reactivatedBy || 'system',
        role: ROLES.ADMIN,
        target: 'User',
        targetId: userId,
        status: 'Success',
        details: {
          email: user.email
        }
      });

      return updatedUser;
    } catch (error) {
      console.error('Error reactivating user:', error);
      throw error;
    }
  }

  /**
   * Assign user to faculty
   * @param {string} userId - User ID
   * @param {object} facultyData - Faculty data
   * @returns {Promise<object>} - Created faculty record
   */
  static async assignToFaculty(userId, facultyData) {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Check if user is already faculty
      const faculty = await getFaculty();
      if (faculty.some(f => f.userId === userId)) {
        throw new Error('User is already faculty');
      }

      const newFaculty = {
        id: `FAC-${Date.now()}`,
        userId: userId,
        department: facultyData.department || user.department,
        courses: facultyData.courses || [],
        studentGroups: facultyData.studentGroups || [],
        permissions: facultyData.permissions || FACULTY_DEFAULT_PERMISSIONS,
        joinDate: new Date().toISOString(),
        createdBy: facultyData.createdBy || userId
      };

      await addFaculty(newFaculty);

      // Update user role if needed
      if (user.role !== ROLES.FACULTY) {
        await this.changeRole(userId, ROLES.FACULTY, facultyData.createdBy);
      }

      // Log action
      logAction({
        action: 'FACULTY_ASSIGNED',
        userId: facultyData.createdBy || userId,
        role: ROLES.ADMIN,
        target: 'Faculty',
        targetId: newFaculty.id,
        status: 'Success',
        details: {
          userId: userId,
          department: newFaculty.department
        }
      });

      return newFaculty;
    } catch (error) {
      console.error('Error assigning to faculty:', error);
      throw error;
    }
  }

  /**
   * Remove user from faculty
   * @param {string} userId - User ID
   * @param {string} removedBy - ID of user removing
   * @returns {Promise<boolean>} - Success status
   */
  static async removeFromFaculty(userId, removedBy = null) {
    try {
      const faculty = await getFaculty();
      const facultyMember = faculty.find(f => f.userId === userId);
      if (!facultyMember) {
        throw new Error('User is not faculty');
      }

      await deleteFaculty(facultyMember.id);

      // Update user role if needed
      const user = await this.getUserById(userId);
      if (user && user.role === ROLES.FACULTY) {
        // Change to student if no other faculty role
        const remainingFaculty = faculty.filter(f => f.userId !== userId);
        if (remainingFaculty.length === 0) {
          await this.changeRole(userId, ROLES.STUDENT, removedBy);
        }
      }

      // Log action
      logAction({
        action: 'FACULTY_REMOVED',
        userId: removedBy || userId,
        role: ROLES.ADMIN,
        target: 'Faculty',
        targetId: facultyMember.id,
        status: 'Success',
        details: {
          userId: userId
        }
      });

      return true;
    } catch (error) {
      console.error('Error removing from faculty:', error);
      throw error;
    }
  }

  /**
   * Get all faculty members
   * @returns {Promise<Array>} - Array of faculty with user details
   */
  static async getAllFaculty() {
    try {
      const faculty = await getFaculty();
      const users = await getUsers();

      return faculty.map(f => {
        const user = users.find(u => u.id === f.userId);
        return {
          ...f,
          user: user ? {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            avatar: user.avatar
          } : null
        };
      });
    } catch (error) {
      console.error('Error getting faculty:', error);
      throw error;
    }
  }

  /**
   * Get faculty by ID
   * @param {string} facultyId - Faculty ID
   * @returns {Promise<object|null>} - Faculty with user details or null
   */
  static async getFacultyById(facultyId) {
    try {
      const faculty = await getFaculty();
      const facultyMember = faculty.find(f => f.id === facultyId);

      if (!facultyMember) return null;

      const user = await this.getUserById(facultyMember.userId);
      return {
        ...facultyMember,
        user: user ? {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          avatar: user.avatar
        } : null
      };
    } catch (error) {
      console.error('Error getting faculty by ID:', error);
      throw error;
    }
  }

  /**
   * Update faculty member
   * @param {string} facultyId - Faculty ID
   * @param {object} updates - Updates to apply
   * @param {string} updatedBy - ID of user making the update
   * @returns {Promise<object>} - Updated faculty
   */
  static async updateFaculty(facultyId, updates, updatedBy = null) {
    try {
      const oldFaculty = await this.getFacultyById(facultyId);
      if (!oldFaculty) {
        throw new Error('Faculty not found');
      }

      const updatedFaculty = await updateFaculty(facultyId, {
        ...updates,
        updatedBy: updatedBy,
        updatedAt: new Date().toISOString()
      });

      // Log action
      logAction({
        action: 'FACULTY_UPDATED',
        userId: updatedBy || 'system',
        role: ROLES.ADMIN,
        target: 'Faculty',
        targetId: facultyId,
        status: 'Success',
        details: {
          userId: oldFaculty.userId,
          department: updatedFaculty.department
        }
      });

      return updatedFaculty;
    } catch (error) {
      console.error('Error updating faculty:', error);
      throw error;
    }
  }

  // ===== STUDENT GROUP METHODS =====

  /**
   * Create a new student group
   * @param {object} groupData - Group data
   * @param {string} createdBy - ID of user creating the group
   * @returns {Promise<object>} - Created group
   */
  static async createStudentGroup(groupData, createdBy = null) {
    try {
      const newGroup = {
        id: `GROUP-${Date.now()}`,
        name: groupData.name,
        description: groupData.description || '',
        facultyId: groupData.facultyId,
        students: groupData.students || [],
        courses: groupData.courses || [],
        createdBy: createdBy,
        createdAt: new Date().toISOString()
      };

      await addStudentGroup(newGroup);

      // Log action
      logAction({
        action: 'GROUP_CREATED',
        userId: createdBy || 'system',
        role: ROLES.ADMIN,
        target: 'StudentGroup',
        targetId: newGroup.id,
        status: 'Success',
        details: {
          name: newGroup.name,
          studentCount: newGroup.students.length
        }
      });

      return newGroup;
    } catch (error) {
      console.error('Error creating student group:', error);
      throw error;
    }
  }

  /**
   * Get all student groups
   * @returns {Promise<Array>} - Array of student groups
   */
  static async getAllStudentGroups() {
    try {
      return await getStudentGroups();
    } catch (error) {
      console.error('Error getting student groups:', error);
      throw error;
    }
  }

  /**
   * Get student group by ID
   * @param {string} groupId - Group ID
   * @returns {Promise<object|null>} - Student group or null
   */
  static async getStudentGroupById(groupId) {
    try {
      const groups = await getStudentGroups();
      return groups.find(g => g.id === groupId) || null;
    } catch (error) {
      console.error('Error getting student group by ID:', error);
      throw error;
    }
  }

  /**
   * Update a student group
   * @param {string} groupId - Group ID
   * @param {object} updates - Updates to apply
   * @param {string} updatedBy - ID of user making the update
   * @returns {Promise<object>} - Updated group
   */
  static async updateStudentGroup(groupId, updates, updatedBy = null) {
    try {
      const oldGroup = await this.getStudentGroupById(groupId);
      if (!oldGroup) {
        throw new Error('Group not found');
      }

      const updatedGroup = await updateStudentGroup(groupId, {
        ...updates,
        updatedBy: updatedBy,
        updatedAt: new Date().toISOString()
      });

      // Log action
      logAction({
        action: 'GROUP_UPDATED',
        userId: updatedBy || 'system',
        role: ROLES.ADMIN,
        target: 'StudentGroup',
        targetId: groupId,
        status: 'Success',
        details: {
          name: updatedGroup.name,
          oldStudentCount: oldGroup.students.length,
          newStudentCount: updatedGroup.students.length
        }
      });

      return updatedGroup;
    } catch (error) {
      console.error('Error updating student group:', error);
      throw error;
    }
  }

  /**
   * Delete a student group
   * @param {string} groupId - Group ID
   * @param {string} deletedBy - ID of user deleting
   * @returns {Promise<boolean>} - Success status
   */
  static async deleteStudentGroup(groupId, deletedBy = null) {
    try {
      const group = await this.getStudentGroupById(groupId);
      if (!group) {
        throw new Error('Group not found');
      }

      await deleteStudentGroup(groupId);

      // Log action
      logAction({
        action: 'GROUP_DELETED',
        userId: deletedBy || 'system',
        role: ROLES.ADMIN,
        target: 'StudentGroup',
        targetId: groupId,
        status: 'Success',
        details: {
          name: group.name,
          studentCount: group.students.length
        }
      });

      return true;
    } catch (error) {
      console.error('Error deleting student group:', error);
      throw error;
    }
  }

  /**
   * Add students to a group
   * @param {string} groupId - Group ID
   * @param {string|string[]} studentIds - Student ID or array of IDs
   * @param {string} addedBy - ID of user adding
   * @returns {Promise<object>} - Updated group
   */
  static async addStudentsToGroup(groupId, studentIds, addedBy = null) {
    try {
      const group = await this.getStudentGroupById(groupId);
      if (!group) {
        throw new Error('Group not found');
      }

      const studentIdsArray = Array.isArray(studentIds) ? studentIds : [studentIds];

      // Validate students exist
      const users = await getUsers();
      const validStudentIds = studentIdsArray.filter(id =>
        users.some(u => u.id === id)
      );

      if (validStudentIds.length !== studentIdsArray.length) {
        console.warn('Some student IDs were not found');
      }

      // Get existing students
      const existingStudents = new Set(group.students || []);

      // Add new students
      validStudentIds.forEach(id => existingStudents.add(id));

      const updatedGroup = await updateStudentGroup(groupId, {
        students: Array.from(existingStudents),
        updatedBy: addedBy,
        updatedAt: new Date().toISOString()
      });

      // Log action
      logAction({
        action: 'STUDENTS_ADDED_TO_GROUP',
        userId: addedBy || 'system',
        role: ROLES.ADMIN,
        target: 'StudentGroup',
        targetId: groupId,
        status: 'Success',
        details: {
          groupName: group.name,
          studentCount: validStudentIds.length
        }
      });

      return updatedGroup;
    } catch (error) {
      console.error('Error adding students to group:', error);
      throw error;
    }
  }

  /**
   * Remove students from a group
   * @param {string} groupId - Group ID
   * @param {string|string[]} studentIds - Student ID or array of IDs
   * @param {string} removedBy - ID of user removing
   * @returns {Promise<object>} - Updated group
   */
  static async removeStudentsFromGroup(groupId, studentIds, removedBy = null) {
    try {
      const group = await this.getStudentGroupById(groupId);
      if (!group) {
        throw new Error('Group not found');
      }

      const studentIdsArray = Array.isArray(studentIds) ? studentIds : [studentIds];

      // Get existing students
      const existingStudents = new Set(group.students || []);

      // Remove students
      studentIdsArray.forEach(id => existingStudents.delete(id));

      const updatedGroup = await updateStudentGroup(groupId, {
        students: Array.from(existingStudents),
        updatedBy: removedBy,
        updatedAt: new Date().toISOString()
      });

      // Log action
      logAction({
        action: 'STUDENTS_REMOVED_FROM_GROUP',
        userId: removedBy || 'system',
        role: ROLES.ADMIN,
        target: 'StudentGroup',
        targetId: groupId,
        status: 'Success',
        details: {
          groupName: group.name,
          studentCount: studentIdsArray.length
        }
      });

      return updatedGroup;
    } catch (error) {
      console.error('Error removing students from group:', error);
      throw error;
    }
  }

  // ===== RESTRICTION METHODS =====

  /**
   * Add restriction to a user
   * @param {string} userId - User ID
   * @param {object} restrictionData - Restriction data
   * @param {string} createdBy - ID of user creating the restriction
   * @returns {Promise<object>} - Created restriction
   */
  static async addRestriction(userId, restrictionData, createdBy = null) {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const newRestriction = {
        id: `REST-${Date.now()}`,
        userId: userId,
        type: restrictionData.type,
        reason: restrictionData.reason || '',
        createdBy: createdBy,
        createdAt: new Date().toISOString(),
        expiry: restrictionData.expiry || null,
        status: 'Active'
      };

      await addRestriction(newRestriction);

      // Log action
      logAction({
        action: 'RESTRICTION_ADDED',
        userId: createdBy || 'system',
        role: ROLES.ADMIN,
        target: 'Restriction',
        targetId: newRestriction.id,
        status: 'Success',
        details: {
          userId: userId,
          type: newRestriction.type,
          reason: newRestriction.reason
        }
      });

      return newRestriction;
    } catch (error) {
      console.error('Error adding restriction:', error);
      throw error;
    }
  }

  /**
   * Get restrictions for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - Array of restrictions
   */
  static async getRestrictionsForUser(userId) {
    try {
      const restrictions = await getRestrictions();
      return restrictions.filter(r =>
        r.userId === userId &&
        (!r.expiry || new Date(r.expiry) > new Date())
      );
    } catch (error) {
      console.error('Error getting restrictions for user:', error);
      throw error;
    }
  }

  /**
   * Get all active restrictions
   * @returns {Promise<Array>} - Array of active restrictions
   */
  static async getAllActiveRestrictions() {
    try {
      const restrictions = await getRestrictions();
      return restrictions.filter(r =>
        r.status === 'Active' &&
        (!r.expiry || new Date(r.expiry) > new Date())
      );
    } catch (error) {
      console.error('Error getting active restrictions:', error);
      throw error;
    }
  }

  /**
   * Lift a restriction
   * @param {string} restrictionId - Restriction ID
   * @param {string} liftedBy - ID of user lifting the restriction
   * @returns {Promise<object>} - Updated restriction
   */
  static async liftRestriction(restrictionId, liftedBy = null) {
    try {
      const restriction = (await getRestrictions()).find(r => r.id === restrictionId);
      if (!restriction) {
        throw new Error('Restriction not found');
      }

      const updatedRestriction = await updateRestriction(restrictionId, {
        status: 'Lifted',
        liftedAt: new Date().toISOString(),
        liftedBy: liftedBy
      });

      // Log action
      logAction({
        action: 'RESTRICTION_LIFTED',
        userId: liftedBy || 'system',
        role: ROLES.ADMIN,
        target: 'Restriction',
        targetId: restrictionId,
        status: 'Success',
        details: {
          userId: restriction.userId,
          type: restriction.type
        }
      });

      return updatedRestriction;
    } catch (error) {
      console.error('Error lifting restriction:', error);
      throw error;
    }
  }

  /**
   * Check if user has a specific restriction
   * @param {string} userId - User ID
   * @param {string} restrictionType - Type of restriction to check
   * @returns {Promise<boolean>} - True if user has the restriction
   */
  static async hasRestriction(userId, restrictionType) {
    try {
      const restrictions = await this.getRestrictionsForUser(userId);
      return restrictions.some(r => r.type === restrictionType);
    } catch (error) {
      console.error('Error checking restriction:', error);
      throw error;
    }
  }

  // ===== PROGRESS METHODS =====

  /**
   * Get progress for a user
   * @param {string} userId - User ID
   * @returns {Promise<object>} - User progress
   */
  static async getProgress(userId) {
    try {
      const progress = await getStudentProgress(userId);
      return progress;
    } catch (error) {
      console.error('Error getting progress:', error);
      throw error;
    }
  }

  /**
   * Update progress for a user
   * @param {string} userId - User ID
   * @param {object} updates - Progress updates
   * @returns {Promise<object>} - Updated progress
   */
  static async updateProgress(userId, updates) {
    try {
      const updatedProgress = await updateStudentProgress(userId, updates);
      return updatedProgress;
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }

  /**
   * Increment XP for a user
   * @param {string} userId - User ID
   * @param {number} amount - Amount of XP to add
   * @returns {Promise<object>} - Updated progress
   */
  static async addXP(userId, amount) {
    try {
      const progress = await this.getProgress(userId);
      const updatedProgress = await updateStudentProgress(userId, {
        xp: (progress.xp || 0) + amount
      });
      return updatedProgress;
    } catch (error) {
      console.error('Error adding XP:', error);
      throw error;
    }
  }

  /**
   * Update security score for a user
   * @param {string} userId - User ID
   * @param {number} score - New security score (0-100)
   * @returns {Promise<object>} - Updated progress
   */
  static async updateSecurityScore(userId, score) {
    try {
      if (score < 0 || score > 100) {
        throw new Error('Security score must be between 0 and 100');
      }

      const progress = await this.getProgress(userId);
      const updatedProgress = await updateStudentProgress(userId, {
        securityScore: Math.round(score)
      });

      // Log action
      logAction({
        action: 'SECURITY_SCORE_UPDATED',
        userId: userId,
        role: ROLES.ADMIN,
        target: 'Progress',
        targetId: userId,
        status: 'Success',
        details: {
          oldScore: progress.securityScore || 0,
          newScore: Math.round(score)
        }
      });

      return updatedProgress;
    } catch (error) {
      console.error('Error updating security score:', error);
      throw error;
    }
  }

  /**
   * Update user level
   * @param {string} userId - User ID
   * @param {number} newLevel - New level (1-12)
   * @param {string} updatedBy - ID of user updating
   * @returns {Promise<object>} - Updated user
   */
  static async updateLevel(userId, newLevel, updatedBy = null) {
    try {
      if (newLevel < 1 || newLevel > 12) {
        throw new Error('Level must be between 1 and 12');
      }

      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (user.level === newLevel) {
        return user; // No change needed
      }

      const updates = {
        level: newLevel,
        levelChangedAt: new Date().toISOString(),
        levelChangedBy: updatedBy
      };

      const updatedUser = await updateUser(userId, updates);

      // Log action
      logAction({
        action: 'LEVEL_UPDATED',
        userId: updatedBy || 'system',
        role: ROLES.ADMIN,
        target: 'User',
        targetId: userId,
        status: 'Success',
        details: {
          oldLevel: user.level,
          newLevel: newLevel
        }
      });

      return updatedUser;
    } catch (error) {
      console.error('Error updating level:', error);
      throw error;
    }
  }

  /**
   * Update user streak
   * @param {string} userId - User ID
   * @param {number} streak - New streak value
   * @returns {Promise<object>} - Updated progress
   */
  static async updateStreak(userId, streak) {
    try {
      const progress = await this.getProgress(userId);
      const updatedProgress = await updateStudentProgress(userId, {
        streak: Math.max(0, streak)
      });

      // Log action if streak increased
      if ((progress.streak || 0) < streak) {
        logAction({
          action: 'STREAK_INCREASED',
          userId: userId,
          role: ROLES.STUDENT,
          target: 'Progress',
          targetId: userId,
          status: 'Success',
          details: {
            oldStreak: progress.streak || 0,
            newStreak: streak
          }
        });
      }

      return updatedProgress;
    } catch (error) {
      console.error('Error updating streak:', error);
      throw error;
    }
  }

  /**
   * Reset user streak
   * @param {string} userId - User ID
   * @returns {Promise<object>} - Updated progress
   */
  static async resetStreak(userId) {
    try {
      const progress = await this.getProgress(userId);
      if ((progress.streak || 0) === 0) {
        return progress; // Already 0
      }

      const updatedProgress = await updateStudentProgress(userId, {
        streak: 0,
        lastStreakReset: new Date().toISOString()
      });

      // Log action
      logAction({
        action: 'STREAK_RESET',
        userId: userId,
        role: ROLES.STUDENT,
        target: 'Progress',
        targetId: userId,
        status: 'Success',
        details: {
          oldStreak: progress.streak || 0
        }
      });

      return updatedProgress;
    } catch (error) {
      console.error('Error resetting streak:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   * @param {string} userId - User ID
   * @returns {Promise<object>} - User statistics
   */
  static async getUserStats(userId) {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const progress = await this.getProgress(userId);
      const restrictions = await this.getRestrictionsForUser(userId);

      return {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        level: user.level,
        department: user.department,
        joinDate: user.joinDate,
        lastActive: user.lastActive,
        securityScore: progress.securityScore || 0,
        xp: progress.xp || 0,
        streak: progress.streak || 0,
        learningProgress: progress.learning || { completed: 0, total: 0 },
        practiceProgress: progress.practice || { completed: 0, total: 0 },
        assessmentProgress: progress.assessments || { completed: 0, total: 0 },
        activeRestrictions: restrictions.length,
        restrictions: restrictions,
        status: user.status
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  /**
   * Get dashboard statistics for admin
   * @returns {Promise<object>} - Dashboard statistics
   */
  static async getDashboardStats() {
    try {
      const users = await getUsers();
      const faculty = await getFaculty();
      const courses = await getCourses();
      const labs = await getLabs();
      const assessments = await getAssessments();
      const results = await getResults();
      const violations = await getViolations();
      const restrictions = await getRestrictions();

      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      // Count by role
      const roleCounts = {
        admin: users.filter(u => u.role === ROLES.ADMIN).length,
        faculty: users.filter(u => u.role === ROLES.FACULTY).length,
        student: users.filter(u => u.role === ROLES.STUDENT).length
      };

      // Active users (logged in this month)
      const activeUsers = users.filter(u => {
        if (!u.lastActive) return false;
        const lastActive = new Date(u.lastActive);
        return lastActive >= thisMonth;
      }).length;

      // New users this month
      const newUsersThisMonth = users.filter(u => {
        const joinDate = new Date(u.joinDate);
        return joinDate >= thisMonth && joinDate <= now;
      }).length;

      // New users last month
      const newUsersLastMonth = users.filter(u => {
        const joinDate = new Date(u.joinDate);
        return joinDate >= lastMonth && joinDate < thisMonth;
      }).length;

      // Course completion stats
      const totalCourses = courses.length;
      const publishedCourses = courses.filter(c => c.isPublished).length;

      // Assessment stats
      const totalAssessments = assessments.length;
      const openAssessments = assessments.filter(a =>
        a.status === 'Open' || a.status === 'In Progress'
      ).length;
      const completedResults = results.filter(r => r.status === 'Passed' || r.status === 'Failed').length;

      // Violation stats
      const totalViolations = violations.length;
      const pendingViolations = violations.filter(v => v.status === 'Pending').length;
      const highSeverityViolations = violations.filter(v =>
        v.severity === 'High' || v.severity === 'Critical'
      ).length;

      // Restriction stats
      const activeRestrictions = restrictions.filter(r =>
        r.status === 'Active' &&
        (!r.expiry || new Date(r.expiry) > now)
      ).length;

      // User level distribution
      const levelDistribution = {};
      for (let i = 1; i <= 12; i++) {
        levelDistribution[`level${i}`] = users.filter(u => u.level === i).length;
      }

      return {
        // User stats
        totalUsers: users.length,
        activeUsers,
        newUsersThisMonth,
        newUsersLastMonth,
        growthRate: newUsersThisMonth - newUsersLastMonth,
        roleCounts,

        // Course stats
        totalCourses,
        publishedCourses,
        courseCompletionRate: publishedCourses / totalCourses * 100 || 0,

        // Lab stats
        totalLabs: labs.length,
        activeLabs: labs.filter(l => l.isActive).length,

        // Assessment stats
        totalAssessments,
        openAssessments,
        completedResults,
        passRate: results.filter(r => r.status === 'Passed').length / completedResults * 100 || 0,

        // Violation stats
        totalViolations,
        pendingViolations,
        highSeverityViolations,

        // Restriction stats
        activeRestrictions,

        // Faculty stats
        totalFaculty: faculty.length,

        // Level distribution
        levelDistribution,

        // Recent activity
        recentUsers: users
          .filter(u => u.joinDate)
          .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
          .slice(0, 5)
          .map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            joinDate: u.joinDate
          })),

        recentAssessments: assessments
          .filter(a => a.createdAt)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map(a => ({
            id: a.id,
            title: a.title,
            type: a.type,
            createdAt: a.createdAt,
            status: a.status
          })),

        recentViolations: violations
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 5)
          .map(v => ({
            id: v.id,
            type: v.type,
            severity: v.severity,
            timestamp: v.timestamp,
            status: v.status
          }))
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  }

  /**
   * Search users with advanced filtering
   * @param {object} options - Search options
   * @returns {Promise<object>} - Search results with pagination
   */
  static async searchUsersAdvanced(options = {}) {
    try {
      const {
        query = '',
        role,
        department,
        status,
        level,
        page = 1,
        limit = 10,
        sortBy = 'name',
        sortOrder = 'asc'
      } = options;

      let users = await getUsers();

      // Apply filters
      if (query) {
        const lowerQuery = query.toLowerCase();
        users = users.filter(u =>
          u.name.toLowerCase().includes(lowerQuery) ||
          u.email.toLowerCase().includes(lowerQuery) ||
          (u.department && u.department.toLowerCase().includes(lowerQuery)) ||
          u.id.toLowerCase().includes(lowerQuery)
        );
      }

      if (role) {
        users = users.filter(u => u.role === role);
      }

      if (department) {
        users = users.filter(u => u.department === department);
      }

      if (status) {
        users = users.filter(u => u.status === status);
      }

      if (level) {
        users = users.filter(u => u.level === parseInt(level));
      }

      // Sort
      users.sort((a, b) => {
        let aVal, bVal;

        switch (sortBy) {
          case 'name':
            aVal = a.name.toLowerCase();
            bVal = b.name.toLowerCase();
            break;
          case 'email':
            aVal = a.email.toLowerCase();
            bVal = b.email.toLowerCase();
            break;
          case 'level':
            aVal = a.level;
            bVal = b.level;
            break;
          case 'joinDate':
            aVal = new Date(a.joinDate);
            bVal = new Date(b.joinDate);
            break;
          case 'lastActive':
            aVal = a.lastActive ? new Date(a.lastActive) : new Date(0);
            bVal = b.lastActive ? new Date(b.lastActive) : new Date(0);
            break;
          default:
            aVal = a.name.toLowerCase();
            bVal = b.name.toLowerCase();
        }

        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });

      // Paginate
      const startIndex = (page - 1) * limit;
      const paginatedUsers = users.slice(startIndex, startIndex + limit);
      const total = users.length;
      const totalPages = Math.ceil(total / limit);

      return {
        users: paginatedUsers,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      };
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  /**
   * Bulk update user properties
   * @param {string[]} userIds - Array of user IDs
   * @param {object} updates - Updates to apply
   * @param {string} updatedBy - ID of user making the update
   * @returns {Promise<object>} - Result object
   */
  static async bulkUpdateUsers(userIds, updates, updatedBy = null) {
    try {
      const users = await getUsers();
      const validUserIds = userIds.filter(id => users.some(u => u.id === id));

      if (validUserIds.length === 0) {
        throw new Error('No valid user IDs provided');
      }

      const updatePromises = validUserIds.map(userId => {
        return updateUser(userId, {
          ...updates,
          updatedBy: updatedBy,
          updatedAt: new Date().toISOString()
        });
      });

      const results = await Promise.all(updatePromises);

      // Log action
      logAction({
        action: 'BULK_USERS_UPDATED',
        userId: updatedBy || 'system',
        role: ROLES.ADMIN,
        target: 'User',
        status: 'Success',
        details: {
          userCount: validUserIds.length,
          updates: Object.keys(updates)
        }
      });

      return {
        success: true,
        updatedCount: results.length,
        failedCount: userIds.length - validUserIds.length
      };
    } catch (error) {
      console.error('Error bulk updating users:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Bulk deactivate users
   * @param {string[]} userIds - Array of user IDs
   * @param {string} reason - Reason for deactivation
   * @param {string} deactivatedBy - ID of user deactivating
   * @returns {Promise<object>} - Result object
   */
  static async bulkDeactivateUsers(userIds, reason = '', deactivatedBy = null) {
    try {
      const results = await this.bulkUpdateUsers(userIds, {
        status: 'inactive',
        deactivatedAt: new Date().toISOString(),
        deactivatedBy: deactivatedBy,
        deactivationReason: reason
      }, deactivatedBy);

      // Log action
      logAction({
        action: 'BULK_USERS_DEACTIVATED',
        userId: deactivatedBy || 'system',
        role: ROLES.ADMIN,
        target: 'User',
        status: 'Success',
        details: {
          userCount: results.updatedCount,
          reason: reason
        }
      });

      return results;
    } catch (error) {
      console.error('Error bulk deactivating users:', error);
      throw error;
    }
  }

  /**
   * Bulk reactivate users
   * @param {string[]} userIds - Array of user IDs
   * @param {string} reactivatedBy - ID of user reactivating
   * @returns {Promise<object>} - Result object
   */
  static async bulkReactivateUsers(userIds, reactivatedBy = null) {
    try {
      const results = await this.bulkUpdateUsers(userIds, {
        status: 'active',
        reactivatedAt: new Date().toISOString(),
        reactivatedBy: reactivatedBy,
        deactivationReason: null
      }, reactivatedBy);

      // Log action
      // Log action
      logAction({
        action: 'BULK_USERS_REACTIVATED',
        userId: reactivatedBy || 'system',
        role: ROLES.ADMIN,
        target: 'User',
        status: 'Success',
        details: {
          userCount: results.updatedCount
        }
      });

      return results;
    } catch (error) {
      console.error('Error bulk reactivating users:', error);
      throw error;
    }
  }

  /**
   * Bulk assign users to faculty
   * @param {string[]} userIds - Array of user IDs
   * @param {object} facultyData - Faculty data
   * @param {string} assignedBy - ID of user assigning
   * @returns {Promise<object>} - Result object
   */
  static async bulkAssignToFaculty(userIds, facultyData, assignedBy = null) {
    try {
      const results = await Promise.all(
        userIds.map(userId => this.assignToFaculty(userId, facultyData))
      );

      // Log action
      logAction({
        action: 'BULK_USERS_ASSIGNED_TO_FACULTY',
        userId: assignedBy || 'system',
        role: ROLES.ADMIN,
        target: 'Faculty',
        status: 'Success',
        details: {
          userCount: results.length,
          department: facultyData.department
        }
      });

      return {
        success: true,
        assignedCount: results.length,
        failedCount: userIds.length - results.length
      };
    } catch (error) {
      console.error('Error bulk assigning to faculty:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get user activity history
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - Array of activity records
   */
  static async getUserActivity(userId) {
    try {
      const auditLogs = await getAuditLogs();
      return auditLogs
        .filter(log => log.userId === userId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .map(log => ({
          id: log.id,
          action: log.action,
          target: log.target,
          targetId: log.targetId,
          status: log.status,
          timestamp: log.timestamp,
          details: log.details
        }));
    } catch (error) {
      console.error('Error getting user activity:', error);
      throw error;
    }
  }

  /**
   * Get recent users
   * @param {number} limit - Number of users to return
   * @returns {Promise<Array>} - Array of recent users
   */
  static async getRecentUsers(limit = 5) {
    try {
      const users = await getUsers();
      return users
        .filter(u => u.joinDate)
        .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting recent users:', error);
      throw error;
    }
  }

  /**
   * Get users by course
   * @param {string} courseId - Course ID
   * @returns {Promise<Array>} - Array of users enrolled in the course
   */
  static async getUsersByCourse(courseId) {
    try {
      const users = await getUsers();
      return users.filter(u =>
        u.courses && u.courses.includes(courseId) ||
        u.enrolledCourses && u.enrolledCourses.includes(courseId)
      );
    } catch (error) {
      console.error('Error getting users by course:', error);
      throw error;
    }
  }

  /**
   * Enroll user in a course
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID
   * @param {string} enrolledBy - ID of user enrolling
   * @returns {Promise<object>} - Updated user
   */
  static async enrollInCourse(userId, courseId, enrolledBy = null) {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const existingCourses = new Set(user.courses || user.enrolledCourses || []);
      existingCourses.add(courseId);

      const updates = {
        courses: Array.from(existingCourses),
        enrolledCourses: Array.from(existingCourses),
        lastEnrolled: new Date().toISOString(),
        enrolledBy: enrolledBy
      };

      const updatedUser = await updateUser(userId, updates);

      // Log action
      logAction({
        action: 'USER_ENROLLED_IN_COURSE',
        userId: enrolledBy || userId,
        role: ROLES.ADMIN,
        target: 'Course',
        targetId: courseId,
        status: 'Success',
        details: {
          userId: userId,
          courseId: courseId
        }
      });

      return updatedUser;
    } catch (error) {
      console.error('Error enrolling in course:', error);
      throw error;
    }
  }

  /**
   * Unenroll user from a course
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID
   * @param {string} unenrolledBy - ID of user unenrolling
   * @returns {Promise<object>} - Updated user
   */
  static async unenrollFromCourse(userId, courseId, unenrolledBy = null) {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const existingCourses = new Set(user.courses || user.enrolledCourses || []);
      existingCourses.delete(courseId);

      const updates = {
        courses: Array.from(existingCourses),
        enrolledCourses: Array.from(existingCourses),
        lastUnenrolled: new Date().toISOString(),
        unenrolledBy: unenrolledBy
      };

      const updatedUser = await updateUser(userId, updates);

      // Log action
      logAction({
        action: 'USER_UNENROLLED_FROM_COURSE',
        userId: unenrolledBy || userId,
        role: ROLES.ADMIN,
        target: 'Course',
        targetId: courseId,
        status: 'Success',
        details: {
          userId: userId,
          courseId: courseId
        }
      });

      return updatedUser;
    } catch (error) {
      console.error('Error unenrolling from course:', error);
      throw error;
    }
  }
}

// ===== EXPORT =====
export default UserService;