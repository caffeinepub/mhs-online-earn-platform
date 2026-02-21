import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';
import type { TasksMetadata, Task, AuthRequest, AuthResponse, WithdrawRequest } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<TasksMetadata | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: TasksMetadata) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Authentication
export function useAuthenticate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: AuthRequest) => {
      if (!actor) throw new Error('Actor not available');
      return actor.authenticate(credentials);
    },
    onSuccess: (response: AuthResponse) => {
      if (response.success) {
        // Invalidate user profile queries on successful authentication
        queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      }
    },
  });
}

// Registration
export function useRegisterUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: TasksMetadata) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerUser(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });
}

// Balance Query
export function useGetBalance() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['balance'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getBalance();
    },
    enabled: !!actor && !isFetching,
  });
}

// Balance Mutation (Admin)
export function useAddBalance() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ username, amount }: { username: string; amount: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addBalance(username, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });
}

// Tasks Queries
export function useGetAllTasks() {
  const { actor, isFetching } = useActor();

  return useQuery<Task[]>({
    queryKey: ['allTasks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTasks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetDailyTasks(userPrincipal: Principal | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Task[]>({
    queryKey: ['dailyTasks', userPrincipal?.toString()],
    queryFn: async () => {
      if (!actor || !userPrincipal) return [];
      return actor.getDailyTasks(userPrincipal);
    },
    enabled: !!actor && !isFetching && !!userPrincipal,
  });
}

export function useCompleteTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.completeTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyTasks'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['taskStats'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });
}

// Admin Task Management
export function useAddTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: Task) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTask(task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTasks'] });
    },
  });
}

export function useDeleteTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTasks'] });
    },
  });
}

// User Management (Admin)
export function useGetAllUsers() {
  const { actor, isFetching } = useActor();

  return useQuery<TasksMetadata[]>({
    queryKey: ['allUsers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

// Referral Queries
export function useGetReferralCount() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['referralCount'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getReferralCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetReferralEarnings() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['referralEarnings'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getReferralEarnings();
    },
    enabled: !!actor && !isFetching,
  });
}

// Auth check
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// Withdraw Requests
export function useSubmitWithdrawRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      phoneNumber,
      amount,
      paymentMethod,
    }: {
      phoneNumber: string;
      amount: bigint;
      paymentMethod: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitWithdrawRequest(phoneNumber, amount, paymentMethod);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userWithdrawHistory'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });
}

export function useGetUserWithdrawHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<WithdrawRequest[]>({
    queryKey: ['userWithdrawHistory'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserWithdrawHistory();
    },
    enabled: !!actor && !isFetching,
  });
}
