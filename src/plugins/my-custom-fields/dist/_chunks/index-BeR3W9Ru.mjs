import { jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
const InputNombreLocal = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  const [nombreLocal, setNombreLocal] = useState("");
  const queryParams = new URLSearchParams(window.location.search);
  const localId = queryParams.get("localId");
  fetch(`/api/locals?filters[id][$eq]=${localId}`).then((res) => res.json()).then((data) => {
    if (!data?.data) {
      console.error("Debe seleccionar un local");
      return;
    }
    setNombreLocal(data.data[0].nombre);
  }).catch((err) => {
    console.error("Error al cargar el local", err);
  });
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
    "input",
    {
      name,
      disabled: true,
      required,
      value: nombreLocal,
      type: "text",
      className: "input-customize"
    }
  ) });
};
export {
  InputNombreLocal
};
