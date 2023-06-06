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
  Stack,
  Heading,
  Box,
  Input,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'renderer/redux/store';
import { setPathProxyFile } from 'renderer/redux/slices/proxySlice';

interface IModalSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalSettings: React.FC<IModalSettingsProps> = ({ isOpen, onClose }) => {
  const path = useSelector((state: RootState) => state.proxy.pathProxyFile);
  const dispatch = useDispatch();
  const toast = useToast();

  const handleOpenProxyFile = () => {
    window.electron.ipcRenderer.actionFile('open-file', path);
  };

  const handleUpdateProxy = async () => {
    window.electron.ipcRenderer
      .proxy('update-proxy', path)
      .then((response) => {
        toast({
          title: `Прокси успешно обновлены`,
          status: 'success',
          isClosable: true,
        });
      })
      .catch((error) => {
        toast({
          title: `Ошибка при обновлении`,
          status: 'error',
          isClosable: true,
        });
      });
  };

  const onChangeInputFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file?.path) {
      dispatch(setPathProxyFile(file.path));
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Настройки</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={5} p="4" borderWidth="1px" borderRadius="md">
              <Box>
                <Heading fontSize="18px" mb="15px">
                  Прокси
                </Heading>
                <Input type="file" onChange={onChangeInputFile} mb="20px" />
                <Button mr="20px" onClick={handleOpenProxyFile}>
                  Открыть
                </Button>
                <Button onClick={handleUpdateProxy}>Обновить в БД</Button>
              </Box>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalSettings;
