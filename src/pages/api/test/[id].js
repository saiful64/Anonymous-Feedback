// src/pages/api/test/[id].js

export default function handler(req, res) {
    const { id } = req.query; // Access the dynamic parameter 'id'
    
    if (req.method === 'GET') {
      res.status(200).json({ message: `You have requested test ID: ${id}` });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }
  