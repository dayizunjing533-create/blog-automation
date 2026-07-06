import { useEffect, useState } from 'react'
import type { Exercise, ProgramDay, Settings, WeightUnit } from '../types'
import {
  deleteExercise,
  deleteProgramDay,
  getAllExercises,
  getAllProgramDays,
  getSettings,
  putExercise,
  putProgramDay,
  putSettings,
} from '../db'
import { uid } from '../utils'

const emptyExerciseForm = {
  name: '',
  unit: 'kg' as WeightUnit,
  targetSets: 3,
  repFloor: 8,
  repCeiling: 12,
  repIncrement: 1,
  weightIncrement: 2.5,
  startWeight: 20,
}

export function SettingsScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [programDays, setProgramDays] = useState<ProgramDay[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)

  const [exerciseForm, setExerciseForm] = useState(emptyExerciseForm)
  const [dayName, setDayName] = useState('')
  const [dayExerciseIds, setDayExerciseIds] = useState<string[]>([])
  const [addDayId, setAddDayId] = useState('')

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    const [ex, days, st] = await Promise.all([getAllExercises(), getAllProgramDays(), getSettings()])
    setExercises(ex)
    setProgramDays(days)
    setSettings(st)
  }

  async function handleAddExercise() {
    if (!exerciseForm.name.trim()) return
    await putExercise({ id: uid(), ...exerciseForm })
    setExerciseForm(emptyExerciseForm)
    await load()
  }

  async function handleDeleteExercise(id: string) {
    await deleteExercise(id)
    await load()
  }

  function toggleDayExercise(id: string) {
    setDayExerciseIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  async function handleAddProgramDay() {
    if (!dayName.trim() || dayExerciseIds.length === 0) return
    await putProgramDay({ id: uid(), name: dayName, exerciseIds: dayExerciseIds })
    setDayName('')
    setDayExerciseIds([])
    await load()
  }

  async function handleDeleteProgramDay(id: string) {
    await deleteProgramDay(id)
    if (settings) {
      const nextOrder = settings.rotationOrder.filter((d) => d !== id)
      const next = { ...settings, rotationOrder: nextOrder, currentIndex: 0 }
      await putSettings(next)
    }
    await load()
  }

  async function updateRotation(nextOrder: string[]) {
    if (!settings) return
    const next = { ...settings, rotationOrder: nextOrder }
    await putSettings(next)
    setSettings(next)
  }

  function addToRotation() {
    if (!addDayId || !settings) return
    void updateRotation([...settings.rotationOrder, addDayId])
    setAddDayId('')
  }

  function moveRotation(index: number, direction: -1 | 1) {
    if (!settings) return
    const order = [...settings.rotationOrder]
    const target = index + direction
    if (target < 0 || target >= order.length) return
    ;[order[index], order[target]] = [order[target], order[index]]
    void updateRotation(order)
  }

  function removeFromRotation(index: number) {
    if (!settings) return
    const order = settings.rotationOrder.filter((_, i) => i !== index)
    void updateRotation(order)
  }

  return (
    <div className="screen">
      <h2>設定</h2>

      <section className="card">
        <h3>種目を追加</h3>
        <div className="form-grid">
          <label>
            種目名
            <input
              value={exerciseForm.name}
              onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
              placeholder="例: ベンチプレス"
            />
          </label>
          <label>
            単位
            <select
              value={exerciseForm.unit}
              onChange={(e) => setExerciseForm({ ...exerciseForm, unit: e.target.value as WeightUnit })}
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </label>
          <label>
            セット数
            <input
              type="number"
              value={exerciseForm.targetSets}
              onChange={(e) => setExerciseForm({ ...exerciseForm, targetSets: Number(e.target.value) })}
            />
          </label>
          <label>
            開始重量
            <input
              type="number"
              value={exerciseForm.startWeight}
              onChange={(e) => setExerciseForm({ ...exerciseForm, startWeight: Number(e.target.value) })}
            />
          </label>
          <label>
            回数(下限/開始)
            <input
              type="number"
              value={exerciseForm.repFloor}
              onChange={(e) => setExerciseForm({ ...exerciseForm, repFloor: Number(e.target.value) })}
            />
          </label>
          <label>
            回数(上限)
            <input
              type="number"
              value={exerciseForm.repCeiling}
              onChange={(e) => setExerciseForm({ ...exerciseForm, repCeiling: Number(e.target.value) })}
            />
          </label>
          <label>
            成功時の回数増加幅
            <input
              type="number"
              value={exerciseForm.repIncrement}
              onChange={(e) => setExerciseForm({ ...exerciseForm, repIncrement: Number(e.target.value) })}
            />
          </label>
          <label>
            上限到達時の重量増加幅
            <input
              type="number"
              value={exerciseForm.weightIncrement}
              onChange={(e) => setExerciseForm({ ...exerciseForm, weightIncrement: Number(e.target.value) })}
            />
          </label>
        </div>
        <button className="primary-btn" onClick={handleAddExercise}>
          種目を追加
        </button>
      </section>

      <section className="card">
        <h3>登録済みの種目 ({exercises.length})</h3>
        {exercises.map((ex) => (
          <div className="list-row" key={ex.id}>
            <span>
              {ex.name}（{ex.startWeight}
              {ex.unit}〜, {ex.repFloor}〜{ex.repCeiling}回 × {ex.targetSets}セット）
            </span>
            <button className="text-btn" onClick={() => handleDeleteExercise(ex.id)}>
              削除
            </button>
          </div>
        ))}
      </section>

      <section className="card">
        <h3>メニュー(プログラムデイ)を追加</h3>
        <label>
          メニュー名
          <input value={dayName} onChange={(e) => setDayName(e.target.value)} placeholder="例: 上半身の日" />
        </label>
        <p className="hint">含める種目を選択:</p>
        <div className="checkbox-list">
          {exercises.map((ex) => (
            <label key={ex.id} className="checkbox-row">
              <input
                type="checkbox"
                checked={dayExerciseIds.includes(ex.id)}
                onChange={() => toggleDayExercise(ex.id)}
              />
              {ex.name}
            </label>
          ))}
        </div>
        <button className="primary-btn" onClick={handleAddProgramDay}>
          メニューを追加
        </button>
      </section>

      <section className="card">
        <h3>登録済みのメニュー ({programDays.length})</h3>
        {programDays.map((day) => (
          <div className="list-row" key={day.id}>
            <span>
              {day.name}（{day.exerciseIds.map((id) => exercises.find((e) => e.id === id)?.name ?? '?').join(', ')}）
            </span>
            <button className="text-btn" onClick={() => handleDeleteProgramDay(day.id)}>
              削除
            </button>
          </div>
        ))}
      </section>

      <section className="card">
        <h3>ローテーション順</h3>
        <p className="hint">トレーニングを保存するたびに、次のメニューへ自動で切り替わります。</p>
        {settings?.rotationOrder.map((dayId, i) => {
          const day = programDays.find((d) => d.id === dayId)
          const isCurrent = i === settings.currentIndex % Math.max(settings.rotationOrder.length, 1)
          return (
            <div className="list-row" key={`${dayId}-${i}`}>
              <span>
                {i + 1}. {day?.name ?? '削除済み'} {isCurrent && <span className="badge success">次回</span>}
              </span>
              <span>
                <button className="text-btn" onClick={() => moveRotation(i, -1)}>
                  ↑
                </button>
                <button className="text-btn" onClick={() => moveRotation(i, 1)}>
                  ↓
                </button>
                <button className="text-btn" onClick={() => removeFromRotation(i)}>
                  削除
                </button>
              </span>
            </div>
          )
        })}
        <div className="form-grid">
          <select value={addDayId} onChange={(e) => setAddDayId(e.target.value)}>
            <option value="">メニューを選択</option>
            {programDays.map((day) => (
              <option key={day.id} value={day.id}>
                {day.name}
              </option>
            ))}
          </select>
          <button className="primary-btn" onClick={addToRotation}>
            ローテーションに追加
          </button>
        </div>
      </section>
    </div>
  )
}
