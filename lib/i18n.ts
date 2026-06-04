export const dictionaries = {
  en: {
    dashboard: "Dashboard",
    farms: "Farms",
    crops: "Crops",
    expenses: "Expenses",
    income: "Income",
    reports: "Reports"
  },
  hi: {
    dashboard: "डैशबोर्ड",
    farms: "खेत",
    crops: "फसलें",
    expenses: "खर्च",
    income: "आय",
    reports: "रिपोर्ट"
  },
  es: {
    dashboard: "Panel",
    farms: "Fincas",
    crops: "Cultivos",
    expenses: "Gastos",
    income: "Ingresos",
    reports: "Informes"
  },
  fr: {
    dashboard: "Tableau",
    farms: "Fermes",
    crops: "Cultures",
    expenses: "Depenses",
    income: "Revenus",
    reports: "Rapports"
  }
} as const;

export type Locale = keyof typeof dictionaries;

export function translate(locale: string | undefined, key: keyof typeof dictionaries.en) {
  const dictionary = dictionaries[(locale as Locale) || "en"] ?? dictionaries.en;
  return dictionary[key] ?? dictionaries.en[key];
}
