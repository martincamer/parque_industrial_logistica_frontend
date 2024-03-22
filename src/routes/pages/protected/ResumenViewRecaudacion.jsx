import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { obtenerUnicaRemuneracion } from "../../../api/ingresos";

export const ResumenViewRecaudacion = () => {
  const [unicaSalida, setUnicaSalida] = useState([]);

  const [tooltip, setTooltip] = useState(null);

  const handleHover = (name) => {
    setTooltip(name);
  };

  const handleLeave = () => {
    setTooltip(null);
  };

  const params = useParams();

  useEffect(() => {
    async function loadData() {
      const respuesta = await obtenerUnicaRemuneracion(params.id);

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

  const totalSuma = unicaSalida?.datos_cliente?.datosCliente.reduce(
    (acumulador, elemento) => {
      // Convertir la propiedad totalFlete a número y sumarla al acumulador
      return acumulador + parseFloat(elemento.totalFlete);
    },
    0
  ); // Iniciar el acumulador en 0

  const total =
    Number(unicaSalida.refuerzo) +
    Number(unicaSalida.viaticos) +
    Number(unicaSalida.pago_fletero_espera) +
    Number(totalSuma);
  const refuerzoPercentage = (
    (Number(unicaSalida.refuerzo) / total) *
    100
  ).toFixed(2);
  const recaudacionPercentage = (
    (Number(unicaSalida.recaudacion) / total) *
    100
  ).toFixed(2);
  const viaticosPercentage = (
    (Number(unicaSalida.viaticos) / total) *
    100
  ).toFixed(2);
  const totalFleteEsperaPercentage = (
    (Number(unicaSalida.pago_fletero_espera) / Number(total)) *
    100
  ).toFixed(2);

  return (
    <section className="w-full h-full px-12 max-md:px-4 flex flex-col gap-10 py-24 max-md:gap-10">
      <div className=" py-10 px-10 rounded-xl bg-white border-slate-200 border-[1px] shadow grid grid-cols-4 gap-3 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0">
        <article className="flex flex-col gap-4 rounded-xl border border-slate-200 shadow bg-white p-6 max-md:pb-3">
          <div
            className={`inline-flex gap-2 self-end rounded p-1 text-xs font-medium 
    ${
      unicaSalida.recaudacion >= 0
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

            <span>{Number(unicaSalida.recaudacion / 100000).toFixed(2)}%</span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total recaudado en esta entrega
            </strong>

            <p>
              <span
                className={`text-2xl font-medium max-md:text-base ${
                  unicaSalida.recaudacion >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {" "}
                {Number(unicaSalida.recaudacion).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>{" "}
              <span className="text-xs text-gray-500">
                el total es de{" "}
                {Number(unicaSalida.recaudacion).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}{" "}
              </span>
            </p>
          </div>
        </article>
        <article className="flex flex-col gap-4 rounded-xl border border-slate-200 shadow bg-white p-6 max-md:p-3">
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

        <article className="flex flex-col gap-4 rounded-xl border border-slate-200 shadow bg-white p-6 max-md:p-3">
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
              Total de viviendas
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900 max-md:text-base">
                {unicaSalida.datos_cliente?.datosCliente?.length}
              </span>

              <span className="text-xs text-gray-500">
                {" "}
                Total final de entregadas{" "}
                <span className="font-bold text-slate-700">
                  {unicaSalida.datos_cliente?.datosCliente?.length}
                </span>
              </span>
            </p>
          </div>
        </article>
      </div>

      <div className="flex gap-5">
        <Link
          target="_blank"
          to={`/remuneracion-pdf/${params.id}`}
          className="bg-black py-2 px-6 rounded-xl text-white flex gap-2 items-center max-md:text-sm"
        >
          Descargar Remuneracion formato pdf
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

      <div className="border-slate-200 border-[1px] shadow py-10 px-10 rounded-xl grid grid-cols-3 gap-5 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0">
        <div className="border-slate-300 border-[1px] shadow py-5 px-5 rounded-lg">
          <p className="text-slate-700 font-bold text-lg underline max-md:text-sm max-md:uppercase">
            Datos de los clientes
          </p>
          <div className="py-2 px-2 flex flex-col gap-3">
            {unicaSalida?.datos_cliente?.datosCliente?.map((datos, index) => (
              <div
                key={index}
                className="flex flex-col gap-1 bg-white border-slate-200 border-[1px] rounded-xl py-2 px-2 shadow max-md:border-slate-300 max-md:px-5"
              >
                <div>
                  <p className="text-slate-600 max-md:text-sm">
                    Nombre y Apellido:{" "}
                    <span className="text-slate-700 font-semibold">
                      {datos.cliente} ({datos.numeroContrato})
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 max-md:text-sm">
                    Localidad / Entregas:{" "}
                    <span className="text-slate-700 font-semibold ">
                      {datos.localidad}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 max-md:text-sm">
                    Metros Cuadrados:{" "}
                    <span className="text-slate-700 font-semibold">
                      {datos.metrosCuadrados} mts
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 max-md:text-sm">
                    Total Flete:{" "}
                    <span className="text-slate-700 font-semibold">
                      {Number(datos.totalFlete).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        minimumIntegerDigits: 2,
                      })}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-slate-300 border-[1px] shadow py-5 px-5 rounded-lg">
          <p className="text-slate-700 font-bold text-lg underline max-md:text-sm max-md:uppercase">
            Datos de carga/fletero/etc
          </p>
          <div className="py-2 px-2 flex flex-col gap-3 mt-2">
            <div>
              <p className="text-slate-600 max-md:text-sm">
                Nombre del armador:{" "}
                <span className="text-slate-700 font-semibold">
                  {unicaSalida.armador}
                </span>
              </p>
            </div>

            <div>
              <p className="text-slate-600 max-md:text-sm">
                Nombre del chofer:{" "}
                <span className="text-slate-700 font-semibold">
                  {unicaSalida.chofer}
                </span>
              </p>
            </div>

            <div>
              <p className="text-slate-600 max-md:text-sm">
                Total de km:{" "}
                <span className="text-slate-700 font-semibold">
                  {unicaSalida.km_lineal} klms
                </span>
              </p>
            </div>

            <div>
              <p className="text-slate-600 max-md:text-sm">
                Fecha de carga:{" "}
                <span className="text-slate-700 font-semibold">
                  {unicaSalida?.fecha_carga?.split("T")[0]}
                </span>
              </p>
            </div>
            <div>
              <p className="text-slate-600 max-md:text-sm">
                Fecha de entrega:{" "}
                <span className="text-slate-700 font-semibold">
                  {unicaSalida?.fecha_entrega?.split("T")[0]}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="border-slate-300 border-[1px] shadow py-5 px-5 rounded-lg flex flex-col gap-2">
          <p className="text-slate-700 font-bold text-lg underline max-md:text-sm max-md:uppercase">
            Remuneraciones/Etc
          </p>

          <div className="mt-3">
            <p className="text-slate-600 max-md:text-sm">
              Pago chofer por espera:{" "}
              <span className="text-slate-700 font-semibold">
                {Number(unicaSalida.pago_fletero_espera).toLocaleString(
                  "es-AR",
                  {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  }
                )}
              </span>
            </p>
          </div>

          <div className="">
            <p className="text-slate-600 max-md:text-sm">
              Refuerzo:{" "}
              <span className="text-slate-700 font-semibold">
                {Number(unicaSalida.refuerzo).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>
            </p>
          </div>
          <div className="">
            <p className="text-slate-600 max-md:text-sm">
              Viaticos:{" "}
              <span className="text-slate-700 font-semibold">
                {Number(unicaSalida.viaticos).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>
            </p>
          </div>
          <div className="">
            <p className="text-slate-600 max-md:text-sm">
              Total Flete:{" "}
              <span className="text-slate-700 font-semibold">
                {Number(totalSuma).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>
            </p>
          </div>
          <div className="">
            <p className="text-slate-600 max-md:text-sm">
              Recaudacion:{" "}
              <span className="text-green-600 font-bold">
                {Number(unicaSalida.recaudacion).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>
            </p>
          </div>
        </div>
      </div>

      <article className=" grid grid-cols-3 gap-4 items-start max-md:grid-cols-1">
        <div className="flex gap-3">
          <div
            className={`bg-white border-slate-300 border-[1px] shadow py-5 px-5 rounded-xl w-full relative max-md:py-3 ${
              Number(unicaSalida.recaudacion) >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            <div className="flex justify-between items-center max-md:text-sm">
              <p className="text-slate-500 text-lg flex gap-2 max-md:text-sm">
                {Number(
                  Number(unicaSalida.viaticos) +
                    Number(totalSuma) +
                    Number(unicaSalida.refuerzo) +
                    Number(unicaSalida.pago_fletero_espera)
                ).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
                <span className="font-bold text-slate-700 max-md:text-sm">
                  °{" "}
                  {Number(
                    Number(
                      Number(unicaSalida.viaticos) +
                        Number(totalSuma) +
                        Number(unicaSalida.refuerzo) +
                        Number(unicaSalida.pago_fletero_espera)
                    ) / 100000
                  ).toFixed(2)}{" "}
                  %{" "}
                </span>
              </p>
              <p
                className={`font-semibold text-lg max-md:text-sm ${
                  Number(unicaSalida.recaudacion) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {Number(Number(unicaSalida.recaudacion)).toLocaleString(
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
                  Number(unicaSalida.recaudacion) >= 0
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
                style={{
                  width: `${Math.abs(
                    Number(unicaSalida.recaudacion) / 100
                  ).toFixed(2)}%`,
                }}
              ></div>
            </div>
            <span className="font-bold text-slate-500 text-sm">
              Recuadación
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="bg-white border-slate-300 border-[1px] shadow py-5 px-5 rounded-xl w-full relative max-md:py-2">
            <div className="flex justify-between items-center">
              <p className="text-slate-500 text-lg flex gap-2 max-md:text-sm">
                {Number(
                  Number(unicaSalida.viaticos) +
                    Number(totalSuma) +
                    Number(unicaSalida.refuerzo) +
                    Number(unicaSalida.pago_fletero_espera)
                ).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
                <span className="font-bold text-slate-700 max-md:text-sm">
                  °{" "}
                  {Number(
                    Number(
                      Number(unicaSalida.viaticos) +
                        Number(totalSuma) +
                        Number(unicaSalida.refuerzo) +
                        Number(unicaSalida.pago_fletero_espera)
                    ) / 100000
                  ).toFixed(2)}{" "}
                  %
                </span>
              </p>
              {/* <p className="text-slate-500 text-lg">
                {Number(Number(unicaSalida.recaudacion)).toLocaleString(
                  "es-AR",
                  {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  }
                )}
              </p> */}
            </div>
            <div className="h-2 bg-gray-200 mt-3 rounded-md overflow-hidden">
              <div
                className="h-full bg-red-600 max-md:text-sm"
                style={{
                  width: `${(
                    Number(
                      Number(unicaSalida.viaticos) +
                        Number(totalSuma) +
                        Number(unicaSalida.refuerzo) +
                        Number(unicaSalida.pago_fletero_espera)
                    ) /
                    100 /
                    100
                  ).toFixed(2)}%`,
                }}
              ></div>
            </div>
            <span className="font-bold text-slate-500 text-sm">
              Total gastos
            </span>
          </div>
        </div>
        <div className="flex justify-center items-center border border-gray-300 rounded-xl shadow py-10">
          <div className="w-64 relative">
            <svg viewBox="0 0 36 36" className="overflow-visible">
              {/* Refuerzo */}
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                fill="transparent"
                stroke="#f56565"
                strokeWidth="3.5"
                strokeDasharray={`${Number(refuerzoPercentage)} ${
                  100 - Number(refuerzoPercentage)
                }`}
                transform="rotate(-90 18 18)"
                onMouseEnter={() => handleHover("Refuerzo")}
                onMouseLeave={handleLeave}
              />
              {/* Recaudación */}
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                fill="transparent"
                stroke="#4299e1"
                strokeWidth="3.5"
                strokeDasharray={`${Number(recaudacionPercentage)} ${
                  100 - Number(recaudacionPercentage)
                }`}
                transform={`rotate(${Number(refuerzoPercentage)} 18 18)`}
                onMouseEnter={() => handleHover("Recaudación")}
                onMouseLeave={handleLeave}
              />
              {/* Viáticos */}
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                fill="transparent"
                stroke="#f6e05e"
                strokeWidth="3.5"
                strokeDasharray={`${Number(viaticosPercentage)} ${
                  100 - Number(viaticosPercentage)
                }`}
                transform={`rotate(${
                  Number(refuerzoPercentage) + Number(recaudacionPercentage)
                } 18 18)`}
                onMouseEnter={() => handleHover("Viáticos")}
                onMouseLeave={handleLeave}
              />
              {/* Total Flete Espera */}
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                fill="transparent"
                stroke="#38a169"
                strokeWidth="3.5"
                strokeDasharray={`${Number(totalFleteEsperaPercentage)} ${
                  100 - Number(totalFleteEsperaPercentage)
                }`}
                transform={`rotate(${
                  Number(refuerzoPercentage) +
                  Number(recaudacionPercentage) +
                  Number(viaticosPercentage)
                } 18 18)`}
                onMouseEnter={() => handleHover("Total Flete Espera")}
                onMouseLeave={handleLeave}
              />
              {/* Center text */}
              <text
                x="18"
                y="18"
                textAnchor="middle"
                fontSize="3"
                fill="#4a5568"
                className="font-bold text-gray-700"
                dy=".3em"
              >{`${Number(unicaSalida.recaudacion).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumIntegerDigits: 2,
              })}`}</text>
            </svg>
            {/* Tooltips */}
            {tooltip && (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white text-sm pointer-events-none">
                <div className="bg-gray-800 bg-opacity-90 p-2 rounded-md shadow-md">
                  {tooltip === "Refuerzo" &&
                    `Refuerzo: ${unicaSalida.refuerzo}`}
                  {tooltip === "Recaudación" &&
                    `Recaudación: ${unicaSalida.recaudacion}`}
                  {tooltip === "Viáticos" &&
                    `Viáticos: ${unicaSalida.viaticos}`}
                  {tooltip === "Total Flete Espera" &&
                    `Total Flete Espera: ${unicaSalida.pago_fletero_espera}`}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </section>
  );
};
