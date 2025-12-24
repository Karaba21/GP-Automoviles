'use client'

export default function Reviews() {
  return (
    <section id="reseñas" className="reviews">
      <div className="container">
        <div className="section-header">
          <h2>Lo que dicen nuestros clientes</h2>
          <p>Reseñas reales de Google</p>
        </div>
        
        <div className="reviews-content">
          <div className="google-reviews-widget">
            <div className="google-reviews-header">
              <div className="google-logo">
                <i className="fab fa-google"></i>
              </div>
              <div className="google-info">
                <h3>GP Automóviles</h3>
                <div className="google-rating">
                  <div className="stars">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <span className="rating-text">4.9 de 5 (+40 reseñas)</span>
                </div>
              </div>
            </div>
            
            <div className="reviews-grid">
              <div className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="reviewer-details">
                      <h4>Ezequiel Lezama</h4>
                      <div className="review-stars">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                    </div>
                  </div>
                  <span className="review-date">hace 2 semanas</span>
                </div>
                <p className="review-text">"Excelente la atencion de gonza, resolvio todas mis consultas y total transparencia con los detalles del auto. Super recomendable y volveremos sin duda!!"</p>
              </div>

              <div className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="reviewer-details">
                      <h4>Santiago Rodríguez</h4>
                      <div className="review-stars">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                    </div>
                  </div>
                  <span className="review-date">hace 5 meses</span>
                </div>
                <p className="review-text">"Desde la primera comunicación muy atento, demostrando confianza, yo que estoy a distancia hicimos hasta videollamada plateada por él para que viaje seguro.
                  El auto en excelente estado tal cual lo dijo. Muy recomendable por el estado del auto y su trato!"</p>
              </div>

              <div className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="reviewer-details">
                      <h4>Lucia Viera</h4>
                      <div className="review-stars">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                    </div>
                  </div>
                  <span className="review-date">hace 2 semanas</span>
                </div>
                <p className="review-text">"Excelente atención, resolviendo inquietudes, dudas y demás.
                  Sin dudas el próximo 0km será ahí nuevamente 💪🏻…</p>
              </div>
             
              <div className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="reviewer-details">
                      <h4>Fran Alvarez</h4>
                      <div className="review-stars">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                    </div>
                  </div>
                  <span className="review-date">hace 1 mes</span>
                </div>
                <p className="review-text">"Excelente atención, muy buena disposición y transparencia en todo el proceso. Me sentí acompañado desde el primer momento y cumplieron con lo prometido. Los vehículos están en muy buen estado. Recomiendo totalmente esta automotora.
                  Altamente confiable y con excelente servicio!</p>
              </div>
            </div>
            
            <div className="google-reviews-footer">
              <a href="https://www.google.com/maps/place/Gp+autom%C3%B3viles/@-34.3554933,-56.8564456,15z/data=!4m6!3m5!1s0x95a17700781ec557:0xd119d398e0d4c10c!8m2!3d-34.3554933!4d-56.8564456!16s%2Fg%2F11c0q8q8q8" target="_blank" className="btn btn-primary">
                <i className="fab fa-google"></i>
                Ver todas las reseñas en Google
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

