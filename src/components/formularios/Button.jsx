import React from "react";

export const Button = ({ type, titulo }) => {
  return (
    <button
      className="bg-gradient-to-r from-primary to-blue-500 py-2 px-6 w-full rounded-full font-bold text-white text-base transition-all ease-in-out duration-300 max-md:text-sm"
      type={type}
    >
      {titulo}
    </button>
  );
};
