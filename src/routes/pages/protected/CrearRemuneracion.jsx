import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSalidasContext } from "../../../context/SalidasProvider";
import { ModalCrearChoferes } from "../../../components/Modales/ModalCrearChoferes";
import { ModalVerChoferes } from "../../../components/Modales/ModalVerChoferes";
import { ModalCrearClienteRemuneracion } from "../../../components/Modales/ModalCrearClienteRemuneracion";
import { crearNuevaRemuneracion } from "../../../api/ingresos";
import client from "../../../api/axios";
import { useRemuneracionContext } from "../../../context/RemuneracionesProvider";

export const CrearRemuneracion = () => {
  const fechaActual = new Date();

  const { remuneracionesMensuales, setRemuneracionesMensuales } =
    useRemuneracionContext();

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

  //formulario submit
  const navigate = useNavigate();

  //estados del formulario
  const [chofer, setChofer] = useState("");
  const [armador, setArmador] = useState("");
  const [fecha_carga, setFechaCarga] = useState("");
  const [fecha_entrega, setFechaEntrega] = useState("");
  const [km_lineal, setKmLineal] = useState("");
  const [pago_fletero_espera, setPagoFletero] = useState("");
  const [viaticos, setViaticos] = useState("");
  const [refuerzo, setRefuerzo] = useState("");
  // const [recaudacion, setRecaudación] = useState("");

  // Utilizar reduce para calcular la suma total de la propiedad totalFlete
  const totalSuma = datosCliente.reduce((acumulador, elemento) => {
    // Convertir la propiedad totalFlete a número y sumarla al acumulador
    return acumulador + parseFloat(elemento.totalFlete);
  }, 0); // Iniciar el acumulador en 0

  console.log(datosCliente);

  const onSubmit = async (e) => {
    e.preventDefault();

    const recaudacion =
      Number(totalSuma) -
      Number(pago_fletero_espera) -
      Number(viaticos) -
      Number(refuerzo);

    try {
      const res = await crearNuevaRemuneracion({
        armador,
        fecha_carga,
        fecha_entrega,
        pago_fletero_espera, // Corregido el nombre del campo aquí
        km_lineal,
        viaticos,
        refuerzo,
        recaudacion,
        chofer,
        datos_cliente: { datosCliente },
      });

      console.log(res);

      // Verificar si el tipo ya existe antes de agregarlo al estado
      const tipoExistente = remuneracionesMensuales.find(
        (tipo) => tipo.id === res.data.id
      );

      if (!tipoExistente) {
        // Actualizar el estado de tipos agregando el nuevo tipo al final
        setRemuneracionesMensuales((prevTipos) => [...prevTipos, res.data]);
      }

      toast.success("Remuneración creada correctamente!", {
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
        navigate("/remuneraciones");
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="w-full h-full min-h-full max-h-full px-12 max-md:px-4 flex flex-col gap-20 pb-36 py-14 relative">
      <ToastContainer />
      <div className="absolute right-28 text-white bg-slate-800 py-2 px-6 rounded-xl font-bold">
        Mes {nombreMesActual}, Día {nombreDiaActual}
      </div>

      <div className="bg-white border-slate-300 border-[1px] py-8 px-5 rounded-xl max-w-xs flex justify-center shadow">
        <div className="text-lg font-bold uppercase text-green-500 flex">
          <p className="border-b-[3px] border-slate-700">
            Crear nueva remuneracion
          </p>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className=" border-slate-300 border-[1px] py-12 px-10 rounded-xl shadow flex flex-col gap-5 h-full max-h-full"
      >
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => openModalChofer()}
            className="bg-orange-500 py-2 px-4 rounded-xl text-white shadow text-base"
          >
            Crear choferes
          </button>
          <button
            type="button"
            onClick={() => openModalVerChofer()}
            className="bg-green-500 py-2 px-4 rounded-xl text-white shadow text-base"
          >
            Ver choferes creados
          </button>
        </div>
        <article className="flex flex-col gap-2 mt-6">
          <div>
            <h3 className="font-bold text-xl text-slate-700">Ingresar datos</h3>
          </div>
          {/* datos del formulario  */}
          <div className="flex flex-col gap-3 mt-5">
            <div className="w-1/4">
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
            <div className="w-1/4 mt-3">
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

              <div className="flex gap-3 mt-2">
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
                    <p>
                      Nombre y Apellido{" "}
                      <span className="font-bold capitalize text-slate-700">
                        {c.cliente}
                      </span>
                    </p>
                    <p>
                      Localidad{" "}
                      <span className="font-bold capitalize text-slate-700">
                        {c.localidad}
                      </span>
                    </p>
                    <p>
                      Numero de contrato{" "}
                      <span className="font-bold capitalize text-slate-700">
                        {c.numeroContrato}
                      </span>
                    </p>
                    <p>
                      Metros Cuadrados{" "}
                      <span className="font-bold capitalize text-slate-700">
                        {c.metrosCuadrados}
                      </span>
                    </p>

                    <p>
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

        <article className="flex flex-col gap-2 w-1/2">
          <div>
            <h3 className="font-bold text-xl text-slate-700">
              Fechas de carga/entrega
            </h3>
          </div>
          <div className="flex gap-5">
            <div className="w-1/4 mt-3">
              <label className="relative block rounded-xl border border-slate-300 shadow-sm">
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
            <div className="w-1/4 mt-3">
              <label className="relative block rounded-xl border border-slate-300 shadow-sm">
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

        <article className="flex flex-col gap-2 w-1/2">
          <div>
            <h3 className="font-bold text-xl text-slate-700">Totales</h3>
          </div>
          <div className="flex items-center">
            <div className="flex gap-5 bg-white border-[1px] border-slate-300 shadow py-2 px-6 rounded-xl">
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

          <div className="flex gap-3 items-center mt-3">
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

          <div className="flex gap-3 items-center">
            <label className="relative block rounded-xl border border-slate-300 bg-white shadow-sm mb-3">
              <span className="font-bold text-slate-500 px-3">$</span>
              <input
                onChange={(e) => setPagoFletero(e.target.value)}
                value={pago_fletero_espera}
                type="text"
                className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3  px-3 text-slate-900"
              />

              <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base">
                Pago de espera fletero
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

          <div className="flex gap-3 items-center">
            <label className="relative block rounded-xl border border-slate-300 bg-white shadow-sm mb-3">
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

          <div className="flex gap-3 items-center">
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

          <div className="flex">
            <div className="flex gap-3 bg-white border-[1px] border-slate-300 shadow py-4 px-4 rounded-xl mt-5">
              <span className="font-bold text-slate-700 text-lg">
                Recaudación final
              </span>

              <p className="text-green-500 font-bold text-lg">
                {Number(
                  totalSuma - pago_fletero_espera - viaticos - refuerzo
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
            // onClick={() => onSubmit()}
            className="bg-black text-white rounded-xl shadow py-2 px-6"
          >
            Crear nueva salida
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
    </section>
  );
};
