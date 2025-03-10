import { UserRole } from "../../components/ui/user-role-badge";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
  password?: string; // Added for authentication
}

// Current user stored in memory
let currentUser: User | null = null;

// Google Sheets configuration
const SPREADSHEET_ID = import.meta.env.VITE_EXPERT_SHEET_ID || "";
const ADMIN_TAB_NAME = "admin"; // The name of your admin tab
const ADMIN_RANGE = `${ADMIN_TAB_NAME}!A2:F100`; // Adjust range as needed - matches your columns
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || "";

// Initialize with admin user if none exists
const initializeCurrentUser = () => {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
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
  // Remove password before storing
  const { password, ...userWithoutPassword } = user;
  currentUser = userWithoutPassword as User;
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
};

// Logout current user
export const logoutUser = (): void => {
  currentUser = null;
  localStorage.removeItem('currentUser');
};

// Check if user has permission
export const hasPermission = (requiredRole: UserRole): boolean => {
  const user = getCurrentUser();
  
  if (!user) return false;
  if (!user.isActive) return false;
  
  // Role hierarchy: admin > manager > viewer
  if (user.role === 'admin') return true;
  if (user.role === 'manager' && requiredRole !== 'admin') return true;
  if (user.role === 'viewer' && requiredRole === 'viewer') return true;
  
  return false;
};

// Fetch data from Google Sheets API
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

// Convert sheet row to User object - updated to match your column structure
// A: name, B: Email, C: Role, D: Status, E: Last Login, F: Actions
const rowToUser = (row: any[], index: number): User => {
  // Generate a unique ID if none exists
  const id = String(index + 1);
  
  // Extract values from the row
  const name = row[0] || "";
  const email = row[1] || "";
  const role = (row[2]?.toLowerCase() as UserRole) || "viewer";
  const status = row[3] || "";
  const lastLogin = row[4] || undefined;
  
  // Determine if user is active based on Status column
  const isActive = status.toLowerCase() === "active" || status.toLowerCase() === "true";
  
  // Use current date as creation date if none exists
  const createdAt = new Date().toISOString();
  
  return {
    id,
    name,
    email,
    role,
    createdAt,
    lastLogin,
    isActive
  };
};

// Authenticate user against Google Sheets data
export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  try {
    // For simplicity, we're using email as the primary key and password as a simple string match
    // In a real application, you would use proper password hashing
    
    // Fetch all users from Google Sheets
    const data = await fetchSheetData(SPREADSHEET_ID, ADMIN_RANGE);
    
    if (!data || data.length === 0) {
      console.warn("No user data found in Google Sheets for authentication");
      return null;
    }
    
    // Find user with matching email
    const userIndex = data.findIndex(row => 
      row[1]?.toLowerCase() === email.toLowerCase() && row.length >= 2
    );
    
    if (userIndex === -1) {
      console.warn(`No user found with email: ${email}`);
      return null;
    }
    
    // In a real application, you would use a secure password field in your sheet
    // For this demo, we'll use a simple approach where the password is the email
    // This simulates authentication without requiring actual passwords in the sheet
    const userEmail = data[userIndex][1];
    
    // Check if password matches (in this case, password = email)
    if (password !== userEmail) {
      console.warn("Password does not match");
      return null;
    }
    
    // Convert row to user object
    const user = rowToUser(data[userIndex], userIndex);
    
    // Update last login time
    user.lastLogin = new Date().toISOString();
    
    // Set as current user
    setCurrentUser(user);
    
    return user;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
};

// Get all users from Google Sheets
export const getUsers = async (): Promise<User[]> => {
  try {
    // Try to fetch from Google Sheets
    const data = await fetchSheetData(SPREADSHEET_ID, ADMIN_RANGE);
    
    if (data && data.length > 0) {
      // Convert sheet data to User objects
      return data.map((row, index) => rowToUser(row, index)).filter(user => user.name || user.email); // Filter out empty rows
    }
    
    // Return empty array if no data
    return [];
  } catch (error) {
    console.error("Error fetching users from Google Sheets:", error);
    // Return empty array on error
    return [];
  }
};

// Get user by ID
export const getUserById = async (id: string): Promise<User | null> => {
  const users = await getUsers();
  return users.find(user => user.id === id) || null;
};

// Update user role
export const updateUserRole = async (userId: string, newRole: UserRole): Promise<User | null> => {
  try {
    const users = await getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      console.error(`User with ID ${userId} not found`);
      return null;
    }
    
    // Update user role
    users[userIndex].role = newRole;
    
    // In a real application, you would update the Google Sheet here
    // For now, we'll just return the updated user
    
    return users[userIndex];
  } catch (error) {
    console.error("Error updating user role:", error);
    return null;
  }
};

// Toggle user active status
export const toggleUserActive = async (userId: string): Promise<User | null> => {
  try {
    const users = await getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      console.error(`User with ID ${userId} not found`);
      return null;
    }
    
    // Toggle active status
    users[userIndex].isActive = !users[userIndex].isActive;
    
    // In a real application, you would update the Google Sheet here
    // For now, we'll just return the updated user
    
    return users[userIndex];
  } catch (error) {
    console.error("Error toggling user active status:", error);
    return null;
  }
};

// Add new user
export const addUser = async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
  try {
    // Generate ID and creation date
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    // In a real application, you would add the user to the Google Sheet here
    // For now, we'll just return the new user
    
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