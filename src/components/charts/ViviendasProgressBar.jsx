import React from "react";

const ViviendasProgressBar = ({ salidasMensuales, legales }) => {
  const totalDatos = salidasMensuales?.reduce((total, salida) => {
    return (
      total +
      (salida?.datos_cliente?.datosCliente
        ? salida?.datos_cliente?.datosCliente?.length
        : 0)
    );
  }, 0);

  // Calcular el porcentaje total, asegurándose de que no exceda el límite máximo (100000000)

  const totalDatosDos = legales?.reduce((total, salida) => {
    return (
      total +
      (salida?.datos_cliente?.datosCliente
        ? salida?.datos_cliente?.datosCliente?.length
        : 0)
    );
  }, 0);

  const porcentajeTotal = Math.min(
    (Number(totalDatos + totalDatosDos) / 100) * 100,
    100
  ).toFixed(2);

  return (
    <div className="bg-white border-slate-200 border-[1px] py-8 px-5 rounded-xl shadow w-full max-md:py-3">
      <div className="flex items-center justify-between max-md:flex-col max-md:items-start">
        <p className="text-slate-700 text-lg mb-3 uppercase max-md:text-sm">
          Total vivivendas entregadas
        </p>
        <p className="text-slate-700 text-lg mb-3 max-md:text-sm max-md:font-bold">
          {Number(totalDatos + totalDatosDos)} entregadas
        </p>
      </div>
      <div className="w-full bg-gray-200 rounded-lg overflow-hidden ">
        <div
          className="h-3 max-md:h-2 bg-orange-500"
          style={{ width: `${porcentajeTotal}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ViviendasProgressBar;
