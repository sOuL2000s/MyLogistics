import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../services/api';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (id === currentUser._id) return toast.error("Self deletion blocked.");
    if (confirm("Delete user?")) {
        await api.delete(`/users/${id}`);
        fetchUsers();
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-extrabold text-dark mb-8">Manage Users</h1>
      <Card>
        {users.map(u => (
          <div key={u._id} className="flex justify-between p-2 border-b">
            <span>{u.name} ({u.role})</span>
            <Button variant="danger" size="sm" onClick={() => handleDelete(u._id)}><FaTrash /></Button>
          </div>
        ))}
      </Card>
    </div>
  );
};
export default AdminUsers;
