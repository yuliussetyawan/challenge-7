import { useEffect, useState } from "react";
import {
  ClockIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Sidenav from "../components/Sidenav";
import Notification from "../components/Notification";
import { format, parseISO } from "date-fns";

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

interface UserResponse {
  id: number;
  username: string;
  email: string;
  profile_picture_file?: string;
  password: string;
  role?: string;
}

const cars_api_base_url = "http://localhost:3001";

export default function Home() {
  const [cars, setCars] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filteredSize, setFilteredSize] = useState("All"); // Default to show all sizes

  const filterBySize = (size: string) => {
    setFilteredSize(size);
  };

  // Use the filteredSize state to display only the cards that match the selected size
  const filteredCars = cars.filter((car: CarResponse) => {
    if (filteredSize === "All") {
      return true; // Show all cards if "All" is selected
    }
    return car.car_size === filteredSize;
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    //akan di running pertama kali saat halaman di load
    const fetchCars = async () => {
      const response = await fetch(cars_api_base_url + "/api/cars");
      const responseJSON = await response.json();

      console.log("response", responseJSON);
      setCars(responseJSON.data.cars);
    };

    const checkIsLoggedIn = () => {
      const accessToken = localStorage.getItem("access_token");

      if (accessToken) setIsLoggedIn(true);
      else setIsLoggedIn(false);
    };

    fetchCars();
    checkIsLoggedIn();
  }, []);

  const deleteCar = async (carId: any) => {
    try {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        // Handle the case when the user is not logged in
        console.error("User not logged in");
        return;
      }
      setCarToDelete(carId);
      setShowNotification(true);
    } catch (error: any) {
      console.error("Error deleting car:", error.message);
    }
  };
  const handleConfirmation = async (confirmed: boolean) => {
    setShowNotification(false);

    if (confirmed) {
      try {
        const accessToken = localStorage.getItem("access_token");

        if (!accessToken) {
          console.error("User not logged in");
          return;
        }
        const response = await fetch(
          cars_api_base_url + "/api/cars/" + carToDelete,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          // Update the state to reflect the changes after successful deletion
          setCars((prevCars) =>
            prevCars.filter((car: CarResponse) => car.id !== carToDelete)
          );
        } else {
          // Handle errors if the deletion fails
          console.error("Failed to delete car:", response.statusText);
        }
      } catch (error: any) {
        console.error("Error deleting car:", error.message);
      }
    }
  };

  console.log("car length :", cars.length);
  const logoutHandler = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("email");
    localStorage.removeItem("profile");

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
            <p className=" text-md">
              <strong>Car {">"} </strong>List Car
            </p>
            <div className="flex items-center justify-between ">
              <p className="font-bold text-xl">List car</p>
              <Link to="/create-car">
                <button className="flex py-2 px-3 font-bold text-sm items-center gap-x-3 text-white rounded-sm bg-blue-800">
                  <PlusIcon className="h-[18px] w-[18px] stroke-2 text-white " />{" "}
                  Add New Car
                </button>
              </Link>
            </div>
            <div className="flex gap-x-4">
              {["All", "Small", "Medium", "Large"].map((size) => (
                <button
                  key={size}
                  onClick={() => filterBySize(size)}
                  className={` border-2 border-blue-800 font-bold text-blue-800 py-2 px-3 rounded-sm hover:text-white hover:bg-blue-800 ${
                    size === filteredSize
                      ? "text-white bg-blue-800"
                      : " bg-indigo-200"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            <div
              className={`card-container mt-5  flex gap-y-4 gap-x-6 flex-wrap ${
                isSidebarOpen ? "justify-start" : "justify-start "
              }`}
            >
              {!filteredCars.length /*jika carsnya tidak ada maka */ && (
                /*akan menjalankan "data kosong" */ <div className=" min-h-screen w-full ">
                  <div className="w-fit h-fit py-3 px-4 shadow bg-white rounded-md">
                    <h1 className="medium-header">Empty Cars Data </h1>
                  </div>
                </div>
              )}

              {filteredCars.map((car: CarResponse) => (
                <div
                  key={car.id}
                  className="card flex flex-col gap-4  shadow bg-white border-0  text-sm p-6  rounded-xl  w-[351px] "
                >
                  <img
                    className="h-[190px] w-full object-cover "
                    src={car.car_img}
                  />
                  <div className="card-body flex flex-col gap-2 ">
                    <p className="card-title font-semibold ">{car.car_name}</p>
                    <p className="font-semibold">
                      Rp {car.car_rent_price} / hari
                    </p>
                    <p className="font-normal">Car size : {car.car_size}</p>

                    {car.created_by.id && (
                      <div>
                        <h3 className="font-normal">created_by</h3>
                        <ul className="pl-4">
                          <li className="font-normal">
                            id : {car.created_by.id}
                          </li>
                          <li className="font-normal">
                            username : {car.created_by.username}
                          </li>
                          <li className="font-normal">
                            email : {car.created_by.email}
                          </li>
                        </ul>
                      </div>
                    )}
                    {car.updated_by.id && (
                      <div>
                        <h3 className="font-normal">updated_by</h3>
                        <ul className="pl-4">
                          <li className="font-normal">
                            id : {car.updated_by.id}
                          </li>
                          <li className="font-normal">
                            username : {car.updated_by.username}
                          </li>
                          <li className="font-normal">
                            email : {car.updated_by.email}
                          </li>
                        </ul>
                      </div>
                    )}
                    {car.deleted_by.id && (
                      <div>
                        <h3 className="font-normal">deleted_by</h3>
                        <ul className="pl-4">
                          <li className="font-normal">
                            id : {car.deleted_by.id}
                          </li>
                          <li className="font-normal">
                            username : {car.deleted_by.username}
                          </li>
                          <li className="font-normal">
                            email : {car.deleted_by.email}
                          </li>
                        </ul>
                      </div>
                    )}

                    {car.created_at && (
                      <div className="flex gap-2">
                        <ClockIcon className="h-5 w-5   " />

                        <p className="font-light text-sm">
                          create_at{" "}
                          {format(
                            parseISO(`${car.created_at}`),
                            "dd/MM/yyyy HH:mm:ss a"
                          )}
                        </p>
                      </div>
                    )}
                    {car.updated_at && (
                      <div className="flex gap-2">
                        <ClockIcon className="h-5 w-5   " />
                        <p className="font-light text-sm">
                          updated_at{" "}
                          {format(
                            parseISO(`${car.updated_at}`),
                            "dd/MM/yyyy HH:mm:ss a"
                          )}
                        </p>
                      </div>
                    )}
                    {car.delete_at && (
                      <div className="flex gap-2">
                        <ClockIcon className="h-5 w-5   " />
                        <p className="font-light text-sm">
                          delete_at {car.delete_at?.toString()}
                        </p>
                      </div>
                    )}

                    <div className="card-button mt-4 flex gap-2">
                      <button
                        className="inline-flex bg-transparent hover:bg-red-500 text-red-700 font-bold hover:text-white border border-red-500 hover:border-transparent rounded  w-[143.5px] h-12 items-center justify-center"
                        onClick={() => deleteCar(car.id)}
                      >
                        <TrashIcon className="h-5 w-5 " />
                        Delete
                      </button>
                      <button className="flex bg-green-500 hover:bg-green-700 items-center justify-center text-white  rounded w-[143.5px] h-12 ">
                        <Link
                          to={`/update-car/${car.id}`}
                          className=" flex font-bold  "
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                          Edit
                        </Link>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
