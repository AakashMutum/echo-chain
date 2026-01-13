import { createClient } from './server'
import type { Profile, Decision, DecisionVersion, Comment } from '@/lib/types'

// Profile operations
export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profile_details')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }
  return data
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profile_details')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    return null
  }
  return data
}

// Decision operations
export async function getDecisions(limit = 50, offset = 0): Promise<Decision[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('decisions')
    .select(`
      *,
      creator:profile_details(*),
      decision_versions(*)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching decisions:', error)
    return []
  }
  return data || []
}

export async function getDecision(id: string): Promise<Decision | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('decisions')
    .select(`
      *,
      creator:profile_details(*),
      decision_versions(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching decision:', error)
    return null
  }
  return data
}

export async function createDecision(decision: Omit<Decision, 'id' | 'created_at' | 'updated_at' | 'current_version'>): Promise<Decision | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('decisions')
    .insert(decision)
    .select()
    .single()

  if (error) {
    console.error('Error creating decision:', error)
    return null
  }
  return data
}

export async function updateDecision(id: string, updates: Partial<Decision>): Promise<Decision | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('decisions')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating decision:', error)
    return null
  }
  return data
}

// Decision Version operations
export async function getDecisionVersions(decisionId: string): Promise<DecisionVersion[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('decision_versions')
    .select(`
      *,
      editor:profile_details(*)
    `)
    .eq('decision_id', decisionId)
    .order('version_number', { ascending: true })

  if (error) {
    console.error('Error fetching decision versions:', error)
    return []
  }
  return data || []
}

export async function createDecisionVersion(version: Omit<DecisionVersion, 'id' | 'created_at'>): Promise<DecisionVersion | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('decision_versions')
    .insert(version)
    .select()
    .single()

  if (error) {
    console.error('Error creating decision version:', error)
    return null
  }
  return data
}

// Comment operations
export async function getComments(decisionId: string, versionNumber: number): Promise<Comment[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      author:profile_details(*),
      replies:comments(*)
    `)
    .eq('decision_id', decisionId)
    .eq('version_number', versionNumber)
    .is('parent_id', null)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching comments:', error)
    return []
  }
  return data || []
}

export async function createComment(comment: Omit<Comment, 'id' | 'created_at'>): Promise<Comment | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('comments')
    .insert(comment)
    .select()
    .single()

  if (error) {
    console.error('Error creating comment:', error)
    return null
  }
  return data
}