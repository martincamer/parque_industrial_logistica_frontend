import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { editarTipo, obtenerUnicoTipo } from "../../api/fabrica.api";
import { useForm } from "react-hook-form";
import { useEmpleadosContext } from "../../context/EmpleadosProvider";
import {
  actualizarEmpleado,
  obtenerUnicoEmpleado,
} from "../../api/empleados.api";

export const ModalEditarEmpleado = ({
  obtenerId,
  isOpenEdit,
  closeModalEdit,
}) => {
  const { empleados, setEmpleados, fabricas } = useEmpleadosContext();

  //errores
  const [error, setError] = useState(null);

  const [datos, setDatos] = useState([]);

  //formulario state
  const [empleado, setEmpleado] = useState("");
  const [fecha, setFecha] = useState("");
  const [tipo, setTipo] = useState("");
  const [antiguedad, setAntiguedad] = useState(0);
  const [tipo_fabrica, setTipoFabrica] = useState("");
  const [quincena_del_cinco, setQuincenaCinco] = useState(0);
  const [quincena_del_veinte, setQuincenaVeinte] = useState(0);
  const [setTotalAntiguedad] = useState(0);
  const [banco, setBanco] = useState(0);
  const [premio_asistencia, setAsistencia] = useState(0);
  const [premio_produccion, setProduccion] = useState(0);
  const [comida_produccion, setProducci] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [setTotalQuincena] = useState(0);
  const [setTotalQuincenaVeinte] = useState(0);
  const [setTotalFinal] = useState(0);
  const [obs, setObs] = useState("");
  const [otros, setOtros] = useState(0);

  //   const params = useParams();

  useEffect(() => {
    async function loadData() {
      const res = await obtenerUnicoEmpleado(obtenerId);

      setDatos(res.data);

      const empleadoData = res.data;

      // Convertir la fecha de ISO a "YYYY-MM-DD"
      const fechaISO = new Date(empleadoData.fecha);
      const fechaFormateada = fechaISO.toISOString().split("T")[0];

      // Establecer los valores en los estados
      setEmpleado(empleadoData.empleado || "");
      setFecha(fechaFormateada || "");
      setTipo(empleadoData.tipo || "");
      setAntiguedad(empleadoData.antiguedad || 0);
      setQuincenaCinco(empleadoData.quincena_del_cinco || 0);
      setQuincenaVeinte(empleadoData.quincena_del_veinte || 0);
      setBanco(empleadoData.banco || 0);
      setAsistencia(empleadoData.premio_asistencia || 0);
      setProduccion(empleadoData.premio_produccion || 0);
      setProducci(empleadoData.comida_produccion || 0);
      setDescuento(empleadoData.descuento || 0);
      setTipoFabrica(empleadoData.tipo_fabrica || "");
      setObs(empleadoData.obs || "");
      setOtros(empleadoData.otros || "");
    }

    loadData();
  }, [obtenerId]);

  const total_antiguedad =
    (Number(quincena_del_cinco) + Number(quincena_del_veinte)) *
    (0.01 * Number(antiguedad));

  const total_quincena =
    Number(quincena_del_cinco) +
    Number(banco) +
    Number(premio_asistencia) +
    Number(premio_produccion) +
    Number(total_antiguedad) -
    Number(otros) -
    Number(descuento);

  const total_quincena_veinte =
    Number(quincena_del_veinte) + Number(comida_produccion);

  const total_final =
    Number(total_quincena_veinte) + Number(otros) + Number(total_quincena);

  //   const navigate = useNavigate();

  //
  const onSubmit = async (e) => {
    try {
      e.preventDefault();

      const res = await actualizarEmpleado(obtenerId, {
        empleado,
        fecha,
        tipo,
        antiguedad,
        quincena_del_cinco,
        quincena_del_veinte,
        total_antiguedad,
        banco,
        premio_asistencia,
        premio_produccion,
        comida_produccion,
        descuento,
        obs,
        otros,
        total_quincena,
        total_quincena_veinte,
        total_final,
        tipo_fabrica,
      });

      const tipoExistenteIndex = empleados.findIndex(
        (tipo) => tipo.id == obtenerId
      );

      setEmpleados((prevTipos) => {
        const newTipos = [...prevTipos];
        const updatedEmpleado = JSON.parse(res.config.data); // Convierte el JSON a objeto

        newTipos[tipoExistenteIndex] = {
          id: obtenerId,
          empleado: updatedEmpleado.empleado,
          fecha: updatedEmpleado.fecha,
          tipo: updatedEmpleado.tipo,
          tipo_fabrica: updatedEmpleado.tipo_fabrica,
          antiguedad: updatedEmpleado.antiguedad,
          quincena_del_cinco: updatedEmpleado.quincena_del_cinco,
          quincena_del_veinte: updatedEmpleado.quincena_del_veinte,
          total_antiguedad: updatedEmpleado.total_antiguedad,
          banco: updatedEmpleado.banco,
          premio_produccion: updatedEmpleado.premio_produccion,
          premio_asistencia: updatedEmpleado.premio_asistencia,
          comida_produccion: updatedEmpleado.comida_produccion,
          descuento: updatedEmpleado.descuento,
          total_quincena: updatedEmpleado.total_quincena,
          total_quincena_veinte: updatedEmpleado.total_quincena_veinte,
          total_final: updatedEmpleado.total_final,
          obs: updatedEmpleado.obs,
          otros: updatedEmpleado.otros,
        };
        return newTipos;
      });

      toast.success("¡Empleado editado correctamente!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      setError(null);

      setTimeout(() => {
        closeModalEdit();
      }, 500);
    } catch (error) {
      if (error.response.data.message) {
        setError(error.response.data.message);

        // Ocultar el error después de 5 segundos
        setTimeout(() => {
          setError(null);
        }, 4000);
      }
    }
  };

  return (
    <Menu as="div" className="z-50">
      <Transition appear show={isOpenEdit} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModalEdit}
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
              <div className="inline-block w-4/5 p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="text-lg text-indigo-500 border-b-[1px] uppercase mb-10">
                  Editar empleado /{" "}
                  <span className="font-bold text-slate-600">
                    {datos.empleado}
                  </span>
                </div>

                <form onSubmit={onSubmit} action="#" className="space-y-6">
                  <article className="flex gap-2">
                    <div className="w-full">
                      <label
                        htmlFor="Empleado"
                        className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
                      >
                        <input
                          //   {...register("empleado", { required: true })}
                          value={empleado}
                          onChange={(e) => setEmpleado(e.target.value)}
                          type="text"
                          id="Empleado"
                          className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3"
                          placeholder="Empleado"
                        />

                        <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                          Escribrir el empleado
                        </span>
                      </label>
                    </div>

                    <div className="w-full">
                      <label
                        htmlFor="Fecha de ingreso"
                        className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
                      >
                        <input
                          value={fecha}
                          onChange={(e) => setFecha(e.target.value)}
                          type="date"
                          id="Fecha de ingreso"
                          className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3"
                          placeholder="Fecha de ingreso"
                        />

                        <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                          Fecha de ingreso
                        </span>
                      </label>
                    </div>
                  </article>

                  <article className="flex gap-2">
                    <div className="w-full h-full">
                      <label
                        htmlFor="tipo"
                        className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
                      >
                        <select
                          //   {...register("tipo", { required: true })}
                          value={tipo}
                          onChange={(e) => setTipo(e.target.value)}
                          type="text"
                          id="tipo"
                          className="peer border-none focus:border-transparent focus:outline-none focus:ring-0 py-3.5 text-slate-700 px-3 bg-white"
                          placeholder="tipo"
                        >
                          <option value="">Seleccionar</option>
                          <option value="mensual">Mensual</option>
                          <option value="quincenal">Quincenal</option>
                        </select>

                        <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                          Seleccionar el tipo de sueldo
                        </span>
                      </label>
                    </div>

                    <div className="w-full h-full">
                      <label
                        htmlFor="tipo_fabrica"
                        className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
                      >
                        <select
                          //   {...register("tipo", { required: true })}
                          value={tipo_fabrica}
                          onChange={(e) => setTipoFabrica(e.target.value)}
                          type="text"
                          id="tipo"
                          className="peer border-none focus:border-transparent focus:outline-none focus:ring-0 py-3.5 text-slate-700 px-3 bg-white"
                        >
                          <option value="">Seleccionar</option>
                          {fabricas.map((f) => (
                            <option value={f.tipo} key={f.id}>
                              {f.tipo}
                            </option>
                          ))}
                        </select>

                        <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                          Seleccionar zona o fabrica
                        </span>
                      </label>
                    </div>
                    <div className="w-full">
                      <label
                        htmlFor="antiguedad"
                        className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
                      >
                        <input
                          //   {...register("antiguedad", { required: true })}
                          value={antiguedad}
                          onChange={(e) => setAntiguedad(e.target.value)}
                          type="text"
                          id="antiguedad"
                          className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3"
                          placeholder="antiguedad"
                          //   onBlur={() => calcularTotalAntiguedad()}
                        />

                        <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                          Escribrir la antiguedad
                        </span>
                      </label>
                    </div>
                  </article>

                  <article className="flex gap-2">
                    <div className="w-full">
                      <label
                        htmlFor="quincena_del_cinco"
                        className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
                      >
                        <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                          Total quincena del 5
                        </span>
                        <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                          <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                            $
                          </span>
                          <input
                            value={quincena_del_cinco}
                            onChange={(e) => setQuincenaCinco(e.target.value)}
                            // {...register("quincena_del_cinco", { required: true })}
                            className="outline-none py-0 px-4 text-slate-600"
                            type="text"
                            id="quincena_del_cinco"
                            // onBlur={() => calcularTotalAntiguedad()}
                          />

                          <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                            ARS
                          </span>
                        </div>
                      </label>
                    </div>

                    <div className="w-full">
                      <label
                        htmlFor="quincena_del_cinco"
                        className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
                      >
                        <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                          Total quincena del 20
                        </span>
                        <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                          <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                            $
                          </span>
                          <input
                            value={quincena_del_veinte}
                            onChange={(e) => setQuincenaVeinte(e.target.value)}
                            // {...register("quincena_del_veinte", { required: true })}
                            className="outline-none py-0 px-4 text-slate-600"
                            type="text"
                            id="quincena_del_veinte"
                            // onBlur={() => calcularTotalAntiguedad()}
                          />

                          <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                            ARS
                          </span>
                        </div>
                      </label>
                    </div>
                  </article>

                  <article className="flex gap-2">
                    <div className="w-full">
                      <label
                        htmlFor="total_antiguedad"
                        className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
                      >
                        <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                          Total Antiguedad
                        </span>
                        <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                          <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                            $
                          </span>
                          <input
                            value={total_antiguedad}
                            onChange={(e) => setTotalAntiguedad(e.target.value)}
                            // onBlur={() => calcularTotalAntiguedad()}
                            // {...register("total_antiguedad", { required: true })}
                            className="outline-none py-0 px-4 text-slate-600"
                            type="text"
                            id="total_antiguedad"
                          />

                          <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                            ARS
                          </span>
                        </div>
                      </label>
                    </div>

                    <div className="w-full">
                      <label
                        htmlFor="banco"
                        className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
                      >
                        <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                          Otros agregar
                        </span>
                        <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                          <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                            $
                          </span>
                          <input
                            value={banco}
                            onChange={(e) => setBanco(e.target.value)}
                            // onBlur={() => calcularTotalQuincenaDelCinco()}
                            // {...register("banco", { required: true })}
                            className="outline-none py-0 px-4 text-slate-600"
                            type="text"
                            id="banco"
                          />

                          <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                            ARS
                          </span>
                        </div>
                      </label>
                    </div>
                  </article>

                  <article className="flex gap-2">
                    <div className="w-full">
                      <label
                        htmlFor=""
                        className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
                      >
                        <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                          Premio Produccion
                        </span>
                        <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                          <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                            $
                          </span>
                          <input
                            value={premio_produccion}
                            onChange={(e) => setProduccion(e.target.value)}
                            // onBlur={() => calcularTotalAntiguedad()}
                            // {...register("premio_produccion", { required: true })}
                            className="outline-none py-0 px-4 text-slate-600"
                            type="text"
                            id=""
                          />

                          <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                            ARS
                          </span>
                        </div>
                      </label>
                    </div>

                    <div className="w-full">
                      <label
                        htmlFor=""
                        className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
                      >
                        <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                          Premio Asistencia
                        </span>
                        <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                          <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                            $
                          </span>
                          <input
                            value={premio_asistencia}
                            onChange={(e) => setAsistencia(e.target.value)}
                            // onBlur={() => calcularTotalAntiguedad()}
                            // {...register("premio_asistencia", { required: true })}
                            className="outline-none py-0 px-4 text-slate-600"
                            type="text"
                            id=""
                          />

                          <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                            ARS
                          </span>
                        </div>
                      </label>
                    </div>

                    <div className="w-full">
                      <label
                        htmlFor=""
                        className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
                      >
                        <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                          Comida /Producción/ Solo Fabrica Aberturas
                        </span>
                        <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                          <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                            $
                          </span>
                          <input
                            value={comida_produccion}
                            onChange={(e) => setProducci(e.target.value)}
                            // onBlur={() => calcularTotalAntiguedad()}
                            // {...register("comida_produccion", { required: true })}
                            className="outline-none py-0 px-4 text-slate-600"
                            type="text"
                            id=""
                          />

                          <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                            ARS
                          </span>
                        </div>
                      </label>
                    </div>
                  </article>

                  <div className="w-full flex gap-2">
                    <label
                      htmlFor=""
                      className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
                    >
                      <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                        Banco
                      </span>
                      <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                        <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                          $
                        </span>
                        <input
                          value={otros}
                          onChange={(e) => setOtros(e.target.value)}
                          className="outline-none py-0 px-4 text-slate-600"
                          type="text"
                          id=""
                        />

                        <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                          ARS
                        </span>
                      </div>
                    </label>
                    <label
                      htmlFor=""
                      className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
                    >
                      <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                        Descuentos / por falta / etc
                      </span>
                      <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                        <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                          $
                        </span>
                        <input
                          //   onBlur={() => calcularTotalAntiguedad()}
                          //   {...register("descuento", { required: true })}
                          value={descuento}
                          onChange={(e) => setDescuento(e.target.value)}
                          className="outline-none py-0 px-4 text-slate-600"
                          type="text"
                          id=""
                        />

                        <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                          ARS
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <label
                      htmlFor=""
                      className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
                    >
                      <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                        Total Quincena del 5
                      </span>
                      <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                        <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                          $
                        </span>
                        <input
                          //   onBlur={() => calcularTotalQuincenaDelCinco()}
                          //   {...register("nuevo_total", { required: true })}
                          value={total_quincena}
                          onChange={(e) => setTotalQuincena(e.target.value)}
                          className="outline-none py-0 px-4 text-slate-600"
                          type="text"
                          id=""
                        />

                        <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                          ARS
                        </span>
                      </div>
                    </label>
                    <label
                      htmlFor=""
                      className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
                    >
                      <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                        Total Quincena del 20
                      </span>
                      <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                        <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                          $
                        </span>
                        <input
                          //   onBlur={() => calcularTotalQuincenaDelCinco()}
                          //   {...register("nuevo_total", { required: true })}
                          value={total_quincena_veinte}
                          onChange={(e) =>
                            setTotalQuincenaVeinte(e.target.value)
                          }
                          className="outline-none py-0 px-4 text-slate-600"
                          type="text"
                          id=""
                        />

                        <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                          ARS
                        </span>
                      </div>
                    </label>

                    <label
                      htmlFor=""
                      className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
                    >
                      <span className="absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                        Total Final
                      </span>
                      <div className=" relative peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 text-slate-700 px-3">
                        <span className="absolute top-2 left-2 text-lg bg-white p-0.5 text-slate-500">
                          $
                        </span>
                        <input
                          //   onBlur={() => calcularTotalQuincenaDelCinco()}
                          //   {...register("nuevo_total", { required: true })}
                          value={total_final}
                          onChange={(e) => setTotalFinal(e.target.value)}
                          className="outline-none py-0 px-4 text-slate-600"
                          type="text"
                          id=""
                        />

                        <span className="absolute top-2 right-2 text-lg bg-white p-0.5 text-slate-500">
                          ARS
                        </span>
                      </div>
                    </label>
                  </div>

                  <div>
                    <label className="sr-only" htmlFor="observacion">
                      Observación del empleado
                    </label>

                    <textarea
                      value={obs}
                      onChange={(e) => setObs(e.target.value)}
                      className="h-24 resize-none relative block rounded-md border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 w-full py-10 px-10 text-slate-700"
                      placeholder="Observacion por faltas o descuentos"
                      rows="8"
                      id="observacion"
                    />
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
                    >
                      Editar Empleado
                    </button>
                  </div>
                </form>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
                    onClick={closeModalEdit}
                  >
                    Cerrar Ventana
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Menu>
  );
};
