import { Badge, Box, Card, HStack, Text, VStack } from "@chakra-ui/react";
import { Column, Task } from "./Board";
import TaskCard from "./TaskCard";
import NewTaskModal from "./NewTaskModal";
import { createPortal } from "react-dom";

interface ColumnProps {
  column: Column;
  tasks: Task[];
  changeTaskPriority: (taskId: number) => void;
  changeTaskStoryPoints: (taskId: number, storyPoints: number) => void;
  changeColumn: (taskId: number, columnId: number) => void;
  getColumnTitle: (columnId: number) => string;
  isNewTaskModalOpen: boolean;
  setIsNewTaskModalOpen: (isNewTaskModalOpen: boolean) => void;
  handleNewTask: (task: Task, status: string) => void;
}

function BoardColumn({ column, tasks, changeTaskPriority, changeTaskStoryPoints, changeColumn, getColumnTitle, isNewTaskModalOpen, setIsNewTaskModalOpen, handleNewTask }: ColumnProps) {
  const tasksInColumn = tasks.filter((task) => task.columnId === +column.id);

  
  return (
    <>
    <VStack>
      <Card.Root w="100%" h="100%">
        <Card.Header>
          <Box display="flex" borderBottom="1px solid gray" pb={2}>
          <Text fontSize="lg" fontWeight="bold" mr={4}>
            {column.title}
          </Text>
          <Badge size="sm" bgColor='gray.500' color='white'>{tasksInColumn.length} tasks</Badge>
          </Box>
        </Card.Header>
        {tasksInColumn.map((task) => (
          <TaskCard key={task.id} task={task} changeTaskPriority={changeTaskPriority} changeTaskStoryPoints={changeTaskStoryPoints} changeColumn={changeColumn} getColumnTitle={getColumnTitle} />
        ))}
      </Card.Root>
    </VStack>
    {createPortal(<NewTaskModal isNewTaskModalOpen={isNewTaskModalOpen} onClose={setIsNewTaskModalOpen} handleNewTask={handleNewTask} />, document.getElementById("modal-root") as HTMLElement)}
    </>
  );
}

export default BoardColumn;
