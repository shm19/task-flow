import { Box } from "@chakra-ui/react";
import TaskForm from "./TaskForm";

interface NewTaskModalProps {
  isNewTaskModalOpen: boolean;
  onClose: (isNewTaskModalOpen: boolean) => void;
}

function NewTaskModal({ isNewTaskModalOpen, onClose }: NewTaskModalProps) {

  if (!isNewTaskModalOpen) return null;

  const clickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose(false);
    }
  };

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bgColor="rgba(123, 118, 118, 0.4)"
      zIndex={999}
      onClick={clickOutside}
    >
      <Box mx="auto" w="500px" mt={24} bgColor="blue.500" p={4} borderRadius="lg" zIndex={1000}>
        <TaskForm onClose={onClose} />
      </Box>
    </Box>
  );
}

export default NewTaskModal;
