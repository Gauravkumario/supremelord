// Utility functions for authentication
import fs from 'fs';
import path from 'path';

// Path to user data file
const USER_DATA_PATH = path.join(process.cwd(), 'data/user.json');

// Function to get user data
export const getUserData = () => {
  try {
    const userData = fs.readFileSync(USER_DATA_PATH, 'utf8');
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error reading user data:', error);
    return null;
  }
};

// Function to update user data
export const updateUserData = (updatedData) => {
  try {
    // Read current data
    const currentData = getUserData();
    
    // Create the updated user object
    const updatedUser = {
      ...currentData,
      ...updatedData,
      // Preserve sensitive information
      password: currentData.password,
      username: currentData.username,
      id: currentData.id
    };
    
    // Write updated data to file
    fs.writeFileSync(USER_DATA_PATH, JSON.stringify(updatedUser, null, 2));
    return updatedUser;
  } catch (error) {
    console.error('Error updating user data:', error);
    throw new Error('Failed to update user data');
  }
};

// Function to verify credentials
export const verifyCredentials = (username, password) => {
  try {
    const userData = getUserData();
    
    if (!userData) {
      return false;
    }
    
    return userData.username === username && userData.password === password;
  } catch (error) {
    console.error('Error verifying credentials:', error);
    return false;
  }
};

// Function to get user profile without sensitive data
export const getUserProfile = () => {
  try {
    const userData = getUserData();
    
    if (!userData) {
      return null;
    }
    
    // Return user data without sensitive information
    const { password, ...profile } = userData;
    return profile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};
