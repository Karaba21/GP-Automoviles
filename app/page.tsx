'use client'

import { useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Vehicles from './components/Vehicles'
import CeroKm from './components/CeroKm'
import Benefits from './components/Benefits'
import Quote from './components/Quote'
import Reviews from './components/Reviews'
import Location from './components/Location'
import Footer from './components/Footer'
import ServiceModal from './components/ServiceModal'
import { useVehicleModal } from './hooks/useVehicleModal'

export default function Home() {
  useVehicleModal()

  useEffect(() => {
    // Animaciones al hacer scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, observerOptions)

    const elementsToAnimate = document.querySelectorAll('.vehicle-card, .testimonial, .service-card, .stat')
    elementsToAnimate.forEach((el) => {
      el.classList.add('fade-in')
      observer.observe(el)
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <Header />
      <Hero />
      <Vehicles />
      <CeroKm />
      <Benefits />
      <Quote />
      <Reviews />
      <Location />
      <Footer />
      <ServiceModal />
    </>
  )
}

