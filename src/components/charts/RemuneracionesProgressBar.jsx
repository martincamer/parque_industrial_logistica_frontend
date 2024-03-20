import React from "react";

const RemuneracionesProgressBar = ({ remuneracionesMensuales }) => {
  // Sumar todas las recaudaciones
  const totalRecaudacion = remuneracionesMensuales.reduce(
    (total, remuneracion) => total + parseFloat(remuneracion.recaudacion),
    0
  );

  // Calcular el porcentaje total, asegurándose de que no exceda el límite máximo (100000000)
  const porcentajeTotal = Math.min(
    (totalRecaudacion / 15000000) * 100,
    100
  ).toFixed(2);

  return (
    <div className="bg-white border-slate-200 border-[1px] py-8 px-5 w-1/3 rounded-xl shadow w-full">
      <div className="flex items-center justify-between">
        <p className="text-slate-700 text-lg mb-3 uppercase">
          Total en remuneraciones
        </p>
        <p className="text-slate-700 text-lg mb-3">
          {Number(totalRecaudacion).toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumIntegerDigits: 2,
          })}
        </p>
      </div>
      <div className="w-full bg-gray-200 rounded-lg overflow-hidden">
        <div
          className="h-3 bg-green-400"
          style={{ width: `${porcentajeTotal}%` }}
        ></div>
      </div>
    </div>
  );
};

export default RemuneracionesProgressBar;
