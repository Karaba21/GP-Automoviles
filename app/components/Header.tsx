'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    // Navegación suave
    const handleSmoothScroll = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault()
        const href = target.getAttribute('href')
        if (href) {
          const targetElement = document.querySelector(href)
          if (targetElement) {
            const headerHeight = document.querySelector('.header')?.clientHeight || 0
            const targetPosition = (targetElement as HTMLElement).offsetTop - headerHeight
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            })
          }
        }
        setIsMenuOpen(false)
      }
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleSmoothScroll as EventListener)
    })

    // Cambio de header al hacer scroll
    const handleScroll = () => {
      const header = document.querySelector('.header') as HTMLElement
      if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)'
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)'
      } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)'
        header.style.boxShadow = 'none'
      }
    }

    window.addEventListener('scroll', handleScroll)

    // Header dinámico con scroll
    let lastScrollTop = 0
    const header = document.querySelector('.header') as HTMLElement
    if (header) {
      header.style.transition = 'transform 0.3s ease-in-out'
    }

    const handleScrollDirection = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        if (header) header.style.transform = 'translateY(-100%)'
      } else {
        // Scrolling up
        if (header) header.style.transform = 'translateY(0)'
      }
      
      lastScrollTop = scrollTop
    }

    window.addEventListener('scroll', handleScrollDirection)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', handleScrollDirection)
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleSmoothScroll as EventListener)
      })
    }
  }, [])

  return (
    <header className="header">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <Image src="/assets/logo.jpeg" alt="GP Automóviles" width={150} height={50} style={{ height: '50px', width: 'auto', objectFit: 'contain' }} />
          </div>
          <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <li className="nav-item">
              <a href="#inicio" className="nav-link">Inicio</a>
            </li>
            <li className="nav-item">
              <a href="#vehiculos" className="nav-link">Vehículos</a>
            </li>
            <li className="nav-item">
              <a href="#cerokm" className="nav-link">0km</a>
            </li>
            <li className="nav-item">
              <a href="#beneficios" className="nav-link">Facilidades</a>
            </li>
            <li className="nav-item">
              <a href="#cotizacion" className="nav-link">Cotización</a>
            </li>
            <li className="nav-item">
              <a href="#reseñas" className="nav-link">Reseñas</a>
            </li>
            <li className="nav-item">
              <a href="#ubicacion" className="nav-link">Ubicación</a>
            </li>
          </ul>
          <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>
    </header>
  )
}

