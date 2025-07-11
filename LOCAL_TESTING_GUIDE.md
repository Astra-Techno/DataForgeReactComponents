# 🧪 Local Testing Guide - DataForge React Components

This guide shows you how to test the DataForge React components locally before publishing.

## 🚀 Method 1: Quick Test with Built-in Test App

### Step 1: Setup Dependencies
```bash
# Navigate to the main component library directory
cd C:\app\DataForgeReactComponents

# Install dependencies
npm install

# Generate API tokens (required for components to work)
npm run setup
```

### Step 2: Run the Test App
```bash
# Navigate to test app directory
cd test-app

# Install test app dependencies
npm install

# Start the development server
npm start
```

This will open `http://localhost:3000` with a live demo of all components.

---

## 🔧 Method 2: Build and Test in Existing Project

### Step 1: Build the Library
```bash
# In the main directory
cd C:\app\DataForgeReactComponents

# Install dependencies and generate tokens
npm install
npm run setup

# Build the library
npm run build
```

### Step 2: Link for Local Testing
```bash
# Create a global link to your local package
npm link

# In your test project directory
cd C:\path\to\your\test-project

# Link the local package
npm link @data-forge-services/react-core
```

### Step 3: Use in Your Project
```jsx
import React, { useState } from 'react';
import {
  RegionSelect,
  CountrySelect,
  StateSelect,
  CitySelect,
  PhoneSelect,
  AddressInput
} from '@data-forge-services/react-core';

function TestComponent() {
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState({
    street1: '', street2: '', city: '', state: '', country: '', postalCode: ''
  });

  return (
    <div>
      <h1>Testing DataForge Components</h1>
      
      <CountrySelect 
        label="Country" 
        value={country} 
        onChange={setCountry} 
        searchable={true}
      />
      
      <StateSelect 
        label="State" 
        value={state} 
        onChange={setState} 
        country={country}
        searchable={true}
      />
      
      <PhoneSelect 
        label="Phone" 
        value={phone} 
        onChange={setPhone} 
        defaultCountryCode="US"
      />
      
      <AddressInput 
        label="Address" 
        value={address} 
        onChange={setAddress}
        locationSelectorsSearchable={true}
      />
    </div>
  );
}

export default TestComponent;
```

---

## 🌐 Method 3: Test with Create React App

### Step 1: Create New React App
```bash
# Create a new React app for testing
npx create-react-app dataforge-test
cd dataforge-test

# Install additional dependencies
npm install axios libphonenumber-js
```

### Step 2: Copy Source Files
```bash
# Copy the src directory from DataForgeReactComponents
# to your test app's src directory as a subfolder
cp -r C:\app\DataForgeReactComponents\src C:\path\to\dataforge-test\src\dataforge-components

# Or on Windows:
xcopy C:\app\DataForgeReactComponents\src C:\path\to\dataforge-test\src\dataforge-components /E /I
```

### Step 3: Import and Test
```jsx
// In your test app's src/App.js
import React, { useState } from 'react';
import {
  RegionSelect,
  CountrySelect,
  StateSelect,
  PhoneSelect
} from './dataforge-components/index.js';

function App() {
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <div style={{ padding: '20px' }}>
      <h1>DataForge Components Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <CountrySelect 
          label="Select Country" 
          value={country} 
          onChange={setCountry} 
          searchable={true}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <StateSelect 
          label="Select State" 
          value={state} 
          onChange={setState} 
          country={country}
          searchable={true}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <PhoneSelect 
          label="Phone Number" 
          value={phone} 
          onChange={setPhone} 
          defaultCountryCode="US"
        />
      </div>
      
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f5f5f5' }}>
        <h3>Current Values:</h3>
        <pre>{JSON.stringify({ country, state, phone }, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;
```

---

## 🔍 Method 4: Testing Individual Components

### Test Single Component
```bash
# Create a minimal test file
# C:\app\DataForgeReactComponents\test-single.js
```

```jsx
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CountrySelect } from './src/location-selector/CountrySelect';

function TestSingleComponent() {
  const [value, setValue] = useState('');

  return (
    <div style={{ padding: '20px' }}>
      <h1>Testing Single Component</h1>
      <CountrySelect 
        label="Country" 
        value={value} 
        onChange={setValue} 
        searchable={true}
      />
      <p>Selected: {value}</p>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<TestSingleComponent />);
```

---

## 🐛 Troubleshooting

### Common Issues:

1. **API Token Missing**
   ```bash
   # Make sure you ran setup
   npm run setup
   
   # Check if config file exists
   ls src/location-selector/services.config.js
   ```

2. **CORS Issues**
   - API calls may fail due to CORS in development
   - Components will show loading states
   - Check browser console for errors

3. **Dependencies Missing**
   ```bash
   # Install required peer dependencies
   npm install react react-dom axios libphonenumber-js
   ```

4. **Build Errors**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### Debug Mode:
```jsx
// Enable debug logging
const [debug, setDebug] = useState(true);

<CountrySelect 
  label="Country" 
  value={country} 
  onChange={setCountry} 
  onLoaded={(data) => debug && console.log('Loaded:', data)}
  searchable={true}
/>
```

---

## 🎯 What to Test:

- ✅ **Basic functionality**: Components render and respond to input
- ✅ **API integration**: Data loads from DataForge API
- ✅ **Search functionality**: Filtering works in dropdowns
- ✅ **Cascading selectors**: Location hierarchy (Region → Country → State → City)
- ✅ **Phone formatting**: International phone number formatting
- ✅ **Timezone calculations**: UTC offset calculations
- ✅ **Error handling**: Components handle API failures gracefully
- ✅ **Performance**: No excessive re-renders or memory leaks

---

## 📱 Testing Checklist:

- [ ] All components render without errors
- [ ] API calls return data successfully
- [ ] Search functionality works
- [ ] Phone number formatting works
- [ ] Timezone calculations are correct
- [ ] Currency flags display properly
- [ ] Address input validates properly
- [ ] Mobile responsiveness works
- [ ] Error states display correctly
- [ ] Loading states show appropriately

---

## 🚀 Ready for Production:

Once local testing is complete:
```bash
# Build for production
npm run build

# Publish to NPM
npm publish
```

Choose the method that best fits your testing needs!
