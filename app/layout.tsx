import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import LeadCouponModal from './components/LeadCouponModal'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GP Automóviles - Tu Concesionario de Confianza',
  description: '¡Hola! Somos GP Automóviles, tu mejor aliado a la hora de elegir tu usado o 0 km. Nos encargamos de buscar la mejor opción según tus necesidades, con planes de financiación que se adaptan a vos.',
  openGraph: {
    type: 'website',
    url: 'https://gpautomovilesuy.com/',
    title: 'GP Automóviles - Tu Concesionario de Confianza',
    description: '¡Hola! Somos GP Automóviles, tu mejor aliado a la hora de elegir tu usado o 0 km. Nos encargamos de buscar la mejor opción según tus necesidades, con planes de financiación que se adaptan a vos.',
    images: ['https://gpautomovilesuy.com/assets/ogimage.jpeg'],
    siteName: 'GP Automóviles',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GP Automóviles - Tu Concesionario de Confianza',
    description: '¡Hola! Somos GP Automóviles, tu mejor aliado a la hora de elegir tu usado o 0 km. Nos encargamos de buscar la mejor opción según tus necesidades, con planes de financiación que se adaptan a vos.',
    images: ['https://gpautomovilesuy.com/assets/ogimage.jpeg'],
  },
  alternates: {
    canonical: 'https://gpautomovilesuy.com/',
  },
  icons: {
    icon: '/assets/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <style>{`
          .modal-thumbnail:hover {
            opacity: 0.8;
            transform: scale(1.05);
          }
          
          .modal-thumbnail {
            transition: all 0.3s ease;
          }
        `}</style>
      </head>
      <body className={inter.className}>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-K5HFNX5R');`}
        </Script>
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-K5HFNX5R"
            height="0" 
            width="0" 
            style={{display:'none',visibility:'hidden'}}
          />
        </noscript>
        {children}
        <LeadCouponModal />
      </body>
    </html>
  )
}

