import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || ''

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export async function GET() {
  try {
    const { data, error } = await supabaseClient
      .from('Autos')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      console.error('Error al cargar autos:', error)
      return NextResponse.json(
        { error: 'Error al cargar vehículos' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: data || [] })
  } catch (error) {
    console.error('Error de conexión:', error)
    return NextResponse.json(
      { error: 'Error de conexión' },
      { status: 500 }
    )
  }
}

