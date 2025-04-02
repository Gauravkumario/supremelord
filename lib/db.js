// Database utilities for the application
import fs from 'fs';
import path from 'path';

// Paths to data files
const PROJECTS_DATA_PATH = path.join(process.cwd(), 'data/projects.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');

// Ensure upload directory exists
const ensureUploadDirExists = () => {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
};

// Function to get all projects
export const getProjects = () => {
  try {
    const projectsData = fs.readFileSync(PROJECTS_DATA_PATH, 'utf8');
    return JSON.parse(projectsData);
  } catch (error) {
    console.error('Error reading projects data:', error);
    return [];
  }
};

// Function to get a single project by ID
export const getProjectById = (id) => {
  try {
    const projects = getProjects();
    return projects.find(project => project.id === id) || null;
  } catch (error) {
    console.error('Error getting project by ID:', error);
    return null;
  }
};

// Function to create a new project
export const createProject = (projectData) => {
  try {
    const projects = getProjects();
    
    // Generate a new ID (simple implementation)
    const newId = Date.now().toString();
    
    // Create the new project object
    const newProject = {
      id: newId,
      ...projectData
    };
    
    // Add to projects array
    projects.push(newProject);
    
    // Write updated projects to file
    fs.writeFileSync(PROJECTS_DATA_PATH, JSON.stringify(projects, null, 2));
    
    return newProject;
  } catch (error) {
    console.error('Error creating project:', error);
    throw new Error('Failed to create project');
  }
};

// Function to update a project
export const updateProject = (id, projectData) => {
  try {
    const projects = getProjects();
    
    // Find project index
    const projectIndex = projects.findIndex(project => project.id === id);
    
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }
    
    // Update project
    projects[projectIndex] = {
      ...projects[projectIndex],
      ...projectData,
      id // Ensure ID remains the same
    };
    
    // Write updated projects to file
    fs.writeFileSync(PROJECTS_DATA_PATH, JSON.stringify(projects, null, 2));
    
    return projects[projectIndex];
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error('Failed to update project');
  }
};

// Function to delete a project
export const deleteProject = (id) => {
  try {
    const projects = getProjects();
    
    // Filter out the project to delete
    const updatedProjects = projects.filter(project => project.id !== id);
    
    // Write updated projects to file
    fs.writeFileSync(PROJECTS_DATA_PATH, JSON.stringify(updatedProjects, null, 2));
    
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new Error('Failed to delete project');
  }
};

// Function to handle file uploads
export const saveUploadedFile = (file) => {
  ensureUploadDirExists();
  
  return new Promise((resolve, reject) => {
    try {
      // Generate a unique filename
      const timestamp = Date.now();
      const originalName = file.originalFilename || 'unnamed-file';
      const filename = `${timestamp}-${originalName.replace(/[^a-zA-Z0-9._-]/g, '')}`;
      const filepath = path.join(UPLOAD_DIR, filename);
      
      // Read the file from temporary location
      const data = fs.readFileSync(file.filepath);
      
      // Write the file to the uploads directory
      fs.writeFileSync(filepath, data);
      
      console.log(`File saved to: ${filepath}`);
      
      // Return the public URL to the file
      resolve(`/uploads/${filename}`);
    } catch (error) {
      console.error('Error saving file:', error);
      reject(new Error('Failed to save file'));
    }
  });
};

export default {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  saveUploadedFile
};
