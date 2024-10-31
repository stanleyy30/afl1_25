import Money from "../assets/icons/money-management.png";
import { useState, useEffect } from "react";
import { updateUser } from "../apis/UserCRUD";

interface PostProperties {
  username: string;
  money: number;
  increment: number;
  superIncrement: number;
  unlockMoneyRain: boolean;
  onLogout: () => void;
  onUpdateUserData: (
    newMoney: number,
    newIncrement: number,
    newSuperIncrement: number,
    newUnlockMoneyRain: boolean
  ) => void;
}

const Post = ({
  username,
  money,
  increment,
  superIncrement,
  unlockMoneyRain,
  onLogout,
  onUpdateUserData,
}: PostProperties) => {
  const [currentMoney, setCurrentMoney] = useState(money);
  const [currentIncrement, setCurrentIncrement] = useState(increment);
  const [originalIncrement, setOriginalIncrement] = useState(currentIncrement);
  const [temporaryIncrement, setTemporaryIncrement] =
    useState(currentIncrement);
  const [shopItems, setShopItems] = useState([
    {
      id: 1,
      name: "Upgrade",
      cost: 100,
      unlocked: true,
      onPurchase: () => {
        const newIncrement = currentIncrement + 1;
        setCurrentIncrement(newIncrement);
        setOriginalIncrement(newIncrement);
      },
    },
    {
      id: 2,
      name: "Super Upgrade",
      cost: 2000,
      unlocked: true,
      onPurchase: () => {
        const newIncrement = currentIncrement * 10;
        setCurrentIncrement(newIncrement);
      },
    },
  ]);

  const [, setUpgradeCount] = useState(0);
  const [isMoneyRainActive, setIsMoneyRainActive] = useState(false);
  const [rainDuration, setRainDuration] = useState(0);

  const handleClick = () => {
    const currentIncrementValue = isMoneyRainActive
      ? temporaryIncrement
      : currentIncrement;
    setCurrentMoney((prevMoney) => prevMoney + currentIncrementValue);
  };

  const handlePurchase = (itemId: number) => {
    if (isMoneyRainActive) return;

    const item = shopItems.find((item) => item.id === itemId);
    if (item && currentMoney >= item.cost) {
      setCurrentMoney((prev) => prev - item.cost);

      if (itemId === 1) {
        const newIncrement = currentIncrement + 1;
        setCurrentIncrement(newIncrement);
        setOriginalIncrement(newIncrement);

        setUpgradeCount((prevCount) => {
          const newCount = prevCount + 1;
          if (newCount === 3) {
            activateMoneyRain(newIncrement);
            return 0;
          }
          return newCount;
        });
      } else {
        item.onPurchase();
      }

      setShopItems((prevItems) =>
        prevItems.map((prevItem) => {
          if (prevItem.id === itemId) {
            return {
              ...prevItem,
              cost: prevItem.cost * (itemId === 1 ? 2 : 100),
            };
          }
          return prevItem;
        })
      );
    }
  };

  const activateMoneyRain = (currentIncrement: number) => {
    setIsMoneyRainActive(true);
    setTemporaryIncrement(currentIncrement * 2);
    setRainDuration(60);
  };

  const deactivateMoneyRain = () => {
    setIsMoneyRainActive(false);
    setTemporaryIncrement(originalIncrement);
    setRainDuration(0);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (isMoneyRainActive && rainDuration > 0) {
      timer = setInterval(() => {
        setRainDuration((prev) => {
          if (prev <= 1) {
            deactivateMoneyRain();
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (rainDuration === 0 && isMoneyRainActive) {
      deactivateMoneyRain();
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isMoneyRainActive, rainDuration, originalIncrement]);

  useEffect(() => {
    setCurrentMoney(money);
    setCurrentIncrement(increment);
    setOriginalIncrement(increment);
    setTemporaryIncrement(increment);
  }, [money, increment]);

  useEffect(() => {
    updateUser(
      username,
      currentMoney,
      currentIncrement,
      superIncrement,
      unlockMoneyRain
    )
      .then(() =>
        onUpdateUserData(
          currentMoney,
          currentIncrement,
          superIncrement,
          unlockMoneyRain
        )
      )
      .catch(console.error);
  }, [
    currentMoney,
    currentIncrement,
    superIncrement,
    unlockMoneyRain,
    username,
    onUpdateUserData,
  ]);

  const handleLogout = () => {
    if (isMoneyRainActive) {
      deactivateMoneyRain();
    }
    onLogout();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 relative">
      <div className="absolute top-0 right-0 m-4">
        <div className="bg-blue-600 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Shop</h2>
          {isMoneyRainActive ? (
            <p className="text-yellow-500 font-bold mb-2">
              Money Rain is active! Double income for 1 minute! Shop is frozen.
            </p>
          ) : (
            <p className="text-red-500 font-bold mb-2">
              Money Rain is inactive.
            </p>
          )}
          <ul className="space-y-2">
            {shopItems.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center bg-blue-500 p-2 rounded mb-1"
              >
                <span>
                  {item.name} (Cost: {item.cost})
                </span>
                <button
                  onClick={() => handlePurchase(item.id)}
                  className={`px-2 py-1 ml-2 text-white font-bold rounded ${
                    !isMoneyRainActive && currentMoney >= item.cost
                      ? "bg-green-500 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={isMoneyRainActive || currentMoney < item.cost}
                >
                  Buy
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-4">Money Clicker Game!</h1>
      <p className="text-2xl font-semibold mb-4">Money: ${currentMoney}</p>
      <p className="text-xl font-semibold mb-4">
        Current Income: +
        {isMoneyRainActive ? temporaryIncrement : currentIncrement}
      </p>
      <p className="text-xl font-semibold mb-4">Click the Money to get Money</p>
      <img
        src={Money}
        alt="Money"
        className="w-64 h-64 cursor-pointer transition transform hover:scale-105"
        onClick={handleClick}
      />

      <button
        onClick={handleLogout}
        className="absolute bottom-4 right-4 px-4 py-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Post;
