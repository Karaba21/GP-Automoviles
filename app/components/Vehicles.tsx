'use client'

import { useEffect, useState } from 'react'

interface Vehicle {
  id: string
  marca: string
  modelo: string
  año: number
  precio: number
  precio_oferta?: number
  en_oferta?: boolean
  reservado?: boolean
  vendido?: boolean
  descripcion?: string
  imagenes?: string[]
}

export default function Vehicles() {
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const VEHICLES_PER_PAGE = 6

  useEffect(() => {
    loadVehicles()
  }, [])

  const loadVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles', { cache: 'no-store' })

      if (!response.ok) {
        console.error('Error al cargar autos')
        setLoading(false)
        return
      }

      const result = await response.json()
      setAllVehicles(result.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error de conexión:', error)
      setLoading(false)
    }
  }

  const loadMoreVehicles = () => {
    setCurrentPage(prev => prev + 1)
  }

  const showVehicleDetails = async (vehicleId: string) => {
    const { showVehicleDetails: showDetails } = await import('../lib/utils')
    showDetails(vehicleId)
  }

  const vehiclesToShow = allVehicles.slice(0, currentPage * VEHICLES_PER_PAGE)
  const hasMore = vehiclesToShow.length < allVehicles.length

  if (loading) {
    return (
      <section id="vehiculos" className="vehicles">
        <div className="container">
          <div className="section-header">
            <h2>Usados seleccionados</h2>
            <p>Descubrí nuestra amplia gama de vehículos de calidad</p>
          </div>
          <div className="vehicles-grid" id="vehiclesGrid">
            <div className="loading-message" style={{ textAlign: 'center', gridColumn: '1/-1', padding: '2rem' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#3b82f6', marginBottom: '1rem' }}></i>
              <p>Cargando vehículos...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!allVehicles || allVehicles.length === 0) {
    return (
      <section id="vehiculos" className="vehicles">
        <div className="container">
          <div className="section-header">
            <h2>Usados seleccionados</h2>
            <p>Descubrí nuestra amplia gama de vehículos de calidad</p>
          </div>
          <div className="vehicles-grid" id="vehiclesGrid">
            <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '2rem' }}>
              <i className="fas fa-car" style={{ fontSize: '3rem', color: '#9ca3af', marginBottom: '1rem' }}></i>
              <h3 style={{ color: '#6b7280', marginBottom: '0.5rem' }}>No hay vehículos disponibles</h3>
              <p style={{ color: '#9ca3af' }}>Pronto tendremos nuevos vehículos para ti</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="vehiculos" className="vehicles">
      <div className="container">
        <div className="section-header">
          <h2>Usados seleccionados</h2>
          <p>Descubrí nuestra amplia gama de vehículos de calidad</p>
        </div>

        <div className="vehicles-grid" id="vehiclesGrid">
          {vehiclesToShow.map((vehicle) => {
            const hasImages = vehicle.imagenes && vehicle.imagenes.length > 0
            const isOnOffer = vehicle.en_oferta && vehicle.precio_oferta
            const firstImage = vehicle.imagenes?.[0]

            return (
              <div
                key={vehicle.id}
                className={`vehicle-card ${isOnOffer ? 'vehicle-card-offer' : ''} ${vehicle.reservado ? 'vehicle-card-reserved' : ''}`}
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                {isOnOffer && <div className="offer-badge">OFERTA</div>}
                {vehicle.reservado && <div className="reservado-badge">RESERVADO</div>}
                <div className="vehicle-image" style={{ position: 'relative', flexShrink: 0 }}>
                  {hasImages && firstImage ? (
                    <img
                      src={firstImage}
                      alt={`${vehicle.marca} ${vehicle.modelo}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  ) : (
                    <i className="fas fa-car" style={{ fontSize: '3rem', color: '#9ca3af' }}></i>
                  )}
                  {vehicle.vendido && (
                    <div className="vendido-overlay">
                      <div className="vendido-text">VENDIDO</div>
                    </div>
                  )}
                </div>
                <div className="vehicle-info" style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '1rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{vehicle.marca} {vehicle.modelo}</h3>
                  {isOnOffer ? (
                    <div className="price-container" style={{ marginBottom: '0.5rem' }}>
                      <p className="vehicle-price-original">${Number(vehicle.precio).toLocaleString()}</p>
                      <p className="vehicle-price-offer">${Number(vehicle.precio_oferta).toLocaleString()}</p>
                      <div className="savings">Ahorrás ${(Number(vehicle.precio) - Number(vehicle.precio_oferta)).toLocaleString()}</div>
                    </div>
                  ) : (
                    <p className="vehicle-price" style={{ margin: '0 0 0.5rem 0' }}>${Number(vehicle.precio).toLocaleString()}</p>
                  )}
                  <div className="vehicle-details" style={{ marginBottom: '0.5rem' }}>
                    <span><i className="fas fa-calendar"></i> {vehicle.año || 'N/A'}</span>
                  </div>
                  {vehicle.descripcion && (
                    <p
                      className="vehicle-description"
                      style={{
                        whiteSpace: 'pre-line',
                        flex: 1,
                        margin: '0 0 1rem 0',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {vehicle.descripcion}
                    </p>
                  )}
                  <button
                    className="btn btn-outline"
                    onClick={() => showVehicleDetails(vehicle.id)}
                    style={{ marginTop: 'auto' }}
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            )
          })}

          {hasMore && (
            <div className="load-more-container" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', marginTop: '1rem' }}>
              <button className="btn btn-primary load-more-btn" onClick={loadMoreVehicles}>
                <i className="fas fa-plus"></i>
                Ver más vehículos ({allVehicles.length - vehiclesToShow.length} restantes)
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

