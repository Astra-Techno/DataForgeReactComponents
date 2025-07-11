import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import axios from '../axios';
import Spinner from '../components/Spinner';
import '../assets/fallback.css';

const BaseSelect = ({
  // Common UI props
  value,
  onChange,
  label,
  required = false,
  triggerClass,
  dropdownClass,
  labelClass,
  disabled = false,
  searchable = false,
  placeholder = '-- Select an option --',
  
  // Configuration for data loading
  options = null,
  apiEndpoint,
  apiQueryParamName,
  apiQueryParamValue,
  loadOnMount = true,
  apiQueryString,
  
  // Events
  onLoaded
}) => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [internalOptions, setInternalOptions] = useState([]);
  
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);
  const loadingRef = useRef(false);

  // Selected option
  const selectedOption = useMemo(() => {
    const optionsSource = options || internalOptions;
    return optionsSource.find(option => option.id === value) || null;
  }, [value, options, internalOptions]);

  // Selected option trigger label (can be HTML)
  const selectedOptionTriggerLabel = useMemo(() => {
    return selectedOption ? selectedOption.name : '';
  }, [selectedOption]);

  // Filtered options for search
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery) {
      return options || internalOptions;
    }
    const optionsSource = options || internalOptions;
    const lowerSearchQuery = searchQuery.toLowerCase();
    return optionsSource.filter(option =>
      option.name.toLowerCase().includes(lowerSearchQuery)
    );
  }, [searchable, searchQuery, options, internalOptions]);

  // Removed loadOptions function to eliminate dependency issues

  // Track if we've loaded to prevent multiple loads
  const hasLoadedRef = useRef(false);
  const currentParamsRef = useRef('');
  
  // Simple effect that only loads once per parameter combination
  useEffect(() => {
    // Skip if options are provided externally
    if (options) return;
    
    // Create a unique key for current parameters
    const paramKey = `${loadOnMount ? 'load' : 'noload'}-${apiQueryParamName || 'none'}-${apiQueryParamValue || 'empty'}`;
    
    // Skip if we've already loaded this exact combination
    if (currentParamsRef.current === paramKey) return;
    
    // Skip if currently loading
    if (loadingRef.current) return;
    
    // Determine if we should load
    const shouldLoad = loadOnMount || (apiQueryParamName && apiQueryParamValue);
    if (!shouldLoad) {
      setInternalOptions([]);
      currentParamsRef.current = paramKey;
      return;
    }

    // Update tracking
    currentParamsRef.current = paramKey;
    hasLoadedRef.current = true;

    // Start loading
    loadingRef.current = true;
    setLoading(true);
    setInternalOptions([]);

    // Build endpoint
    let fullEndpoint = apiEndpoint;
    if (apiQueryString) {
      fullEndpoint += `?${apiQueryString}`;
    } else if (apiQueryParamName && apiQueryParamValue) {
      fullEndpoint += `?${apiQueryParamName}=${apiQueryParamValue}`;
    }

    // Make API call
    axios.get(fullEndpoint)
      .then(res => {
        if (loadingRef.current) {
          setInternalOptions(res.data);
          console.log(`Loaded ${res.data.length} options`);
          // Call onLoaded but only once per load to avoid infinite loops
          if (onLoaded) {
            onLoaded(res.data);
          }
        }
      })
      .catch(e => {
        if (loadingRef.current) {
          console.error(`Failed to load options:`, e);
          setInternalOptions([]);
          // Call onLoaded with empty array on error
          if (onLoaded) {
            onLoaded([]);
          }
        }
      })
      .finally(() => {
        setLoading(false);
        loadingRef.current = false;
      });
  }, [
    options ? 'has' : 'none',
    loadOnMount ? 'load' : 'noload', 
    apiQueryParamValue || '',
    apiQueryParamName || ''
  ]);

  // Toggle dropdown
  const toggleDropdown = useCallback(async () => {
    if (disabled || loading) return;
    const newShowDropdown = !showDropdown;
    setShowDropdown(newShowDropdown);
    if (newShowDropdown && searchable) {
      // Focus search input after render
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  }, [disabled, loading, showDropdown, searchable]);

  // Select item
  const selectItem = useCallback((item) => {
    onChange(item.id);
    setShowDropdown(false);
    setSearchQuery('');
  }, [onChange]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div>
      {label && (
        <label className={labelClass || 'fallback-label'}>
          {label}
          {required && <span className="fallback-required">*</span>}
        </label>
      )}

      <div className="base-select-container" ref={containerRef} style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
        {/* Custom Trigger */}
        <div
          className={`base-select-trigger ${triggerClass || 'fallback-select-trigger'} ${(disabled || loading) ? 'disabled' : ''} ${showDropdown ? 'active' : ''}`}
          onClick={toggleDropdown}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#fff',
            cursor: disabled || loading ? 'not-allowed' : 'pointer',
            userSelect: 'none',
            minHeight: '38px',
            boxSizing: 'border-box'
          }}
        >
          <span 
            style={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            dangerouslySetInnerHTML={{ __html: selectedOptionTriggerLabel || placeholder }}
          />
          {loading && <Spinner style={{ width: '16px', height: '16px', marginLeft: '8px', marginRight: '8px' }} />}
          <span style={{ fontSize: '10px', marginLeft: 'auto', transition: 'transform 0.2s ease', transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            {showDropdown ? '▲' : '▼'}
          </span>
        </div>

        {/* Custom Dropdown List */}
        {showDropdown && (
          <div 
            className={`base-select-dropdown ${dropdownClass || 'fallback-select-dropdown'}`}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderTop: 'none',
              borderRadius: '0 0 4px 4px',
              maxHeight: '200px',
              overflow: 'hidden',
              zIndex: 10,
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box'
            }}
          >
            {searchable && (
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: 'none',
                  borderBottom: '1px solid #eee',
                  boxSizing: 'border-box',
                  fontSize: '14px',
                  outline: 'none',
                  flexShrink: 0
                }}
              />
            )}
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, overflowY: 'auto', flexGrow: 1 }}>
              {filteredOptions.map((item) => (
                <li
                  key={item.id}
                  onClick={() => selectItem(item)}
                  className={item.id === value ? 'selected-option' : ''}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    backgroundColor: item.id === value ? '#e0e0e0' : 'transparent',
                    fontWeight: item.id === value ? 'bold' : 'normal'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = item.id === value ? '#e0e0e0' : 'transparent'}
                >
                  <span dangerouslySetInnerHTML={{ __html: item.name }} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseSelect;
