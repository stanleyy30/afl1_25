import axios from "axios";

const getAllUsers = async () => {
  return axios.get("http://localhost:3000/users");
};

const createUser = async (username: string) => {
  return axios.post("http://localhost:3000/users", {
    username,
  });
};

const updateUser = async (
  username: string,
  money: number,
  increment: number,
  superIncrement: number,
  unlockMoneyRain: boolean
): Promise<void> => {
  try {
    return await axios.put(`http://localhost:3000/users`, {
      username,
      money,
      increment,
      superIncrement,
      unlockMoneyRain,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    throw error; // optional, if you want to propagate the error
  }
};

const deleteUser = async (id: number) => {
  return axios.delete(`http://localhost:3000/users`, {
    data: {
      id,
    },
  });
};

export { getAllUsers, createUser, updateUser, deleteUser };
