import { useState, useEffect } from 'react'
import { isServer } from './isServer'

export const useWindowWidth = () => {
  if (!isServer) {
    const [width, setWidth] = useState(window.innerWidth)

    useEffect(() => {
      const handleResize = () => setWidth(window.innerWidth)
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    })

    return width
  }

  return null
}
