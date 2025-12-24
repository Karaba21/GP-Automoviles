'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Quote() {
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    anio: '',
    kilometraje: '',
    observaciones: '',
  })

  const generateWhatsAppMessage = () => {
    const { marca, modelo, anio, kilometraje, observaciones } = formData

    if (!marca || !modelo || !anio || !kilometraje) {
      if (typeof window !== 'undefined' && (window as any).showNotification) {
        (window as any).showNotification('Por favor completa todos los campos obligatorios', 'error')
      }
      return
    }

    let mensaje = ` *COTIZACIÓN DE VEHÍCULO* \n\n`
    mensaje += ` *Información del Vehículo:*\n`
    mensaje += `• Marca: ${marca}\n`
    mensaje += `• Modelo: ${modelo}\n`
    mensaje += `• Año: ${anio}\n`
    mensaje += `• Kilometraje: ${Number(kilometraje).toLocaleString()} km\n\n`

    if (observaciones) {
      mensaje += `📝 *Observaciones:*\n${observaciones}\n\n`
    }

    mensaje += `¡Hola! Me interesa cotizar mi vehículo. ¿Podrían ayudarme con una evaluación?`

    const whatsappNumber = '59899493618'
    const encodedMessage = encodeURIComponent(mensaje)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

    window.open(whatsappUrl, '_blank')

    if (typeof window !== 'undefined' && (window as any).showNotification) {
      (window as any).showNotification('Redirigiendo a WhatsApp...', 'success')
    }

    setTimeout(() => {
      setFormData({
        marca: '',
        modelo: '',
        anio: '',
        kilometraje: '',
        observaciones: '',
      })
    }, 2000)
  }

  return (
    <section id="cotizacion" className="quote">
      <div className="container">
        <div className="section-header">
          <h2>Solicita tu Cotización</h2>
          <p>Obtene una cotización para tu vehiculo sin compromiso</p>
        </div>

        <div className="quote-content">
          <div className="quote-form-container">
            <h3>Información del Vehículo</h3>
            <form className="quote-form" id="vehicleQuoteForm">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="marca">Marca *</label>
                  <input
                    type="text"
                    id="marca"
                    name="marca"
                    required
                    placeholder="Ej: Toyota, Ford, Chevrolet..."
                    value={formData.marca}
                    onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="modelo">Modelo *</label>
                  <input
                    type="text"
                    id="modelo"
                    name="modelo"
                    required
                    placeholder="Ej: Corolla, Focus, Cruze..."
                    value={formData.modelo}
                    onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="anio">Año *</label>
                  <input
                    type="number"
                    id="anio"
                    name="anio"
                    required
                    placeholder="Ej: 2020"
                    min="1990"
                    max="2025"
                    value={formData.anio}
                    onChange={(e) => setFormData({ ...formData, anio: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="kilometraje">Kilometraje *</label>
                  <input
                    type="number"
                    id="kilometraje"
                    name="kilometraje"
                    required
                    placeholder="Ej: 50000"
                    min="0"
                    value={formData.kilometraje}
                    onChange={(e) => setFormData({ ...formData, kilometraje: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="observaciones">Observaciones Adicionales</label>
                <textarea
                  id="observaciones"
                  name="observaciones"
                  placeholder="Cuéntanos más detalles sobre el estado del vehículo, accesorios, etc."
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-primary" onClick={generateWhatsAppMessage}>
                  <i className="fab fa-whatsapp"></i>
                  Enviar por WhatsApp
                </button>
              </div>
            </form>
          </div>

          <div className="quote-guide">
            <h3>Fotos Necesarias para Tasación</h3>
            <div className="guide-image">
              <Image
                src="/assets/cotizacion.jpeg"
                alt="Guía de fotos necesarias para tasación de vehículos"
                width={600}
                height={400}
                style={{ width: '100%', height: 'auto', borderRadius: '12px', boxShadow: 'var(--shadow)' }}
              />
            </div>
            <div className="guide-text">
              <p><strong>Para una tasación precisa, necesitamos estas 7 fotos:</strong></p>
              <ul>
                <li><strong>1. Frente</strong> - Vista frontal completa</li>
                <li><strong>2. Atrás</strong> - Vista trasera completa</li>
                <li><strong>3. Lateral Derecho</strong> - Perfil derecho del vehículo</li>
                <li><strong>4. Lateral Izquierdo</strong> - Perfil izquierdo del vehículo</li>
                <li><strong>5. Tablero</strong> - Interior del vehículo (tablero)</li>
                <li><strong>6. Butaca Delantera</strong> - Asientos delanteros</li>
                <li><strong>7. Motor</strong> - Compartimiento del motor</li>
              </ul>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '1rem' }}>
                <i className="fas fa-lightbulb"></i>
                <strong>Tip:</strong> Asegúrate de que las fotos estén bien iluminadas y muestren claramente el estado del vehículo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

