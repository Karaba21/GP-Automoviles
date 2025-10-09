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

// Filtros de vehículos
const filterButtons = document.querySelectorAll('.filter-btn');
const vehicleCards = document.querySelectorAll('.vehicle-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remover clase active de todos los botones
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Agregar clase active al botón clickeado
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        vehicleCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease-in';
            } else {
                card.style.display = 'none';
            }
        });
    });
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

// Simulación de carga de vehículos desde CRM
function loadVehiclesFromCRM() {
    // Esta función simula la carga de datos desde un CRM
    // En un caso real, aquí harías una llamada a tu API
    
    const sampleVehicles = [
        {
            id: 1,
            name: "Toyota Corolla 2023",
            price: "$25,000,000",
            category: "sedan",
            transmission: "Automático",
            engine: "1.8L",
            passengers: "5 pasajeros",
            image: "fas fa-car"
        },
        {
            id: 2,
            name: "Honda CR-V 2023",
            price: "$35,000,000",
            category: "suv",
            transmission: "Automático",
            engine: "2.0L",
            passengers: "7 pasajeros",
            image: "fas fa-car"
        },
        {
            id: 3,
            name: "Volkswagen Golf 2023",
            price: "$28,000,000",
            category: "hatchback",
            transmission: "Manual",
            engine: "1.4L",
            passengers: "5 pasajeros",
            image: "fas fa-car"
        },
        {
            id: 4,
            name: "Ford Ranger 2023",
            price: "$45,000,000",
            category: "pickup",
            transmission: "Automático",
            engine: "2.3L",
            passengers: "5 pasajeros",
            image: "fas fa-car"
        },
        {
            id: 5,
            name: "Nissan Sentra 2023",
            price: "$22,000,000",
            category: "sedan",
            transmission: "Automático",
            engine: "1.6L",
            passengers: "5 pasajeros",
            image: "fas fa-car"
        },
        {
            id: 6,
            name: "Chevrolet Equinox 2023",
            price: "$32,000,000",
            category: "suv",
            transmission: "Automático",
            engine: "1.5L",
            passengers: "5 pasajeros",
            image: "fas fa-car"
        }
    ];
    
    return sampleVehicles;
}

// Función para renderizar vehículos
function renderVehicles(vehicles) {
    const vehiclesGrid = document.getElementById('vehiclesGrid');
    vehiclesGrid.innerHTML = '';
    
    vehicles.forEach(vehicle => {
        const vehicleCard = document.createElement('div');
        vehicleCard.className = 'vehicle-card fade-in';
        vehicleCard.setAttribute('data-category', vehicle.category);
        
        vehicleCard.innerHTML = `
            <div class="vehicle-image">
                <i class="${vehicle.image}"></i>
            </div>
            <div class="vehicle-info">
                <h3>${vehicle.name}</h3>
                <p class="vehicle-price">${vehicle.price}</p>
                <div class="vehicle-details">
                    <span><i class="fas fa-cog"></i> ${vehicle.transmission}</span>
                    <span><i class="fas fa-gas-pump"></i> ${vehicle.engine}</span>
                    <span><i class="fas fa-users"></i> ${vehicle.passengers}</span>
                </div>
                <button class="btn btn-outline" onclick="showVehicleDetails(${vehicle.id})">Ver Detalles</button>
            </div>
        `;
        
        vehiclesGrid.appendChild(vehicleCard);
        observer.observe(vehicleCard);
    });
}

// Función para mostrar detalles del vehículo
function showVehicleDetails(vehicleId) {
    // Aquí podrías abrir un modal o redirigir a una página de detalles
    alert(`Mostrando detalles del vehículo ID: ${vehicleId}\n\nEn una implementación real, esto abriría un modal con información detallada del vehículo.`);
}

// Cargar vehículos al inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    const vehicles = loadVehiclesFromCRM();
    renderVehicles(vehicles);
});

// Formulario de contacto (si se agrega en el futuro)
function handleContactForm(event) {
    event.preventDefault();
    // Aquí manejarías el envío del formulario
    alert('¡Gracias por tu mensaje! Te contactaremos pronto.');
}

// Lazy loading para imágenes (si se agregan imágenes reales)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Inicializar lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

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
    fetchFromCRM,
    loadVehiclesFromCRM,
    renderVehicles
};


// Mostrar autos
const HUBSPOT_TOKEN = "pat-xxxxxxxxxxxxxxxx"; // ⚠️ solo para pruebas locales
const container = document.getElementById("vehicles-container");

async function fetchVehicles() {
  const url =
    "https://api.hubapi.com/crm/v3/objects/products?limit=100&properties=name,price,description,image_url,brand,model,year,kilometers,transmission,color";

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${HUBSPOT_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    container.innerHTML = "<p>Error al cargar los autos.</p>";
    return [];
  }

  const data = await res.json();
  return data.results.map((r) => r.properties);
}

async function renderVehicles() {
  const vehicles = await fetchVehicles();

  if (!vehicles.length) {
    container.innerHTML = "<p>No hay autos publicados actualmente.</p>";
    return;
  }

  container.innerHTML = vehicles
    .map(
      (v) => `
      <div class="card">
        <img src="${v.image_url || 'assets/logo.jpeg'}" alt="${v.name}" />
        <h2>${v.name}</h2>
        <p>${v.brand || ''} ${v.model || ''} ${v.year ? `• ${v.year}` : ''}</p>
        <p>${v.kilometers ? `${v.kilometers} km` : ''}</p>
        <p>${v.transmission || ''}</p>
        <p class="price">$${Number(v.price || 0).toLocaleString()}</p>
        <p>${v.description || ''}</p>
      </div>
    `
    )
    .join("");
}

renderVehicles();