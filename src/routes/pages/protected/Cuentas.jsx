import { useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import { useEffect } from "react";
import { ModalEditarCuenta } from "../../../components/Modales/ModalEditarCuenta";
import { ToastContainer } from "react-toastify";
import { ModalEditarCuentaRole } from "../../../components/Modales/ModalEditarCuentaRole";
import { ModalEliminarUsuario } from "../../../components/Modales/ModalEliminarUsuario";
import { ModalEditarCuentaPassword } from "../../../components/Modales/ModalEditarCuentaPassword";
import { Label } from "../../../components/formularios/Label";
import { Input } from "../../../components/formularios/Input";
import { InputPassword } from "../../../components/formularios/InputPassword";
import { toast } from "react-toastify";

import { useForm } from "react-hook-form";
import client from "../../../api/axios";

export const Cuentas = () => {
  const { user, signupAdmin, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    await signupAdmin(data);

    toast.success("¡Usuario creado, espera 5 segundos!", {
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
    }, 3000);
  });

  const [users, setUsers] = useState([]);
  const [isOpenEditar, setEditar] = useState(false);
  const [isOpenEditarRole, setEditarRole] = useState(false);
  const [isEliminar, setEliminar] = useState(false);
  const [isPassword, setPassword] = useState(false);
  const [obtenerId, setObtenerId] = useState(null);

  const openEditar = () => {
    setEditar(true);
  };

  const closeEditar = () => {
    setEditar(false);
  };

  const openEditarRole = () => {
    setEditarRole(true);
  };

  const closeEditarRole = () => {
    setEditarRole(false);
  };

  const openEliminar = () => {
    setEliminar(true);
  };

  const closeEliminar = () => {
    setEliminar(false);
  };

  const openPassword = () => {
    setPassword(true);
  };

  const closePassword = () => {
    setPassword(false);
  };

  const handleId = (id) => setObtenerId(id);

  useEffect(() => {
    const obtenerDatos = async () => {
      const respuesta = await client.get("/users");

      setUsers(respuesta.data);
    };

    obtenerDatos();
  }, []);

  return (
    <section className="bg-gray-100/50 mx-auto w-full max-md:border-none">
      <ToastContainer />

      <div className="max-md:w-full max-md:border-none max-md:bg-gray-100/50 bg-white my-28 max-md:my-10 container mx-auto border-slate-200 py-10 px-10 shadow-sm rounded-2xl border-[1px] max-md:px-5">
        <div className="max-md:bg-white max-md:py-3 max-md:px-3 max-md:rounded-2xl max-md:shadow-lg max-md:border-none">
          <p className="text-orange-500 text-lg underline max-md:font-bold">
            Bienvenido {user.username}
          </p>
          <p className="text-slate-600 font-light mt-2 max-md:text-sm max-md:font-semibold">
            Administra los usuarios, crear, editar,etc
          </p>
        </div>

        <div className="mt-12 relative h-max overflow-auto max-md:bg-white max-md:px-5 max-md:py-5 max-md:rounded-2xl max-md:shadow-lg scrollbar-hidden max-md:border-none">
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
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="pr-6 py-4 whitespace-nowrap">{u.username}</td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap">{u.sucursal}</td>
                  <td className="pr-6 py-4 whitespace-nowrap">{u.localidad}</td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-2 rounded-full font-semibold text-sm ${
                        u.role_id === 1
                          ? "text-green-600 bg-green-50"
                          : "text-orange-600 bg-orange-50"
                      }`}
                    >
                      {u.role_id === 1 ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="py-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleId(u.id), openEditar();
                      }}
                      className="py-1.5 px-3 text-gray-600 hover:text-gray-500 duration-150 hover:bg-gray-50 border rounded-lg"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleId(u.id), openEditarRole();
                      }}
                      className="py-1.5 px-3 text-blue-600 hover:text-blue-800 duration-150 hover:bg-gray-50 border rounded-lg"
                    >
                      Desactivar{" "}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleId(u.id), openPassword();
                      }}
                      className="py-1.5 px-3 text-orange-600 hover:text-orange-700 duration-150 hover:bg-gray-50 border rounded-lg"
                    >
                      Cambiar Contraseña{" "}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleId(u.id), openEliminar();
                      }}
                      className="py-1.5 px-3 text-red-600 hover:text-red-800 duration-150 hover:bg-gray-50 border rounded-lg"
                    >
                      Eliminar{" "}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-10">
          <div className="max-md:bg-white max-md:py-3 max-md:px-3 max-md:shadow-lg max-md:rounded-2xl max-md:border-none">
            <p className="font-normal text-lg underline text-orange-500 max-md:font-bold">
              Crear un nuevo usuario
            </p>
          </div>
          <form
            onSubmit={onSubmit}
            className="flex w-1/2 mt-5 flex-col gap-4 bg-white border-[1px] border-slate-200 px-10 py-10 rounded-2xl shadow max-md:shadow-lg max-md:border-none max-md:w-full "
          >
            <div className="text-lg text-slate-700 w-full text-center">
              Registro de usuario
            </div>
            {
              <div>
                <div className="flex flex-col gap-1">
                  {error?.map((e) => (
                    <span className="bg-red-500/10 rounded-lg px-2 py-1 text-red-600 text-sm border-[1px] border-red-500/30">
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            }
            <div className="flex flex-col gap-2">
              <Label label="Email del registro" />
              <Input
                register={register}
                placeholder={"@emailregistro@email.com"}
                type={"email"}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label label="Usuario" />
              <Input
                register={register}
                placeholder={"@Usuario"}
                type={"username"}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label label="Sucursal/Fabrica" />
              <Input
                register={register}
                placeholder={"@Sucursal"}
                type={"sucursal"}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label label="Localidad" />
              <Input
                register={register}
                placeholder={"@Localidad"}
                type={"localidad"}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label label="Contraseña" />
              <InputPassword register={register} type={"password"} />
            </div>

            <div>
              <button
                type="submit"
                className="bg-green-100 py-3 px-4 text-sm capitalize text-green-700 font-bold rounded-2xl flex gap-2 items-center"
              >
                Crear usuario nuevo
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
                    d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>

        <ModalEditarCuenta
          isOpen={isOpenEditar}
          closeModal={closeEditar}
          obtenerId={obtenerId}
        />
        <ModalEditarCuentaRole
          isOpen={isOpenEditarRole}
          closeModal={closeEditarRole}
          obtenerId={obtenerId}
        />

        <ModalEliminarUsuario
          isOpen={isEliminar}
          closeModal={closeEliminar}
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
