import { connectToDatabase, Campaign } from '../src/lib/db.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  
  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Connect to the database
    await connectToDatabase();
    
    // GET /api/campaigns - Get all campaigns
    if (req.method === 'GET') {
      try {
        // Always return an array, even if empty
        const campaigns = await Campaign.find({}).lean();
        console.log(`Retrieved ${campaigns.length} campaigns`);
        
        // Ensure date fields are formatted as strings
        const formattedCampaigns = campaigns.map(campaign => ({
          ...campaign,
          createdAt: campaign.createdAt ? campaign.createdAt.toISOString() : new Date().toISOString()
        }));
        
        return res.status(200).json(formattedCampaigns);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        return res.status(200).json([]);  // Return empty array on error
      }
    }
    
    // POST /api/campaigns - Create a new campaign
    if (req.method === 'POST') {
      try {
        const campaign = new Campaign(req.body);
        const savedCampaign = await campaign.save();
        const formattedCampaign = {
          ...savedCampaign.toObject(),
          createdAt: savedCampaign.createdAt ? savedCampaign.createdAt.toISOString() : new Date().toISOString()
        };
        return res.status(201).json(formattedCampaign);
      } catch (error) {
        console.error('Error creating campaign:', error);
        return res.status(400).json({ error: error.message });
      }
    }
    
    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error processing request:', error);
    
    // Provide a helpful error response
    if (error.name === 'MongooseError' || error.name === 'MongoError') {
      return res.status(500).json({ error: 'Database connection error', details: error.message });
    }
    
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
} 