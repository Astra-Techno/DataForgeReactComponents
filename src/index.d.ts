declare module '@data-forge-services/react-core' {
  import { FC } from 'react'

  export interface BaseSelectProps {
    value?: string | number
    onChange?: (value: string | number) => void
    label?: string
    required?: boolean
    triggerClass?: string
    labelClass?: string
    disabled?: boolean
    searchable?: boolean
    placeholder?: string
  }

  export interface LocationSelectProps extends BaseSelectProps {
    defaultValue?: string | number
  }

  export interface CountrySelectProps extends LocationSelectProps {
    region?: string
    subregion?: string
    onSelected?: (country: any) => void
  }

  export interface StateSelectProps extends LocationSelectProps {
    country?: string
  }

  export interface CitySelectProps extends LocationSelectProps {
    state?: string
  }

  export interface PhoneSelectProps {
    value?: string
    onChange?: (value: string) => void
    label?: string
    required?: boolean
    labelClass?: string
    defaultCountryCode?: string
  }

  export interface TimezoneSelectProps {
    value?: string
    onChange?: (value: string) => void
    label?: string
    required?: boolean
    selectClass?: string
    labelClass?: string
    emitOffsetFormat?: boolean
    countryCode?: string
  }

  export interface LanguageSelectProps extends BaseSelectProps {
    defaultCountry?: string
    defaultValue?: string | number
  }

  export interface CurrencySelectProps extends BaseSelectProps {
    countryCode?: string
    region?: string
    subregion?: string
  }

  export interface AddressInputProps {
    value?: {
      street1: string
      street2: string
      city: string
      state: string
      country: string
      postalCode: string
    }
    onChange?: (address: any) => void
    label?: string
    labelClass?: string
    fieldLabelClass?: string
    inputClass?: string
    requiredFields?: {
      street1?: boolean
      city?: boolean
      state?: boolean
      country?: boolean
      postalCode?: boolean
    }
    locationSelectorsSearchable?: boolean
  }

  export const RegionSelect: FC<LocationSelectProps>
  export const SubregionSelect: FC<LocationSelectProps & { region?: string }>
  export const CountrySelect: FC<CountrySelectProps>
  export const StateSelect: FC<StateSelectProps>
  export const CitySelect: FC<CitySelectProps>
  export const PhoneSelect: FC<PhoneSelectProps>
  export const TimezoneSelect: FC<TimezoneSelectProps>
  export const LanguageSelect: FC<LanguageSelectProps>
  export const CurrencySelect: FC<CurrencySelectProps>
  export const AddressInput: FC<AddressInputProps>
}
