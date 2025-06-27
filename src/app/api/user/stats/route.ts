import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import supabase from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user data from Supabase
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('*')
      .eq('clerkId', userId)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    console.log('User data fetched:', userData);

    // Return actual user stats from database
    const stats = {
      resumeUsed: userData.resumeUsed || 0,
      interviewUsed: userData.interviewUsed || 0,
      plan_type: userData.plan ,
      subscription_status: userData.subscription_status || 'active',
      createdAt: userData.createdAt,
      totalSessions: (userData.resumeUsed || 0) + (userData.interviewUsed || 0),
      // Calculate estimated time based on usage (15min per resume, 30min per interview)
      totalTime: (userData.resumeUsed || 0) * 15 + (userData.interviewUsed || 0) * 30,
      lastActivity: userData.createdAt, // You can update this when user performs actions
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update user usage stats
export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type } = body; // 'resume' or 'interview'

    if (!type || !['resume', 'interview'].includes(type)) {
      return NextResponse.json({ error: 'Invalid usage type' }, { status: 400 });
    }

    // Increment the appropriate counter
    const updateField = type === 'resume' ? 'resumeUsed' : 'interviewUsed';
    
    // First get current value
    const { data: currentData, error: fetchError } = await supabase
      .from('User')
      .select(updateField)
      .eq('clerkId', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching current stats:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch current stats' }, { status: 500 });
    }

    // Increment the value
    const newValue = ((currentData as any)[updateField] || 0) + 1;
    
    const { data, error } = await supabase
      .from('User')
      .update({ [updateField]: newValue })
      .eq('clerkId', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user stats:', error);
      return NextResponse.json({ error: 'Failed to update stats' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Usage updated successfully', 
      [updateField]: data[updateField] 
    });
  } catch (error) {
    console.error('Error updating user stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
