import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Sidenav from "../components/Sidenav";
import Notification from "../components/Notification";
import moment from "moment";

const cars_api: string = "http://localhost:3001";

interface UserResponse {
  id: number;
  name: string;
  email: string;
  profile_picture_file?: string;
  password: string;
  role?: string;
}

interface CarResponse {
  id: number;
  car_name: string;
  car_rent_price: number;
  car_categories: string;
  car_size: string;
  car_img?: string;
  created_by: UserResponse;
  updated_by: UserResponse;
  deleted_by: UserResponse;
  created_at?: Date;
  updated_at?: Date;
  delete_at?: Date;
}

export default function DashBoardForm() {
  const [cars, setCars] = useState([]);
  const [carDelete, setDeleteCar] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotification, setShowNotification] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // load first
  useEffect(() => {
    const fetchCars = async () => {
      const response = await fetch(cars_api + "/api/cars");
      const resonseJson = await response.json();

      setCars(resonseJson.data.cars);
    };


    const checkIsLoggedIn = () => {
      const accessToken = localStorage.getItem("access_token");

      if (accessToken) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };
    fetchCars();
    checkIsLoggedIn();
  }, []);


  const handleConfirmation = async (confirmed: boolean) => {
    setShowNotification(false);

    if (confirmed) {
      try {
        const accessToken = localStorage.getItem("access_token");

        if (!accessToken) {
          console.error("User not logged in");
          return;
        }
        const response = await fetch(cars_api + "/api/cars/" + carDelete, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          setCars((prevCars) =>
            prevCars.filter((car: CarResponse) => car.id !== carDelete)
          );
        } else {
          console.log("Delete car failed: ", response.statusText);
        }
      } catch (error: any) {
        console.log("There is a problem when deleting car: ", error.message);
      }
    }
  };


  const deleteCar = async (carId: any) => {
    try {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        console.log("Please login first!");
        return;
      }
      setDeleteCar(carId);
      setShowNotification(true);
    } catch (error: any) {
      console.error("Error deleting car:", error.message);
    }
  };


  const logoutHandler = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
  };

  return (
    <div className="flex  min-h-fit">
      <Sidenav />
      <div className={`flex flex-col w-full  ${isSidebarOpen}`}>
        <Navbar
          onSidebarToggle={toggleSidebar}
          isLoggedIn={isLoggedIn}
          onLogout={logoutHandler}
        />

        <div className="main-content flex h-full  ">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="content grid w-full  bg-gray-100 px-6 pt-9 ">
            <div className="grid">
              <div className=" flex py-2 align-middle  max-w-fit pl-6">
                <div className="shadow overflow-hidden h-fit border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Category
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          price
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          CreateAt
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          UpdateAt
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cars.map((car: CarResponse) => (
                        <tr key={car.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-left">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {car.car_name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-left">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {car.car_size}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-left">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {car.car_rent_price}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-left">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {moment(car.created_at).format(
                                    "DD/MM/YYYY HH:mm:ss a"
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-left">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {moment(car.updated_at).format(
                                    "DD/MM/YYYY HH:mm:ss a"
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                            <button className="text-green-500 hover:text-green-700">
                              <Link
                                to={`/update-car/${car.id}`}
                                className="inline-flex font-bold justify-center"
                              >
                                Edit
                              </Link>
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() => deleteCar(car.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showNotification && (
          <Notification
            onConfirm={() => handleConfirmation(true)}
            onCancel={() => handleConfirmation(false)}
          />
        )}
      </div>
    </div>
  );
}
