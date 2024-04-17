import { Dialog, Menu, Transition } from "@headlessui/react";
import { useEffect, useState, Fragment } from "react";
import { toast } from "react-toastify";
import { useSalidasContext } from "../../context/SalidasProvider";
import { ModalCrearChoferes } from "./ModalCrearChoferes";
import { ModalVerChoferes } from "./ModalVerChoferes";
import { ModalCrearClienteRemuneracion } from "./ModalCrearClienteRemuneracion";
import { ModalEditarClienteRemuneracion } from "./ModalEditarClienteRemuneracion";
import { useLegalesContext } from "../../context/LegalesProvider";
import client from "../../api/axios";
import io from "socket.io-client";

export const ModalEditarLegales = ({
  isOpen: dos,
  closeModal: tres,
  obtenerID,
}) => {
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

  //useContext
  const { setLegales } = useLegalesContext();

  const { choferes, setChoferes } = useSalidasContext();

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

  //obtenerDatoUnico
  useEffect(() => {
    async function loadData() {
      const res = await client.get(`/legales/${obtenerID}`);

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
  }, [obtenerID]);

  //obtenerChoferes
  useEffect(() => {
    async function loadData() {
      const res = await client.get("/chofer");

      setChoferes(res.data);
    }

    loadData();
  }, []);

  // Utilizar reduce para calcular la suma total de la propiedad totalFlete
  const totalSuma = datosCliente.reduce((acumulador, elemento) => {
    // Convertir la propiedad totalFlete a número y sumarla al acumulador
    return acumulador + parseFloat(elemento.totalFlete);
  }, 0); // Iniciar el acumulador en 0

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
  const [socket, setSocket] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();

    const recaudacion =
      Number(totalSuma) -
      Number(pago_fletero_espera) -
      Number(viaticos) -
      Number(auto) -
      Number(refuerzo);

    const editarSalidas = {
      armador,
      fecha_carga,
      fecha_entrega,
      pago_fletero_espera,
      km_lineal,
      viaticos,
      auto,
      refuerzo,
      recaudacion,
      chofer,
      datos_cliente: { datosCliente },
    };

    try {
      const res = await client.put(`/legales/${obtenerID}`, editarSalidas);

      socket.emit("editar-legal", res);

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

      tres();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const newSocket = io(
      "https://tecnohouseindustrialbackend-production.up.railway.app",
      {
        withCredentials: true,
      }
    );

    setSocket(newSocket);

    const handleEditarSalida = (EditarRemuneracion) => {
      const updateSalida = JSON.parse(EditarRemuneracion?.config?.data);

      setLegales((prevSalidas) => {
        const nuevosSalidas = [...prevSalidas];
        const index = nuevosSalidas.findIndex(
          (salida) => salida.id === salida.id
        );
        if (index !== -1) {
          nuevosSalidas[index] = {
            id: obtenerID,
            armador: updateSalida.armador,
            fecha_carga: updateSalida.fecha_carga,
            fecha_entrega: updateSalida.fecha_entrega,
            pago_fletero_espera: updateSalida.pago_fletero_espera, // Corregido el nombre del campo aquí
            km_lineal: updateSalida.km_lineal,
            viaticos: updateSalida.viaticos,
            auto: updateSalida.auto,
            refuerzo: updateSalida.refuerzo,
            recaudacion: updateSalida.recaudacion,
            chofer: updateSalida.chofer,
            datos_cliente: updateSalida.datos_cliente,
            role_id: updateSalida.role_id,
            usuario: nuevosSalidas[index].usuario,
            created_at: nuevosSalidas[index].created_at,
            updated_at: nuevosSalidas[index].updated_at,
          };
        }
        return nuevosSalidas;
      });
    };

    newSocket.on("editar-legal", handleEditarSalida);

    return () => {
      newSocket.off("editar-legal", handleEditarSalida);
      newSocket.close();
    };
  }, []);

  const [isEdit, setIsEdit] = useState(false);

  const openEdit = () => setIsEdit(true);
  const closeEdit = () => setIsEdit(false);

  const [usuario, setUsuario] = useState("");

  const handleUsuario = (usuario) => setUsuario(usuario);

  return (
    <Menu as="div" className="z-50">
      <Transition appear show={dos} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={tres}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-5/6 max-md:w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="flex justify-end cursor-pointer">
                  <p
                    onClick={tres}
                    className="text-red-700 bg-red-100 py-2 px-2 rounded-xl"
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
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </p>
                </div>

                <div className="text-lg font-bold text-slate-700 mb-3 border-b-[1px] uppercase">
                  Editar la orden legal
                </div>

                <form
                  onSubmit={onSubmit}
                  className="flex flex-col gap-5 max-md:py-2 max-md:px-2 max-md:border-none max-md:shadow-none"
                >
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => openModalChofer()}
                      className="bg-orange-500 py-2 px-4 rounded-xl text-white shadow text-base max-md:text-sm"
                    >
                      Crear choferes
                    </button>
                    <button
                      type="button"
                      onClick={() => openModalVerChofer()}
                      className="bg-green-500 py-2 px-4 rounded-xl text-white shadow text-base max-md:text-sm"
                    >
                      Ver choferes creados
                    </button>
                  </div>
                  <article className="flex flex-col gap-4">
                    <div>
                      <h3 className="font-bold text-base text-slate-700 max-md:text-sm uppercase">
                        Ingresar datos
                      </h3>
                    </div>
                    {/* datos del formulario  */}
                    <div className="flex flex-col gap-6 max-md:gap-6">
                      <div className="grid grid-cols-2 gap-2 w-4/5">
                        <div className="w-full max-md:text-sm">
                          <label className="relative block rounded-xl border border-slate-300 shadow-sm max-md:w-full">
                            <select
                              onChange={(e) => setChofer(e.target.value)}
                              value={chofer}
                              type="text"
                              className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3.5  px-3 text-slate-900 uppercase"
                            >
                              <option value="">Seleccionar chofer</option>
                              {choferes.map((c) => (
                                <option>{c.chofer}</option>
                              ))}
                            </select>

                            <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase">
                              Transportista
                            </span>
                          </label>
                        </div>
                        <div className="w-full">
                          <label className="relative block rounded-xl border border-slate-300 shadow-sm max-md:text-sm">
                            <input
                              onChange={(e) => setArmador(e.target.value)}
                              value={armador}
                              type="text"
                              className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 uppercase px-3 text-slate-900"
                            />

                            <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase">
                              Armador
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-start">
                        <button
                          onClick={() => openModal()}
                          type="button"
                          className="bg-black text-white text-sm py-2 px-4 shadow rounded-xl"
                        >
                          Crear Clientes
                        </button>

                        <div className="rounded-2xl mt-2 border-[1px] border-slate-300 w-full">
                          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
                            <thead className="text-left">
                              <tr>
                                <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                                  Cliente
                                </th>
                                <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                                  Localidad
                                </th>
                                <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                                  Localidad
                                </th>
                                <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                                  Acciones
                                </th>
                              </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                              {datosCliente.map((datos) => (
                                <tr key={datos.id}>
                                  <td className="px-4 py-2 font-medium text-gray-900 uppercase">
                                    {datos.cliente}
                                  </td>
                                  <td className="px-4 py-2 font-medium text-gray-900 uppercase">
                                    {datos.localidad}
                                  </td>
                                  <td className="px-4 py-2 font-medium text-gray-900 uppercase">
                                    {datos.numeroContrato}
                                  </td>
                                  <td className="px-4 py-2 font-medium text-gray-900 uppercase w-[150px] cursor-pointer">
                                    <div className="flex space-x-3">
                                      <button
                                        onClick={() =>
                                          eliminarCliente(datos.cliente)
                                        }
                                        type="button"
                                        className="bg-red-100 py-2 px-5 text-center rounded-xl text-red-800 uppercase"
                                      >
                                        Eliminar
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          handleUsuario(datos.cliente),
                                            openEdit();
                                        }}
                                        className="bg-green-100 py-2 px-5 text-center rounded-xl uppercase text-green-700"
                                      >
                                        Editar
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* <div className="flex gap-3 max-md:grid max-md:grid-cols-2 max-md:flex-none">
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
                              <p className="max-md:text-sm">
                                Nombre y Apellido{" "}
                                <span className="font-bold capitalize text-slate-700">
                                  {c.cliente}
                                </span>
                              </p>
                              <p className="max-md:text-sm">
                                Localidad{" "}
                                <span className="font-bold capitalize text-slate-700">
                                  {c.localidad}
                                </span>
                              </p>
                              <p className="max-md:text-sm">
                                Numero de contrato{" "}
                                <span className="font-bold capitalize text-slate-700">
                                  {c.numeroContrato}
                                </span>
                              </p>
                              <p className="max-md:text-sm">
                                Metros Cuadrados{" "}
                                <span className="font-bold capitalize text-slate-700">
                                  {c.metrosCuadrados}
                                </span>
                              </p>

                              <p className="max-md:text-sm">
                                Total del flete{" "}
                                <span className="font-bold capitalize text-slate-700">
                                  {Number(c.totalFlete).toLocaleString(
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
                          ))}
                        </div> */}
                      </div>
                    </div>
                  </article>

                  <article className="flex flex-col gap-5">
                    <div>
                      <h3 className="font-bold text-base text-slate-700 max-md:text-sm uppercase">
                        Fechas de carga/entrega
                      </h3>
                    </div>
                    <div className="flex gap-5 w-4/5">
                      <div className="max-md:w-full w-full">
                        <label className="relative block rounded-xl border border-slate-300 shadow-sm max-md:text-sm">
                          <input
                            onChange={(e) => setFechaCarga(e.target.value)}
                            value={fecha_carga}
                            type="date"
                            className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3.5  px-3 text-slate-900 max-md:text-sm"
                          />

                          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase">
                            Fecha de carga
                          </span>
                        </label>
                      </div>
                      <div className="max-md:w-full w-full">
                        <label className=" relative block rounded-xl border border-slate-300 shadow-sm max-md:text-sm">
                          <input
                            onChange={(e) => setFechaEntrega(e.target.value)}
                            value={fecha_entrega}
                            type="date"
                            className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3.5  px-3 text-slate-900 max-md:text-sm"
                          />

                          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase">
                            Fecha de entrega
                          </span>
                        </label>
                      </div>
                    </div>
                  </article>

                  <article className="flex flex-col gap-5">
                    <div>
                      <h3 className="font-bold text-base text-slate-700 uppercase max-md:text-sm">
                        Totales
                      </h3>
                    </div>
                    <div className="flex items-center">
                      <div className="flex gap-5 bg-white border-[1px] border-slate-300 shadow py-2 px-6 rounded-xl">
                        <div className="flex gap-2 items-center">
                          <p className="text-orange-500 font-bold max-md:text-sm uppercase">
                            Total en fletes
                          </p>
                          <p className="font-bold text-slate-700 max-md:text-sm">
                            {Number(totalSuma).toLocaleString("es-AR", {
                              style: "currency",
                              currency: "ARS",
                              minimumIntegerDigits: 2,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div className="grid grid-cols-2 gap-2 items-center">
                        <label className="w-full relative block rounded-xl border border-slate-300 bg-white shadow-smmax-md:w-full max-md:flex max-md:items-center">
                          <span className="font-bold text-slate-500 px-3">
                            $
                          </span>
                          <input
                            onChange={(e) => setKmLineal(e.target.value)}
                            value={km_lineal}
                            type="text"
                            className="max-md:w-full peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 px-3 text-slate-900"
                          />

                          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase">
                            Total KM lineal
                          </span>
                        </label>

                        <span className="font-bold text-slate-700">
                          {km_lineal} KM FINAL
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 items-center">
                        <label className="w-full relative block rounded-xl border border-slate-300 bg-white shadow-smmax-md:w-full max-md:flex max-md:items-center">
                          <span className="font-bold text-slate-500 px-3">
                            $
                          </span>
                          <input
                            onChange={(e) => setPagoFletero(e.target.value)}
                            value={pago_fletero_espera}
                            type="text"
                            className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3  px-3 text-slate-900"
                          />

                          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase">
                            Pago fletero + espera
                          </span>
                        </label>

                        <span className="font-bold text-slate-700 max-md:mb-6">
                          {Number(pago_fletero_espera).toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                            minimumIntegerDigits: 2,
                          })}{" "}
                          VALOR ASIGNADO
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 items-center">
                        <label className="w-full relative block rounded-xl border border-slate-300 bg-white shadow-smmax-md:w-full max-md:flex max-md:items-center">
                          <span className="font-bold text-slate-500 px-3">
                            $
                          </span>
                          <input
                            onChange={(e) => setViaticos(e.target.value)}
                            value={viaticos}
                            type="text"
                            className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3  px-3 text-slate-900"
                          />

                          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase">
                            Total en viaticos
                          </span>
                        </label>

                        <span className="font-bold text-slate-700 max-md:mb-5">
                          {Number(viaticos).toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                            minimumIntegerDigits: 2,
                          })}{" "}
                          VALOR ASIGNADO
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 items-center">
                        <label className="w-full relative block rounded-xl border border-slate-300 bg-white shadow-smmax-md:w-full max-md:flex max-md:items-center">
                          <span className="font-bold text-slate-500 px-3">
                            $
                          </span>
                          <input
                            onChange={(e) => setAuto(e.target.value)}
                            value={auto}
                            type="text"
                            className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3  px-3 text-slate-900"
                          />

                          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase">
                            Total Auto
                          </span>
                        </label>

                        <span className="font-bold text-slate-700 max-md:mb-5">
                          {Number(auto).toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                            minimumIntegerDigits: 2,
                          })}{" "}
                          VALOR ASIGNADO
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 items-center">
                        <label className="w-full relative block rounded-xl border border-slate-300 bg-white shadow-smmax-md:w-full max-md:flex max-md:items-center">
                          <span className="font-bold text-slate-500 px-3">
                            $
                          </span>
                          <input
                            onChange={(e) => setRefuerzo(e.target.value)}
                            value={refuerzo}
                            type="text"
                            className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3  px-3 text-slate-900"
                          />

                          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase">
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
                    </div>

                    <div className="flex">
                      <div className="flex max-md:flex-col max-md:w-full max-md:gap-1 max-md:py-1 max-md:items-start gap-3 bg-white border-[1px] border-slate-300 shadow py-4 px-4 rounded-xl mt-5 items-center">
                        <span className="font-bold text-slate-700 max-md:text-sm max-md:uppercase uppercase text-sm">
                          Recaudación final
                        </span>

                        <p
                          className={
                            totalSuma -
                              pago_fletero_espera -
                              viaticos -
                              auto -
                              refuerzo <
                            0
                              ? "text-red-500 font-bold text-lg"
                              : "text-green-500 font-bold text-lg"
                          }
                        >
                          {Number(
                            totalSuma -
                              pago_fletero_espera -
                              viaticos -
                              auto -
                              refuerzo
                          ).toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                            minimumIntegerDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                  </article>

                  <div>
                    <button
                      type="submit"
                      className="bg-green-100 text-green-700 rounded-xl hover:shadow-md py-3 uppercase text-sm hover:bg-green-500 hover:text-white px-6 max-md:text-sm transition-all ease-linear flex gap-2 items-center"
                    >
                      Editar la orden legal
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
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </button>
                  </div>
                </form>

                <ModalCrearClienteRemuneracion
                  setDatosCliente={setDatosCliente}
                  isOpen={isOpen}
                  closeModal={closeModal}
                  datosCliente={datosCliente}
                />
                <ModalCrearChoferes
                  isOpen={isOpenChofer}
                  closeModal={closeModalChofer}
                />

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
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Menu>
  );
};
