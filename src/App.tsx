import { useState } from "react";
import Post from "./components/Post";
import Account from "./components/Account";
import { getAllUsers, updateUser } from "./apis/UserCRUD";
import { User } from "./interfaces/User";

enum Menu {
  Account = "Account",
  Post = "Post",
}

const App = () => {
  const [menu, setMenu] = useState<Menu>(Menu.Account);
  const [username, setUsername] = useState<string>("");
  const [userData, setUserData] = useState<{
    money: number;
    increment: number;
    superIncrement: number;
    unlockMoneyRain: boolean;
  }>({
    money: 0,
    increment: 1,
    superIncrement: 0,
    unlockMoneyRain: false,
  });

  const handleSuccessfulLogin = async (usernameLogin: string) => {
    setUsername(usernameLogin);

    console.log("User logging in:", usernameLogin); // for debugging purpose

    try {
      const response = await getAllUsers(); // Fetch all users
      const usersList: User[] = response.data.users;

      console.log("All users:", usersList); // for debugging purpose

      let foundUser: User | undefined; // Variable to store the found user

      // Use a for loop to find the user
      for (let i = 0; i < usersList.length; i++) {
        const user = usersList[i]; // Access the user directly
        if (user.username === usernameLogin) {
          foundUser = user; // Store the found user
          break; // Exit loop once user is found
        }
      }

      // If the user is found, update state with their stats
      if (foundUser) {
        setUsername(foundUser.username);
        setUserData({
          money: foundUser.money,
          increment: foundUser.increment,
          superIncrement: foundUser.superIncrement,
          unlockMoneyRain: foundUser.unlockMoneyRain,
        });
        console.log("User stats at login:", userData); // for debugging purpose
      }
    } catch (error) {
      console.error("Error fetching users:", error); // for debugging purpose
    }

    setMenu(Menu.Post);
  };

  const handleUserLogout = async () => {
    try {
      // Save user data before logging out
      await updateUser(
        username,
        userData.money,
        userData.increment,
        userData.superIncrement,
        userData.unlockMoneyRain
      );
    } catch (error) {
      console.error("Error saving user data:", error); // for debugging purpose
    }

    // Reset user data and return to Account menu
    setUsername("");
    setUserData({
      money: 0,
      increment: 1,
      superIncrement: 0,
      unlockMoneyRain: false,
    });

    setMenu(Menu.Account);
  };

  const updateUserData = (
    newMoney: number,
    newIncrement: number,
    newSuperIncrement: number,
    newUnlockMoneyRain: boolean
  ) => {
    setUserData({
      money: newMoney,
      increment: newIncrement,
      superIncrement: newSuperIncrement,
      unlockMoneyRain: newUnlockMoneyRain,
    });
  };

  return (
    <>
      {menu === Menu.Post ? (
        <Post
          username={username}
          money={userData.money}
          increment={userData.increment}
          superIncrement={userData.superIncrement}
          unlockMoneyRain={userData.unlockMoneyRain}
          onLogout={handleUserLogout}
          onUpdateUserData={updateUserData}
        />
      ) : (
        <Account onLoginSuccess={handleSuccessfulLogin} />
      )}
    </>
  );
};

export default App;
