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

// Mock current user - in a real app, this would come from authentication
let currentUser: User | null = null;

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

// Mock users list - in a real app, this would come from Google Sheets
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

// Get all users
export const getUsers = async (): Promise<User[]> => {
  // In a real app, this would fetch from Google Sheets
  return Promise.resolve(mockUsers);
};

// Get user by ID
export const getUserById = async (id: string): Promise<User | null> => {
  const user = mockUsers.find(u => u.id === id);
  return Promise.resolve(user || null);
};

// Update user role
export const updateUserRole = async (userId: string, newRole: UserRole): Promise<User | null> => {
  // In a real app, this would update the Google Sheet
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  if (userIndex === -1) return null;
  
  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    role: newRole
  };
  
  return Promise.resolve(mockUsers[userIndex]);
};

// Toggle user active status
export const toggleUserActive = async (userId: string): Promise<User | null> => {
  // In a real app, this would update the Google Sheet
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  if (userIndex === -1) return null;
  
  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    isActive: !mockUsers[userIndex].isActive
  };
  
  return Promise.resolve(mockUsers[userIndex]);
};

// Add new user
export const addUser = async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
  // In a real app, this would add to the Google Sheet
  const newUser: User = {
    ...user,
    id: (mockUsers.length + 1).toString(),
    createdAt: new Date().toISOString()
  };
  
  mockUsers.push(newUser);
  return Promise.resolve(newUser);
}; 