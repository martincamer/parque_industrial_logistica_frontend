import React, { useEffect, useState } from "react";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.css";
import "./MyTable.css"; // Importa tu archivo CSS personalizado

const MyTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const container = document.getElementById("hot");
    const hot = new Handsontable(container, {
      data: data,
      rowHeaders: true,
      colWidths: [500, 500, 500],
      columnHeaderHeight: 40,
      colHeaders: ["Numero", "Clientes/Cliente", "Localidad/Cliente"],
      columns: [{ data: "numero" }, { data: "cliente" }, { data: "localidad" }],
      contextMenu: true,
      minSpareRows: 1,
    });

    return () => {
      hot.destroy();
    };
  }, [data]);

  return <div id="hot" className="hot"></div>;
};

export default MyTable;
