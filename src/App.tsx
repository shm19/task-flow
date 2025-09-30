import { useState, useReducer } from "react";
import filterReducer from "./reducers/filterReducer";
import { initialFilterState } from "./reducers/filterReducer";
import Board from "./component/Board";
import Navbar from "./component/Navbar";
import FilterBar from "./component/FilterBar";
import FilterProvider from "./provider/filterProvider";

function App() {
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  const toggleNewTaskModal = () => {
    setIsNewTaskModalOpen((prev) => !prev);
  };

  return (
    <>
      <FilterProvider>
        <Navbar toggleNewTaskModal={toggleNewTaskModal} />
        <FilterBar />
        <Board
          isNewTaskModalOpen={isNewTaskModalOpen}
          setIsNewTaskModalOpen={setIsNewTaskModalOpen}
        />
      </FilterProvider>
    </>
  );
}

export default App;
