import { getProjectById, updateProject, deleteProject } from '../../../lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  try {
    // Get project ID from request query
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'Project ID is required' });
    }
    
    // GET method: Return a specific project
    if (req.method === 'GET') {
      const project = getProjectById(id);
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      return res.status(200).json(project);
    }
    
    // Authentication check for PUT and DELETE methods
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // PUT method: Update a project
    if (req.method === 'PUT') {
      const projectData = req.body;
      
      // Validate required fields
      if (!projectData.title || !projectData.techStack) {
        return res.status(400).json({ error: 'Title and tech stack are required' });
      }
      
      // Check if project exists
      const existingProject = getProjectById(id);
      
      if (!existingProject) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      // Update the project
      const updatedProject = updateProject(id, projectData);
      
      return res.status(200).json(updatedProject);
    }
    
    // DELETE method: Delete a project
    if (req.method === 'DELETE') {
      // Check if project exists
      const existingProject = getProjectById(id);
      
      if (!existingProject) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      // Delete the project
      deleteProject(id);
      
      return res.status(200).json({ message: 'Project deleted successfully' });
    }
    
    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error handling project request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
