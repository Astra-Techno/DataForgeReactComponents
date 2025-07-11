# 🌍 DataForge React Components

A comprehensive React component library providing location-based selectors, utilities, and form components with real-time API data integration.

[![npm version](https://badge.fury.io/js/@data-forge-services%2Freact-core.svg)](https://www.npmjs.com/package/@data-forge-services/react-core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🌍 **Real API Data** - Live data from DataForge API
- 🔗 **Smart Cascading** - Components work intelligently together
- 🔍 **Searchable Dropdowns** - Real-time filtering and search
- 🎯 **Country-Based Filtering** - Automatic filtering based on country selection
- 📱 **Mobile Optimized** - Responsive design with proper input types
- ♿ **Accessible** - ARIA labels and keyboard navigation
- 🎨 **Customizable** - CSS classes and styling options
- 📦 **Zero Configuration** - Automatic API token management
- 🛡️ **TypeScript Support** - Full type definitions included

## 🚀 Quick Start

### Installation

```bash
npm install @data-forge-services/react-core
```

### Basic Usage

```jsx
import React, { useState } from 'react';
import { CountrySelect, StateSelect } from '@data-forge-services/react-core';
import '@data-forge-services/react-core/dist/react-core.css';

function App() {
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');

  const handleCountryChange = (newCountry) => {
    setCountry(newCountry);
    setState(''); // Reset state when country changes
  };

  return (
    <div>
      <CountrySelect
        label="Country"
        value={country}
        onChange={handleCountryChange}
        searchable={true}
      />
      
      <StateSelect
        label="State/Province"
        value={state}
        onChange={setState}
        country={country}
        searchable={true}
      />
    </div>
  );
}
```

## 📦 Available Components

### 📍 Location Hierarchy Components

#### `RegionSelect`
Select world regions (Asia, Europe, Americas, etc.)

```jsx
import { RegionSelect } from '@data-forge-services/react-core';

<RegionSelect
  label="Region"
  value={region}
  onChange={setRegion}
  searchable={true}
  onSelected={(regionObject) => console.log('Selected:', regionObject)}
/>
```

#### `SubregionSelect`
Select subregions within a selected region

```jsx
import { SubregionSelect } from '@data-forge-services/react-core';

<SubregionSelect
  label="Subregion"
  value={subregion}
  onChange={setSubregion}
  region={region}  // Filter by selected region
  searchable={true}
/>
```

#### `CountrySelect`
Select countries with optional region/subregion filtering

```jsx
import { CountrySelect } from '@data-forge-services/react-core';

<CountrySelect
  label="Country"
  value={country}
  onChange={setCountry}
  region={region}        // Optional: filter by region
  subregion={subregion}  // Optional: filter by subregion
  searchable={true}
  onSelected={(countryObject) => {
    console.log('Full country data:', countryObject);
    // Use country data for other components
  }}
/>
```

#### `StateSelect`
Select states/provinces within a country

```jsx
import { StateSelect } from '@data-forge-services/react-core';

<StateSelect
  label="State/Province"
  value={state}
  onChange={setState}
  country={country}  // Required for filtering
  searchable={true}
/>
```

#### `CitySelect`
Select cities within a country and state

```jsx
import { CitySelect } from '@data-forge-services/react-core';

<CitySelect
  label="City"
  value={city}
  onChange={setCity}
  country={country}  // Required
  state={state}      // Required
  searchable={true}
/>
```

### 🔧 Utility Components

#### `TimezoneSelect`
Select timezones with optional country filtering

```jsx
import { TimezoneSelect } from '@data-forge-services/react-core';

<TimezoneSelect
  label="Timezone"
  value={timezone}
  onChange={setTimezone}
  country={country}  // Optional: filter by country
  searchable={true}
/>
```

#### `CurrencySelect`
Select currencies with optional country filtering

```jsx
import { CurrencySelect } from '@data-forge-services/react-core';

<CurrencySelect
  label="Currency"
  value={currency}
  onChange={setCurrency}
  country={country}  // Optional: filter by country
  searchable={true}
/>
```

#### `LanguageSelect`
Select languages with optional country filtering

```jsx
import { LanguageSelect } from '@data-forge-services/react-core';

<LanguageSelect
  label="Language"
  value={language}
  onChange={setLanguage}
  country={country}  // Optional: filter by country
  searchable={true}
/>
```

#### `PhoneSelect`
International phone number input with country code selection

```jsx
import { PhoneSelect } from '@data-forge-services/react-core';

<PhoneSelect
  label="Phone Number"
  value={phone}
  onChange={setPhone}
  defaultCountryCode={country}  // Auto-set country code
  required={true}
/>
```

### 🏠 Address Components

#### `AddressInput`
Complete address form with integrated location components

```jsx
import { AddressInput } from '@data-forge-services/react-core';

const [address, setAddress] = useState({
  street1: '',
  street2: '',
  city: '',
  state: '',
  country: '',
  postalCode: ''
});

<AddressInput
  value={address}
  onChange={setAddress}
  locationSelectorsSearchable={true}
  onAddressChange={(newAddress) => {
    console.log('Address updated:', newAddress);
  }}
/>
```

## 🎯 Advanced Usage Examples

### Complete Location Hierarchy

```jsx
import React, { useState, useCallback } from 'react';
import {
  RegionSelect,
  SubregionSelect,
  CountrySelect,
  StateSelect,
  CitySelect
} from '@data-forge-services/react-core';

function LocationForm() {
  const [region, setRegion] = useState('');
  const [subregion, setSubregion] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  // Cascade handlers that reset child values
  const handleRegionChange = (newRegion) => {
    setRegion(newRegion);
    setSubregion('');
    setCountry('');
    setState('');
    setCity('');
  };

  const handleSubregionChange = (newSubregion) => {
    setSubregion(newSubregion);
    setCountry('');
    setState('');
    setCity('');
  };

  const handleCountryChange = (newCountry) => {
    setCountry(newCountry);
    setState('');
    setCity('');
  };

  const handleStateChange = (newState) => {
    setState(newState);
    setCity('');
  };

  return (
    <div>
      <RegionSelect
        label="Region"
        value={region}
        onChange={handleRegionChange}
        searchable={true}
      />
      
      <SubregionSelect
        label="Subregion"
        value={subregion}
        onChange={handleSubregionChange}
        region={region}
        searchable={true}
      />
      
      <CountrySelect
        label="Country"
        value={country}
        onChange={handleCountryChange}
        region={region}
        subregion={subregion}
        searchable={true}
      />
      
      <StateSelect
        label="State/Province"
        value={state}
        onChange={handleStateChange}
        country={country}
        searchable={true}
      />
      
      <CitySelect
        label="City"
        value={city}
        onChange={setCity}
        country={country}
        state={state}
        searchable={true}
      />
    </div>
  );
}
```

### Country-Based Utility Filtering

```jsx
import React, { useState, useCallback } from 'react';
import {
  CountrySelect,
  TimezoneSelect,
  CurrencySelect,
  LanguageSelect,
  PhoneSelect
} from '@data-forge-services/react-core';

function CountryDependentForm() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [timezone, setTimezone] = useState('');
  const [currency, setCurrency] = useState('');
  const [language, setLanguage] = useState('');
  const [phone, setPhone] = useState('');

  const handleCountrySelected = useCallback((countryObject) => {
    setSelectedCountry(countryObject);
    // Reset dependent values when country changes
    setTimezone('');
    setCurrency('');
    setLanguage('');
  }, []);

  return (
    <div>
      <CountrySelect
        label="Country"
        value={selectedCountry?.id || ''}
        onChange={(value) => setSelectedCountry({ id: value })}
        onSelected={handleCountrySelected}
        searchable={true}
      />
      
      {/* These components will filter based on selected country */}
      <TimezoneSelect
        label="Timezone"
        value={timezone}
        onChange={setTimezone}
        country={selectedCountry?.id}
        searchable={true}
      />
      
      <CurrencySelect
        label="Currency"
        value={currency}
        onChange={setCurrency}
        country={selectedCountry?.id}
        searchable={true}
      />
      
      <LanguageSelect
        label="Language"
        value={language}
        onChange={setLanguage}
        country={selectedCountry?.id}
        searchable={true}
      />
      
      <PhoneSelect
        label="Phone Number"
        value={phone}
        onChange={setPhone}
        defaultCountryCode={selectedCountry?.id}
      />
    </div>
  );
}
```

## 🔧 Component Props Reference

### Common Props (All Components)

```typescript
interface CommonProps {
  label?: string;                      // Display label
  value?: string | number;             // Current selected value
  onChange: (value: string) => void;   // Change handler
  searchable?: boolean;                // Enable search functionality
  disabled?: boolean;                  // Disable component
  required?: boolean;                  // Mark as required field
  placeholder?: string;                // Placeholder text
  onSelected?: (item: object) => void; // Selection callback with full object
}
```

### Location Component Props

```typescript
interface RegionSelectProps extends CommonProps {}

interface SubregionSelectProps extends CommonProps {
  region?: string; // Filter by region
}

interface CountrySelectProps extends CommonProps {
  region?: string;     // Filter by region
  subregion?: string;  // Filter by subregion
}

interface StateSelectProps extends CommonProps {
  country?: string; // Required for fetching states
}

interface CitySelectProps extends CommonProps {
  country?: string; // Required for fetching cities
  state?: string;   // Required for fetching cities
}
```

### Utility Component Props

```typescript
interface TimezoneSelectProps extends CommonProps {
  country?: string; // Filter timezones by country
}

interface CurrencySelectProps extends CommonProps {
  country?: string; // Filter currencies by country
}

interface LanguageSelectProps extends CommonProps {
  country?: string; // Filter languages by country
}

interface PhoneSelectProps extends CommonProps {
  defaultCountryCode?: string; // Auto-set country code
}
```

### Address Component Props

```typescript
interface AddressValue {
  street1: string;
  street2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface AddressInputProps {
  value: AddressValue;
  onChange: (address: AddressValue) => void;
  locationSelectorsSearchable?: boolean;
  onAddressChange?: (address: AddressValue) => void;
}
```

## 🎨 Styling

### Default CSS

Import the included CSS file for default styling:

```jsx
import '@data-forge-services/react-core/dist/react-core.css';
```

### CSS Classes

Available CSS classes for customization:

```css
/* Label styling */
.fallback-label {
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 14px;
  color: #333;
}

/* Select container */
.fallback-select {
  position: relative;
  display: inline-block;
  width: 100%;
}

/* Dropdown trigger */
.fallback-select-trigger {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}

/* Dropdown menu */
.fallback-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #ccc;
  border-top: none;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}

/* Dropdown options */
.fallback-option {
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.fallback-option:hover {
  background-color: #f5f5f5;
}

.fallback-option.selected {
  background-color: #e3f2fd;
  font-weight: bold;
}
```

## 🔗 API Integration

### Automatic Setup

Components automatically connect to the DataForge API. An API token is generated during installation:

```bash
# Automatic during npm install
npm install @data-forge-services/react-core
```

### Manual Token Setup

If needed, manually set up the API token:

```bash
npm run setup
```

### Custom Configuration

For custom API endpoints or configuration:

```jsx
// This is handled automatically, but you can check the config
import config from '@data-forge-services/react-core/src/location-selector/services.config.js';
console.log('API Configuration:', config);
```

## 🔧 Requirements

- **React**: 18.0.0 or higher
- **React DOM**: 18.0.0 or higher
- **Modern Browser**: ES2020 support

## 📱 Mobile Support

Components are optimized for mobile devices:

- **Responsive design** - Works on all screen sizes
- **Touch-friendly** - Proper touch targets
- **Mobile keyboards** - Correct input types (`tel`, `email`, etc.)
- **Accessibility** - Screen reader support

## 🛠️ Development

### Building from Source

```bash
git clone https://github.com/Astra-Techno/DataForgeReactComponents.git
cd DataForgeReactComponents
npm install
npm run build
```

### Running Tests

```bash
npm test
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🐛 Issues & Support

- **Bug Reports**: [GitHub Issues](https://github.com/Astra-Techno/DataForgeReactComponents/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/Astra-Techno/DataForgeReactComponents/discussions)
- **Documentation**: [GitHub Wiki](https://github.com/Astra-Techno/DataForgeReactComponents/wiki)

## 🙏 Acknowledgments

- **DataForge API** - For providing comprehensive location data
- **libphonenumber-js** - For phone number validation and formatting
- **Flag Icons** - For country flag representations
- **React Community** - For the amazing ecosystem

---

**Made with ❤️ by [Astra Techno](https://github.com/Astra-Techno)**
