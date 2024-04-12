import { Dialog, Menu, Transition } from "@headlessui/react";
import { useEffect, useState, Fragment } from "react";
import { crearNuevaSalida } from "../../api/ingresos";
import { useNavigate } from "react-router-dom";
import { useSalidasContext } from "../../context/SalidasProvider";
import { ModalCrearCliente } from "../../components/Modales/ModalCrearCliente";
import { ModalCrearChoferes } from "../../components/Modales/ModalCrearChoferes";
import { ModalVerChoferes } from "../../components/Modales/ModalVerChoferes";
import { ModalEditarClienteSalida } from "../../components/Modales/ModalEditarClienteSalida";
import { toast } from "react-toastify";
import client from "../../api/axios";
import io from "socket.io-client";

export const ModalCrearSalida = ({ isOpenDos, closeModalDos }) => {
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
  const { setSalidasMensuales } = useSalidasContext();
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

  useEffect(() => {
    const newSocket = io(
      "https://tecnohouseindustrialbackend-production.up.railway.app",
      // "http://localhost:4000",

      {
        withCredentials: true,
      }
    );

    setSocket(newSocket);

    newSocket.on("nueva-salida", (nuevaSalida) => {
      setSalidasMensuales((prevTipos) => [...prevTipos, nuevaSalida]);
    });

    return () => newSocket.close();
  }, []);

  const onSubmit = async () => {
    try {
      // e.preventDefault();
      const res = await crearNuevaSalida({
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
        total_flete: Number(
          chofer !== "Iveco Tecnohouse"
            ? fletes_km * fletes_km_precio
            : fletes_km_precio
        ),
        espera,
        chofer_vehiculo,
        datos_cliente: { datosCliente },
      });

      if (socket) {
        socket.emit("nueva-salida", res.data);
      }

      toast.success("¡Salida creada correctamente!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      closeModalDos();

      setChofer("");
      setKmViajeControl("");
      setKmViajeControlPrecio("");
      setKmFletes("");
      setKmFletesPrecio("");
      setArmadores("");
      setTotalViaticos("");
      setMotivo("");
      setSalida("");
      setFabrica("");
      setEspera("");
      setChoferVehiculo("");

      setDatosCliente([]);
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
    <Menu as="div" className="z-50">
      <Transition appear show={isOpenDos} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModalDos}
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
            <div className="fixed inset-0 bg-black bg-opacity-10" />
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
                    onClick={closeModalDos}
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

                <div className="text-sm text-slate-700 mb-3 uppercase font-bold">
                  Crear nueva salida
                </div>

                <form
                  // onSubmit={onSubmit}
                  className="py-5 px-5 flex flex-col gap-3"
                >
                  <div className="flex gap-4 max-md:gap-1">
                    <button
                      type="button"
                      onClick={() => openModalChofer()}
                      className="bg-orange-500 py-2 px-4 max-md:py-2 max-md:px-2 rounded-xl text-white shadow max-md:text-sm uppercase text-sm"
                    >
                      Crear choferes
                    </button>
                    <button
                      type="button"
                      onClick={() => openModalVerChofer()}
                      className="bg-green-500 py-2 px-4 max-md:py-2 max-md:px-2 rounded-xl text-white shadow max-md:text-sm uppercase text-sm"
                    >
                      Ver choferes creados
                    </button>
                  </div>
                  <article>
                    <div className="flex flex-col gap-2">
                      <h3 className="font-bold text-slate-700 max-md:text-sm uppercase text-base mb-1">
                        Seleccionar Fabrica de Salida y Localidad
                      </h3>
                      <div className="flex flex-col gap-2 text-sm w-1/3">
                        <label className="uppercase text-slate-700 font-bold">
                          Seleccionar Fabrica
                        </label>
                        <select
                          onChange={(e) => setFabrica(e.target.value)}
                          value={fabrica}
                          type="text"
                          className="text-sm bg-white border-slate-300 border-[1px] py-2 px-2 rounded-xl uppercase"
                        >
                          <option className="uppercase" value="">
                            FABRICA
                          </option>
                          <option className="uppercase" value="iraola">
                            IRAOLA
                          </option>
                          <option className="uppercase" value="long">
                            LONG
                          </option>
                        </select>
                      </div>

                      <div className="w-1/3 max-md:w-full">
                        <div className="flex flex-col gap-1 text-sm">
                          <label className="uppercase text-slate-700 font-bold">
                            Localidad y provincia de salida
                          </label>
                          <input
                            placeholder="Escribrir localdiad y provincia"
                            value={salida}
                            onChange={(e) => setSalida(e.target.value)}
                            type="text"
                            className="uppercase border-[1px] border-slate-300 transition-all ease-linear py-2 px-3 rounded-xl hover:shadow-md"
                          />
                        </div>
                      </div>
                    </div>
                  </article>
                  <article className="flex flex-col gap-2 mt-6 max-md:mt-2">
                    <div>
                      <h3 className="font-bold text-base text-slate-700 max-md:text-sm uppercase">
                        Ingresar datos de la salida
                      </h3>
                    </div>
                    {/* datos del formulario  */}
                    <div className="flex flex-col gap-3 mt-2 w-full">
                      <div className="w-1/3 max-md:w-full">
                        <div>
                          <select
                            onChange={(e) => setChofer(e.target.value)}
                            value={chofer}
                            type="text"
                            className="text-sm bg-white border-slate-300 border-[1px] py-2 px-2 rounded-xl uppercase w-full"
                          >
                            <option
                              style={{ textTransform: "uppercase" }}
                              value=""
                            >
                              SELECCIONAR CHOFER
                            </option>
                            {choferes.map((c) => (
                              <option
                                style={{ textTransform: "uppercase" }}
                                value={c.chofer}
                              >
                                {c.chofer.toUpperCase()}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-start mt-3">
                        <button
                          onClick={() => openModal()}
                          type="button"
                          className="bg-black text-white text-sm py-2 px-4 shadow rounded-xl uppercase"
                        >
                          Crear Clientes
                        </button>

                        {/* <div className="flex gap-3 mt-2 max-md:grid max-md:grid-cols-2 max-md:flex-none">
                          {datosCliente.map((c, index) => (
                            <div
                              key={index}
                              className="bg-white border-[1px] border-slate-300 rounded-xl py-8 px-4 relative shadow max-md:py-10"
                            >
                              <div
                                className="absolute top-2 right-4 cursor-pointer uppercase"
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
                              <p className="max-md:text-sm uppercase">
                                Nombre y Apellido{" "}
                                <span className="font-bold uppercase text-slate-700 max-md:text-sm">
                                  {c.cliente}
                                </span>
                              </p>
                              <p className="max-md:text-sm uppercase">
                                Localidad{" "}
                                <span className="font-bold uppercase text-slate-700">
                                  {c.localidad}
                                </span>
                              </p>
                              <p className="max-md:text-sm uppercase">
                                Numero de contrato{" "}
                                <span className="font-bold uppercase text-slate-700">
                                  {c.numeroContrato}
                                </span>
                              </p>
                            </div>
                          ))}
                        </div> */}

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
                                          handleUsuario(datos.id), openEdit();
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
                  <article className="flex flex-col mt-2 text-sm">
                    <div>
                      <h3 className="font-bold text-base text-slate-700 max-md:text-sm uppercase">
                        Chofer/Vehiculo
                      </h3>
                    </div>
                    <div className="max-md:w-full w-1/3">
                      <div className="flex flex-col gap-2 mb-2 mt-2">
                        <label className="uppercase text-slate-700 font-bold">
                          Chofer nombre y apellido
                        </label>
                        <input
                          value={chofer_vehiculo}
                          onChange={(e) => setChoferVehiculo(e.target.value)}
                          type="text"
                          className="border-slate-300 border-[1px] hover:shadow-md transition-all ease-linear py-2 px-4 rounded-xl cursor-pointer "
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 items-center max-md:flex-col max-md:items-start max-md:gap-5 max-md:w-full mt-1">
                      <div className="max-md:w-full flex flex-col gap-2">
                        <label className="font-bold text-slate-700">
                          KM DE VIAJE
                        </label>
                        <div className="relative block rounded-xl border border-slate-300 shadow-sm max-md:text-sm">
                          <span className="font-bold text-slate-500 px-3 max-md:text-sm">
                            KM
                          </span>
                          <input
                            value={km_viaje_control}
                            onChange={(e) => setKmViajeControl(e.target.value)}
                            type="text"
                            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3"
                          />
                        </div>
                      </div>
                      <div className="max-md:w-full flex gap-2 items-end">
                        <div className="flex flex-col gap-2">
                          <label className="font-bold text-slate-700">
                            KM DE VIAJE
                          </label>
                          <div className="relative block rounded-xl border border-slate-300 bg-white shadow-sm">
                            <span className="font-bold text-slate-500 px-3">
                              $
                            </span>
                            <input
                              value={km_viaje_control_precio}
                              onChange={(e) =>
                                setKmViajeControlPrecio(e.target.value)
                              }
                              type="text"
                              className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3"
                            />
                          </div>
                        </div>
                        <div className="bg-slate-100 py-2 px-4 rounded-xl shadow font-bold text-slate-700 text-lg border-slate-300 border-[1px] max-md:text-base">
                          {Number(
                            km_viaje_control * km_viaje_control_precio
                          ).toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                            minimumIntegerDigits: 2,
                          })}
                        </div>
                      </div>
                    </div>
                  </article>

                  <article className="flex flex-col gap-1 mt-5 text-sm">
                    <div>
                      <h3 className="font-bold text-base text-slate-700 max-md:text-sm uppercase">
                        Fletes
                      </h3>
                    </div>
                    <div className="flex gap-3 items-end max-md:flex-col max-md:items-start max-md:gap-5">
                      <div className="max-md:w-full flex flex-col gap-2">
                        <label htmlFor="" className="font-bold text-slate-700">
                          KM DE VIAJE
                        </label>
                        <label className="relative block rounded-xl border border-slate-300 shadow-sm max-md:text-sm">
                          <span className="font-bold text-slate-500 px-3">
                            KM
                          </span>
                          <input
                            value={fletes_km}
                            onChange={(e) => setKmFletes(e.target.value)}
                            type="text"
                            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3"
                          />
                        </label>
                      </div>
                      <div className="max-md:w-full flex flex-col gap-2">
                        <label
                          htmlFor=""
                          className="font-bold text-slate-700 uppercase"
                        >
                          KM Precio
                        </label>
                        <label className="relative block rounded-xl border border-slate-300 bg-white shadow-sm">
                          <span className="font-bold text-slate-500 px-3">
                            $
                          </span>
                          <input
                            value={fletes_km_precio}
                            onChange={(e) => setKmFletesPrecio(e.target.value)}
                            type="text"
                            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3 max-md:text-sm"
                          />
                        </label>
                      </div>
                      <div className="bg-slate-100 max-md:text-base py-2 px-4 rounded-xl shadow font-bold text-slate-700 text-lg border-slate-300 border-[1px] uppercase">
                        {chofer !== "Iveco Tecnohouse"
                          ? Number(fletes_km * fletes_km_precio).toLocaleString(
                              "es-AR",
                              {
                                style: "currency",
                                currency: "ARS",
                                minimumIntegerDigits: 2,
                              }
                            )
                          : Number(fletes_km_precio).toLocaleString("es-AR", {
                              style: "currency",
                              currency: "ARS",
                              minimumIntegerDigits: 2,
                            })}
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 w-1/ mt-4">
                      <label
                        htmlFor=""
                        className="font-bold text-slate-700 uppercase"
                      >
                        Espera del fletero
                      </label>
                      <div className="flex gap-2">
                        <label className="relative block rounded-xl border border-slate-300 shadow-sm max-md:text-sm max-md:w-full">
                          <span className="font-bold text-slate-500 px-3">
                            $
                          </span>
                          <input
                            value={espera}
                            onChange={(e) => setEspera(e.target.value)}
                            type="text"
                            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3"
                          />
                        </label>

                        <div className="bg-slate-100 py-2 px-4 rounded-xl shadow font-bold text-slate-700 text-lg border-slate-300 border-[1px] max-md:text-base">
                          {Number(espera).toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                            minimumIntegerDigits: 2,
                          })}
                        </div>
                      </div>
                    </div>
                  </article>

                  <article className="flex flex-col gap-4 mt-5 max-md:gap-4 text-sm">
                    <div>
                      <h3 className="font-bold text-base text-slate-700 max-md:text-sm uppercase">
                        Viaticos Armadores
                      </h3>
                    </div>
                    <div className="flex gap-3 items-end max-md:flex-col max-md:gap-5 max-md:items-start w-full">
                      <div className="max-md:w-full flex flex-col gap-2">
                        <label
                          htmlFor=""
                          className="font-bold text-slate-700 uppercase"
                        >
                          Armador/Nombre/Apellido
                        </label>
                        <label className="relative block rounded-xl border border-slate-300 shadow-sm max-md:text-sm">
                          <input
                            placeholder="Nombre del armador y apellido"
                            value={armadores}
                            onChange={(e) => setArmadores(e.target.value)}
                            type="text"
                            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3 w-[300px] uppercase"
                          />
                        </label>
                      </div>
                      <div className="max-md:w-full flex flex-col gap-2">
                        <label
                          htmlFor=""
                          className="font-bold text-slate-700 uppercase"
                        >
                          Total en viaticos
                        </label>
                        <label className="relative block rounded-xl border border-slate-300 bg-white shadow-sm max-md:text-sm">
                          <span className="font-bold text-slate-500 px-3">
                            $
                          </span>
                          <input
                            value={total_viaticos}
                            onChange={(e) => setTotalViaticos(e.target.value)}
                            type="text"
                            className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3"
                          />
                        </label>
                      </div>
                      <div className="bg-slate-100 py-2 px-4 rounded-xl shadow font-bold text-slate-700 text-lg border-slate-300 border-[1px] max-md:text-base">
                        {Number(total_viaticos).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                          minimumIntegerDigits: 2,
                        })}
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-700 underline uppercase font-bold">
                        Motivo del refuerzo
                      </p>
                      <div className="mt-2">
                        <select
                          className="py-2 px-3 bg-white border-slate-300 border-[1px] shadow rounded-xl text-slate-700  max-md:text-sm uppercase"
                          value={motivo}
                          onChange={(e) => setMotivo(e.target.value)}
                        >
                          <option className="text-xs uppercase" value="">
                            Seleccionar motivo
                          </option>
                          <option
                            className="text-xs uppercase"
                            value="refuerzo"
                          >
                            Refuerzo
                          </option>
                          <option
                            className="text-xs uppercase"
                            value="no cobra en base"
                          >
                            No cobra en base
                          </option>
                        </select>
                      </div>
                      <div className="flex gap-2 mt-2 max-md:text-sm">
                        {motivo === "refuerzo" ? (
                          <p className="bg-green-500 py-2 px-2 rounded-xl shadow text-white cursor-pointer">
                            Refuerzo
                          </p>
                        ) : motivo === "no cobra en base" ? (
                          <p className="bg-red-800 py-2 px-2 rounded-xl shadow text-white cursor-pointer">
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
                      className="bg-green-100 text-green-800 rounded-2xl hover:bg-green-500 hover:text-white transition-all ease-linear py-2 px-6 max-md:text-sm uppercase text-sm flex gap-2 items-center"
                    >
                      Crear nueva salida
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
