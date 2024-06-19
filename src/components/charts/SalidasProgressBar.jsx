import React from "react";

const SalidasProgressBar = ({ salidasMensuales }) => {
  // Sumar todas las recaudaciones
  const totalRecaudacion = salidasMensuales.reduce(
    (total, remuneracion) =>
      total +
      parseFloat(remuneracion.total_flete) +
      parseFloat(remuneracion.total_control) +
      parseFloat(remuneracion.total_viaticos) +
      parseFloat(remuneracion.espera),
    0
  );

  // Calcular el porcentaje total, asegurándose de que no exceda el límite máximo (100000000)
  const porcentajeTotal = Math.min(
    (totalRecaudacion / 20000000) * 100,
    100
  ).toFixed(2);

  return (
    <div className="bg-white py-8 px-5 transition-all ease-linear w-full max-md:py-3 cursor-pointer">
      <div className="flex items-center justify-between max-md:flex-col max-md:items-start">
        <p className="text-slate-700 text-lg mb-3 uppercase max-md:text-sm font-bold">
          Total en salidas/gastos/etc
        </p>
        <p className="text-slate-700 text-lg mb-3 max-md:text-sm font-bold">
          -{" "}
          {Number(totalRecaudacion).toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumIntegerDigits: 2,
          })}
        </p>
      </div>
      <div className="w-full bg-gray-200 rounded-lg overflow-hidden ">
        <div
          className="h-3 max-md:h-2 bg-red-400"
          style={{ width: `${porcentajeTotal}%` }}
        ></div>
      </div>
    </div>
  );
};

export default SalidasProgressBar;
