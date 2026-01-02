import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || ''

export const dynamic = 'force-dynamic'
export const revalidate = 0

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { data: vehicle, error } = await supabaseClient
      .from('Autos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error al cargar detalles del vehículo:', error)
      return NextResponse.json(
        { error: 'Error al cargar los detalles del vehículo' },
        { status: 500 }
      )
    }

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehículo no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { data: vehicle },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  } catch (error) {
    console.error('Error de conexión:', error)
    return NextResponse.json(
      { error: 'Error de conexión' },
      { status: 500 }
    )
  }
}

