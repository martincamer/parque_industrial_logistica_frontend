import { useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import { useEffect } from "react";
import { ModalEditarCuenta } from "../../../components/Modales/ModalEditarCuenta";
import { ToastContainer } from "react-toastify";
import { ModalEditarCuentaPassword } from "../../../components/Modales/ModalEditarCuentaPassword";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import client from "../../../api/axios";
import axios from "axios";

export const Configuraciones = () => {
  const { user, signupAdmin, error } = useAuth();

  const [imagen, setImagen] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const uploadFile = async (type) => {
    const data = new FormData();
    data.append("file", type === "image" ? imagen : "");
    data.append("upload_preset", type === "image" ? "imagen_logo" : "-");

    try {
      // let cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
      let resourceType = type === "image" ? "image" : "video";
      let api = `https://api.cloudinary.com/v1_1/de4aqqalo/${resourceType}/upload`;

      const res = await axios.post(api, data);
      const { secure_url } = res.data;
      console.log(secure_url);
      return secure_url;
    } catch (error) {
      console.error(error);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (e) => {
    e.preventDefault();

    const imgUrl = await uploadFile("image");

    const data = {
      imagen: imgUrl,
    };

    const res = await client.put(`/editar-imagen-users/${user?.id}`, data);

    console.log(res.data);

    toast.success("¡Imagen editada correctamente, espera 5 segundos!", {
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

    setTimeout(() => {
      location.reload();
    }, 1500);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      // Crear una URL para la vista previa
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const [isOpenEditar, setEditar] = useState(false);
  const [isPassword, setPassword] = useState(false);
  const [obtenerId, setObtenerId] = useState(null);

  const openEditar = () => {
    setEditar(true);
  };

  const closeEditar = () => {
    setEditar(false);
  };

  const openPassword = () => {
    setPassword(true);
  };

  const closePassword = () => {
    setPassword(false);
  };

  const handleId = (id) => setObtenerId(id);

  //

  return (
    <section className="bg-gray-100/50 py-28 w-full">
      <div className="bg-white container mx-auto border-slate-200 px-10 py-10 shadow-sm rounded-2xl border-[1px]">
        <ToastContainer />

        <div>
          <p className="text-orange-500 text-lg underline">
            ¡Hola! <span className="capitalize">{user.username}</span> este es
            el sector de configuraciones.
          </p>
          <p className="text-slate-600 font-light mt-2">
            Administra tu cuenta / podes editar, cargar tu foto, etc.
          </p>
        </div>

        <div className="mt-12 relative h-max overflow-auto">
          <table className="w-full table-auto text-sm text-left capitalize">
            <thead className="text-gray-600 font-medium border-b">
              <tr>
                <th className="py-3 pr-6">Usuario</th>
                <th className="py-3 pr-6">Fecha de creación</th>
                <th className="py-3 pr-6">Fabrica/Sucursal</th>
                <th className="py-3 pr-6">Localidad</th>
                <th className="py-3 pr-6">Estado</th>
                <th className="py-3 pr-6">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y">
              <tr key={user?.id}>
                <td className="pr-6 py-4 whitespace-nowrap">
                  {user?.username}
                </td>
                <td className="pr-6 py-4 whitespace-nowrap">
                  {new Date(user?.created_at).toLocaleDateString()}
                </td>
                <td className="pr-6 py-4 whitespace-nowrap">
                  {user?.sucursal}
                </td>
                <td className="pr-6 py-4 whitespace-nowrap">
                  {user?.localidad}
                </td>
                <td className="pr-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-2 rounded-full font-semibold text-sm ${
                      user?.role_id === 1
                        ? "text-green-600 bg-green-50"
                        : "text-orange-600 bg-orange-50"
                    }`}
                  >
                    {user?.role_id === 1 ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="py-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleId(user?.id), openEditar();
                    }}
                    className="py-1.5 px-3 text-gray-600 hover:text-gray-500 duration-150 hover:bg-gray-50 border rounded-lg"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleId(user?.id), openPassword();
                    }}
                    className="py-1.5 px-3 text-orange-600 hover:text-orange-700 duration-150 hover:bg-gray-50 border rounded-lg"
                  >
                    Cambiar Contraseña{" "}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-10">
          {user?.imagen?.length > 1 ? (
            <>
              {" "}
              <div>
                <p className="font-normal text-lg underline text-orange-500">
                  Editar la foto para tu usuario.
                </p>
              </div>
              <form
                onSubmit={onSubmit}
                className="flex w-1/2 mt-5 flex-col gap-4 bg-white border-[1px] border-slate-200 px-10 py-10 rounded-2xl  shadow"
              >
                <div className="text-lg text-slate-700 w-full text-center">
                  Editar la foto
                </div>

                <div className="mt-2 rounded-xl transition-all ease-linear space-y-1 cursor-pointer">
                  <label
                    className="uppercase text-slate-700 text-sm"
                    htmlFor="img"
                  >
                    Cargar la foto
                  </label>
                  <br />
                  <input
                    type="file"
                    accept="image/*"
                    id="img"
                    onChange={handleFileChange}
                    className="w-full bg-white border-slate-200 border-[1px] text-slate-800 py-4 px-4 rounded-xl uppercase font-bold text-sm file:bg-slate-700 file:text-white file:py-2 file:border-none file:px-3 file:rounded-xl file:shadow-md cursor-pointer"
                  />
                </div>

                {previewUrl && (
                  <div className="mt-2">
                    <label className="uppercase text-slate-700 text-sm font-bold">
                      Vista Previa imagen:
                    </label>
                    <div className=" mt-2">
                      <img
                        src={previewUrl}
                        alt="Vista previa"
                        className="h-[200px] w-[200px] rounded-3xl shadow-md"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    className="bg-green-100 py-3 px-4 text-sm capitalize text-green-700 font-bold rounded-2xl flex gap-2 items-center"
                  >
                    Editar la foto
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div>
                <p className="font-normal text-lg underline text-orange-500">
                  Cargar foto para tu usuario.
                </p>
              </div>
              <form
                onSubmit={onSubmit}
                className="flex w-1/2 mt-5 flex-col gap-4 bg-white border-[1px] border-slate-200 px-10 py-10 rounded-2xl  shadow"
              >
                <div className="text-lg text-slate-700 w-full text-center">
                  Cargar tu foto
                </div>

                <div className="mt-2 rounded-xl transition-all ease-linear space-y-1 cursor-pointer">
                  <label
                    className="uppercase text-slate-700 text-sm"
                    htmlFor="img"
                  >
                    Cargar la foto
                  </label>
                  <br />
                  <input
                    type="file"
                    accept="image/*"
                    id="img"
                    onChange={handleFileChange}
                    className="w-full bg-white border-slate-200 border-[1px] text-slate-800 py-4 px-4 rounded-xl uppercase font-bold text-sm file:bg-slate-700 file:text-white file:py-2 file:border-none file:px-3 file:rounded-xl file:shadow-md cursor-pointer"
                  />
                </div>

                {previewUrl && (
                  <div className="mt-2">
                    <label className="uppercase text-slate-700 text-sm font-bold">
                      Vista Previa imagen:
                    </label>
                    <div className=" mt-2">
                      <img
                        src={previewUrl}
                        alt="Vista previa"
                        className="h-[200px] w-[200px] rounded-3xl shadow-md"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    className="bg-green-100 py-3 px-4 text-sm capitalize text-green-700 font-bold rounded-2xl flex gap-2 items-center"
                  >
                    Guardar la foto
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        <ModalEditarCuenta
          isOpen={isOpenEditar}
          closeModal={closeEditar}
          obtenerId={obtenerId}
        />

        <ModalEditarCuentaPassword
          isOpen={isPassword}
          closeModal={closePassword}
          obtenerId={obtenerId}
        />
      </div>
    </section>
  );
};
