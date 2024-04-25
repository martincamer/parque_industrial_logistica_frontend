import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { obtenerUnicaRendicion } from "../../../api/ingresos";

export const ResumenViewRendicion = () => {
  const [unicaSalida, setUnicaSalida] = useState([]);

  const params = useParams();

  useEffect(() => {
    async function loadData() {
      const respuesta = await obtenerUnicaRendicion(params.id);

      setUnicaSalida(respuesta.data);
    }

    loadData();
  }, []);

  console.log(unicaSalida);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <section className="bg-gray-100/50 uppercase text-sm w-full h-full min-h-screen max-h-full px-12 max-md:px-4 flex flex-col gap-10 py-24 max-md:gap-10">
      <div className="uppercase grid grid-cols-4 gap-3 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0">
        <article className="flex flex-col gap-4 rounded-xl border border-slate-200 hover:shadow bg-white p-6 max-md:pb-3">
          <div
            className={`inline-flex gap-2 self-end rounded p-1 text-xs font-medium 
    ${
      unicaSalida.rendicion_final >= 0
        ? "bg-green-100 text-green-600"
        : "bg-red-100 text-red-600"
    }`}
          >
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

            <span>
              {Number(unicaSalida.rendicion_final / 100000).toFixed(2)}%
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total recaudado en esta entrega
            </strong>

            <p>
              <span
                className={`text-2xl font-medium max-md:text-base ${
                  unicaSalida.rendicion_final >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {" "}
                {Number(unicaSalida.rendicion_final).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>{" "}
              <span className="text-xs text-gray-500">
                el total es de{" "}
                {Number(unicaSalida.rendicion_final).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}{" "}
              </span>
            </p>
          </div>
        </article>
        <article className="flex flex-col gap-4 rounded-xl border border-slate-200 hover:shadow bg-white p-6 max-md:pb-3">
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
      </div>

      <div className=" rounded-xl grid grid-cols-3 gap-5 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0">
        <div className="bg-white border-slate-200 border-[1px] hover:shadow py-5 px-5 rounded-xl">
          <p className="text-slate-700 font-bold text-lg underline max-md:text-sm max-md:uppercase">
            Datos de los clientes
          </p>
          <div className="py-2 px-2 flex flex-col gap-3">
            <div className="flex flex-col gap-1 bg-white border-slate-200 border-[1px] rounded-xl py-2 px-2 shadow max-md:border-slate-300 max-md:px-5">
              <div>
                <p className="text-slate-600 max-md:text-sm">
                  Armador:{" "}
                  <span className="text-slate-700 font-semibold">
                    {unicaSalida.armador}
                  </span>
                </p>
              </div>

              <div>
                <p className="text-slate-600 max-md:text-sm">
                  Detalle/Clientes:{" "}
                  <span className="text-slate-700 font-semibold">
                    {unicaSalida.detalle}
                  </span>
                </p>
              </div>

              <div>
                <p className="text-slate-600 max-md:text-sm">
                  Fecha:{" "}
                  <span className="text-slate-700 font-semibold">
                    {formatDate(unicaSalida.created_at)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-slate-200 border-[1px] hover:shadow py-5 px-5 rounded-xl bg-white">
          <p className="text-slate-700 font-bold text-lg underline max-md:text-sm max-md:uppercase">
            Rendiciones/Etc
          </p>

          <div className="mt-3">
            <p className="text-slate-600 max-md:text-sm">
              Rendicion Recaudada:{" "}
              <span className="text-slate-700 font-semibold">
                {Number(unicaSalida.rendicion_final).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>
            </p>
          </div>
        </div>
      </div>

      <article className="grid grid-cols-3 gap-4 items-start max-md:grid-cols-1">
        <div className="flex gap-3">
          <div
            className={`bg-white border-slate-200 border-[1px] hover:shadow py-5 px-5 rounded-xl w-full relative max-md:py-3 ${
              Number(unicaSalida.rendicion_final) >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            <div className="flex justify-between items-center max-md:text-sm">
              <p className="text-slate-500 text-lg flex gap-2 max-md:text-sm">
                {Number(unicaSalida.rendicion_final).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
                <span className="font-bold text-slate-700 max-md:text-sm">
                  ° {Number(unicaSalida.rendicion_final / 100000).toFixed(2)} %{" "}
                </span>
              </p>
              <p
                className={`font-semibold text-lg max-md:text-sm ${
                  Number(unicaSalida.rendicion_final) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {Number(Number(unicaSalida.rendicion_final)).toLocaleString(
                  "es-AR",
                  {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  }
                )}
              </p>
            </div>
            <div className="h-2 bg-gray-200 mt-3 rounded-md overflow-hidden">
              <div
                className={`h-full ${
                  Number(unicaSalida.rendicion_final) >= 0
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
                style={{
                  width: `${Math.abs(
                    Number(unicaSalida.rendicion_final) / 1000000
                  ).toFixed(2)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
};
