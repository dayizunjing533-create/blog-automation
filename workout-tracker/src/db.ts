import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Exercise, ProgramDay, Settings, WorkoutLog } from './types'

interface WorkoutDB extends DBSchema {
  exercises: { key: string; value: Exercise }
  programDays: { key: string; value: ProgramDay }
  settings: { key: string; value: Settings }
  logs: { key: string; value: WorkoutLog; indexes: { 'by-date': string } }
}

const DB_NAME = 'workout-tracker'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<WorkoutDB>> | null = null

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<WorkoutDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore('exercises', { keyPath: 'id' })
        db.createObjectStore('programDays', { keyPath: 'id' })
        db.createObjectStore('settings', { keyPath: 'key' })
        const logs = db.createObjectStore('logs', { keyPath: 'id' })
        logs.createIndex('by-date', 'date')
      },
    })
  }
  return dbPromise
}

export async function getAllExercises(): Promise<Exercise[]> {
  return (await getDB()).getAll('exercises')
}

export async function putExercise(exercise: Exercise): Promise<void> {
  await (await getDB()).put('exercises', exercise)
}

export async function deleteExercise(id: string): Promise<void> {
  await (await getDB()).delete('exercises', id)
}

export async function getAllProgramDays(): Promise<ProgramDay[]> {
  return (await getDB()).getAll('programDays')
}

export async function putProgramDay(day: ProgramDay): Promise<void> {
  await (await getDB()).put('programDays', day)
}

export async function deleteProgramDay(id: string): Promise<void> {
  await (await getDB()).delete('programDays', id)
}

export async function getSettings(): Promise<Settings> {
  const db = await getDB()
  const existing = await db.get('settings', 'main')
  if (existing) return existing
  const fallback: Settings = { key: 'main', rotationOrder: [], currentIndex: 0 }
  await db.put('settings', fallback)
  return fallback
}

export async function putSettings(settings: Settings): Promise<void> {
  await (await getDB()).put('settings', settings)
}

export async function getAllLogs(): Promise<WorkoutLog[]> {
  const logs = await (await getDB()).getAll('logs')
  return logs.sort((a, b) => b.date.localeCompare(a.date))
}

export async function getLatestLogForExercise(exerciseId: string): Promise<WorkoutLog | undefined> {
  const logs = await getAllLogs()
  return logs.find((log) => log.entries.some((e) => e.exerciseId === exerciseId))
}

export async function putLog(log: WorkoutLog): Promise<void> {
  await (await getDB()).put('logs', log)
}

export async function deleteLog(id: string): Promise<void> {
  await (await getDB()).delete('logs', id)
}
