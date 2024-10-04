//imports
import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/axios";

//context
export const EgresosContext = createContext();

//use context
export const useEgresosContext = () => {
  const context = useContext(EgresosContext);
  if (!context) {
    throw new Error("Use Egresos Propvider");
  }
  return context;
};

//
export const EgresosProvider = ({ children }) => {
  const [egresos, setEgresos] = useState([]);
  const [ingresos, setIngresos] = useState([]);

  useEffect(() => {
    async function loadData() {
      const respuesta = await client.get("/gastos");
      setEgresos(respuesta.data);
    }

    loadData();
  }, []);

  useEffect(() => {
    async function loadData() {
      const respuesta = await client.get("/ingresos");
      setIngresos(respuesta.data);
    }

    loadData();
  }, []);

  return (
    <EgresosContext.Provider
      value={{
        egresos,
        setEgresos,
        ingresos,
        setIngresos,
      }}
    >
      {children}
    </EgresosContext.Provider>
  );
};
