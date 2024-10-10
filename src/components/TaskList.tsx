import React from 'react'
import { CheckCircle, AlertTriangle, Trash2 } from 'lucide-react'

interface Task {
  id: number
  address: string
  status: 'urgent' | 'normal' | 'completed'
  fillLevel: number
}

interface TaskListProps {
  tasks: Task[]
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full md:w-1/3">
      <h2 className="text-xl font-semibold mb-4">Task List</h2>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`flex items-center justify-between p-2 rounded ${
              task.status === 'urgent' ? 'bg-red-100' : task.status === 'completed' ? 'bg-gray-100' : 'bg-green-100'
            }`}
          >
            <div className="flex items-center">
              <Trash2 className={`mr-2 ${
                task.status === 'urgent' ? 'text-red-500' : 
                task.status === 'completed' ? 'text-gray-500' : 'text-yellow-500'
              }`} size={20} />
              <span>{task.address}</span>
            </div>
            <div className="flex items-center">
              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                <div
                  className={`h-2 rounded-full ${
                    task.status === 'urgent' ? 'bg-red-500' : 
                    task.status === 'completed' ? 'bg-gray-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${task.fillLevel}%` }}
                ></div>
              </div>
              {task.status === 'urgent' ? (
                <AlertTriangle className="text-red-500" size={20} />
              ) : task.status === 'completed' ? (
                <CheckCircle className="text-gray-500" size={20} />
              ) : (
                <CheckCircle className="text-green-500" size={20} />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TaskList