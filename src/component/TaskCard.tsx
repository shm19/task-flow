import { Badge, Card, HStack, Input, Menu, Portal, Text, Circle, Box, Spinner } from "@chakra-ui/react";
import { Task, CONSTANT_STORY_POINTS, Column } from "./Board";
import { useState } from "react";
import { BsFillCalendar2DateFill } from "react-icons/bs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import client from "../client";
import { AxiosResponse } from "axios";

interface TaskCardProps {
  taskId: number;
}

function TaskCard({ taskId }: TaskCardProps) {
  const [titleEditMode, setTitleEditMode] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState("");
  const queryClient = useQueryClient();

  const { data: columns } = useQuery({
    queryKey: ["columns"],
    queryFn: () => client.get("columns").then((res) => res.data),
    staleTime: 24 * 60 * 60 * 1000,
  });

  const { data: task, isLoading, isError } = useQuery({
    queryKey: ["tasks", taskId],
    queryFn: () => client.get(`tasks/${taskId}`).then((res) => res.data),
    enabled: !!taskId,
  });
  
  const { data: assignee } = useQuery({
    queryKey: ["assignees", task?.assigneeId],
    queryFn: () => client.get(`assignees/${task.assigneeId}`).then((res) => res.data),
    enabled: !!task?.assigneeId,
  });

  const { mutate: updateTaskProperty } = useMutation<AxiosResponse<Task>, Error, { taskProperty: string, value: string | number }, { oldTask: Task }>({
    mutationFn: ({ taskProperty, value }) => client.patch(`tasks/${taskId}`, { [taskProperty]: value }),

    onMutate: ({ taskProperty, value }) => {
      const oldTask = queryClient.getQueryData(["tasks", taskId]) as Task;
      queryClient.setQueryData(["tasks", taskId], (oldTask: Task | undefined)=> {
        return { ...oldTask, [taskProperty]: value };
      })
      return { oldTask };
    },

    onSuccess: (taskResponse) => {
      queryClient.setQueryData(["tasks", taskId], ()=> {
        return taskResponse.data;
      })
    },
    onError: (error, variables, context) => {
      if (context) {
        queryClient.setQueryData(["tasks", taskId], () => context.oldTask);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  })

  if (isLoading) return <Spinner />
  if (isError) return <Text color="red.500">Error loading task</Text>
  
  const handleTitleSaveOnBlur = () => {
    const newTitle = editedTitle.trim();
    if (newTitle && newTitle !== task.title) {
      updateTaskProperty({ taskProperty: "title", value: newTitle });
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

  const handleColumnClick = (columnId: number) => {
    const newColumnId = Number(columnId)+1 > columns.length ? 1 : Number(columnId)+1;
    updateTaskProperty({ taskProperty: "columnId", value: newColumnId });
  };

  const handleStoryPointsClick = (storyPoints: number) => {
    updateTaskProperty({ taskProperty: "storyPoints", value: storyPoints });
  };
  
  const handlePriorityClick = () => {
    updateTaskProperty({ taskProperty: "priority", value: task.priority === "Low" ? "Normal" : task.priority === "Normal" ? "High" : "Low" });
  };

  const getTaskColumnTitle = (columnId: number) => {
    return columns?.find((column: Column) => column.id == columnId)?.title;
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
          <Badge cursor="pointer" onClick={() => handleColumnClick(task.columnId || 0)}>{getTaskColumnTitle(task.columnId || 0)}</Badge>
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