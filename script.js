// Navegación móvil
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Cerrar menú móvil al hacer clic en un enlace
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Navegación suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Cambio de header al hacer scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});


// Animaciones al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observar elementos para animaciones
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.vehicle-card, .testimonial, .service-card, .stat');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Contador animado para estadísticas
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        element.textContent = Math.floor(start);
        
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

// Activar contadores cuando la sección sea visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat h3');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent.replace(/\D/g, ''));
                const suffix = stat.textContent.replace(/\d/g, '');
                stat.textContent = '0' + suffix;
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}


// Función para integrar con Google Maps (cuando se implemente)
function initMap() {
    // Esta función se llamaría cuando se integre Google Maps
    console.log('Inicializando mapa...');
    // Aquí iría el código de Google Maps API
}

// Función para manejar el scroll del header
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const header = document.querySelector('.header');
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// Agregar transición suave al header
const header = document.querySelector('.header');
header.style.transition = 'transform 0.3s ease-in-out';

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Función para validar formularios
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            input.style.borderColor = '#d1d5db';
        }
    });
    
    return isValid;
}

// Función para formatear números como moneda
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(amount);
}

// Función para hacer peticiones HTTP (para integración con CRM)
async function fetchFromCRM(endpoint, options = {}) {
    try {
        const response = await fetch(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching from CRM:', error);
        showNotification('Error al cargar datos del CRM', 'error');
        return null;
    }
}

// Función para manejar errores globales
window.addEventListener('error', (event) => {
    console.error('Error global:', event.error);
    showNotification('Ha ocurrido un error inesperado', 'error');
});

// Función para manejar promesas rechazadas
window.addEventListener('unhandledrejection', (event) => {
    console.error('Promesa rechazada:', event.reason);
    showNotification('Error en la aplicación', 'error');
});

// Exportar funciones para uso global
window.GPAutomoviles = {
    showVehicleDetails,
    showNotification,
    validateForm,
    formatCurrency,
    loadVehiclesFromSupabase,
    renderVehicles
};


// Integración con Supabase para mostrar autos
const SUPABASE_URL = 'https://avnpyazxusstgcdeufcw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2bnB5YXp4dXNzdGdjZGV1ZmN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyOTI5NTQsImV4cCI6MjA3NTg2ODk1NH0.295vriO7O4I2ak5I2XqCysIVQ-KQSRIm4umkb_E_dsA';

// Inicializar Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Función para cargar autos desde Supabase
async function loadVehiclesFromSupabase() {
  try {
    console.log('Cargando autos desde Supabase...');
    const { data, error } = await supabaseClient
      .from('Autos')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error al cargar autos:', error);
      return [];
    }

    console.log('Autos cargados exitosamente:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error de conexión:', error);
    return [];
  }
}

// Variables globales para paginación
let allVehicles = [];
let currentPage = 1;
const VEHICLES_PER_PAGE = 6;

// Función para renderizar autos en el sitio principal con paginación
async function renderVehicles() {
  const vehiclesGrid = document.getElementById('vehiclesGrid');
  if (!vehiclesGrid) return;

  try {
    // Cargar todos los vehículos solo la primera vez
    if (allVehicles.length === 0) {
      allVehicles = await loadVehiclesFromSupabase();
    }

    if (!allVehicles || allVehicles.length === 0) {
      vehiclesGrid.innerHTML = `
        <div style="text-align: center; grid-column: 1/-1; padding: 2rem;">
          <i class="fas fa-car" style="font-size: 3rem; color: #9ca3af; margin-bottom: 1rem;"></i>
          <h3 style="color: #6b7280; margin-bottom: 0.5rem;">No hay vehículos disponibles</h3>
          <p style="color: #9ca3af;">Pronto tendremos nuevos vehículos para ti</p>
        </div>
      `;
      return;
    }

    // Calcular qué vehículos mostrar en la página actual
    const startIndex = 0;
    const endIndex = currentPage * VEHICLES_PER_PAGE;
    const vehiclesToShow = allVehicles.slice(startIndex, endIndex);

    // Renderizar solo los vehículos de la página actual
    vehiclesGrid.innerHTML = vehiclesToShow
      .map(vehicle => {
        const hasImages = vehicle.imagenes && vehicle.imagenes.length > 0;
        const isOnOffer = vehicle.en_oferta && vehicle.precio_oferta;
        
        return `
          <div class="vehicle-card ${isOnOffer ? 'vehicle-card-offer' : ''}">
            ${isOnOffer ? '<div class="offer-badge">OFERTA</div>' : ''}
            <div class="vehicle-image">
              ${hasImages 
                ? `<img src="${vehicle.imagenes[0]}" alt="${vehicle.marca} ${vehicle.modelo}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`
                : `<i class="fas fa-car" style="font-size: 3rem; color: #9ca3af;"></i>`
              }
            </div>
            <div class="vehicle-info">
              <h3>${vehicle.marca} ${vehicle.modelo}</h3>
              ${isOnOffer ? `
                <div class="price-container">
                  <p class="vehicle-price-original">$${Number(vehicle.precio).toLocaleString()}</p>
                  <p class="vehicle-price-offer">$${Number(vehicle.precio_oferta).toLocaleString()}</p>
                  <div class="savings">Ahorrás $${(Number(vehicle.precio) - Number(vehicle.precio_oferta)).toLocaleString()}</div>
                </div>
              ` : `
                <p class="vehicle-price">$${Number(vehicle.precio).toLocaleString()}</p>
              `}
              <div class="vehicle-details">
                <span><i class="fas fa-calendar"></i> ${vehicle.año || 'N/A'}</span>
              </div>
              ${vehicle.descripcion ? `<p class="vehicle-description">${vehicle.descripcion.substring(0, 100)}${vehicle.descripcion.length > 100 ? '...' : ''}</p>` : ''}
              <button class="btn btn-outline" onclick="showVehicleDetails('${vehicle.id}')">Ver Detalles</button>
            </div>
          </div>
        `;
      })
      .join('');

    // Agregar botón "Ver más" si hay más vehículos
    const totalVehicles = allVehicles.length;
    const vehiclesShown = vehiclesToShow.length;
    
    if (vehiclesShown < totalVehicles) {
      const loadMoreButton = document.createElement('div');
      loadMoreButton.className = 'load-more-container';
      loadMoreButton.style.cssText = `
        grid-column: 1/-1;
        text-align: center;
        padding: 2rem;
        margin-top: 1rem;
      `;
      
      loadMoreButton.innerHTML = `
        <button class="btn btn-primary load-more-btn" onclick="loadMoreVehicles()">
          <i class="fas fa-plus"></i>
          Ver más vehículos (${totalVehicles - vehiclesShown} restantes)
        </button>
      `;
      
      vehiclesGrid.appendChild(loadMoreButton);
    }
    
  } catch (error) {
    console.error('Error al renderizar vehículos:', error);
    vehiclesGrid.innerHTML = `
      <div style="text-align: center; grid-column: 1/-1; padding: 2rem;">
        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;"></i>
        <h3 style="color: #ef4444; margin-bottom: 0.5rem;">Error al cargar vehículos</h3>
        <p style="color: #6b7280;">Por favor, recarga la página e intenta nuevamente</p>
      </div>
    `;
  }
}

// Función para cargar más vehículos
function loadMoreVehicles() {
  const loadMoreBtn = document.querySelector('.load-more-btn');
  
  // Agregar estado de carga al botón
  if (loadMoreBtn) {
    loadMoreBtn.classList.add('loading');
    loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
  }
  
  // Simular un pequeño delay para la animación
  setTimeout(() => {
    currentPage++;
    renderVehicles();
  }, 500);
}


// Función para cambiar imagen en el modal
window.changeModalImage = function(vehicleId, direction) {
  console.log('changeModalImage called:', vehicleId, direction);
  
  const images = window[`modalImages_${vehicleId}`];
  console.log('Images found:', images);
  
  if (!images || images.length <= 1) {
    console.log('No images or only one image');
    return;
  }
  
  // Buscar el modal activo
  const modal = document.querySelector('.vehicle-modal');
  console.log('Modal found:', modal);
  
  if (!modal) return;
  
  const mainImg = modal.querySelector('#modal-main-img');
  const currentSpan = modal.querySelector('#modal-current');
  const thumbnails = modal.querySelectorAll('.modal-thumbnail');
  
  console.log('Elements found:', { mainImg, currentSpan, thumbnails: thumbnails.length });
  
  if (!mainImg || !currentSpan) return;
  
  const currentIndex = parseInt(currentSpan.textContent) - 1;
  let newIndex = currentIndex + direction;
  
  console.log('Current index:', currentIndex, 'New index:', newIndex);
  
  // Manejar el bucle
  if (newIndex >= images.length) {
    newIndex = 0;
  } else if (newIndex < 0) {
    newIndex = images.length - 1;
  }
  
  console.log('Final new index:', newIndex);
  
  // Cambiar imagen principal
  mainImg.src = images[newIndex];
  
  // Actualizar contador
  currentSpan.textContent = newIndex + 1;
  
  // Actualizar thumbnails
  thumbnails.forEach((thumb, index) => {
    if (index === newIndex) {
      thumb.classList.add('active');
      thumb.style.border = '2px solid #3b82f6';
    } else {
      thumb.classList.remove('active');
      thumb.style.border = '2px solid transparent';
    }
  });
  
  console.log('Image changed successfully');
}

// Función para establecer imagen específica en el modal
window.setModalImage = function(vehicleId, index) {
  console.log('setModalImage called:', vehicleId, index);
  
  const images = window[`modalImages_${vehicleId}`];
  console.log('Images found:', images);
  
  if (!images || index < 0 || index >= images.length) {
    console.log('Invalid images or index');
    return;
  }
  
  // Buscar el modal activo
  const modal = document.querySelector('.vehicle-modal');
  console.log('Modal found:', modal);
  
  if (!modal) return;
  
  const mainImg = modal.querySelector('#modal-main-img');
  const currentSpan = modal.querySelector('#modal-current');
  const thumbnails = modal.querySelectorAll('.modal-thumbnail');
  
  console.log('Elements found:', { mainImg, currentSpan, thumbnails: thumbnails.length });
  
  if (!mainImg || !currentSpan) return;
  
  // Cambiar imagen principal
  mainImg.src = images[index];
  
  // Actualizar contador
  currentSpan.textContent = index + 1;
  
  // Actualizar thumbnails
  thumbnails.forEach((thumb, i) => {
    if (i === index) {
      thumb.classList.add('active');
      thumb.style.border = '2px solid #3b82f6';
    } else {
      thumb.classList.remove('active');
      thumb.style.border = '2px solid transparent';
    }
  });
  
  console.log('Image set successfully');
}

// Función para mostrar detalles del vehículo
async function showVehicleDetails(vehicleId) {
  try {
    const { data: vehicle, error } = await supabaseClient
      .from('Autos')
      .select('*')
      .eq('id', vehicleId)
      .single();

    if (error) {
      console.error('Error al cargar detalles del vehículo:', error);
      showNotification('Error al cargar los detalles del vehículo', 'error');
      return;
    }

    if (!vehicle) {
      showNotification('Vehículo no encontrado', 'error');
      return;
    }

    // Crear modal con detalles del vehículo
    const modal = document.createElement('div');
    modal.className = 'vehicle-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      padding: 20px;
    `;

    // Función para organizar thumbnails en filas de máximo 8
    const organizeThumbnails = (images) => {
      const thumbnailsPerRow = 8;
      const rows = [];
      for (let i = 0; i < images.length; i += thumbnailsPerRow) {
        rows.push(images.slice(i, i + thumbnailsPerRow));
      }
      return rows;
    };

    const thumbnailRows = vehicle.imagenes && vehicle.imagenes.length > 1 ? organizeThumbnails(vehicle.imagenes) : [];

    // Detectar si es móvil
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // LAYOUT MÓVIL - Fotos arriba, info abajo
      modal.innerHTML = `
        <div class="modal-content mobile-modal" style="
          background: white;
          border-radius: 20px;
          width: 95vw;
          height: 90vh;
          max-width: 500px;
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        ">
          <button class="close-modal" style="
            position: absolute;
            top: 15px;
            right: 15px;
            background: rgba(255, 255, 255, 0.9);
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #374151;
            z-index: 10;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          ">&times;</button>
          
          <!-- SECCIÓN DE FOTOS ARRIBA (45% del modal) -->
          <div class="modal-photos-section" style="
            position: relative;
            height: 45%;
            background: #f8fafc;
            border-radius: 20px 20px 0 0;
            overflow: hidden;
          ">
            ${vehicle.imagenes && vehicle.imagenes.length > 0 
              ? `
                <div class="modal-image-gallery" style="position: relative; height: 100%; display: flex; flex-direction: column;">
                  <div class="modal-main-image" style="
                    width: 100%; 
                    height: 100%; 
                    position: relative; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
                  ">
                    <img id="modal-main-img" src="${vehicle.imagenes[0]}" alt="${vehicle.marca} ${vehicle.modelo}" 
                         style="
                           max-width: 100%; 
                           max-height: 100%; 
                           object-fit: contain;
                           border-radius: 12px;
                           box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                         ">
                    ${vehicle.imagenes.length > 1 ? `
                      <button class="modal-prev-btn" data-vehicle-id="${vehicle.id}" data-direction="-1"
                              style="
                                position: absolute; 
                                left: 15px; 
                                top: 50%; 
                                transform: translateY(-50%); 
                                background: rgba(255, 255, 255, 0.9); 
                                color: #374151; 
                                border: none; 
                                border-radius: 50%; 
                                width: 45px; 
                                height: 45px; 
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                                font-size: 16px;
                              ">
                        <i class="fas fa-chevron-left"></i>
                      </button>
                      <button class="modal-next-btn" data-vehicle-id="${vehicle.id}" data-direction="1"
                              style="
                                position: absolute; 
                                right: 15px; 
                                top: 50%; 
                                transform: translateY(-50%); 
                                background: rgba(255, 255, 255, 0.9); 
                                color: #374151; 
                                border: none; 
                                border-radius: 50%; 
                                width: 45px; 
                                height: 45px; 
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                                font-size: 16px;
                              ">
                        <i class="fas fa-chevron-right"></i>
                      </button>
                      <div class="modal-image-counter" 
                           style="
                             position: absolute; 
                             bottom: 15px; 
                             right: 15px; 
                             background: rgba(0, 0, 0, 0.7); 
                             color: white; 
                             padding: 8px 12px; 
                             border-radius: 20px; 
                             font-size: 12px;
                             font-weight: 600;
                             backdrop-filter: blur(10px);
                           ">
                        <span id="modal-current">1</span> / <span id="modal-total">${vehicle.imagenes.length}</span>
                      </div>
                    ` : ''}
                  </div>
                </div>
              `
              : `<div style="
                   width: 100%; 
                   height: 100%; 
                   background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); 
                   display: flex; 
                   align-items: center; 
                   justify-content: center; 
                   flex-direction: column;
                   color: #9ca3af;
                 ">
                   <i class="fas fa-car" style="font-size: 4rem; margin-bottom: 1rem;"></i>
                   <p style="font-size: 1.1rem; font-weight: 500;">Sin imágenes disponibles</p>
                 </div>`
            }
          </div>
          
          <!-- SECCIÓN DE INFORMACIÓN ABAJO (55% del modal) -->
          <div class="modal-info-section" style="
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background: white;
          ">
            <!-- Título y Precio -->
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="
                margin: 0 0 12px 0; 
                color: #1f2937; 
                font-size: 1.8rem; 
                font-weight: 700;
                line-height: 1.2;
              ">${vehicle.marca} ${vehicle.modelo}</h2>
              
              ${vehicle.en_oferta && vehicle.precio_oferta ? `
                <div style="
                  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
                  padding: 16px;
                  border-radius: 16px;
                  border: 2px solid #fecaca;
                  margin-bottom: 12px;
                ">
                  <div style="
                    font-size: 1rem; 
                    color: #6b7280; 
                    text-decoration: line-through; 
                    margin-bottom: 8px;
                    font-weight: 500;
                  ">
                    Precio original: $${Number(vehicle.precio).toLocaleString()}
                  </div>
                  <div style="
                    font-size: 1.6rem; 
                    font-weight: 700; 
                    color: #dc2626; 
                    margin-bottom: 8px;
                  ">
                    Precio oferta: $${Number(vehicle.precio_oferta).toLocaleString()}
                  </div>
                  <div style="
                    background: linear-gradient(135deg, #dc2626, #b91c1c); 
                    color: white; 
                    padding: 8px 16px; 
                    border-radius: 20px; 
                    font-size: 0.9rem; 
                    font-weight: 700; 
                    display: inline-block; 
                    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
                  ">
                    ¡Ahorrás $${(Number(vehicle.precio) - Number(vehicle.precio_oferta)).toLocaleString()}!
                  </div>
                </div>
              ` : `
                <div style="
                  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
                  color: #1d4ed8;
                  padding: 16px;
                  border-radius: 16px;
                  border: 2px solid #bfdbfe;
                  font-size: 1.5rem;
                  font-weight: 700;
                  margin-bottom: 12px;
                ">
                  $${Number(vehicle.precio).toLocaleString()}
                </div>
              `}
            </div>
            
            <!-- Detalles del vehículo -->
            <div style="
              background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
              border-left: 4px solid #0ea5e9;
              padding: 16px;
              border-radius: 12px;
              text-align: center;
              margin-bottom: 20px;
              box-shadow: 0 2px 8px rgba(14, 165, 233, 0.1);
            ">
              <strong style="
                color: #0c4a6e; 
                font-size: 0.9rem; 
                display: block;
                margin-bottom: 4px;
              ">Año</strong>
              <span style="
                color: #0369a1; 
                font-size: 1.2rem; 
                font-weight: 600;
              ">${vehicle.año || 'N/A'}</span>
            </div>
            
            <!-- Descripción -->
            ${vehicle.descripcion ? `
              <div style="
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                padding: 16px;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
                margin-bottom: 20px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
              ">
                <h3 style="
                  margin: 0 0 12px 0; 
                  color: #1e293b; 
                  font-size: 1.1rem; 
                  font-weight: 600;
                  border-bottom: 2px solid #e2e8f0;
                  padding-bottom: 8px;
                ">Descripción</h3>
                <p style="
                  line-height: 1.6; 
                  color: #475569; 
                  margin: 0; 
                  font-size: 0.95rem;
                ">${vehicle.descripcion}</p>
              </div>
            ` : ''}
            
            <!-- Botones de acción -->
            <div class="modal-actions" style="
              display: flex; 
              flex-direction: column; 
              gap: 12px;
            ">
              <a href="tel:+59899493618" style="
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 16px 20px;
                border-radius: 16px;
                text-decoration: none;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                font-weight: 600;
                font-size: 1rem;
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                transition: all 0.3s ease;
                border: 2px solid #10b981;
              " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(16, 185, 129, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(16, 185, 129, 0.3)'">
                <i class="fas fa-phone" style="font-size: 1.1rem;"></i>
                Llamar Ahora
              </a>
              <a href="#" onclick="generateVehicleWhatsAppMessage('${vehicle.marca}', '${vehicle.modelo}', '${vehicle.año}'); return false;" style="
                background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
                color: white;
                padding: 16px 20px;
                border-radius: 16px;
                text-decoration: none;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                font-weight: 600;
                font-size: 1rem;
                box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
                transition: all 0.3s ease;
                border: 2px solid #25d366;
              " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(37, 211, 102, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(37, 211, 102, 0.3)'">
                <i class="fab fa-whatsapp" style="font-size: 1.1rem;"></i>
                WhatsApp
              </a>
            </div>
          </div>
          
          <!-- Thumbnails en la parte inferior si hay múltiples imágenes -->
          ${vehicle.imagenes && vehicle.imagenes.length > 1 ? `
            <div class="modal-thumbnails-container" style="
              padding: 12px 20px;
              background: #f8fafc;
              border-top: 1px solid #e2e8f0;
              max-height: 100px;
              overflow-x: auto;
              overflow-y: hidden;
            ">
              <div style="
                display: flex; 
                gap: 8px; 
                justify-content: center;
                padding: 4px 0;
              ">
                ${vehicle.imagenes.map((img, index) => `
                  <img src="${img}" alt="Thumbnail ${index + 1}" 
                       class="modal-thumbnail ${index === 0 ? 'active' : ''}"
                       data-vehicle-id="${vehicle.id}" data-image-index="${index}"
                       style="
                         width: 50px; 
                         height: 50px; 
                         object-fit: cover; 
                         border-radius: 8px; 
                         cursor: pointer; 
                         border: 2px solid ${index === 0 ? '#3b82f6' : 'transparent'}; 
                         flex-shrink: 0;
                         transition: all 0.2s ease;
                       ">
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `;
    } else {
      // LAYOUT PC - Fotos izquierda, info derecha (como estaba antes)
      modal.innerHTML = `
        <div class="modal-content desktop-modal" style="
          background: white;
          border-radius: 12px;
          width: 1200px;
          height: 800px;
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
        ">
          <button class="close-modal" style="
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #6b7280;
            z-index: 1;
          ">&times;</button>
          
          <div style="padding: 2rem; height: 100%; display: flex; flex-direction: column;">
            <div class="modal-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start; flex: 1; min-height: 0;">
              <!-- Lado izquierdo: Fotos -->
              <div class="modal-images-section" style="display: flex; flex-direction: column; height: 100%;">
                ${vehicle.imagenes && vehicle.imagenes.length > 0 
                  ? `
                    <div class="modal-image-gallery" style="position: relative; flex: 1; display: flex; flex-direction: column;">
                      <div class="modal-main-image" style="width: 100%; height: 450px; position: relative; border-radius: 8px; overflow: hidden; flex-shrink: 0;">
                        <img id="modal-main-img" src="${vehicle.imagenes[0]}" alt="${vehicle.marca} ${vehicle.modelo}" 
                             style="width: 100%; height: 100%; object-fit: contain;">
                        ${vehicle.imagenes.length > 1 ? `
                          <button class="modal-prev-btn" data-vehicle-id="${vehicle.id}" data-direction="-1"
                                  style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); 
                                         background: rgba(0,0,0,0.5); color: white; border: none; 
                                         border-radius: 50%; width: 40px; height: 40px; cursor: pointer;">
                            <i class="fas fa-chevron-left"></i>
                          </button>
                          <button class="modal-next-btn" data-vehicle-id="${vehicle.id}" data-direction="1"
                                  style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); 
                                         background: rgba(0,0,0,0.5); color: white; border: none; 
                                         border-radius: 50%; width: 40px; height: 40px; cursor: pointer;">
                            <i class="fas fa-chevron-right"></i>
                          </button>
                          <div class="modal-image-counter" 
                               style="position: absolute; bottom: 10px; right: 10px; 
                                      background: rgba(0,0,0,0.7); color: white; 
                                      padding: 5px 10px; border-radius: 15px; font-size: 12px;">
                            <span id="modal-current">1</span> / <span id="modal-total">${vehicle.imagenes.length}</span>
                          </div>
                        ` : ''}
                      </div>
                      ${vehicle.imagenes.length > 1 ? `
                        <div class="modal-thumbnails-container" style="margin-top: 10px; flex-shrink: 0; max-height: 120px; overflow-y: auto;">
                          ${thumbnailRows.map((row, rowIndex) => `
                            <div class="modal-thumbnails-row" style="display: flex; gap: 8px; margin-bottom: 8px; justify-content: flex-start;">
                              ${row.map((img, index) => {
                                const globalIndex = rowIndex * 8 + index;
                                return `
                                  <img src="${img}" alt="Thumbnail ${globalIndex + 1}" 
                                       class="modal-thumbnail ${globalIndex === 0 ? 'active' : ''}"
                                       data-vehicle-id="${vehicle.id}" data-image-index="${globalIndex}"
                                       style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; 
                                              cursor: pointer; border: 2px solid ${globalIndex === 0 ? '#3b82f6' : 'transparent'}; 
                                              flex-shrink: 0;">
                                `;
                              }).join('')}
                            </div>
                          `).join('')}
                        </div>
                      ` : ''}
                    </div>
                  `
                  : `<div style="width: 100%; height: 350px; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fas fa-car" style="font-size: 4rem; color: #9ca3af;"></i></div>`
                }
              </div>
              
              <!-- Lado derecho: Toda la información de texto -->
              <div class="modal-info-section" style="display: flex; flex-direction: column; gap: 1rem; height: 100%; overflow: hidden;">
                <div style="flex-shrink: 0;">
                  <h2 style="margin-bottom: 1rem; color: #1f2937; font-size: 1.8rem;">${vehicle.marca} ${vehicle.modelo}</h2>
                  ${vehicle.en_oferta && vehicle.precio_oferta ? `
                    <div style="margin-bottom: 1rem;">
                      <div style="font-size: 1.2rem; color: #6b7280; text-decoration: line-through; margin-bottom: 0.5rem;">
                        Precio original: $${Number(vehicle.precio).toLocaleString()}
                      </div>
                      <div style="font-size: 1.8rem; font-weight: bold; color: #dc3545; margin-bottom: 0.5rem;">
                        Precio oferta: $${Number(vehicle.precio_oferta).toLocaleString()}
                      </div>
                      <div style="background: linear-gradient(135deg, #dc3545, #c82333); color: white; padding: 0.4rem 0.8rem; border-radius: 15px; font-size: 0.9rem; font-weight: 600; display: inline-block; box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);">
                        ¡Ahorrás $${(Number(vehicle.precio) - Number(vehicle.precio_oferta)).toLocaleString()}!
                      </div>
                    </div>
                  ` : `
                    <p style="font-size: 1.6rem; font-weight: bold; color: #3b82f6; margin-bottom: 1rem;">$${Number(vehicle.precio).toLocaleString()}</p>
                  `}
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; flex-shrink: 0;">
                  <div style="padding: 0.8rem; background: #f9fafb; border-radius: 8px; border-left: 4px solid #3b82f6;">
                    <strong style="color: #1f2937;">Año:</strong><br>
                    <span style="color: #4b5563;">${vehicle.año || 'N/A'}</span>
                  </div>
                </div>
                
                ${vehicle.descripcion ? `
                  <div style="background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0; flex: 1; overflow: hidden; display: flex; flex-direction: column;">
                    <h3 style="margin-bottom: 0.8rem; color: #1f2937; font-size: 1.1rem; flex-shrink: 0;">Descripción</h3>
                    <div style="overflow-y: auto; flex: 1; padding-right: 5px;">
                      <p style="line-height: 1.5; color: #4b5563; margin: 0; font-size: 0.9rem;">${vehicle.descripcion}</p>
                    </div>
                  </div>
                ` : ''}
                
                <div class="modal-actions" style="display: flex; gap: 1rem; flex-shrink: 0;">
                  <a href="tel:+59899493618" style="
                    background: #10b981;
                    color: white;
                    padding: 0.8rem 1.5rem;
                    border-radius: 8px;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    flex: 1;
                    justify-content: center;
                    font-size: 0.9rem;
                  " onmouseover="this.style.background='#059669'" onmouseout="this.style.background='#10b981'">
                    <i class="fas fa-phone"></i>
                    Llamar
                  </a>
                  <a href="#" onclick="generateVehicleWhatsAppMessage('${vehicle.marca}', '${vehicle.modelo}', '${vehicle.año}'); return false;" style="
                    background: #25d366;
                    color: white;
                    padding: 0.8rem 1.5rem;
                    border-radius: 8px;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    flex: 1;
                    justify-content: center;
                    font-size: 0.9rem;
                  " onmouseover="this.style.background='#128c7e'" onmouseout="this.style.background='#25d366'">
                    <i class="fab fa-whatsapp"></i>
                    WhatsApp
                  </a>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      `;
    }

    document.body.appendChild(modal);

    // Guardar las imágenes del vehículo para el modal
    window[`modalImages_${vehicle.id}`] = vehicle.imagenes;
    console.log('Images saved for vehicle', vehicle.id, ':', vehicle.imagenes);

    // Agregar event listeners para los botones del modal
    const prevBtn = modal.querySelector('.modal-prev-btn');
    const nextBtn = modal.querySelector('.modal-next-btn');
    const thumbnails = modal.querySelectorAll('.modal-thumbnail');

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Prev button clicked');
        const vehicleId = prevBtn.getAttribute('data-vehicle-id');
        console.log('Vehicle ID:', vehicleId);
        changeModalImage(vehicleId, -1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Next button clicked');
        const vehicleId = nextBtn.getAttribute('data-vehicle-id');
        console.log('Vehicle ID:', vehicleId);
        changeModalImage(vehicleId, 1);
      });
    }

    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Thumbnail clicked');
        const vehicleId = thumb.getAttribute('data-vehicle-id');
        const imageIndex = parseInt(thumb.getAttribute('data-image-index'));
        console.log('Vehicle ID:', vehicleId, 'Index:', imageIndex);
        setModalImage(vehicleId, imageIndex);
      });
    });

    // Cerrar modal
    const closeModal = () => {
      document.body.removeChild(modal);
    };

    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Cerrar con ESC
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);

  } catch (error) {
    console.error('Error al mostrar detalles:', error);
    showNotification('Error al cargar los detalles del vehículo', 'error');
  }
}

// Función para generar mensaje de WhatsApp para vehículo específico del modal
function generateVehicleWhatsAppMessage(marca, modelo, año) {
  // Construir mensaje personalizado para el vehículo
  let mensaje = `¡Hola! Me interesa este vehículo: *${marca} ${modelo} ${año}*\n\n`;
  mensaje += `¿Podrían darme más información sobre este auto? ¿Está disponible? \n\n`;
  mensaje += `¡Gracias!`;
  
  // Número de WhatsApp (usar el número real de GP Automóviles)
  const whatsappNumber = '59899493618';
  const encodedMessage = encodeURIComponent(mensaje);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  
  // Abrir WhatsApp
  window.open(whatsappUrl, '_blank');
  
  // Mostrar notificación de éxito
  showNotification('Redirigiendo a WhatsApp...', 'success');
}

// Función para generar mensaje de WhatsApp con datos del formulario
function generateWhatsAppMessage() {
  const form = document.getElementById('vehicleQuoteForm');
  const formData = new FormData(form);
  
  // Validar campos requeridos
  const marca = formData.get('marca')?.trim();
  const modelo = formData.get('modelo')?.trim();
  const anio = formData.get('anio')?.trim();
  const kilometraje = formData.get('kilometraje')?.trim();
  
  if (!marca || !modelo || !anio || !kilometraje) {
    showNotification('Por favor completa todos los campos obligatorios', 'error');
    return;
  }
  
  // Construir mensaje
  let mensaje = ` *COTIZACIÓN DE VEHÍCULO* \n\n`;
  mensaje += ` *Información del Vehículo:*\n`;
  mensaje += `• Marca: ${marca}\n`;
  mensaje += `• Modelo: ${modelo}\n`;
  mensaje += `• Año: ${anio}\n`;
  mensaje += `• Kilometraje: ${Number(kilometraje).toLocaleString()} km\n\n`;
  
  const observaciones = formData.get('observaciones')?.trim();
  if (observaciones) {
    mensaje += `📝 *Observaciones:*\n${observaciones}\n\n`;
  }
  
  mensaje += `¡Hola! Me interesa cotizar mi vehículo. ¿Podrían ayudarme con una evaluación?`;
  
  // Número de WhatsApp (usar el número real de GP Automóviles)
  const whatsappNumber = '59899493618';
  const encodedMessage = encodeURIComponent(mensaje);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  
  // Abrir WhatsApp
  window.open(whatsappUrl, '_blank');
  
  // Mostrar notificación de éxito
  showNotification('Redirigiendo a WhatsApp...', 'success');
  
  // Limpiar formulario después de un breve delay
  setTimeout(() => {
    form.reset();
  }, 2000);
}

// Función para validar el formulario de cotización
function validateQuoteForm() {
  const form = document.getElementById('vehicleQuoteForm');
  const requiredFields = ['marca', 'modelo', 'anio', 'kilometraje'];
  let isValid = true;
  
  requiredFields.forEach(fieldName => {
    const field = form.querySelector(`[name="${fieldName}"]`);
    if (!field.value.trim()) {
      field.style.borderColor = '#ef4444';
      isValid = false;
    } else {
      field.style.borderColor = '#d1d5db';
    }
  });
  
  return isValid;
}

// Agregar validación en tiempo real
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('vehicleQuoteForm');
  if (form) {
    const inputs = form.querySelectorAll('input[required], textarea');
    inputs.forEach(input => {
      // Marcar el campo como "tocado" cuando el usuario interactúe con él
      input.addEventListener('blur', () => {
        input.classList.add('touched');
        if (input.hasAttribute('required') && !input.value.trim()) {
          input.style.borderColor = '#ef4444';
        } else {
          input.style.borderColor = '#d1d5db';
        }
      });
      
      input.addEventListener('input', () => {
        if (input.value.trim()) {
          input.style.borderColor = '#d1d5db';
        } else if (input.classList.contains('touched')) {
          input.style.borderColor = '#ef4444';
        }
      });
    });
  }
});

// Cargar autos cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM cargado, iniciando carga de vehículos...');
  renderVehicles();
});

// Funcionalidad del Modal de Servicios
const serviceData = {
  'financiacion-casa': {
    title: 'Financiación de la Casa',
    content: `
      Entregando el 50% del valor del vehículo +650usd títulos (se pueden agregar a el crédito), prenda y vale el otro 50% hasta en 36 cuotas. NO IMPORTA CLEARING. También como forma de pago aceptamos vehículos que cubran el 50% o más.
      <p>Para acceder a esta financiación hay que:</p>
      <p>- Asegurar auto contra todo, con sección de derechos.</p>
      <p>- Garantes de uno a dos (depende)</p>
      <p>- Recibos de sueldos</p>
    `
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
    `
  },
  'cambio': {
    title: 'Gestión de seguros',
    content: `
      <p>Gestionamos tu seguro de forma rapido y sencilla, con confianza y seguridad.</p>
      <p>Te asesoramos en la mejor opción de seguro para tu vehículo.</p>
    `
  },
  'tramites-de-gestion': {
    title: 'Tramites de gestoría',
    content: `
      <p>Titulos de propiedad automotor.</p>
      <p>Certificados de actos personales y automotor.</p>
      <p>Transferencia y/o reempadronamiento.</p>
    `
  }
};

// Función para abrir el modal de servicios
function openServiceModal(serviceId) {
  const modal = document.getElementById('serviceModal');
  const service = serviceData[serviceId];
  
  if (!service) {
    console.error('Servicio no encontrado:', serviceId);
    return;
  }
  
  // Actualizar contenido del modal
  document.getElementById('serviceModalTitle').textContent = service.title;
  document.getElementById('serviceModalContent').innerHTML = service.content;
  
  // Mostrar modal
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  
  // Agregar event listener para cerrar con ESC
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      closeServiceModal();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
}

// Función para cerrar el modal de servicios
function closeServiceModal() {
  const modal = document.getElementById('serviceModal');
  modal.classList.remove('show');
  document.body.style.overflow = 'auto';
}

// Cerrar modal al hacer clic fuera del contenido
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('serviceModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeServiceModal();
      }
    });
  }
});