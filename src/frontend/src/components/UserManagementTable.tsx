import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useApproveUser } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { UserProfile } from '../backend';
import { Principal } from '@dfinity/principal';

interface UserManagementTableProps {
  users: UserProfile[];
  onRefresh: () => void;
}

export default function UserManagementTable({ users, onRefresh }: UserManagementTableProps) {
  const approveUserMutation = useApproveUser();

  const handleApprove = async (userPrincipal: string) => {
    try {
      const principal = Principal.fromText(userPrincipal);
      await approveUserMutation.mutateAsync(principal);
      toast.success('User approved successfully!');
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve user');
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No users registered yet.
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
          {users.map((user, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.whatsappNumber}</TableCell>
              <TableCell>{user.groupNumber}</TableCell>
              <TableCell>
                {user.isApproved ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Approved
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Pending
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {!user.isApproved && (
                  <Button
                    size="sm"
                    onClick={() => handleApprove(user.email)}
                    disabled={approveUserMutation.isPending}
                    className="bg-[oklch(0.55_0.25_250)] hover:bg-[oklch(0.50_0.25_250)]"
                  >
                    {approveUserMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Approve'
                    )}
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
