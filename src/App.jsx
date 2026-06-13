import { useState, useEffect, useContext, createContext, useCallback } from "react";

// ─── Context ───────────────────────────────────────────────────────────────
const ThemeCtx = createContext();
const FavCtx = createContext();

function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("tc_theme") === "dark"; } catch { return false; }
  });
  const toggle = () => setDark(d => {
    const next = !d;
    try { localStorage.setItem("tc_theme", next ? "dark" : "light"); } catch {}
    return next;
  });
  return <ThemeCtx.Provider value={{ dark, toggle }}>{children}</ThemeCtx.Provider>;
}

function FavProvider({ children }) {
  const [favs, setFavs] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tc_favs") || "[]"); } catch { return []; }
  });
  const add = (plan) => {
    setFavs(prev => {
      const next = [plan, ...prev.filter(f => f.id !== plan.id)];
      try { localStorage.setItem("tc_favs", JSON.stringify(next)); } catch {}
      return next;
    });
  };
  const remove = (id) => {
    setFavs(prev => {
      const next = prev.filter(f => f.id !== id);
      try { localStorage.setItem("tc_favs", JSON.stringify(next)); } catch {}
      return next;
    });
  };
  const has = (id) => favs.some(f => f.id === id);
  return <FavCtx.Provider value={{ favs, add, remove, has }}>{children}</FavCtx.Provider>;
}

// ─── Lang Context ──────────────────────────────────────────────────────────
const LangCtx = createContext();

const T = {
  en: {
    home: "Home", favorites: "Favorites", planTrip: "✈️ Plan your trip",
    country: "Country", city: "City", duration: "Duration (days)",
    budgetLevel: "Budget Level", tripGoal: "Trip Goal",
    createPlan: "🗺️ Create Travel Plan", crafting: "Crafting your journey...",
    analyzing: "This may take 30-60 seconds...",
    backToPlanner: "← Back to planner", saveTrip: "☆ Save Trip", saved: "⭐ Saved",
    destinationInfo: "Destination Info", weather: "Weather", budgetBreakdown: "Budget Breakdown",
    topAttractions: "Top Attractions", recommendedHotels: "Recommended Hotels",
    recommendedRestaurants: "Recommended Restaurants", interactiveMap: "Interactive Map",
    travelSchedule: "Travel Schedule", viewOnMap: "View on Map", visitWebsite: "Visit Website ↗",
    currency: "Currency", language: "Language", population: "Population", timezone: "Timezone",
    days: "days", humidity: "Humidity", totalCost: "Total estimated cost",
    avgCheck: "Avg check", perNight: "/night", savedTrips: "⭐ Saved Trips",
    noSavedTrips: "No saved trips yet", planATrip: "Plan a trip and save it to see it here",
    remove: "Remove", view: "View →", cuisine: "Cuisine",
    inUSD: "≈ in USD",
    forDays: "For", dayNum: "Day",
    heroTitle: "Plan your next", heroTitleEm: "adventure", heroTitleEnd: "with AI",
    heroDesc: "TripCraft turns your travel dreams into detailed, personalized itineraries in seconds. Hotels, restaurants, attractions — all curated for you.",
    tripsPlanned: "Trips planned", countries: "Countries", rating: "Rating",
    countryLabel: "e.g. Japan", cityLabel: "e.g. Tokyo",
    sightseeing: "Sightseeing", food: "Food", shopping: "Shopping",
    nature: "Nature", relaxation: "Relaxation", sports: "Sports",
  },
  ru: {
    home: "Главная", favorites: "Избранное", planTrip: "✈️ Планируй поездку",
    country: "Страна", city: "Город", duration: "Количество дней",
    budgetLevel: "Уровень бюджета", tripGoal: "Цель поездки",
    createPlan: "🗺️ Создать план поездки", crafting: "Создаём ваш маршрут...",
    analyzing: "Это может занять 30-60 секунд...",
    backToPlanner: "← Назад к планировщику", saveTrip: "☆ Сохранить", saved: "⭐ Сохранено",
    destinationInfo: "О направлении", weather: "Погода", budgetBreakdown: "Бюджет",
    topAttractions: "Достопримечательности", recommendedHotels: "Рекомендуемые отели",
    recommendedRestaurants: "Рекомендуемые рестораны", interactiveMap: "Интерактивная карта",
    travelSchedule: "План путешествия", viewOnMap: "На карте", visitWebsite: "Сайт ↗",
    currency: "Валюта", language: "Язык", population: "Население", timezone: "Часовой пояс",
    days: "дней", humidity: "Влажность", totalCost: "Итого за поездку",
    avgCheck: "Средний чек", perNight: "/ночь", savedTrips: "⭐ Сохранённые поездки",
    noSavedTrips: "Нет сохранённых поездок", planATrip: "Создайте план и сохраните его",
    remove: "Удалить", view: "Открыть →", cuisine: "Кухня",
    inUSD: "≈ в долларах",
    forDays: "За", dayNum: "День",
    heroTitle: "Планируй своё", heroTitleEm: "путешествие", heroTitleEnd: "с помощью ИИ",
    heroDesc: "TripCraft превращает ваши мечты о путешествиях в подробные персональные маршруты за секунды. Отели, рестораны, достопримечательности — всё подобрано для вас.",
    tripsPlanned: "Маршрутов создано", countries: "Стран", rating: "Рейтинг",
    countryLabel: "напр. Россия", cityLabel: "напр. Москва",
    sightseeing: "Достопримечательности", food: "Еда", shopping: "Шопинг",
    nature: "Природа", relaxation: "Отдых", sports: "Спорт",
  }
};

function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("tc_lang") || "en"; } catch { return "en"; }
  });
  const toggleLang = () => setLang(l => {
    const next = l === "en" ? "ru" : "en";
    try { localStorage.setItem("tc_lang", next); } catch {}
    return next;
  });
  const t = T[lang];
  return <LangCtx.Provider value={{ lang, toggleLang, t }}>{children}</LangCtx.Provider>;
}

// Exchange rates (approximate, vs USD)
const RATES = {
  USD: 1, EUR: 1.08, GBP: 1.27, JPY: 0.0067, TRY: 0.031,
  RUB: 0.011, CNY: 0.14, INR: 0.012, THB: 0.028, AED: 0.27,
  MXN: 0.058, BRL: 0.19, AUD: 0.65, CAD: 0.73, KRW: 0.00073,
  SGD: 0.74, CHF: 1.12, SEK: 0.096, NOK: 0.095, DKK: 0.145,
  PLN: 0.25, CZK: 0.044, HUF: 0.0028, RON: 0.22, BGN: 0.55,
  HRK: 0.14, UZS: 0.000079, KZT: 0.0022, UAH: 0.024,
};

function toUSD(amount, currencyCode) {
  const code = currencyCode?.toUpperCase();
  const rate = RATES[code] || 1;
  return Math.round(amount * rate);
}

// ─── API ────────────────────────────────────────────────────────────────────
async function generateTravelPlan(formData) {
  const prompt = `Generate a travel plan JSON for ${formData.city}, ${formData.country}. ${formData.days} days, ${formData.budget} budget, goal: ${formData.goal}.
Return ONLY valid JSON, no markdown:
{"cityInfo":{"country":"","city":"","currency":"","language":"","population":"","timezone":"","description":"","imageKeyword":""},"weather":{"temp":0,"condition":"","humidity":0,"forecast":[{"day":"Mon","high":0,"low":0,"icon":"sun"},{"day":"Tue","high":0,"low":0,"icon":"sun"},{"day":"Wed","high":0,"low":0,"icon":"cloud"},{"day":"Thu","high":0,"low":0,"icon":"sun"},{"day":"Fri","high":0,"low":0,"icon":"sun"}]},"budget":{"accommodation":0,"food":0,"transport":0,"entertainment":0,"currency":""},"attractions":[{"name":"","description":"","rating":4.5,"category":"","imageKeyword":"","mapUrl":"https://maps.google.com"},{"name":"","description":"","rating":4.5,"category":"","imageKeyword":"","mapUrl":"https://maps.google.com"},{"name":"","description":"","rating":4.5,"category":"","imageKeyword":"","mapUrl":"https://maps.google.com"},{"name":"","description":"","rating":4.5,"category":"","imageKeyword":"","mapUrl":"https://maps.google.com"}],"hotels":[{"name":"","rating":4.5,"description":"","pricePerNight":0,"address":"","website":"https://booking.com","imageKeyword":""},{"name":"","rating":4.5,"description":"","pricePerNight":0,"address":"","website":"https://booking.com","imageKeyword":""},{"name":"","rating":4.5,"description":"","pricePerNight":0,"address":"","website":"https://booking.com","imageKeyword":""}],"restaurants":[{"name":"","cuisine":"","rating":4.5,"address":"","avgCheck":0,"website":"https://tripadvisor.com","imageKeyword":""},{"name":"","cuisine":"","rating":4.5,"address":"","avgCheck":0,"website":"https://tripadvisor.com","imageKeyword":""},{"name":"","cuisine":"","rating":4.5,"address":"","avgCheck":0,"website":"https://tripadvisor.com","imageKeyword":""}],"schedule":[DAYS_PLACEHOLDER]}
Fill all empty strings with real data. Budget in local currency for total trip. Replace DAYS_PLACEHOLDER with ${formData.days} day objects like {"day":1,"items":["activity1","activity2","restaurant visit"]}.`;

  const models = [
  "openrouter/auto",
  "meta-llama/llama-3.3-70b-instruct:free",
  "deepseek/deepseek-r1:free",
  "deepseek/deepseek-v3:free",
  "qwen/qwen3-coder:free",
  "openai/gpt-4o-mini:free"
];

let lastError;
for (const model of models) {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + (import.meta.env.VITE_OPENROUTER_KEY || ""),
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "TripCraft"
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4000
      })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    const text = data.choices?.[0]?.message?.content || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");
    return JSON.parse(jsonMatch[0]);
  } catch(e) {
    lastError = e;
    console.log(`Model ${model} failed, trying next...`);
  }
}
throw lastError;
}

// ─── Styles ─────────────────────────────────────────────────────────────────
const getStyles = (dark) => `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  body { 
    background: ${dark ? "#0f1117" : "#f7f5f0"}; 
    color: ${dark ? "#e8e4dd" : "#1a1816"};
    font-family: 'DM Sans', sans-serif;
    transition: background 0.3s, color 0.3s;
  }

  .tc-app { min-height: 100vh; }

  /* NAV */
  .tc-nav {
    position: sticky; top: 0; z-index: 100;
    background: ${dark ? "rgba(15,17,23,0.92)" : "rgba(247,245,240,0.92)"};
    backdrop-filter: blur(12px);
    border-bottom: 1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"};
    padding: 0 2rem;
    display: flex; align-items: center; justify-content: space-between;
    height: 64px;
  }
  .tc-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem; font-weight: 700;
    color: ${dark ? "#f0c060" : "#c47c2b"};
    cursor: pointer;
    letter-spacing: -0.5px;
  }
  .tc-logo span { color: ${dark ? "#e8e4dd" : "#1a1816"}; }
  .tc-nav-links { display: flex; align-items: center; gap: 0.5rem; }
  .tc-nav-btn {
    padding: 0.45rem 1rem;
    border-radius: 8px;
    border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem; font-weight: 500;
    background: transparent;
    color: ${dark ? "#a09890" : "#6b6460"};
    transition: all 0.2s;
  }
  .tc-nav-btn:hover { background: ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}; color: ${dark ? "#e8e4dd" : "#1a1816"}; }
  .tc-nav-btn.active { color: ${dark ? "#f0c060" : "#c47c2b"}; }
  .tc-theme-btn {
    width: 38px; height: 38px;
    border-radius: 50%; border: 1.5px solid ${dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"};
    background: transparent; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; transition: all 0.2s;
    color: ${dark ? "#e8e4dd" : "#1a1816"};
  }
  .tc-theme-btn:hover { transform: rotate(20deg); }

  /* HERO */
  .tc-hero {
    min-height: calc(100vh - 64px);
    display: flex; align-items: center;
    position: relative; overflow: hidden;
    background: ${dark 
      ? "linear-gradient(135deg, #0f1117 0%, #1a1520 50%, #0f1117 100%)"
      : "linear-gradient(135deg, #fdf6e8 0%, #f0e8d8 50%, #fdf6e8 100%)"};
  }
  .tc-hero-bg {
    position: absolute; inset: 0;
    background-image: url('https://images.pexels.com/photos/1051073/pexels-photo-1051073.jpeg?auto=compress&w=1400');
    background-size: cover; background-position: center;
    opacity: ${dark ? "0.08" : "0.12"};
  }
  .tc-hero-content {
    position: relative; z-index: 1;
    max-width: 1200px; margin: 0 auto;
    padding: 4rem 2rem;
    display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;
  }
  @media (max-width: 768px) {
    .tc-hero-content { grid-template-columns: 1fr; gap: 2rem; padding: 2rem 1rem; }
  }
  .tc-hero-text h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 700; line-height: 1.15;
    margin-bottom: 1.25rem;
  }
  .tc-hero-text h1 em {
    font-style: italic;
    color: ${dark ? "#f0c060" : "#c47c2b"};
  }
  .tc-hero-text p {
    font-size: 1.1rem; line-height: 1.7;
    color: ${dark ? "#a09890" : "#6b6460"};
    margin-bottom: 2rem;
  }
  .tc-stats { display: flex; gap: 2rem; }
  .tc-stat { text-align: center; }
  .tc-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 1.75rem; font-weight: 700;
    color: ${dark ? "#f0c060" : "#c47c2b"};
  }
  .tc-stat-label { font-size: 0.8rem; color: ${dark ? "#807870" : "#9b8f89"}; }

  /* FORM */
  .tc-form-card {
    background: ${dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.7)"};
    border: 1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
    border-radius: 20px;
    padding: 2rem;
    backdrop-filter: blur(20px);
  }
  .tc-form-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem; font-weight: 700;
    margin-bottom: 1.5rem;
    color: ${dark ? "#e8e4dd" : "#1a1816"};
  }
  .tc-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  @media (max-width: 480px) { .tc-form-grid { grid-template-columns: 1fr; } }
  .tc-field { display: flex; flex-direction: column; gap: 0.4rem; }
  .tc-field.full { grid-column: 1 / -1; }
  .tc-label {
    font-size: 0.8rem; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.06em;
    color: ${dark ? "#807870" : "#9b8f89"};
  }
  .tc-input, .tc-select {
    padding: 0.65rem 1rem;
    border-radius: 10px;
    border: 1.5px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"};
    background: ${dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)"};
    color: ${dark ? "#e8e4dd" : "#1a1816"};
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    transition: border-color 0.2s;
    outline: none;
  }
  .tc-input:focus, .tc-select:focus {
    border-color: ${dark ? "#f0c060" : "#c47c2b"};
  }
  .tc-select option { background: ${dark ? "#1a1520" : "#fff"}; }
  
  .tc-budget-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
  .tc-budget-btn {
    padding: 0.6rem; border-radius: 10px;
    border: 1.5px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"};
    background: transparent; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; font-weight: 500;
    color: ${dark ? "#a09890" : "#6b6460"};
    transition: all 0.2s; text-align: center;
  }
  .tc-budget-btn.selected {
    border-color: ${dark ? "#f0c060" : "#c47c2b"};
    background: ${dark ? "rgba(240,192,96,0.1)" : "rgba(196,124,43,0.08)"};
    color: ${dark ? "#f0c060" : "#c47c2b"};
  }
  
  .tc-goals-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
  .tc-goal-btn {
    padding: 0.5rem 0.4rem; border-radius: 10px;
    border: 1.5px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"};
    background: transparent; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem; font-weight: 500;
    color: ${dark ? "#a09890" : "#6b6460"};
    transition: all 0.2s; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 0.25rem;
  }
  .tc-goal-btn.selected {
    border-color: ${dark ? "#f0c060" : "#c47c2b"};
    background: ${dark ? "rgba(240,192,96,0.1)" : "rgba(196,124,43,0.08)"};
    color: ${dark ? "#f0c060" : "#c47c2b"};
  }
  .tc-goal-icon { font-size: 1.3rem; }

  .tc-submit-btn {
    width: 100%; padding: 0.85rem;
    margin-top: 1rem;
    border-radius: 12px; border: none; cursor: pointer;
    background: ${dark ? "#f0c060" : "#c47c2b"};
    color: ${dark ? "#1a1816" : "#fff"};
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem; font-weight: 600;
    transition: all 0.2s; letter-spacing: 0.01em;
  }
  .tc-submit-btn:hover:not(:disabled) { transform: translateY(-2px); opacity: 0.92; }
  .tc-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  /* RESULT PAGE */
  .tc-result { max-width: 1200px; margin: 0 auto; padding: 2rem; }
  .tc-back-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.5rem 1rem; border-radius: 8px;
    border: 1px solid ${dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"};
    background: transparent; cursor: pointer;
    color: ${dark ? "#a09890" : "#6b6460"};
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    transition: all 0.2s; margin-bottom: 1.5rem;
  }
  .tc-back-btn:hover { color: ${dark ? "#e8e4dd" : "#1a1816"}; }

  .tc-section { margin-bottom: 3rem; }
  .tc-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem; font-weight: 700;
    margin-bottom: 1.25rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .tc-section-icon { font-size: 1.2rem; }

  /* CITY HERO */
  .tc-city-hero {
    border-radius: 20px; overflow: hidden;
    position: relative; height: 280px; margin-bottom: 2rem;
  }
  .tc-city-hero img {
    width: 100%; height: 100%; object-fit: cover;
  }
  .tc-city-hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%);
    display: flex; align-items: flex-end; padding: 2rem;
  }
  .tc-city-name {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem; font-weight: 700; color: #fff;
  }
  .tc-country-badge {
    display: inline-block; padding: 0.3rem 0.75rem;
    background: rgba(240,192,96,0.9); border-radius: 6px;
    font-size: 0.85rem; font-weight: 600; color: #1a1816;
    margin-left: 1rem; vertical-align: middle;
  }

  /* INFO GRID */
  .tc-info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
  .tc-info-card {
    background: ${dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.8)"};
    border: 1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"};
    border-radius: 14px; padding: 1.1rem;
    display: flex; flex-direction: column; gap: 0.3rem;
  }
  .tc-info-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; color: ${dark ? "#807870" : "#9b8f89"}; }
  .tc-info-value { font-size: 1.05rem; font-weight: 600; color: ${dark ? "#e8e4dd" : "#1a1816"}; }
  .tc-city-desc {
    font-size: 1rem; line-height: 1.7;
    color: ${dark ? "#a09890" : "#6b6460"};
    padding: 1.25rem;
    background: ${dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"};
    border-radius: 14px;
    border-left: 3px solid ${dark ? "#f0c060" : "#c47c2b"};
  }

  /* WEATHER */
  .tc-weather-card {
    background: ${dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.8)"};
    border: 1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"};
    border-radius: 20px; padding: 1.5rem;
  }
  .tc-weather-main { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.5rem; }
  .tc-weather-temp {
    font-family: 'Playfair Display', serif;
    font-size: 3.5rem; font-weight: 700;
    color: ${dark ? "#f0c060" : "#c47c2b"};
  }
  .tc-weather-info h3 { font-size: 1.1rem; font-weight: 600; }
  .tc-weather-info p { font-size: 0.9rem; color: ${dark ? "#a09890" : "#6b6460"}; }
  .tc-forecast { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.5rem; }
  .tc-forecast-day {
    text-align: center; padding: 0.75rem 0.5rem;
    background: ${dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"};
    border-radius: 12px;
  }
  .tc-forecast-name { font-size: 0.75rem; color: ${dark ? "#807870" : "#9b8f89"}; margin-bottom: 0.4rem; }
  .tc-forecast-icon { font-size: 1.4rem; margin-bottom: 0.3rem; }
  .tc-forecast-temps { font-size: 0.85rem; font-weight: 500; }
  .tc-forecast-lo { color: ${dark ? "#807870" : "#9b8f89"}; font-weight: 400; }

  /* BUDGET */
  .tc-budget-card {
    background: ${dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.8)"};
    border: 1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"};
    border-radius: 20px; padding: 1.75rem;
  }
  .tc-budget-items { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
  @media (max-width: 500px) { .tc-budget-items { grid-template-columns: 1fr; } }
  .tc-budget-item {
    display: flex; align-items: center; gap: 1rem;
    padding: 1rem; border-radius: 12px;
    background: ${dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"};
  }
  .tc-budget-icon-wrap {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem; flex-shrink: 0;
  }
  .tc-budget-item-label { font-size: 0.85rem; color: ${dark ? "#807870" : "#9b8f89"}; }
  .tc-budget-item-val { font-size: 1.1rem; font-weight: 600; }
  .tc-budget-total {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.25rem; border-radius: 14px;
    background: ${dark ? "rgba(240,192,96,0.1)" : "rgba(196,124,43,0.08)"};
    border: 1.5px solid ${dark ? "rgba(240,192,96,0.3)" : "rgba(196,124,43,0.2)"};
  }
  .tc-budget-total-label { font-size: 0.9rem; color: ${dark ? "#a09890" : "#6b6460"}; }
  .tc-budget-total-val {
    font-family: 'Playfair Display', serif;
    font-size: 1.75rem; font-weight: 700;
    color: ${dark ? "#f0c060" : "#c47c2b"};
  }

  /* CARDS GRID */
  .tc-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }
  .tc-card {
    background: ${dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.8)"};
    border: 1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"};
    border-radius: 16px; overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .tc-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px ${dark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.12)"}; }
  .tc-card-img {
    width: 100%; height: 200px; object-fit: cover;
    background: ${dark ? "#2a2520" : "#e8e0d8"};
  }
  .tc-card-img-placeholder {
    width: 100%; height: 200px;
    background: ${dark ? "#2a2520" : "#e8e0d8"};
    display: flex; align-items: center; justify-content: center;
    font-size: 2.5rem; color: ${dark ? "#50473e" : "#c0b8b0"};
  }
  .tc-card-body { padding: 1.1rem; }
  .tc-card-title { font-weight: 600; font-size: 1rem; margin-bottom: 0.3rem; }
  .tc-card-sub { font-size: 0.85rem; color: ${dark ? "#807870" : "#9b8f89"}; margin-bottom: 0.5rem; }
  .tc-card-desc { font-size: 0.875rem; line-height: 1.55; color: ${dark ? "#a09890" : "#6b6460"}; margin-bottom: 0.8rem; }
  .tc-card-footer { display: flex; align-items: center; justify-content: space-between; }
  .tc-rating { display: flex; align-items: center; gap: 0.3rem; font-size: 0.875rem; font-weight: 600; }
  .tc-rating-stars { color: #f0c060; }
  .tc-card-btn {
    padding: 0.4rem 0.9rem; border-radius: 8px;
    border: 1px solid ${dark ? "rgba(240,192,96,0.4)" : "rgba(196,124,43,0.4)"};
    background: transparent; cursor: pointer;
    color: ${dark ? "#f0c060" : "#c47c2b"};
    font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 500;
    transition: all 0.2s; text-decoration: none; display: inline-block;
  }
  .tc-card-btn:hover {
    background: ${dark ? "rgba(240,192,96,0.1)" : "rgba(196,124,43,0.08)"};
  }
  .tc-price-badge {
    display: inline-block; padding: 0.25rem 0.6rem;
    background: ${dark ? "rgba(240,192,96,0.15)" : "rgba(196,124,43,0.1)"};
    border-radius: 6px; font-size: 0.85rem; font-weight: 600;
    color: ${dark ? "#f0c060" : "#c47c2b"};
  }

  /* SCHEDULE */
  .tc-schedule { }
  .tc-day { margin-bottom: 1.5rem; }
  .tc-day-header {
    display: flex; align-items: center; gap: 0.75rem;
    margin-bottom: 0.75rem;
  }
  .tc-day-num {
    width: 36px; height: 36px; border-radius: 10px;
    background: ${dark ? "#f0c060" : "#c47c2b"};
    color: ${dark ? "#1a1816" : "#fff"};
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 0.9rem; flex-shrink: 0;
  }
  .tc-day-title { font-weight: 600; font-size: 1rem; }
  .tc-day-items { padding-left: 2.75rem; display: flex; flex-direction: column; gap: 0.5rem; }
  .tc-day-item {
    padding: 0.65rem 1rem;
    background: ${dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"};
    border-radius: 10px;
    border-left: 3px solid ${dark ? "rgba(240,192,96,0.3)" : "rgba(196,124,43,0.3)"};
    font-size: 0.9rem; line-height: 1.5;
    color: ${dark ? "#c8c0b8" : "#4a4440"};
  }

  /* MAP */
  .tc-map-placeholder {
    height: 420px; border-radius: 20px;
    background: ${dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)"};
    border: 1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"};
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 1rem; overflow: hidden; position: relative;
  }
  .tc-map-iframe { width: 100%; height: 100%; border: none; border-radius: 20px; }

  /* FAVORITES */
  .tc-favs { max-width: 1200px; margin: 0 auto; padding: 2rem; }
  .tc-favs-hero {
    padding: 2rem 0 2.5rem;
    border-bottom: 1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"};
    margin-bottom: 2rem;
  }
  .tc-favs-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;
  }
  .tc-favs-hero p { color: ${dark ? "#a09890" : "#6b6460"}; }
  .tc-fav-card {
    background: ${dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.8)"};
    border: 1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"};
    border-radius: 16px; padding: 1.25rem;
    display: flex; align-items: center; gap: 1.25rem;
    transition: all 0.2s; cursor: pointer;
  }
  .tc-fav-card:hover { transform: translateX(4px); }
  .tc-fav-icon {
    width: 56px; height: 56px; border-radius: 14px;
    background: ${dark ? "rgba(240,192,96,0.1)" : "rgba(196,124,43,0.08)"};
    display: flex; align-items: center; justify-content: center;
    font-size: 1.75rem; flex-shrink: 0;
  }
  .tc-fav-info h3 { font-weight: 600; margin-bottom: 0.2rem; }
  .tc-fav-info p { font-size: 0.85rem; color: ${dark ? "#807870" : "#9b8f89"}; }
  .tc-fav-actions { margin-left: auto; display: flex; gap: 0.5rem; }
  .tc-fav-del {
    padding: 0.4rem 0.75rem; border-radius: 8px;
    border: 1px solid ${dark ? "rgba(255,100,100,0.3)" : "rgba(200,50,50,0.2)"};
    background: transparent; cursor: pointer;
    color: ${dark ? "#ff8080" : "#cc3333"};
    font-size: 0.8rem; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .tc-fav-del:hover { background: ${dark ? "rgba(255,100,100,0.1)" : "rgba(200,50,50,0.06)"}; }
  .tc-save-btn {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.5rem 1.1rem; border-radius: 10px;
    border: 1.5px solid ${dark ? "rgba(240,192,96,0.4)" : "rgba(196,124,43,0.4)"};
    background: transparent; cursor: pointer;
    color: ${dark ? "#f0c060" : "#c47c2b"};
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 500;
    transition: all 0.2s;
  }
  .tc-save-btn.saved {
    background: ${dark ? "rgba(240,192,96,0.15)" : "rgba(196,124,43,0.1)"};
  }

  /* SKELETON */
  .tc-skeleton {
    background: ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"};
    border-radius: 8px;
    animation: tc-pulse 1.5s ease-in-out infinite;
  }
  @keyframes tc-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  /* 404 */
  .tc-404 {
    min-height: calc(100vh - 64px);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; padding: 2rem;
  }
  .tc-404-num {
    font-family: 'Playfair Display', serif;
    font-size: 8rem; font-weight: 700;
    color: ${dark ? "#f0c060" : "#c47c2b"};
    line-height: 1;
  }
  .tc-404 h2 { font-size: 1.5rem; margin: 1rem 0 0.5rem; }
  .tc-404 p { color: ${dark ? "#807870" : "#9b8f89"}; margin-bottom: 1.5rem; }

  /* LOADING */
  .tc-loading {
    min-height: calc(100vh - 64px);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 1rem;
  }
  .tc-spinner {
    width: 48px; height: 48px; border-radius: 50%;
    border: 3px solid ${dark ? "rgba(240,192,96,0.2)" : "rgba(196,124,43,0.2)"};
    border-top-color: ${dark ? "#f0c060" : "#c47c2b"};
    animation: tc-spin 0.8s linear infinite;
  }
  @keyframes tc-spin { to { transform: rotate(360deg); } }
  .tc-loading-text { color: ${dark ? "#807870" : "#9b8f89"}; font-size: 0.9rem; }
  .tc-loading h2 {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
  }

  /* ANIMATE IN */
  @keyframes tc-fade-up {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .tc-fade-up { animation: tc-fade-up 0.5s ease forwards; }
  .tc-fade-up-1 { animation-delay: 0.05s; opacity: 0; }
  .tc-fade-up-2 { animation-delay: 0.15s; opacity: 0; }
  .tc-fade-up-3 { animation-delay: 0.25s; opacity: 0; }

  /* EMPTY */
  .tc-empty {
    text-align: center; padding: 4rem 2rem;
    color: ${dark ? "#807870" : "#9b8f89"};
  }
  .tc-empty-icon { font-size: 3rem; margin-bottom: 1rem; }
  .tc-empty h3 { font-size: 1.2rem; margin-bottom: 0.5rem; color: ${dark ? "#a09890" : "#6b6460"}; }

  /* FAV GRID */
  .tc-fav-grid { display: flex; flex-direction: column; gap: 0.75rem; }

  /* TOAST */
  .tc-toast {
    position: fixed; bottom: 2rem; right: 2rem;
    padding: 0.75rem 1.25rem; border-radius: 12px;
    background: ${dark ? "#f0c060" : "#c47c2b"};
    color: ${dark ? "#1a1816" : "#fff"};
    font-weight: 500; font-size: 0.9rem;
    z-index: 999; animation: tc-toast-in 0.3s ease;
    pointer-events: none;
  }
  @keyframes tc-toast-in {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const weatherIcon = (icon) => {
  const map = { sun: "☀️", cloud: "☁️", rain: "🌧️", snow: "❄️", "partly-cloudy": "⛅" };
  return map[icon] || "🌤️";
};

const budgetColor = (key) => {
  const map = { accommodation: "#c47c2b", food: "#2b7cc4", transport: "#2bc47c", entertainment: "#c42b7c" };
  return map[key] || "#888";
};

const budgetEmoji = { accommodation: "🏨", food: "🍽️", transport: "🚌", entertainment: "🎭" };
const goalEmoji = { Sightseeing: "🏛️", Food: "🍜", Shopping: "🛍️", Nature: "🌿", Relaxation: "🧘", Sports: "⚽" };

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="tc-rating">
      <span className="tc-rating-stars">
        {"★".repeat(full)}{half ? "½" : ""}{"☆".repeat(5 - full - (half ? 1 : 0))}
      </span>
      {rating.toFixed(1)}
    </span>
  );
}

const PEXELS_KEY = import.meta.env.VITE_PEXELS_KEY || "";
const pexelsCache = {};

async function fetchPexelsImg(query) {
  if (pexelsCache[query]) return pexelsCache[query];
  try {
    const res = await fetch(
      "https://api.pexels.com/v1/search?query=" + encodeURIComponent(query) + "&per_page=1&orientation=landscape",
      { headers: { Authorization: PEXELS_KEY } }
    );
    const data = await res.json();
    const url = data.photos?.[0]?.src?.large || null;
    pexelsCache[query] = url;
    return url;
  } catch { return null; }
}

function UnsplashImg({ keyword, className, style, alt, fallback }) {
  const [src, setSrc] = useState(null);
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); setErr(false); setSrc(null);
    fetchPexelsImg(keyword || "travel").then(url => {
      setSrc(url);
      setLoading(false);
    });
  }, [keyword]);

  if (loading) return (
    <div className={className || "tc-card-img-placeholder"} style={{...style, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2rem"}}>⏳</div>
  );
  if (err || !src) return (
    <div className={className || "tc-card-img-placeholder"} style={style}>{fallback || "🌍"}</div>
  );
  return (
    <img src={src} className={className} style={style} alt={alt || keyword} onError={() => setErr(true)} />
  );
}

function Toast({ msg }) {
  if (!msg) return null;
  return <div className="tc-toast">{msg}</div>;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonResult() {
  return (
    <div className="tc-result">
      <div className="tc-skeleton" style={{ width: 120, height: 36, marginBottom: 24 }} />
      <div className="tc-skeleton" style={{ width: "100%", height: 280, borderRadius: 20, marginBottom: 24 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[1,2,3,4,5,6].map(i => <div key={i} className="tc-skeleton" style={{ height: 80, borderRadius: 14 }} />)}
      </div>
      <div className="tc-skeleton" style={{ height: 200, borderRadius: 20, marginBottom: 24 }} />
      <div className="tc-skeleton" style={{ height: 180, borderRadius: 20, marginBottom: 24 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {[1,2,3].map(i => <div key={i} className="tc-skeleton" style={{ height: 320, borderRadius: 16 }} />)}
      </div>
    </div>
  );
}

// ─── Pages ───────────────────────────────────────────────────────────────────
function HomePage({ onSubmit }) {
  const { dark } = useContext(ThemeCtx);
  const { t, lang } = useContext(LangCtx);
  const [form, setForm] = useState({
    country: "", city: "", days: "5", budget: "Standard", goal: "Sightseeing"
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const goals = [
    { key: "Sightseeing", label: t.sightseeing || "Sightseeing" },
    { key: "Food", label: t.food || "Food" },
    { key: "Shopping", label: t.shopping || "Shopping" },
    { key: "Nature", label: t.nature || "Nature" },
    { key: "Relaxation", label: t.relaxation || "Relaxation" },
    { key: "Sports", label: t.sports || "Sports" },
  ];
  const budgets = [
    { key: "Economy", label: lang === "ru" ? "Эконом" : "Economy", icon: "💰" },
    { key: "Standard", label: lang === "ru" ? "Стандарт" : "Standard", icon: "💳" },
    { key: "Premium", label: lang === "ru" ? "Премиум" : "Premium", icon: "💎" },
  ];

  const handleSubmit = () => {
    if (!form.country || !form.city) return;
    onSubmit(form);
  };

  return (
    <div className="tc-hero">
      <div className="tc-hero-bg" />
      <div className="tc-hero-content">
        <div className="tc-hero-text tc-fade-up tc-fade-up-1">
          <h1>{t.heroTitle} <em>{t.heroTitleEm}</em> {t.heroTitleEnd}</h1>
          <p>{t.heroDesc}</p>
          <div className="tc-stats">
            <div className="tc-stat">
              <div className="tc-stat-num">50K+</div>
              <div className="tc-stat-label">{t.tripsPlanned}</div>
            </div>
            <div className="tc-stat">
              <div className="tc-stat-num">120+</div>
              <div className="tc-stat-label">{t.countries}</div>
            </div>
            <div className="tc-stat">
              <div className="tc-stat-num">4.9★</div>
              <div className="tc-stat-label">{t.rating}</div>
            </div>
          </div>
        </div>

        <div className="tc-form-card tc-fade-up tc-fade-up-2">
          <div className="tc-form-title">{t.planTrip}</div>
          <div className="tc-form-grid">
            <div className="tc-field">
              <label className="tc-label">{t.country}</label>
              <input className="tc-input" placeholder={t.countryLabel} value={form.country} onChange={e => set("country", e.target.value)} />
            </div>
            <div className="tc-field">
              <label className="tc-label">{t.city}</label>
              <input className="tc-input" placeholder={t.cityLabel} value={form.city} onChange={e => set("city", e.target.value)} />
            </div>
            <div className="tc-field full">
              <label className="tc-label">{t.duration}</label>
              <input className="tc-input" type="number" min="1" max="30" value={form.days} onChange={e => set("days", e.target.value)} />
            </div>
            <div className="tc-field full">
              <label className="tc-label">{t.budgetLevel}</label>
              <div className="tc-budget-grid">
                {budgets.map(b => (
                  <button key={b.key} className={`tc-budget-btn ${form.budget === b.key ? "selected" : ""}`} onClick={() => set("budget", b.key)}>
                    {b.icon} {b.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="tc-field full">
              <label className="tc-label">{t.tripGoal}</label>
              <div className="tc-goals-grid">
                {goals.map(g => (
                  <button key={g.key} className={`tc-goal-btn ${form.goal === g.key ? "selected" : ""}`} onClick={() => set("goal", g.key)}>
                    <span className="tc-goal-icon">{goalEmoji[g.key]}</span>
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button
            className="tc-submit-btn"
            onClick={handleSubmit}
            disabled={!form.country || !form.city}
          >
            {t.createPlan}
          </button>
        </div>
      </div>
    </div>
  );
}

function ResultPage({ plan, formData, onBack }) {
  const { dark } = useContext(ThemeCtx);
  const { add, remove, has } = useContext(FavCtx);
  const { t } = useContext(LangCtx);
  const [toast, setToast] = useState("");

  const isFav = has(plan.id);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const toggleFav = () => {
    if (isFav) { remove(plan.id); showToast("Removed from favorites"); }
    else { add(plan); showToast("Saved to favorites! ⭐"); }
  };

  const { cityInfo, weather, budget, attractions, hotels, restaurants, schedule } = plan;
  const totalBudget = budget.accommodation + budget.food + budget.transport + budget.entertainment;
  const mapQuery = encodeURIComponent(`${cityInfo.city}, ${cityInfo.country}`);
  const mapSrc = `https://maps.google.com/maps?q=${mapQuery}&output=embed&z=12`;

  return (
    <div className="tc-result">
      <Toast msg={toast} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <button className="tc-back-btn" onClick={onBack}>{t.backToPlanner}</button>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button className={`tc-save-btn ${isFav ? "saved" : ""}`} onClick={toggleFav}>
            {isFav ? t.saved : t.saveTrip}
          </button>
        </div>
      </div>

      {/* CITY HERO */}
      <div className="tc-city-hero tc-fade-up">
        <UnsplashImg keyword={cityInfo.imageKeyword || `${cityInfo.city} city`} className="tc-card-img" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={cityInfo.city} />
        <div className="tc-city-hero-overlay">
          <div>
            <span className="tc-city-name">{cityInfo.city}</span>
            <span className="tc-country-badge">{cityInfo.country}</span>
          </div>
        </div>
      </div>

      {/* CITY INFO */}
      <div className="tc-section tc-fade-up tc-fade-up-1">
        <div className="tc-section-title"><span className="tc-section-icon">🌍</span> {t.destinationInfo}</div>
        <div className="tc-info-grid">
          <div className="tc-info-card"><span className="tc-info-label">{t.currency}</span><span className="tc-info-value">{cityInfo.currency}</span></div>
          <div className="tc-info-card"><span className="tc-info-label">{t.language}</span><span className="tc-info-value">{cityInfo.language}</span></div>
          <div className="tc-info-card"><span className="tc-info-label">{t.population}</span><span className="tc-info-value">{cityInfo.population}</span></div>
          <div className="tc-info-card"><span className="tc-info-label">{t.timezone}</span><span className="tc-info-value">{cityInfo.timezone}</span></div>
          <div className="tc-info-card"><span className="tc-info-label">{t.duration}</span><span className="tc-info-value">{formData.days} {t.days}</span></div>
          <div className="tc-info-card"><span className="tc-info-label">{t.budgetLevel}</span><span className="tc-info-value">{formData.budget}</span></div>
        </div>
        <div className="tc-city-desc">{cityInfo.description}</div>
      </div>

      {/* WEATHER */}
      <div className="tc-section tc-fade-up tc-fade-up-2">
        <div className="tc-section-title"><span className="tc-section-icon">🌤️</span> {t.weather}</div>
        <div className="tc-weather-card">
          <div className="tc-weather-main">
            <div className="tc-weather-temp">{weather.temp}°C</div>
            <div className="tc-weather-info">
              <h3>{weather.condition}</h3>
              <p>{t.humidity}: {weather.humidity}%</p>
            </div>
          </div>
          <div className="tc-forecast">
            {weather.forecast.map((d, i) => (
              <div key={i} className="tc-forecast-day">
                <div className="tc-forecast-name">{d.day}</div>
                <div className="tc-forecast-icon">{weatherIcon(d.icon)}</div>
                <div className="tc-forecast-temps">{d.high}° <span className="tc-forecast-lo">{d.low}°</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BUDGET */}
      <div className="tc-section">
        <div className="tc-section-title"><span className="tc-section-icon">💰</span> {t.budgetBreakdown}</div>
        <div className="tc-budget-card">
          <div className="tc-budget-items">
            {Object.entries(budgetEmoji).map(([key, emoji]) => (
              <div key={key} className="tc-budget-item">
                <div className="tc-budget-icon-wrap" style={{ background: budgetColor(key) + "22" }}>
                  <span>{emoji}</span>
                </div>
                <div>
                  <div className="tc-budget-item-label">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                  <div className="tc-budget-item-val">{budget.currency} {budget[key]?.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="tc-budget-total">
            <div>
              <div className="tc-budget-total-label">{t.totalCost}</div>
              <div style={{ fontSize: "0.8rem", color: dark ? "#807870" : "#9b8f89" }}>For {formData.days} {t.days} · {formData.budget}</div>
            </div>
            <div>
              <div className="tc-budget-total-val">{budget.currency} {totalBudget.toLocaleString()}</div>
              <div style={{fontSize:"0.85rem", color: dark ? "#a09890" : "#6b6460", marginTop:"0.25rem"}}>
                ≈ ${toUSD(totalBudget, budget.currency).toLocaleString()} USD
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ATTRACTIONS */}
      <div className="tc-section">
        <div className="tc-section-title"><span className="tc-section-icon">🏛️</span> {t.topAttractions}</div>
        <div className="tc-cards-grid">
          {attractions.map((a, i) => (
            <div key={i} className="tc-card">
              <UnsplashImg keyword={a.imageKeyword || a.name} className="tc-card-img" alt={a.name} fallback="🏛️" />
              <div className="tc-card-body">
                <div className="tc-card-title">{a.name}</div>
                <div className="tc-card-sub">{a.category}</div>
                <div className="tc-card-desc">{a.description}</div>
                <div className="tc-card-footer">
                  <StarRating rating={a.rating} />
                  <a className="tc-card-btn" href={a.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(a.name + " " + cityInfo.city)}`} target="_blank" rel="noopener noreferrer">{t.viewOnMap}</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HOTELS */}
      <div className="tc-section">
        <div className="tc-section-title"><span className="tc-section-icon">🏨</span> {t.recommendedHotels}</div>
        <div className="tc-cards-grid">
          {hotels.map((h, i) => (
            <div key={i} className="tc-card">
              <UnsplashImg keyword={h.imageKeyword || `${h.name} hotel`} className="tc-card-img" alt={h.name} fallback="🏨" />
              <div className="tc-card-body">
                <div className="tc-card-title">{h.name}</div>
                <div className="tc-card-sub">📍 {h.address}</div>
                <div className="tc-card-desc">{h.description}</div>
                <div className="tc-card-footer">
                  <StarRating rating={h.rating} />
                  <span className="tc-price-badge">{budget.currency} {h.pricePerNight}{t.perNight}</span>
                </div>
                <div style={{ marginTop: "0.75rem" }}>
                  <a className="tc-card-btn" href={h.website} target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center" }}>{t.visitWebsite}</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RESTAURANTS */}
      <div className="tc-section">
        <div className="tc-section-title"><span className="tc-section-icon">🍽️</span> {t.recommendedRestaurants}</div>
        <div className="tc-cards-grid">
          {restaurants.map((r, i) => (
            <div key={i} className="tc-card">
              <UnsplashImg keyword={r.imageKeyword || `${r.cuisine} restaurant`} className="tc-card-img" alt={r.name} fallback="🍽️" />
              <div className="tc-card-body">
                <div className="tc-card-title">{r.name}</div>
                <div className="tc-card-sub">🍴 {r.cuisine} · 📍 {r.address}</div>
                <div className="tc-card-footer" style={{ marginBottom: "0.75rem" }}>
                  <StarRating rating={r.rating} />
                  <span className="tc-price-badge">Avg {budget.currency} {r.avgCheck}</span>
                </div>
                <a className="tc-card-btn" href={r.website} target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center" }}>{t.visitWebsite}</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAP */}
      <div className="tc-section">
        <div className="tc-section-title"><span className="tc-section-icon">🗺️</span> {t.interactiveMap}</div>
        <div className="tc-map-placeholder">
          <iframe
            className="tc-map-iframe"
            src={mapSrc}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map of ${cityInfo.city}`}
          />
        </div>
      </div>

      {/* SCHEDULE */}
      <div className="tc-section">
        <div className="tc-section-title"><span className="tc-section-icon">📅</span> {t.travelSchedule}</div>
        <div className="tc-schedule">
          {schedule.map((day, i) => (
            <div key={i} className="tc-day">
              <div className="tc-day-header">
                <div className="tc-day-num">{day.day}</div>
                <div className="tc-day-title">{t.dayNum} {day.day}</div>
              </div>
              <div className="tc-day-items">
                {day.items.map((item, j) => (
                  <div key={j} className="tc-day-item">⏱ {item}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FavoritesPage({ onLoadPlan }) {
  const { dark } = useContext(ThemeCtx);
  const { favs, remove } = useContext(FavCtx);
  const { t } = useContext(LangCtx);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  return (
    <div className="tc-favs">
      <Toast msg={toast} />
      <div className="tc-favs-hero tc-fade-up">
        <h1>⭐ Saved Trips</h1>
        <p>{favs.length} trip{favs.length !== 1 ? "s" : ""} saved to your collection</p>
      </div>
      {favs.length === 0 ? (
        <div className="tc-empty tc-fade-up tc-fade-up-1">
          <div className="tc-empty-icon">✈️</div>
          <h3>{t.noSavedTrips}</h3>
          <p>{t.planATrip}</p>
        </div>
      ) : (
        <div className="tc-fav-grid tc-fade-up tc-fade-up-1">
          {favs.map((plan) => (
            <div key={plan.id} className="tc-fav-card" onClick={() => onLoadPlan(plan)}>
              <div className="tc-fav-icon">🌍</div>
              <div className="tc-fav-info">
                <h3>{plan.cityInfo?.city}, {plan.cityInfo?.country}</h3>
                <p>{plan.formData?.days} days · {plan.formData?.budget} · {plan.formData?.goal}</p>
              </div>
              <div className="tc-fav-actions" onClick={e => e.stopPropagation()}>
                <button className="tc-fav-del" onClick={() => { remove(plan.id); showToast("Removed"); }}>Remove</button>
                <button className="tc-card-btn" onClick={() => onLoadPlan(plan)}>View →</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NotFoundPage({ onHome }) {
  return (
    <div className="tc-404">
      <div className="tc-404-num">404</div>
      <h2>Page not found</h2>
      <p>The destination you're looking for doesn't exist.</p>
      <button className="tc-submit-btn" style={{ width: "auto", padding: "0.7rem 2rem" }} onClick={onHome}>Go Home</button>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home"); // home | result | favorites | 404
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [formData, setFormData] = useState(null);

  return (
    <ThemeProvider>
      <LangProvider>
      <FavProvider>
        <AppInner
          page={page} setPage={setPage}
          loading={loading} setLoading={setLoading}
          plan={plan} setPlan={setPlan}
          formData={formData} setFormData={setFormData}
        />
      </FavProvider>
      </LangProvider>
    </ThemeProvider>
  );
}

function AppInner({ page, setPage, loading, setLoading, plan, setPlan, formData, setFormData }) {
  const { dark, toggle } = useContext(ThemeCtx);
  const { lang, toggleLang, t } = useContext(LangCtx);

  // Inject global styles
  useEffect(() => {
    let styleEl = document.getElementById("tc-styles");
    if (!styleEl) { styleEl = document.createElement("style"); styleEl.id = "tc-styles"; document.head.appendChild(styleEl); }
    styleEl.textContent = getStyles(dark);
  }, [dark]);

  const handleSubmit = async (fd) => {
    setFormData(fd);
    setLoading(true);
    setPage("result");
    try {
      const data = await generateTravelPlan(fd);
      data.id = `${fd.city}-${fd.country}-${Date.now()}`;
      data.formData = fd;
      setPlan(data);
    } catch (err) {
      console.error(err);
      setPage("home");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadFav = (savedPlan) => {
    setPlan(savedPlan);
    setFormData(savedPlan.formData);
    setPage("result");
  };

  return (
    <div className="tc-app">
      <nav className="tc-nav">
        <div className="tc-logo" onClick={() => { setPage("home"); setPlan(null); }}>
          Trip<span>Craft</span>
        </div>
        <div className="tc-nav-links">
          <button className={`tc-nav-btn ${page === "home" ? "active" : ""}`} onClick={() => { setPage("home"); setPlan(null); }}>{t.home}</button>
          <button className={`tc-nav-btn ${page === "favorites" ? "active" : ""}`} onClick={() => setPage("favorites")}>{t.favorites}</button>
          <button className={`tc-nav-btn ${lang === "en" ? "active" : ""}`} onClick={() => { if(lang !== "en") toggleLang(); }} style={{fontWeight:600,minWidth:"36px"}}>EN</button>
          <button className={`tc-nav-btn ${lang === "ru" ? "active" : ""}`} onClick={() => { if(lang !== "ru") toggleLang(); }} style={{fontWeight:600,minWidth:"36px"}}>RU</button>
          <button className="tc-theme-btn" onClick={toggle} aria-label="Toggle theme">{dark ? "☀️" : "🌙"}</button>
        </div>
      </nav>

      {page === "home" && <HomePage onSubmit={handleSubmit} />}
      
      {page === "result" && loading && (
        <div className="tc-loading">
          <div className="tc-spinner" />
          <h2>{t.crafting}</h2>
          <p className="tc-loading-text">{t.analyzing}</p>
        </div>
      )}
      {page === "result" && !loading && !plan && <SkeletonResult />}
      {page === "result" && !loading && plan && (
        <ResultPage plan={plan} formData={formData} onBack={() => { setPage("home"); setPlan(null); }} />
      )}

      {page === "favorites" && <FavoritesPage onLoadPlan={handleLoadFav} />}
      {page === "404" && <NotFoundPage onHome={() => setPage("home")} />}
    </div>
  );
}
