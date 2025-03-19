// Google Sheets API implementation for browser environments
// This uses the Google Sheets API v4 directly from the browser

// The spreadsheet IDs for your NetWizBot data from environment variables
const EXPERT_SHEET_ID = import.meta.env.VITE_EXPERT_SHEET_ID || '1Fp0FdS3TOicZSb7FZChuRdGybExr7xu1i7G_fOHcbEo';
const REQUEST_SHEET_ID = import.meta.env.VITE_REQUEST_SHEET_ID || '1Fp0FdS3TOicZSb7FZChuRdGybExr7xu1i7G_fOHcbEo';

// Get API key from environment variables
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';

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
  enrichData?: string;
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

// Fallback mock data in case the API fails
const mockExperts: Expert[] = [
  {
    id: '1',
    fullName: 'John Doe',
    companyName: 'Tech Solutions',
    sector: 'Technology',
    domain: 'Software Development',
    role: 'Senior Developer',
    phone: '+1234567890',
    email: 'john@example.com',
    linkedin: 'linkedin.com/in/johndoe',
    location: 'Tel Aviv',
    availability: 'Weekdays',
  },
  // More mock experts...
];

const mockRequests: Request[] = [
  {
    requestId: 'REQ001',
    requesterPhone: '+9876543210',
    requestMessage: 'Need help with software development project',
    sector: 'Technology',
    domain: 'Software Development',
    status: 'matched',
    helperId: '1',
    helperName: 'John Doe',
    createdAt: '2025-03-01',
    summary: 'Looking for guidance on React project structure',
    urgency: 'Medium',
  },
  // More mock requests...
];

/**
 * Fetch data from Google Sheets API
 */
async function fetchSheetData(spreadsheetId: string, range: string): Promise<any[][]> {
  try {
    console.log(`Fetching data from spreadsheet: ${spreadsheetId}, range: ${range}`);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${API_KEY}`;
    console.log(`API URL: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error Response: ${errorText}`);
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    return data.values || [];
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw error;
  }
}

/**
 * Get sheet names from a spreadsheet
 */
async function getSheetNames(spreadsheetId: string): Promise<string[]> {
  try {
    console.log(`Fetching sheet names from spreadsheet: ${spreadsheetId}`);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error Response: ${errorText}`);
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    const sheetNames = data.sheets.map((sheet: any) => sheet.properties.title);
    console.log('Sheet names:', sheetNames);
    return sheetNames;
  } catch (error) {
    console.error('Error fetching sheet names:', error);
    throw error;
  }
}

/**
 * Fetch all experts from the Google Sheet
 */
export async function getExperts(): Promise<Expert[]> {
  try {
    if (!API_KEY) {
      console.warn('No API key provided, using mock data');
      return mockExperts;
    }
    
    // First, get the sheet names to find the correct one
    const sheetNames = await getSheetNames(EXPERT_SHEET_ID);
    
    if (sheetNames.length === 0) {
      console.warn('No sheets found in the spreadsheet, using mock data');
      return mockExperts;
    }
    
    // Use the first sheet name
    const firstSheetName = sheetNames[0];
    console.log(`Using sheet name: ${firstSheetName}`);
    
    const rows = await fetchSheetData(EXPERT_SHEET_ID, `${firstSheetName}!A2:L`);
    
    if (!rows || rows.length === 0) {
      console.warn('No data found in the sheet, using mock data');
      return mockExperts;
    }
    
    // Map the row data to the Expert interface
    return rows.map((row, index) => ({
      id: String(index + 1),
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
      enrichData: row[10] || '',
    }));
  } catch (error) {
    console.error('Error fetching experts, falling back to mock data:', error);
    return mockExperts;
  }
}

/**
 * Fetch all requests from the Google Sheet
 */
export async function getRequests(): Promise<Request[]> {
  try {
    if (!API_KEY) {
      console.warn('No API key provided, using mock data');
      return mockRequests;
    }
    
    // First, get the sheet names to find the correct one
    const sheetNames = await getSheetNames(REQUEST_SHEET_ID);
    
    if (sheetNames.length <= 1) {
      console.warn('No second sheet found in the spreadsheet, using mock data');
      return mockRequests;
    }
    
    // Use the second sheet name (or first if there's only one)
    const sheetName = sheetNames.length > 1 ? sheetNames[1] : sheetNames[0];
    console.log(`Using sheet name: ${sheetName}`);
    
    const rows = await fetchSheetData(REQUEST_SHEET_ID, `${sheetName}!A2:L`);
    
    if (!rows || rows.length === 0) {
      console.warn('No data found in the sheet, using mock data');
      return mockRequests;
    }
    
    // Map the row data to the Request interface
    return rows.map((row) => ({
      requestId: row[0] || '',
      requesterPhone: row[1] || '',
      requestMessage: row[2] || '',
      sector: row[3] || '',
      domain: row[4] || '',
      status: (row[5] || 'expert_contacted') as Request['status'],
      helperId: row[6] || '',
      helperName: row[7] || '',
      createdAt: row[8] || '',
      completionDate: row[9] || undefined,
      summary: row[10] || '',
      urgency: row[11] || '',
    }));
  } catch (error) {
    console.error('Error fetching requests, falling back to mock data:', error);
    return mockRequests;
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