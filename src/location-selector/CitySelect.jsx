import React from 'react';
import BaseSelect from './BaseSelect';

const CitySelect = ({
  state,
  value,
  onChange,
  label,
  required,
  selectClass,
  labelClass,
  disabled,
  searchable,
  defaultValue
}) => {
  return (
    <BaseSelect
      value={value || defaultValue}
      onChange={onChange}
      label={label}
      required={required}
      triggerClass={selectClass}
      labelClass={labelClass}
      disabled={disabled || !state}
      searchable={searchable}
      placeholder="-- Select City --"
      apiEndpoint="/api/all/Location:cities"
      apiQueryParamName="state"
      apiQueryParamValue={state}
      loadOnMount={false}
    />
  );
};

export default CitySelect;
