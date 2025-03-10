import { google } from 'googleapis';

// The spreadsheet IDs for your NetWizBot data from environment variables
const EXPERT_SHEET_ID = import.meta.env.VITE_EXPERT_SHEET_ID || '1Fp0FdS3TOicZSb7FZChuRdGybExr7xu1i7G_fOHcbEo';
const REQUEST_SHEET_ID = import.meta.env.VITE_EXPERT_SHEET_ID || '1Fp0FdS3TOicZSb7FZChuRdGybExr7xu1i7G_fOHcbEo';

// Define the data types based on your sheet structure
export interface Expert {
  id?: string;
  fullName: string;
  companyName: string;
  sector: string;
  domain: string;
  role: string;
  phone: string;
  email: string;
  linkedin: string;
  location: string;
  availability: string;
}

export interface Request {
  requestId: string;
  requesterPhone: string; 
  requestMessage: string;
  sector: string;
  domain: string;
  status: 'expert_contacted' | 'matched' | 'expert_declined' | 'completed';
  helperId: string;
  helperName: string;
  createdAt: string;
  completionDate?: string;
  summary: string;
  urgency: string;
}

// Get API key from environment variables
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';

// Initialize the Sheets API
const sheets = google.sheets({ version: 'v4', auth: API_KEY });

/**
 * Fetch all experts from the Google Sheet
 */
export async function getExperts(): Promise<Expert[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: EXPERT_SHEET_ID,
      range: 'גיליון1!A2:K', // Adjust range based on your sheet
    });
    
    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }
    
    // Map the row data to the Expert interface
    return rows.map((row) => ({
      fullName: row[0] || '',
      companyName: row[1] || '',
      sector: row[2] || '',
      domain: row[3] || '',
      role: row[4] || '',
      phone: row[5] || '',
      email: row[6] || '',
      linkedin: row[7] || '',
      location: row[8] || '',
      availability: row[9] || '',
    }));
  } catch (error) {
    console.error('Error fetching experts:', error);
    throw error;
  }
}

/**
 * Fetch all requests from the Google Sheet
 */
export async function getRequests(): Promise<Request[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: REQUEST_SHEET_ID,
      range: 'Requests!A2:L', // Adjust range based on your sheet
    });
    
    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }
    
    // Map the row data to the Request interface
    return rows.map((row) => ({
      requestId: row[0] || '',
      requesterPhone: row[1] || '',
      requestMessage: row[2] || '',
      sector: row[3] || '',
      domain: row[4] || '',
      status: row[5] as Request['status'] || 'expert_contacted',
      helperId: row[6] || '',
      helperName: row[7] || '',
      createdAt: row[8] || '',
      completionDate: row[9] || undefined,
      summary: row[10] || '',
      urgency: row[11] || '',
    }));
  } catch (error) {
    console.error('Error fetching requests:', error);
    throw error;
  }
}

/**
 * Fetch a single request by ID
 */
export async function getRequestById(requestId: string): Promise<Request | null> {
  try {
    const requests = await getRequests();
    return requests.find(request => request.requestId === requestId) || null;
  } catch (error) {
    console.error('Error fetching request by ID:', error);
    throw error;
  }
}

/**
 * Fetch experts by sector
 */
export async function getExpertsBySector(sector: string): Promise<Expert[]> {
  try {
    const experts = await getExperts();
    return experts.filter(expert => expert.sector === sector);
  } catch (error) {
    console.error('Error fetching experts by sector:', error);
    throw error;
  }
} 