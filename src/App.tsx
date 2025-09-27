
import { useState } from 'react';
import Board from './component/Board'
import Navbar from './component/Navbar'

function App() {
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  const toggleNewTaskModal = () => {
    setIsNewTaskModalOpen(prev => !prev);
  }

  return (
  <>
  <Navbar toggleNewTaskModal={toggleNewTaskModal} />
  <Board isNewTaskModalOpen={isNewTaskModalOpen} setIsNewTaskModalOpen={setIsNewTaskModalOpen}/>
  </>
  )
}

export default App
