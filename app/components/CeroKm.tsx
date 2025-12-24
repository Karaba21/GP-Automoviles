'use client'

import Image from 'next/image'

const brands = [
  'fiatlogo.png',
  'vwlogo.png',
  'renaultlogo.png',
  'hyundailogo.png',
  'suzuki.png',
  'nissanlogo.png',
  'toyotalogo.png',
  'chevlogo.png',
  'subarulogo.png',
  'jmclogo.png',
  'geelylogo.png',
  'jaclogo.png',
]

export default function CeroKm() {
  // Duplicar las marcas 3 veces para el carrusel infinito
  const allBrands = [...brands, ...brands, ...brands]

  return (
    <section id="cerokm" className="cerokm">
      <div className="container">
        <div className="section-header">
          <h2>0km</h2>
          <p>Tu próximo 0km te está esperando</p>
        </div>
        
        <div className="brands-carousel">
          <div className="carousel-container">
            <div className="carousel-track" id="brandsCarousel">
              {allBrands.map((brand, index) => (
                <div key={index} className="carousel-slide">
                  <Image 
                    src={`/assets/marcas/${brand}`} 
                    alt={brand.replace('logo.png', '').replace('logo.jpeg', '').toUpperCase()} 
                    className="brand-logo"
                    width={150}
                    height={80}
                    style={{ maxWidth: '100%', maxHeight: '80px', width: 'auto', height: 'auto', objectFit: 'contain' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

