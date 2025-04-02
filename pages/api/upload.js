import { IncomingForm } from 'formidable';
import { saveUploadedFile } from '../../lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

// Disable Next.js body parsing, we'll use formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    // Only allow POST method
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Check if user is authenticated
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Parse form data
    const form = new IncomingForm({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });
    
    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Error parsing form:', err);
          res.status(500).json({ error: 'Error uploading file' });
          return resolve();
        }
        
        try {
          // Get uploaded file - in formidable, files is an object of arrays
          const file = files.file?.[0]; // Access first file in the array
          
          if (!file) {
            res.status(400).json({ error: 'No file uploaded' });
            return resolve();
          }
          
          console.log('File upload info:', { 
            originalFilename: file.originalFilename,
            mimetype: file.mimetype,
            size: file.size
          });
          
          // Save file and get the URL
          const fileUrl = await saveUploadedFile(file);
          
          res.status(200).json({ fileUrl });
          return resolve();
        } catch (error) {
          console.error('Error handling file upload:', error);
          res.status(500).json({ error: 'Error saving file' });
          return resolve();
        }
      });
    });
  } catch (error) {
    console.error('Error handling upload request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
