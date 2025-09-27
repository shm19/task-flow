import { Modal, ModalOverlay, ModalContent, ModalHeader } from "@chakra-ui/react";
import { useState } from "react";

function NewTaskModal() {
  return (
    <>
    <Modal isOpen={isNewTaskModalOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Task</ModalHeader>
      </ModalContent>
    </Modal>
    </>
  )
}