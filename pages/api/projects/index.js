import { getProjects, createProject } from '../../../lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  try {
    // GET method: Return all projects
    if (req.method === 'GET') {
      const projects = getProjects();
      return res.status(200).json(projects);
    }
    
    // POST method: Create a new project (requires authentication)
    if (req.method === 'POST') {
      // Check if user is authenticated
      const session = await getServerSession(req, res, authOptions);
      
      if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      // Get project data from request body
      const projectData = req.body;
      
      // Validate required fields
      if (!projectData.title || !projectData.techStack) {
        return res.status(400).json({ error: 'Title and tech stack are required' });
      }
      
      // Create the new project
      const newProject = createProject(projectData);
      
      return res.status(201).json(newProject);
    }
    
    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error handling projects request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
