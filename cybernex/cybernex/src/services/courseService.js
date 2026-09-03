/**
 * CyberNex - Course Service
 *
 * Service layer for course management operations.
 * Provides business logic and data access for courses, modules, and lessons.
 */

import {
  getCourses, setCourses, addCourse, updateCourse, deleteCourse,
  getLabs, getAssessments,
  logAction
} from './storageService';
import { ROLES, CYBER_DOMAINS, LEVELS, DIFFICULTY_LEVELS } from '../utils/constants';
import UserService from './userService';

// ===== COURSE SERVICE =====
class CourseService {
  /**
   * Get all courses
   * @param {object} options - Filter options
   * @param {string} options.domain - Filter by cybersecurity domain
   * @param {number} options.level - Filter by level
   * @param {string} options.difficulty - Filter by difficulty
   * @param {boolean} options.published - Filter by published status
   * @param {string} options.search - Search query
   * @param {string} options.facultyId - Filter by faculty ID
   * @returns {Promise<Array>} - Array of courses
   */
  static async getAllCourses(options = {}) {
    try {
      let courses = await getCourses();

      // Apply filters
      if (options.domain) {
        courses = courses.filter(c => c.domain === options.domain);
      }

      if (options.level) {
        courses = courses.filter(c => c.level === parseInt(options.level));
      }

      if (options.difficulty) {
        courses = courses.filter(c => c.difficulty === options.difficulty);
      }

      if (options.published !== undefined) {
        courses = courses.filter(c => c.isPublished === options.published);
      }

      if (options.search) {
        const query = options.search.toLowerCase();
        courses = courses.filter(c =>
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.domain.toLowerCase().includes(query) ||
          c.id.toLowerCase().includes(query)
        );
      }

      if (options.facultyId) {
        courses = courses.filter(c =>
          c.facultyId === options.facultyId ||
          (c.facultyIds && c.facultyIds.includes(options.facultyId))
        );
      }

      return courses;
    } catch (error) {
      console.error('Error getting courses:', error);
      throw error;
    }
  }

  /**
   * Get course by ID
   * @param {string} courseId - Course ID
   * @returns {Promise<object|null>} - Course or null
   */
  static async getCourseById(courseId) {
    try {
      const courses = await getCourses();
      return courses.find(c => c.id === courseId) || null;
    } catch (error) {
      console.error('Error getting course by ID:', error);
      throw error;
    }
  }

  /**
   * Get course by slug
   * @param {string} slug - Course slug
   * @returns {Promise<object|null>} - Course or null
   */
  static async getCourseBySlug(slug) {
    try {
      const courses = await getCourses();
      return courses.find(c => c.slug === slug) || null;
    } catch (error) {
      console.error('Error getting course by slug:', error);
      throw error;
    }
  }

  /**
   * Create a new course
   * @param {object} courseData - Course data
   * @param {string} createdBy - ID of user creating the course
   * @returns {Promise<object>} - Created course
   */
  static async createCourse(courseData, createdBy = null) {
    try {
      // Validate required fields
      if (!courseData.title || !courseData.domain || !courseData.level) {
        throw new Error('Title, domain, and level are required');
      }

      // Generate ID and slug
      const id = `COURSE-${Date.now()}`;
      const slug = courseData.title.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .substring(0, 50);

      // Set default values
      const newCourse = {
        id,
        slug,
        title: courseData.title,
        description: courseData.description || '',
        domain: courseData.domain,
        level: parseInt(courseData.level),
        levelName: LEVELS[courseData.level] || LEVELS[1],
        difficulty: courseData.difficulty || DIFFICULTY_LEVELS.BEGINNER,
        estimatedTime: courseData.estimatedTime || 0,
        prerequisites: courseData.prerequisites || [],
        learningObjectives: courseData.learningObjectives || [],
        isPublished: courseData.isPublished || false,
        isActive: true,
        facultyId: courseData.facultyId || createdBy,
        facultyIds: courseData.facultyIds || [createdBy],
        students: courseData.students || [],
        enrolledStudents: courseData.enrolledStudents || [],
        modules: courseData.modules || [],
        resources: courseData.resources || [],
        tags: courseData.tags || [],
        createdBy: createdBy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1
      };

      // Add to storage
      await addCourse(newCourse);

      // Log action
      logAction({
        action: 'COURSE_CREATED',
        userId: createdBy || 'system',
        role: ROLES.FACULTY,
        target: 'Course',
        targetId: newCourse.id,
        status: 'Success',
        details: {
          title: newCourse.title,
          domain: newCourse.domain,
          level: newCourse.level
        }
      });

      return newCourse;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  /**
   * Update a course
   * @param {string} courseId - Course ID
   * @param {object} updates - Updates to apply
   * @param {string} updatedBy - ID of user updating
   * @returns {Promise<object>} - Updated course
   */
  static async updateCourse(courseId, updates, updatedBy = null) {
    try {
      const oldCourse = await this.getCourseById(courseId);
      if (!oldCourse) {
        throw new Error('Course not found');
      }

      // Update slug if title changed
      if (updates.title && updates.title !== oldCourse.title) {
        updates.slug = updates.title.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '')
          .substring(0, 50);
      }

      // Update level name if level changed
      if (updates.level && updates.level !== oldCourse.level) {
        updates.levelName = LEVELS[updates.level] || LEVELS[oldCourse.level];
      }

      // Add metadata
      updates.updatedBy = updatedBy;
      updates.updatedAt = new Date().toISOString();
      updates.version = (oldCourse.version || 1) + 1;

      const updatedCourse = await updateCourse(courseId, updates);

      // Log action
      logAction({
        action: 'COURSE_UPDATED',
        userId: updatedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Course',
        targetId: courseId,
        status: 'Success',
        details: {
          title: updatedCourse.title,
          oldTitle: oldCourse.title,
          changes: Object.keys(updates).filter(k => k !== 'updatedBy' && k !== 'updatedAt' && k !== 'version')
        }
      });

      return updatedCourse;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }

  /**
   * Delete a course
   * @param {string} courseId - Course ID
   * @param {string} deletedBy - ID of user deleting
   * @returns {Promise<boolean>} - Success status
   */
  static async deleteCourse(courseId, deletedBy = null) {
    try {
      const course = await this.getCourseById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      // Check for dependencies
      const labs = await getLabs();
      const assessments = await getAssessments();

      const dependentLabs = labs.filter(l => l.courseId === courseId);
      const dependentAssessments = assessments.filter(a => a.courseId === courseId);

      if (dependentLabs.length > 0 || dependentAssessments.length > 0) {
        throw new Error('Cannot delete course with existing labs or assessments');
      }

      await deleteCourse(courseId);

      // Log action
      logAction({
        action: 'COURSE_DELETED',
        userId: deletedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Course',
        targetId: courseId,
        status: 'Success',
        details: {
          title: course.title,
          domain: course.domain
        }
      });

      return true;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }

  /**
   * Publish a course
   * @param {string} courseId - Course ID
   * @param {string} publishedBy - ID of user publishing
   * @returns {Promise<object>} - Updated course
   */
  static async publishCourse(courseId, publishedBy = null) {
    try {
      const course = await this.getCourseById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      if (course.isPublished) {
        return course; // Already published
      }

      // Validate course is complete
      if (!course.title || !course.domain || !course.level) {
        throw new Error('Course is missing required fields');
      }

      if (!course.modules || course.modules.length === 0) {
        throw new Error('Course must have at least one module');
      }

      const updates = {
        isPublished: true,
        publishedAt: new Date().toISOString(),
        publishedBy: publishedBy,
        status: 'published'
      };

      const updatedCourse = await this.updateCourse(courseId, updates, publishedBy);

      // Log action
      logAction({
        action: 'COURSE_PUBLISHED',
        userId: publishedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Course',
        targetId: courseId,
        status: 'Success',
        details: {
          title: updatedCourse.title
        }
      });

      return updatedCourse;
    } catch (error) {
      console.error('Error publishing course:', error);
      throw error;
    }
  }

  /**
   * Unpublish a course
   * @param {string} courseId - Course ID
   * @param {string} unpublishedBy - ID of user unpublishing
   * @returns {Promise<object>} - Updated course
   */
  static async unpublishCourse(courseId, unpublishedBy = null) {
    try {
      const course = await this.getCourseById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      if (!course.isPublished) {
        return course; // Already unpublished
      }

      const updates = {
        isPublished: false,
        unpublishedAt: new Date().toISOString(),
        unpublishedBy: unpublishedBy,
        status: 'draft'
      };

      const updatedCourse = await this.updateCourse(courseId, updates, unpublishedBy);

      // Log action
      logAction({
        action: 'COURSE_UNPUBLISHED',
        userId: unpublishedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Course',
        targetId: courseId,
        status: 'Success',
        details: {
          title: updatedCourse.title
        }
      });

      return updatedCourse;
    } catch (error) {
      console.error('Error unpublishing course:', error);
      throw error;
    }
  }

  /**
   * Add module to a course
   * @param {string} courseId - Course ID
   * @param {object} moduleData - Module data
   * @param {string} addedBy - ID of user adding
   * @returns {Promise<object>} - Updated course
   */
  static async addModule(courseId, moduleData, addedBy = null) {
    try {
      const course = await this.getCourseById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const newModule = {
        id: `MOD-${Date.now()}`,
        title: moduleData.title,
        description: moduleData.description || '',
        order: (course.modules?.length || 0) + 1,
        lessons: moduleData.lessons || [],
        createdAt: new Date().toISOString(),
        createdBy: addedBy
      };

      const updates = {
        modules: [...(course.modules || []), newModule],
        updatedBy: addedBy,
        updatedAt: new Date().toISOString()
      };

      const updatedCourse = await this.updateCourse(courseId, updates, addedBy);

      // Log action
      logAction({
        action: 'MODULE_CREATED',
        userId: addedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Course',
        targetId: courseId,
        status: 'Success',
        details: {
          courseTitle: course.title,
          moduleTitle: newModule.title
        }
      });

      return updatedCourse;
    } catch (error) {
      console.error('Error adding module:', error);
      throw error;
    }
  }

  /**
   * Update a module in a course
   * @param {string} courseId - Course ID
   * @param {string} moduleId - Module ID
   * @param {object} updates - Updates to apply
   * @param {string} updatedBy - ID of user updating
   * @returns {Promise<object>} - Updated course
   */
  static async updateModule(courseId, moduleId, updates, updatedBy = null) {
    try {
      const course = await this.getCourseById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const updatedModules = course.modules.map(module => {
        if (module.id === moduleId) {
          return {
            ...module,
            ...updates,
            updatedAt: new Date().toISOString(),
            updatedBy: updatedBy
          };
        }
        return module;
      });

      const courseUpdates = {
        modules: updatedModules,
        updatedBy: updatedBy,
        updatedAt: new Date().toISOString()
      };

      const updatedCourse = await this.updateCourse(courseId, courseUpdates, updatedBy);

      // Log action
      // Log action
      logAction({
        action: 'MODULE_UPDATED',
        userId: updatedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Course',
        targetId: courseId,
        status: 'Success',
        details: {
          courseTitle: course.title,
          moduleId: moduleId,
          changes: Object.keys(updates)
        }
      });

      return updatedCourse;
    } catch (error) {
      console.error('Error updating module:', error);
      throw error;
    }
  }

  /**
   * Delete a module from a course
   * @param {string} courseId - Course ID
   * @param {string} moduleId - Module ID
   * @param {string} deletedBy - ID of user deleting
   * @returns {Promise<object>} - Updated course
   */
  static async deleteModule(courseId, moduleId, deletedBy = null) {
    try {
      const course = await this.getCourseById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const moduleToDelete = course.modules.find(m => m.id === moduleId);
      if (!moduleToDelete) {
        throw new Error('Module not found');
      }

      const updatedModules = course.modules.filter(m => m.id !== moduleId);

      const updates = {
        modules: updatedModules,
        updatedBy: deletedBy,
        updatedAt: new Date().toISOString()
      };

      const updatedCourse = await this.updateCourse(courseId, updates, deletedBy);

      // Log action
      logAction({
        action: 'MODULE_DELETED',
        userId: deletedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Course',
        targetId: courseId,
        status: 'Success',
        details: {
          courseTitle: course.title,
          moduleTitle: moduleToDelete.title
        }
      });

      return updatedCourse;
    } catch (error) {
      console.error('Error deleting module:', error);
      throw error;
    }
  }

  /**
   * Reorder modules in a course
   * @param {string} courseId - Course ID
   * @param {string} moduleId - Module ID to move
   * @param {number} newOrder - New order position (1-based)
   * @param {string} reorderedBy - ID of user reordering
   * @returns {Promise<object>} - Updated course
   */
  static async reorderModule(courseId, moduleId, newOrder, reorderedBy = null) {
    try {
      const course = await this.getCourseById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const moduleIndex = course.modules.findIndex(m => m.id === moduleId);
      if (moduleIndex === -1) {
        throw new Error('Module not found');
      }

      // Remove module from current position
      const [module] = course.modules.splice(moduleIndex, 1);

      // Insert at new position (adjust for 1-based vs 0-based)
      const newIndex = Math.max(0, Math.min(newOrder - 1, course.modules.length));
      course.modules.splice(newIndex, 0, module);

      // Update order numbers
      const updatedModules = course.modules.map((m, index) => ({
        ...m,
        order: index + 1
      }));

      const updates = {
        modules: updatedModules,
        updatedBy: reorderedBy,
        updatedAt: new Date().toISOString()
      };

      const updatedCourse = await this.updateCourse(courseId, updates, reorderedBy);

      // Log action
      logAction({
        action: 'MODULE_REORDERED',
        userId: reorderedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Course',
        targetId: courseId,
        status: 'Success',
        details: {
          courseTitle: course.title,
          moduleId: moduleId,
          oldOrder: moduleIndex + 1,
          newOrder: newIndex + 1
        }
      });

      return updatedCourse;
    } catch (error) {
      console.error('Error reordering module:', error);
      throw error;
    }
  }

  /**
   * Add lesson to a module
   * @param {string} courseId - Course ID
   * @param {string} moduleId - Module ID
   * @param {object} lessonData - Lesson data
   * @param {string} addedBy - ID of user adding
   * @returns {Promise<object>} - Updated course
   */
  static async addLesson(courseId, moduleId, lessonData, addedBy = null) {
    try {
      const course = await this.getCourseById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const module = course.modules.find(m => m.id === moduleId);
      if (!module) {
        throw new Error('Module not found');
      }

      const newLesson = {
        id: `LESSON-${Date.now()}`,
        title: lessonData.title,
        description: lessonData.description || '',
        content: lessonData.content || '',
        estimatedTime: lessonData.estimatedTime || 0,
        difficulty: lessonData.difficulty || DIFFICULTY_LEVELS.BEGINNER,
        order: (module.lessons?.length || 0) + 1,
        domain: lessonData.domain || course.domain,
        level: lessonData.level || course.level,
        prerequisites: lessonData.prerequisites || [],
        learningObjectives: lessonData.learningObjectives || [],
        resources: lessonData.resources || [],
        externalResources: lessonData.externalResources || [],
        isPublished: lessonData.isPublished || false,
        completionStatus: false,
        createdAt: new Date().toISOString(),
        createdBy: addedBy
      };

      const updatedModules = course.modules.map(m => {
        if (m.id === moduleId) {
          return {
            ...m,
            lessons: [...(m.lessons || []), newLesson]
          };
        }
        return m;
      });

      const updates = {
        modules: updatedModules,
        updatedBy: addedBy,
        updatedAt: new Date().toISOString()
      };

      const updatedCourse = await this.updateCourse(courseId, updates, addedBy);

      // Log action
      logAction({
        action: 'LESSON_CREATED',
        userId: addedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Course',
        targetId: courseId,
        status: 'Success',
        details: {
          courseTitle: course.title,
          moduleTitle: module.title,
          lessonTitle: newLesson.title
        }
      });

      return updatedCourse;
    } catch (error) {
      console.error('Error adding lesson:', error);
      throw error;
    }
  }

  /**
   * Update a lesson
   * @param {string} courseId - Course ID
   * @param {string} moduleId - Module ID
   * @param {string} lessonId - Lesson ID
   * @param {object} updates - Updates to apply
   * @param {string} updatedBy - ID of user updating
   * @returns {Promise<object>} - Updated course
   */
  static async updateLesson(courseId, moduleId, lessonId, updates, updatedBy = null) {
    try {
      const course = await this.getCourseById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const updatedModules = course.modules.map(module => {
        if (module.id !== moduleId) return module;

        const updatedLessons = module.lessons.map(lesson => {
          if (lesson.id === lessonId) {
            return {
              ...lesson,
              ...updates,
              updatedAt: new Date().toISOString(),
              updatedBy: updatedBy
            };
          }
          return lesson;
        });

        return {
          ...module,
          lessons: updatedLessons
        };
      });

      const courseUpdates = {
        modules: updatedModules,
        updatedBy: updatedBy,
        updatedAt: new Date().toISOString()
      };

      const updatedCourse = await this.updateCourse(courseId, courseUpdates, updatedBy);

      // Log action
      logAction({
        action: 'LESSON_UPDATED',
        userId: updatedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Course',
        targetId: courseId,
        status: 'Success',
        details: {
          courseTitle: course.title,
          lessonId: lessonId,
          changes: Object.keys(updates)
        }
      });

      return updatedCourse;
    } catch (error) {
      console.error('Error updating lesson:', error);
      throw error;
    }
  }

  /**
   * Delete a lesson
   * @param {string} courseId - Course ID
   * @param {string} moduleId - Module ID
   * @param {string} lessonId - Lesson ID
   * @param {string} deletedBy - ID of user deleting
   * @returns {Promise<object>} - Updated course
   */
  static async deleteLesson(courseId, moduleId, lessonId, deletedBy = null) {
    try {
      const course = await this.getCourseById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const module = course.modules.find(m => m.id === moduleId);
      if (!module) {
        throw new Error('Module not found');
      }

      const lessonToDelete = module.lessons.find(l => l.id === lessonId);
      if (!lessonToDelete) {
        throw new Error('Lesson not found');
      }

      const updatedLessons = module.lessons.filter(l => l.id !== lessonId);

      const updatedModules = course.modules.map(m => {
        if (m.id === moduleId) {
          return {
            ...m,
            lessons: updatedLessons
          };
        }
        return m;
      });

      const updates = {
        modules: updatedModules,
        updatedBy: deletedBy,
        updatedAt: new Date().toISOString()
      };

      const updatedCourse = await this.updateCourse(courseId, updates, deletedBy);

      // Log action
      logAction({
        action: 'LESSON_DELETED',
        userId: deletedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Course',
        targetId: courseId,
        status: 'Success',
        details: {
          courseTitle: course.title,
          moduleTitle: module.title,
          lessonTitle: lessonToDelete.title
        }
      });

      return updatedCourse;
    } catch (error) {
      console.error('Error deleting lesson:', error);
      throw error;
    }
  }

  /**
   * Reorder lessons in a module
   * @param {string} courseId - Course ID
   * @param {string} moduleId - Module ID
   * @param {string} lessonId - Lesson ID to move
   * @param {number} newOrder - New order position (1-based)
   * @param {string} reorderedBy - ID of user reordering
   * @returns {Promise<object>} - Updated course
   */
  static async reorderLesson(courseId, moduleId, lessonId, newOrder, reorderedBy = null) {
    try {
      const course = await this.getCourseById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const module = course.modules.find(m => m.id === moduleId);
      if (!module) {
        throw new Error('Module not found');
      }

      const lessonIndex = module.lessons.findIndex(l => l.id === lessonId);
      if (lessonIndex === -1) {
        throw new Error('Lesson not found');
      }

      // Remove lesson from current position
      const [lesson] = module.lessons.splice(lessonIndex, 1);

      // Insert at new position
      const newIndex = Math.max(0, Math.min(newOrder - 1, module.lessons.length));
      module.lessons.splice(newIndex, 0, lesson);

      // Update order numbers
      const updatedLessons = module.lessons.map((l, index) => ({
        ...l,
        order: index + 1
      }));

      const updatedModules = course.modules.map(m => {
        if (m.id === moduleId) {
          return {
            ...m,
            lessons: updatedLessons
          };
        }
        return m;
      });

      const updates = {
        modules: updatedModules,
        updatedBy: reorderedBy,
        updatedAt: new Date().toISOString()
      };

      const updatedCourse = await this.updateCourse(courseId, updates, reorderedBy);

      // Log action
      // Log action
      logAction({
        action: 'LESSON_REORDERED',
        userId: reorderedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Course',
        targetId: courseId,
        status: 'Success',
        details: {
          courseTitle: course.title,
          moduleTitle: module.title,
          lessonId: lessonId,
          oldOrder: lessonIndex + 1,
          newOrder: newIndex + 1
        }
      });

      return updatedCourse;
    } catch (error) {
      console.error('Error reordering lesson:', error);
      throw error;
    }
  }

  /**
   * Mark lesson as complete for a user
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID
   * @param {string} moduleId - Module ID
   * @param {string} lessonId - Lesson ID
   * @returns {Promise<object>} - Updated user progress
   */
  static async markLessonComplete(userId, courseId, moduleId, lessonId) {
    try {
      const user = await UserService.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get current progress
      const progress = await UserService.getProgress(userId);

      // Initialize learning progress if not exists
      if (!progress.learning) {
        progress.learning = { completed: 0, total: 0, completedLessons: [] };
      }

      // Check if lesson is already marked complete
      if (progress.learning.completedLessons.includes(lessonId)) {
        return progress;
      }

      // Mark lesson as complete
      progress.learning.completedLessons.push(lessonId);
      progress.learning.completed = progress.learning.completedLessons.length;

      // Get total lessons for the course
      const course = await this.getCourseById(courseId);
      if (course) {
        const totalLessons = course.modules.reduce(
          (sum, module) => sum + (module.lessons?.length || 0),
          0
        );
        progress.learning.total = totalLessons;
      }

      // Update progress
      const updatedProgress = await UserService.updateProgress(userId, progress);

      // Log action
      logAction({
        action: 'LESSON_COMPLETED',
        userId: userId,
        role: user.role,
        target: 'Lesson',
        targetId: lessonId,
        status: 'Success',
        details: {
          courseId: courseId,
          moduleId: moduleId
        }
      });

      return updatedProgress;
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      throw error;
    }
  }

  /**
   * Mark lesson as incomplete for a user
   * @param {string} userId - User ID
   * @param {string} lessonId - Lesson ID
   * @returns {Promise<object>} - Updated user progress
   */
  static async markLessonIncomplete(userId, lessonId) {
    try {
      const user = await UserService.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get current progress
      const progress = await UserService.getProgress(userId);

      if (!progress.learning || !progress.learning.completedLessons) {
        return progress;
      }

      // Remove lesson from completed list
      progress.learning.completedLessons = progress.learning.completedLessons.filter(
        id => id !== lessonId
      );
      progress.learning.completed = progress.learning.completedLessons.length;

      // Update progress
      const updatedProgress = await UserService.updateProgress(userId, progress);

      // Log action
      logAction({
        action: 'LESSON_MARKED_INCOMPLETE',
        userId: userId,
        role: user.role,
        target: 'Lesson',
        targetId: lessonId,
        status: 'Success'
      });

      return updatedProgress;
    } catch (error) {
      console.error('Error marking lesson incomplete:', error);
      throw error;
    }
  }

  /**
   * Check if user has completed a lesson
   * @param {string} userId - User ID
   * @param {string} lessonId - Lesson ID
   * @returns {Promise<boolean>} - True if lesson is completed
   */
  static async isLessonCompleted(userId, lessonId) {
    try {
      const progress = await UserService.getProgress(userId);
      return progress.learning?.completedLessons?.includes(lessonId) || false;
    } catch (error) {
      console.error('Error checking lesson completion:', error);
      return false;
    }
  }

  /**
   * Enroll user in a course
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID
   * @param {string} enrolledBy - ID of user enrolling
   * @returns {Promise<object>} - Updated user
   */
  static async enrollUser(userId, courseId, enrolledBy = null) {
    try {
      const user = await UserService.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const course = await this.getCourseById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      // Check if already enrolled
      if (user.enrolledCourses?.includes(courseId) || user.courses?.includes(courseId)) {
        return user;
      }

      // Add to enrolled courses
      const updates = {
        enrolledCourses: [...(user.enrolledCourses || []), courseId],
        courses: [...(user.courses || []), courseId],
        lastEnrolled: new Date().toISOString(),
        enrolledBy: enrolledBy
      };

      const updatedUser = await UserService.updateUser(userId, updates, enrolledBy);

      // Add user to course's student list
      const courseUpdates = {
        students: [...new Set([...(course.students || []), userId])],
        enrolledStudents: [...new Set([...(course.enrolledStudents || []), userId])],
        updatedBy: enrolledBy,
        updatedAt: new Date().toISOString()
      };

      await this.updateCourse(courseId, courseUpdates, enrolledBy);

      // Log action
      logAction({
        action: 'USER_ENROLLED_IN_COURSE',
        userId: enrolledBy || userId,
        role: ROLES.FACULTY,
        target: 'Course',
        targetId: courseId,
        status: 'Success',
        details: {
          userId: userId,
          courseTitle: course.title
        }
      });

      return updatedUser;
    } catch (error) {
      console.error('Error enrolling user:', error);
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
  static async unenrollUser(userId, courseId, unenrolledBy = null) {
    try {
      const user = await UserService.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const course = await this.getCourseById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      // Remove from enrolled courses
      const updates = {
        enrolledCourses: (user.enrolledCourses || []).filter(id => id !== courseId),
        courses: (user.courses || []).filter(id => id !== courseId),
        lastUnenrolled: new Date().toISOString(),
        unenrolledBy: unenrolledBy
      };

      const updatedUser = await UserService.updateUser(userId, updates, unenrolledBy);

      // Remove user from course's student list
      const courseUpdates = {
        students: (course.students || []).filter(id => id !== userId),
        enrolledStudents: (course.enrolledStudents || []).filter(id => id !== userId),
        updatedBy: unenrolledBy,
        updatedAt: new Date().toISOString()
      };

      await this.updateCourse(courseId, courseUpdates, unenrolledBy);

      // Log action
      logAction({
        action: 'USER_UNENROLLED_FROM_COURSE',
        userId: unenrolledBy || userId,
        role: ROLES.FACULTY,
        target: 'Course',
        targetId: courseId,
        status: 'Success',
        details: {
          userId: userId,
          courseTitle: course.title
        }
      });

      return updatedUser;
    } catch (error) {
      console.error('Error unenrolling user:', error);
      throw error;
    }
  }

  /**
   * Get users enrolled in a course
   * @param {string} courseId - Course ID
   * @returns {Promise<Array>} - Array of users
   */
  static async getEnrolledUsers(courseId) {
    try {
      const course = await this.getCourseById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const allUsers = await UserService.getAllUsers();
      const enrolledUserIds = [...new Set([
        ...(course.students || []),
        ...(course.enrolledStudents || [])
      ])];

      return allUsers.filter(user => enrolledUserIds.includes(user.id));
    } catch (error) {
      console.error('Error getting enrolled users:', error);
      throw error;
    }
  }

  /**
   * Get courses for a user
   * @param {string} userId - User ID
   * @param {object} options - Filter options
   * @returns {Promise<Array>} - Array of courses
   */
  static async getCoursesForUser(userId, options = {}) {
    try {
      const user = await UserService.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const allCourses = await this.getAllCourses(options);
      const enrolledCourseIds = [...new Set([
        ...(user.courses || []),
        ...(user.enrolledCourses || [])
      ])];

      // Filter by enrolled courses
      let userCourses = allCourses.filter(course =>
        enrolledCourseIds.includes(course.id)
      );

      // Apply additional filters if provided
      if (options.completed !== undefined) {
        const progress = await UserService.getProgress(userId);
        const completedCourseIds = progress.courses?.completed || [];

        userCourses = userCourses.filter(course =>
          options.completed ? completedCourseIds.includes(course.id) :
          !completedCourseIds.includes(course.id)
        );
      }

      return userCourses;
    } catch (error) {
      console.error('Error getting courses for user:', error);
      throw error;
    }
  }

  /**
   * Get user's progress for a course
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID
   * @returns {Promise<object>} - Course progress
   */
  static async getCourseProgress(userId, courseId) {
    try {
      const user = await UserService.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const course = await this.getCourseById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const progress = await UserService.getProgress(userId);

      // Calculate lesson completion
      const totalLessons = course.modules.reduce(
        (sum, module) => sum + (module.lessons?.length || 0),
        0
      );

      const completedLessons = progress.learning?.completedLessons || [];
      const courseLessons = course.modules.flatMap(module =>
        module.lessons.map(lesson => lesson.id)
      );

      const courseCompletedLessons = completedLessons.filter(id =>
        courseLessons.includes(id)
      );

      const lessonProgress = {
        completed: courseCompletedLessons.length,
        total: totalLessons,
        percentage: totalLessons > 0 ?
          Math.round((courseCompletedLessons.length / totalLessons) * 100) : 0
      };

      // Calculate module completion
      const totalModules = course.modules?.length || 0;
      const completedModules = course.modules.filter(module => {
        const moduleLessons = module.lessons.map(l => l.id);
        const allCompleted = moduleLessons.every(id =>
          courseCompletedLessons.includes(id)
        );
        return allCompleted;
      }).length;

      const moduleProgress = {
        completed: completedModules,
        total: totalModules,
        percentage: totalModules > 0 ?
          Math.round((completedModules / totalModules) * 100) : 0
      };

      // Check if course is completed
      const isCompleted = lessonProgress.completed === lessonProgress.total &&
                        lessonProgress.total > 0;

      return {
        userId: userId,
        courseId: courseId,
        courseTitle: course.title,
        lessonProgress,
        moduleProgress,
        isCompleted,
        lastAccessed: progress.lastCourseAccess?.[courseId] || null
      };
    } catch (error) {
      console.error('Error getting course progress:', error);
      throw error;
    }
  }

  /**
   * Search courses with advanced filtering
   * @param {object} options - Search options
   * @returns {Promise<object>} - Search results with pagination
   */
  static async searchCourses(options = {}) {
    try {
      const {
        query = '',
        domain,
        level,
        difficulty,
        published,
        facultyId,
        page = 1,
        limit = 10,
        sortBy = 'title',
        sortOrder = 'asc'
      } = options;

      let courses = await this.getAllCourses({
        domain,
        level,
        difficulty,
        published,
        facultyId,
        search: query
      });

      // Sort
      courses.sort((a, b) => {
        let aVal, bVal;

        switch (sortBy) {
          case 'title':
            aVal = a.title.toLowerCase();
            bVal = b.title.toLowerCase();
            break;
          case 'level':
            aVal = a.level;
            bVal = b.level;
            break;
          case 'difficulty':
            aVal = DIFFICULTY_LEVELS[a.difficulty] || 0;
            bVal = DIFFICULTY_LEVELS[b.difficulty] || 0;
            break;
          case 'createdAt':
            aVal = new Date(a.createdAt);
            bVal = new Date(b.createdAt);
            break;
          case 'updatedAt':
            aVal = new Date(a.updatedAt);
            bVal = new Date(b.updatedAt);
            break;
          case 'enrollment':
            aVal = (a.students?.length || 0) + (a.enrolledStudents?.length || 0);
            bVal = (b.students?.length || 0) + (b.enrolledStudents?.length || 0);
            break;
          default:
            aVal = a.title.toLowerCase();
            bVal = b.title.toLowerCase();
        }

        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });

      // Paginate
      const startIndex = (page - 1) * limit;
      const paginatedCourses = courses.slice(startIndex, startIndex + limit);
      const total = courses.length;
      const totalPages = Math.ceil(total / limit);

      return {
        courses: paginatedCourses,
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
      console.error('Error searching courses:', error);
      throw error;
    }
  }

  /**
   * Get course statistics
   * @param {string} courseId - Course ID
   * @returns {Promise<object>} - Course statistics
   */
  static async getCourseStats(courseId) {
    try {
      const course = await this.getCourseById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const allUsers = await UserService.getAllUsers();
      const enrolledUsers = await this.getEnrolledUsers(courseId);

      // Calculate completion statistics
      const completionStats = {
        totalStudents: enrolledUsers.length,
        completed: 0,
        inProgress: 0,
        notStarted: 0
      };

      for (const user of enrolledUsers) {
        const progress = await this.getCourseProgress(user.id, courseId);
        if (progress.isCompleted) {
          completionStats.completed++;
        } else if (progress.lessonProgress.completed > 0) {
          completionStats.inProgress++;
        } else {
          completionStats.notStarted++;
        }
      }

      // Calculate average progress
      const avgProgress = enrolledUsers.length > 0 ?
        Math.round(completionStats.completed / enrolledUsers.length * 100) : 0;

      // Get module statistics
      const moduleStats = course.modules.map(module => {
        const totalLessons = module.lessons?.length || 0;
        let completedCount = 0;

        for (const user of enrolledUsers) {
          const progress = await UserService.getProgress(user.id);
          const moduleLessons = module.lessons.map(l => l.id);
          const allCompleted = moduleLessons.every(lessonId =>
            progress.learning?.completedLessons?.includes(lessonId)
          );
          if (allCompleted) completedCount++;
        }

        return {
          id: module.id,
          title: module.title,
          totalLessons: totalLessons,
          completedBy: completedCount,
          completionRate: totalLessons > 0 ?
            Math.round((completedCount / enrolledUsers.length) * 100) : 0
        };
      });

      // Get time spent statistics
      const timeStats = {
        totalEstimatedTime: course.modules.reduce(
          (sum, module) => sum + (module.estimatedTime || 0),
          0
        ),
        avgTimeSpent: 0 // Would require tracking in a real app
      };

      // Get difficulty distribution
      const difficultyDistribution = course.modules.reduce((acc, module) => {
        module.lessons.forEach(lesson => {
          const difficulty = lesson.difficulty || DIFFICULTY_LEVELS.BEGINNER;
          acc[difficulty] = (acc[difficulty] || 0) + 1;
        });
        return acc;
      }, {});

      return {
        courseId: course.id,
        title: course.title,
        domain: course.domain,
        level: course.level,
        levelName: course.levelName,
        totalLessons: course.modules.reduce(
          (sum, module) => sum + (module.lessons?.length || 0),
          0
        ),
        totalModules: course.modules?.length || 0,
        enrollment: completionStats,
        averageProgress: avgProgress,
        moduleStats,
        timeStats,
        difficultyDistribution,
        isPublished: course.isPublished,
        createdAt: course.createdAt,
        createdBy: course.createdBy
      };
    } catch (error) {
      console.error('Error getting course stats:', error);
      throw error;
    }
  }

  /**
   * Get all courses for a faculty member
   * @param {string} facultyId - Faculty ID
   * @returns {Promise<Array>} - Array of courses
   */
  static async getCoursesForFaculty(facultyId) {
    try {
      const faculty = await UserService.getFacultyById(facultyId);
      if (!faculty) {
        throw new Error('Faculty not found');
      }

      const allCourses = await this.getAllCourses();
      const facultyCourseIds = [...new Set([
        ...(faculty.courses || []),
        faculty.userId // Courses created by this faculty
      ])];

      // Also include courses where faculty is in facultyIds
      const additionalCourses = allCourses.filter(course =>
        course.facultyIds && course.facultyIds.includes(facultyId)
      );

      const courseIds = [...new Set([
        ...facultyCourseIds,
        ...additionalCourses.map(c => c.id)
      ])];

      return allCourses.filter(course => courseIds.includes(course.id));
    } catch (error) {
      console.error('Error getting courses for faculty:', error);
      throw error;
    }
  }

  /**
   * Get popular courses (most enrolled)
   * @param {number} limit - Number of courses to return
   * @returns {Promise<Array>} - Array of popular courses
   */
  static async getPopularCourses(limit = 5) {
    try {
      const courses = await this.getAllCourses({ published: true });
      return courses
        .map(course => ({
          ...course,
          enrollmentCount: (course.students?.length || 0) + (course.enrolledStudents?.length || 0)
        }))
        .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting popular courses:', error);
      throw error;
    }
  }

  /**
   * Get recommended courses for a user
   * @param {string} userId - User ID
   * @param {number} limit - Number of courses to return
   * @returns {Promise<Array>} - Array of recommended courses
   */
  static async getRecommendedCourses(userId, limit = 5) {
    try {
      const user = await UserService.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const progress = await UserService.getProgress(userId);
      const enrolledCourses = await this.getCoursesForUser(userId);

      const allCourses = await this.getAllCourses({
        published: true,
        level: user.level // Recommend courses at user's level
      });

      // Filter out already enrolled courses
      const enrolledCourseIds = new Set([
        ...(enrolledCourses.map(c => c.id)),
        ...(progress.courses?.completed || [])
      ]);

      const unenrolledCourses = allCourses.filter(
        course => !enrolledCourseIds.has(course.id)
      );

      // Score courses based on relevance
      const scoredCourses = unenrolledCourses.map(course => {
        let score = 0;

        // Same domain as user's current courses
        if (enrolledCourses.some(c => c.domain === course.domain)) {
          score += 3;
        }

        // Next level after user's current level
        if (course.level === user.level + 1) {
          score += 2;
        }

        // Same level as user
        if (course.level === user.level) {
          score += 1;
        }

        // Has prerequisites that user has completed
        if (course.prerequisites && course.prerequisites.length > 0) {
          const completedCourseIds = progress.courses?.completed || [];
          const prerequisitesMet = course.prerequisites.every(prereq =>
            completedCourseIds.includes(prereq)
          );
          if (prerequisitesMet) {
            score += 2;
          }
        }

        // No prerequisites (easier to start)
        if (!course.prerequisites || course.prerequisites.length === 0) {
          score += 1;
        }

        return { ...course, score };
      });

      // Sort by score and return top results
      return scoredCourses
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(c => {
          const { score, ...course } = c;
          return course;
        });
    } catch (error) {
      console.error('Error getting recommended courses:', error);
      throw error;
    }
  }

  /**
   * Get courses by domain
   * @param {string} domain - Cybersecurity domain
   * @returns {Promise<Array>} - Array of courses in the domain
   */
  static async getCoursesByDomain(domain) {
    try {
      if (!CYBER_DOMAINS.includes(domain)) {
        throw new Error('Invalid domain');
      }

      const courses = await this.getAllCourses({
        domain,
        published: true
      });

      // Sort by level
      return courses.sort((a, b) => a.level - b.level);
    } catch (error) {
      console.error('Error getting courses by domain:', error);
      throw error;
    }
  }

  /**
   * Get course prerequisites
   * @param {string} courseId - Course ID
   * @returns {Promise<Array>} - Array of prerequisite courses
   */
  static async getCoursePrerequisites(courseId) {
    try {
      const course = await this.getCourseById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      if (!course.prerequisites || course.prerequisites.length === 0) {
        return [];
      }

      const allCourses = await this.getAllCourses();
      return allCourses.filter(c =>
        course.prerequisites.includes(c.id)
      );
    } catch (error) {
      console.error('Error getting course prerequisites:', error);
      throw error;
    }
  }

  /**
   * Check if user meets course prerequisites
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID
   * @returns {Promise<object>} - Result with status and missing prerequisites
   */
  static async checkPrerequisites(userId, courseId) {
    try {
      const user = await UserService.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const course = await this.getCourseById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      if (!course.prerequisites || course.prerequisites.length === 0) {
        return {
          meetsRequirements: true,
          missingPrerequisites: []
        };
      }

      const progress = await UserService.getProgress(userId);
      const completedCourseIds = progress.courses?.completed || [];

      const missingPrerequisites = course.prerequisites.filter(
        prereqId => !completedCourseIds.includes(prereqId)
      );

      // Get details of missing prerequisites
      const allCourses = await this.getAllCourses();
      const missingPrereqDetails = missingPrerequisites.map(id => {
        const prereqCourse = allCourses.find(c => c.id === id);
        return prereqCourse ? {
          id: prereqCourse.id,
          title: prereqCourse.title,
          level: prereqCourse.level,
          levelName: prereqCourse.levelName
        } : { id };
      });

      return {
        meetsRequirements: missingPrerequisites.length === 0,
        missingPrerequisites: missingPrereqDetails,
        totalPrerequisites: course.prerequisites.length
      };
    } catch (error) {
      console.error('Error checking prerequisites:', error);
      throw error;
    }
  }

  /**
   * Get course completion certificate eligibility
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID
   * @returns {Promise<object>} - Eligibility status
   */
  static async checkCertificateEligibility(userId, courseId) {
    try {
      const user = await UserService.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const course = await this.getCourseById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      // Check if course is completed
      const progress = await this.getCourseProgress(userId, courseId);
      if (!progress.isCompleted) {
        return {
          eligible: false,
          reason: 'Course not completed',
          completionPercentage: progress.lessonProgress.percentage
        };
      }

      // Check if user has passed the final assessment
      const assessments = await getAssessments();
      const courseAssessments = assessments.filter(a =>
        a.courseId === courseId &&
        (a.type === 'Final Assessment' || a.title.includes(course.title))
      );

      if (courseAssessments.length > 0) {
        const userResults = await UserService.getAllUsers();
        const results = userResults.flatMap(u =>
          u.results || []
        ).filter(r => r.studentId === userId);

        const passedAssessment = courseAssessments.some(assessment =>
          results.some(result =>
            result.assessmentId === assessment.id &&
            result.status === 'Passed'
          )
        );

        if (!passedAssessment) {
          return {
            eligible: false,
            reason: 'Final assessment not passed',
            hasFinalAssessment: true
          };
        }
      }

      // Check minimum score requirement
      if (course.minimumScore && course.minimumScore > 0) {
        const userStats = await this.getCourseStats(courseId);
        const userResult = userStats.enrollment.completed.find(
          u => u.userId === userId
        );

        if (userResult && userResult.score < course.minimumScore) {
          return {
            eligible: false,
            reason: `Minimum score of ${course.minimumScore}% not met`,
            userScore: userResult.score
          };
        }
      }

      // User is eligible
      return {
        eligible: true,
        reason: 'All requirements met',
        completionDate: progress.lessonProgress.completed > 0 ?
          new Date().toISOString() : null
      };
    } catch (error) {
      console.error('Error checking certificate eligibility:', error);
      throw error;
    }
  }

  /**
   * Duplicate a course
   * @param {string} courseId - Course ID to duplicate
   * @param {object} options - Duplication options
   * @param {string} options.newTitle - New title for the duplicate
   * @param {string} duplicatedBy - ID of user duplicating
   * @returns {Promise<object>} - New duplicated course
   */
  static async duplicateCourse(courseId, options = {}, duplicatedBy = null) {
    try {
      const originalCourse = await this.getCourseById(courseId);
      if (!originalCourse) {
        throw new Error('Course not found');
      }

      // Create new course with modified data
      const newCourseData = {
        ...originalCourse,
        id: undefined, // Will be generated
        slug: undefined, // Will be generated
        title: options.newTitle || `${originalCourse.title} (Copy)`,
        isPublished: false,
        status: 'draft',
        students: [],
        enrolledStudents: [],
        facultyId: duplicatedBy,
        facultyIds: [duplicatedBy],
        createdBy: duplicatedBy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1
      };

      // Remove system fields
      delete newCourseData.id;
      delete newCourseData.slug;
      delete newCourseData.createdAt;
      delete newCourseData.updatedAt;
      delete newCourseData.version;

      // Create the new course
      const newCourse = await this.createCourse(newCourseData, duplicatedBy);

      // Log action
      logAction({
        action: 'COURSE_DUPLICATED',
        userId: duplicatedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Course',
        targetId: newCourse.id,
        status: 'Success',
        details: {
          originalCourseId: courseId,
          originalTitle: originalCourse.title,
          newTitle: newCourse.title
        }
      });

      return newCourse;
    } catch (error) {
      console.error('Error duplicating course:', error);
      throw error;
    }
  }

  /**
   * Get course outline (simplified structure for display)
   * @param {string} courseId - Course ID
   * @returns {Promise<object>} - Course outline
   */
  static async getCourseOutline(courseId) {
    try {
      const course = await this.getCourseById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const outline = {
        id: course.id,
        title: course.title,
        description: course.description,
        domain: course.domain,
        level: course.level,
        levelName: course.levelName,
        difficulty: course.difficulty,
        estimatedTime: course.estimatedTime,
        prerequisites: course.prerequisites,
        learningObjectives: course.learningObjectives,
        isPublished: course.isPublished,
        modules: course.modules?.map(module => ({
          id: module.id,
          title: module.title,
          description: module.description,
          estimatedTime: module.estimatedTime,
          lessons: module.lessons?.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            estimatedTime: lesson.estimatedTime,
            difficulty: lesson.difficulty,
            prerequisites: lesson.prerequisites
          })) || []
        })) || []
      };

      return outline;
    } catch (error) {
      console.error('Error getting course outline:', error);
      throw error;
    }
  }

  /**
   * Get next recommended lesson for a user in a course
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID
   * @returns {Promise<object|null>} - Next recommended lesson or null
   */
  static async getNextRecommendedLesson(userId, courseId) {
    try {
      const user = await UserService.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const course = await this.getCourseById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const progress = await UserService.getProgress(userId);
      const completedLessonIds = progress.learning?.completedLessons || [];

      // Flatten all lessons from all modules
      const allLessons = course.modules?.flatMap(module =>
        module.lessons?.map(lesson => ({
          ...lesson,
          moduleId: module.id,
          moduleTitle: module.title,
          moduleOrder: module.order
        })) || []
      ) || [];

      if (allLessons.length === 0) {
        return null;
      }

      // Sort by module order and lesson order
      allLessons.sort((a, b) => {
        if (a.moduleOrder !== b.moduleOrder) {
          return a.moduleOrder - b.moduleOrder;
        }
        return (a.order || 0) - (b.order || 0);
      });

      // Find first incomplete lesson
      for (const lesson of allLessons) {
        if (!completedLessonIds.includes(lesson.id)) {
          // Check if prerequisites are met
          if (lesson.prerequisites && lesson.prerequisites.length > 0) {
            const prerequisitesMet = lesson.prerequisites.every(prereqId =>
              completedLessonIds.includes(prereqId)
            );

            if (!prerequisitesMet) {
              continue; // Skip this lesson, try next
            }
          }

          return {
            ...lesson,
            isNext: true,
            reason: 'Next in sequence'
          };
        }
      }

      // All lessons completed
      return null;
    } catch (error) {
      console.error('Error getting next recommended lesson:', error);
      throw error;
    }
  }

  /**
   * Get course completion percentage for a user
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID
   * @returns {Promise<number>} - Completion percentage (0-100)
   */
  static async getCourseCompletionPercentage(userId, courseId) {
    try {
      const progress = await this.getCourseProgress(userId, courseId);
      return progress.lessonProgress.percentage;
    } catch (error) {
      console.error('Error getting course completion percentage:', error);
      throw error;
    }
  }

  /**
   * Get all domains with course counts
   * @returns {Promise<Array>} - Array of domains with counts
   */
  static async getDomainsWithCounts() {
    try {
      const courses = await this.getAllCourses({ published: true });
      const domainCounts = {};

      // Initialize all domains with 0
      CYBER_DOMAINS.forEach(domain => {
        domainCounts[domain] = 0;
      });

      // Count courses per domain
      courses.forEach(course => {
        if (domainCounts[course.domain] !== undefined) {
          domainCounts[course.domain]++;
        }
      });

      return Object.entries(domainCounts).map(([domain, count]) => ({
        domain,
        count,
        courses: courses.filter(c => c.domain === domain)
      }));
    } catch (error) {
      console.error('Error getting domains with counts:', error);
      throw error;
    }
  }

  /**
   * Get course difficulty distribution
   * @returns {Promise<object>} - Difficulty distribution
   */
  static async getDifficultyDistribution() {
    try {
      const courses = await this.getAllCourses({ published: true });
      const distribution = {
        [DIFFICULTY_LEVELS.BEGINNER]: 0,
        [DIFFICULTY_LEVELS.EASY]: 0,
        [DIFFICULTY_LEVELS.MEDIUM]: 0,
        [DIFFICULTY_LEVELS.HARD]: 0,
        [DIFFICULTY_LEVELS.EXPERT]: 0
      };

      courses.forEach(course => {
        if (distribution[course.difficulty] !== undefined) {
          distribution[course.difficulty]++;
        }
      });

      return distribution;
    } catch (error) {
      console.error('Error getting difficulty distribution:', error);
      throw error;
    }
  }

  /**
   * Get level progression path
   * @returns {Promise<Array>} - Array of levels with courses
   */
  static async getLevelProgressionPath() {
    try {
      const courses = await this.getAllCourses({ published: true });

      // Group courses by level
      const levels = {};
      for (let i = 1; i <= 12; i++) {
        levels[i] = {
          level: i,
          name: LEVELS[i] || `Level ${i}`,
          courses: courses.filter(c => c.level === i)
        };
      }

      return Object.values(levels);
    } catch (error) {
      console.error('Error getting level progression path:', error);
      throw error;
    }
  }

  /**
   * Export course data (for backup or reporting)
   * @param {string} courseId - Course ID
   * @returns {Promise<object>} - Complete course data
   */
  static async exportCourse(courseId) {
    try {
      const course = await this.getCourseById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const enrolledUsers = await this.getEnrolledUsers(courseId);
      const userStats = await Promise.all(
        enrolledUsers.map(user => this.getCourseProgress(user.id, courseId))
      );

      const courseData = {
        course: {
          ...course,
          createdAt: course.createdAt,
          updatedAt: course.updatedAt
        },
        enrolledUsers: enrolledUsers.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          enrollmentDate: user.enrolledCourses?.find(id => id === courseId)?.enrollmentDate
        })),
        statistics: await this.getCourseStats(courseId),
        userProgress: userStats,
        exportDate: new Date().toISOString()
      };

      return courseData;
    } catch (error) {
      console.error('Error exporting course:', error);
      throw error;
    }
  }

  /**
   * Get courses with upcoming deadlines for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - Array of courses with upcoming deadlines
   */
  static async getCoursesWithDeadlines(userId) {
    try {
      const enrolledCourses = await this.getCoursesForUser(userId);
      const schedules = await this.getAllSchedules();

      const now = new Date();
      const upcomingDeadlines = [];

      for (const course of enrolledCourses) {
        // Find assessments for this course with deadlines
        const courseAssessments = schedules.filter(s =>
          s.courseId === course.id &&
          s.type === 'Assessment' &&
          s.endDate && new Date(s.endDate) > now
        );

        if (courseAssessments.length > 0) {
          // Get the soonest deadline
          const soonestDeadline = courseAssessments.reduce((soonest, current) =>
            new Date(current.endDate) < new Date(soonest.endDate) ? current : soonest
          );

          const timeRemaining = new Date(soonestDeadline.endDate) - now;
          const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));

          upcomingDeadlines.push({
            courseId: course.id,
            courseTitle: course.title,
            courseLevel: course.level,
            assessmentId: soonestDeadline.id,
            assessmentTitle: soonestDeadline.title,
            deadline: soonestDeadline.endDate,
            daysRemaining,
            isOverdue: daysRemaining < 0
          });
        }
      }

      // Sort by deadline (soonest first)
      return upcomingDeadlines.sort((a, b) =>
        new Date(a.deadline) - new Date(b.deadline)
      );
    } catch (error) {
      console.error('Error getting courses with deadlines:', error);
      throw error;
    }
  }
}

// ===== EXPORT =====
export default CourseService;