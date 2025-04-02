// Client-side API utility functions

// Function to fetch user profile
export const fetchUserProfile = async () => {
  try {
    const response = await fetch('/api/profile');
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// Function to update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Function to upload a file
export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    console.log(`Uploading file: ${file.name}, size: ${file.size}, type: ${file.type}`);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `Upload failed with status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Upload successful:', result);
    return result;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Function to fetch all projects
export const fetchProjects = async () => {
  try {
    const response = await fetch('/api/projects');
    
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// Function to fetch a single project
export const fetchProject = async (id) => {
  try {
    const response = await fetch(`/api/projects/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch project');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

// Function to create a new project
export const createProject = async (projectData) => {
  try {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create project');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// Function to update a project
export const updateProject = async (id, projectData) => {
  try {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update project');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

// Function to delete a project
export const deleteProject = async (id) => {
  try {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete project');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};
