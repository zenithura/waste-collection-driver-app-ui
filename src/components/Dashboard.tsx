import React, { useState, useEffect, useCallback } from 'react'
import { Map, Trash2, Truck, Navigation, AlertTriangle } from 'lucide-react'

interface Task {
  id: number
  address: string
  status: 'urgent' | 'normal' | 'completed'
  fillLevel: number
}

interface DashboardProps {
  isRouteStarted: boolean
  updateTaskStatus: (taskId: number, newStatus: 'urgent' | 'normal' | 'completed') => void
  tasks: Task[]
}

interface Pin extends Task {
  top: string
  left: string
  x: number
  y: number
}

const Dashboard: React.FC<DashboardProps> = ({ isRouteStarted, updateTaskStatus, tasks }) => {
  const [selectedPin, setSelectedPin] = useState<number | null>(null)
  const [truckPosition, setTruckPosition] = useState({ top: '90%', left: '10%', x: 10, y: 90 })
  const [optimizedRoute, setOptimizedRoute] = useState<Pin[]>([])

  const initialPins: Pin[] = tasks.map((task, index) => ({
    ...task,
    top: `${20 + (index * 15)}%`,
    left: `${20 + (index * 15)}%`,
    x: 20 + (index * 15),
    y: 20 + (index * 15)
  }))

  const [pins, setPins] = useState<Pin[]>(initialPins)

  useEffect(() => {
    setPins(tasks.map((task, index) => ({
      ...task,
      top: `${20 + (index * 15)}%`,
      left: `${20 + (index * 15)}%`,
      x: 20 + (index * 15),
      y: 20 + (index * 15)
    })))
  }, [tasks])

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  }

  const optimizeRoute = useCallback(() => {
    let currentPosition = { x: truckPosition.x, y: truckPosition.y }
    let remainingPins = pins.filter(pin => pin.status !== 'completed')
    let route: Pin[] = []

    while (remainingPins.length > 0) {
      let nextPin: Pin | null = null
      let shortestDistance = Infinity

      for (const pin of remainingPins) {
        const distance = calculateDistance(currentPosition.x, currentPosition.y, pin.x, pin.y)
        const urgencyFactor = pin.status === 'urgent' ? 0.5 : 1
        const score = distance * urgencyFactor

        if (score < shortestDistance) {
          shortestDistance = score
          nextPin = pin
        }
      }

      if (nextPin) {
        route.push(nextPin)
        currentPosition = { x: nextPin.x, y: nextPin.y }
        remainingPins = remainingPins.filter(pin => pin.id !== nextPin!.id)
      }
    }

    setOptimizedRoute(route)
  }, [pins, truckPosition.x, truckPosition.y])

  useEffect(() => {
    if (isRouteStarted) {
      optimizeRoute()
    }
  }, [isRouteStarted, optimizeRoute])

  useEffect(() => {
    let interval: number | undefined

    if (isRouteStarted) {
      interval = window.setInterval(() => {
        setTruckPosition(prev => {
          if (optimizedRoute.length > 0) {
            const nextPin = optimizedRoute[0]
            const dx = nextPin.x - prev.x
            const dy = nextPin.y - prev.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            const speed = 2
            const ratio = speed / distance
            const newX = prev.x + dx * ratio
            const newY = prev.y + dy * ratio
            return { top: `${newY}%`, left: `${newX}%`, x: newX, y: newY }
          }
          return prev
        })
      }, 100)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isRouteStarted, optimizedRoute])

  useEffect(() => {
    if (isRouteStarted && optimizedRoute.length > 0) {
      const currentPin = optimizedRoute[0]
      const distance = calculateDistance(truckPosition.x, truckPosition.y, currentPin.x, currentPin.y)
      if (distance < 2) {
        handlePinClick(currentPin.id)
        setOptimizedRoute(prev => prev.slice(1))
      }
    }
  }, [truckPosition, optimizedRoute, isRouteStarted])

  const handlePinClick = (pinId: number) => {
    setSelectedPin(pinId)
    updateTaskStatus(pinId, 'completed')
  }

  const renderPin = (pin: Pin) => {
    const iconColor = pin.status === 'urgent' ? 'text-red-500' : 
                      pin.status === 'normal' ? 'text-yellow-500' : 'text-green-500'
    return (
      <div
        key={pin.id}
        className={`absolute cursor-pointer transition-all duration-300 ${pin.status === 'completed' ? 'opacity-50' : 'animate-pulse'}`}
        style={{ top: pin.top, left: pin.left }}
        onClick={() => handlePinClick(pin.id)}
      >
        <Trash2 className={iconColor} size={24} />
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full border-2 border-gray-300">
          <div 
            className={`absolute bottom-0 left-0 right-0 bg-${iconColor.split('-')[1]} rounded-full transition-all duration-300`} 
            style={{ height: `${pin.fillLevel}%` }}
          ></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex-grow">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Map className="mr-2" /> Waste Collection Route
      </h2>
      <div className="bg-blue-100 h-96 relative overflow-hidden rounded-lg">
        {isRouteStarted ? (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full bg-blue-200 rounded-lg">
                {/* Mock streets */}
                {[1,2,3].map(i => (
                  <div key={`h${i}`} className="absolute h-1 bg-gray-400 left-0 right-0" style={{top: `${25*i}%`}}></div>
                ))}
                {[1,2,3].map(i => (
                  <div key={`v${i}`} className="absolute w-1 bg-gray-400 top-0 bottom-0" style={{left: `${25*i}%`}}></div>
                ))}
              </div>
            </div>
            {pins.map(renderPin)}
            <div className="absolute transition-all duration-100 ease-in-out" style={{ top: truckPosition.top, left: truckPosition.left }}>
              <Truck className="text-green-600" size={32} />
            </div>
            <div className="absolute bottom-5 left-5 bg-white p-2 rounded shadow flex items-center">
              <Navigation className="mr-2 text-blue-500" size={16} />
              <span className="text-sm font-semibold">Optimized Route</span>
            </div>
            <div className="absolute top-5 right-5 bg-white p-2 rounded shadow">
              <span className="text-sm font-semibold">Completed: {tasks.filter(t => t.status === 'completed').length}/{tasks.length}</span>
            </div>
            {selectedPin && (
              <div className="absolute top-5 left-5 bg-white p-2 rounded shadow">
                <span className="text-sm font-semibold">
                  {pins.find(p => p.id === selectedPin)?.address}: {' '}
                  {pins.find(p => p.id === selectedPin)?.status === 'urgent' ? (
                    <span className="text-red-500 flex items-center">
                      <AlertTriangle size={16} className="mr-1" /> Urgent Collection
                    </span>
                  ) : pins.find(p => p.id === selectedPin)?.status === 'completed' ? (
                    <span className="text-green-500">Completed</span>
                  ) : (
                    <span className="text-yellow-500">Regular Collection</span>
                  )}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-blue-800 font-semibold">Start the route to view the waste collection map</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard