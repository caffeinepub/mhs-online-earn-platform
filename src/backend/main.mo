import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Int "mo:core/Int";
import List "mo:core/List";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
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

  public type TaskCompletion = {
    taskId : Nat;
    timestamp : Time.Time;
  };

  public type UserRegistration = {
    username : Text;
    whatsappNumber : Text;
    groupNumber : Text;
    email : Text;
    passwordHash : Text;
    referralCode : Text;
    isApproved : Bool;
    principal : ?Principal;
    balance : Int;
  };

  public type TasksMetadata = {
    username : Text;
    whatsappNumber : Text;
    groupNumber : Text;
    email : Text;
    passwordHash : Text;
    referralCode : Text;
    principal : Text;
    isApproved : Bool;
    referrals : [Principal];
    tasks : [Task];
    completedTasks : [TaskCompletion];
    totalEarnings : Int;
  };

  type AuthRequest = {
    username : Text;
    password : Text;
  };

  type AuthResponse = { success : Bool; errorMessage : Text };

  var nextTaskId = 1;

  let tasksData = Map.empty<Principal, TasksMetadata>();
  let tasks = Map.empty<Nat, Task>();
  let taskHistory = Map.empty<Principal, List.List<(Nat, Time.Time)>>();
  let points = Map.empty<Principal, Int>();
  let users = Map.empty<Text, UserRegistration>();

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

  public type WithdrawRequest = {
    id : Nat;
    submitTime : Time.Time;
    phoneNumber : Text;
    amount : Nat;
    paymentMethod : Text;
    status : Text;
    userPrincipal : Principal;
  };

  let withdrawRequests = Map.empty<Principal, List.List<WithdrawRequest>>();
  var nextWithdrawRequestId = 1;

  public shared ({ caller }) func submitWithdrawRequest(phoneNumber : Text, amount : Nat, paymentMethod : Text) : async WithdrawRequest {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit withdraw requests");
    };

    let newRequest : WithdrawRequest = {
      id = nextWithdrawRequestId;
      submitTime = Time.now();
      phoneNumber;
      amount;
      paymentMethod;
      status = "pending";
      userPrincipal = caller;
    };

    switch (withdrawRequests.get(caller)) {
      case (null) {
        let newList = List.empty<WithdrawRequest>();
        newList.add(newRequest);
        withdrawRequests.add(caller, newList);
      };
      case (?existingList) {
        existingList.add(newRequest);
      };
    };

    nextWithdrawRequestId += 1;
    newRequest;
  };

  public query ({ caller }) func getUserWithdrawHistory() : async [WithdrawRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view withdraw history");
    };

    switch (withdrawRequests.get(caller)) {
      case (null) { [] };
      case (?requestsList) { requestsList.reverse().toArray() };
    };
  };

  public query ({ caller }) func getAllWithdrawRequests() : async [(Principal, [WithdrawRequest])] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all withdraw requests");
    };

    withdrawRequests.entries().map(func((principal, requestsList)) {
      (principal, requestsList.toArray());
    }).toArray();
  };

  public shared ({ caller }) func updateWithdrawRequestStatus(userPrincipal : Principal, requestId : Nat, newStatus : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update withdraw request status");
    };

    switch (withdrawRequests.get(userPrincipal)) {
      case (null) { Runtime.trap("No withdraw requests found for user") };
      case (?requestsList) {
        let updatedList = List.empty<WithdrawRequest>();
        for (request in requestsList.values()) {
          if (request.id == requestId) {
            updatedList.add({ request with status = newStatus });
          } else {
            updatedList.add(request);
          };
        };
        withdrawRequests.add(userPrincipal, updatedList);
      };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?TasksMetadata {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    tasksData.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?TasksMetadata {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    tasksData.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : TasksMetadata) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    tasksData.add(caller, profile);
  };

  public query ({ caller }) func getRegistration(_id : Text) : async ?UserRegistration {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view registrations");
    };
    users.get(_id);
  };

  public query ({ caller }) func getAllRegistrations() : async [UserRegistration] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all registrations");
    };
    users.values().toArray();
  };

  public shared ({ caller }) func addUserRegistration(
    id : Text,
    username : Text,
    whatsappNumber : Text,
    groupNumber : Text,
    email : Text,
    passwordHash : Text,
    referralCode : Text,
    approved : Bool,
    principal : ?Principal,
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add registrations");
    };

    if (users.containsKey(id)) {
      Runtime.trap("Registration already exists");
    };

    let newUserRegistration : UserRegistration = {
      username;
      whatsappNumber;
      groupNumber;
      email;
      passwordHash;
      referralCode;
      isApproved = approved;
      principal;
      balance = 0;
    };

    users.add(id, newUserRegistration);

    switch (principal) {
      case (?p) {
        if (approved) {
          AccessControl.assignRole(accessControlState, caller, p, #user);
        };
      };
      case (null) {};
    };
  };

  private func usernameExists(username : Text) : Bool {
    users.values().any(func(reg) { reg.username == username });
  };

  private func emailExists(email : Text) : Bool {
    users.values().any(func(reg) { reg.email == email });
  };

  public shared ({ caller }) func registerUser(profile : TasksMetadata) : async () {
    if (tasksData.containsKey(caller)) {
      Runtime.trap("User already registered with this principal");
    };

    if (usernameExists(profile.username)) {
      Runtime.trap("Username already exists");
    };

    if (emailExists(profile.email)) {
      Runtime.trap("Email already registered");
    };

    let registrationId = profile.username;

    let newUserRegistration : UserRegistration = {
      username = profile.username;
      whatsappNumber = profile.whatsappNumber;
      groupNumber = profile.groupNumber;
      email = profile.email;
      passwordHash = profile.passwordHash;
      referralCode = profile.referralCode;
      isApproved = true;
      principal = ?caller;
      balance = 0;
    };

    users.add(registrationId, newUserRegistration);

    let newProfile = {
      profile with
      isApproved = true;
      principal = caller.toText();
    };

    tasksData.add(caller, newProfile);
  };

  public shared query func authenticate(credentials : AuthRequest) : async AuthResponse {
    switch (users.get(credentials.username)) {
      case (null) {
        { success = false; errorMessage = "User not found" };
      };
      case (?user) {
        if (not user.isApproved) {
          { success = false; errorMessage = "Account not approved" };
        } else if (user.passwordHash == credentials.password) {
          { success = true; errorMessage = "" };
        } else {
          { success = false; errorMessage = "Invalid password" };
        };
      };
    };
  };

  public query ({ caller }) func getAllUsers() : async [TasksMetadata] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    tasksData.values().toArray();
  };

  public query ({ caller }) func getTasksByRewardForCaller() : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };
    let userProfile = switch (tasksData.get(caller)) {
      case (?profile) {
        if (not profile.isApproved) {
          Runtime.trap("Unauthorized: Account not approved");
        };
        profile;
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
    {
      totalTasks = tasks.size();
      openTasks = allTasks.filter(func(task) { task.status == #open }).size();
      completedTasks = allTasks.filter(func(task) { task.status == #completed }).size();
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
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own tasks");
    };
    switch (tasksData.get(user)) {
      case (null) { [] };
      case (?profile) {
        if (not profile.isApproved and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Account not approved");
        };
        profile.tasks;
      };
    };
  };

  public shared ({ caller }) func completeTask(taskId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete tasks");
    };

    let userProfile = switch (tasksData.get(caller)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?profile) {
        if (not profile.isApproved) {
          Runtime.trap("Unauthorized: Account not approved");
        };
        profile;
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

    let updatedProfile : TasksMetadata = {
      userProfile with
      tasks = updatedTasks;
      completedTasks = userProfile.completedTasks.concat([completionRecord]);
      totalEarnings = userProfile.totalEarnings + task.reward;
    };

    tasksData.add(caller, updatedProfile);

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

  public shared ({ caller }) func login(username : Text, password : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: User not registered or not approved");
    };
    switch (tasksData.get(caller)) {
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
    switch (tasksData.get(caller)) {
      case (null) { Runtime.trap("No active session") };
      case (?_) { () };
    };
  };

  public query ({ caller }) func isLoggedIn() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #user);
  };

  public query ({ caller }) func getReferralCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view referral count");
    };
    switch (tasksData.get(caller)) {
      case (null) { 0 };
      case (?profile) { profile.referrals.size() };
    };
  };

  public query ({ caller }) func getReferralEarnings() : async Int {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view referral earnings");
    };
    switch (tasksData.get(caller)) {
      case (null) { 0 };
      case (?profile) {
        profile.referrals.size() * 10;
      };
    };
  };

  public shared ({ caller }) func approveUser(username : Text, approved : Bool) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can approve users");
    };

    switch (users.get(username)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) {
        let updatedUser = { user with isApproved = approved };
        users.add(username, updatedUser);

        switch (user.principal) {
          case (?p) {
            switch (tasksData.get(p)) {
              case (?profile) {
                let updatedProfile = { profile with isApproved = approved };
                tasksData.add(p, updatedProfile);
                if (approved) {
                  AccessControl.assignRole(accessControlState, caller, p, #user);
                };
              };
              case (null) {};
            };
          };
          case (null) {};
        };
      };
    };
  };

  public query ({ caller }) func getBalance() : async Int {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view balance");
    };

    switch (users.get(caller.toText())) {
      case (null) { Runtime.trap("User not found") };
      case (?user) { user.balance };
    };
  };

  public shared ({ caller }) func addBalance(username : Text, amount : Int) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add balance");
    };

    switch (users.get(username)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) {
        let newBalance = user.balance + amount;
        users.add(username, { user with balance = newBalance });
      };
    };
  };

  private func existsInternal(tasks : [TaskCompletion], taskId : Nat) : Bool {
    tasks.any(func(completion) { completion.taskId == taskId });
  };
};
