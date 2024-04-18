import { Dialog, Menu, Transition } from "@headlessui/react";
import { useEffect, useState, Fragment } from "react";
import { useSalidasContext } from "../../context/SalidasProvider";
import { ModalCrearCliente } from "../../components/Modales/ModalCrearCliente";
import { ModalCrearChoferes } from "../../components/Modales/ModalCrearChoferes";
import { ModalVerChoferes } from "../../components/Modales/ModalVerChoferes";
import { ModalEditarClienteSalida } from "../../components/Modales/ModalEditarClienteSalida";
import { toast } from "react-toastify";
import client from "../../api/axios";
import io from "socket.io-client";

export const ModalEditarSalida = ({
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
  const { salidasMensuales, setSalidasMensuales } = useSalidasContext();
  const { choferes, setChoferes } = useSalidasContext();

  const [salidas, setSalidas] = useState([]);

  //obtenerDatoUnico
  useEffect(() => {
    async function loadData() {
      const res = await client.get(`/salidas/${obtenerID}`);

      setSalidas(res.data);

      setChofer(res.data.chofer || "");
      setFabrica(res.data.fabrica || "");
      setSalida(res.data.salida || "");
      setKmViajeControl(res.data.km_viaje_control);
      setKmViajeControlPrecio(res.data.km_viaje_control_precio);
      setKmFletes(res.data.fletes_km);
      setKmFletesPrecio(res.data.fletes_km_precio);
      setArmadores(res.data.armadores);
      setTotalViaticos(res.data.total_viaticos);
      setMotivo(res.data.motivo);
      setSalida(res.data.salida);
      setFabrica(res.data.fabrica);
      setEspera(res.data.espera);

      setChoferVehiculo(res.data.chofer_vehiculo);

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

  //estados del formulario
  const [chofer, setChofer] = useState("");
  const [km_viaje_control, setKmViajeControl] = useState("");
  const [km_viaje_control_precio, setKmViajeControlPrecio] = useState("");
  const [fletes_km, setKmFletes] = useState("");
  const [fletes_km_precio, setKmFletesPrecio] = useState("");
  const [armadores, setArmadores] = useState("");
  const [total_viaticos, setTotalViaticos] = useState("");
  const [motivo, setMotivo] = useState("");
  const [salida, setSalida] = useState("");
  const [fabrica, setFabrica] = useState("");
  const [espera, setEspera] = useState("");
  const [chofer_vehiculo, setChoferVehiculo] = useState("");

  const [socket, setSocket] = useState(null);

  const onSubmit = async () => {
    const salidasNuevas = {
      chofer,
      km_viaje_control,
      km_viaje_control_precio,
      fletes_km,
      fletes_km_precio,
      armadores,
      total_viaticos,
      motivo,
      salida,
      fabrica,
      total_control: Number(km_viaje_control * km_viaje_control_precio),
      total_flete: Number(fletes_km * fletes_km_precio),
      espera,
      chofer_vehiculo,
      datos_cliente: { datosCliente },
    };

    try {
      const res = await client.put(`/salidas/${obtenerID}`, salidasNuevas);

      socket.emit("editar-salida", res);

      toast.success("¡Salida editada correctamente!", {
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
      // "http://localhost:4000",
      {
        withCredentials: true,
      }
    );

    setSocket(newSocket);

    const handleEditarSalida = (editarSalida) => {
      const updateSalida = JSON.parse(editarSalida?.config?.data);

      setSalidasMensuales((prevSalidas) => {
        const nuevosSalidas = [...prevSalidas];
        const index = nuevosSalidas.findIndex(
          (salida) => salida.id === salida.id
        );
        if (index !== -1) {
          nuevosSalidas[index] = {
            id: nuevosSalidas[index]?.id,
            chofer: updateSalida.chofer,
            km_viaje_control: updateSalida.km_viaje_control,
            km_viaje_control_precio: updateSalida.km_viaje_control_precio,
            fletes_km: updateSalida.fletes_km,
            fletes_km_precio: updateSalida.fletes_km_precio,
            armadores: updateSalida.armadores,
            total_viaticos: updateSalida.total_viaticos,
            motivo: updateSalida.motivo,
            fabrica: updateSalida.fabrica,
            total_control: updateSalida.total_control,
            total_flete: updateSalida.total_flete,
            espera: updateSalida.espera,
            chofer_vehiculo: updateSalida.chofer_vehiculo,
            datos_cliente: updateSalida.datos_cliente,
            role_id: nuevosSalidas[index]?.role_id,
            usuario: nuevosSalidas[index]?.usuario,
            created_at: nuevosSalidas[index]?.created_at,
            updated_at: nuevosSalidas[index]?.updated_at,
          };
        }
        return nuevosSalidas;
      });
    };

    newSocket.on("editar-salida", handleEditarSalida);

    return () => {
      newSocket.off("editar-salida", handleEditarSalida);
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
              <div className="inline-block w-2/3 max-md:w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
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

                <div className="text-sm font-bold text-slate-700 mb-3 border-b-[1px] uppercase">
                  Editar salida
                </div>

                <form className="flex flex-col gap-5 max-md:px-1 max-md:border-none max-md:shadow-none">
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => openModalChofer()}
                      className="bg-orange-500 py-2 px-4 rounded-xl text-white uppercase text-sm shadow max-md:text-sm"
                    >
                      Crear choferes
                    </button>
                    <button
                      type="button"
                      onClick={() => openModalVerChofer()}
                      className="bg-green-500 py-2 px-4 rounded-xl text-white uppercase text-sm shadow max-md:text-sm"
                    >
                      Ver choferes creados
                    </button>
                  </div>
                  <article>
                    <div className="flex flex-col gap-3">
                      <h3 className="font-bold text-slate-700 max-md:text-sm uppercase text-base">
                        Seleccionar Fabrica de Salida y Localidad
                      </h3>
                      <div className="grid grid-cols-2 items-center gap-2">
                        <label className="relative block rounded-xl border border-slate-300 shadow-sm">
                          <select
                            onChange={(e) => setFabrica(e.target.value)}
                            value={fabrica}
                            type="text"
                            className="max-md:text-sm peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3.5  px-3 text-slate-900 uppercase w-full"
                          >
                            <option value="">Fabrica</option>
                            <option value="iraola">Iraola</option>
                            <option value="long">Long</option>
                          </select>

                          <span className="max-md:text-sm pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase">
                            Seleccionar fabrica
                          </span>
                        </label>

                        <div className="w-full">
                          <label className="relative block rounded-xl border border-slate-300 shadow-sm">
                            <input
                              value={salida}
                              onChange={(e) => setSalida(e.target.value)}
                              type="text"
                              className="max-md:text-sm peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3 uppercase"
                            />

                            <span className="max-md:text-sm pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase">
                              Localidad o Provincia de salida
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </article>
                  <article className="flex flex-col gap-5">
                    <div>
                      <h3 className="font-bold text-base text-slate-700 max-md:text-sm uppercase">
                        Ingresar datos de la salida
                      </h3>
                    </div>
                    {/* datos del formulario  */}
                    <div className="flex flex-col gap-3">
                      <div className="w-1/3 max-md:w-full">
                        <label className="relative block rounded-xl border border-slate-300 shadow-sm">
                          <select
                            onChange={(e) => setChofer(e.target.value)}
                            value={chofer}
                            type="text"
                            className="max-md:text-sm peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3.5  px-3 text-slate-900 uppercase w-full"
                          >
                            <option value="">Seleccionar chofer</option>
                            {choferes.map((c) => (
                              <option>{c.chofer}</option>
                            ))}
                          </select>

                          <span className="max-md:text-sm pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase">
                            Chofer
                          </span>
                        </label>
                      </div>
                      <div className="flex flex-col gap-2 items-start mt-3">
                        <button
                          onClick={() => openModal()}
                          type="button"
                          className="bg-green-100 text-green-700 hover:bg-green-500 hover:text-white text-sm py-3 px-4 hover:shadow rounded-xl uppercase flex gap-2 items-center"
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
                        {/* 
                        <div className="flex gap-3 mt-2 max-md:grid max-md:grid-cols-2 max-md:flex-none">
                          {datosCliente.map((c, index) => (
                            <div
                              key={index}
                              className="bg-white border-[1px] border-slate-300 rounded-xl py-8 px-4 relative shadow max-md:py-10"
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
                                <span className="font-bold capitalize text-slate-700 max-md:text-sm">
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
                            </div>
                          ))}
                        </div> */}
                      </div>
                    </div>
                  </article>
                  <article className="flex flex-col gap-5 mt-5 w-4/5">
                    <div>
                      <h3 className="font-bold text-base text-slate-700 max-md:text-sm uppercase">
                        Chofer/Vehiculo
                      </h3>
                    </div>
                    <div className="max-md:w-full">
                      <label className="relative block rounded-xl border border-slate-300 shadow-sm max-md:text-sm">
                        <input
                          value={chofer_vehiculo}
                          onChange={(e) => setChoferVehiculo(e.target.value)}
                          type="text"
                          className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3 uppercase"
                        />

                        <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase">
                          Chofer Vehiculo
                        </span>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="max-md:w-full">
                        <label className="relative block rounded-xl border border-slate-300 shadow-sm max-md:text-sm">
                          <span className="font-bold text-slate-500 px-3 max-md:text-sm">
                            KM
                          </span>
                          <input
                            value={km_viaje_control}
                            onChange={(e) => setKmViajeControl(e.target.value)}
                            type="text"
                            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3 uppercase"
                          />

                          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase">
                            KM de viaje
                          </span>
                        </label>
                      </div>
                      <div className="max-md:w-full max-md:text-sm">
                        <label className="relative block rounded-xl border border-slate-300 bg-white shadow-sm">
                          <span className="font-bold text-slate-500 px-3">
                            $
                          </span>
                          <input
                            value={km_viaje_control_precio}
                            onChange={(e) =>
                              setKmViajeControlPrecio(e.target.value)
                            }
                            type="text"
                            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3 uppercase"
                          />

                          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase">
                            KM Precio
                          </span>
                        </label>
                      </div>
                      <div className="bg-slate-100 py-2 px-4 rounded-xl shadow font-bold text-slate-700 text-lg border-slate-300 border-[1px] max-md:text-base w-3/4 text-center">
                        <p>
                          {Number(
                            km_viaje_control * km_viaje_control_precio
                          ).toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                            minimumIntegerDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                  </article>

                  <article className="flex flex-col gap-5 w-4/5">
                    <div>
                      <h3 className="font-bold text-base text-slate-700 max-md:text-sm uppercase">
                        Fletes
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="max-md:w-full">
                        <label className="relative block rounded-xl border border-slate-300 shadow-sm max-md:text-sm">
                          <span className="font-bold text-slate-500 px-3">
                            KM
                          </span>
                          <input
                            value={fletes_km}
                            onChange={(e) => setKmFletes(e.target.value)}
                            type="text"
                            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3 uppercase"
                          />

                          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase">
                            KM de viaje
                          </span>
                        </label>
                      </div>
                      <div className="max-md:w-full">
                        <label className="relative block rounded-xl border border-slate-300 bg-white shadow-sm">
                          <span className="font-bold text-slate-500 px-3">
                            $
                          </span>
                          <input
                            value={fletes_km_precio}
                            onChange={(e) => setKmFletesPrecio(e.target.value)}
                            type="text"
                            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3 max-md:text-sm uppercase"
                          />

                          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base max-md:text-sm uppercase">
                            KM Precio
                          </span>
                        </label>
                      </div>
                      <div className="bg-slate-100 max-md:text-base py-2 px-4 rounded-xl shadow font-bold text-slate-700 text-lg border-slate-300 border-[1px] text-center">
                        <p>
                          {chofer !== "Iveco Tecnohouse"
                            ? Number(
                                fletes_km * fletes_km_precio
                              ).toLocaleString("es-AR", {
                                style: "currency",
                                currency: "ARS",
                                minimumIntegerDigits: 2,
                              })
                            : Number(fletes_km_precio).toLocaleString("es-AR", {
                                style: "currency",
                                currency: "ARS",
                                minimumIntegerDigits: 2,
                              })}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="relative block rounded-xl border border-slate-300 shadow-sm max-md:text-sm max-md:w-full">
                        <span className="font-bold text-slate-500 px-3">$</span>
                        <input
                          value={espera}
                          onChange={(e) => setEspera(e.target.value)}
                          type="text"
                          className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3 uppercase"
                        />

                        <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase">
                          Espera del Fletero
                        </span>
                      </label>

                      <div className="bg-slate-100 py-2 px-4 rounded-xl shadow font-bold text-slate-700 text-lg border-slate-300 border-[1px] max-md:text-base text-center">
                        <p>
                          {Number(espera).toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                            minimumIntegerDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                  </article>

                  <article className="flex flex-col gap-5 w-4/5">
                    <div>
                      <h3 className="font-bold text-base text-slate-700 uppercase max-md:text-sm">
                        Viaticos Armadores
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="max-md:w-full">
                        <label className="relative block rounded-xl border border-slate-300 shadow-sm max-md:text-sm">
                          <input
                            value={armadores}
                            onChange={(e) => setArmadores(e.target.value)}
                            type="text"
                            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3 uppercase"
                          />

                          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase">
                            Armador/Nombre/Apellido
                          </span>
                        </label>
                      </div>
                      <div className="max-md:w-full">
                        <label className="relative block rounded-xl border border-slate-300 bg-white shadow-sm max-md:text-sm">
                          <span className="font-bold text-slate-500 px-3">
                            $
                          </span>
                          <input
                            value={total_viaticos}
                            onChange={(e) => setTotalViaticos(e.target.value)}
                            type="text"
                            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3 uppercase"
                          />

                          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase">
                            Total en Viaticos
                          </span>
                        </label>
                      </div>
                      <div className="bg-slate-100 py-2 px-4 rounded-xl shadow font-bold text-slate-700 text-lg border-slate-300 border-[1px] max-md:text-base text-center">
                        <p>
                          {Number(total_viaticos).toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                            minimumIntegerDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-700 underline uppercase font-bold">
                        Motivo
                      </p>
                      <div className="mt-2">
                        <select
                          className="py-2 px-3 bg-white border-slate-300 border-[1px] shadow rounded-xl text-slate-700  max-md:text-sm uppercase"
                          value={motivo}
                          onChange={(e) => setMotivo(e.target.value)}
                        >
                          <option value="">Seleccionar motivo</option>
                          <option value="refuerzo">Refuerzo</option>
                          <option value="no cobra en base">
                            No cobra en base
                          </option>
                        </select>
                      </div>
                      <div className="flex gap-2 mt-2 max-md:text-sm">
                        {motivo === "refuerzo" ? (
                          <p className="bg-green-500 py-3 px-5 uppercase text-sm rounded-xl shadow text-white cursor-pointer">
                            Refuerzo
                          </p>
                        ) : motivo === "no cobra en base" ? (
                          <p className="bg-red-800 py-3 px-5 uppercase text-sm rounded-xl shadow text-white cursor-pointer">
                            No cobra en base
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </article>

                  <div>
                    <button
                      type="button"
                      onClick={() => onSubmit()}
                      className="bg-green-100 text-green-700 rounded-xl hover:shadow hover:bg-green-500 hover:text-white transition-all ease-linear py-2 px-6 max-md:text-sm uppercase text-sm flex gap-2 items-center"
                    >
                      Editar la salida
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

                <ModalCrearCliente
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
                <ModalEditarClienteSalida
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
