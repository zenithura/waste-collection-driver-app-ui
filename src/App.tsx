import React, { useState, useCallback } from 'react'
import { Truck } from 'lucide-react'
import Dashboard from './components/Dashboard'
import TaskList from './components/TaskList'
import NavigationButton from './components/NavigationButton'

interface Task {
  id: number
  address: string
  status: 'urgent' | 'normal' | 'completed'
  fillLevel: number
}

function App() {
  const [isRouteStarted, setIsRouteStarted] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, address: '123 Main St', status: 'urgent', fillLevel: 90 },
    { id: 2, address: '456 Elm St', status: 'normal', fillLevel: 65 },
    { id: 3, address: '789 Oak St', status: 'normal', fillLevel: 50 },
    { id: 4, address: '321 Pine St', status: 'urgent', fillLevel: 85 },
    { id: 5, address: '654 Maple Ave', status: 'normal', fillLevel: 40 },
  ])

  const handleRouteToggle = () => {
    setIsRouteStarted(!isRouteStarted)
  }

  const updateTaskStatus = useCallback((taskId: number, newStatus: 'urgent' | 'normal' | 'completed') => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    )
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold flex items-center">
          <Truck className="mr-2" /> Waste Collection Driver App
        </h1>
      </header>
      <main className="flex-grow flex flex-col md:flex-row p-4 gap-4">
        <Dashboard 
          isRouteStarted={isRouteStarted} 
          updateTaskStatus={updateTaskStatus}
          tasks={tasks}
        />
        <TaskList tasks={tasks} />
      </main>
      <footer className="bg-gray-200 p-4">
        <NavigationButton isStarted={isRouteStarted} onToggle={handleRouteToggle} />
      </footer>
    </div>
  )
}

export default App