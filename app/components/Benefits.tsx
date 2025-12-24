'use client'

export default function Benefits() {
  const openServiceModal = (serviceId: string) => {
    if (typeof window !== 'undefined' && (window as any).openServiceModal) {
      (window as any).openServiceModal(serviceId)
    }
  }

  return (
    <section id="beneficios" className="benefits">
      <div className="container">
        <div className="section-header">
          <h2>Facilidades</h2>
          <p>La satisfacción de nuestros clientes es nuestra prioridad</p>
        </div>

        <div className="benefits-services">
          <div className="services-grid">
            <div className="service-card">
              <i className="fas fa-credit-card"></i>
              <h4>Financiacion de la casa</h4>
              <p>Entregando el 50%. NO IMPORTA CLEARING.</p>
              <button className="btn btn-outline service-info-btn" onClick={() => openServiceModal('financiacion-casa')}>
                Más info
              </button>
            </div>
            <div className="service-card">
              <i className="fas fa-credit-card"></i>
              <h4>Financiación bancaria</h4>
              <p>Llevalo hasta 100% financiado</p>
              <button className="btn btn-outline service-info-btn" onClick={() => openServiceModal('financiacion-bancaria-2')}>
                Más info
              </button>
            </div>
            <div className="service-card">
              <i className="fas fa-car-side"></i>
              <h4>Gestión de seguros</h4>
              <p>Gestionamos tu seguro en el momento</p>
              <button className="btn btn-outline service-info-btn" onClick={() => openServiceModal('cambio')}>
                Más info
              </button>
            </div>
            <div className="service-card">
              <i className="fas fa-car-side"></i>
              <h4>Tramites de gestoría</h4>
              <p>Nos encargamos de todos los tramites de tu vehículo</p>
              <button className="btn btn-outline service-info-btn" onClick={() => openServiceModal('tramites-de-gestion')}>
                Más info
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

