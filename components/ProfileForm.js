import React, { useState, useEffect } from 'react';
import { updateUserProfile } from '../lib/api';
import ImageUpload from './ImageUpload';
import styles from '../styles/ProfileForm.module.css';

const ProfileForm = ({ profile, onProfileUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    profileImage: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        title: profile.title || '',
        bio: profile.bio || '',
        profileImage: profile.profileImage || ''
      });
    }
  }, [profile]);
  
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
    
    // Clear success message when form is modified
    if (successMessage) {
      setSuccessMessage('');
    }
  };
  
  const handleImageUpload = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      profileImage: imageUrl
    }));
    
    // Clear image error if it exists
    if (errors.profileImage) {
      setErrors(prev => ({
        ...prev,
        profileImage: ''
      }));
    }
    
    // Clear success message when form is modified
    if (successMessage) {
      setSuccessMessage('');
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Professional title is required';
    }
    
    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    } else if (formData.bio.length < 10) {
      newErrors.bio = 'Bio should be at least 10 characters';
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
    setSuccessMessage('');
    
    try {
      const updatedProfile = await updateUserProfile(formData);
      
      // Show success message
      setSuccessMessage('Profile updated successfully!');
      
      // Notify parent component about the update
      if (onProfileUpdated) {
        onProfileUpdated(updatedProfile);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors(prev => ({
        ...prev,
        form: 'Failed to update profile. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>Edit Profile</h2>
      
      {successMessage && (
        <div className={styles.successMessage}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          {successMessage}
        </div>
      )}
      
      <div className={styles.formGroup}>
        <ImageUpload
          currentImage={formData.profileImage}
          onImageUpload={handleImageUpload}
          label="Profile Photo"
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
          placeholder="Your full name"
          disabled={isSubmitting}
        />
        {errors.name && <span className={styles.errorText}>{errors.name}</span>}
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>Professional Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
          placeholder="e.g. Frontend Developer"
          disabled={isSubmitting}
        />
        {errors.title && <span className={styles.errorText}>{errors.title}</span>}
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="bio" className={styles.label}>Bio *</label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className={`${styles.textarea} ${errors.bio ? styles.inputError : ''}`}
          placeholder="Write a short bio about yourself"
          rows={6}
          disabled={isSubmitting}
        />
        {errors.bio && <span className={styles.errorText}>{errors.bio}</span>}
      </div>
      
      {errors.form && (
        <div className={styles.formError}>{errors.form}</div>
      )}
      
      <div className={styles.formActions}>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className={styles.spinner}></span>
              Updating...
            </>
          ) : (
            'Update Profile'
          )}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
