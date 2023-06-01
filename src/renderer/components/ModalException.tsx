import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
} from '@chakra-ui/react';

interface IModalExceptionProps {
  isOpen: boolean;
  onClose: () => void;
  text?: string;
}

const ModalException: React.FC<IModalExceptionProps> = ({
  isOpen,
  onClose,
  text,
}) => {
  const handleOpenFile = () => {
    window.electron.ipcRenderer.actionFile(
      'open-file',
      `C:\\Users\\kiril\\Desktop\\SM\\gui-react-sm\\error_files\\${text}.txt`
    );
  };
  const handleDeleteFile = () => {
    window.electron.ipcRenderer.actionFile(
      'delete-file',
      `C:\\Users\\kiril\\Desktop\\SM\\gui-react-sm\\error_files\\${text}.txt`
    );
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Произошла ошибка</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{text}</ModalBody>

          <ModalFooter>
            <Flex justify="space-between" width="100%">
              <Button colorScheme="blue" mr={3} onClick={handleOpenFile}>
                Открыть файл
              </Button>

              <Button colorScheme="blue" mr={3} onClick={handleDeleteFile}>
                Удалить файл
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalException;
