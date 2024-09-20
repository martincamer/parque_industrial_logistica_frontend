import { Link } from "react-router-dom";
import { useRemuneracionContext } from "../../../context/RemuneracionesProvider";
import { useLegalesContext } from "../../../context/LegalesProvider";
import { useState } from "react";
import { formatearDinero } from "../../../helpers/FormatearDinero";

export const PageRegistros = () => {
  const { remuneraciones } = useRemuneracionContext();
  const { legalesReal } = useLegalesContext();

  console.log(remuneraciones, legalesReal);

  const combinedData = [...remuneraciones, ...legalesReal];

  const [selectedMonth, setSelectedMonth] = useState("2024-08");

  // Filtrar datos según el mes seleccionado
  const filteredData = combinedData.filter((item) => {
    const fecha = new Date(item?.fecha_carga);
    const monthYear = `${fecha.getFullYear()}-${String(
      fecha.getMonth() + 1
    ).padStart(2, "0")}`;
    return monthYear === selectedMonth;
  });

  // Agrupar los datos por fecha de carga
  const groupedData = filteredData.reduce((acc, item) => {
    const fecha = new Date(item?.fecha_carga).toLocaleDateString();

    if (!acc[fecha]) {
      acc[fecha] = [];
    }

    acc[fecha].push(item);
    return acc;
  }, {});

  return (
    <section>
      <div className="bg-gray-100 py-10 px-10 flex justify-between items-center max-md:flex-col max-md:gap-3">
        <p className="font-bold text-gray-900 text-xl">Filtrar informes</p>
      </div>

      <div className="px-10 py-10 w-1/4 border mx-10 my-5 border-gray-300">
        <p className="font-bold border-b border-gray-500">Fecha de carga</p>

        <div className="mt-2">
          <select
            className="border border-gray-300 py-1 px-4 rounded-md outline-none"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="2024-07">Julio 2024</option>
            <option value="2024-08">Agosto 2024</option>
            <option value="2024-09">Septiembre 2024</option>
            <option value="2024-10">Octubre 2024</option>
          </select>
        </div>
      </div>

      <div className="py-5 px-5">
        {Object.keys(groupedData).map((fecha, index) => (
          <div key={index} className="mb-3">
            <div className="border-b-2 border-gray-400 pb-2 mb-4">
              <p className="font-bold text-sm uppercase">
                Fecha de carga {fecha}
              </p>
            </div>

            {groupedData[fecha].map((item, idx) => (
              <div key={idx} className="mb-2 border-b border-gray-300">
                <div className="grid grid-cols-7 gap-4 text-sm font-medium uppercase">
                  <div className="col-span-1">
                    <p className="font-bold">Contrato</p>
                    <p className="uppercase">
                      {item.datos_cliente.datosCliente[0].cliente}
                    </p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-bold">Fecha</p>
                    <p>{new Date(item.fecha_carga).toLocaleDateString()}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-bold">Total Fletes</p>
                    <p>
                      {formatearDinero(
                        Number(item.datos_cliente.datosCliente[0].totalFlete)
                      )}
                    </p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-bold">Pago a Fletero + Espera</p>
                    <p>{formatearDinero(Number(item.pago_fletero_espera))}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-bold">Viáticos</p>
                    <p>{formatearDinero(Number(item.viaticos))}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="font-bold">Refuerzos</p>
                    <p>{formatearDinero(Number(item.refuerzo))}</p>
                  </div>

                  <div className="col-span-1">
                    <p className="font-bold">Recaudación</p>
                    <p
                      className={`font-bold ${
                        Number(item.recaudacion) < 0
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {formatearDinero(Number(item.recaudacion))}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};
