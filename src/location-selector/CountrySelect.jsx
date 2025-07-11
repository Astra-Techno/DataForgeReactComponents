import React, { useState, useEffect, useMemo } from 'react';
import BaseSelect from './BaseSelect';

const CountrySelect = ({
  subregion,
  region,
  value,
  onChange,
  onSelected,
  label,
  required,
  selectClass,
  labelClass,
  disabled,
  searchable,
  defaultValue
}) => {
  const [loadedOptions, setLoadedOptions] = useState([]);

  const apiQueryParamName = useMemo(() => {
    if (subregion) return 'subregion';
    if (region) return 'region';
    return undefined;
  }, [subregion, region]);

  const apiQueryParamValue = useMemo(() => subregion || region, [subregion, region]);

  const apiQueryString = useMemo(() => {
    if (!region && !subregion) return 'all=1';
    return undefined;
  }, [region, subregion]);

  const loadOnMountCalculated = useMemo(() => !region && !subregion, [region, subregion]);

  const handleModelUpdate = (val) => {
    onChange(val);
    emitSelectedCountry(val);
  };

  const handleOptionsLoaded = (options) => {
    setLoadedOptions(options);
    // If there's an initial value, emit the selected object after options are loaded
    if (value && options.length > 0) {
      emitSelectedCountry(value);
    }
  };

  // Helper to emit the selected country object
  const emitSelectedCountry = (selectedId) => {
    const selected = loadedOptions.find(item => item.id === selectedId);
    if (selected) {
      onSelected?.(selected);
    } else {
      onSelected?.(null);
    }
  };

  // This effect now correctly depends on `onSelected`. If the parent provides an
  // unstable function for `onSelected`, this effect will re-run on every parent
  // render, causing a potential infinite loop.
  useEffect(() => {
    if (loadedOptions.length > 0) {
      emitSelectedCountry(value);
    }
  }, [value, loadedOptions, onSelected]);

  return (
    <BaseSelect
      value={value || defaultValue}
      onChange={handleModelUpdate}
      onLoaded={handleOptionsLoaded}
      label={label}
      required={required}
      triggerClass={selectClass}
      labelClass={labelClass}
      disabled={disabled}
      searchable={searchable}
      placeholder="-- Select Country --"
      apiEndpoint="/api/all/Location:countries"
      apiQueryParamName={apiQueryParamName}
      apiQueryParamValue={apiQueryParamValue}
      apiQueryString={apiQueryString}
      loadOnMount={loadOnMountCalculated}
    />
  );
};

export default React.memo(CountrySelect);
