import React, { useState, useEffect, useMemo } from 'react';
import axios from '../axios';
import BaseSelect from '../location-selector/BaseSelect';
import '../assets/fallback.css';

const LanguageSelect = ({
  value,
  onChange,
  label,
  required = false,
  triggerClass,
  labelClass,
  defaultCountry,
  searchable = true,
  defaultValue,
  disabled = false
}) => {
  const [allLanguagesFromApi, setAllLanguagesFromApi] = useState([]);
  const [loading, setLoading] = useState(false);

  // Computed property to filter and format languages for BaseSelect
  const computedLanguages = useMemo(() => {
    if (loading && allLanguagesFromApi.length === 0) {
      return [];
    }

    let filtered = allLanguagesFromApi;

    // Map to the { id, name } format expected by BaseSelect
    // Sort alphabetically by name
    return filtered
      .map(lang => ({
        id: lang.id,
        name: lang.name
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [loading, allLanguagesFromApi]);

  // Watch for country prop changes
  useEffect(() => {
    onChange('');
    loadOptions();
  }, [defaultCountry]);

  const loadOptions = async () => {
    setLoading(true);
    try {
      const query = defaultCountry ? `?country=${encodeURIComponent(defaultCountry)}` : '';
      const res = await axios.get('/api/all/Location:languages' + query);
      setAllLanguagesFromApi(res.data);
    } catch (e) {
      console.error('Language load failed:', e);
      setAllLanguagesFromApi([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOptions();
  }, []);

  return (
    <div>
      <BaseSelect
        value={value || defaultValue}
        onChange={onChange}
        options={computedLanguages}
        label={label}
        required={required}
        triggerClass={triggerClass}
        labelClass={labelClass}
        searchable={searchable}
        loading={loading}
        disabled={disabled || loading}
        placeholder="-- Select Language --"
      />
    </div>
  );
};

export default LanguageSelect;
