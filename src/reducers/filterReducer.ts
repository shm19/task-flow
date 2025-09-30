export interface FilterState {
  priority: string;
  storyPoint: number;
  titleSearch: string;
}

interface SetPriorityAction {
  type: "SET_PRIORITY";
  payload: string;
}

interface SetStoryPointAction {
  type: "SET_STORY_POINT";
  payload: number;
}

interface SetTitleSearchAction {
  type: "SET_TITLE_SEARCH";
  payload: string;
}

export type FilterAction = SetPriorityAction | SetStoryPointAction | SetTitleSearchAction;

export const initialFilterState: FilterState = {
  priority: "All",
  storyPoint: 0,
  titleSearch: "",
};

const filterReducer = (state: FilterState, action: FilterAction) => {
  switch (action.type) {
    case "SET_PRIORITY":
      return { ...state, priority: action.payload };
    case "SET_STORY_POINT":
      return { ...state, storyPoint: action.payload };
    case "SET_TITLE_SEARCH":
      return { ...state, titleSearch: action.payload };
    default:
      return state;
  }
}

export default filterReducer;