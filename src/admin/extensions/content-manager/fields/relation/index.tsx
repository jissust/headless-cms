import React, { useEffect } from 'react';

export default function CustomRelationInput({ name, value, onChange, attribute, ...props }: any) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const localId = params.get('localId');

    // Solo para el campo "local" y si aún no tiene valor
    if (name === 'local' && localId && !value) {
      onChange({ target: { name, value: localId } });
    }
  }, [name, value, onChange]);

  const DefaultComponent = props.components.Input;
  return <DefaultComponent name={name} value={value} onChange={onChange} attribute={attribute} {...props} />;
}
