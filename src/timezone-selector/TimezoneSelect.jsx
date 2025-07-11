import React, { useState, useEffect, useMemo } from 'react';
import timezoneData from './timezoneData';
import '../assets/fallback.css';

const TimezoneSelect = ({
  value,
  onChange,
  label,
  required = false,
  selectClass,
  labelClass,
  emitOffsetFormat = false,
  countryCode = '',
  onCountryCodeChange
}) => {
  const [loading] = useState(false); // Always false as data is static

  /**
   * Calculates the current UTC offset in minutes for a given IANA timezone ID.
   */
  const getOffsetInMinutesForTZ = (tzString) => {
    try {
      const currentInstant = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tzString,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      });
      
      const parts = formatter.formatToParts(currentInstant);
      const getPartValue = (partType) => {
        const part = parts.find(p => p.type === partType);
        return part ? parseInt(part.value, 10) : NaN;
      };

      const localYear = getPartValue('year');
      const localMonth = getPartValue('month') - 1; // Convert to 0-indexed
      const localDay = getPartValue('day');
      const localHour = getPartValue('hour');
      const localMinute = getPartValue('minute');
      const localSecond = getPartValue('second');

      if ([localYear, localMonth, localDay, localHour, localMinute, localSecond].some(isNaN)) {
        console.warn(`Could not parse all date parts for timezone: ${tzString}`);
        return NaN;
      }

      const timeAtLocalAsUTC = Date.UTC(localYear, localMonth, localDay, localHour, localMinute, localSecond);
      const timeAtUTC = currentInstant.getTime();

      return (timeAtLocalAsUTC - timeAtUTC) / (1000 * 60);
    } catch (error) {
      console.error(`Error calculating offset for timezone ${tzString}:`, error);
      return NaN;
    }
  };

  /**
   * Formats an offset in minutes to a "+HH:MM" or "-HH:MM" string.
   */
  const formatOffsetMinutes = (offsetMinutes) => {
    if (isNaN(offsetMinutes)) {
      return "??:??";
    }
    const roundedOffsetMinutes = Math.round(offsetMinutes);
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const absOffset = Math.abs(roundedOffsetMinutes);
    const hours = Math.floor(absOffset / 60);
    const minutes = absOffset % 60;
    return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  // Generate options from timezone data
  const options = useMemo(() => {
    let timezonesToProcess = [];

    // Get all timezones from all countries
    for (const code in timezoneData) {
      if (timezoneData.hasOwnProperty(code)) {
        timezonesToProcess.push(...timezoneData[code]);
      }
    }

    // Remove duplicates based on tzid
    const uniqueTimezones = new Map();
    for (const tz of timezonesToProcess) {
      if (!uniqueTimezones.has(tz.tzid)) {
        uniqueTimezones.set(tz.tzid, tz);
      }
    }
    timezonesToProcess = Array.from(uniqueTimezones.values());

    // Map and format the timezones
    const formattedOptions = timezonesToProcess.map(tz => ({
      id: tz.tzid,
      name: `(UTC${formatOffsetMinutes(getOffsetInMinutesForTZ(tz.tzid))}) ${tz.name} - ${tz.tzid}`
    }));

    // Sort the options
    formattedOptions.sort((a, b) => a.name.localeCompare(b.name));

    return formattedOptions;
  }, []);

  // Handle value changes
  useEffect(() => {
    if (!value) {
      onChange('');
      return;
    }
    
    if (emitOffsetFormat) {
      const offsetString = formatOffsetMinutes(getOffsetInMinutesForTZ(value));
      onChange(offsetString);
    } else {
      onChange(value);
    }
  }, [value, emitOffsetFormat, onChange]);

  // Handle country code changes
  useEffect(() => {
    if (countryCode && countryCode !== '') {
      const timezonesForCountry = timezoneData[countryCode.toUpperCase()];
      if (timezonesForCountry && timezonesForCountry.length > 0) {
        const firstTimezoneId = timezonesForCountry[0].tzid;
        if (emitOffsetFormat) {
          const offsetString = formatOffsetMinutes(getOffsetInMinutesForTZ(firstTimezoneId));
          onChange(offsetString);
        } else {
          onChange(firstTimezoneId);
        }
      } else {
        onChange('');
      }
    } else if (countryCode === '') {
      onChange('');
    }
  }, [countryCode, emitOffsetFormat, onChange]);

  return (
    <div>
      {label && (
        <label className={labelClass || 'fallback-label'}>
          {label}
          {required && <span className="required" style={{ color: 'red' }}>*</span>}
        </label>
      )}

      <div className="base-select-container">
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={loading || options.length === 0}
          className={selectClass || 'fallback-select'}
          style={{
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            minWidth: '150px',
            background: 'white',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <option value="">-- Select Timezone --</option>
          {options.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TimezoneSelect;
