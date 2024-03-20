import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerUnicoIngreso } from "../../../api/ingresos";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ImprimirIngresoUnico } from "../../../components/pdf/ImprimirIngresoUnico";

export const ViewIngreso = () => {
  //obtener datos
  const [datos, setDatos] = useState([]);

  //   params obtener
  const params = useParams();

  console.log(params);

  useEffect(() => {
    async function loadData() {
      const response = await obtenerUnicoIngreso(params.id);

      setDatos(response.data);
    }
    loadData();
  }, []);

  console.log("datos", datos);

  const valor = datos.total; // Este es tu valor numérico
  const valorTotal = 100; // Este es tu valor total, ajusta según tus necesidades

  // Calcula el porcentaje
  const porcentaje = (valor / valorTotal) * 100;

  // Ahora, 'porcentaje' contiene el resultado que puedes utilizar
  console.log(`El porcentaje es: ${porcentaje}%`);

  return (
    <section className="px-10 py-16 w-full flex flex-col gap-5 h-screen">
      <Link
        to={"/"}
        className="absolute flex top-4 text-sm font-bold text-indigo-500 gap-2 items-center"
      >
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
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        VOLVER
      </Link>
      <div className="border-[1px] mt-12 border-slate-300 py-10 px-10 rounded-lg shadow">
        <div className="flex">
          <p className="text-slate-700 text-lg border-b-[2px] border-slate-700">
            N° del ingreso {datos?.id}
          </p>
        </div>

        <div className="mt-10 ">
          <p className="text-indigo-600 text-lg flex gap-2 items-centerms">
            Datos del ingreso{" "}
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
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
              />
            </svg>
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 mt-5">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="text-left">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 font-semibold capitalize">
                  Detalle
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 font-semibold capitalize">
                  Tipo
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 font-semibold capitalize">
                  Creador
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 font-semibold capitalize">
                  Total
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 text-left">
              <tr className="hover:bg-slate-200 cursor-pointer transition-all ease-in-out duration-100">
                <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 capitalize">
                  {datos.detalle}
                </td>

                <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 capitalize">
                  {datos.tipo}
                </td>

                <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 capitalize">
                  {datos.usuario}
                </td>

                <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 capitalize">
                  {Number(datos.total).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <article className="mt-10 w-1/5 flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6">
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

            <span className="text-xs font-medium"> ${porcentaje}% </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500">
              {" "}
              Ingreso de{" "}
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900">
                {" "}
                {Number(datos.total).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </span>

              {/* <span className="text-xs text-gray-500"> from $240.94 </span> */}
            </p>
          </div>
        </article>
      </div>

      <div>
        <button
          className="py-2 px-5 border-slate-300 border-[1px] shadow rounded-lg hover:shadow-md transition-all ease-in-out text-slate-800 text-sm"
          type="button"
        >
          <PDFDownloadLink
            fileName={`Ingreso_${datos.detalle}_${datos.tipo}`}
            document={<ImprimirIngresoUnico datos={datos} />}
          >
            Descargar o imprimir
          </PDFDownloadLink>
        </button>
      </div>
    </section>
  );
};
