import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useSalidasContext } from "../../../context/SalidasProvider";
import { ModalCrearChoferes } from "../../../components/Modales/ModalCrearChoferes";
import { ModalVerChoferes } from "../../../components/Modales/ModalVerChoferes";
import { ModalCrearClienteRemuneracion } from "../../../components/Modales/ModalCrearClienteRemuneracion";
import { ModalEditarClienteRemuneracion } from "../../../components/Modales/ModalEditarClienteRemuneracion";
import { useLegalesContext } from "../../../context/LegalesProvider";
import client from "../../../api/axios";

export const EditarLegales = () => {
  const fechaActual = new Date();

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

  const nombresDias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const numeroDiaActual = fechaActual.getDay(); // Obtener el día del mes actual

  const numeroMesActual = fechaActual.getMonth() + 1; // Obtener el mes actual

  const nombreMesActual = nombresMeses[numeroMesActual - 1]; // Obtener el nombre del mes actual

  const nombreDiaActual = nombresDias[numeroDiaActual]; // Obtener el nombre del día actual

  const { legales, setLegales } = useLegalesContext();

  const { choferes, setChoferes } = useSalidasContext();

  const params = useParams();

  //obtenerDatoUnico
  useEffect(() => {
    async function loadData() {
      const res = await client.get(`/legales/${params.id}`);

      const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      setChofer(res.data.chofer);
      setArmador(res.data.armador);
      setFechaCarga(formatDate(res.data.fecha_carga));
      setFechaEntrega(formatDate(res.data.fecha_entrega));
      setKmLineal(res.data.km_lineal);
      setPagoFletero(res.data.pago_fletero_espera);
      setViaticos(res.data.viaticos);
      setRefuerzo(res.data.refuerzo);
      setAuto(res.data.auto);
      setDatosCliente(res.data.datos_cliente?.datosCliente);
    }

    loadData();
  }, [params.id]);

  //obtenerChoferes
  useEffect(() => {
    async function loadData() {
      const res = await client.get("/chofer");

      setChoferes(res.data);
    }

    loadData();
  }, []);

  //daots del cliente
  const [datosCliente, setDatosCliente] = useState([]);
  // //eliminar cliente
  const eliminarCliente = (nombreClienteAEliminar) => {
    // Filtrar la lista de clientes para obtener una nueva lista sin el cliente a eliminar
    const nuevaListaClientes = datosCliente.filter(
      (cliente) => cliente.cliente !== nombreClienteAEliminar
    );
    // Actualizar el estado con la nueva lista de clientes
    setDatosCliente(nuevaListaClientes);
  };

  //modales
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenChofer, setIsOpenChofer] = useState(false);
  const [isOpenVerChofer, setIsOpenVerChofer] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModalChofer = () => {
    setIsOpenChofer(true);
  };

  const closeModalChofer = () => {
    setIsOpenChofer(false);
  };

  const openModalVerChofer = () => {
    setIsOpenVerChofer(true);
  };

  const closeModalVerChofer = () => {
    setIsOpenVerChofer(false);
  };

  // Utilizar reduce para calcular la suma total de la propiedad totalFlete
  const totalSuma = datosCliente.reduce((acumulador, elemento) => {
    // Convertir la propiedad totalFlete a número y sumarla al acumulador
    return acumulador + parseFloat(elemento.totalFlete);
  }, 0); // Iniciar el acumulador en 0

  //formulario submit
  const navigate = useNavigate();
  //estados del formulario
  //estados del formulario
  const [chofer, setChofer] = useState("");
  const [armador, setArmador] = useState("");
  const [fecha_carga, setFechaCarga] = useState("");
  const [fecha_entrega, setFechaEntrega] = useState("");
  const [km_lineal, setKmLineal] = useState("");
  const [pago_fletero_espera, setPagoFletero] = useState("");
  const [viaticos, setViaticos] = useState("");
  const [refuerzo, setRefuerzo] = useState("");
  const [auto, setAuto] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const recaudacion =
        Number(totalSuma) -
        Number(pago_fletero_espera) -
        Number(viaticos) -
        Number(auto) -
        Number(refuerzo);
      // e.preventDefault();
      const res = await client.put(`/legales/${params.id}`, {
        armador,
        fecha_carga,
        fecha_entrega,
        pago_fletero_espera, // Corregido el nombre del campo aquí
        km_lineal,
        viaticos,
        auto,
        refuerzo,
        recaudacion,
        chofer,
        datos_cliente: { datosCliente },
      });

      const tipoExistenteIndex = legales.findIndex(
        (tipo) => tipo.id == params.id
      );

      setLegales((prevTipos) => {
        const newTipos = [...prevTipos];
        const updateRemuneracion = JSON.parse(res.config.data); // Convierte el JSON a objeto
        newTipos[tipoExistenteIndex] = {
          id: params.id,
          armador: updateRemuneracion.armador,
          fecha_carga: updateRemuneracion.fecha_carga,
          fecha_entrega: updateRemuneracion.fecha_entrega,
          pago_fletero_espera: updateRemuneracion.pago_fletero_espera, // Corregido el nombre del campo aquí
          km_lineal: updateRemuneracion.km_lineal,
          viaticos: updateRemuneracion.viaticos,
          auto: updateRemuneracion.auto,
          refuerzo: updateRemuneracion.refuerzo,
          recaudacion: updateRemuneracion.recaudacion,
          chofer: updateRemuneracion.chofer,
          datos_cliente: updateRemuneracion.datos_cliente,
          role_id: updateRemuneracion.role_id,
          usuario: newTipos[tipoExistenteIndex].usuario,
          created_at: newTipos[tipoExistenteIndex].created_at,
          updated_at: newTipos[tipoExistenteIndex].updated_at,
        };
        return newTipos;
      });

      toast.success("¡Legales editada correctamente!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      setTimeout(() => {
        navigate("/legales");
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const [isEdit, setIsEdit] = useState(false);

  const openEdit = () => setIsEdit(true);
  const closeEdit = () => setIsEdit(false);
  const [usuario, setUsuario] = useState("");

  const handleUsuario = (usuario) => setUsuario(usuario);

  return (
    <section className="w-full h-full min-h-full max-h-full px-12 max-md:px-4 flex flex-col gap-10 pb-36 py-14 relative">
      <ToastContainer />
      <div className="absolute right-28 text-white bg-slate-800 py-2 px-6 rounded-xl font-bold max-md:hidden">
        Mes {nombreMesActual}, Día {nombreDiaActual}
      </div>

      <div className="bg-white border-slate-300 border-[1px] py-8 px-5 rounded-xl md:max-w-xs max-md:w-full flex justify-center shadow max-md:py-4 max-md:px-4 max-md:items-start">
        <div className="text-lg font-bold uppercase text-green-500 flex max-md:items-start max-md:w-full">
          <p className="border-b-[3px] border-slate-700 max-md:text-base">
            Editar legales N°{" "}
            <span className="text-slate-700">{params.id}</span>
          </p>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className=" border-slate-300 border-[1px] py-12 px-10 rounded-xl shadow flex flex-col gap-5 max-md:gap-1 h-full max-h-full max-md:py-4 max-md:px-3"
      >
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => openModalChofer()}
            className="bg-orange-500 py-2 px-4 rounded-xl text-white shadow text-base max-md:py-3 max-md:px-4 max-md:text-sm"
          >
            Crear choferes
          </button>
          <button
            type="button"
            onClick={() => openModalVerChofer()}
            className="bg-green-500 py-2 px-4 rounded-xl text-white shadow text-base max-md:py-3 max-md:px-4 max-md:text-sm"
          >
            Ver choferes creados
          </button>
        </div>
        <article className="flex flex-col gap-2 mt-6">
          <div>
            <h3 className="font-bold text-xl text-slate-700 max-md:text-sm max-md:uppercase">
              Ingresar datos
            </h3>
          </div>
          {/* datos del formulario  */}
          <div className="flex flex-col gap-3 mt-5 max-md:gap-2">
            <div className="w-1/4 max-md:w-full max-md:text-sm">
              <label className="relative block rounded-xl border border-slate-300 shadow-sm">
                <select
                  onChange={(e) => setChofer(e.target.value)}
                  value={chofer}
                  type="text"
                  className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3  px-3 text-slate-900"
                >
                  <option value="">Seleccionar chofer</option>
                  {choferes.map((c) => (
                    <option>{c.chofer}</option>
                  ))}
                </select>

                <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base">
                  Transportista
                </span>
              </label>
            </div>
            <div className="w-1/4 mt-3 max-md:w-full max-md:text-sm">
              <label className="relative block rounded-xl border border-slate-300 shadow-sm">
                <input
                  onChange={(e) => setArmador(e.target.value)}
                  value={armador}
                  type="text"
                  className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3  px-3 text-slate-900"
                />

                <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base">
                  Armador
                </span>
              </label>
            </div>
            <div className="flex flex-col gap-2 items-start mt-3">
              <button
                onClick={() => openModal()}
                type="button"
                className="bg-black text-white text-sm py-2 px-4 shadow rounded-xl"
              >
                Crear Clientes
              </button>

              <div className="md:flex gap-3 mt-2 max-md:grid max-md:grid-cols-2">
                {datosCliente.map((c, index) => (
                  <div
                    key={index}
                    className="bg-white border-[1px] border-slate-300 rounded-xl py-8 px-4 relative shadow"
                  >
                    <div
                      className="absolute top-2 right-4 cursor-pointer"
                      onClick={() => eliminarCliente(c.cliente)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-red-800"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    </div>
                    <div
                      className="absolute top-2 right-10 cursor-pointer"
                      onClick={() => {
                        handleUsuario(c.cliente), openEdit();
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </div>
                    <p className="text-sm">
                      Nombre y Apellido{" "}
                      <span className="font-bold capitalize text-slate-700">
                        {c.cliente}
                      </span>
                    </p>
                    <p className="text-sm">
                      Localidad{" "}
                      <span className="font-bold capitalize text-slate-700">
                        {c.localidad}
                      </span>
                    </p>
                    <p className="text-sm">
                      Numero de contrato{" "}
                      <span className="font-bold capitalize text-slate-700">
                        {c.numeroContrato}
                      </span>
                    </p>
                    <p className="text-sm">
                      Metros Cuadrados{" "}
                      <span className="font-bold capitalize text-slate-700">
                        {c.metrosCuadrados}
                      </span>
                    </p>

                    <p className="text-sm">
                      Total del flete{" "}
                      <span className="font-bold capitalize text-slate-700">
                        {Number(c.totalFlete).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                          minimumIntegerDigits: 2,
                        })}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>

        <article className="flex flex-col gap-2 w-1/2 max-md:w-full">
          <div>
            <h3 className="font-bold text-xl text-slate-700 max-md:text-sm max-md:uppercase">
              Fechas de carga/entrega
            </h3>
          </div>
          <div className="flex gap-5 max-md:gap-4 max-md:flex-col">
            <div className="w-1/4 mt-3 max-md:w-full">
              <label className="relative block rounded-xl border border-slate-300 shadow-sm max-md:text-sm">
                <input
                  onChange={(e) => setFechaCarga(e.target.value)}
                  value={fecha_carga}
                  type="date"
                  className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3  px-3 text-slate-900"
                />

                <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base">
                  Fecha de carga
                </span>
              </label>
            </div>
            <div className="w-1/4 mt-3 max-md:w-full">
              <label className="relative block rounded-xl border border-slate-300 shadow-sm max-md:text-sm">
                <input
                  onChange={(e) => setFechaEntrega(e.target.value)}
                  value={fecha_entrega}
                  type="date"
                  className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3  px-3 text-slate-900"
                />

                <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base">
                  Fecha de entrega
                </span>
              </label>
            </div>
          </div>
        </article>

        <article className="flex flex-col gap-2 w-1/2 max-md:w-full max-md:gap-5 max-md:mt-5">
          <div>
            <h3 className="font-bold text-xl text-slate-700 max-md:uppercase max-md:text-sm">
              Totales
            </h3>
          </div>
          <div className="flex items-center mt-2 mb-4">
            <div className="flex gap-5 bg-white border-[1px] border-slate-300 shadow py-2 px-6 rounded-xl max-md:text-base max-md:w-full">
              <div>
                <p className="text-orange-500 font-bold">Total en fletes</p>
                <p className="font-bold text-slate-700">
                  {Number(totalSuma).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 items-center max-md:w-full max-md:flex-col max-md:items-start max-md:gap-0">
            <label className="relative block rounded-xl border border-slate-300 bg-white shadow-sm mb-3">
              <span className="font-bold text-slate-500 px-3">$</span>
              <input
                onChange={(e) => setKmLineal(e.target.value)}
                value={km_lineal}
                type="text"
                className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3  px-3 text-slate-900"
              />

              <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base">
                Total KM lineal
              </span>
            </label>

            <span className="font-bold text-slate-700">
              {km_lineal} KM FINAL
            </span>
          </div>

          <div className="flex gap-3 items-center max-md:w-full max-md:flex-col max-md:items-start max-md:gap-0">
            <label className="relative block rounded-xl border border-slate-300 bg-white shadow-sm mb-3 max-md:text-sm">
              <span className="font-bold text-slate-500 px-3">$</span>
              <input
                onChange={(e) => setPagoFletero(e.target.value)}
                value={pago_fletero_espera}
                type="text"
                className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3  px-3 text-slate-900"
              />

              <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base">
                Pago fletero + espera
              </span>
            </label>

            <span className="font-bold text-slate-700">
              {Number(pago_fletero_espera).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumIntegerDigits: 2,
              })}{" "}
              VALOR ASIGNADO
            </span>
          </div>

          <div className="flex gap-3 items-center max-md:w-full max-md:flex-col max-md:items-start max-md:gap-0">
            <label className="relative block rounded-xl border border-slate-300 bg-white shadow-sm mb-3 max-md:text-sm">
              <span className="font-bold text-slate-500 px-3">$</span>
              <input
                onChange={(e) => setViaticos(e.target.value)}
                value={viaticos}
                type="text"
                className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3  px-3 text-slate-900"
              />

              <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base">
                Total en viaticos
              </span>
            </label>

            <span className="font-bold text-slate-700">
              {Number(viaticos).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumIntegerDigits: 2,
              })}{" "}
              VALOR ASIGNADO
            </span>
          </div>

          <div className="flex gap-3 items-center max-md:w-full max-md:flex-col max-md:items-start max-md:gap-0">
            <label className="relative block rounded-xl border border-slate-300 bg-white shadow-sm mb-3 max-md:text-sm">
              <span className="font-bold text-slate-500 px-3">$</span>
              <input
                onChange={(e) => setAuto(e.target.value)}
                value={auto}
                type="text"
                className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3  px-3 text-slate-900"
              />

              <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base">
                Total en auto
              </span>
            </label>

            <span className="font-bold text-slate-700">
              {Number(auto).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumIntegerDigits: 2,
              })}{" "}
              VALOR ASIGNADO
            </span>
          </div>

          <div className="flex gap-3 items-center max-md:w-full max-md:flex-col max-md:items-start max-md:gap-0">
            <label className="relative block rounded-xl border border-slate-300 bg-white shadow-sm">
              <span className="font-bold text-slate-500 px-3">$</span>
              <input
                onChange={(e) => setRefuerzo(e.target.value)}
                value={refuerzo}
                type="text"
                className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3  px-3 text-slate-900"
              />

              <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base">
                Total refuerzo
              </span>
            </label>

            <span className="font-bold text-slate-700">
              {Number(refuerzo).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumIntegerDigits: 2,
              })}{" "}
              VALOR ASIGNADO
            </span>
          </div>
        </article>

        <div className="flex mb-4">
          <div className="flex gap-3 bg-white border-[1px] border-slate-300 shadow py-4 px-4 rounded-xl mt-5">
            <span className="font-bold text-slate-700 text-lg">
              Recaudación final
            </span>

            <p className="text-red-500 font-bold text-lg">
              {Number(
                totalSuma - pago_fletero_espera - viaticos - auto - refuerzo
              ).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumIntegerDigits: 2,
              })}
            </p>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="bg-black text-white rounded-xl shadow py-2 px-6 max-md:text-sm"
          >
            Editar legal
          </button>
        </div>
      </form>

      <ModalCrearClienteRemuneracion
        setDatosCliente={setDatosCliente}
        isOpen={isOpen}
        closeModal={closeModal}
        datosCliente={datosCliente}
      />
      <ModalCrearChoferes isOpen={isOpenChofer} closeModal={closeModalChofer} />

      <ModalVerChoferes
        isOpen={isOpenVerChofer}
        closeModal={closeModalVerChofer}
      />

      <ModalEditarClienteRemuneracion
        isOpen={isEdit}
        closeModal={closeEdit}
        usuario={usuario}
        datosCliente={datosCliente}
        setDatosCliente={setDatosCliente}
      />
    </section>
  );
};
