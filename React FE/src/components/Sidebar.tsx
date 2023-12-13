import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const location = useLocation();
  return (
    <div
      className={`sidebar w-[290px] flex flex-col gap-y-2 ${
        isOpen ? "" : "hidden"
      }`}
    >
      {location.pathname == "/dashboard" ? (
        <>
          <Link
            to={"/dashboard"}
            className=" h-10 w-full hover:bg-indigo-200 mt-5 font-bold text-base py-3 pl-6"
          >
            Dashboard
          </Link>
        </>
      ) : (
        <>
          <Link
            to={"/home"}
            className=" h-10 w-full hover:bg-indigo-200 mt-5 font-bold text-sm py-3 pl-6"
          >
            CARS
          </Link>
        </>
      )}
    </div>
  );
}

export default Sidebar;
