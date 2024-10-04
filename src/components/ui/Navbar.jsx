import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { IoLogOut } from "react-icons/io5";

export const Navbar = () => {
  const { signout, user } = useAuth();

  return (
    <header className="bg-gray-800 py-5 px-10 flex items-center justify-between max-md:items-end max-md:justify-end">
      <div className="flex gap-10 items-center max-md:hidden">
        <Link to={"/"} className="cursor-pointer">
          <img src="https://app.holded.com/assets/img/brand/holded-logo.svg" />
        </Link>
        {user?.tipo !== "admin" && (
          <>
            <div className="flex gap-2">
              <div className="dropdown dropdown-hover">
                <div
                  tabIndex={0}
                  role="button"
                  className="text-white font-semibold hover:bg-gray-700 py-1 px-4 rounded-md transition-all"
                >
                  Acciones
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-white p-1 rounded-md w-52 text-sm font-medium shadow-xl gap-1"
                >
                  <li className="hover:bg-gray-800 hover:text-white rounded-md">
                    <Link to={"/salidas"}>Salidas</Link>
                  </li>{" "}
                  <li className="hover:bg-gray-800 hover:text-white rounded-md">
                    <Link to={"/remuneraciones"}>Remuneraciones</Link>
                  </li>{" "}
                  <li className="hover:bg-gray-800 hover:text-white rounded-md">
                    <Link to={"/legales"}>Legales</Link>
                  </li>{" "}
                  <li className="hover:bg-gray-800 hover:text-white rounded-md">
                    <Link to={"/rendiciones"}>Rediciones</Link>
                  </li>
                  <li className="hover:bg-gray-800 hover:text-white rounded-md">
                    <Link to={"/egresos"}>Egresos</Link>
                  </li>
                  <li className="hover:bg-gray-800 hover:text-white rounded-md">
                    <Link to={"/ingresos"}>Ingresos</Link>
                  </li>
                </ul>
              </div>
              <Link
                className="text-white font-semibold hover:bg-gray-700 py-1 px-4 rounded-md transition-all"
                to={"/contratos"}
              >
                Contratos
              </Link>{" "}
              <Link
                className="text-white font-semibold hover:bg-gray-700 py-1 px-4 rounded-md transition-all"
                to={"/registros"}
              >
                Filtrar registros
              </Link>
              <Link
                className="text-white font-semibold hover:bg-gray-700 py-1 px-4 rounded-md transition-all"
                to={"/caja-logistica"}
              >
                Caja de logistica
              </Link>
            </div>
          </>
        )}{" "}
        {user.tipo === "admin" && (
          <>
            <div className="flex gap-2">
              <Link
                className="text-white font-semibold hover:bg-gray-700 py-1 px-4 rounded-md transition-all"
                to={"/salidas"}
              >
                Salidas de contratos
              </Link>
              <Link
                className="text-white font-semibold hover:bg-gray-700 py-1 px-4 rounded-md transition-all"
                to={"/contratos"}
              >
                Contratos entregados
              </Link>{" "}
              <Link
                className="text-white font-semibold hover:bg-gray-700 py-1 px-4 rounded-md transition-all"
                to={"/remuneraciones"}
              >
                Remuneraciones de contratos
              </Link>{" "}
              <Link
                className="text-white font-semibold hover:bg-gray-700 py-1 px-4 rounded-md transition-all"
                to={"/legales"}
              >
                Perdidas legales de contratos
              </Link>{" "}
              <Link
                className="text-white font-semibold hover:bg-gray-700 py-1 px-4 rounded-md transition-all"
                to={"/rendiciones"}
              >
                Rendiciones por viaticos, etc.
              </Link>
            </div>
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button className="font-semibold bg-white px-4 py-1 text-sm rounded-md capitalize max-md:hidden">
          Usuario:{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 font-bold">
            {user.username}
          </span>
        </button>
        {/* <div className="cursor-pointer bg-gray-500 py-5 px-5 rounded-full"></div>{" "} */}
        <button
          onClick={() => signout()}
          className="font-extrabold text-white bg-gradient-to-r from-red-500 to-blue-400 px-4 py-1 text-sm rounded-md flex gap-2 items-center"
        >
          Salir de la cuenta
          {/* <IoLogOut className="text-xl text-gray-800" /> */}
        </button>
      </div>
    </header>
  );
};
