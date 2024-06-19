import React from "react";

const RemuneracionesProgressBar = ({
  remuneracionesMensuales,
  rendicionesMensuales,
}) => {
  const totalRecaudacion = remuneracionesMensuales.reduce(
    (total, remuneracion) => total + parseFloat(remuneracion.recaudacion),
    0
  );

  const totalRendicion = rendicionesMensuales.reduce(
    (total, remuneracion) =>
      total + parseFloat(remuneracion.rendicion_final || 0),
    0
  );

  const porcentajeTotal = Math.min(
    (Number(totalRecaudacion + totalRendicion) / 50000000) * 100,
    100
  ).toFixed(2);

  const esNegativo = totalRecaudacion + totalRendicion < 0;

  return (
    <div className="bg-white py-8 px-5 transition-all ease-linear w-full max-md:py-3 cursor-pointer">
      <div className="flex items-center justify-between max-md:flex-col max-md:items-start">
        <p className="text-slate-700 text-lg mb-3 uppercase max-md:text-sm font-semibold">
          Total en remuneraciones
        </p>
        <p className="text-slate-700 text-lg mb-3 max-md:text-sm font-bold">
          {Number(totalRecaudacion + totalRendicion).toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumIntegerDigits: 2,
          })}
        </p>
      </div>
      <div className="w-full bg-gray-200 rounded-lg overflow-hidden">
        <div
          className={`h-3 ${
            esNegativo ? "bg-red-400" : "bg-green-400"
          } max-md:h-2`}
          style={{ width: `${porcentajeTotal}%` }}
        ></div>
      </div>
    </div>
  );
};

export default RemuneracionesProgressBar;
