const TitleSection = (props: any, ref: any) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;

  return (
    <h1 className="h1">
      {attribute?.options?.label}
    </h1>
  );
};

export { TitleSection };
