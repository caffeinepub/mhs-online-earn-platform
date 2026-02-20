import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { TasksMetadata } from '../backend';

interface UserManagementTableProps {
  users: TasksMetadata[];
  onRefresh: () => void;
}

export default function UserManagementTable({ users }: UserManagementTableProps) {
  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No users registered yet
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead>Group</TableHead>
            <TableHead>Total Earnings</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.principal}>
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.whatsappNumber}</TableCell>
              <TableCell>{user.groupNumber}</TableCell>
              <TableCell>${user.totalEarnings.toString()}</TableCell>
              <TableCell>
                <Badge variant="default" className="bg-green-600">Approved</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
