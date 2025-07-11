import React from 'react';
import BaseSelect from './BaseSelect';

const StateSelect = ({
  country,
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
      disabled={disabled || !country}
      searchable={searchable}
      placeholder="-- Select State --"
      apiEndpoint="/api/all/Location:states"
      apiQueryParamName="country"
      apiQueryParamValue={country}
      loadOnMount={false}
    />
  );
};

export default StateSelect;
