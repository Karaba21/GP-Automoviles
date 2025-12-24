'use client'

export default function Location() {
  return (
    <section id="ubicacion" className="location">
      <div className="container">
        <div className="section-header">
          <h2>Nuestra Ubicación</h2>
          <p>Visítanos en nuestras instalaciones</p>
        </div>
        
        <div className="location-content">
          <div className="location-info">
            <div className="location-details">
              <h3>GP Automóviles</h3>
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h4>Dirección</h4>
                  <p>General Fructuoso Rivera 3334, San José de Mayo</p>
                </div>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <div>
                  <h4>Teléfono</h4>
                  <p>+598 99 493 618</p>
                </div>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <h4>Email</h4>
                  <p>gp.automoviless@gmail.com</p>
                </div>
              </div>
              <div className="contact-item">
                <i className="fas fa-clock"></i>
                <div>
                  <h4>Horarios</h4>
                  <p>Lunes - Viernes: 8:00 - 19:00 <br />Sábados: 8:00 - 17:00 PM <br />Domingos: Con previa agenda</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="location-map">
            <div className="map-placeholder">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105401.69374255819!2d-56.85644558359375!3d-34.35549329999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a17700781ec557%3A0xd119d398e0d4c10c!2sGp%20autom%C3%B3viles!5e0!3m2!1ses-419!2suy!4v1759944602851!5m2!1ses-419!2suy" 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                style={{ width: '100%', height: '100%', border: 'none', borderRadius: '16px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

