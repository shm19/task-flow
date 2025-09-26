import { Box, Text } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

function Navbar() {
  return (
    <Box display="flex" alignItems="center" p={4} bg="gray.800">
      <Button mr={4}>
        <Text>Home</Text>
      </Button>
      <Button>
        <Text>About</Text>
      </Button>
    </Box>
  );
}

export default Navbar;