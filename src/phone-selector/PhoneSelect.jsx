import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  parsePhoneNumberFromString,
  getCountries,
  getCountryCallingCode,
  AsYouType
} from 'libphonenumber-js/max';

// Function to get flag URL
const getFlagUrl = (countryCode, size = 24) => {
  if (!countryCode || typeof countryCode !== 'string' || countryCode.length !== 2) {
    return null;
  }
  return `https://cdn.jsdelivr.net/npm/flag-icons@6.6.6/flags/1x1/${countryCode.toLowerCase()}.svg`;
};

// Generate country options
const countryOptions = getCountries().map(countryCode => {
  let displayName;
  try {
    displayName = new Intl.DisplayNames(['en'], { type: 'region' }).of(countryCode);
  } catch (e) {
    console.warn(`PhoneSelect: Error getting display name for country code ${countryCode}: ${e.message}`);
  }
  return {
    code: countryCode,
    name: displayName || countryCode,
    dial_code: `+${getCountryCallingCode(countryCode)}`,
    flagUrl: getFlagUrl(countryCode, 20)
  };
}).sort((a, b) => (a.name || '').localeCompare(b.name || ''));

const preferredCountriesForDialCode = {
  "+1": "US",
  // Add other preferences if needed
};

const PhoneSelect = ({
  value,
  onChange,
  label,
  required = false,
  labelClass = 'label',
  defaultCountryCode = ''
}) => {
  const [internalDialCode, setInternalDialCode] = useState('');
  const [internalCountryCode, setInternalCountryCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [searchQueryInDropdown, setSearchQueryInDropdown] = useState('');
  
  const phoneInputContainerRef = useRef(null);
  const asYouType = useMemo(() => new AsYouType(), []);

  const selectedCountryDisplay = useMemo(() => {
    let countryToDisplay = null;

    if (internalCountryCode) {
      countryToDisplay = countryOptions.find(c => c.code === internalCountryCode);
      if (countryToDisplay && internalDialCode && countryToDisplay.dial_code !== internalDialCode) {
        countryToDisplay = null;
      }
    }

    if (!countryToDisplay && internalDialCode) {
      const preferredIsoCode = preferredCountriesForDialCode[internalDialCode];
      if (preferredIsoCode) {
        countryToDisplay = countryOptions.find(c => c.code === preferredIsoCode && c.dial_code === internalDialCode);
      }
      if (!countryToDisplay) {
        countryToDisplay = countryOptions.find(c => c.dial_code === internalDialCode);
      }
    }

    return countryToDisplay
      ? { text: countryToDisplay.dial_code, flagUrl: countryToDisplay.flagUrl, code: countryToDisplay.code }
      : { text: internalDialCode || 'Code', flagUrl: internalCountryCode ? getFlagUrl(internalCountryCode) : null, code: internalCountryCode };
  }, [internalCountryCode, internalDialCode]);

  const filteredCountryOptions = useMemo(() => {
    if (!searchQueryInDropdown) {
      return countryOptions;
    }
    const lowerSearch = searchQueryInDropdown.toLowerCase();
    return countryOptions.filter(country =>
      (country.name || '').toLowerCase().includes(lowerSearch) ||
      (country.dial_code || '').toLowerCase().includes(lowerSearch)
    );
  }, [searchQueryInDropdown]);

  const parseInitialModelValue = (value) => {
    if (!value) {
      setInternalDialCode('');
      setInternalCountryCode('');
      setPhoneNumber('');
      if (defaultCountryCode) {
        const countryByProp = countryOptions.find(c => c.code.toUpperCase() === defaultCountryCode.toUpperCase());
        if (countryByProp) {
          setInternalDialCode(countryByProp.dial_code);
          setInternalCountryCode(countryByProp.code);
        }
      }
      return;
    }

    setInternalDialCode('');
    setInternalCountryCode('');
    setPhoneNumber('');

    const parsed = parsePhoneNumberFromString(value);
    if (parsed && parsed.isValid()) {
      setInternalDialCode(`+${parsed.countryCallingCode}`);
      setPhoneNumber(parsed.nationalNumber);
      setInternalCountryCode(parsed.country);
    } else {
      let successfullyParsedPartial = false;
      const formatter = new AsYouType();
      formatter.input(value);
      const hintedCountry = formatter.getCountry();

      if (hintedCountry) {
        const countryObj = countryOptions.find(c => c.code === hintedCountry);
        if (countryObj) {
          setInternalDialCode(countryObj.dial_code);
          setInternalCountryCode(countryObj.code);
          
          let nationalInput = value;
          if (value.startsWith(countryObj.dial_code)) {
            nationalInput = value.substring(countryObj.dial_code.length);
          }
          const nationalFormatter = new AsYouType(hintedCountry);
          setPhoneNumber(nationalFormatter.input(nationalInput.replace(/\D/g, '')));
          successfullyParsedPartial = true;
        }
      }

      if (!successfullyParsedPartial) {
        if (preferredCountriesForDialCode[value]) {
          setInternalDialCode(value);
          setInternalCountryCode(preferredCountriesForDialCode[value]);
          setPhoneNumber('');
        } else {
          setPhoneNumber(value);
          if (defaultCountryCode && !internalDialCode) {
            const countryByProp = countryOptions.find(c => c.code.toUpperCase() === defaultCountryCode.toUpperCase());
            if (countryByProp) {
              setInternalDialCode(countryByProp.dial_code);
              setInternalCountryCode(countryByProp.code);
            }
          }
        }
      }
    }
    
    asYouType.reset();
    setPhoneNumber(prev => asYouType.input(prev.replace(/\D/g, '')));
  };

  const validateAndEmit = () => {
    setErrorMessage('');
    if (!internalDialCode && phoneNumber) {
      setErrorMessage('Please select a country code.');
      onChange(phoneNumber);
      return;
    }
    if (!phoneNumber && internalDialCode) {
      onChange(internalDialCode);
      return;
    }
    if (!internalDialCode && !phoneNumber) {
      onChange('');
      return;
    }

    const fullNumber = `${internalDialCode}${phoneNumber.replace(/\D/g, '')}`;
    const parsed = parsePhoneNumberFromString(fullNumber);

    if (parsed && parsed.isValid()) {
      onChange(parsed.formatInternational());
    } else if (phoneNumber) {
      setErrorMessage('Invalid phone number for the selected country.');
      onChange(fullNumber);
    }
  };

  const handlePhoneInput = (event) => {
    asYouType.reset();
    setPhoneNumber(asYouType.input(event.target.value));
    validateAndEmit();
  };

  const toggleCountryDropdown = () => {
    setShowCountryDropdown(!showCountryDropdown);
  };

  const selectCountry = (country) => {
    setInternalDialCode(country.dial_code);
    setInternalCountryCode(country.code);
    setShowCountryDropdown(false);
    setSearchQueryInDropdown('');
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (phoneInputContainerRef.current && !phoneInputContainerRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Watch for dial code changes
  useEffect(() => {
    let newInternalCountryCodeToSet = '';
    const currentCountryObjectForFlag = countryOptions.find(c => c.code === internalCountryCode);

    if (currentCountryObjectForFlag && currentCountryObjectForFlag.dial_code === internalDialCode) {
      newInternalCountryCodeToSet = internalCountryCode;
    } else {
      const preferredCountryCode = preferredCountriesForDialCode[internalDialCode];
      if (preferredCountryCode) {
        const preferredCountryObj = countryOptions.find(c => c.code === preferredCountryCode && c.dial_code === internalDialCode);
        if (preferredCountryObj) {
          newInternalCountryCodeToSet = preferredCountryObj.code;
        }
      }

      if (!newInternalCountryCodeToSet) {
        const firstMatch = countryOptions.find(c => c.dial_code === internalDialCode);
        newInternalCountryCodeToSet = firstMatch ? firstMatch.code : '';
      }
    }
    setInternalCountryCode(newInternalCountryCodeToSet);

    asYouType.reset();
    setPhoneNumber(prev => asYouType.input(prev.replace(/\D/g, '')));
    validateAndEmit();
  }, [internalDialCode]);

  // Watch for default country code changes
  useEffect(() => {
    if (!defaultCountryCode) {
      return;
    }
    const countryFromNewDefault = countryOptions.find(c => c.code.toUpperCase() === defaultCountryCode.toUpperCase());
    if (!countryFromNewDefault) return;

    const newDialCodeFromDefault = countryFromNewDefault.dial_code;

    if (internalDialCode === newDialCodeFromDefault && internalCountryCode === countryFromNewDefault.code) {
      return;
    }

    const parsedModel = value ? parsePhoneNumberFromString(value) : null;

    if (parsedModel && parsedModel.country) {
      if (parsedModel.country !== countryFromNewDefault.code) {
        return;
      }
    }

    setInternalDialCode(newDialCodeFromDefault);
    setInternalCountryCode(countryFromNewDefault.code);
    asYouType.reset();
    setPhoneNumber(prev => asYouType.input(prev.replace(/\D/g, '')));
    validateAndEmit();
  }, [defaultCountryCode, internalDialCode, internalCountryCode, value]);

  // Initialize with model value
  useEffect(() => {
    parseInitialModelValue(value);
  }, []);

  // Watch for external value changes
  useEffect(() => {
    const currentFullNumber = internalDialCode + phoneNumber.replace(/\D/g, '');
    const parsedCurrentFullNumber = parsePhoneNumberFromString(currentFullNumber);
    const currentEmittedValue = parsedCurrentFullNumber?.isValid() ? parsedCurrentFullNumber.formatInternational() : currentFullNumber;

    if (value !== currentEmittedValue && value !== currentFullNumber) {
      parseInitialModelValue(value);
    }
  }, [value]);

  return (
    <div className="form-group" style={{ marginBottom: '1rem' }}>
      {label && (
        <label className={labelClass} style={{ display: 'block', fontWeight: 600, marginBottom: '4px', fontSize: '14px', color: '#333' }}>
          {label} {required && <span className="required" style={{ color: 'red' }}>*</span>}
        </label>
      )}

      <div 
        className="phone-input-container" 
        ref={phoneInputContainerRef}
        style={{
          display: 'flex',
          gap: 0,
          alignItems: 'center',
          border: '1px solid #ccc',
          position: 'relative',
          borderRadius: '4px'
        }}
      >
        {/* Country Select Trigger */}
        <div
          className={`custom-country-select-trigger ${showCountryDropdown ? 'active' : ''}`}
          onClick={toggleCountryDropdown}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 10px',
            border: 'none',
            borderRight: '1px solid #ccc',
            background: '#f8f9fa',
            cursor: 'pointer',
            userSelect: 'none',
            minHeight: '38px',
            boxSizing: 'border-box'
          }}
        >
          {selectedCountryDisplay.flagUrl && (
            <img 
              src={selectedCountryDisplay.flagUrl} 
              alt={selectedCountryDisplay.code} 
              style={{ width: '20px', height: '15px', verticalAlign: 'middle', marginRight: '5px', border: '1px solid #eee' }}
            />
          )}
          <span style={{ flexGrow: 1, fontSize: '14px', marginLeft: '4px' }}>
            {selectedCountryDisplay.text}
          </span>
          <span style={{ fontSize: '10px', marginLeft: 'auto', paddingLeft: '5px', color: '#555' }}>
            {showCountryDropdown ? '▲' : '▼'}
          </span>
        </div>

        {/* Phone Number Input */}
        <input
          value={phoneNumber}
          onChange={handlePhoneInput}
          required={required}
          disabled={!internalDialCode}
          type="tel"
          placeholder="Phone number"
          style={{
            flex: 1,
            padding: '8px',
            border: 'none',
            borderRadius: 0,
            outline: 'none',
            backgroundColor: !internalDialCode ? '#f0f0f0' : 'white',
            cursor: !internalDialCode ? 'not-allowed' : 'text'
          }}
        />

        {/* Custom Dropdown */}
        {showCountryDropdown && (
          <div 
            className="custom-country-dropdown"
            style={{
              position: 'absolute',
              top: 'calc(100% + 1px)',
              left: '-1px',
              right: '-1px',
              background: 'white',
              border: '1px solid #ccc',
              borderRadius: '0 0 4px 4px',
              maxHeight: '250px',
              zIndex: 1000,
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <input
              type="text"
              value={searchQueryInDropdown}
              onChange={(e) => setSearchQueryInDropdown(e.target.value)}
              placeholder="Search country..."
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                padding: '10px',
                border: 'none',
                borderBottom: '1px solid #eee',
                boxSizing: 'border-box',
                fontSize: '14px',
                outline: 'none',
                flexShrink: 0
              }}
            />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, overflowY: 'auto', flexGrow: 1 }}>
              {filteredCountryOptions.map((country) => (
                <li
                  key={country.code}
                  onClick={() => selectCountry(country)}
                  className={country.code === internalCountryCode ? 'selected-option' : ''}
                  style={{
                    padding: '10px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '14px',
                    backgroundColor: country.code === internalCountryCode ? '#e0e0e0' : 'transparent',
                    fontWeight: country.code === internalCountryCode ? 'bold' : 'normal'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = country.code === internalCountryCode ? '#e0e0e0' : 'transparent'}
                >
                  <img 
                    src={country.flagUrl} 
                    alt={country.code} 
                    style={{ width: '20px', height: '15px', verticalAlign: 'middle', marginRight: '8px', border: '1px solid #eee' }}
                  />
                  <span style={{ flexGrow: 1, marginRight: '8px' }}>
                    {country.name}
                  </span>
                  <span style={{ color: '#555', fontSize: '0.9em' }}>
                    ({country.dial_code})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {errorMessage && (
        <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default PhoneSelect;
