import { jsx, Fragment } from "react/jsx-runtime";
import { useEffect } from "react";
const SalesDetectChangesInItems = (props, ref) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  useEffect(() => {
    console.log("Detecting changes in items...");
    const observer = new MutationObserver(() => {
      getTotals(".input_total_item_product", "total");
      getTotals(".input_ganancia_item_product", "total_ganancia");
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  const getTotals = (totalsInput, totalsName) => {
    const totals = document.querySelectorAll(totalsInput);
    let total = 0;
    if (totals.length > 0) {
      for (const input of totals) {
        const val = parseFloat(input.value);
        if (!isNaN(val)) {
          total += val;
        }
      }
      onChange({
        target: {
          name: totalsName,
          type: "number",
          value: total
        }
      });
    }
  };
  return /* @__PURE__ */ jsx(Fragment, {});
};
export {
  SalesDetectChangesInItems
};
