import { Badge, Box, Card, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import TaskCard from "./TaskCard";
import NewTaskModal from "./NewTaskModal";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import client from "../client";
import { Task } from "../interfaces/Task.interface";
import { useContext } from "react";
import FilterContext from "../context/filterCotext";

interface ColumnProps {
  columnId: number;
  isNewTaskModalOpen: boolean;
  setIsNewTaskModalOpen: (isNewTaskModalOpen: boolean) => void;
}

function BoardColumn({ columnId, isNewTaskModalOpen, setIsNewTaskModalOpen }: ColumnProps) {  
  const { FilterState: { priority, storyPoint, titleSearch } } = useContext(FilterContext);
  const { data: tasks , isLoading, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => client.get("tasks").then((res) => res.data),
  });
  
  const { data: column, isLoading: isColumnLoading, isError: isColumnError } = useQuery({
    queryKey: ["columns", columnId],
    queryFn: () => client.get(`columns/${columnId}`).then((res) => res.data),
  });

  
  // @todo: fix loading and error handling 
  if (isLoading || isColumnLoading) return <Spinner />
  if (isError || isColumnError) return <Text color="red.500">Error loading tasks</Text>

  let tasksInColumn = tasks?.filter((task: Task) => task.columnId === +columnId);
  if (priority !== "All") tasksInColumn = tasksInColumn?.filter((task: Task) => task.priority === priority);
  if (storyPoint) tasksInColumn = tasksInColumn?.filter((task: Task) => task.storyPoints === storyPoint);
  if (titleSearch) tasksInColumn = tasksInColumn?.filter((task: Task) => task.title.toLowerCase().includes(titleSearch.toLowerCase()));

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
        {tasksInColumn.map(({id: taskId}: Task) => (
          <TaskCard key={taskId} taskId={taskId}/>
        ))}
      </Card.Root>
    </VStack>
    {createPortal(<NewTaskModal isNewTaskModalOpen={isNewTaskModalOpen} onClose={setIsNewTaskModalOpen} />, document.getElementById("modal-root") as HTMLElement)}
    </>
  );
}

export default BoardColumn;
