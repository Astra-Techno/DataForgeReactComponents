import React, { useState, useEffect, useMemo } from 'react';
import { CountrySelect, StateSelect, CitySelect } from '../location-selector';
import '../assets/fallback.css';

const AddressInput = ({
  value = {
    street1: '',
    street2: '',
    city: '',
    state: '',
    country: '',
    postalCode: ''
  },
  onChange,
  label,
  labelClass,
  fieldLabelClass = 'fallback-label-sm',
  inputClass = 'fallback-input',
  requiredFields = {
    street1: true,
    city: true,
    state: true,
    country: true,
    postalCode: true
  },
  locationSelectorsSearchable = false
}) => {
  const [address, setAddress] = useState(value);

  // Generate unique IDs for form fields
  const street1Id = useMemo(() => `street1-${Math.random().toString(36).slice(2, 7)}`, []);
  const street2Id = useMemo(() => `street2-${Math.random().toString(36).slice(2, 7)}`, []);
  const postalCodeId = useMemo(() => `postalCode-${Math.random().toString(36).slice(2, 7)}`, []);

  // Update internal state when external value changes
  useEffect(() => {
    setAddress(value);
  }, [value]);

  const handleAddressChange = (field, newValue) => {
    const newAddress = { ...address, [field]: newValue };
    setAddress(newAddress);
    if (onChange) {
      onChange(newAddress);
    }
  };

  const onCountryChange = (countryValue) => {
    const newAddress = {
      ...address,
      country: countryValue,
      state: '',
      city: ''
    };
    setAddress(newAddress);
    if (onChange) {
      onChange(newAddress);
    }
  };

  const onStateChange = (stateValue) => {
    const newAddress = {
      ...address,
      state: stateValue,
      city: ''
    };
    setAddress(newAddress);
    if (onChange) {
      onChange(newAddress);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid #CBD5E0',
    borderRadius: '0.25rem',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    minHeight: '38px',
    fontSize: '1rem',
    lineHeight: '1.5',
    color: '#333'
  };

  const labelStyle = {
    display: 'block',
    fontWeight: 500,
    marginBottom: '0.25rem',
    fontSize: '0.875rem',
    color: '#4A5568'
  };

  const formGroupStyle = {
    marginBottom: '1rem'
  };

  return (
    <div className="address-input-form">
      {label && (
        <div className={labelClass || 'fallback-label'}>
          {label}
        </div>
      )}

      {/* Street Address Line 1 */}
      <div style={formGroupStyle}>
        <label htmlFor={street1Id} style={labelStyle}>
          Street Address
          {requiredFields.street1 && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
        <input
          id={street1Id}
          type="text"
          value={address.street1}
          onChange={(e) => handleAddressChange('street1', e.target.value)}
          required={requiredFields.street1}
          style={inputStyle}
          placeholder="Street and number, P.O. box, c/o"
        />
      </div>

      {/* Street Address Line 2 (Optional) */}
      <div style={formGroupStyle}>
        <label htmlFor={street2Id} style={labelStyle}>
          Address Line 2 <span style={{ fontSize: '0.8em', color: '#666', fontWeight: 'normal' }}>(Optional)</span>
        </label>
        <input
          id={street2Id}
          type="text"
          value={address.street2}
          onChange={(e) => handleAddressChange('street2', e.target.value)}
          style={inputStyle}
          placeholder="Apartment, suite, unit, building, floor, etc."
        />
      </div>

      {/* Country Selector */}
      <div style={formGroupStyle}>
        <CountrySelect
          value={address.country}
          onChange={onCountryChange}
          label="Country"
          required={requiredFields.country}
          selectClass={inputClass}
          triggerClass={inputClass}
          labelClass={fieldLabelClass}
          searchable={locationSelectorsSearchable}
        />
      </div>

      {/* State/Province Selector */}
      <div style={formGroupStyle}>
        <StateSelect
          value={address.state}
          onChange={onStateChange}
          label="State/Province"
          country={address.country}
          required={requiredFields.state}
          triggerClass={inputClass}
          labelClass={fieldLabelClass}
          disabled={!address.country}
          searchable={locationSelectorsSearchable}
        />
      </div>

      {/* City Selector */}
      <div style={formGroupStyle}>
        <CitySelect
          value={address.city}
          onChange={(cityValue) => handleAddressChange('city', cityValue)}
          label="City"
          state={address.state}
          required={requiredFields.city}
          triggerClass={inputClass}
          labelClass={fieldLabelClass}
          disabled={!address.state}
          searchable={locationSelectorsSearchable}
        />
      </div>

      {/* Postal Code */}
      <div style={formGroupStyle}>
        <label htmlFor={postalCodeId} style={labelStyle}>
          Postal/ZIP Code
          {requiredFields.postalCode && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
        <input
          id={postalCodeId}
          type="text"
          value={address.postalCode}
          onChange={(e) => handleAddressChange('postalCode', e.target.value)}
          required={requiredFields.postalCode}
          style={inputStyle}
        />
      </div>
    </div>
  );
};

export default AddressInput;
