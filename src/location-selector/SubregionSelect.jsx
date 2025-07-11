import React from 'react';
import BaseSelect from './BaseSelect';

const SubregionSelect = ({
  region,
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
      disabled={disabled || !region}
      searchable={searchable}
      placeholder="-- Select Sub-Region --"
      apiEndpoint="/api/all/Location:subregions"
      apiQueryParamName="region"
      apiQueryParamValue={region}
      loadOnMount={false}
    />
  );
};

export default SubregionSelect;
