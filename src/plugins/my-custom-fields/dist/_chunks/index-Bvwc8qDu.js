"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const react = require("react");
const InputServiceTotalGanancia = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  react.useEffect(() => {
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
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("label", { className: "label-customize", children: "Ganancia" }),
    /* @__PURE__ */ jsxRuntime.jsx(
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
exports.InputServiceTotalGanancia = InputServiceTotalGanancia;
