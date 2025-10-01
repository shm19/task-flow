import { Button, Menu, Portal, Box, Input } from "@chakra-ui/react";
import CONSTANT_STORY_POINTS from "../utils/storyPoints";
import useFilterStore from "../store";

function FilterBar() {
  const  setFilter  = useFilterStore((state) => state.setFilter);
  const {priority, storyPoint, titleSearch} = useFilterStore((state)=> state.filter);
  const priorityOptions = ["Low", "Normal", "High", "All"];

  const handlePriorityClick = (priority: string) => {
    setFilter({ priority });
  };

  const handleStoryPointClick = (storyPoint: number) => {
    if (storyPoint === 0) {
      setFilter({ storyPoint: 0 });
    } else {
      setFilter({ storyPoint });
    }
  };

  const handleTitleSearch = (titleSearch: string) => {
    setFilter({ titleSearch });
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={4}
      bg="gray.800"
      width="100%"
    >
      <Box width="20%" display="flex">
        <Menu.Root>
          <Menu.Trigger asChild mr={2} width={24}>
            <Button variant="outline" size="sm" bg="gray.700" color="white">
              {priority === "All" ? "Priority" : priority}
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                {priorityOptions.map((priority) => (
                  <Menu.Item
                    key={priority}
                    value={priority}
                    onClick={() => handlePriorityClick(priority)}
                  >
                    {priority}
                  </Menu.Item>
                ))}
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
        <Menu.Root>
          <Menu.Trigger asChild width={24}>
            <Button variant="outline" size="sm" bg="gray.700" color="white">
              {storyPoint === 0 ? "Story Point" : storyPoint}
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                {[0, ...CONSTANT_STORY_POINTS].map((storyPoint) => (
                  <Menu.Item
                    key={storyPoint}
                    value={storyPoint}
                    onClick={() => handleStoryPointClick(storyPoint)}
                  >
                    {storyPoint === 0 ? "All" : storyPoint}
                  </Menu.Item>
                ))}
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Box>
      <Input
        width="40%"
        color="white"
        border="full"
        _placeholder={{ color: "white" }}
        type="text"
        placeholder="Search by title"
        value={titleSearch}
        onChange={(e) => handleTitleSearch(e.target.value)}
      />
    </Box>
  );
}

export default FilterBar;
