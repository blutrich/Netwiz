import { UserRole } from "../../components/ui/user-role-badge";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

// Current user stored in memory
let currentUser: User | null = null;

// Google Sheets configuration
const SPREADSHEET_ID = import.meta.env.VITE_EXPERT_SHEET_ID || "";
const ADMIN_TAB_NAME = "admin"; // The name of your admin tab
const ADMIN_RANGE = `${ADMIN_TAB_NAME}!A2:G100`; // Adjust range as needed
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || "";

// Initialize with admin user if none exists
const initializeCurrentUser = () => {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
  } else {
    // Default admin user
    currentUser = {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date().toISOString(),
      isActive: true
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  if (!currentUser) {
    initializeCurrentUser();
  }
  return currentUser;
};

// Set current user
export const setCurrentUser = (user: User): void => {
  currentUser = user;
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
};

// Check if user has permission
export const hasPermission = (requiredRole: UserRole): boolean => {
  if (!currentUser) {
    initializeCurrentUser();
  }
  
  if (!currentUser) return false;
  
  // Role hierarchy: admin > manager > viewer
  if (currentUser.role === 'admin') return true;
  if (currentUser.role === 'manager' && requiredRole !== 'admin') return true;
  if (currentUser.role === 'viewer' && requiredRole === 'viewer') return true;
  
  return false;
};

// Fetch data from Google Sheets API (copied from google-sheets.ts)
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

// Convert sheet row to User object
const rowToUser = (row: any[]): User => {
  return {
    id: row[0] || String(Math.random()),
    email: row[1] || "",
    name: row[2] || "",
    role: (row[3] as UserRole) || "viewer",
    createdAt: row[4] || new Date().toISOString(),
    lastLogin: row[5] || undefined,
    isActive: row[6] === "TRUE" || row[6] === true || row[6] === "true"
  };
};

// Get all users from Google Sheets
export const getUsers = async (): Promise<User[]> => {
  try {
    // Try to fetch from Google Sheets
    const data = await fetchSheetData(SPREADSHEET_ID, ADMIN_RANGE);
    
    if (data && data.length > 0) {
      // Convert sheet data to User objects
      return data.map(rowToUser).filter(user => user.email); // Filter out empty rows
    }
    
    // Fall back to mock data if sheet is empty or not accessible
    console.warn("No user data found in Google Sheets, using mock data");
    return mockUsers;
  } catch (error) {
    console.error("Error fetching users from Google Sheets:", error);
    // Fall back to mock data on error
    return mockUsers;
  }
};

// Get user by ID
export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const users = await getUsers();
    return users.find(u => u.id === id) || null;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return null;
  }
};

// Update user role
export const updateUserRole = async (userId: string, newRole: UserRole): Promise<User | null> => {
  try {
    // In a real implementation, this would update the Google Sheet
    // For now, we'll just update the mock data
    const users = await getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return null;
    
    const updatedUser = {
      ...users[userIndex],
      role: newRole
    };
    
    // Update in mock data
    mockUsers[userIndex] = updatedUser;
    
    return updatedUser;
  } catch (error) {
    console.error("Error updating user role:", error);
    return null;
  }
};

// Toggle user active status
export const toggleUserActive = async (userId: string): Promise<User | null> => {
  try {
    // In a real implementation, this would update the Google Sheet
    // For now, we'll just update the mock data
    const users = await getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return null;
    
    const updatedUser = {
      ...users[userIndex],
      isActive: !users[userIndex].isActive
    };
    
    // Update in mock data
    mockUsers[userIndex] = updatedUser;
    
    return updatedUser;
  } catch (error) {
    console.error("Error toggling user active status:", error);
    return null;
  }
};

// Add new user
export const addUser = async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
  try {
    // In a real implementation, this would add to the Google Sheet
    // For now, we'll just add to the mock data
    const newUser: User = {
      ...user,
      id: (mockUsers.length + 1).toString(),
      createdAt: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    return newUser;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

// Mock users list - used as fallback when Google Sheets is not available
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2023-01-01T00:00:00Z',
    lastLogin: '2023-06-15T14:30:00Z',
    isActive: true
  },
  {
    id: '2',
    email: 'manager@example.com',
    name: 'Manager User',
    role: 'manager',
    createdAt: '2023-02-15T00:00:00Z',
    lastLogin: '2023-06-14T09:15:00Z',
    isActive: true
  },
  {
    id: '3',
    email: 'viewer@example.com',
    name: 'Viewer User',
    role: 'viewer',
    createdAt: '2023-03-20T00:00:00Z',
    lastLogin: '2023-06-10T16:45:00Z',
    isActive: true
  },
  {
    id: '4',
    email: 'inactive@example.com',
    name: 'Inactive User',
    role: 'viewer',
    createdAt: '2023-04-05T00:00:00Z',
    lastLogin: '2023-05-01T11:20:00Z',
    isActive: false
  }
]; 