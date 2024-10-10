import React from 'react'
import { Play, Square } from 'lucide-react'

interface NavigationButtonProps {
  isStarted: boolean
  onToggle: () => void
}

const NavigationButton: React.FC<NavigationButtonProps> = ({ isStarted, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center justify-center px-6 py-3 rounded-full text-white font-semibold ${
        isStarted ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
      }`}
    >
      {isStarted ? (
        <>
          <Square className="mr-2" /> Stop Route
        </>
      ) : (
        <>
          <Play className="mr-2" /> Start Route
        </>
      )}
    </button>
  )
}

export default NavigationButton