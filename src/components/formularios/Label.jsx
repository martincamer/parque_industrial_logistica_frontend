import React from "react";

export const Label = ({ label }) => {
  return (
    <label className="text-[15px] text-slate-700 font-normal max-md:text-sm">
      {label}
    </label>
  );
};
