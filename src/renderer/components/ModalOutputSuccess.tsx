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

  useEffect(() => {
    if (isOpen) {
      window.electron.ipcRenderer
        .invokeGet('get-cart-accounts')
        .then((response) => {
          console.log(response);
          setOutputAccounts(
            response.map((index: any) => index.dataValues.deviceId)
          );
          console.log(outputAccounts);
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
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        {/* <ModalHeader>Вставьте данные для выполнения</ModalHeader> */}
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={5} p="4" borderWidth="1px" borderRadius="md">
            <Box>
              <ul>
                {outputAccounts.map((account, index) => (
                  <li key={index}>{account}</li>
                ))}
              </ul>
            </Box>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalOutputSuccess;
