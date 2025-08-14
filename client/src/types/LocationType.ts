export type LanguageCode = "en" | "az" | "tr" | "ru";

export interface CountryName {
  en: string;
  az: string;
  tr: string;
  ru: string;
}

export interface Country {
  code: string;
  name: CountryName;
  cities: string[];
}

export interface LocalizedCountry {
  code: string;
  name: string;
  cities: string[];
}
