import React from "react";
import { useAuth } from "../../context/AuthProvider";
import { Link } from "react-router-dom";

export const NavbarStatick = () => {
  const { user, signout, isAuth } = useAuth();

  return (
    isAuth && (
      <div className="absolute top-10 right-5 flex gap-2 items-start max-md:top-5 mx-8">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="avatar hover:shadow-md rounded-full transition-all w-full "
          >
            <div className="rounded-full h-[60px] w-[60px] transition-all ">
              <img
                src={
                  user?.imagen ||
                  "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                }
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <div className="py-2 px-3 text-center capitalize font-bold text-slate-700">
              {user?.username}
            </div>
            <div className="py-2 px-3 text-center capitalize font-light text-xs text-slate-700">
              {user?.email}
            </div>
            <li>
              <Link to={"/configuraciones"}>Configuraciones</Link>
            </li>
            <li>
              <button type="button" onClick={() => signout()}>
                Salir de la aplicación
              </button>
            </li>
          </ul>
        </div>
      </div>
    )
  );
};
