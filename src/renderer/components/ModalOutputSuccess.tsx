import React, { useEffect, useState } from 'react';
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

interface IModalOutputSuccessProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalOutputSuccess: React.FC<IModalOutputSuccessProps> = ({
  isOpen,
  onClose,
}) => {
  const [outputAccounts, setOutputAccounts] = useState<string[]>([]);
  const dispatch = useDispatch();
  const toast = useToast();

  const handleOutputAccounts = () => {
    window.electron.ipcRenderer
      .invokeGet('get-cart-output-accounts')
      .then((response) => {
        setOutputAccounts(
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
          title: `Ошибка при обновлении`,
          status: 'error',
          isClosable: true,
        });
      });
  };

  useEffect(() => {
    if (isOpen) {
      handleOutputAccounts();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Выполненные аккаунты из БД</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={5} p="4" borderWidth="1px" borderRadius="md">
            <Box>
              <OrderedList>
                {outputAccounts.map((account, index) => (
                  <ListItem key={index}>{account}</ListItem>
                ))}
              </OrderedList>
              <Flex mt="5" gap="5">
                <Button onClick={handleOutputAccounts}>Обновить Окно</Button>
              </Flex>
            </Box>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalOutputSuccess;
