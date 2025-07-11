import React, { useState } from 'react';
import {
  RegionSelect,
  SubregionSelect,
  CountrySelect,
  StateSelect,
  CitySelect,
  AddressInput,
  PhoneSelect,
  TimezoneSelect,
  LanguageSelect,
  CurrencySelect
} from '@data-forge-services/react-core';

function App() {
  // Location selectors state
  const [regionId, setRegionId] = useState('');
  const [subRegionId, setSubRegionId] = useState('');
  const [countryId, setCountryId] = useState('');
  const [stateId, setStateId] = useState('');
  const [cityId, setCityId] = useState('');

  // Other components state
  const [addressData, setAddressData] = useState({
    street1: '',
    street2: '',
    city: '',
    state: '',
    country: '',
    postalCode: ''
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [timezoneId, setTimezoneId] = useState('');
  const [timezoneOffset, setTimezoneOffset] = useState('');
  const [languageId, setLanguageId] = useState('');
  const [currencyId, setCurrencyId] = useState('');

  const handleCountrySelected = (countryObject) => {
    console.log('Country selected in parent:', countryObject);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'white', 
      padding: '2rem', 
      color: '#333',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ marginBottom: '2rem', color: '#2563eb' }}>
        🌐 Data Forge React Components Demo
      </h1>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem',
        maxWidth: '1200px'
      }}>
        {/* Location Selectors Section */}
        <section style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h2 style={{ marginBottom: '1rem', color: '#374151' }}>📍 Location Selectors</h2>
          
          <RegionSelect
            label="Region"
            value={regionId}
            onChange={setRegionId}
            searchable={true}
            required={true}
          />
          
          <SubregionSelect
            label="Sub-Region"
            value={subRegionId}
            onChange={setSubRegionId}
            region={regionId}
            searchable={true}
          />
          
          <CountrySelect
            label="Country"
            value={countryId}
            onChange={setCountryId}
            subregion={subRegionId}
            searchable={true}
            onSelected={handleCountrySelected}
          />
          
          <StateSelect
            label="State"
            value={stateId}
            onChange={setStateId}
            country={countryId}
            searchable={true}
          />
          
          <CitySelect
            label="City"
            value={cityId}
            onChange={setCityId}
            state={stateId}
            searchable={true}
          />
        </section>

        {/* Address Input Section */}
        <section style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h2 style={{ marginBottom: '1rem', color: '#374151' }}>🏠 Address Input</h2>
          
          <AddressInput
            label="Complete Address"
            value={addressData}
            onChange={setAddressData}
            locationSelectorsSearchable={true}
          />
        </section>

        {/* Phone Selector Section */}
        <section style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h2 style={{ marginBottom: '1rem', color: '#374151' }}>📞 Phone Selector</h2>
          
          <PhoneSelect
            label="Phone Number"
            value={phoneNumber}
            onChange={setPhoneNumber}
            defaultCountryCode="US"
            required={true}
          />
        </section>

        {/* Timezone Selector Section */}
        <section style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h2 style={{ marginBottom: '1rem', color: '#374151' }}>⏰ Timezone Selector</h2>
          
          <TimezoneSelect
            label="Timezone (ID)"
            value={timezoneId}
            onChange={setTimezoneId}
            countryCode="IN"
          />
          
          <TimezoneSelect
            label="Timezone (Offset)"
            value={timezoneOffset}
            onChange={setTimezoneOffset}
            countryCode="US"
            emitOffsetFormat={true}
          />
        </section>

        {/* Language Selector Section */}
        <section style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h2 style={{ marginBottom: '1rem', color: '#374151' }}>🗣️ Language Selector</h2>
          
          <LanguageSelect
            label="Language"
            value={languageId}
            onChange={setLanguageId}
            defaultCountry="India"
            searchable={true}
          />
        </section>

        {/* Currency Selector Section */}
        <section style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h2 style={{ marginBottom: '1rem', color: '#374151' }}>💰 Currency Selector</h2>
          
          <CurrencySelect
            label="Currency"
            value={currencyId}
            onChange={setCurrencyId}
            countryCode="CA"
            searchable={true}
          />
        </section>
      </div>

      {/* Values Display */}
      <section style={{ 
        marginTop: '2rem', 
        padding: '1.5rem', 
        backgroundColor: '#f8fafc', 
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <h2 style={{ marginBottom: '1rem', color: '#374151' }}>📊 Current Values</h2>
        <pre style={{ 
          fontSize: '0.875rem', 
          lineHeight: '1.5',
          color: '#4b5563',
          overflow: 'auto'
        }}>
          {JSON.stringify({
            location: {
              region: regionId,
              subregion: subRegionId,
              country: countryId,
              state: stateId,
              city: cityId
            },
            address: addressData,
            phone: phoneNumber,
            timezone: {
              id: timezoneId,
              offset: timezoneOffset
            },
            language: languageId,
            currency: currencyId
          }, null, 2)}
        </pre>
      </section>
    </div>
  );
}

export default App;
