import { connectToDatabase, Customer } from '../src/lib/db.js';

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
    
    // GET /api/customers - Get all customers
    if (req.method === 'GET') {
      try {
        // Always return an array, even if empty
        const customers = await Customer.find({}).lean();
        console.log(`Retrieved ${customers.length} customers`);
        
        // Ensure date fields are formatted as strings
        const formattedCustomers = customers.map(customer => ({
          ...customer,
          lastOrderDate: customer.lastOrderDate ? customer.lastOrderDate.toISOString() : null,
          createdAt: customer.createdAt ? customer.createdAt.toISOString() : new Date().toISOString()
        }));
        
        return res.status(200).json(formattedCustomers);
      } catch (error) {
        console.error('Error fetching customers:', error);
        return res.status(200).json([]);  // Return empty array on error
      }
    }
    
    // POST /api/customers - Create a new customer
    if (req.method === 'POST') {
      try {
        const customer = new Customer(req.body);
        const savedCustomer = await customer.save();
        const formattedCustomer = {
          ...savedCustomer.toObject(),
          lastOrderDate: savedCustomer.lastOrderDate ? savedCustomer.lastOrderDate.toISOString() : null,
          createdAt: savedCustomer.createdAt ? savedCustomer.createdAt.toISOString() : new Date().toISOString()
        };
        return res.status(201).json(formattedCustomer);
      } catch (error) {
        console.error('Error creating customer:', error);
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