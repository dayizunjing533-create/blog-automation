import { useEffect, useState } from 'react'
import type { Exercise, ProgramDay, WorkoutLog } from '../types'
import { deleteLog, getAllExercises, getAllLogs, getAllProgramDays } from '../db'
import { isEntrySuccess } from '../progression'
import { formatDateLabel } from '../utils'

export function HistoryScreen() {
  const [logs, setLogs] = useState<WorkoutLog[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [programDays, setProgramDays] = useState<ProgramDay[]>([])

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    const [allLogs, ex, days] = await Promise.all([getAllLogs(), getAllExercises(), getAllProgramDays()])
    setLogs(allLogs)
    setExercises(ex)
    setProgramDays(days)
  }

  async function handleDelete(id: string) {
    await deleteLog(id)
    await load()
  }

  if (logs.length === 0) {
    return (
      <div className="empty-state">
        <p>まだ記録がありません。</p>
        <p className="hint">「今日」タブでトレーニングを記録すると、ここに履歴が表示されます。</p>
      </div>
    )
  }

  return (
    <div className="screen">
      <h2>履歴</h2>
      {logs.map((log) => {
        const day = programDays.find((d) => d.id === log.programDayId)
        return (
          <div className="card" key={log.id}>
            <div className="history-header">
              <h3>{formatDateLabel(log.date)}</h3>
              <span className="hint">{day?.name ?? '不明なメニュー'}</span>
              <button className="text-btn" onClick={() => handleDelete(log.id)}>
                削除
              </button>
            </div>
            {log.entries.map((entry) => {
              const exercise = exercises.find((e) => e.id === entry.exerciseId)
              const success = isEntrySuccess(entry)
              return (
                <div className="history-entry" key={entry.exerciseId}>
                  <span>{exercise?.name ?? '不明な種目'}</span>
                  <span>
                    {entry.targetWeight}
                    {exercise?.unit} × {entry.targetReps}回 × {entry.sets.length}セット
                  </span>
                  <span className={success ? 'badge success' : 'badge'}>
                    {success ? '達成' : '未達'}
                  </span>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
