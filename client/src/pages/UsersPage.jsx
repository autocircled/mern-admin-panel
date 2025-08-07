import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

import api from '../api/users';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import MainLayout from '@/components/layout/main';

const UsersPage = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      
      try {
        const response = await api.getAllUsers(token);
        setUsers(response);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };
    fetchUsers();
  }, [token]);

  return (
    <MainLayout>
      <div className='w-full p-2 md:p-4'>
        <h1 className='text-2xl font-bold mb-4'>Users</h1>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
            <TableRow key={user._id}>
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.roles.map(role => role.name).join(', ')}</TableCell>
              <TableCell className="text-right"><Button variant="outlined" size="small">Edit</Button></TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </MainLayout>
  );
};

export default UsersPage;