import { COURSES, LESSONS, LEVELS, lessonsForLevel, topicsForLevel } from '@/data/curriculum'
import { wait } from '@/services/localState'
import { mockDb } from '@/services/mockDb'

function stateFor(studentId, levelId) {
  const progress = mockDb.get().levelProgress[studentId]?.[levelId]
  if (progress) return progress
  if (levelId === 1) return { state: 'AVAILABLE', progress: 0, completedLessonIds: [] }
  return { state: 'LOCKED', progress: 0, completedLessonIds: [] }
}

export const learningService = {
  async listLevels(studentId) {
    await wait(180)
    return LEVELS.map((level) => {
      const record = stateFor(studentId, level.id)
      const lessons = lessonsForLevel(level.id)
      return {
        ...level,
        ...record,
        topics: topicsForLevel(level.id),
        lessons,
        lockedReason:
          record.state === 'LOCKED'
            ? `Complete ${LEVELS.find((item) => item.id === level.id - 1)?.title ?? 'the previous level'} first.`
            : null,
      }
    })
  },

  async getLevel(studentId, slug) {
    const levels = await this.listLevels(studentId)
    return levels.find((level) => level.slug === slug) ?? null
  },

  async getLesson(studentId, lessonId) {
    await wait(120)
    const lesson = LESSONS.find((item) => item.id === lessonId)
    if (!lesson) return null
    const level = (await this.listLevels(studentId)).find((item) => item.id === lesson.levelId)
    const siblings = level?.lessons ?? []
    const index = siblings.findIndex((item) => item.id === lessonId)
    return {
      ...lesson,
      level,
      completed: level?.completedLessonIds?.includes(lessonId) ?? false,
      prev: siblings[index - 1] ?? null,
      next: siblings[index + 1] ?? null,
    }
  },

  async completeLesson(studentId, lessonId) {
    await wait(160)
    mockDb.mutate((db) => {
      db.lessonCompletions[`${studentId}:${lessonId}`] = true
      const lesson = LESSONS.find((item) => item.id === lessonId)
      if (!lesson) return
      db.levelProgress[studentId] ??= {}
      const current = db.levelProgress[studentId][lesson.levelId] ?? {
        state: 'IN_PROGRESS',
        progress: 0,
        completedLessonIds: [],
      }
      const completed = new Set(current.completedLessonIds)
      completed.add(lessonId)
      const total = LESSONS.filter((item) => item.levelId === lesson.levelId).length
      const progress = Math.round((completed.size / Math.max(total, 1)) * 100)
      db.levelProgress[studentId][lesson.levelId] = {
        state: progress >= 100 ? 'COMPLETED' : lesson.levelId === 3 ? 'CURRENT' : 'IN_PROGRESS',
        progress,
        completedLessonIds: [...completed],
      }
      const next = LEVELS.find((item) => item.id === lesson.levelId + 1)
      if (progress >= 100 && next && !db.levelProgress[studentId][next.id]) {
        db.levelProgress[studentId][next.id] = { state: 'AVAILABLE', progress: 0, completedLessonIds: [] }
      }
    })
    return this.getLesson(studentId, lessonId)
  },

  async listCourses() {
    await wait(120)
    return COURSES
  },
}

export const courseService = {
  list: () => learningService.listCourses(),
  async get(id) {
    await wait(100)
    return COURSES.find((course) => course.id === id) ?? null
  },
}
