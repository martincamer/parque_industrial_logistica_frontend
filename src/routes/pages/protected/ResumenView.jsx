import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { obtenerUnicaSalida } from "../../../api/ingresos";

export const ResumenView = () => {
  const [unicaSalida, setUnicaSalida] = useState([]);

  const params = useParams();

  useEffect(() => {
    async function loadData() {
      const respuesta = await obtenerUnicaSalida(params.id);

      setUnicaSalida(respuesta.data);
    }

    loadData();
  }, [params.id]);

  console.log(unicaSalida);

  const totalEnSalidas =
    parseFloat(unicaSalida.total_flete) +
    parseFloat(unicaSalida.total_control) +
    parseFloat(unicaSalida.total_viaticos) +
    parseFloat(unicaSalida.espera);

  return (
    <section className="h-full max-h-full min-h-screen w-full max-w-full">
      <div className="bg-white mb-4 h-10 flex">
        <Link
          to={"/salidas"}
          className="bg-blue-100 flex h-full px-4 justify-center items-center font-bold text-blue-600"
        >
          Salidas
        </Link>{" "}
        <Link className="bg-blue-500 flex h-full px-4 justify-center items-center font-bold text-white">
          Salida N° {params.id}
        </Link>
      </div>
      <div className="mx-5 my-10 bg-white py-6 px-6">
        <p className="font-bold text-blue-500 text-xl">
          Datos de la salida obtenida, descarga los documentos, etc.
        </p>
      </div>
      <div className="bg-white py-5 px-5 mx-5 my-10 flex gap-3">
        <div className="dropdown dropdown-bottom">
          <button className="font-bold text-sm bg-rose-400 py-2 px-4 text-white rounded">
            Ver estadisticas de la salida
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 mt-2 bg-white w-[800px] border"
          >
            <div className="py-5 px-5 grid grid-cols-3 gap-5 w-full">
              <div className="flex flex-col gap-1 border border-sky-300 py-3 px-3">
                <p className="font-medium text-sm text-center">
                  Total de la salida.
                </p>
                <p className="font-bold text-lg text-rose-500 text-center">
                  {totalEnSalidas.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </p>
              </div>
            </div>
          </ul>
        </div>
      </div>

      <div className="flex gap-5 max-md:flex-col mx-5 my-6">
        <Link
          target="_blank"
          to={`/control-redencion-de-viajes/${params.id}`}
          className="flex gap-2 items-center text-sm font-semibold bg-blue-500 py-1.5 px-6 rounded-full text-white hover:bg-orange-500 transition-all"
        >
          Descargar Control y Rendicion de Viajes Documento
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
            />
          </svg>
        </Link>
        <Link
          target="_blank"
          to={`/fletes/${params.id}`}
          className="flex gap-2 items-center text-sm font-semibold bg-blue-500 py-1.5 px-6 rounded-full text-white hover:bg-orange-500 transition-all"
        >
          Descargar Fletes Documento
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
            />
          </svg>
        </Link>
        <Link
          target="_blank"
          to={`/viaticos-armadores/${params.id}`}
          className="flex gap-2 items-center text-sm font-semibold bg-blue-500 py-1.5 px-6 rounded-full text-white hover:bg-orange-500 transition-all"
        >
          Descargar Viaticos Armadores Documento
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
            />
          </svg>
        </Link>
      </div>

      {/* tabla de datos  */}
      <div className="bg-white mx-5 my-5">
        <table className="table">
          <thead className="text-left">
            <tr>
              <th className="px-4 py-5  text-slate-700 max-md:py-5 font-bold uppercase">
                Clientes
              </th>
              <th className="px-4 py-5  text-slate-700 max-md:py-5 font-bold uppercase">
                Localidad/Entregas
              </th>
              <th className="px-4 py-5  text-slate-700 max-md:py-5 font-bold uppercase">
                Chofer Vehiculo
              </th>
              <th className="px-4 py-5  text-slate-700 max-md:py-5 font-bold uppercase">
                Chofer
              </th>
              <th className="px-4 py-5  text-slate-700 max-md:py-5 font-bold uppercase">
                Total KM Control
              </th>
              <th className="px-4 py-5  text-slate-700 max-md:py-5 font-bold uppercase">
                KM Control Precio
              </th>
              <th className="px-4 py-5  text-slate-700 max-md:py-5 font-bold uppercase">
                Total KM Flete
              </th>
              <th className="px-4 py-5  text-slate-700 max-md:py-5 font-bold uppercase">
                KM Flete Precio
              </th>
              <th className="px-4 py-5  text-slate-700 max-md:py-3 font-bold uppercase">
                Espera
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-4 font-medium text-gray-900 uppercase">
                {unicaSalida?.datos_cliente?.datosCliente.map((c) => (
                  <div key={""} className="font-bold text-slate-700">
                    {c.cliente} ({c.numeroContrato})
                  </div>
                ))}
              </td>
              <td className="px-4 py-4 font-medium text-gray-900 uppercase">
                {unicaSalida?.datos_cliente?.datosCliente.map((c) => (
                  <div key={""} className="font-bold text-slate-700">
                    {c.localidad}
                  </div>
                ))}
              </td>
              <td className="px-4 py-4 font-medium text-gray-900 uppercase">
                {unicaSalida.chofer_vehiculo}
              </td>
              <td className="px-4 py-4 font-medium text-gray-900 uppercase">
                {unicaSalida.chofer}
              </td>
              <td className="px-4 py-4 font-medium text-gray-900 uppercase">
                {unicaSalida.km_viaje_control} KM
              </td>
              <td className="px-4 py-4 font-medium text-gray-900 uppercase">
                {Number(unicaSalida.km_viaje_control_precio).toLocaleString(
                  "es-AR",
                  {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  }
                )}
              </td>
              <td className="px-4 py-4 font-medium text-gray-900 uppercase">
                {unicaSalida.fletes_km} KM
              </td>
              <td className="px-4 py-4 font-medium text-gray-900 uppercase">
                {Number(unicaSalida.fletes_km_precio).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </td>
              <td className="px-4 py-4 font-medium text-gray-900 uppercase">
                {Number(unicaSalida.espera).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <article className="grid grid-cols-4 gap-5 mx-5 my-10">
        <div className="bg-white py-5 px-5  text-base">
          <div>
            <h3 className="font-bold text-slate-700 underline uppercase">
              Lugar de salida/Fabrica
            </h3>
            <div className="flex gap-2 font-semibold text-red-800 mt-3 uppercase">
              <p className="font-bold text-slate-700">Lugar de salida</p>
              {unicaSalida.salida}
            </div>
            <div className="flex gap-2 font-semibold text-red-800 mt-3 uppercase">
              <p className="font-bold text-slate-700">Fabrica / Suc.</p>
              {unicaSalida.fabrica}
            </div>
            <div className="flex gap-2 font-semibold text-red-800 mt-3">
              <p className="font-bold text-slate-700 max-md:text-sm uppercase">
                Fecha de salida
              </p>
              {unicaSalida?.created_at?.split("T")[0]}
            </div>
          </div>
        </div>

        <div className="bg-white py-5 px-5 text-base">
          <div>
            <h3 className="font-bold text-slate-700 uppercase underline text-base">
              Gastos distribuidos
            </h3>
            <div className="flex gap-2 font-semibold text-red-800 mt-3">
              <p className="font-bold text-slate-700 uppercase">
                Total control
              </p>
              {Number(unicaSalida.total_control).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumIntegerDigits: 2,
              })}
            </div>
            <div className="flex gap-2 font-semibold text-red-800 mt-3">
              <p className="font-bold text-slate-700 uppercase">Total Flete</p>
              {Number(unicaSalida.total_flete).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumIntegerDigits: 2,
              })}
            </div>
            <div className="flex gap-2 font-semibold text-red-800 mt-3">
              <p className="font-bold text-slate-700 uppercase">Espera Flete</p>
              {Number(unicaSalida.espera).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumIntegerDigits: 2,
              })}
            </div>
            <div className="flex gap-2 font-semibold text-red-800 mt-3">
              <p className="font-bold text-slate-700 uppercase">
                Total Viaticos
              </p>
              {Number(unicaSalida.total_viaticos).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumIntegerDigits: 2,
              })}
            </div>
          </div>
        </div>
      </article>
    </section>
  );
};
