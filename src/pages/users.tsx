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
    <div className="space-y-6 p-2 sm:p-4 md:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold">User Management</h1>
      <p className="text-muted-foreground">
        Add, edit, and manage users and their permissions.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Google Sheets Integration</CardTitle>
          <CardDescription>
            User data is synced with the Google Sheets admin tab
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            User information is pulled from the "admin" tab in your Google Sheet with the following structure:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Column</th>
                  <th className="text-left p-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">Name (A)</td>
                  <td className="p-2">User's full name</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Email (B)</td>
                  <td className="p-2">User's email address (used for login)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Role (C)</td>
                  <td className="p-2">User role: admin, manager, or viewer</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Status (D)</td>
                  <td className="p-2">Active or Inactive</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Last Login (E)</td>
                  <td className="p-2">Date of last login</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Note: Changes made here will not automatically sync back to Google Sheets. The sheet serves as the source of truth.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Manage users and their roles.
            </CardDescription>
          </div>
          <Button onClick={() => setShowAddUser(!showAddUser)}>Add User</Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Name</th>
                  <th className="text-left p-2 font-medium">Email</th>
                  <th className="text-left p-2 font-medium">Role</th>
                  <th className="text-left p-2 font-medium hidden sm:table-cell">Last Login</th>
                  <th className="text-left p-2 font-medium">Status</th>
                  <th className="text-left p-2 font-medium">Actions</th>
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
                    <td className="py-3 px-4 text-muted-foreground">
                      {user.lastLogin
                        ? user.lastLogin
                        : "Never"}
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
        </CardContent>
      </Card>

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
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>
            Understanding the different user roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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