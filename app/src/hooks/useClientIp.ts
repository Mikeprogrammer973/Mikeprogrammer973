'use client'

import { useState, useEffect } from 'react'

export function useClientIp() {
  const [ip, setIp] = useState<string>('')

  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch('/api/get-ip')
        const data = await response.json()
        setIp(data.ip)
      } catch (error) {
        console.error('Error fetching IP:', error)
        setIp('unknown')
      }
    };

    fetchIp()
  }, [])

  return {ip}
}