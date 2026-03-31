import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import api from '../../services/api';
import { FaTrash, FaEdit, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setCurrentUserToEdit(user);
    setFormData({ name: user.name, email: user.email, role: user.role });
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${currentUserToEdit._id}`, formData);
      toast.success('User updated successfully!');
      fetchUsers();
      setIsEditModalOpen(false);
      setFormData({});
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user.');
    }
  };

  const handleDelete = async (id) => {
    if (id === currentUser._id) {
      toast.error('You cannot delete your own admin account.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await api.delete(`/users/${id}`);
        toast.success('User deleted successfully!');
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete user.');
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner className="h-64" />;

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-extrabold text-dark mb-8">Manage Users</h1>

      <div className="mb-6 flex items-center gap-4">
        <Input
          type="text"
          placeholder="Search by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Button variant="secondary">
          <FaSearch /> Search
        </Button>
      </div>

      <Card className="overflow-x-auto">
        {filteredUsers.length === 0 ? (
          <p className="text-center text-gray-600 py-8">No users found matching your search.</p>
        ) : (
          <table className="min-w-full divide-y divide-light-gray">
            <thead className="bg-light-gray">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-light-gray">
              {filteredUsers.map((u) => (
                <tr key={u._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{u.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleEditClick(u)} title="Edit User">
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(u._id)}
                      disabled={u._id === currentUser._id}
                      title="Delete User"
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit User: ${currentUserToEdit?.name}`}>
        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            disabled={currentUserToEdit?._id === currentUser._id}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Update User'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};
export default AdminUsers;
