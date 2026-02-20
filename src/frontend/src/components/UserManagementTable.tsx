import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApproveUser } from '../hooks/useQueries';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';
import type { TasksMetadata } from '../backend';

interface UserManagementTableProps {
  users: TasksMetadata[];
  onRefresh: () => void;
}

export default function UserManagementTable({ users, onRefresh }: UserManagementTableProps) {
  const approveMutation = useApproveUser();

  const handleApprove = async (principalText: string) => {
    try {
      const principal = Principal.fromText(principalText);
      await approveMutation.mutateAsync(principal);
      toast.success('User approved successfully');
      onRefresh();
    } catch (error: any) {
      console.error('Approval error:', error);
      toast.error(error.message || 'Failed to approve user');
    }
  };

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
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.principal}>
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.whatsappNumber}</TableCell>
              <TableCell>{user.groupNumber}</TableCell>
              <TableCell>
                {user.isApproved ? (
                  <Badge variant="default" className="bg-green-600">Approved</Badge>
                ) : (
                  <Badge variant="secondary">Pending</Badge>
                )}
              </TableCell>
              <TableCell>
                {!user.isApproved && (
                  <Button
                    size="sm"
                    onClick={() => handleApprove(user.principal)}
                    disabled={approveMutation.isPending}
                    className="bg-[oklch(0.55_0.25_250)] hover:bg-[oklch(0.50_0.25_250)]"
                  >
                    {approveMutation.isPending ? 'Approving...' : 'Approve'}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
