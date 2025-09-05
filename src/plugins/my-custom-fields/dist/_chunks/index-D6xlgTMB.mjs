import { jsx } from "react/jsx-runtime";
const TitleSection = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  return /* @__PURE__ */ jsx("h1", { className: "h1", children: attribute?.options?.label });
};
export {
  TitleSection
};
