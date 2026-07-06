import { useState } from 'react'
import './App.css'
import { TodayScreen } from './components/TodayScreen'
import { HistoryScreen } from './components/HistoryScreen'
import { SettingsScreen } from './components/SettingsScreen'

type Tab = 'today' | 'history' | 'settings'

function App() {
  const [tab, setTab] = useState<Tab>('today')

  return (
    <div className="app">
      <header className="app-header">
        <h1>筋トレ管理ツール</h1>
      </header>

      <main className="app-main">
        {tab === 'today' && <TodayScreen />}
        {tab === 'history' && <HistoryScreen />}
        {tab === 'settings' && <SettingsScreen />}
      </main>

      <nav className="tab-bar">
        <button className={tab === 'today' ? 'active' : ''} onClick={() => setTab('today')}>
          今日
        </button>
        <button className={tab === 'history' ? 'active' : ''} onClick={() => setTab('history')}>
          履歴
        </button>
        <button className={tab === 'settings' ? 'active' : ''} onClick={() => setTab('settings')}>
          設定
        </button>
      </nav>
    </div>
  )
}

export default App
