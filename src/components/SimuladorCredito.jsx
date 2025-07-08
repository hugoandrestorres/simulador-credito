import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function SimuladorCredito() {
  const [valorInmueble, setValorInmueble] = useState(250000000);
  const [tasa, setTasa] = useState(12);
  const [plazo, setPlazo] = useState(15);
  const [abonosExtra, setAbonosExtra] = useState([{ anio: 1, valor: 10000000 }]);
  const [usarAbonosExtra, setUsarAbonosExtra] = useState(false);
  const [cuota, setCuota] = useState(null);
  const [seguroVida, setSeguroVida] = useState(null);
  const [ahorros, setAhorros] = useState(0);
  const [seguroHogar, setSeguroHogar] = useState(null);
  const [amortizacion, setAmortizacion] = useState([]);
  const [totalPagado, setTotalPagado] = useState(null);
  const [totalConSeguros, setTotalConSeguros] = useState(null);

  const tablaRef = useRef();
  const resumenRef = useRef();

  const calcularCuota = () => {
    const monto = valorInmueble * 0.7;
    const tasaMensual = Math.pow(1 + tasa / 100, 1 / 12) - 1;
    const meses = plazo * 12;
    const cuotaMensual =
      (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -meses));
    const valorSeguroVida = monto * 0.00015;
    const valorSeguroHogar = monto * 0.0001;

    setCuota(Math.round(cuotaMensual));
    setSeguroVida(Math.round(valorSeguroVida));
    setSeguroHogar(Math.round(valorSeguroHogar));

    let saldo = monto;
    let amortizacionAnual = [];
    let acumuladoIntereses = 0;
    let acumuladoCapital = 0;

    for (let anio = 1; anio <= plazo; anio++) {
      let interesesAnuales = 0;
      let abonoCapitalAnual = 0;

      for (let mes = 1; mes <= 12; mes++) {
        const interesMes = saldo * tasaMensual;
        const abonoCapital = cuotaMensual - interesMes;
        interesesAnuales += interesMes;
        abonoCapitalAnual += abonoCapital;
        saldo -= abonoCapital;
      }

      if (usarAbonosExtra) {
        const abonoExtra = abonosExtra.find((a) => a.anio === anio);
        if (abonoExtra && abonoExtra.valor > 0) {
          saldo -= abonoExtra.valor;
          abonoCapitalAnual += abonoExtra.valor;
        }
      }

      acumuladoIntereses += interesesAnuales;
      acumuladoCapital += abonoCapitalAnual;

      amortizacionAnual.push({
        anio,
        intereses: Math.round(interesesAnuales),
        abonoCapital: Math.round(abonoCapitalAnual),
        saldoPendiente: Math.max(0, Math.round(saldo)),
      });

      if (saldo <= 0) break;
    }

    const totalCredito = acumuladoIntereses + acumuladoCapital;
    const totalSeguros = (valorSeguroVida + valorSeguroHogar) * meses;

    setAmortizacion(amortizacionAnual);
    setTotalPagado(Math.round(totalCredito));
    setTotalConSeguros(Math.round(totalCredito + totalSeguros));
  };

  const handleAbonoChange = (index, campo, valor) => {
    const nuevos = [...abonosExtra];
    nuevos[index][campo] = Number(valor);
    setAbonosExtra(nuevos);
  };

  const agregarAbono = () => {
    setAbonosExtra([...abonosExtra, { anio: 1, valor: 0 }]);
  };

  const descargarPDF = async () => {
    const pdf = new jsPDF();
    const resumen = await html2canvas(resumenRef.current);
    const resumenImg = resumen.toDataURL("image/png");
    const resumenWidth = pdf.internal.pageSize.getWidth();
    const resumenHeight = (resumen.height * resumenWidth) / resumen.width;
    pdf.addImage(resumenImg, "PNG", 0, 0, resumenWidth, resumenHeight);
    pdf.addPage();
    const tabla = await html2canvas(tablaRef.current);
    const tablaImg = tabla.toDataURL("image/png");
    const tablaWidth = pdf.internal.pageSize.getWidth();
    const tablaHeight = (tabla.height * tablaWidth) / tabla.width;
    pdf.addImage(tablaImg, "PNG", 0, 0, tablaWidth, tablaHeight);
    pdf.save("simulador_credito.pdf");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-tr from-white to-blue-50 shadow-xl rounded-3xl space-y-6">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Simulador de Crédito
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col">
          <span className="text-gray-700 font-medium mb-1">Valor del inmueble:</span>
          <input
            type="number"
            value={valorInmueble}
            onChange={(e) => setValorInmueble(Number(e.target.value))}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-gray-700 font-medium mb-1">Tasa de interés anual (%):</span>
          <input
            type="number"
            value={tasa}
            onChange={(e) => setTasa(Number(e.target.value))}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-gray-700 font-medium mb-1">Plazo (años):</span>
          <input
            type="number"
            value={plazo}
            onChange={(e) => setPlazo(Number(e.target.value))}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-gray-700 font-medium mb-1">Ahorros:</span>
          <input
            type="number"
            value={ahorros}
            onChange={(e) => setAhorros(Number(e.target.value))}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </label>
      </div>

      <div className="flex items-center space-x-3 mt-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={usarAbonosExtra}
            onChange={() => setUsarAbonosExtra(!usarAbonosExtra)}
            className="accent-blue-600"
          />
          <span className="text-blue-700 font-medium">Incluir abonos extraordinarios</span>
        </label>
      </div>

      {usarAbonosExtra && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-blue-700">Abonos extraordinarios</h3>
          {abonosExtra.map((abono, i) => (
            <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center mb-2">
              <label className="flex flex-col">
                <span>Año:</span>
                <input
                  type="number"
                  value={abono.anio}
                  min={1}
                  max={plazo}
                  onChange={(e) => handleAbonoChange(i, "anio", e.target.value)}
                  className="p-2 border rounded-lg"
                />
              </label>
              <label className="flex flex-col col-span-2 sm:col-span-3">
                <span>Valor:</span>
                <input
                  type="number"
                  value={abono.valor}
                  onChange={(e) => handleAbonoChange(i, "valor", e.target.value)}
                  className="p-2 border rounded-lg"
                />
              </label>
            </div>
          ))}
          <button
            onClick={agregarAbono}
            className="mt-2 bg-blue-100 text-blue-800 font-medium px-4 py-1.5 rounded hover:bg-blue-200"
          >
            + Agregar abono
          </button>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={calcularCuota}
          className="bg-blue-700 text-white text-lg px-8 py-3 rounded-full hover:bg-blue-800 transition"
        >
          Calcular cuota mensual
        </button>
      </div>

      {cuota !== null && (
        <div ref={resumenRef} className="mt-8 text-lg bg-white border border-blue-100 p-6 rounded-2xl space-y-3 shadow">
          <h4 className="text-xl font-semibold text-blue-700 mb-3">Resumen del Crédito</h4>
          <p><strong>Crédito estimado (70% del valor):</strong> ${(valorInmueble * 0.70).toLocaleString("es-CO")}</p>
          <p><strong>Cuota inicial  (30% del valor):</strong> ${(valorInmueble * 0.30).toLocaleString("es-CO")}</p>
          <p><strong>Restante cuota inicial  (30% del valor - Ahorros):</strong> ${((valorInmueble * 0.30) - ahorros).toLocaleString("es-CO")}</p>
          <p><strong>Cuota mensual estimada:</strong> ${cuota.toLocaleString("es-CO")}</p>
          <p><strong>Seguro de vida (estimado):</strong> ${seguroVida.toLocaleString("es-CO")}</p>
          <p><strong>Seguro del hogar (estimado):</strong> ${seguroHogar.toLocaleString("es-CO")}</p>
          <p><strong>Total mensual aproximado:</strong> ${(cuota + seguroVida + seguroHogar).toLocaleString("es-CO")}</p>
          <p><strong>Total pagado al final del crédito (sin seguros):</strong> ${totalPagado.toLocaleString("es-CO")}</p>
          <p><strong>Total pagado al final del crédito (con seguros):</strong> ${totalConSeguros.toLocaleString("es-CO")}</p>
        </div>
      )}

      {amortizacion.length > 0 && (
        <div className="mt-10">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-2xl font-semibold text-blue-700">Tabla de Amortización Anual</h3>
            <button
              onClick={descargarPDF}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Descargar PDF
            </button>
          </div>
          <div ref={tablaRef} className="overflow-x-auto border rounded-lg shadow-sm">
            <table className="w-full table-auto text-sm">
              <thead className="bg-blue-50">
                <tr>
                  <th className="p-2 border">Año</th>
                  <th className="p-2 border">Intereses</th>
                  <th className="p-2 border">Abono a Capital</th>
                  <th className="p-2 border">Saldo Pendiente</th>
                </tr>
              </thead>
              <tbody>
                {amortizacion.map((fila) => (
                  <tr key={fila.anio} className="text-center">
                    <td className="p-2 border">{fila.anio}</td>
                    <td className="p-2 border">${fila.intereses.toLocaleString("es-CO")}</td>
                    <td className="p-2 border">${fila.abonoCapital.toLocaleString("es-CO")}</td>
                    <td className="p-2 border">${fila.saldoPendiente.toLocaleString("es-CO")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
