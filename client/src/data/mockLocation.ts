import type { Country } from "@/types/LocationType";

const mockCountries: Country[] = [
  {
    code: "AZ",
    name: { en: "Azerbaijan", az: "Azərbaycan", tr: "Azerbaycan", ru: "Азербайджан" },
    cities: ["Baku", "Ganja", "Sumqayit", "Shaki","Nakhchivan" , "Zaqatala", "Lankaran", "Mingachevir"],
  },
  {
    code: "TR",
    name: { en: "Turkey", az: "Türkiyə", tr: "Türkiye", ru: "Турция" },
    cities: ["Istanbul", "Ankara", "Izmir", "Bursa"],
  },
  {
    code: "US",
    name: {
      en: "United States",
      az: "Amerika Birləşmiş Ştatları",
      tr: "Amerika Birleşik Devletleri",
      ru: "Соединённые Штаты Америки",
    },
    cities: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"],
  },
  {
    code: "CA",
    name: {
      en: "Canada",
      az: "Kanada",
      tr: "Kanada",
      ru: "Канада",
    },
    cities: ["Toronto", "Vancouver", "Montreal", "Calgary"],
  },
  {
    code: "DE",
    name: { en: "Germany", az: "Almaniya", tr: "Almanya", ru: "Германия" },
    cities: ["Berlin", "Munich", "Frankfurt", "Hamburg"],
  },
  {
    code: "FR",
    name: { en: "France", az: "Fransa", tr: "Fransa", ru: "Франция" },
    cities: ["Paris", "Lyon", "Marseille", "Nice"],
  },
  {
    code: "GB",
    name: {
      en: "United Kingdom",
      az: "Birləşmiş Krallıq",
      tr: "Birleşik Krallık",
      ru: "Великобритания",
    },
    cities: ["London", "Manchester", "Birmingham", "Glasgow"],
  },
  {
    code: "RU",
    name: { en: "Russia", az: "Rusiya", tr: "Rusya", ru: "Россия" },
    cities: ["Moscow", "Saint Petersburg", "Kazan", "Sochi"],
  },
  {
    code: "CN",
    name: { en: "China", az: "Çin", tr: "Çin", ru: "Китай" },
    cities: ["Beijing", "Shanghai", "Shenzhen", "Guangzhou"],
  },
  {
    code: "IN",
    name: { en: "India", az: "Hindistan", tr: "Hindistan", ru: "Индия" },
    cities: ["Mumbai", "Delhi", "Bangalore", "Hyderabad"],
  },
  {
    code: "JP",
    name: { en: "Japan", az: "Yaponiya", tr: "Japonya", ru: "Япония" },
    cities: ["Tokyo", "Osaka", "Kyoto", "Nagoya"],
  },
  {
    code: "IT",
    name: { en: "Italy", az: "İtaliya", tr: "İtalya", ru: "Италия" },
    cities: ["Rome", "Milan", "Naples", "Turin"],
  },
  {
    code: "BR",
    name: { en: "Brazil", az: "Braziliya", tr: "Brezilya", ru: "Бразилия" },
    cities: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"],
  },
  {
    code: "AU",
    name: { en: "Australia", az: "Avstraliya", tr: "Avustralya", ru: "Австралия" },
    cities: ["Sydney", "Melbourne", "Brisbane", "Perth"],
  },
  {
    code: "ES",
    name: { en: "Spain", az: "İspaniya", tr: "İspanya", ru: "Испания" },
    cities: ["Madrid", "Barcelona", "Valencia", "Seville"],
  },

  {
    code: "UA",
    name: { en: "Ukraine", az: "Ukrayna", tr: "Ukrayna", ru: "Украина" },
    cities: ["Kyiv", "Lviv", "Odessa", "Kharkiv"],
  },
  {
    code: "NL",
    name: { en: "Netherlands", az: "Niderland", tr: "Hollanda", ru: "Нидерланды" },
    cities: ["Amsterdam", "Rotterdam", "Utrecht", "The Hague"],
  },
  {
    code: "SE",
    name: { en: "Sweden", az: "İsveç", tr: "İsveç", ru: "Швеция" },
    cities: ["Stockholm", "Gothenburg", "Malmö", "Uppsala"],
  },
  {
    code: "CH",
    name: { en: "Switzerland", az: "İsveçrə", tr: "İsviçre", ru: "Швейцария" },
    cities: ["Zurich", "Geneva", "Bern", "Basel"],
  },
  {
    code: "BE",
    name: { en: "Belgium", az: "Belçika", tr: "Belçika", ru: "Бельгия" },
    cities: ["Brussels", "Antwerp", "Ghent", "Bruges"],
  },
  {
    code: "NO",
    name: { en: "Norway", az: "Norveç", tr: "Norveç", ru: "Норвегия" },
    cities: ["Oslo", "Bergen", "Trondheim", "Stavanger"],
  },
  {
    code: "MX",
    name: { en: "Mexico", az: "Meksika", tr: "Meksika", ru: "Мексика" },
    cities: ["Mexico City", "Guadalajara", "Monterrey", "Puebla"],
  },
  {
    code: "KR",
    name: { en: "South Korea", az: "Cənubi Koreya", tr: "Güney Kore", ru: "Южная Корея" },
    cities: ["Seoul", "Busan", "Incheon", "Daegu"],
  },
  {
    code: "SA",
    name: { en: "Saudi Arabia", az: "Səudiyyə Ərəbistanı", tr: "Suudi Arabistan", ru: "Саудовская Аравия" },
    cities: ["Riyadh", "Jeddah", "Mecca", "Medina"],
  },
  {
    code: "EG",
    name: { en: "Egypt", az: "Misir", tr: "Mısır", ru: "Египет" },
    cities: ["Cairo", "Alexandria", "Giza", "Luxor"],
  },
  {
    code: "ZA",
    name: { en: "South Africa", az: "Cənubi Afrika", tr: "Güney Afrika", ru: "Южная Африка" },
    cities: ["Cape Town", "Johannesburg", "Durban", "Pretoria"],
  },
  {
    code: "AR",
    name: { en: "Argentina", az: "Argentina", tr: "Arjantin", ru: "Аргентина" },
    cities: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza"],
  },
  {
    code: "PK",
    name: { en: "Pakistan", az: "Pakistan", tr: "Pakistan", ru: "Пакистан" },
    cities: ["Lahore", "Karachi", "Islamabad", "Rawalpindi"],
  },
  {
    code: "ID",
    name: { en: "Indonesia", az: "İndoneziya", tr: "Endonezya", ru: "Индонезия" },
    cities: ["Jakarta", "Surabaya", "Bandung", "Medan"],
  },
  {
    code: "IR",
    name: { en: "Iran", az: "İran", tr: "İran", ru: "Иран" },
    cities: ["Tehran", "Mashhad", "Isfahan", "Shiraz"],
  },
]

export default mockCountries;