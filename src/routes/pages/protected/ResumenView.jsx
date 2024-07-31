import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { obtenerUnicaSalida } from "../../../api/ingresos";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { ImprimirPdfFletes } from "../../../components/pdf/ImprirmirPdfFletes";
import { ImprimirPdf } from "../../../components/pdf/ImprirmirPdf";
import { ImprimirPdfArmadores } from "../../../components/pdf/ImprirmirPdfArmadores";

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
    <section className="h-full max-h-full min-h-screen w-full">
      <div className="bg-gray-800 py-12 px-10 w-1/2 mx-auto rounded-b-2xl max-md:w-full">
        <div className="flex flex-col gap-5">
          <p className="font-bold text-white text-xl text-center">
            Salida obtenida, imprimir los documentos.
          </p>
          <p className="text-white text-xl max-md:text-center">
            Numero de la salida{" "}
            <span className="font-bold text-primary">{params.id}</span>{" "}
          </p>
        </div>
      </div>

      <div className="max-md:flex hidden mt-12  gap-5 max-md:flex-col mx-5 my-6 max-md:h-[10vh] max-md:bg-white max-md:py-5 max-md:px-5 max-md:overflow-y-scroll scrollbar-hidden">
        <PDFDownloadLink
          className="bg-primary text-sm rounded-md px-2 py-2 text-white font-bold"
          fileName={`Control y rendición de viajes documento n° ${params.id}`}
          document={<ImprimirPdf unicaSalida={unicaSalida} />}
        >
          Descargar o imprimir control y rendición de viajes documento.
        </PDFDownloadLink>
        <PDFDownloadLink
          className="bg-primary text-sm rounded-md px-2 py-2 text-white font-bold"
          fileName={` Documento de fletes n° ${params.id}`}
          document={<ImprimirPdfFletes unicaSalida={unicaSalida} />}
        >
          Descargar o imprimir documento de fletes.
        </PDFDownloadLink>
        <PDFDownloadLink
          className="bg-primary text-sm rounded-md px-2 py-2 text-white font-bold"
          fileName={`Documento viaticos, armadores. n° ${params.id}`}
          document={<ImprimirPdfArmadores unicaSalida={unicaSalida} />}
        >
          Descargar o imprimir documento de fletes.
        </PDFDownloadLink>
      </div>

      <div className="max-md:hidden mt-12 flex gap-5 max-md:flex-col mx-5 my-6 max-md:h-[10vh] max-md:bg-white max-md:py-5 max-md:px-5 max-md:overflow-y-scroll">
        <button
          type="button"
          onClick={() =>
            document
              .getElementById("my_modal_rendiciones_contro_viajes")
              .showModal()
          }
          className="flex items-center gap-2 bg-primary px-4 text-white text-sm font-bold rounded-md hover:shadow-md transition-all py-2"
        >
          Descargar Control y Rendicion de Viajes Documento
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6  max-md:hidden"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() =>
            document.getElementById("my_modal_documnto_flete").showModal()
          }
          className="flex items-center gap-2 bg-blue-500 px-4 text-white text-sm font-bold rounded-md hover:shadow-md transition-all py-2"
        >
          Descargar Fletes Documento
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6  max-md:hidden"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() =>
            document.getElementById("my_modal_viaticos_armadores").showModal()
          }
          className="flex items-center gap-2 bg-gray-800 px-4 text-white text-sm font-bold rounded-md hover:shadow-md transition-all py-2"
        >
          Descargar Viaticos Armadores Documento
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 max-md:hidden"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
            />
          </svg>
        </button>
      </div>

      {/* tabla de datos  */}
      <div className="bg-white mx-5 my-5 max-md:overflow-x-auto scrollbar-hidden">
        <table className="table">
          <thead className="">
            <tr className="text-sm text-gray-800">
              <th>Clientes</th>
              <th>Localidad/Entregas</th>
              <th>Chofer Vehiculo</th>
              <th>Chofer</th>
              <th>Total KM Control</th>
              <th>KM Control Precio</th>
              <th>Total KM Flete</th>
              <th>KM Flete Precio</th>
              <th>Espera</th>
            </tr>
          </thead>

          <tbody className="">
            <tr className="text-xs font-medium capitalize">
              <td>
                {unicaSalida?.datos_cliente?.datosCliente.map((c) => (
                  <div key={""} className="font-bold text-slate-700">
                    {c.cliente} ({c.numeroContrato})
                  </div>
                ))}
              </td>
              <td>
                {unicaSalida?.datos_cliente?.datosCliente.map((c) => (
                  <div key={""} className="font-bold text-slate-700">
                    {c.localidad}
                  </div>
                ))}
              </td>
              <td>{unicaSalida.chofer_vehiculo}</td>
              <td>{unicaSalida.chofer}</td>
              <td>{unicaSalida.km_viaje_control} KM</td>
              <td>
                {Number(unicaSalida.km_viaje_control_precio).toLocaleString(
                  "es-AR",
                  {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  }
                )}
              </td>
              <td>{unicaSalida.fletes_km} KM</td>
              <td>
                {Number(unicaSalida.fletes_km_precio).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </td>
              <td>
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

      <article className="grid grid-cols-4 gap-5 mx-5 my-10 max-md:grid-cols-1">
        <div className="bg-white py-5 px-5  text-base max-md:text-sm border border-gray-300 rounded-md">
          <div>
            <h3 className="font-bold text-slate-700 underline capitalize">
              Lugar de salida/Fabrica
            </h3>
            <div className="flex gap-2 font-medium text-gray-700 mt-3 capitalize">
              <p className="font-bold text-slate-700">Lugar de salida</p>
              {unicaSalida.salida}
            </div>
            <div className="flex gap-2 font-medium text-gray-700 mt-3 capitalize">
              <p className="font-bold text-slate-700">Fabrica / Suc.</p>
              {unicaSalida.fabrica}
            </div>
            <div className="flex gap-2 font-medium text-gray-700 mt-3">
              <p className="font-bold text-slate-700 max-md:text-sm capitalize">
                Fecha de salida
              </p>
              {unicaSalida?.created_at?.split("T")[0]}
            </div>
          </div>
        </div>

        <div className="bg-white py-5 px-5  text-base max-md:text-sm border border-gray-300 rounded-md">
          <div>
            <h3 className="font-bold text-slate-700 capitalize underline text-base">
              Gastos distribuidos
            </h3>
            <div className="flex gap-2 font-medium text-gray-700 mt-3">
              <p className="font-bold text-slate-700 capitalize">
                Total control
              </p>
              {Number(unicaSalida.total_control).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumIntegerDigits: 2,
              })}
            </div>
            <div className="flex gap-2 font-medium text-gray-700 mt-3">
              <p className="font-bold text-slate-700 capitalize">Total Flete</p>
              {Number(unicaSalida.total_flete).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumIntegerDigits: 2,
              })}
            </div>
            <div className="flex gap-2 font-medium text-gray-700 mt-3">
              <p className="font-bold text-slate-700 capitalize">
                Espera Flete
              </p>
              {Number(unicaSalida.espera).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumIntegerDigits: 2,
              })}
            </div>
            <div className="flex gap-2 font-medium text-gray-700 mt-3">
              <p className="font-bold text-slate-700 capitalize">
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

      <ModalControlViajes />
      <ModalFletesDocumento />
      <ModalViaticosArmadores />
    </section>
  );
};

export const ModalControlViajes = () => {
  const [unicaSalida, setUnicaSalida] = useState([]);

  const params = useParams();

  useEffect(() => {
    async function loadData() {
      const respuesta = await obtenerUnicaSalida(params.id);

      setUnicaSalida(respuesta.data);
    }

    loadData();
  }, []);

  return (
    <dialog id="my_modal_rendiciones_contro_viajes" className="modal">
      <div className="modal-box max-w-6xl h-full rounded-none scroll-bar">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg mb-2">
          Descargar o imprimir control y rendición de viajes documento.
        </h3>
        <PDFViewer className="w-full h-full">
          <ImprimirPdf unicaSalida={unicaSalida} />
        </PDFViewer>
      </div>
    </dialog>
  );
};

export const ModalFletesDocumento = () => {
  const [unicaSalida, setUnicaSalida] = useState([]);

  const params = useParams();

  useEffect(() => {
    async function loadData() {
      const respuesta = await obtenerUnicaSalida(params.id);

      setUnicaSalida(respuesta.data);
    }

    loadData();
  }, []);

  return (
    <dialog id="my_modal_documnto_flete" className="modal">
      <div className="modal-box max-w-6xl h-full rounded-none scroll-bar">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg mb-2">
          Descargar o imprimir documento de fletes.
        </h3>
        <PDFViewer className="w-full h-full">
          <ImprimirPdfFletes unicaSalida={unicaSalida} />
        </PDFViewer>
      </div>
    </dialog>
  );
};

export const ModalViaticosArmadores = () => {
  const [unicaSalida, setUnicaSalida] = useState([]);

  const params = useParams();

  useEffect(() => {
    async function loadData() {
      const respuesta = await obtenerUnicaSalida(params.id);

      setUnicaSalida(respuesta.data);
    }

    loadData();
  }, []);

  return (
    <dialog id="my_modal_viaticos_armadores" className="modal">
      <div className="modal-box max-w-6xl h-full rounded-none scroll-bar">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg mb-2">
          Descargar documento viaticos, armadores.
        </h3>
        <PDFViewer className="w-full h-full">
          <ImprimirPdfArmadores unicaSalida={unicaSalida} />
        </PDFViewer>
      </div>
    </dialog>
  );
};
