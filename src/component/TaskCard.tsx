import { Badge, Box, Button, Card, Circle, HStack, Input, Menu, Portal, Text } from "@chakra-ui/react";
import { Task } from "./Board";
import { Bs0CircleFill, BsFillCalendar2DateFill } from "react-icons/bs";
import { useState } from "react";
import { Assignee } from "./Board";
import axios from "axios";
import { useEffect } from "react";
import { CONSTANT_STORY_POINTS } from "./Board";

interface TaskCardProps {
  task: Task;
  changeTaskPriority: (taskId: number) => void;
  changeTaskStoryPoints: (taskId: number, storyPoints: number) => void;
  changeColumn: (taskId: number, columnId: number) => void;
  getColumnTitle: (columnId: number) => string;
}

function TaskCard({ task, changeTaskPriority, changeTaskStoryPoints, changeColumn, getColumnTitle }: TaskCardProps) {
  const [assignee, setAssignee] = useState<Assignee | null>(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/assignees/${task.assignId}`).then((res) => {
      setAssignee(res.data);
    });
  }, [task.assignId]);

  function getPriorityColor(priority: string) {
    switch (priority) {
      case "Low":
        return "green.300";
      case "Normal":
        return "yellow.300";
      case "High":
        return "red.300";
      default:
        return "gray.500";
    }
  }
  const handleStoryPointsClick = (storyPoints: number) => {
    changeTaskStoryPoints(task.id, storyPoints);
  }

  const handleDueDateClick = () => {
    task.dueDate = new Date().toISOString();
  }
  
  const handlePriorityClick = () => {
    changeTaskPriority(task.id);
   
  }

  const handleColumnClick = (columnId: number) => {
    changeColumn(task.id, columnId);
  }

  return (
    <Card.Root key={task.id} bgColor="gray.200" m={2} p={2} borderRadius="lg">
      <Card.Header>
        <Text>{task.title}</Text>
      </Card.Header>
      <Card.Body>
        <HStack>
          <Badge cursor="pointer" onClick={() => handlePriorityClick()} bgColor={getPriorityColor(task.priority)}>{task.priority}</Badge>
          <Badge cursor="pointer" onClick={() => handleColumnClick(task.columnId)}>{getColumnTitle(task.columnId)}</Badge>
          <Menu.Root>
          <Menu.Trigger asChild>
          <Circle
            size="20px"
            boxShadow="md"
            aria-label={`Current selection: ${task.storyPoints}`}
            cursor="pointer"
          >
            <Text fontSize="sm" fontWeight="bold">
              {task.storyPoints}
            </Text>
          </Circle>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                {CONSTANT_STORY_POINTS.map((storyPoint) => (
                  <Menu.Item value={storyPoint} onClick={() => handleStoryPointsClick(storyPoint)}>{storyPoint}</Menu.Item>
                ))}
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>

          {task.startDate ? (
            <Box display="flex">
            <Text fontSize="xx-small">Start Date:</Text>
            <Badge>{task.startDate}</Badge>
            </Box>
          ) : (
              <BsFillCalendar2DateFill/>
          )}
          {task.dueDate ? (
            <Box display="flex">
            <Text fontSize="xx-small">Due Date:</Text>
            <Badge>{task.dueDate}</Badge>
            </Box>
          ) : (
                <BsFillCalendar2DateFill/>                  
          )}
          <Badge>{assignee?.name}</Badge>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
}

export default TaskCard;
