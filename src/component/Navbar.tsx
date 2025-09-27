import { Box, Text } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

interface NavbarProps {
  toggleNewTaskModal: () => void;
}

function Navbar({ toggleNewTaskModal }: NavbarProps) {
  return (
    <Box display="flex" alignItems="center" p={4} bg="gray.800">
      <Button mr={4}>
        <Text>Home</Text>
      </Button>
      <Button mr={4}>
        <Text>About</Text>
      </Button>
      <Button onClick={() => toggleNewTaskModal()}>
        <Text>New Task</Text>
      </Button>
    </Box>
  );
}

export default Navbar;