import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Task = {
    id : Nat;
    title : Text;
    description : Text;
    reward : Int;
    status : TaskStatus;
  };

  public type TaskStatus = { #open; #inProgress; #completed };
  public type TaskCompletion = { taskId : Nat; timestamp : Time.Time };

  public type UserProfile = {
    username : Text;
    whatsappNumber : Text;
    groupNumber : Text;
    email : Text;
    passwordHash : Text;
    referralCode : Text;
    isApproved : Bool;
    referrals : [Principal];
    tasks : [Task];
    completedTasks : [TaskCompletion];
    totalEarnings : Int;
  };

  var nextTaskId = 1;

  let userProfiles = Map.empty<Principal, UserProfile>();
  let tasks = Map.empty<Nat, Task>();
  let taskHistory = Map.empty<Principal, List.List<(Nat, Time.Time)>>();
  let points = Map.empty<Principal, Int>();

  public type TaskUpdate = {
    taskId : Nat;
    updatedTitle : Text;
    updatedTask : Task;
  };

  module Task {
    public func compareByReward(t1 : Task, t2 : Task) : Order.Order {
      Int.compare(t1.reward, t2.reward);
    };
  };

  // Required profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // User registration - accessible to guests (anonymous principals)
  public shared ({ caller }) func registerUser(profile : UserProfile) : async () {
    // Only guests (non-registered users) can register
    if (userProfiles.containsKey(caller)) {
      Runtime.trap("User already exists");
    };
    // New users start as unapproved and get user role
    let newProfile = {
      profile with isApproved = false;
    };
    userProfiles.add(caller, newProfile);
    // Assign user role after registration
    AccessControl.assignRole(accessControlState, caller, caller, #user);
  };

  // Admin function to approve users
  public shared ({ caller }) func approveUser(user : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can approve users");
    };
    let userProfile = switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?profile) { profile };
    };
    let approvedProfile = {
      userProfile with isApproved = true;
    };
    userProfiles.add(user, approvedProfile);
  };

  // Admin function to get all users
  public query ({ caller }) func getAllUsers() : async [UserProfile] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    userProfiles.values().toArray();
  };

  public query ({ caller }) func getTasksByRewardForCaller() : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };
    let userProfile = switch (userProfiles.get(caller)) {
      case (?profile) { 
        if (not profile.isApproved) {
          Runtime.trap("Unauthorized: Account not approved");
        };
        profile 
      };
      case (null) { Runtime.trap("User does not exist") };
    };
    userProfile.tasks.sort(Task.compareByReward);
  };

  public query ({ caller }) func getTaskById(taskId : Nat) : async ?Task {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };
    tasks.get(taskId);
  };

  public query ({ caller }) func getTaskStats() : async {
    totalTasks : Nat;
    openTasks : Nat;
    completedTasks : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view task stats");
    };
    let allTasks = tasks.values().toArray();
    let openCount = allTasks.filter(func(task) { task.status == #open }).size();
    let completedCount = allTasks.filter(func(task) { task.status == #completed }).size();
    {
      totalTasks = tasks.size();
      openTasks = openCount;
      completedTasks = completedCount;
    };
  };

  public shared ({ caller }) func addTask(task : Task) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add tasks");
    };
    tasks.add(task.id, task);
  };

  public shared ({ caller }) func updateTasks(taskUpdates : [TaskUpdate]) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update tasks");
    };

    for (update in taskUpdates.values()) {
      tasks.add(update.taskId, update.updatedTask);
    };
  };

  public shared ({ caller }) func deleteTask(taskId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete tasks");
    };
    tasks.remove(taskId);
  };

  public query ({ caller }) func getAllTasks() : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };
    tasks.values().toArray();
  };

  public query ({ caller }) func getDailyTasks(user : Principal) : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };
    // Users can only view their own tasks unless they are admin
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own tasks");
    };
    switch (userProfiles.get(user)) {
      case (null) { [] };
      case (?profile) { 
        if (not profile.isApproved and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Account not approved");
        };
        profile.tasks 
      };
    };
  };

  public shared ({ caller }) func completeTask(taskId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete tasks");
    };

    let userProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?profile) { 
        if (not profile.isApproved) {
          Runtime.trap("Unauthorized: Account not approved");
        };
        profile 
      };
    };

    let task = switch (tasks.get(taskId)) {
      case (null) { Runtime.trap("Task does not exist") };
      case (?task) { task };
    };

    if (existsInternal(userProfile.completedTasks, taskId)) {
      Runtime.trap("Task already completed");
    };

    let updatedTasks = userProfile.tasks.map(func(t) { if (t.id == taskId) { { t with status = #completed } } else { t } });
    let completionRecord : TaskCompletion = { taskId; timestamp = Time.now() };

    let updatedProfile : UserProfile = {
      userProfile with
      tasks = updatedTasks;
      completedTasks = userProfile.completedTasks.concat([completionRecord]);
      totalEarnings = userProfile.totalEarnings + task.reward;
    };

    userProfiles.add(caller, updatedProfile);

    let userPoints = switch (points.get(caller)) {
      case (null) { 0 };
      case (?p) { p };
    };
    points.add(caller, userPoints + 10);

    let history = switch (taskHistory.get(caller)) {
      case (null) { List.empty<(Nat, Time.Time)>() };
      case (?h) { h };
    };
    history.add((taskId, Time.now()));
    taskHistory.add(caller, history);

    let newPoints = switch (points.get(caller)) {
      case (null) { 10 };
      case (?p) { p + 10 };
    };
    points.add(caller, newPoints);
  };

  public query ({ caller }) func getCompletedTasks(user : Principal) : async [Nat] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view completed tasks");
    };
    // Users can only view their own completed tasks unless they are admin
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own completed tasks");
    };
    let historyList = switch (taskHistory.get(user)) {
      case (null) { List.empty<(Nat, Time.Time)>() };
      case (?h) { h };
    };
    historyList.toArray().map(func((taskId, _)) { taskId });
  };

  public query ({ caller }) func getUserPoints(user : Principal) : async Int {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view points");
    };
    // Users can only view their own points unless they are admin
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own points");
    };
    switch (points.get(user)) {
      case (null) { 0 };
      case (?p) { p };
    };
  };

  public query ({ caller }) func getWeeklyTaskStats(user : Principal) : async {
    completedTasks : Nat;
    totalPoints : Int;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view task stats");
    };
    // Users can only view their own stats unless they are admin
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own stats");
    };
    let historyList = switch (taskHistory.get(user)) {
      case (null) { List.empty<(Nat, Time.Time)>() };
      case (?h) { h };
    };
    let completedTasks = historyList.size();
    let totalPoints = switch (points.get(user)) {
      case (null) { 0 };
      case (?p) { p };
    };
    {
      completedTasks;
      totalPoints;
    };
  };

  // Legacy admin login - accessible to anyone (guests) for local authentication
  // This allows admin panel access without Internet Identity
  public shared ({ caller }) func legacyAdminLogin(username : Text, password : Text) : async Bool {
    if (username == "admin" and password == "habibur123") {
      true;
    } else {
      Runtime.trap("Invalid legacy admin credentials");
    };
  };

  public shared ({ caller }) func login(username : Text, password : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: User not registered");
    };
    switch (userProfiles.get(caller)) {
      case (?profile) {
        if (not profile.isApproved) {
          Runtime.trap("Unauthorized: Account not approved");
        };
        if (profile.username == username and profile.passwordHash == password) {
          true;
        } else {
          Runtime.trap("Invalid username or password");
        };
      };
      case (null) { Runtime.trap("User does not exist") };
    };
  };

  public shared ({ caller }) func logout() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: No active session");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("No active session") };
      case (?_) { () };
    };
  };

  public query ({ caller }) func isLoggedIn() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #user);
  };

  // Referral functions with proper authorization
  public query ({ caller }) func getReferralCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view referral count");
    };
    switch (userProfiles.get(caller)) {
      case (null) { 0 };
      case (?profile) { profile.referrals.size() };
    };
  };

  public query ({ caller }) func getReferralEarnings() : async Int {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view referral earnings");
    };
    switch (userProfiles.get(caller)) {
      case (null) { 0 };
      case (?profile) { 
        // Calculate earnings based on referrals (example: 10 points per referral)
        profile.referrals.size() * 10 
      };
    };
  };

  // Internal helper function
  private func existsInternal(tasks : [TaskCompletion], taskId : Nat) : Bool {
    tasks.any(func(completion) { completion.taskId == taskId });
  };

  // Public version for external calls - accessible to anyone
  public query ({ caller }) func exists(tasks : [TaskCompletion], taskId : Nat) : async Bool {
    tasks.any(func(completion) { completion.taskId == taskId });
  };
};
