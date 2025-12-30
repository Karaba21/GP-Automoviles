'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

type ModalState = 'form' | 'loading' | 'success'

export default function LeadCouponModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [modalState, setModalState] = useState<ModalState>('form')
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    consent: false
  })
  const [couponCode, setCouponCode] = useState('')
  const [alreadyHadCoupon, setAlreadyHadCoupon] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const modalRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)

  const handleClose = useCallback(() => {
    if (modalState === 'loading') return // No cerrar durante loading

    setIsOpen(false)
    // Restaurar scroll inmediatamente
    if (typeof window !== 'undefined') {
      document.body.style.overflow = ''
      // Guardar timestamp de cierre
      localStorage.setItem('leadModalClosed', Date.now().toString())
    }
  }, [modalState])

  // Verificar si debe mostrarse el modal
  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return

    // TEMPORAL: Mostrar siempre para debug - luego restaurar lógica de localStorage
    const timer = setTimeout(() => {
      console.log('Mostrando modal...')
      setIsOpen(true)
    }, 1000)

    return () => clearTimeout(timer)

    /* LÓGICA ORIGINAL (comentada temporalmente para debug):
    // Verificar si ya completó el form
    const completed = localStorage.getItem('leadModalCompleted')
    if (completed === 'true') {
      return // No mostrar si ya completó
    }

    // Verificar si cerró sin enviar (7 días)
    const closedTimestamp = localStorage.getItem('leadModalClosed')
    if (closedTimestamp) {
      const closedDate = new Date(parseInt(closedTimestamp))
      const now = new Date()
      const daysDiff = (now.getTime() - closedDate.getTime()) / (1000 * 60 * 60 * 24)
      
      if (daysDiff < 7) {
        return // No mostrar si cerró hace menos de 7 días
      }
    }

    // Mostrar el modal después de un pequeño delay
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 1000)

    return () => clearTimeout(timer)
    */
  }, [])

  // Manejar tecla Esc
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalState === 'form') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, modalState, handleClose])

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return

    if (isOpen) {
      // Guardar el valor original del overflow antes de cambiarlo
      const originalOverflow = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = 'hidden'

      return () => {
        // Restaurar el valor original al cerrar
        document.body.style.overflow = originalOverflow
      }
    }
    // No hacer nada cuando está cerrado - dejar que el CSS natural maneje el scroll
  }, [isOpen])

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current && modalState === 'form') {
      handleClose()
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'El nombre es requerido'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Email inválido'
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido'
    } else if (formData.phone.trim().length < 8) {
      newErrors.phone = 'El teléfono debe tener al menos 8 caracteres'
    }

    if (!formData.consent) {
      newErrors.consent = 'Debes aceptar recibir promociones para continuar'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setModalState('loading')

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          full_name: formData.full_name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          consent: formData.consent,
          source: 'homepage_modal'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        let errorMsg = 'Error al procesar la solicitud'

        // Parsear errores específicos de base de datos
        const errorString = JSON.stringify(data)

        if (errorString.includes('leads_phone_unique') || errorString.includes('Key (phone)=')) {
          errorMsg = 'Este número de teléfono ya ha sido registrado'
        } else if (errorString.includes('leads_email_unique')) {
          errorMsg = 'Este email ya ha sido registrado'
        } else if (data.error) {
          errorMsg = data.details
            ? `${data.error}: ${typeof data.details === 'object' ? JSON.stringify(data.details, null, 2) : data.details}`
            : data.error
        }

        throw new Error(errorMsg)
      }

      setCouponCode(data.coupon_code)
      setAlreadyHadCoupon(data.alreadyHadCoupon || false)
      setModalState('success')

      // Marcar como completado
      if (typeof window !== 'undefined') {
        localStorage.setItem('leadModalCompleted', 'true')
      }
    } catch (error) {
      console.error('Error:', error)
      setErrors({ submit: error instanceof Error ? error.message : 'Error al procesar la solicitud' })
      setModalState('form')
    }
  }

  const handleCopyCoupon = async () => {
    try {
      await navigator.clipboard.writeText(couponCode)
      // Mostrar feedback visual (opcional)
      const button = document.querySelector('[data-copy-button]') as HTMLButtonElement
      if (button) {
        const originalText = button.innerHTML
        button.innerHTML = '<i class="fas fa-check mr-2"></i> ¡Copiado!'
        setTimeout(() => {
          button.innerHTML = originalText
        }, 2000)
      }
    } catch (error) {
      console.error('Error al copiar:', error)
    }
  }

  // Debug: verificar estado
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Modal isOpen:', isOpen)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="lead-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="lead-modal-container"
      >
        {/* Botón cerrar */}
        {modalState === 'form' && (
          <button
            onClick={handleClose}
            className="lead-modal-close"
            aria-label="Cerrar modal"
            type="button"
          >
            <i className="fas fa-times text-lg"></i>
          </button>
        )}

        {/* Header - Siempre visible o contextual? Mejor contextual */}
        {modalState === 'form' && (
          <div className="lead-modal-header">
            {/* Botón cerrar (duplicado en header para posicionamiento absoluto relativo al header) */}
            <button
              onClick={handleClose}
              className="lead-modal-close"
              aria-label="Cerrar modal"
              type="button"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
            <h2 id="modal-title">
              ¡Obtén tu cupón para el sorteo del tanque de nafta!
            </h2>
            <p>
              Completa el formulario y recibe un cupón especial para la próxima compra de tu coche.
            </p>
          </div>
        )}

        <div className="lead-modal-body">
          {modalState === 'form' && (
            <form onSubmit={handleSubmit}>
              {/* Nombre completo */}
              <div className="lead-form-group">
                <label htmlFor="full_name">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className={`lead-form-input ${errors.full_name ? 'error' : ''}`}
                  placeholder="Juan Pérez"
                />
                {errors.full_name && (
                  <p className="lead-error-msg">{errors.full_name}</p>
                )}
              </div>

              {/* Email */}
              <div className="lead-form-group">
                <label htmlFor="email">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`lead-form-input ${errors.email ? 'error' : ''}`}
                  placeholder="juan@example.com"
                />
                {errors.email && (
                  <p className="lead-error-msg">{errors.email}</p>
                )}
              </div>

              {/* Teléfono */}
              <div className="lead-form-group">
                <label htmlFor="phone">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className={`lead-form-input ${errors.phone ? 'error' : ''}`}
                  placeholder="099123456"
                />
                {errors.phone && (
                  <p className="lead-error-msg">{errors.phone}</p>
                )}
              </div>

              {/* Consentimiento */}
              <div className="lead-checkbox-group">
                <div style={{ position: 'relative', top: '2px' }}>
                  <input
                    type="checkbox"
                    id="consent"
                    checked={formData.consent}
                    onChange={(e) =>
                      setFormData({ ...formData, consent: e.target.checked })
                    }
                    className="lead-checkbox"
                  />
                </div>
                <label
                  htmlFor="consent"
                  className="lead-checkbox-label"
                >
                  Acepto recibir promociones y novedades de GP Automóviles.
                </label>
              </div>
              {errors.consent && (
                <p className="lead-error-msg" style={{ marginTop: '0.25rem', marginBottom: '1rem' }}>{errors.consent}</p>
              )}

              {errors.submit && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium text-center border border-red-200">
                  {errors.submit}
                </div>
              )}

              {/* Botón enviar */}
              <button
                type="submit"
                className="btn btn-primary lead-submit-btn"
              >
                Obtener cupón
              </button>
            </form>
          )}

          {modalState === 'loading' && (
            <div className="text-center py-12">
              <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
              <p className="text-gray-600">Procesando tu solicitud...</p>
            </div>
          )}

          {modalState === 'success' && (
            <div className="lead-success-content">
              <div className="lead-success-icon">
                <i className="fas fa-check"></i>
              </div>

              {alreadyHadCoupon && (
                <p className="text-sm text-gray-600 mb-4">
                  Ya tenías un cupón, te lo mostramos de nuevo
                </p>
              )}

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ¡Aquí tienes tu cupón válido para el sorteo de un tanque de combustible lleno!
              </h3>

              <div className="lead-coupon-display">
                <p className="lead-coupon-code">
                  {couponCode}
                </p>
              </div>

              <button
                onClick={handleCopyCoupon}
                data-copy-button
                className="btn btn-primary lead-copy-btn"
              >
                <i className="far fa-copy mr-2"></i> Copiar código
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="btn btn-outline lead-copy-btn"
                style={{ marginTop: '0.75rem', border: 'none', background: 'transparent' }}
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
