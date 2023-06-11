import React, { useState, useEffect } from 'react';
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
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
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
  const [inputAccountsInBD, setInputAccountsInBD] = useState<string[]>([]);
  const dispatch = useDispatch();
  const toast = useToast();

  const handleInputAccounts = () => {
    window.electron.ipcRenderer
      .invokeGet('get-cart-input-accounts')
      .then((response) => {
        setInputAccountsInBD(
          response.map((index: any) => index.dataValues.deviceId)
        );
        toast({
          title: `Успешно`,
          status: 'success',
          isClosable: true,
        });
      })
      .catch((error) => {
        toast({
          title: `Ошибка при подгрузке из БД`,
          status: 'error',
          isClosable: true,
        });
      });
  };

  useEffect(() => {
    if (isOpen) {
      handleInputAccounts();
    }
  }, [isOpen]);

  const handleUpdateInput = async () => {
    window.electron.ipcRenderer
      .invokePost('update-input-accounts', inputAccounts)
      .then((response) => {
        toast({
          title: `Аккаунты успешно добавлены`,
          status: 'success',
          isClosable: true,
        });
        setInputAccounts('');
        handleInputAccounts();
      })
      .catch((error) => {
        toast({
          title: `Ошибка при добавлении`,
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
                <Heading size="sx" mb="4">
                  Данные в БД для проверки
                </Heading>
                <OrderedList>
                  {inputAccountsInBD.map((account, index) => (
                    <ListItem key={index}>{account}</ListItem>
                  ))}
                </OrderedList>
              </Box>
              <Box>
                <Textarea
                  rows={5}
                  onChange={onChangeInputArea}
                  value={inputAccounts}
                  mb="20px"
                />
                <Flex gap="5">
                  <Button onClick={handleUpdateInput}>Внести в БД</Button>
                  <Button onClick={handleInputAccounts}>Обновить Окно</Button>
                </Flex>
              </Box>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalInputDownload;
