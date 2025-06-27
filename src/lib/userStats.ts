/**
 * Helper function to increment user usage statistics
 * Call this when a user completes a resume analysis or interview session
 */
export async function incrementUserUsage(type: 'resume' | 'interview') {
  try {
    const response = await fetch('/api/user/stats', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type }),
    });

    if (!response.ok) {
      console.error('Failed to update user stats:', response.statusText);
      return false;
    }

    const result = await response.json();
    console.log('User stats updated:', result);
    return true;
  } catch (error) {
    console.error('Error updating user stats:', error);
    return false;
  }
}

/**
 * Helper function to fetch current user statistics
 */
export async function getUserStats() {
  try {
    const response = await fetch('/api/user/stats');
    
    if (!response.ok) {
      console.error('Failed to fetch user stats:', response.statusText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }
}
