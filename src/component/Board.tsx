import { Grid, GridItem, Text } from "@chakra-ui/react";
import BoardColumn from "./BoardColumn";
import axios from "axios";
import { useEffect, useState } from "react";

export const CONSTANT_STORY_POINTS = [1, 2, 4, 8, 16];

export interface Column {
  id: number;
  title: string;
}

export interface Task {
  id: number;
  title: string;
  priority: string;
  description?: string;
  storyPoints?: number;
  startDate?: string;
  dueDate?: string;
  columnId?: number;
  assignId?: number;
}

export interface Assignee {
  id: number;
  name: string;
}

interface BoardProps {
  isNewTaskModalOpen: boolean;
  setIsNewTaskModalOpen: (isNewTaskModalOpen: boolean) => void;
}


function Board({ isNewTaskModalOpen, setIsNewTaskModalOpen}: BoardProps) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleNewTask = (task: Task, status: string) => {
    const statusColumnMap: Record<string, number> = {
      'To Do': 1,
      'In Progress': 2,
      'Done': 3
    }
    const statusColumnId = statusColumnMap[status];
    const newTask: Partial<Task> = {
      ...task,
      columnId: statusColumnId
    }
    delete newTask.id
    axios.post("http://localhost:3000/tasks", newTask).then((res) => {
      setTasks([...tasks, res.data]);
    });
  }

  const changeTaskStoryPoints = (taskId: number, storyPoints: number) => {
    axios.patch(`http://localhost:3000/tasks/${taskId}`, {
      storyPoints: storyPoints
    });
    const updatedTasks = tasks.map((task: Task) => {
      if (task.id === taskId) {
        return {...task, storyPoints: storyPoints};
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  const changeTaskPriority = (taskId: number) => {
    const taskPriorityChangeMap: Record<string, string> = {
      'Low': 'Normal',
      'Normal': 'High',
      'High': 'Low'
    }
    const updatedTasks = tasks.map((task: Task) => {
      if (task.id === taskId) {
        let newPriority = taskPriorityChangeMap[task.priority];
        axios.patch(`http://localhost:3000/tasks/${taskId}`, {
          priority: newPriority
        });
        return {...task, priority: newPriority};
      }
      return task;
    });
     
    setTasks(updatedTasks);
  }

  const changeColumn = (taskId: number, columnId: number) => {
    const newColumnId = Number(columnId)+1 > columns.length ? 1 : Number(columnId)+1;
    axios.patch(`http://localhost:3000/tasks/${taskId}`, {
      columnId: newColumnId
    });
    const updatedTasks = tasks.map((task: Task) => {
      if (task.id === taskId) {
        return {...task, columnId: newColumnId};
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  const getColumnTitle = (columnId: number) => {
    const column = columns.find((column) => Number(column.id) === columnId);
    console.log('get column title', {columnId, column} , columns);
    return column?.title || "";
  }

  useEffect(() => {
    axios.get("http://localhost:3000/columns").then((res) => {
      console.log({columns: res.data});
      setColumns(res.data);
    });
    axios.get("http://localhost:3000/tasks").then((res) => {
      console.log({tasks: res.data});
      setTasks(res.data);
    });
  }, []);
  return (
    <Grid templateColumns="repeat(3, 1fr)" height="100vh" width="100vh"  gap={4} mx="auto" mt={4} p={8}>
      {columns.map((column) => (
        <GridItem bg="gray.100" borderRadius="lg" key={column.id}>
          <BoardColumn column={column} tasks={tasks} changeTaskPriority={changeTaskPriority} changeTaskStoryPoints={changeTaskStoryPoints} changeColumn={changeColumn} getColumnTitle={getColumnTitle} isNewTaskModalOpen={isNewTaskModalOpen} setIsNewTaskModalOpen={setIsNewTaskModalOpen} handleNewTask={handleNewTask} />
        </GridItem>
      ))}
    </Grid>
  );
}

export default Board;
