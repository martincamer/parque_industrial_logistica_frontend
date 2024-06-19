import { useEffect, useState, Fragment } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { ModalCrearChoferes } from "../../components/Modales/ModalCrearChoferes";
import { ModalVerChoferes } from "../../components/Modales/ModalVerChoferes";
import { ModalCrearClienteRemuneracion } from "../../components/Modales/ModalCrearClienteRemuneracion";
import { crearNuevoLegal } from "../../api/ingresos";
import { ModalEditarClienteRemuneracion } from "../../components/Modales/ModalEditarClienteRemuneracion";
import { useSalidasContext } from "../../context/SalidasProvider";
import { useLegalesContext } from "../../context/LegalesProvider";
import { toast } from "react-toastify";
import client from "../../api/axios";
import io from "socket.io-client";

export const ModalCrearLegales = ({ isOpen: dos, closeModal: tres }) => {
  const { setLegalesReal } = useLegalesContext();
  const [error, setError] = useState("");

  //useContext
  const { choferes, setChoferes } = useSalidasContext();

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
  //eliminar cliente
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

  // Utilizar reduce para calcular la suma total de la propiedad totalFlete
  const totalSuma = datosCliente.reduce((acumulador, elemento) => {
    // Convertir la propiedad totalFlete a número y sumarla al acumulador
    return acumulador + parseFloat(elemento.totalFlete);
  }, 0);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_URL, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("nuevo-legal", (nuevaSalida) => {
      setLegalesReal(nuevaSalida);
    });

    return () => newSocket.close();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    const recaudacion =
      Number(totalSuma) -
      Number(pago_fletero_espera) -
      Number(viaticos) -
      Number(auto) -
      Number(refuerzo);

    try {
      const res = await crearNuevoLegal({
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

      if (socket) {
        socket.emit("nuevo-legal", res.data);
      }

      toast.success("¡Legal creado correctamente!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: {
          padding: "12px",
          borderRadius: "15px",
          fontWeight: "bold",
          textTransform: "uppercase",
        },
      });

      tres();
    } catch (error) {
      setError(error.response.data.message);

      setTimeout(() => {
        setError("");
      }, 1500);
    }
  };

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

            {/* This element is to trick the browser into centering the modal contents. */}
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
              <div className="inline-block w-5/6 max-md:w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-none">
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

                <div className="text-xl font-bold text-blue-500 mb-5 border-b-2 border-blue-500">
                  Crear nueva orden legal
                </div>

                {error && error.length > 0 && (
                  <div className="flex justify-center">
                    <p className="bg-red-100 py-3 px-4 text-center mb-4 rounded-2xl uppercase text-sm text-red-800 font-bold">
                      {error}
                    </p>
                  </div>
                )}

                <form
                  onSubmit={onSubmit}
                  className="flex flex-col gap-5 max-md:py-2 max-md:px-2 max-md:border-none max-md:shadow-none"
                >
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => openModalChofer()}
                      className="bg-blue-500 px-4 text-white rounded-full font-bold text-sm py-1.5"
                    >
                      Crear choferes
                    </button>
                    <button
                      type="button"
                      onClick={() => openModalVerChofer()}
                      className="bg-orange-500 px-4 text-white rounded-full font-bold text-sm py-1.5"
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
                      <div className="grid grid-cols-3 gap-2 w-4/5">
                        <div className="w-full max-md:text-sm">
                          <label className="relative block rounded-xl border border-slate-300 max-md:w-full">
                            <select
                              onChange={(e) => setChofer(e.target.value)}
                              value={chofer}
                              type="text"
                              className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-5 font-semibold text-sm  px-3 text-slate-900 uppercase w-full"
                            >
                              <option value="">Seleccionar chofer</option>
                              {choferes.map((c) => (
                                <option key={c.id}>{c.chofer}</option>
                              ))}
                            </select>

                            <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase font-bold text-blue-500">
                              Transportista
                            </span>
                          </label>
                        </div>
                        <div className="w-full">
                          <label className="relative block rounded-xl border border-slate-300 max-md:text-sm">
                            <input
                              onChange={(e) => setArmador(e.target.value)}
                              value={armador}
                              type="text"
                              className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-5 font-bold text-sm uppercase px-3 text-slate-900"
                            />

                            <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase font-bold text-blue-500">
                              Armador
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-start">
                        <button
                          onClick={() => openModal()}
                          type="button"
                          className="bg-green-500 text-white font-semibold text-sm py-1.5 rounded-full flex gap-2 items-center px-5"
                        >
                          Crear Clientes
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
                              d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                            />
                          </svg>
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
                                  Total mtrs
                                </th>
                                <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                                  Total del flete
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
                                    {datos.cliente} ({datos.numeroContrato})
                                  </td>
                                  <td className="px-4 py-2 font-medium text-gray-900 uppercase">
                                    {datos.localidad}
                                  </td>
                                  <td className="px-4 py-2 font-medium text-gray-900 uppercase">
                                    {datos.metrosCuadrados} Mts
                                  </td>
                                  <td className="px-4 py-2 text-gray-900 font-bold uppercase">
                                    {Number(datos.totalFlete).toLocaleString(
                                      "es-AR",
                                      {
                                        style: "currency",
                                        currency: "ARS",
                                        minimumIntegerDigits: 2,
                                      }
                                    )}
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
                      </div>
                    </div>
                  </article>

                  <article className="flex flex-col gap-5">
                    <div>
                      <h3 className="font-bold text-base text-slate-700 max-md:text-sm uppercase">
                        Fechas de carga/entrega
                      </h3>
                    </div>
                    <div className="flex gap-5 w-4/12">
                      <div className="max-md:w-full w-full">
                        <label className="relative block rounded-xl border border-slate-300 shadow-sm max-md:text-sm">
                          <input
                            onChange={(e) => setFechaCarga(e.target.value)}
                            value={fecha_carga}
                            type="date"
                            className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-5 font-bold text-sm px-3 text-slate-900 max-md:text-sm w-full"
                          />

                          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase font-bold text-blue-500">
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
                            className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-5 text-sm font-bold px-3 text-slate-900 max-md:text-sm w-full"
                          />

                          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase font-bold text-blue-500">
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
                          {/* <span className="font-bold text-slate-500 px-3">
                            $
                          </span> */}
                          <input
                            onChange={(e) => setKmLineal(e.target.value)}
                            value={km_lineal}
                            type="text"
                            className="max-md:w-full peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-5 font-bold text-sm px-3 text-slate-900"
                          />

                          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase font-bold text-blue-500">
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
                            className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-5 text-sm font-bold px-3 text-slate-900"
                          />
                          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase font-bold text-blue-500">
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
                            className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-5 text-sm font-bold px-3 text-slate-900"
                          />

                          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase font-bold text-blue-500">
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
                            className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-5 font-bold text-sm px-3 text-slate-900"
                          />

                          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase font-bold text-blue-500">
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
                            className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-5 text-sm font-bold px-3 text-slate-900"
                          />

                          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase font-bold text-blue-500">
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
                      <div className="flex max-md:flex-col max-md:w-full max-md:gap-1 max-md:py-1 max-md:items-start gap-3 bg-white border border-blue-500 py-4 px-4 mt-5 items-center">
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
                              ? "text-red-600 font-bold"
                              : "text-blue-500 font-bold"
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
                      className="flex items-center font-bold py-2 px-4  rounded-full bg-blue-500 text-white gap-2 text-sm hover:bg-orange-500 transition-all"
                    >
                      Crear nueva orden legal
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
                          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
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
