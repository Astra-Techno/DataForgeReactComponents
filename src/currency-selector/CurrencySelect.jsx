import React, { useState, useEffect, useMemo } from 'react';
import axios from '../axios';
import BaseSelect from '../location-selector/BaseSelect';
import '../assets/fallback.css';

const CurrencySelect = ({
  value,
  onChange,
  label,
  required = false,
  triggerClass,
  labelClass,
  countryCode,
  region,
  subregion,
  searchable = true
}) => {
  const [allCurrenciesFromApi, setAllCurrenciesFromApi] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * Gets the URL for a country flag SVG.
   */
  const getFlagUrl = (countryCode) => {
    if (!countryCode || countryCode.length !== 2) return '';
    return `https://cdn.jsdelivr.net/npm/flag-icons@6.6.6/flags/1x1/${countryCode.toLowerCase()}.svg`;
  };

  // Computed property to get unique currencies for the dropdown
  const uniqueCurrencyOptions = useMemo(() => {
    const preferredCountryFlags = {
      "USD": "US",
      "EUR": "EU",
      "GBP": "GB",
      "JPY": "JP",
      "CAD": "CA",
      "AUD": "AU",
      "CHF": "CH",
      "INR": "IN",
    };

    const uniqueCurrenciesData = {};

    allCurrenciesFromApi.forEach(apiItem => {
      const currencyId = apiItem.id;
      const apiItemCountryCode = apiItem.country_code;

      if (!uniqueCurrenciesData[currencyId]) {
        let initialFlagCode = preferredCountryFlags[currencyId] || apiItemCountryCode;
        uniqueCurrenciesData[currencyId] = { data: apiItem, flagCode: initialFlagCode };
      } else {
        let currentBestFlagCode = uniqueCurrenciesData[currencyId].flagCode;
        let currentBestDataSource = uniqueCurrenciesData[currencyId].data;

        const globalPreferredFlag = preferredCountryFlags[currencyId];

        if (globalPreferredFlag) {
          currentBestFlagCode = globalPreferredFlag;
          if (apiItemCountryCode === globalPreferredFlag) {
            currentBestDataSource = apiItem;
          }
        } else if (apiItemCountryCode && currencyId && apiItemCountryCode.toUpperCase() === currencyId.toUpperCase()) {
          if (uniqueCurrenciesData[currencyId].flagCode.toUpperCase() !== currencyId.toUpperCase()) {
            currentBestFlagCode = apiItemCountryCode;
            currentBestDataSource = apiItem;
          }
        }
        uniqueCurrenciesData[currencyId] = { data: currentBestDataSource, flagCode: currentBestFlagCode };
      }
    });

    return Object.values(uniqueCurrenciesData)
      .sort((a, b) => (a.data.name || a.data.id).localeCompare(b.data.name || b.data.id))
      .map(entry => ({
        id: entry.data.id,
        name: `<img src="${getFlagUrl(entry.flagCode)}" class="currency-flag-icon" width="20" height="15"> <span class="currency-option-text">${entry.data.name} (${entry.data.currency_symbol})</span>`,
      }));
  }, [allCurrenciesFromApi]);

  const loadOptions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/all/Location:countries?select=currency&all=1');
      setAllCurrenciesFromApi(res.data);
      
      // After loading, if a countryCode is already provided, try to set the currency
      if (countryCode) {
        setCurrencyByCountry(countryCode);
      }
    } catch (e) {
      console.error('Currency load failed:', e);
      setAllCurrenciesFromApi([]);
    } finally {
      setLoading(false);
    }
  };

  const setCurrencyByCountry = (targetCountryCode) => {
    if (!targetCountryCode || allCurrenciesFromApi.length === 0) {
      return;
    }
    const foundCurrency = allCurrenciesFromApi.find(
      c => c.country_code && c.country_code.toUpperCase() === targetCountryCode.toUpperCase()
    );

    if (foundCurrency) {
      onChange(foundCurrency.id);
    }
  };

  useEffect(() => {
    setCurrencyByCountry(countryCode);
  }, [countryCode, allCurrenciesFromApi]);

  useEffect(() => {
    loadOptions();
  }, []);

  return (
    <div>
      <BaseSelect
        value={value}
        onChange={onChange}
        options={uniqueCurrencyOptions}
        label={label}
        required={required}
        triggerClass={triggerClass}
        labelClass={labelClass}
        loading={loading}
        searchable={searchable}
        placeholder="-- Select Currency --"
      />
    </div>
  );
};

export default CurrencySelect;
