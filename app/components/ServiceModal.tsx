'use client'

import { useEffect, useState } from 'react'

const serviceData: Record<string, { title: string; content: string }> = {
  'financiacion-casa': {
    title: 'Financiación de la Casa',
    content: `
      Entregando el 50% del valor del vehículo +650usd títulos (se pueden agregar a el crédito), prenda y vale el otro 50% hasta en 36 cuotas. NO IMPORTA CLEARING. También como forma de pago aceptamos vehículos que cubran el 50% o más.
      <p>Para acceder a esta financiación hay que:</p>
      <p>- Asegurar auto contra todo, con sección de derechos.</p>
      <p>- Garantes de uno a dos (depende)</p>
      <p>- Recibos de sueldos</p>
    `,
  },
  'financiacion-bancaria-2': {
    title: 'Financiación Bancaria',
    content: `
      <p>No estar en clearing, recibos de sueldo y más de 6 meses de antigüedad laboral!</p>
      <p>REQUISITOS PARA SIMULACIÓN DE PRÉSTAMO MIAUTO SANTANDER</p>
      <p>-foto cédula de identidad </p>
      <p>-número de celular</p>
      <p>-Email</p>
      <p>-Últimos 3 recibos de sueldo</p>

      <p>Elegí el banco que más te convenga, ¡nosotros nos encargamos del resto!</p>
    `,
  },
  'cambio': {
    title: 'Gestión de seguros',
    content: `
      <p>Gestionamos tu seguro de forma rapido y sencilla, con confianza y seguridad.</p>
      <p>Te asesoramos en la mejor opción de seguro para tu vehículo.</p>
    `,
  },
  'tramites-de-gestion': {
    title: 'Tramites de gestoría',
    content: `
      <p>Titulos de propiedad automotor.</p>
      <p>Certificados de actos personales y automotor.</p>
      <p>Transferencia y/o reempadronamiento.</p>
    `,
  },
}

export default function ServiceModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentService, setCurrentService] = useState<{ title: string; content: string } | null>(null)

  useEffect(() => {
    // Exponer función globalmente para que otros componentes la puedan usar
    if (typeof window !== 'undefined') {
      (window as any).openServiceModal = (serviceId: string) => {
        const service = serviceData[serviceId]
        if (service) {
          setCurrentService(service)
          setIsOpen(true)
          document.body.style.overflow = 'hidden'
        }
      }
    }

    // Cerrar con ESC
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal()
      }
    }
    document.addEventListener('keydown', handleEsc)

    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen])

  const closeModal = () => {
    setIsOpen(false)
    document.body.style.overflow = 'auto'
  }

  if (!isOpen || !currentService) return null

  return (
    <div className={`service-modal ${isOpen ? 'show' : ''}`} onClick={closeModal}>
      <div className="service-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="service-modal-header">
          <h2 id="serviceModalTitle">{currentService.title}</h2>
          <button className="service-modal-close" onClick={closeModal}>&times;</button>
        </div>
        <div className="service-modal-body">
          <div
            id="serviceModalContent"
            className="service-modal-text"
            dangerouslySetInnerHTML={{ __html: currentService.content }}
          />
        </div>
        <div className="service-modal-footer">
          <button className="btn btn-primary" onClick={closeModal}>Cerrar</button>
        </div>
      </div>
    </div>
  )
}

