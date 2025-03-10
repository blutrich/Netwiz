import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { UserRoleBadge, UserRole } from "../components/ui/user-role-badge";
import { getUsers, updateUserRole, toggleUserActive, addUser, User } from "../lib/services/user-management";
import { toast } from "../components/ui/use-toast";

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "viewer" as UserRole,
    isActive: true
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error loading users:", error);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [refreshTrigger]);

  // Handle role change
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      setLoading(true);
      toast({
        title: "Updating Role",
        description: "Updating user role in the application...",
      });

      const updatedUser = await updateUserRole(userId, newRole);
      if (updatedUser) {
        setUsers(users.map(user => user.id === userId ? updatedUser : user));
        toast({
          title: "Role Updated",
          description: `User role has been updated to ${newRole} in the application. Note: Manual update to Google Sheets may be required.`,
          variant: "success"
        });
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle active status
  const handleToggleActive = async (userId: string) => {
    try {
      setLoading(true);
      toast({
        title: "Updating Status",
        description: "Updating user status in the application...",
      });

      const updatedUser = await toggleUserActive(userId);
      if (updatedUser) {
        setUsers(users.map(user => user.id === userId ? updatedUser : user));
        toast({
          title: "Status Updated",
          description: `User has been ${updatedUser.isActive ? 'activated' : 'deactivated'} in the application. Note: Manual update to Google Sheets may be required.`,
          variant: "success"
        });
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle add user
  const handleAddUser = async () => {
    try {
      if (!newUser.name || !newUser.email) {
        toast({
          title: "Validation Error",
          description: "Name and email are required.",
          variant: "destructive"
        });
        return;
      }

      setLoading(true);
      toast({
        title: "Adding User",
        description: "Adding user to the application...",
      });

      const addedUser = await addUser(newUser);
      setUsers([...users, addedUser]);
      setNewUser({
        name: "",
        email: "",
        role: "viewer",
        isActive: true
      });
      setShowAddUser(false);
      toast({
        title: "User Added",
        description: "New user has been added successfully to the application. Note: Manual update to Google Sheets may be required.",
        variant: "success"
      });
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Error",
        description: "Failed to add user. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh data
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    toast({
      title: "Refreshing Data",
      description: "Fetching the latest data from Google Sheets.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage users and their access permissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M21 2v6h-6"></path>
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
              <path d="M3 22v-6h6"></path>
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
            </svg>
            Refresh
          </Button>
          <Button onClick={() => setShowAddUser(!showAddUser)}>
            {showAddUser ? "Cancel" : "Add User"}
          </Button>
        </div>
      </div>

      {showAddUser && (
        <Card>
          <CardHeader>
            <CardTitle>Add New User</CardTitle>
            <CardDescription>Create a new user account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium" htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full p-2 mt-1 border rounded-md"
                    placeholder="User's full name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full p-2 mt-1 border rounded-md"
                    placeholder="user@example.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium" htmlFor="role">
                  Role
                </label>
                <select
                  id="role"
                  className="w-full p-2 mt-1 border rounded-md"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is-active"
                  className="rounded border-gray-300"
                  checked={newUser.isActive}
                  onChange={(e) => setNewUser({ ...newUser, isActive: e.target.checked })}
                />
                <label className="text-sm font-medium" htmlFor="is-active">
                  Active user
                </label>
              </div>

              <Button onClick={handleAddUser}>Add User</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Manage user roles and access permissions
            </CardDescription>
          </div>
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            {loading ? "Loading..." : `${users.length} users`}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <svg className="animate-spin h-8 w-8 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-muted-foreground">Loading users from Google Sheets...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 border rounded-md bg-muted/20">
              <svg className="h-12 w-12 text-muted-foreground mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium">No users found</h3>
              <p className="mt-1 text-muted-foreground">Add users to your admin tab in Google Sheets or use the "Add User" button.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground">Name</th>
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground">Email</th>
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground">Role</th>
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground">Status</th>
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground">Last Login</th>
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <UserRoleBadge role={user.role} />
                          <select
                            className="p-1 border rounded-md text-sm"
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                          >
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="viewer">Viewer</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {user.lastLogin
                          ? user.lastLogin
                          : "Never"}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant={user.isActive ? "outline" : "default"}
                          size="sm"
                          onClick={() => handleToggleActive(user.id)}
                          className={user.isActive ? "text-red-600 border-red-200 hover:bg-red-50" : "bg-green-600 hover:bg-green-700"}
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Google Sheets Integration</CardTitle>
          <CardDescription>
            User data is synced with your Google Sheets admin tab
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This user management system is connected to the "admin" tab in your Google Sheets document. 
              The data is structured as follows:
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-muted">
                    <th className="py-2 px-4 text-left border">Column</th>
                    <th className="py-2 px-4 text-left border">Google Sheet</th>
                    <th className="py-2 px-4 text-left border">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-4 border">A</td>
                    <td className="py-2 px-4 border">Name</td>
                    <td className="py-2 px-4 border">User's full name</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 border">B</td>
                    <td className="py-2 px-4 border">Email</td>
                    <td className="py-2 px-4 border">User's email address</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 border">C</td>
                    <td className="py-2 px-4 border">Role</td>
                    <td className="py-2 px-4 border">admin, manager, or viewer</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 border">D</td>
                    <td className="py-2 px-4 border">Status</td>
                    <td className="py-2 px-4 border">Active or Inactive</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 border">E</td>
                    <td className="py-2 px-4 border">Last Login</td>
                    <td className="py-2 px-4 border">Date of last login</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 border">F</td>
                    <td className="py-2 px-4 border">Actions</td>
                    <td className="py-2 px-4 border">Not used by the system</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
              <h3 className="text-sm font-medium text-amber-800">API Limitation</h3>
              <p className="text-sm text-amber-700 mt-1">
                <strong>Important:</strong> The Google Sheets API requires OAuth2 authentication for write operations. 
                With the current API key setup, the application can read data from Google Sheets, but cannot write back to it.
              </p>
              <p className="text-sm text-amber-700 mt-2">
                Changes made in this interface (adding users, changing roles, toggling status) will work in the application 
                but will not be automatically synced back to Google Sheets. You'll need to manually update the Google Sheet 
                to keep it in sync. Check the console for details when making changes.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
              <h3 className="text-sm font-medium text-blue-800">How to Add Users</h3>
              <p className="text-sm text-blue-700 mt-1">
                You can add users either directly in your Google Sheet or through this interface using the "Add User" button. 
                When adding users through this interface, you'll need to manually add them to your Google Sheet as well to keep the data in sync.
              </p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
              <h3 className="text-sm font-medium text-yellow-800">Authentication Note</h3>
              <p className="text-sm text-yellow-700 mt-1">
                For simplicity, the system uses email addresses as both the identifier and password for login. 
                Users will need to enter their email address as the password when logging in.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>
            Understanding the different user roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <UserRoleBadge role="admin" />
                <h3 className="font-medium">Admin</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Full access to all features. Can manage users, view all data, and change system settings.
              </p>
              <ul className="mt-2 text-sm list-disc list-inside">
                <li>Manage users and permissions</li>
                <li>Configure system settings</li>
                <li>Access all data and reports</li>
                <li>Manage integrations</li>
              </ul>
            </div>

            <div className="p-4 border rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <UserRoleBadge role="manager" />
                <h3 className="font-medium">Manager</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Can manage content and view reports, but cannot manage users or change system settings.
              </p>
              <ul className="mt-2 text-sm list-disc list-inside">
                <li>Manage requests and experts</li>
                <li>View analytics and reports</li>
                <li>Update content</li>
                <li>Cannot manage users or system settings</li>
              </ul>
            </div>

            <div className="p-4 border rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <UserRoleBadge role="viewer" />
                <h3 className="font-medium">Viewer</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Read-only access to content and reports. Cannot make changes to the system.
              </p>
              <ul className="mt-2 text-sm list-disc list-inside">
                <li>View requests and experts</li>
                <li>View basic analytics</li>
                <li>Cannot make any changes</li>
                <li>Cannot access sensitive information</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 