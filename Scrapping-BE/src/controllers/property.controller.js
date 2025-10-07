 
import { scrapeZameen } from '../services/zameenScraper.js';

export const getProperties = async (req, res) => {
  try {
    const data = await scrapeZameen(req.query.city);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Controller Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch properties' });
  }
};
