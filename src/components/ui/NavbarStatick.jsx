import React from "react";
import { useAuth } from "../../context/AuthProvider";

export const NavbarStatick = () => {
  const { user } = useAuth();

  console.log(user);

  return (
    <div className="absolute top-2 right-5 flex gap-2 items-start z-[-1] max-md:top-5">
      <p className="bg-white py-1 px-4 rounded-xl border-slate-300 border-[1px] shadow text-black max-md:text-xs max-md:py-2">
        Usuario Logeado{" "}
        <span className="bg-slate-800 text-white py-[2px] px-2 rounded-lg capitalize">
          {user?.username}
        </span>
      </p>
      <p className="bg-white py-1 px-4 rounded-xl border-slate-300 border-[1px] shadow text-black max-md:text-xs max-md:py-2">
        {" "}
        <span className="bg-slate-800 text-white py-[2px] px-2 rounded-lg capitalize">
          {user?.role_id === "1" ? "usuario" : "admin"}
        </span>
      </p>
    </div>
  );
};
