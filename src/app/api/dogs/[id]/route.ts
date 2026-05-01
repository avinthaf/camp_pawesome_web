import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function getOwnedDog(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, id: string) {
  const { data } = await supabase
    .from('dogs')
    .select('*')
    .eq('id', id)
    .eq('owner_id', userId)
    .single()
  return data
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dog = await getOwnedDog(supabase, user.id, params.id)
  if (!dog) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(dog)
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dog = await getOwnedDog(supabase, user.id, params.id)
  if (!dog) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const patch = await request.json()
  const allowed = ['name', 'breed', 'age_years', 'notes', 'photo_url']
  const update = Object.fromEntries(Object.entries(patch).filter(([k]) => allowed.includes(k)))

  const { data, error } = await supabase
    .from('dogs')
    .update({ ...update, updated_at: new Date().toISOString() })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dog = await getOwnedDog(supabase, user.id, params.id)
  if (!dog) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { error } = await supabase.from('dogs').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
