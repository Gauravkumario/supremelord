import React, { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import styles from '../styles/ProjectForm.module.css';

const ProjectForm = ({ project = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    techStack: '',
    status: 'In Progress',
    liveUrl: '',
    githubUrl: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load project data if editing
  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        techStack: Array.isArray(project.techStack) 
          ? project.techStack.join(', ') 
          : project.techStack
      });
    }
  }, [project]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleImageUpload = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }));
    
    // Clear image error if it exists
    if (errors.image) {
      setErrors(prev => ({
        ...prev,
        image: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.techStack.trim()) {
      newErrors.techStack = 'At least one technology is required';
    }
    
    // URL validation for liveUrl and githubUrl
    if (formData.liveUrl && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.liveUrl)) {
      newErrors.liveUrl = 'Please enter a valid URL';
    }
    
    if (formData.githubUrl && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.githubUrl)) {
      newErrors.githubUrl = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert comma-separated tech stack to array
      const formattedData = {
        ...formData,
        techStack: formData.techStack.split(',').map(tech => tech.trim()).filter(Boolean)
      };
      
      await onSubmit(formattedData);
    } catch (error) {
      console.error('Error submitting project:', error);
      setErrors(prev => ({
        ...prev,
        form: 'Failed to save project. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>
        {project ? 'Edit Project' : 'Add New Project'}
      </h2>
      
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>Project Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
          placeholder="Enter project title"
          disabled={isSubmitting}
        />
        {errors.title && <span className={styles.errorText}>{errors.title}</span>}
      </div>
      
      <div className={styles.formGroup}>
        <ImageUpload
          currentImage={formData.image}
          onImageUpload={handleImageUpload}
          label="Project Image"
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="techStack" className={styles.label}>Tech Stack *</label>
        <input
          type="text"
          id="techStack"
          name="techStack"
          value={formData.techStack}
          onChange={handleChange}
          className={`${styles.input} ${errors.techStack ? styles.inputError : ''}`}
          placeholder="React, Node.js, MongoDB, etc. (comma-separated)"
          disabled={isSubmitting}
        />
        {errors.techStack && <span className={styles.errorText}>{errors.techStack}</span>}
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="status" className={styles.label}>Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className={styles.select}
          disabled={isSubmitting}
        >
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Planned">Planned</option>
        </select>
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="liveUrl" className={styles.label}>Live Demo URL</label>
        <input
          type="text"
          id="liveUrl"
          name="liveUrl"
          value={formData.liveUrl}
          onChange={handleChange}
          className={`${styles.input} ${errors.liveUrl ? styles.inputError : ''}`}
          placeholder="https://example.com"
          disabled={isSubmitting}
        />
        {errors.liveUrl && <span className={styles.errorText}>{errors.liveUrl}</span>}
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="githubUrl" className={styles.label}>GitHub Repository URL</label>
        <input
          type="text"
          id="githubUrl"
          name="githubUrl"
          value={formData.githubUrl}
          onChange={handleChange}
          className={`${styles.input} ${errors.githubUrl ? styles.inputError : ''}`}
          placeholder="https://github.com/username/repo"
          disabled={isSubmitting}
        />
        {errors.githubUrl && <span className={styles.errorText}>{errors.githubUrl}</span>}
      </div>
      
      {errors.form && (
        <div className={styles.formError}>{errors.form}</div>
      )}
      
      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className={styles.spinner}></span>
              {project ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            project ? 'Update Project' : 'Create Project'
          )}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
