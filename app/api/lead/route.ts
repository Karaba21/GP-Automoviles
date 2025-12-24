import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabaseAdmin'
import { upsertBrevoContact } from '@/app/lib/brevo'

// Función para generar un código de cupón único
function generateCouponCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const randomPart = Array.from({ length: 6 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('')

  return `GP-${randomPart}`
}

async function sendCouponEmail(email: string, name: string, couponCode: string) {
  const apiKey = process.env.BREVO_API_KEY
  const senderEmail = process.env.BREVO_FROM_EMAIL
  const senderName = process.env.BREVO_FROM_NAME

  if (!apiKey || !senderEmail || !senderName) {
    console.error('Faltan variables de entorno de Brevo')
    return
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: senderName },
        to: [{ email, name }],
        subject: 'Tu cupón de tanque de nafta 🎁',
        htmlContent: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>¡Felicitaciones ${name}!</h1>
            <p>Aquí tienes tu cupón para participar por el tanque de nafta:</p>
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <span style="font-size: 24px; font-weight: bold; color: #DC2626; letter-spacing: 2px;">${couponCode}</span>
            </div>
            <p>Presenta este código en nuestra sucursal.</p>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              Si no solicitaste este cupón, puedes ignorar este correo.
            </p>
          </div>
        `
      })
    })

    if (!res.ok) {
      const errorData = await res.json()
      console.error('Error enviando email con Brevo:', errorData)
    } else {
      console.log(`Email enviado a ${email}`)
    }
  } catch (error) {
    console.error('Error de red/fetch enviando email:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { full_name, email, phone, consent, source } = body

    // Validación básica
    if (!full_name || !email || !phone) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Validar teléfono (mínimo 8 caracteres)
    if (phone.length < 8) {
      return NextResponse.json(
        { error: 'El teléfono debe tener al menos 8 caracteres' },
        { status: 400 }
      )
    }

    // Normalizar email a lowercase
    const normalizedEmail = email.toLowerCase().trim()

    // Buscar si ya existe un lead con este email (case-insensitive)
    const { data: existingLead, error: searchError } = await supabaseAdmin
      .from('leads')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (searchError && searchError.code !== 'PGRST116') {
      console.error('Error al buscar lead:', searchError)
      return NextResponse.json(
        { error: 'Error al buscar lead existente', details: searchError },
        { status: 500 }
      )
    }

    let leadId: string
    let alreadyHadCoupon = false
    let couponCode: string | null = null

    if (existingLead) {
      // Lead ya existe, usar su ID
      leadId = existingLead.id

      // Buscar si ya tiene un cupón
      const { data: existingCoupon, error: couponError } = await supabaseAdmin
        .from('coupons_issued')
        .select('coupon_code')
        .eq('lead_id', leadId)
        .maybeSingle()

      if (couponError && couponError.code !== 'PGRST116') {
        console.error('Error al buscar cupón:', couponError)
        return NextResponse.json(
          { error: 'Error al buscar cupón existente', details: couponError },
          { status: 500 }
        )
      }

      if (existingCoupon) {
        // Ya tiene cupón, devolverlo
        couponCode = existingCoupon.coupon_code
        alreadyHadCoupon = true
      } else {
        // No tiene cupón, generar uno nuevo
        couponCode = generateCouponCode()

        // Verificar que el código sea único
        let isUnique = false
        let attempts = 0
        while (!isUnique && attempts < 10) {
          const { data: duplicate } = await supabaseAdmin
            .from('coupons_issued')
            .select('id')
            .eq('coupon_code', couponCode)
            .maybeSingle()

          if (!duplicate) {
            isUnique = true
          } else {
            couponCode = generateCouponCode()
            attempts++
          }
        }

        if (!isUnique) {
          return NextResponse.json(
            { error: 'Error al generar cupón único' },
            { status: 500 }
          )
        }

        // Guardar el nuevo cupón
        const { error: insertCouponError } = await supabaseAdmin
          .from('coupons_issued')
          .insert({
            lead_id: leadId,
            coupon_code: couponCode,
            // status: 'active', // Dejar que la DB asigne el default o null si es permitido
            issued_at: new Date().toISOString()
          })

        if (insertCouponError) {
          console.error('Error al guardar cupón:', insertCouponError)
          return NextResponse.json(
            { error: 'Error al guardar cupón', details: insertCouponError },
            { status: 500 }
          )
        }
      }

      // Actualizar el lead con los nuevos datos
      const { error: updateError } = await supabaseAdmin
        .from('leads')
        .update({
          full_name,
          phone,
          consent: consent || false,
          source: source || 'homepage_modal'
        })
        .eq('id', leadId)

      if (updateError) {
        console.error('Error al actualizar lead:', updateError)
        // No fallar si solo falla la actualización, el cupón ya se guardó
      }
    } else {
      // Lead nuevo, crear
      const { data: newLead, error: insertError } = await supabaseAdmin
        .from('leads')
        .insert({
          full_name,
          email: normalizedEmail,
          phone,
          consent: consent || false,
          source: source || 'homepage_modal'
        })
        .select('id')
        .single()

      if (insertError) {
        console.error('Error al crear lead:', insertError)
        return NextResponse.json(
          { error: 'Error al crear lead', details: insertError },
          { status: 500 }
        )
      }

      leadId = newLead.id

      // Generar cupón único
      couponCode = generateCouponCode()
      let isUnique = false
      let attempts = 0
      while (!isUnique && attempts < 10) {
        const { data: duplicate } = await supabaseAdmin
          .from('coupons_issued')
          .select('id')
          .eq('coupon_code', couponCode)
          .maybeSingle()

        if (!duplicate) {
          isUnique = true
        } else {
          couponCode = generateCouponCode()
          attempts++
        }
      }

      if (!isUnique) {
        return NextResponse.json(
          { error: 'Error al generar cupón único' },
          { status: 500 }
        )
      }

      // Guardar el cupón
      const { error: insertCouponError } = await supabaseAdmin
        .from('coupons_issued')
        .insert({
          lead_id: leadId,
          coupon_code: couponCode,
          // status: 'active',
          issued_at: new Date().toISOString()
        })

      if (insertCouponError) {
        console.error('Error al guardar cupón:', insertCouponError)
        return NextResponse.json(
          { error: 'Error al guardar cupón', details: insertCouponError },
          { status: 500 }
        )
      }
    }



    // 4. Enviar email si hay consentimiento (independientemente de si ya tenía cupón)
    if (consent) {
      // Intentar crear/actualizar contacto en Brevo CRM (fire and forget / no-blocking real fail)
      // Lo hacemos await para logging ordenado pero atrapado internamente en la fn si se desea, 
      // pero aquí la fn upsertBrevoContact ya tiene try/catch.
      await upsertBrevoContact(normalizedEmail, full_name, phone)

      if (couponCode) {
        // Enviar email transaccional
        await sendCouponEmail(normalizedEmail, full_name, couponCode)
      }
    }

    return NextResponse.json({
      ok: true,
      coupon_code: couponCode,
      alreadyHadCoupon
    })
  } catch (error) {
    console.error('Error en endpoint /api/lead:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : error },
      { status: 500 }
    )
  }
}

