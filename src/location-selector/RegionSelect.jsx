import React from 'react';
import BaseSelect from './BaseSelect';

const RegionSelect = ({
  value,
  onChange,
  label,
  required,
  selectClass,
  labelClass,
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
      placeholder="-- Select Region --"
      apiEndpoint="/api/all/Location:regions"
      loadOnMount={true}
      searchable={searchable}
    />
  );
};

export default RegionSelect;
