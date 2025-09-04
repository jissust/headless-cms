import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useEffect } from "react";
const InputServiceTotalGanancia = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  useEffect(() => {
    const inputTotal = document.querySelector('input[name="total"]');
    const inputGasto = document.querySelector('input[name="total_gasto"]');
    if (!inputTotal || !inputGasto) return;
    const calcularGanancia = () => {
      const totalService = parseFloat(inputTotal.value) || 0;
      const totalGastoService = parseFloat(inputGasto.value) || 0;
      const ganancia = totalService - totalGastoService;
      onChange({
        target: {
          name: "ganancia",
          type: "number",
          value: ganancia
        }
      });
    };
    inputTotal.addEventListener("input", calcularGanancia);
    inputGasto.addEventListener("input", calcularGanancia);
    calcularGanancia();
    return () => {
      inputTotal.removeEventListener("input", calcularGanancia);
      inputGasto.removeEventListener("input", calcularGanancia);
    };
  }, [onChange]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("label", { className: "label-customize", children: "Ganancia" }),
    /* @__PURE__ */ jsx(
      "input",
      {
        name,
        disabled: true,
        required,
        value,
        min: "0",
        type: "number",
        className: "input-customize"
      }
    )
  ] });
};
export {
  InputServiceTotalGanancia
};
