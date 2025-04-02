import { getUserProfile, updateUserData } from '../../../lib/auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  try {
    // GET method: Return user profile
    if (req.method === 'GET') {
      const profile = getUserProfile();
      
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      
      return res.status(200).json(profile);
    }
    
    // PUT method: Update user profile (requires authentication)
    if (req.method === 'PUT') {
      // Check if user is authenticated
      const session = await getServerSession(req, res, authOptions);
      
      if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      // Get profile data from request body
      const profileData = req.body;
      
      // Validate required fields
      if (!profileData.name || !profileData.title || !profileData.bio) {
        return res.status(400).json({ error: 'Name, title, and bio are required' });
      }
      
      // Update the profile
      const updatedProfile = updateUserData(profileData);
      
      return res.status(200).json(updatedProfile);
    }
    
    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error handling profile request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
