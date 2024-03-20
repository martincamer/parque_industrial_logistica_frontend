//imports
import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/axios";

//context
export const RemuneracionContext = createContext();

//use context
export const useRemuneracionContext = () => {
  const context = useContext(RemuneracionContext);
  if (!context) {
    throw new Error("Use Remuneracion Propvider");
  }
  return context;
};

//
export const RemuneracionProvider = ({ children }) => {
  const [remuneracionesMensuales, setRemuneracionesMensuales] = useState([]);

  useEffect(() => {
    async function loadData() {
      const respuesta = await client.get("/remuneraciones-mes");

      setRemuneracionesMensuales(respuesta.data);
    }

    loadData();
  }, []);

  return (
    <RemuneracionContext.Provider
      value={{ remuneracionesMensuales, setRemuneracionesMensuales }}
    >
      {children}
    </RemuneracionContext.Provider>
  );
};
