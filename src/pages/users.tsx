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
  }, []);

  // Handle role change
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const updatedUser = await updateUserRole(userId, newRole);
      if (updatedUser) {
        setUsers(users.map(user => user.id === userId ? updatedUser : user));
        toast({
          title: "Role Updated",
          description: `User role has been updated to ${newRole}.`,
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
    }
  };

  // Handle toggle active status
  const handleToggleActive = async (userId: string) => {
    try {
      const updatedUser = await toggleUserActive(userId);
      if (updatedUser) {
        setUsers(users.map(user => user.id === userId ? updatedUser : user));
        toast({
          title: "Status Updated",
          description: `User has been ${updatedUser.isActive ? 'activated' : 'deactivated'}.`,
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
        description: "New user has been added successfully.",
        variant: "success"
      });
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Error",
        description: "Failed to add user. Please try again.",
        variant: "destructive"
      });
    }
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
        <Button onClick={() => setShowAddUser(!showAddUser)}>
          {showAddUser ? "Cancel" : "Add User"}
        </Button>
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
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage user roles and access permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-4">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Email</th>
                    <th className="py-2 px-4 text-left">Role</th>
                    <th className="py-2 px-4 text-left">Status</th>
                    <th className="py-2 px-4 text-left">Last Login</th>
                    <th className="py-2 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-4">{user.name}</td>
                      <td className="py-2 px-4">{user.email}</td>
                      <td className="py-2 px-4">
                        <select
                          className="p-1 border rounded-md text-sm"
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                        >
                          <option value="admin">Admin</option>
                          <option value="manager">Manager</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      </td>
                      <td className="py-2 px-4">
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
                      <td className="py-2 px-4">
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="py-2 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(user.id)}
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
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>
            Understanding the different user roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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