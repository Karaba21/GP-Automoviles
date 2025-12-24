'use client'

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export function showNotification(message: string, type: 'info' | 'success' | 'error' = 'info') {
  const notification = document.createElement('div')
  notification.className = `notification notification-${type}`
  notification.textContent = message

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
  `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.transform = 'translateX(0)'
  }, 100)

  setTimeout(() => {
    notification.style.transform = 'translateX(100%)'
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

export function changeModalImage(vehicleId: string, direction: number) {
  const images = (window as any)[`modalImages_${vehicleId}`]
  if (!images || images.length <= 1) return

  const modal = document.querySelector('.vehicle-modal')
  if (!modal) return

  const mainImg = modal.querySelector('#modal-main-img') as HTMLImageElement
  const currentSpan = modal.querySelector('#modal-current')
  const thumbnails = modal.querySelectorAll('.modal-thumbnail')

  if (!mainImg || !currentSpan) return

  const currentIndex = parseInt(currentSpan.textContent || '1') - 1
  let newIndex = currentIndex + direction

  if (newIndex >= images.length) {
    newIndex = 0
  } else if (newIndex < 0) {
    newIndex = images.length - 1
  }

  mainImg.src = images[newIndex]
  currentSpan.textContent = String(newIndex + 1)

  thumbnails.forEach((thumb, index) => {
    if (index === newIndex) {
      thumb.classList.add('active')
      ;(thumb as HTMLElement).style.border = '2px solid #3b82f6'
    } else {
      thumb.classList.remove('active')
      ;(thumb as HTMLElement).style.border = '2px solid transparent'
    }
  })
}

export function setModalImage(vehicleId: string, index: number) {
  const images = (window as any)[`modalImages_${vehicleId}`]
  if (!images || index < 0 || index >= images.length) return

  const modal = document.querySelector('.vehicle-modal')
  if (!modal) return

  const mainImg = modal.querySelector('#modal-main-img') as HTMLImageElement
  const currentSpan = modal.querySelector('#modal-current')
  const thumbnails = modal.querySelectorAll('.modal-thumbnail')

  if (!mainImg || !currentSpan) return

  mainImg.src = images[index]
  currentSpan.textContent = String(index + 1)

  thumbnails.forEach((thumb, i) => {
    if (i === index) {
      thumb.classList.add('active')
      ;(thumb as HTMLElement).style.border = '2px solid #3b82f6'
    } else {
      thumb.classList.remove('active')
      ;(thumb as HTMLElement).style.border = '2px solid transparent'
    }
  })
}

export async function showVehicleDetails(vehicleId: string) {
  try {
    const { data: vehicle, error } = await supabaseClient
      .from('Autos')
      .select('*')
      .eq('id', vehicleId)
      .single()

    if (error) {
      console.error('Error al cargar detalles del vehículo:', error)
      showNotification('Error al cargar los detalles del vehículo', 'error')
      return
    }

    if (!vehicle) {
      showNotification('Vehículo no encontrado', 'error')
      return
    }

    // Crear modal con detalles del vehículo
    const modal = document.createElement('div')
    modal.className = 'vehicle-modal'
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
    `

    const organizeThumbnails = (images: string[]) => {
      const thumbnailsPerRow = 8
      const rows = []
      for (let i = 0; i < images.length; i += thumbnailsPerRow) {
        rows.push(images.slice(i, i + thumbnailsPerRow))
      }
      return rows
    }

    const thumbnailRows = vehicle.imagenes && vehicle.imagenes.length > 1 ? organizeThumbnails(vehicle.imagenes) : []
    const isMobile = window.innerWidth <= 768

    if (isMobile) {
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
                    ${vehicle.vendido ? `
                      <div class="vendido-overlay">
                        <div class="vendido-text">VENDIDO</div>
                      </div>
                    ` : ''}
                    ${vehicle.reservado ? `
                      <div class="reservado-badge" style="position: absolute; top: 15px; right: 15px; z-index: 10;">RESERVADO</div>
                    ` : ''}
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
          
          <div class="modal-info-section" style="
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background: white;
          ">
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
                  white-space: pre-line;
                ">${vehicle.descripcion}</p>
              </div>
            ` : ''}
            
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
              ">
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
              ">
                <i class="fab fa-whatsapp" style="font-size: 1.1rem;"></i>
                WhatsApp
              </a>
            </div>
          </div>
          
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
                ${vehicle.imagenes.map((img: string, index: number) => `
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
      `
    } else {
      // Desktop layout - similar estructura pero adaptada
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
              <div class="modal-images-section" style="display: flex; flex-direction: column; height: 100%;">
                ${vehicle.imagenes && vehicle.imagenes.length > 0 
                  ? `
                    <div class="modal-image-gallery" style="position: relative; flex: 1; display: flex; flex-direction: column;">
                      <div class="modal-main-image" style="width: 100%; height: 450px; position: relative; border-radius: 8px; overflow: hidden; flex-shrink: 0;">
                        <img id="modal-main-img" src="${vehicle.imagenes[0]}" alt="${vehicle.marca} ${vehicle.modelo}" 
                             style="width: 100%; height: 100%; object-fit: contain;">
                        ${vehicle.vendido ? `
                          <div class="vendido-overlay">
                            <div class="vendido-text">VENDIDO</div>
                          </div>
                        ` : ''}
                        ${vehicle.reservado ? `
                          <div class="reservado-badge" style="position: absolute; top: 10px; right: 10px; z-index: 10;">RESERVADO</div>
                        ` : ''}
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
                          ${thumbnailRows.map((row: string[], rowIndex: number) => `
                            <div class="modal-thumbnails-row" style="display: flex; gap: 8px; margin-bottom: 8px; justify-content: flex-start;">
                              ${row.map((img: string, index: number) => {
                                const globalIndex = rowIndex * 8 + index
                                return `
                                  <img src="${img}" alt="Thumbnail ${globalIndex + 1}" 
                                       class="modal-thumbnail ${globalIndex === 0 ? 'active' : ''}"
                                       data-vehicle-id="${vehicle.id}" data-image-index="${globalIndex}"
                                       style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; 
                                              cursor: pointer; border: 2px solid ${globalIndex === 0 ? '#3b82f6' : 'transparent'}; 
                                              flex-shrink: 0;">
                                `
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
                      <p style="line-height: 1.5; color: #4b5563; margin: 0; font-size: 0.9rem; white-space: pre-line;">${vehicle.descripcion}</p>
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
                  ">
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
                  ">
                    <i class="fab fa-whatsapp"></i>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    }

    document.body.appendChild(modal)

    // Guardar las imágenes del vehículo
    ;(window as any)[`modalImages_${vehicle.id}`] = vehicle.imagenes

    // Event listeners
    const prevBtn = modal.querySelector('.modal-prev-btn')
    const nextBtn = modal.querySelector('.modal-next-btn')
    const thumbnails = modal.querySelectorAll('.modal-thumbnail')

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        changeModalImage(vehicle.id, -1)
      })
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        changeModalImage(vehicle.id, 1)
      })
    }

    thumbnails.forEach((thumb) => {
      thumb.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        const vehicleId = thumb.getAttribute('data-vehicle-id')
        const imageIndex = parseInt(thumb.getAttribute('data-image-index') || '0')
        if (vehicleId) setModalImage(vehicleId, imageIndex)
      })
    })

    const closeModal = () => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal)
      }
    }

    modal.querySelector('.close-modal')?.addEventListener('click', closeModal)
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal()
    })

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
        document.removeEventListener('keydown', handleEsc)
      }
    }
    document.addEventListener('keydown', handleEsc)
  } catch (error) {
    console.error('Error al mostrar detalles:', error)
    showNotification('Error al cargar los detalles del vehículo', 'error')
  }
}

export function generateVehicleWhatsAppMessage(marca: string, modelo: string, año: string) {
  let mensaje = `¡Hola! Me interesa este vehículo: *${marca} ${modelo} ${año}*\n\n`
  mensaje += `¿Podrían darme más información sobre este auto? ¿Está disponible? \n\n`
  mensaje += `¡Gracias!`

  const whatsappNumber = '59899493618'
  const encodedMessage = encodeURIComponent(mensaje)
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

  window.open(whatsappUrl, '_blank')
  showNotification('Redirigiendo a WhatsApp...', 'success')
}

