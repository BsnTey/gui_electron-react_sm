import React, { useState } from 'react';
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
  Textarea,
  Heading,
  Box,
  Input,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'renderer/redux/store';
import { setPathProxyFile } from 'renderer/redux/slices/proxySlice';

interface IModalInputDownloadProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalInputDownload: React.FC<IModalInputDownloadProps> = ({
  isOpen,
  onClose,
}) => {
  const [inputAccounts, setInputAccounts] = useState<string>('');
  const dispatch = useDispatch();
  const toast = useToast();

  const handleUpdateInput = async () => {
    window.electron.ipcRenderer
      .invokePost('update-input-accounts', inputAccounts)
      .then((response) => {
        toast({
          title: `Аккаунты успешно добавлены`,
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

  const onChangeInputArea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputAccounts(event.target.value);
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Вставьте данные для выполнения</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={5} p="4" borderWidth="1px" borderRadius="md">
              <Box>
                <Textarea
                  rows={5}
                  onChange={onChangeInputArea}
                  value={inputAccounts}
                  mb="20px"
                />
                <Button onClick={handleUpdateInput}>Внести в БД</Button>
              </Box>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalInputDownload;
