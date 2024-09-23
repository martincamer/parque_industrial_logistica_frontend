import { useEffect, useState } from "react";
import { formatearDinero } from "../../helpers/FormatearDinero";

export const ModalEditarClienteRemuneracionEditar = ({
  setDatosCliente,
  datosCliente,
  usuario,
}) => {
  const [cliente, setCliente] = useState("");
  const [numeroContrato, setNumeroContrato] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [metrosCuadrados, setMetrosCuadrados] = useState("");
  const [totalFlete, setTotalFlete] = useState("");

  console.log("asdsad", datosCliente);

  useEffect(() => {
    // Buscar el cliente seleccionado dentro de datosCliente
    const clienteEncontrado = datosCliente.find(
      (cliente) => cliente.cliente === usuario
    );

    console.log("xd", clienteEncontrado);

    // Si se encuentra el cliente, establecer los valores de los campos del formulario
    if (clienteEncontrado) {
      setCliente(clienteEncontrado.cliente);
      setNumeroContrato(clienteEncontrado.numeroContrato);
      setMetrosCuadrados(clienteEncontrado.metrosCuadrados);
      setTotalFlete(clienteEncontrado.totalFlete);
      setLocalidad(clienteEncontrado.localidad);
    }
  }, [usuario, datosCliente]);

  const handleCliente = () => {
    // Crear un nuevo objeto de cliente con los datos actualizados
    const clienteActualizado = {
      cliente,
      localidad,
      numeroContrato,
      metrosCuadrados,
      totalFlete,
      localidad,
    };

    // Actualizar la lista de clientes con los datos actualizados
    const datosClienteActualizados = datosCliente.map((clienteExistente) => {
      if (clienteExistente.cliente === usuario) {
        return clienteActualizado;
      }
      return clienteExistente;
    });

    // Actualizar el estado con la lista de clientes actualizada
    setDatosCliente(datosClienteActualizados);

    document
      .getElementById("my_modal_editar_cliente_remuneracion_editar")
      .close();
  };

  const [isEditable, setIsEditable] = useState(false);
  const [isEditableMetros, setIsEditableMetros] = useState(false);

  const handleInputClick = () => {
    setIsEditable(true);
  };

  const handleInputClickMetros = () => {
    setIsEditableMetros(true);
  };

  return (
    <dialog id="my_modal_editar_cliente_remuneracion_editar" className="modal">
      <div className="modal-box rounded-md">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <form className="flex flex-col gap-3 text-sm">
          <div className="flex flex-col gap-2 max-md:text-sm text-sm">
            <label className="font-bold" htmlFor="">
              Nombre y Apellido
            </label>
            <input
              onChange={(e) => setCliente(e.target.value)}
              value={cliente}
              placeholder="@NOMBRE Y APELLIDO DEL CLIENTE"
              type="text"
              className="border py-2 px-4 rounded-md border-gray-300 font-medium uppercase outline-none"
            />
          </div>

          <div className="flex flex-col gap-2 max-md:text-sm">
            <label className="font-bold" htmlFor="">
              Localidad
            </label>
            <input
              onChange={(e) => setLocalidad(e.target.value)}
              value={localidad}
              placeholder="Ej: Venado Tuerto, Santa Fe"
              type="text"
              className="border py-2 px-4 rounded-md border-gray-300 font-medium uppercase outline-none"
            />
          </div>

          <div className="flex flex-col gap-2 max-md:text-sm">
            <label className="font-bold" htmlFor="">
              Numero de contrato
            </label>
            <input
              onChange={(e) => setNumeroContrato(e.target.value)}
              value={numeroContrato}
              placeholder="123-500"
              type="text"
              className="border py-2 px-4 rounded-md border-gray-300 font-medium uppercase outline-none"
            />
          </div>

          <div className="cursor-pointer" onClick={handleInputClickMetros}>
            {isEditableMetros ? (
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">Metros cuadrados</label>
                <input
                  onChange={(e) => setMetrosCuadrados(e.target.value)}
                  value={metrosCuadrados}
                  onBlur={() => {
                    setIsEditableMetros(false);
                  }}
                  type="text"
                  className="border border-gray-300 py-2 px-2 rounded-md font-bold capitalize text-sm outline-none w-auto"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">Metros cuadrados</label>

                <p className="border border-gray-300 py-2 px-2 rounded-md font-bold capitalize text-sm outline-none w-auto">
                  {metrosCuadrados || 0} mtrs.
                </p>
              </div>
            )}
          </div>

          <div className="cursor-pointer" onClick={handleInputClick}>
            {isEditable ? (
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm"> Total del flete</label>
                <input
                  onChange={(e) => setTotalFlete(e.target.value)}
                  value={totalFlete}
                  onBlur={() => {
                    setIsEditable(false);
                  }}
                  type="text"
                  className="border border-gray-300 py-2 px-2 rounded-md font-bold capitalize text-sm outline-none w-auto"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm"> Total del flete</label>

                <p className="border border-gray-300 py-2 px-2 rounded-md font-bold capitalize text-sm outline-none w-auto">
                  {formatearDinero(Number(totalFlete) || 0)}
                </p>
              </div>
            )}
          </div>

          <div>
            <button
              type="button"
              onClick={() => {
                handleCliente();
              }}
              className="py-1.5 px-6 bg-primary hover:shadow-md text-white transition-all rounded-md font-semibold text-sm"
            >
              Actualizar el cliente
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
