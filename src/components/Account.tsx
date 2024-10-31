import { useEffect, useState } from "react";
import { User } from "../interfaces/User";
import { createUser, getAllUsers, deleteUser } from "../apis/UserCRUD";

interface AccountProperties {
  onLoginSuccess: (username: string) => void;
}

const Account = ({ onLoginSuccess }: AccountProperties) => {
  const [userList, setUserList] = useState<User[]>([]);
  const [isCreateUserVisible, setIsCreateUserVisible] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [usernameForLogin, setUsernameForLogin] = useState("");

  // Fetch all users from the API
  const fetchAllUsers = async () => {
    try {
      const response = await getAllUsers();
      if (response.status === 200) {
        setUserList(response.data.users);
      }
    } catch (error) {
      console.error("Failed to load users:", error); //for debugging purpose
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Function to handle the creation of a new user
  const createUserHandler = async () => {
    try {
      await createUser(newUsername);
      fetchAllUsers(); // Refresh the list of users after creation
      setNewUsername(""); // Clear the input field
    } catch (error) {
      console.error("Error creating user:", error); //for debugging purpose
    }
  };

  // Function to handle user login
  const loginHandler = () => {
    const userFound = userList.find(
      (user) => user.username === usernameForLogin
    );
    if (userFound) {
      onLoginSuccess(userFound.username); // Login successful, invoke callback
    } else {
      alert("No user found with that username. Please try again.");
    }
  };

  // Function to delete a user
  const deleteUserHandler = async (id: number) => {
    try {
      await deleteUser(id); // API call to delete the user
      fetchAllUsers(); // Refresh the user list
      alert("User successfully deleted!");
    } catch (error) {
      console.error("Failed to delete user:", error); //for debugging purpose
    }
  };

  return (
    <div className="flex w-full h-screen">
      {/* User Management Section */}
      <div className="w-1/2 flex flex-col justify-center items-center mb-12">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-4">Active Users</h1>
          <button className="mb-6" onClick={() => setIsCreateUserVisible(true)}>
            <span className="bg-black text-white font-semibold py-1 px-6 rounded-md hover:bg-yellow-500 text-black">
              Add User
            </span>
          </button>

          {/* User Table */}
          <table className="table-auto border-collapse border border-black w-full">
            <thead>
              <tr>
                <th className="bg-black border-2 border-yellow-500 text-white px-4 py-4">
                  ID
                </th>
                <th className="bg-black border-2 border-yellow-500 text-white px-4 py-4">
                  Username
                </th>
                <th className="bg-black border-2 border-yellow-500 text-white px-4 py-4">
                  Money
                </th>
                <th className="bg-black border-2 border-yellow-500 text-white px-4 py-4">
                  Increment
                </th>
                <th className="bg-black border-2 border-yellow-500 text-white px-4 py-4">
                  Super Increment
                </th>
                <th className="bg-black border-2 border-yellow-500 text-white px-4 py-4">
                  Money Rain
                </th>
                <th className="bg-black border-2 border-yellow-500 text-white px-4 py-4">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {userList.map((user) => (
                <tr key={user.id}>
                  <td className="border border-black py-2">{user.id}</td>
                  <td className="border border-black py-2">{user.username}</td>
                  <td className="border border-black py-2">{user.money}</td>
                  <td className="border border-black py-2">{user.increment}</td>
                  <td className="border border-black py-2">
                    {user.superIncrement}
                  </td>
                  <td className="border border-black py-2">
                    {user.unlockMoneyRain ? "Unlocked" : "Locked"}
                  </td>
                  <td className="border border-black py-2">
                    <button
                      onClick={() => deleteUserHandler(user.id)}
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Form to Create a New User */}
        {isCreateUserVisible && (
          <div className="w-full max-w-md mt-8">
            <div className="bg-black text-white p-4 rounded-md flex items-center justify-between">
              <div className="flex-1">
                <label
                  htmlFor="newUserName"
                  className="block mb-2 font-semibold"
                >
                  New Username
                </label>
                <input
                  type="text"
                  id="newUserName"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full p-2 border border-yellow-500 bg-black text-white rounded"
                  placeholder="Enter username"
                />
              </div>
              <div className="ml-4 mt-8">
                <button
                  onClick={createUserHandler}
                  className="bg-yellow-500 text-black font-semibold py-2 px-6 rounded hover:bg-yellow-600"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Login Section */}
      <div className="w-1/2 flex justify-center items-center">
        <div className="flex flex-col max-w-md">
          <h1 className="font-bold text-2xl text-center mb-6">User Login</h1>
          <div className="bg-black text-white px-16 pt-8 pb-12 rounded-md">
            <label
              htmlFor="usernameForLogin"
              className="block mb-2 font-semibold"
            >
              Username
            </label>
            <input
              type="text"
              id="usernameForLogin"
              value={usernameForLogin}
              onChange={(e) => setUsernameForLogin(e.target.value)}
              className="w-full p-2 border border-yellow-500 bg-black text-white rounded px-16"
              placeholder="Enter your username"
            />
            <div className="flex justify-center">
              <button onClick={loginHandler} className="mt-6">
                <span className="bg-yellow-500 text-black font-semibold py-2 px-10 rounded-md hover:bg-yellow-600">
                  Log In
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;