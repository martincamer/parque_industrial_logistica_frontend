import { PDFViewer } from "@react-pdf/renderer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ImprimirPdf } from "../../../components/pdf/ImprirmirPdf";
import { obtenerUnicaSalida } from "../../../api/ingresos";

export const ViewPdf = () => {
  const [unicaSalida, setUnicaSalida] = useState([]);

  const params = useParams();

  useEffect(() => {
    async function loadData() {
      const respuesta = await obtenerUnicaSalida(params.id);

      setUnicaSalida(respuesta.data);
    }

    loadData();
  }, []);

  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <ImprimirPdf unicaSalida={unicaSalida} />
    </PDFViewer>
  );
};
