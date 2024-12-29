export interface FormData {
  name: string;
  birthDate: string;
  birthTime: string;
  location: string;
}

export interface HoroscopeData {
  rashi: string;
  zodiacSign: string;
  moonAngle: string;
  nakshatra: string;
  birthDasha: string;
  birthDate: string;
  prediction: string;
  birthTime: string;
  dayOfWeek: string;
  birthTimeZone: number;
  currentDasha: string;
}

export interface LocationResult {
  display_name: string;
  lat: string;
  lon: string;
}

export interface SelectedLocation {
  city: string;
  fullAddress: string;
  latitude: number;
  longitude: number;
  timezone: string;
}
