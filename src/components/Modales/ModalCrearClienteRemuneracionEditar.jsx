import { useState } from "react";
import { formatearDinero } from "../../helpers/FormatearDinero";

export const ModalCrearClienteRemuneracionEditar = ({
  setDatosCliente,
  datosCliente,
}) => {
  const [cliente, setCliente] = useState("");
  const [numeroContrato, setNumeroContrato] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [metrosCuadrados, setMetrosCuadrados] = useState("");
  const [totalFlete, setTotalFlete] = useState("");
  const [error, setError] = useState("");

  const handleCliente = () => {
    // Verificar si metrosCuadrados y totalFlete son numéricos
    if (isNaN(Number(metrosCuadrados)) || isNaN(Number(totalFlete))) {
      setError(
        "Los campos 'Metros Cuadrados' y 'Total de Flete' deben ser numéricos."
      );
      return;
    }

    // Crear un nuevo objeto de cliente
    const nuevoCliente = {
      cliente,
      localidad,
      numeroContrato,
      metrosCuadrados: Number(metrosCuadrados), // Convertir a número
      totalFlete: Number(totalFlete), // Convertir a número
    };

    // Agregar el nuevo cliente a la lista de clientes
    setDatosCliente([...datosCliente, nuevoCliente]);
    setCliente("");
    setNumeroContrato("");
    setLocalidad("");
    setMetrosCuadrados("");
    setTotalFlete("");
    setError(""); // Limpiar el mensaje de error si se ha agregado el cliente correctamente

    document
      .getElementById("my_modal_crear_cliente_remuneracion_editar")
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
    <dialog id="my_modal_crear_cliente_remuneracion_editar" className="modal">
      <div className="modal-box rounded-md">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        {error && (
          <p
            className="
                bg-red-100 px-2 py-2 rounded-xl mb-3 uppercase text-sm font-bold text-red-800 text-center"
          >
            {error}
          </p>
        )}
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
              Crear nuevo cliente
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
