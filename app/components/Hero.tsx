'use client'

export default function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Bienvenido a <span className="highlight">GP Automóviles</span></h1>
          <p>¡Hola! Somos GP Automóviles, tu mejor aliado a la hora de elegir tu usado o 0 km.
            Nos encargamos de buscar la mejor opción según tus necesidades, con planes de financiación que se adaptan a vos.
            Además, contamos con gestoría propia para brindarte seguridad y tranquilidad en tu compra.</p>
          <div className="hero-buttons">
            <a href="#vehiculos" className="btn btn-primary">Ver Vehículos</a>
            <a href="#ubicacion" className="btn btn-secondary">Visítanos</a>
          </div>
        </div>
        <div className="hero-image">
          <div className="car-showcase">
            <i className="fas fa-car-side"></i>
          </div>
        </div>
      </div>
    </section>
  )
}

