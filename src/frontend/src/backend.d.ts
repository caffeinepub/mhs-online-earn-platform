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
export type Time = bigint;
export interface UserRegistration {
    isApproved: boolean;
    principal?: Principal;
    referralCode: string;
    username: string;
    email: string;
    whatsappNumber: string;
    passwordHash: string;
}
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
    addTask(task: Task): Promise<void>;
    addUserRegistration(id: string, username: string, whatsappNumber: string, email: string, passwordHash: string, referralCode: string, approved: boolean, principal: Principal | null): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    completeTask(taskId: bigint): Promise<void>;
    deleteTask(taskId: bigint): Promise<void>;
    getAllRegistrations(): Promise<Array<UserRegistration>>;
    getAllTasks(): Promise<Array<Task>>;
    getAllUsers(): Promise<Array<TasksMetadata>>;
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
    updateTasks(taskUpdates: Array<TaskUpdate>): Promise<void>;
}
