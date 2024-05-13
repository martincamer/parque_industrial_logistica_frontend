import React from "react";

const ProgressBarMetrosEntregados = ({ salidasMensuales, legales }) => {
  const totalMetrosCuadrados = salidasMensuales?.reduce((total, salida) => {
    return (
      total +
      (salida?.datos_cliente?.datosCliente
        ? salida?.datos_cliente?.datosCliente?.reduce((subtotal, cliente) => {
            return (
              subtotal + Number(cliente.metrosCuadrados || 0) // Asegurarse de manejar el caso en que metrosCuadrados no esté definido
            );
          }, 0)
        : 0)
    );
  }, 0);

  const totalMetrosCuadradosDos = legales?.reduce((total, salida) => {
    return (
      total +
      (salida?.datos_cliente?.datosCliente
        ? salida?.datos_cliente?.datosCliente?.reduce((subtotal, cliente) => {
            return (
              subtotal + Number(cliente.metrosCuadrados || 0) // Asegurarse de manejar el caso en que metrosCuadrados no esté definido
            );
          }, 0)
        : 0)
    );
  }, 0);

  const porcentajeTotal = Math.min(
    ((totalMetrosCuadrados + totalMetrosCuadradosDos) / 10000) * 100, // Usar 100,000,000 como límite máximo de metros cuadrados
    100
  ).toFixed(2);

  return (
    <div className="bg-white border-slate-200 border-[1px] py-8 px-5 rounded-xl hover:shadow-md transition-all ease-linear w-full max-md:py-3 cursor-pointer">
      <div className="flex items-center justify-between max-md:flex-col max-md:items-start">
        <p className="text-slate-700 text-lg mb-3 uppercase max-md:text-sm font-bold">
          Total metros entregados
        </p>
        <p className="text-slate-700 text-lg mb-3 max-md:text-sm max-md:font-bold">
          <span className="font-bold">
            {" "}
            {Number(totalMetrosCuadrados + totalMetrosCuadradosDos).toFixed(2)}
          </span>{" "}
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

export default ProgressBarMetrosEntregados;
