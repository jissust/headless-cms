import { useEffect } from 'react';

const InputServiceTotalGanancia = (props: any, ref: any) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;

  useEffect(() => {
    const inputTotal = document.querySelector<HTMLInputElement>('input[name="total"]');
    const inputGasto = document.querySelector<HTMLInputElement>('input[name="total_gasto"]');

    if (!inputTotal || !inputGasto) return;

    const calcularGanancia = () => {
      const totalService = parseFloat(inputTotal.value) || 0;
      const totalGastoService = parseFloat(inputGasto.value) || 0;
      const ganancia = totalService - totalGastoService;

      onChange({
        target: {
          name: 'ganancia',
          type: 'number',
          value: ganancia,
        },
      });
    };

    // Escuchar cuando cambien los valores
    inputTotal.addEventListener('input', calcularGanancia);
    inputGasto.addEventListener('input', calcularGanancia);

    // Calcular una vez al montar
    calcularGanancia();

    // Limpiar listeners al desmontar
    return () => {
      inputTotal.removeEventListener('input', calcularGanancia);
      inputGasto.removeEventListener('input', calcularGanancia);
    };
  }, [onChange]);

  return (
    <>
      <label className="label-customize">Ganancia</label>
      <input
        name={name}
        disabled={true}
        required={required}
        value={value}
        min="0"
        type="number"
        className="input-customize"
      />
    </>
  );
};

export { InputServiceTotalGanancia };
