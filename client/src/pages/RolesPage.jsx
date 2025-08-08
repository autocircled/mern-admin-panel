import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

import api from '../api/roles';
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
import { useNavigate } from 'react-router-dom';

const RolesPage = () => {
  const { token } = useAuth();
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      if (!token) return;
      
      try {
        const response = await api.getAllRoles(token);
        setRoles(response);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };
    fetchRoles();
  }, [token]);

  return (
    <MainLayout>
      <div className='w-full p-2 md:p-4'>
        <div className='flex justify-between'>
          <h1 className='text-2xl font-bold mb-4'>Roles</h1>
          <div>
            <Button variant={"secondary"} onClick={() => navigate('/roles/create')}>Create Role</Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Title</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map(role => (
            <TableRow key={role._id}>
              <TableCell className="font-medium">{role.name.charAt(0).toUpperCase() + role.name.slice(1)}</TableCell>
              <TableCell>{role.permissions.map(role => role).join(', ')}</TableCell>
              <TableCell className="text-right"><Button variant="outlined" size="small">Edit</Button></TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </MainLayout>
  );
};

export default RolesPage;