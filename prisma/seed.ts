/**
 * prisma/seed.ts
 *
 * Seed script — populates the database with:
 *  - 50 countries (most-traveled)
 *  - Sample visa requirements (US, FR, DE, JP, AU as destinations)
 *  - Sample travel advisories
 *
 * Run:  npx ts-node prisma/seed.ts
 * Or:   npm run db:seed
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ─── Countries ────────────────────────────────────────────────────────────────
const COUNTRIES = [
  { code: 'US', name: 'United States',    commonName: 'USA',          region: 'Americas', subregion: 'Northern America', flag: '🇺🇸', capital: 'Washington D.C.', population: 331000000, languages: ['English'],           currency: 'USD', timezone: 'America/New_York' },
  { code: 'FR', name: 'France',           commonName: null,           region: 'Europe',   subregion: 'Western Europe',   flag: '🇫🇷', capital: 'Paris',           population: 67000000,  languages: ['French'],           currency: 'EUR', timezone: 'Europe/Paris' },
  { code: 'DE', name: 'Germany',          commonName: 'Deutschland',  region: 'Europe',   subregion: 'Western Europe',   flag: '🇩🇪', capital: 'Berlin',          population: 83000000,  languages: ['German'],           currency: 'EUR', timezone: 'Europe/Berlin' },
  { code: 'JP', name: 'Japan',            commonName: '日本',          region: 'Asia',     subregion: 'Eastern Asia',     flag: '🇯🇵', capital: 'Tokyo',           population: 125000000, languages: ['Japanese'],         currency: 'JPY', timezone: 'Asia/Tokyo' },
  { code: 'AU', name: 'Australia',        commonName: null,           region: 'Oceania',  subregion: 'Australia',        flag: '🇦🇺', capital: 'Canberra',        population: 26000000,  languages: ['English'],          currency: 'AUD', timezone: 'Australia/Sydney' },
  { code: 'CA', name: 'Canada',           commonName: null,           region: 'Americas', subregion: 'Northern America', flag: '🇨🇦', capital: 'Ottawa',          population: 38000000,  languages: ['English', 'French'],currency: 'CAD', timezone: 'America/Toronto' },
  { code: 'GB', name: 'United Kingdom',   commonName: 'UK',           region: 'Europe',   subregion: 'Northern Europe',  flag: '🇬🇧', capital: 'London',          population: 68000000,  languages: ['English'],          currency: 'GBP', timezone: 'Europe/London' },
  { code: 'IT', name: 'Italy',            commonName: 'Italia',       region: 'Europe',   subregion: 'Southern Europe',  flag: '🇮🇹', capital: 'Rome',            population: 60000000,  languages: ['Italian'],          currency: 'EUR', timezone: 'Europe/Rome' },
  { code: 'ES', name: 'Spain',            commonName: 'España',       region: 'Europe',   subregion: 'Southern Europe',  flag: '🇪🇸', capital: 'Madrid',          population: 47000000,  languages: ['Spanish'],          currency: 'EUR', timezone: 'Europe/Madrid' },
  { code: 'PT', name: 'Portugal',         commonName: null,           region: 'Europe',   subregion: 'Southern Europe',  flag: '🇵🇹', capital: 'Lisbon',          population: 10000000,  languages: ['Portuguese'],       currency: 'EUR', timezone: 'Europe/Lisbon' },
  { code: 'NL', name: 'Netherlands',      commonName: 'Holland',      region: 'Europe',   subregion: 'Western Europe',   flag: '🇳🇱', capital: 'Amsterdam',       population: 17000000,  languages: ['Dutch'],            currency: 'EUR', timezone: 'Europe/Amsterdam' },
  { code: 'BE', name: 'Belgium',          commonName: null,           region: 'Europe',   subregion: 'Western Europe',   flag: '🇧🇪', capital: 'Brussels',        population: 11000000,  languages: ['Dutch', 'French'],  currency: 'EUR', timezone: 'Europe/Brussels' },
  { code: 'CH', name: 'Switzerland',      commonName: null,           region: 'Europe',   subregion: 'Western Europe',   flag: '🇨🇭', capital: 'Bern',            population: 8600000,   languages: ['German', 'French'], currency: 'CHF', timezone: 'Europe/Zurich' },
  { code: 'AT', name: 'Austria',          commonName: 'Österreich',   region: 'Europe',   subregion: 'Western Europe',   flag: '🇦🇹', capital: 'Vienna',          population: 9000000,   languages: ['German'],           currency: 'EUR', timezone: 'Europe/Vienna' },
  { code: 'SE', name: 'Sweden',           commonName: 'Sverige',      region: 'Europe',   subregion: 'Northern Europe',  flag: '🇸🇪', capital: 'Stockholm',       population: 10400000,  languages: ['Swedish'],          currency: 'SEK', timezone: 'Europe/Stockholm' },
  { code: 'NO', name: 'Norway',           commonName: 'Norge',        region: 'Europe',   subregion: 'Northern Europe',  flag: '🇳🇴', capital: 'Oslo',            population: 5400000,   languages: ['Norwegian'],        currency: 'NOK', timezone: 'Europe/Oslo' },
  { code: 'DK', name: 'Denmark',          commonName: 'Danmark',      region: 'Europe',   subregion: 'Northern Europe',  flag: '🇩🇰', capital: 'Copenhagen',      population: 5900000,   languages: ['Danish'],           currency: 'DKK', timezone: 'Europe/Copenhagen' },
  { code: 'FI', name: 'Finland',          commonName: 'Suomi',        region: 'Europe',   subregion: 'Northern Europe',  flag: '🇫🇮', capital: 'Helsinki',        population: 5500000,   languages: ['Finnish'],          currency: 'EUR', timezone: 'Europe/Helsinki' },
  { code: 'GR', name: 'Greece',           commonName: 'Hellas',       region: 'Europe',   subregion: 'Southern Europe',  flag: '🇬🇷', capital: 'Athens',          population: 10700000,  languages: ['Greek'],            currency: 'EUR', timezone: 'Europe/Athens' },
  { code: 'PL', name: 'Poland',           commonName: 'Polska',       region: 'Europe',   subregion: 'Eastern Europe',   flag: '🇵🇱', capital: 'Warsaw',          population: 37900000,  languages: ['Polish'],           currency: 'PLN', timezone: 'Europe/Warsaw' },
  { code: 'CZ', name: 'Czech Republic',   commonName: 'Czechia',      region: 'Europe',   subregion: 'Eastern Europe',   flag: '🇨🇿', capital: 'Prague',          population: 10900000,  languages: ['Czech'],            currency: 'CZK', timezone: 'Europe/Prague' },
  { code: 'HU', name: 'Hungary',          commonName: 'Magyarország', region: 'Europe',   subregion: 'Eastern Europe',   flag: '🇭🇺', capital: 'Budapest',        population: 9700000,   languages: ['Hungarian'],        currency: 'HUF', timezone: 'Europe/Budapest' },
  { code: 'RO', name: 'Romania',          commonName: null,           region: 'Europe',   subregion: 'Eastern Europe',   flag: '🇷🇴', capital: 'Bucharest',       population: 19000000,  languages: ['Romanian'],         currency: 'RON', timezone: 'Europe/Bucharest' },
  { code: 'CN', name: 'China',            commonName: '中国',          region: 'Asia',     subregion: 'Eastern Asia',     flag: '🇨🇳', capital: 'Beijing',         population: 1400000000,languages: ['Chinese'],          currency: 'CNY', timezone: 'Asia/Shanghai' },
  { code: 'KR', name: 'South Korea',      commonName: '한국',          region: 'Asia',     subregion: 'Eastern Asia',     flag: '🇰🇷', capital: 'Seoul',           population: 51000000,  languages: ['Korean'],           currency: 'KRW', timezone: 'Asia/Seoul' },
  { code: 'IN', name: 'India',            commonName: 'Bharat',       region: 'Asia',     subregion: 'Southern Asia',    flag: '🇮🇳', capital: 'New Delhi',       population: 1380000000,languages: ['Hindi', 'English'], currency: 'INR', timezone: 'Asia/Kolkata' },
  { code: 'TH', name: 'Thailand',         commonName: 'ประเทศไทย',    region: 'Asia',     subregion: 'South-Eastern Asia',flag: '🇹🇭',capital: 'Bangkok',          population: 70000000,  languages: ['Thai'],             currency: 'THB', timezone: 'Asia/Bangkok' },
  { code: 'SG', name: 'Singapore',        commonName: null,           region: 'Asia',     subregion: 'South-Eastern Asia',flag: '🇸🇬',capital: 'Singapore',        population: 5800000,   languages: ['English', 'Malay'], currency: 'SGD', timezone: 'Asia/Singapore' },
  { code: 'MY', name: 'Malaysia',         commonName: null,           region: 'Asia',     subregion: 'South-Eastern Asia',flag: '🇲🇾',capital: 'Kuala Lumpur',     population: 33000000,  languages: ['Malay'],            currency: 'MYR', timezone: 'Asia/Kuala_Lumpur' },
  { code: 'ID', name: 'Indonesia',        commonName: null,           region: 'Asia',     subregion: 'South-Eastern Asia',flag: '🇮🇩',capital: 'Jakarta',          population: 274000000, languages: ['Indonesian'],       currency: 'IDR', timezone: 'Asia/Jakarta' },
  { code: 'PH', name: 'Philippines',      commonName: 'Pilipinas',    region: 'Asia',     subregion: 'South-Eastern Asia',flag: '🇵🇭',capital: 'Manila',           population: 111000000, languages: ['Filipino', 'English'],currency: 'PHP',timezone: 'Asia/Manila' },
  { code: 'VN', name: 'Vietnam',          commonName: 'Việt Nam',     region: 'Asia',     subregion: 'South-Eastern Asia',flag: '🇻🇳',capital: 'Hanoi',            population: 97000000,  languages: ['Vietnamese'],       currency: 'VND', timezone: 'Asia/Ho_Chi_Minh' },
  { code: 'AE', name: 'United Arab Emirates', commonName: 'UAE',      region: 'Asia',     subregion: 'Western Asia',     flag: '🇦🇪', capital: 'Abu Dhabi',       population: 9900000,   languages: ['Arabic'],           currency: 'AED', timezone: 'Asia/Dubai' },
  { code: 'TR', name: 'Turkey',           commonName: 'Türkiye',      region: 'Asia',     subregion: 'Western Asia',     flag: '🇹🇷', capital: 'Ankara',          population: 84000000,  languages: ['Turkish'],          currency: 'TRY', timezone: 'Europe/Istanbul' },
  { code: 'SA', name: 'Saudi Arabia',     commonName: null,           region: 'Asia',     subregion: 'Western Asia',     flag: '🇸🇦', capital: 'Riyadh',          population: 35000000,  languages: ['Arabic'],           currency: 'SAR', timezone: 'Asia/Riyadh' },
  { code: 'IL', name: 'Israel',           commonName: 'ישראל',        region: 'Asia',     subregion: 'Western Asia',     flag: '🇮🇱', capital: 'Jerusalem',       population: 9300000,   languages: ['Hebrew'],           currency: 'ILS', timezone: 'Asia/Jerusalem' },
  { code: 'BR', name: 'Brazil',           commonName: 'Brasil',       region: 'Americas', subregion: 'South America',    flag: '🇧🇷', capital: 'Brasília',        population: 214000000, languages: ['Portuguese'],       currency: 'BRL', timezone: 'America/Sao_Paulo' },
  { code: 'MX', name: 'Mexico',           commonName: 'México',       region: 'Americas', subregion: 'Central America',  flag: '🇲🇽', capital: 'Mexico City',     population: 129000000, languages: ['Spanish'],          currency: 'MXN', timezone: 'America/Mexico_City' },
  { code: 'AR', name: 'Argentina',        commonName: null,           region: 'Americas', subregion: 'South America',    flag: '🇦🇷', capital: 'Buenos Aires',    population: 45000000,  languages: ['Spanish'],          currency: 'ARS', timezone: 'America/Argentina/Buenos_Aires' },
  { code: 'CL', name: 'Chile',            commonName: null,           region: 'Americas', subregion: 'South America',    flag: '🇨🇱', capital: 'Santiago',        population: 19000000,  languages: ['Spanish'],          currency: 'CLP', timezone: 'America/Santiago' },
  { code: 'CO', name: 'Colombia',         commonName: null,           region: 'Americas', subregion: 'South America',    flag: '🇨🇴', capital: 'Bogotá',          population: 51000000,  languages: ['Spanish'],          currency: 'COP', timezone: 'America/Bogota' },
  { code: 'PE', name: 'Peru',             commonName: 'Perú',         region: 'Americas', subregion: 'South America',    flag: '🇵🇪', capital: 'Lima',            population: 33000000,  languages: ['Spanish'],          currency: 'PEN', timezone: 'America/Lima' },
  { code: 'ZA', name: 'South Africa',     commonName: null,           region: 'Africa',   subregion: 'Southern Africa',  flag: '🇿🇦', capital: 'Pretoria',        population: 60000000,  languages: ['Zulu', 'Xhosa'],    currency: 'ZAR', timezone: 'Africa/Johannesburg' },
  { code: 'NG', name: 'Nigeria',          commonName: null,           region: 'Africa',   subregion: 'Western Africa',   flag: '🇳🇬', capital: 'Abuja',           population: 211000000, languages: ['English'],          currency: 'NGN', timezone: 'Africa/Lagos' },
  { code: 'EG', name: 'Egypt',            commonName: 'مصر',          region: 'Africa',   subregion: 'Northern Africa',  flag: '🇪🇬', capital: 'Cairo',           population: 102000000, languages: ['Arabic'],           currency: 'EGP', timezone: 'Africa/Cairo' },
  { code: 'MA', name: 'Morocco',          commonName: 'المغرب',       region: 'Africa',   subregion: 'Northern Africa',  flag: '🇲🇦', capital: 'Rabat',           population: 37000000,  languages: ['Arabic'],           currency: 'MAD', timezone: 'Africa/Casablanca' },
  { code: 'KE', name: 'Kenya',            commonName: null,           region: 'Africa',   subregion: 'Eastern Africa',   flag: '🇰🇪', capital: 'Nairobi',         population: 54000000,  languages: ['Swahili', 'English'],currency: 'KES',timezone: 'Africa/Nairobi' },
  { code: 'NZ', name: 'New Zealand',      commonName: 'Aotearoa',     region: 'Oceania',  subregion: 'Polynesia',        flag: '🇳🇿', capital: 'Wellington',      population: 5100000,   languages: ['English', 'Maori'], currency: 'NZD', timezone: 'Pacific/Auckland' },
  { code: 'RU', name: 'Russia',           commonName: 'Россия',       region: 'Europe',   subregion: 'Eastern Europe',   flag: '🇷🇺', capital: 'Moscow',          population: 145000000, languages: ['Russian'],          currency: 'RUB', timezone: 'Europe/Moscow' },
  { code: 'UA', name: 'Ukraine',          commonName: 'Україна',      region: 'Europe',   subregion: 'Eastern Europe',   flag: '🇺🇦', capital: 'Kyiv',            population: 44000000,  languages: ['Ukrainian'],        currency: 'UAH', timezone: 'Europe/Kiev' },
]

// ─── Visa Requirements (sample) ───────────────────────────────────────────────
// A curated sample covering the most common routes.
// status: "Not Required" | "Visa on Arrival" | "eVisa" | "Visa Required"
type VisaEntry = {
  from: string
  to: string
  visaType: string
  visaStatus: string
  stayDuration?: number
  processingTimeDays?: number
  costUSD?: number
  validity?: string
  requiredDocuments?: string[]
  notes?: string
  verified?: boolean
  sourceUrl?: string
}

const VISA_REQUIREMENTS: VisaEntry[] = [
  // US passport → EU (Schengen)
  { from: 'US', to: 'FR', visaType: 'Tourist',  visaStatus: 'Not Required',  stayDuration: 90, processingTimeDays: 0, costUSD: 0, validity: '90 days / 180', requiredDocuments: ['Passport', 'Return ticket', 'Proof of accommodation'], verified: true, sourceUrl: 'https://france-visas.gouv.fr' },
  { from: 'US', to: 'DE', visaType: 'Tourist',  visaStatus: 'Not Required',  stayDuration: 90, processingTimeDays: 0, costUSD: 0, validity: '90 days / 180', requiredDocuments: ['Passport', 'Travel insurance'], verified: true, sourceUrl: 'https://www.auswaertiges-amt.de' },
  { from: 'US', to: 'IT', visaType: 'Tourist',  visaStatus: 'Not Required',  stayDuration: 90, processingTimeDays: 0, costUSD: 0, validity: '90 days / 180', requiredDocuments: ['Passport'], verified: true },
  { from: 'US', to: 'ES', visaType: 'Tourist',  visaStatus: 'Not Required',  stayDuration: 90, processingTimeDays: 0, costUSD: 0, validity: '90 days / 180', requiredDocuments: ['Passport'], verified: true },
  { from: 'US', to: 'GB', visaType: 'Tourist',  visaStatus: 'Not Required',  stayDuration: 180, processingTimeDays: 0, costUSD: 0, validity: '6 months', requiredDocuments: ['Passport'], verified: true, sourceUrl: 'https://www.gov.uk/guidance/foreign-travel-advice' },
  { from: 'US', to: 'JP', visaType: 'Tourist',  visaStatus: 'Not Required',  stayDuration: 90, processingTimeDays: 0, costUSD: 0, validity: '90 days', requiredDocuments: ['Passport', 'Return ticket'], verified: true, sourceUrl: 'https://www.mofa.go.jp' },
  { from: 'US', to: 'AU', visaType: 'Tourist',  visaStatus: 'eVisa',         stayDuration: 90, processingTimeDays: 1, costUSD: 20, validity: 'Multiple entry / 1 year', requiredDocuments: ['Passport', 'Credit card'], notes: 'ETA required, applied online', verified: true, sourceUrl: 'https://immi.homeaffairs.gov.au' },
  { from: 'US', to: 'CA', visaType: 'Tourist',  visaStatus: 'Not Required',  stayDuration: 180, processingTimeDays: 0, costUSD: 0, validity: '6 months', requiredDocuments: ['Passport'], verified: true },
  { from: 'US', to: 'TH', visaType: 'Tourist',  visaStatus: 'Not Required',  stayDuration: 60, processingTimeDays: 0, costUSD: 0, validity: '60 days', requiredDocuments: ['Passport', 'Return ticket', 'Proof of funds'], verified: true, notes: 'Extended to 60 days in 2024' },
  { from: 'US', to: 'SG', visaType: 'Tourist',  visaStatus: 'Not Required',  stayDuration: 90, processingTimeDays: 0, costUSD: 0, validity: '90 days', requiredDocuments: ['Passport'], verified: true },
  { from: 'US', to: 'AE', visaType: 'Tourist',  visaStatus: 'Not Required',  stayDuration: 90, processingTimeDays: 0, costUSD: 0, validity: '90 days', requiredDocuments: ['Passport'], verified: true },
  { from: 'US', to: 'TR', visaType: 'Tourist',  visaStatus: 'eVisa',         stayDuration: 90, processingTimeDays: 1, costUSD: 50, validity: '180 days', requiredDocuments: ['Passport', 'Credit card'], verified: true, sourceUrl: 'https://www.evisa.gov.tr' },
  { from: 'US', to: 'IN', visaType: 'Tourist',  visaStatus: 'eVisa',         stayDuration: 90, processingTimeDays: 3, costUSD: 25, validity: 'Double entry / 60 days', requiredDocuments: ['Passport', 'Passport photo', 'Credit card'], verified: true, sourceUrl: 'https://indianvisaonline.gov.in' },
  { from: 'US', to: 'CN', visaType: 'Tourist',  visaStatus: 'Visa Required',  stayDuration: 30, processingTimeDays: 10, costUSD: 140, validity: '10 years (multiple)', requiredDocuments: ['Passport', 'Invitation letter', 'Flight itinerary', 'Hotel booking', 'Bank statement'], verified: true },
  { from: 'US', to: 'BR', visaType: 'Tourist',  visaStatus: 'Not Required',  stayDuration: 90, processingTimeDays: 0, costUSD: 0, validity: '90 days', requiredDocuments: ['Passport'], verified: true },

  // FR passport → others
  { from: 'FR', to: 'US', visaType: 'Tourist',  visaStatus: 'eVisa',         stayDuration: 90, processingTimeDays: 1, costUSD: 21, validity: '2 years (multiple)', requiredDocuments: ['Passport', 'Credit card'], notes: 'ESTA required', verified: true, sourceUrl: 'https://esta.cbp.dhs.gov' },
  { from: 'FR', to: 'JP', visaType: 'Tourist',  visaStatus: 'Not Required',  stayDuration: 90, processingTimeDays: 0, costUSD: 0, validity: '90 days', requiredDocuments: ['Passport'], verified: true },
  { from: 'FR', to: 'AU', visaType: 'Tourist',  visaStatus: 'eVisa',         stayDuration: 90, processingTimeDays: 1, costUSD: 20, validity: 'Multiple entry / 1 year', requiredDocuments: ['Passport'], verified: true },
  { from: 'FR', to: 'CA', visaType: 'Tourist',  visaStatus: 'eVisa',         stayDuration: 180, processingTimeDays: 3, costUSD: 7, validity: '5 years', requiredDocuments: ['Passport', 'Credit card'], notes: 'eTA required', verified: true, sourceUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta.html' },
  { from: 'FR', to: 'TH', visaType: 'Tourist',  visaStatus: 'Not Required',  stayDuration: 60, processingTimeDays: 0, costUSD: 0, validity: '60 days', requiredDocuments: ['Passport'], verified: true },
  { from: 'FR', to: 'IN', visaType: 'Tourist',  visaStatus: 'eVisa',         stayDuration: 90, processingTimeDays: 3, costUSD: 25, validity: 'Double entry', requiredDocuments: ['Passport', 'Passport photo', 'Credit card'], verified: true },
  { from: 'FR', to: 'BR', visaType: 'Tourist',  visaStatus: 'Not Required',  stayDuration: 90, processingTimeDays: 0, costUSD: 0, validity: '90 days', requiredDocuments: ['Passport'], verified: true },
  { from: 'FR', to: 'MX', visaType: 'Tourist',  visaStatus: 'Not Required',  stayDuration: 180, processingTimeDays: 0, costUSD: 0, validity: '180 days', requiredDocuments: ['Passport'], verified: true },

  // IN passport → others (tighter restrictions)
  { from: 'IN', to: 'US', visaType: 'Tourist',  visaStatus: 'Visa Required', stayDuration: 180, processingTimeDays: 90, costUSD: 185, validity: '10 years (multiple)', requiredDocuments: ['Passport', 'DS-160 form', 'Bank statement', 'Employment proof', 'Interview appointment'], verified: true, sourceUrl: 'https://travel.state.gov' },
  { from: 'IN', to: 'GB', visaType: 'Tourist',  visaStatus: 'Visa Required', stayDuration: 180, processingTimeDays: 21, costUSD: 115, validity: '6 months', requiredDocuments: ['Passport', 'Bank statement', 'Proof of accommodation', 'Travel itinerary'], verified: true },
  { from: 'IN', to: 'FR', visaType: 'Tourist',  visaStatus: 'Visa Required', stayDuration: 90, processingTimeDays: 15, costUSD: 80, validity: '90 days (Schengen)', requiredDocuments: ['Passport', 'Bank statement', 'Travel insurance', 'Hotel booking', 'Return ticket'], verified: true },
  { from: 'IN', to: 'DE', visaType: 'Tourist',  visaStatus: 'Visa Required', stayDuration: 90, processingTimeDays: 15, costUSD: 80, validity: '90 days (Schengen)', requiredDocuments: ['Passport', 'Bank statement', 'Travel insurance', 'Hotel booking'], verified: true },
  { from: 'IN', to: 'AE', visaType: 'Tourist',  visaStatus: 'Visa on Arrival', stayDuration: 30, processingTimeDays: 0, costUSD: 0, validity: '30 days', requiredDocuments: ['Passport', 'Return ticket', 'Proof of accommodation'], verified: true },
  { from: 'IN', to: 'TH', visaType: 'Tourist',  visaStatus: 'Visa on Arrival', stayDuration: 30, processingTimeDays: 0, costUSD: 35, validity: '30 days', requiredDocuments: ['Passport', 'Passport photo', '10,000 THB cash', 'Return ticket'], verified: true },
  { from: 'IN', to: 'SG', visaType: 'Tourist',  visaStatus: 'Visa Required', stayDuration: 30, processingTimeDays: 5, costUSD: 30, validity: '30 days', requiredDocuments: ['Passport', 'Bank statement', 'Proof of accommodation'], verified: true },
  { from: 'IN', to: 'JP', visaType: 'Tourist',  visaStatus: 'Visa Required', stayDuration: 90, processingTimeDays: 5, costUSD: 0, validity: '90 days', requiredDocuments: ['Passport', 'Itinerary', 'Bank statement', 'Employment letter'], notes: 'No fee but certificate required', verified: true },

  // BR passport → others
  { from: 'BR', to: 'US', visaType: 'Tourist',  visaStatus: 'Visa Required', stayDuration: 180, processingTimeDays: 60, costUSD: 185, validity: '10 years (multiple)', requiredDocuments: ['Passport', 'DS-160', 'Bank statement'], verified: true },
  { from: 'BR', to: 'FR', visaType: 'Tourist',  visaStatus: 'Not Required',  stayDuration: 90, processingTimeDays: 0, costUSD: 0, validity: '90 days (Schengen)', requiredDocuments: ['Passport'], verified: true },
  { from: 'BR', to: 'JP', visaType: 'Tourist',  visaStatus: 'Not Required',  stayDuration: 90, processingTimeDays: 0, costUSD: 0, validity: '90 days', requiredDocuments: ['Passport'], verified: true },
  { from: 'BR', to: 'AU', visaType: 'Tourist',  visaStatus: 'eVisa',         stayDuration: 90, processingTimeDays: 1, costUSD: 20, validity: 'Multiple / 1 year', requiredDocuments: ['Passport'], verified: true },
]

// ─── Travel Advisories (sample) ──────────────────────────────────────────────
type AdvisoryEntry = {
  country: string
  level: number
  title: string
  description: string
  sourceUrl?: string
}

const TRAVEL_ADVISORIES: AdvisoryEntry[] = [
  { country: 'UA', level: 4, title: 'Do Not Travel', description: 'Do not travel to Ukraine due to the ongoing armed conflict and potential for further escalation.', sourceUrl: 'https://travel.state.gov' },
  { country: 'RU', level: 4, title: 'Do Not Travel', description: 'Do not travel to Russia due to the unpredictable consequences of the war with Ukraine and the risk of wrongful detention.', sourceUrl: 'https://travel.state.gov' },
  { country: 'EG', level: 2, title: 'Exercise Increased Caution', description: 'Exercise increased caution in Egypt due to terrorism. Some areas have increased risk.', sourceUrl: 'https://travel.state.gov' },
  { country: 'MA', level: 1, title: 'Exercise Normal Precautions', description: 'Exercise normal precautions in Morocco.', sourceUrl: 'https://travel.state.gov' },
  { country: 'TH', level: 1, title: 'Exercise Normal Precautions', description: 'Exercise normal precautions in Thailand.', sourceUrl: 'https://travel.state.gov' },
  { country: 'IN', level: 2, title: 'Exercise Increased Caution', description: 'Exercise increased caution in India due to crime and terrorism. Some areas have increased risk.', sourceUrl: 'https://travel.state.gov' },
  { country: 'TR', level: 2, title: 'Exercise Increased Caution', description: 'Exercise increased caution in Turkey due to terrorism and arbitrary detentions.', sourceUrl: 'https://travel.state.gov' },
  { country: 'MX', level: 3, title: 'Reconsider Travel', description: 'Reconsider travel to Mexico due to crime and kidnapping. Some areas have greater risk.', sourceUrl: 'https://travel.state.gov' },
  { country: 'JP', level: 1, title: 'Exercise Normal Precautions', description: 'Exercise normal precautions in Japan.', sourceUrl: 'https://travel.state.gov' },
  { country: 'FR', level: 2, title: 'Exercise Increased Caution', description: 'Exercise increased caution in France due to terrorism.', sourceUrl: 'https://travel.state.gov' },
]

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌍 Starting seed...\n')

  // 1. Upsert countries
  console.log(`📦 Seeding ${COUNTRIES.length} countries...`)
  const countryMap: Record<string, string> = {}

  for (const c of COUNTRIES) {
    const country = await prisma.country.upsert({
      where: { code: c.code },
      update: { name: c.name, flag: c.flag, region: c.region },
      create: c,
    })
    countryMap[c.code] = country.id
  }
  console.log(`   ✅ Countries done\n`)

  // 2. Upsert visa requirements
  console.log(`🛂 Seeding ${VISA_REQUIREMENTS.length} visa requirements...`)
  for (const v of VISA_REQUIREMENTS) {
    const fromId = countryMap[v.from]
    const toId   = countryMap[v.to]
    if (!fromId || !toId) {
      console.warn(`   ⚠️  Skipping ${v.from} → ${v.to}: country not found`)
      continue
    }
    await prisma.visaRequirement.upsert({
      where: {
        fromCountryId_toCountryId_visaType: {
          fromCountryId: fromId,
          toCountryId:   toId,
          visaType:      v.visaType,
        },
      },
      update: {
        visaStatus:            v.visaStatus,
        stayDuration:          v.stayDuration,
        processingTimeDays:    v.processingTimeDays,
        costUSD:               v.costUSD,
        validity:              v.validity,
        requiredDocuments:     v.requiredDocuments ?? [],
        notes:                 v.notes,
        verified:              v.verified ?? false,
        sourceUrl:             v.sourceUrl,
      },
      create: {
        fromCountryId:         fromId,
        toCountryId:           toId,
        visaType:              v.visaType,
        visaStatus:            v.visaStatus,
        stayDuration:          v.stayDuration,
        processingTimeDays:    v.processingTimeDays,
        costUSD:               v.costUSD,
        validity:              v.validity,
        requiredDocuments:     v.requiredDocuments ?? [],
        notes:                 v.notes,
        verified:              v.verified ?? false,
        sourceUrl:             v.sourceUrl,
      },
    })
  }
  console.log(`   ✅ Visa requirements done\n`)

  // 3. Upsert travel advisories
  console.log(`⚠️  Seeding ${TRAVEL_ADVISORIES.length} travel advisories...`)
  for (const a of TRAVEL_ADVISORIES) {
    const cid = countryMap[a.country]
    if (!cid) continue
    const existing = await prisma.travelAdvisory.findFirst({ where: { countryId: cid } })
    if (existing) {
      await prisma.travelAdvisory.update({
        where: { id: existing.id },
        data: { level: a.level, title: a.title, description: a.description, sourceUrl: a.sourceUrl },
      })
    } else {
      await prisma.travelAdvisory.create({
        data: { countryId: cid, level: a.level, title: a.title, description: a.description, sourceUrl: a.sourceUrl },
      })
    }
  }
  console.log(`   ✅ Travel advisories done\n`)

  console.log('🎉 Seed complete!')
  console.log(`   Countries:         ${COUNTRIES.length}`)
  console.log(`   Visa requirements: ${VISA_REQUIREMENTS.length}`)
  console.log(`   Travel advisories: ${TRAVEL_ADVISORIES.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
