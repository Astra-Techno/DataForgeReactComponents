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
} from '../src/index.js'; // Import from parent directory

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

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: 'white',
      padding: '2rem',
      color: '#333',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      marginBottom: '2rem',
      color: '#2563eb',
      textAlign: 'center'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    section: {
      padding: '1.5rem',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: '#fafafa'
    },
    sectionTitle: {
      marginBottom: '1rem',
      color: '#374151',
      fontSize: '1.25rem',
      fontWeight: '600'
    },
    valuesSection: {
      marginTop: '2rem',
      padding: '1.5rem',
      backgroundColor: '#f8fafc',
      borderRadius: '8px',
      border: '1px solid #e5e7eb'
    },
    pre: {
      fontSize: '0.875rem',
      lineHeight: '1.5',
      color: '#4b5563',
      overflow: 'auto',
      backgroundColor: 'white',
      padding: '1rem',
      borderRadius: '4px',
      border: '1px solid #e5e7eb'
    },
    componentWrapper: {
      marginBottom: '1rem'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>
        🌐 DataForge React Components - Local Test
      </h1>

      <div style={styles.grid}>
        {/* Location Selectors Section */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>📍 Location Selectors</h2>
          
          <div style={styles.componentWrapper}>
            <RegionSelect
              label="Region"
              value={regionId}
              onChange={setRegionId}
              searchable={true}
              required={true}
            />
          </div>
          
          <div style={styles.componentWrapper}>
            <SubregionSelect
              label="Sub-Region"
              value={subRegionId}
              onChange={setSubRegionId}
              region={regionId}
              searchable={true}
            />
          </div>
          
          <div style={styles.componentWrapper}>
            <CountrySelect
              label="Country"
              value={countryId}
              onChange={setCountryId}
              subregion={subRegionId}
              searchable={true}
              onSelected={handleCountrySelected}
            />
          </div>
          
          <div style={styles.componentWrapper}>
            <StateSelect
              label="State"
              value={stateId}
              onChange={setStateId}
              country={countryId}
              searchable={true}
            />
          </div>
          
          <div style={styles.componentWrapper}>
            <CitySelect
              label="City"
              value={cityId}
              onChange={setCityId}
              state={stateId}
              searchable={true}
            />
          </div>
        </section>

        {/* Address Input Section */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>🏠 Address Input</h2>
          
          <AddressInput
            label="Complete Address"
            value={addressData}
            onChange={setAddressData}
            locationSelectorsSearchable={true}
          />
        </section>

        {/* Phone Selector Section */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>📞 Phone Selector</h2>
          
          <PhoneSelect
            label="Phone Number"
            value={phoneNumber}
            onChange={setPhoneNumber}
            defaultCountryCode="US"
            required={true}
          />
        </section>

        {/* Timezone Selector Section */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>⏰ Timezone Selector</h2>
          
          <div style={styles.componentWrapper}>
            <TimezoneSelect
              label="Timezone (ID)"
              value={timezoneId}
              onChange={setTimezoneId}
              countryCode="IN"
            />
          </div>
          
          <div style={styles.componentWrapper}>
            <TimezoneSelect
              label="Timezone (Offset)"
              value={timezoneOffset}
              onChange={setTimezoneOffset}
              countryCode="US"
              emitOffsetFormat={true}
            />
          </div>
        </section>

        {/* Language Selector Section */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>🗣️ Language Selector</h2>
          
          <LanguageSelect
            label="Language"
            value={languageId}
            onChange={setLanguageId}
            defaultCountry="India"
            searchable={true}
          />
        </section>

        {/* Currency Selector Section */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>💰 Currency Selector</h2>
          
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
      <section style={styles.valuesSection}>
        <h2 style={styles.sectionTitle}>📊 Current Values</h2>
        <pre style={styles.pre}>
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
