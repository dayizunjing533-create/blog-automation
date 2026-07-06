import type { Exercise, LogEntry, NextTarget, ProgramDay, Settings, WorkoutLog } from './types'

/** 過去ログ(日付降順)から、指定した種目の直近の記録エントリーを探す */
export function findLatestEntry(logs: WorkoutLog[], exerciseId: string): LogEntry | undefined {
  for (const log of logs) {
    const entry = log.entries.find((e) => e.exerciseId === exerciseId)
    if (entry) return entry
  }
  return undefined
}

/** そのエントリーの全セットが目標回数以上を達成しているか */
export function isEntrySuccess(entry: LogEntry): boolean {
  if (entry.sets.length === 0) return false
  return entry.sets.every((set) => set.completed && set.reps >= entry.targetReps)
}

/**
 * 前回の記録から次回の目標(重量・回数)を計算する。
 * 前回全セット成功 → 回数を増やす。回数が上限に達していたら重量を増やして回数をリセット。
 * 前回未達 → 同じ目標を維持(据え置き)。
 * 記録がない場合は初期値を返す。
 */
export function computeNextTarget(exercise: Exercise, lastEntry: LogEntry | undefined): NextTarget {
  if (!lastEntry) {
    return { targetReps: exercise.repFloor, targetWeight: exercise.startWeight }
  }

  if (!isEntrySuccess(lastEntry)) {
    return { targetReps: lastEntry.targetReps, targetWeight: lastEntry.targetWeight }
  }

  const nextReps = lastEntry.targetReps + exercise.repIncrement
  if (nextReps > exercise.repCeiling) {
    return {
      targetReps: exercise.repFloor,
      targetWeight: lastEntry.targetWeight + exercise.weightIncrement,
    }
  }
  return { targetReps: nextReps, targetWeight: lastEntry.targetWeight }
}

/** 現在のローテーションインデックスに対応するProgramDayを返す */
export function getCurrentProgramDay(settings: Settings, programDays: ProgramDay[]): ProgramDay | undefined {
  if (settings.rotationOrder.length === 0) return undefined
  const dayId = settings.rotationOrder[settings.currentIndex % settings.rotationOrder.length]
  return programDays.find((day) => day.id === dayId)
}

/** ワークアウト完了後、ローテーションを次に進めた設定を返す */
export function advanceRotation(settings: Settings): Settings {
  if (settings.rotationOrder.length === 0) return settings
  return {
    ...settings,
    currentIndex: (settings.currentIndex + 1) % settings.rotationOrder.length,
  }
}
