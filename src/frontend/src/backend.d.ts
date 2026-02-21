import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TasksMetadata {
    tasks: Array<Task>;
    isApproved: boolean;
    principal: string;
    referralCode: string;
    groupNumber: string;
    username: string;
    completedTasks: Array<TaskCompletion>;
    referrals: Array<Principal>;
    email: string;
    whatsappNumber: string;
    passwordHash: string;
    totalEarnings: bigint;
}
export interface TaskUpdate {
    updatedTask: Task;
    updatedTitle: string;
    taskId: bigint;
}
export interface AuthRequest {
    username: string;
    password: string;
}
export interface UserRegistration {
    isApproved: boolean;
    principal?: Principal;
    referralCode: string;
    groupNumber: string;
    username: string;
    balance: bigint;
    email: string;
    whatsappNumber: string;
    passwordHash: string;
}
export type Time = bigint;
export interface TaskCompletion {
    taskId: bigint;
    timestamp: Time;
}
export interface Task {
    id: bigint;
    status: TaskStatus;
    reward: bigint;
    title: string;
    description: string;
}
export interface WithdrawRequest {
    id: bigint;
    status: string;
    paymentMethod: string;
    submitTime: Time;
    userPrincipal: Principal;
    phoneNumber: string;
    amount: bigint;
}
export interface AuthResponse {
    errorMessage: string;
    success: boolean;
}
export enum TaskStatus {
    open = "open",
    completed = "completed",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBalance(username: string, amount: bigint): Promise<void>;
    addTask(task: Task): Promise<void>;
    addUserRegistration(id: string, username: string, whatsappNumber: string, groupNumber: string, email: string, passwordHash: string, referralCode: string, approved: boolean, principal: Principal | null): Promise<void>;
    approveUser(username: string, approved: boolean): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    authenticate(credentials: AuthRequest): Promise<AuthResponse>;
    completeTask(taskId: bigint): Promise<void>;
    deleteTask(taskId: bigint): Promise<void>;
    getAllRegistrations(): Promise<Array<UserRegistration>>;
    getAllTasks(): Promise<Array<Task>>;
    getAllUsers(): Promise<Array<TasksMetadata>>;
    getAllWithdrawRequests(): Promise<Array<[Principal, Array<WithdrawRequest>]>>;
    getBalance(): Promise<bigint>;
    getCallerUserProfile(): Promise<TasksMetadata | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCompletedTasks(user: Principal): Promise<Array<bigint>>;
    getDailyTasks(user: Principal): Promise<Array<Task>>;
    getReferralCount(): Promise<bigint>;
    getReferralEarnings(): Promise<bigint>;
    getRegistration(_id: string): Promise<UserRegistration | null>;
    getTaskById(taskId: bigint): Promise<Task | null>;
    getTaskStats(): Promise<{
        totalTasks: bigint;
        completedTasks: bigint;
        openTasks: bigint;
    }>;
    getTasksByRewardForCaller(): Promise<Array<Task>>;
    getUserPoints(user: Principal): Promise<bigint>;
    getUserProfile(user: Principal): Promise<TasksMetadata | null>;
    getUserWithdrawHistory(): Promise<Array<WithdrawRequest>>;
    getWeeklyTaskStats(user: Principal): Promise<{
        completedTasks: bigint;
        totalPoints: bigint;
    }>;
    isCallerAdmin(): Promise<boolean>;
    isLoggedIn(): Promise<boolean>;
    login(username: string, password: string): Promise<boolean>;
    logout(): Promise<void>;
    registerUser(profile: TasksMetadata): Promise<void>;
    saveCallerUserProfile(profile: TasksMetadata): Promise<void>;
    submitWithdrawRequest(phoneNumber: string, amount: bigint, paymentMethod: string): Promise<WithdrawRequest>;
    updateTasks(taskUpdates: Array<TaskUpdate>): Promise<void>;
    updateWithdrawRequestStatus(userPrincipal: Principal, requestId: bigint, newStatus: string): Promise<void>;
}
