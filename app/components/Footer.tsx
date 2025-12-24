'use client'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>GP Automóviles</h3>
            <p>Encontranos en nuestras redes sociales</p>
            <div className="social-links">
              <a href="https://www.facebook.com/share/1CsDq3GYgu/?mibextid=wwXIfr"><i className="fab fa-facebook"></i> </a>
              <a href="https://www.instagram.com/gp.automoviles_?igsh=N3YxMnE4Nmx1YjB1"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Enlaces Rápidos</h4>
            <ul>
              <li><a href="#inicio">Inicio</a></li>
              <li><a href="#vehiculos">Vehículos</a></li>
              <li><a href="#cerokm">0km</a></li>
              <li><a href="#beneficios">Facilidades</a></li>
              <li><a href="#reseñas">Reseñas</a></li>
              <li><a href="#cotizacion">Cotización</a></li>
              <li><a href="#ubicacion">Ubicación</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contacto</h4>
            <p><i className="fas fa-phone"></i> +598 99 493 618</p>
            <p><i className="fas fa-envelope"></i> gp.automoviless@gmail.com</p>
            <p><i className="fas fa-map-marker-alt"></i> General Fructuoso Rivera 3334, San José de Mayo</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Pagina creada por <a href="https://savsolutionsuy.com" target="_blank">Sav Solutions</a></p>
          <p>&copy; 2025 GP Automóviles. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

