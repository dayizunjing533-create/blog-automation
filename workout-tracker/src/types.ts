export type WeightUnit = 'kg' | 'lbs'

export interface Exercise {
  id: string
  name: string
  unit: WeightUnit
  /** 1セットあたりの目標セット数 */
  targetSets: number
  /** 最初に挑戦する回数(下限) */
  repFloor: number
  /** この回数に到達したら重量を増やし、回数をrepFloorに戻す */
  repCeiling: number
  /** セット成功時に増やす回数 */
  repIncrement: number
  /** 回数が上限に達したときに増やす重量 */
  weightIncrement: number
  /** 開始重量 */
  startWeight: number
}

export interface ProgramDay {
  id: string
  name: string
  exerciseIds: string[]
}

export interface Settings {
  key: 'main'
  /** ローテーションするProgramDayのid配列(順番通り) */
  rotationOrder: string[]
  /** 次に行うべきProgramDayのインデックス */
  currentIndex: number
}

export interface SetEntry {
  reps: number
  weight: number
  completed: boolean
}

export interface LogEntry {
  exerciseId: string
  targetReps: number
  targetWeight: number
  sets: SetEntry[]
}

export interface WorkoutLog {
  id: string
  date: string // ISO date (yyyy-mm-dd)
  programDayId: string
  entries: LogEntry[]
}

export interface NextTarget {
  targetReps: number
  targetWeight: number
}
