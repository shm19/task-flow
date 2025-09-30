import FilterContext from "../context/filterCotext";
import filterReducer, { initialFilterState } from "../reducers/filterReducer";
import { useReducer } from "react";

interface FilterProviderProps {
  children: React.ReactNode;
}

function FilterProvider({ children }: FilterProviderProps) {
  const [{ priority, storyPoint, titleSearch }, dispatch] = useReducer(
    filterReducer,
    initialFilterState,
    undefined
  );

  return (
    <FilterContext.Provider value={{ FilterState: { priority, storyPoint, titleSearch }, dispatch }}>
      {children}
    </FilterContext.Provider>
  );
}

export default FilterProvider;
