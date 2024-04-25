import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { obtenerUnicaSalida } from "../../../api/ingresos";
import XLSX from "xlsx";

export const ResumenView = () => {
  const [unicaSalida, setUnicaSalida] = useState([]);

  const params = useParams();

  console.log(unicaSalida);
  useEffect(() => {
    async function loadData() {
      const respuesta = await obtenerUnicaSalida(params.id);

      setUnicaSalida(respuesta.data);
    }

    loadData();
  }, []);

  const fechaActual = new Date();
  const numeroDiaActual = fechaActual.getDay(); // Obtener el día del mes actual

  const nombresDias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const numeroMesActual = fechaActual.getMonth() + 1; // Obtener el mes actual
  const nombresMeses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const nombreMesActual = nombresMeses[numeroMesActual - 1]; // Obtener el nombre del mes actual

  const nombreDiaActual = nombresDias[numeroDiaActual]; // Obtener el nombre del día actual
  const descargarExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([unicaSalida]);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "resumen.xlsx");
  };

  const esNegativo =
    parseFloat(unicaSalida.total_flete) +
      parseFloat(unicaSalida.total_control) +
      parseFloat(unicaSalida.total_viaticos) +
      parseFloat(unicaSalida.espera) <
    0;

  const indicadorColor = esNegativo
    ? "bg-red-100 text-red-600"
    : "bg-green-100 text-green-600";
  const textoColor = esNegativo ? "text-red-600" : "text-green-600";

  return (
    <section className="bg-gray-100/50 max-h-full min-h-screen w-full h-full px-12 max-md:px-4 flex flex-col gap-10 py-24 max-md:gap-12">
      <div className="uppercase grid grid-cols-4 gap-3 max-md:grid-cols-1 max-md:shadow-none max-md:border-none max-md:px-0 max-md:py-0">
        <article
          className={`flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md bg-white p-6 max-md:p-3 transition-all ease-linear cursor-pointer`}
        >
          <div
            className={`inline-flex gap-2 self-end rounded ${indicadorColor} p-1`}
          >
            <span className="text-xs font-medium">
              {parseFloat(
                (parseFloat(unicaSalida.total_flete) +
                  parseFloat(unicaSalida.total_control) +
                  parseFloat(unicaSalida.total_viaticos)) /
                  100000
              ).toFixed(2)}
              %
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total en Viáticos/Flete/Etc.
            </strong>

            <p>
              <span
                className={`text-2xl font-medium ${textoColor} max-md:text-base`}
              >
                {Number(
                  Number(unicaSalida.total_control) +
                    Number(unicaSalida.total_flete) +
                    Number(unicaSalida.total_viaticos) +
                    Number(unicaSalida.espera)
                ).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>{" "}
              <span className="text-xs text-gray-500">
                Últimos gastos, el total final es de{" "}
                <span className="font-bold text-slate-700">
                  {Number(
                    Number(unicaSalida.total_control) +
                      Number(unicaSalida.total_flete) +
                      Number(unicaSalida.total_viaticos) +
                      Number(unicaSalida.espera)
                  ).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  })}
                </span>
              </span>
            </p>
          </div>
        </article>
        <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md bg-white p-6 max-md:p-3 transition-all ease-linear cursor-pointer">
          <div className="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
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
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
              />
            </svg>

            <span className="text-xs font-medium">MARZO</span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Fecha Actual
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900 max-md:text-base">
                {nombreMesActual}
              </span>

              <span className="text-xs text-gray-500">
                {" "}
                Dia {nombreDiaActual}
              </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md bg-white p-6 max-md:p-3 transition-all ease-linear cursor-pointer">
          <div className="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>

            <span className="text-xs font-medium">
              {" "}
              {/* {salidasMensuales.length / 10000} %{" "} */}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total salidas/viviendas
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900 max-md:text-base">
                {unicaSalida.datos_cliente?.datosCliente?.length}
              </span>

              <span className="text-xs text-gray-500">
                {" "}
                Total final de entregas{" "}
                <span className="font-bold text-slate-700">
                  {unicaSalida.datos_cliente?.datosCliente?.length}
                </span>
              </span>
            </p>
          </div>
        </article>
      </div>

      <div className="flex gap-5 max-md:flex-col">
        <Link
          to={`/control-redencion-de-viajes/${params.id}`}
          className="bg-green-100 text-green-700 py-3 text-sm px-6 rounded-xl hover:shadow-md hover:shadow-gray-300 transition-all ease-linear flex gap-2 items-center max-md:text-sm uppercase"
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
          to={`/fletes/${params.id}`}
          className="bg-green-100 text-green-700 py-3 text-sm px-6 rounded-xl hover:shadow-md hover:shadow-gray-300 transition-all ease-linear flex gap-2 items-center max-md:text-sm uppercase"
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
          to={`/viaticos-armadores/${params.id}`}
          className="bg-green-100 text-green-700 py-3 text-sm px-6 rounded-xl hover:shadow-md hover:shadow-gray-300 transition-all ease-linear flex gap-2 items-center max-md:text-sm uppercase"
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
      <div className="rounded-2xl border-[1px] border-slate-300 hover:shadow overflow-x-scroll bg-white">
        <table className="w-full divide-y-2 divide-gray-200 text-sm overflow-x-scroll">
          <thead className="text-left">
            <tr>
              <th className="px-4 py-5  text-slate-700 max-md:py-5 max-md:text-xs font-bold uppercase">
                Clientes
              </th>
              <th className="px-4 py-5  text-slate-700 max-md:py-5 max-md:text-xs font-bold uppercase">
                Localidad/Entregas
              </th>
              <th className="px-4 py-5  text-slate-700 max-md:py-5 max-md:text-xs font-bold uppercase">
                Chofer Vehiculo
              </th>
              <th className="px-4 py-5  text-slate-700 max-md:py-5 max-md:text-xs font-bold uppercase">
                Chofer
              </th>
              <th className="px-4 py-5  text-slate-700 max-md:py-5 max-md:text-xs font-bold uppercase">
                Total KM Control
              </th>
              <th className="px-4 py-5  text-slate-700 max-md:py-5 max-md:text-xs font-bold uppercase">
                KM Control Precio
              </th>
              <th className="px-4 py-5  text-slate-700 max-md:py-5 max-md:text-xs font-bold uppercase">
                Total KM Flete
              </th>
              <th className="px-4 py-5  text-slate-700 max-md:py-5 max-md:text-xs font-bold uppercase">
                KM Flete Precio
              </th>
              <th className="px-4 py-5  text-slate-700 max-md:py-3 max-md:text-xs font-bold uppercase">
                Espera
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-4 font-medium text-gray-900 max-md:text-xs uppercase">
                {unicaSalida?.datos_cliente?.datosCliente.map((c) => (
                  <div className="font-bold text-slate-700">
                    {c.cliente} ({c.numeroContrato})
                  </div>
                ))}
              </td>
              <td className="px-4 py-4 font-medium text-gray-900 max-md:text-xs uppercase">
                {unicaSalida?.datos_cliente?.datosCliente.map((c) => (
                  <div className="font-bold text-slate-700">{c.localidad}</div>
                ))}
              </td>
              <td className="px-4 py-4 font-medium text-gray-900 max-md:text-xs uppercase">
                {unicaSalida.chofer_vehiculo}
              </td>
              <td className="px-4 py-4 font-medium text-gray-900 max-md:text-xs uppercase">
                {unicaSalida.chofer}
              </td>
              <td className="px-4 py-4 font-medium text-gray-900 max-md:text-xs uppercase">
                {unicaSalida.km_viaje_control} KM
              </td>
              <td className="px-4 py-4 font-medium text-gray-900 max-md:text-xs uppercase">
                {Number(unicaSalida.km_viaje_control_precio).toLocaleString(
                  "es-AR",
                  {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  }
                )}
              </td>
              <td className="px-4 py-4 font-medium text-gray-900 max-md:text-xs uppercase">
                {unicaSalida.fletes_km} KM
              </td>
              <td className="px-4 py-4 font-medium text-gray-900 max-md:text-xs uppercase">
                {Number(unicaSalida.fletes_km_precio).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </td>
              <td className="px-4 py-4 font-medium text-gray-900 max-md:text-xs uppercase">
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

      <article className="grid grid-cols-4 gap-5">
        <div className="border-[1px] border-slate-300 shadow py-5 px-6 rounded-xl uppercase bg-white">
          <div>
            <h3 className="font-bold text-slate-700 text-lg underline max-md:text-base">
              Lugar de salida/Fabrica
            </h3>
            <div className="flex gap-2 font-semibold text-red-800 mt-3 uppercase max-md:text-sm">
              <p className="font-bold text-base text-slate-700 max-md:text-sm">
                Lugar de salida
              </p>
              {unicaSalida.salida}
            </div>
            <div className="flex gap-2 font-semibold text-red-800 mt-3 uppercase max-md:text-sm">
              <p className="font-bold text-base text-slate-700 max-md:text-sm">
                Fabrica / Suc.
              </p>
              {unicaSalida.fabrica}
            </div>
            <div className="flex gap-2 font-semibold text-red-800 mt-3 max-md:text-sm">
              <p className="font-bold text-base text-slate-700 max-md:text-sm">
                Fecha de salida
              </p>
              {unicaSalida?.created_at?.split("T")[0]}
            </div>
          </div>
        </div>

        <div className="border-[1px] border-slate-300 shadow py-5 px-6 rounded-xl bg-white">
          <div>
            <h3 className="font-bold text-slate-700 text-lg uppercase underline max-md:text-base">
              Gastos distribuidos
            </h3>
            <div className="flex gap-2 font-semibold text-red-800 mt-3 max-md:text-sm">
              <p className="font-bold text-base text-slate-700 max-md:text-sm uppercase">
                Total control
              </p>
              {Number(unicaSalida.total_control).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumIntegerDigits: 2,
              })}
            </div>
            <div className="flex gap-2 font-semibold text-red-800 mt-3 max-md:text-sm">
              <p className="font-bold text-base text-slate-700 max-md:text-sm uppercase">
                Total Flete
              </p>
              {Number(unicaSalida.total_flete).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumIntegerDigits: 2,
              })}
            </div>
            <div className="flex gap-2 font-semibold text-red-800 mt-3 max-md:text-sm">
              <p className="font-bold text-base text-slate-700 max-md:text-sm uppercase">
                Espera Flete
              </p>
              {Number(unicaSalida.espera).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumIntegerDigits: 2,
              })}
            </div>
            <div className="flex gap-2 font-semibold text-red-800 mt-3 max-md:text-sm">
              <p className="font-bold text-base text-slate-700 max-md:text-sm uppercase">
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
