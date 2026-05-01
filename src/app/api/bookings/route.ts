import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('bookings')
    .select('*, dogs(id, name, breed)')
    .eq('owner_id', user.id)
    .order('start_date', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { dog_id, start_date, end_date, notes } = body

  if (!dog_id || !start_date || !end_date) {
    return NextResponse.json({ error: 'dog_id, start_date, and end_date are required' }, { status: 400 })
  }

  // Verify the dog belongs to this user
  const { data: dog } = await supabase
    .from('dogs')
    .select('id')
    .eq('id', dog_id)
    .eq('owner_id', user.id)
    .single()

  if (!dog) return NextResponse.json({ error: 'Dog not found' }, { status: 404 })

  const { data, error } = await supabase
    .from('bookings')
    .insert({ dog_id, owner_id: user.id, start_date, end_date, notes, status: 'pending' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
