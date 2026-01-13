import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const CitiesContext = createContext();

// Old BASE_URL for local JSON server
// const BASE_URL = "http://localhost:5000";

// New BASE_URL for static JSON in public folder
const BASE_URL = "";

const InitialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    case "cities/loaded":
      return { ...state, cities: action.payload, isLoading: false };
    case "city/loaded":
      return { ...state, currentCity: action.payload, isLoading: false };
    case "city/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
        currentCity: {},
      };
    default:
      throw new Error("Action type is not supported");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    InitialState
  );

  // Fetch all cities from static JSON
  useEffect(() => {
    async function fetchCities() {
      try {
        dispatch({ type: "loading" });

        // Old fetch for local JSON server
        // const res = await fetch(`${BASE_URL}/cities`);
        // const data = await res.json();

        // New fetch for static JSON in public folder
        const res = await fetch("/data/cities.json");
        const data = await res.json();

        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "Something Wrong with fetching Data",
        });
      }
    }
    fetchCities();
  }, []);

  // Get city by id
  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;

      try {
        dispatch({ type: "loading" });

        // Old fetch for local JSON server
        // const res = await fetch(`${BASE_URL}/cities/${id}`);
        // const data = await res.json();

        // New: fetch static JSON & filter
        const res = await fetch("/data/cities.json");
        const allCities = await res.json();
        const data = allCities.find((city) => city.id === Number(id)) || {};

        dispatch({ type: "city/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "Something Wrong with fetching Data",
        });
      }
    },
    [currentCity.id]
  );

  // Create city (won't persist on Netlify; just updates state)
  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });

      // Old POST to JSON server
      /*
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCity),
      });
      const data = await res.json();
      */

      // New: simulate creation by assigning an ID
      const data = { ...newCity, id: Date.now() };

      dispatch({ type: "city/created", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "Something Wrong with fetching Data",
      });
    }
  }

  // Delete city (won't persist; just updates state)
  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });

      // Old DELETE to JSON server
      // await fetch(`${BASE_URL}/cities/${id}`, { method: "DELETE" });

      // New: simulate deletion
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "Something Wrong with fetching Data",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        getCity,
        currentCity,
        createCity,
        deleteCity,
        error,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);

  if (context === undefined)
    throw new Error("CitiesContext was used outside of CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
