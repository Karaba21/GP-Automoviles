'use client'

import { useEffect } from 'react'
import { showVehicleDetails, generateVehicleWhatsAppMessage } from '../lib/utils'

export function useVehicleModal() {
  useEffect(() => {
    // Exponer funciones globalmente para compatibilidad con código existente
    if (typeof window !== 'undefined') {
      ;(window as any).showVehicleDetails = showVehicleDetails
      ;(window as any).generateVehicleWhatsAppMessage = generateVehicleWhatsAppMessage
      ;(window as any).showNotification = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
        const { showNotification } = require('../lib/utils')
        showNotification(message, type)
      }
    }
  }, [])
}

