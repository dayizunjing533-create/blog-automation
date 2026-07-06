import { useEffect, useState } from 'react'
import type { Exercise, ProgramDay, Settings, WorkoutLog, LogEntry } from '../types'
import { getAllExercises, getAllLogs, getAllProgramDays, getSettings, putLog, putSettings } from '../db'
import { computeNextTarget, findLatestEntry, getCurrentProgramDay, advanceRotation } from '../progression'
import { todayISO, uid } from '../utils'

export function TodayScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [programDays, setProgramDays] = useState<ProgramDay[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [logs, setLogs] = useState<WorkoutLog[]>([])
  const [draft, setDraft] = useState<WorkoutLog | null>(null)
  const [wasAlreadyLogged, setWasAlreadyLogged] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    const [ex, days, st, allLogs] = await Promise.all([
      getAllExercises(),
      getAllProgramDays(),
      getSettings(),
      getAllLogs(),
    ])
    setExercises(ex)
    setProgramDays(days)
    setSettings(st)
    setLogs(allLogs)

    const currentDay = getCurrentProgramDay(st, days)
    if (currentDay) {
      const today = todayISO()
      const existing = allLogs.find((l) => l.date === today && l.programDayId === currentDay.id)
      if (existing) {
        setDraft(existing)
        setWasAlreadyLogged(true)
      } else {
        const entries: LogEntry[] = currentDay.exerciseIds
          .map((exerciseId) => {
            const exercise = ex.find((e) => e.id === exerciseId)
            if (!exercise) return null
            const lastEntry = findLatestEntry(allLogs, exerciseId)
            const target = computeNextTarget(exercise, lastEntry)
            const sets = Array.from({ length: exercise.targetSets }, () => ({
              reps: target.targetReps,
              weight: target.targetWeight,
              completed: false,
            }))
            return { exerciseId, targetReps: target.targetReps, targetWeight: target.targetWeight, sets }
          })
          .filter((e): e is LogEntry => e !== null)

        setDraft({ id: uid(), date: today, programDayId: currentDay.id, entries })
        setWasAlreadyLogged(false)
      }
    } else {
      setDraft(null)
    }
    setLoading(false)
  }

  function updateSet(exerciseId: string, setIndex: number, field: 'reps' | 'weight' | 'completed', value: number | boolean) {
    if (!draft) return
    setDraft({
      ...draft,
      entries: draft.entries.map((entry) => {
        if (entry.exerciseId !== exerciseId) return entry
        return {
          ...entry,
          sets: entry.sets.map((set, i) => (i === setIndex ? { ...set, [field]: value } : set)),
        }
      }),
    })
  }

  async function handleSave() {
    if (!draft || !settings) return
    await putLog(draft)
    if (!wasAlreadyLogged) {
      const nextSettings = advanceRotation(settings)
      await putSettings(nextSettings)
      setSettings(nextSettings)
    }
    setMessage('保存しました')
    setWasAlreadyLogged(true)
    const allLogs = await getAllLogs()
    setLogs(allLogs)
    setTimeout(() => setMessage(''), 2000)
  }

  if (loading) return <p className="hint">読み込み中...</p>

  const currentDay = settings ? getCurrentProgramDay(settings, programDays) : undefined

  if (!currentDay) {
    return (
      <div className="empty-state">
        <p>まだ種目・プログラムが設定されていません。</p>
        <p className="hint">「設定」タブから種目とローテーションを登録してください。</p>
      </div>
    )
  }

  return (
    <div className="screen">
      <h2>{todayISO()} の{wasAlreadyLogged ? '記録' : 'トレーニング'}</h2>
      <p className="hint">今日のメニュー: {currentDay.name}</p>

      {draft?.entries.map((entry) => {
        const exercise = exercises.find((e) => e.id === entry.exerciseId)
        if (!exercise) return null
        return (
          <div className="card" key={entry.exerciseId}>
            <h3>{exercise.name}</h3>
            <p className="target">
              目標: {entry.targetWeight}{exercise.unit} × {entry.targetReps}回 × {exercise.targetSets}セット
            </p>
            <table className="set-table">
              <thead>
                <tr>
                  <th>セット</th>
                  <th>重量({exercise.unit})</th>
                  <th>回数</th>
                  <th>完了</th>
                </tr>
              </thead>
              <tbody>
                {entry.sets.map((set, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                      <input
                        type="number"
                        value={set.weight}
                        onChange={(e) => updateSet(entry.exerciseId, i, 'weight', Number(e.target.value))}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) => updateSet(entry.exerciseId, i, 'reps', Number(e.target.value))}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={set.completed}
                        onChange={(e) => updateSet(entry.exerciseId, i, 'completed', e.target.checked)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      })}

      <button className="primary-btn" onClick={handleSave}>
        {wasAlreadyLogged ? '記録を更新' : '今日のトレーニングを保存'}
      </button>
      {message && <p className="toast">{message}</p>}
      <p className="hint small">
        全セットで目標回数を達成すると、次回は回数(または重量)が自動で増えます。ログ件数: {logs.length}
      </p>
    </div>
  )
}
