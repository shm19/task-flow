import { Badge, Card, HStack, Input, Menu, Portal, Text, Circle, Box } from "@chakra-ui/react";
import { Task, Assignee, CONSTANT_STORY_POINTS } from "./Board";
import { useState, useEffect } from "react";
import axios from "axios";
import { BsFillCalendar2DateFill } from "react-icons/bs";

interface TaskCardProps {
  task: Task;
  changeTaskPriority: (taskId: number) => void;
  changeTaskStoryPoints: (taskId: number, storyPoints: number) => void;
  changeColumn: (taskId: number, columnId: number) => void;
  getColumnTitle: (columnId: number) => string;
  changeTaskTitle: (taskId: number, title: string) => void;
}

function TaskCard({ task, changeTaskPriority, changeTaskStoryPoints, changeColumn, getColumnTitle, changeTaskTitle }: TaskCardProps) {
  const [assignee, setAssignee] = useState<Assignee | null>(null);
  const [titleEditMode, setTitleEditMode] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  useEffect(() => {
    if (task.assignId) {
      axios.get(`http://localhost:3000/assignees/${task.assignId}`).then((res) => {
        setAssignee(res.data);
      });
    }
  }, [task.assignId]);

  const handleTitleSaveOnBlur = () => {
  
    const newTitle = editedTitle.trim();
    if (newTitle && newTitle !== task.title) {
      changeTaskTitle(task.id, newTitle);
    }

    setTitleEditMode(false);
  };

  const handleTitleClick = () => {
    setEditedTitle(task.title);
    setTitleEditMode(true);
  };

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
  };
  
  const handlePriorityClick = () => {
    changeTaskPriority(task.id);
  };

  const handleColumnClick = (columnId: number) => {
    changeColumn(task.id, columnId);
  };

  return (
    <Card.Root key={task.id} bgColor="gray.200" m={2} p={2} borderRadius="lg">
      <Card.Header>
        {titleEditMode ? (
          <Input 
            id="title-input" 
            value={editedTitle} 
            onChange={(e) => setEditedTitle(e.target.value)} 
            autoFocus
            onBlur={handleTitleSaveOnBlur}
          />
        ) : (
          <Text id="title-text" onClick={handleTitleClick} cursor="pointer">
            {task.title}
          </Text>
        )}
      </Card.Header>
      <Card.Body>
        <HStack>
          <Badge cursor="pointer" onClick={handlePriorityClick} bgColor={getPriorityColor(task.priority)}>{task.priority}</Badge>
          <Badge cursor="pointer" onClick={() => handleColumnClick(task.columnId || 0)}>{getColumnTitle(task.columnId || 0)}</Badge>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Circle size="20px" boxShadow="md" cursor="pointer">
                <Text fontSize="sm" fontWeight="bold">
                  {task.storyPoints}
                </Text>
              </Circle>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  {CONSTANT_STORY_POINTS.map((storyPoint) => (
                    <Menu.Item key={storyPoint} value={storyPoint} onClick={() => handleStoryPointsClick(storyPoint)}>{storyPoint}</Menu.Item>
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