import { Grid, GridItem, Spinner, Text } from "@chakra-ui/react";
import BoardColumn from "./BoardColumn";
import { useQuery } from "@tanstack/react-query";
import client from "../client";
import { Column } from "../interfaces/Column.interface";

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
    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
      {columns.map((column: Column) => (
        <GridItem bg="gray.100" borderRadius="lg" key={column.id}>
          <BoardColumn columnId={column.id} isNewTaskModalOpen={isNewTaskModalOpen} setIsNewTaskModalOpen={setIsNewTaskModalOpen}/>
        </GridItem>
      ))}
    </Grid>
  );
}

export default Board;
