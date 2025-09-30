import { Grid, GridItem, Spinner, Text } from "@chakra-ui/react";
import BoardColumn from "./BoardColumn";
import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import client from "../client";

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
  assigneeId?: number;
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

  const { data: columns, isLoading, isError } = useQuery({
    queryKey: ["columns"],
    queryFn: () => client.get("columns").then((res) => res.data),
  });

  if (isLoading) return <Spinner />
  if (isError) return <Text color="red.500">Error loading columns</Text>

  return (
    <Grid templateColumns="repeat(3, 1fr)" height="100vh" width="100vh"  gap={4} mx="auto" mt={4} p={8}>
      {columns.map((column: Column) => (
        <GridItem bg="gray.100" borderRadius="lg" key={column.id}>
          <BoardColumn columnId={column.id} isNewTaskModalOpen={isNewTaskModalOpen} setIsNewTaskModalOpen={setIsNewTaskModalOpen}/>
        </GridItem>
      ))}
    </Grid>
  );
}

export default Board;
