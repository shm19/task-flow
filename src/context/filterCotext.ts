import { createContext, Dispatch } from "react";
import { FilterAction, FilterState } from "../reducers/filterReducer";

interface FilterContextType {
  FilterState: FilterState;
  dispatch: Dispatch<FilterAction>;
}

const FilterContext = createContext<FilterContextType>({} as FilterContextType);

export default FilterContext;
