//imports
import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/axios";

//context
export const RendicionesContext = createContext();

//use context
export const useRendicionesContext = () => {
  const context = useContext(RendicionesContext);
  if (!context) {
    throw new Error("Use Rendiciones Provider");
  }
  return context;
};

//
export const RendicionesProvider = ({ children }) => {
  const [rendicionesMensuales, setRendicionesMensuales] = useState([]);
  const [rendicionesMensualesAdmin, setRendicionesMensualesAdmin] = useState(
    []
  );
  const [rendiciones, setRendiciones] = useState([]);
  const [rendicionesAdmin, setRendicionesAdmin] = useState([]);

  useEffect(() => {
    async function loadData() {
      const respuesta = await client.get("/rendicion-mes");

      setRendicionesMensuales(respuesta.data);
    }

    loadData();
  }, []);

  useEffect(() => {
    async function loadData() {
      const respuesta = await client.get("/rendicion-mes-admin");

      setRendicionesMensualesAdmin(respuesta.data);
    }

    loadData();
  }, []);

  useEffect(() => {
    async function loadData() {
      const respuesta = await client.get("/rendiciones");

      setRendiciones(respuesta.data);
    }

    loadData();
  }, []);

  useEffect(() => {
    async function loadData() {
      const respuesta = await client.get("/rendiciones-admin");

      setRendicionesAdmin(respuesta.data);
    }

    loadData();
  }, []);

  return (
    <RendicionesContext.Provider
      value={{
        rendicionesMensuales,
        setRendicionesMensuales,
        rendiciones,
        rendicionesAdmin,
        rendicionesMensualesAdmin,
        setRendiciones,
      }}
    >
      {children}
    </RendicionesContext.Provider>
  );
};
