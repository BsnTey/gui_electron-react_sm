import {
  Select,
  Text,
  Box,
  Tabs,
  TabList,
  Tab,
  Flex,
  Input,
  TabPanel,
  TabPanels,
  Button,
  FormControl,
  FormLabel,
  Stack,
  Radio,
  RadioGroup,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useDisclosure,
} from '@chakra-ui/react';

import ModalException from './ModalException';
import React from 'react';

const MainWindow = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errorMessage, setErrorMessage] = React.useState();

  const handleClick = () => {
    window.electron.ipcRenderer.actionFile(
      'open-file',
      'C:\\Users\\kiril\\Desktop\\SM\\proxy.txt'
    );
  };

  const handleRunScript = async () => {
    window.electron.ipcRenderer
      .sendCommandRun('run-python-script', {
        countWorks: 1,
        countThreads: 1,
        useProxy: true,
      })
      .then((response) => {
        console.log(response);
        const serializedObj = JSON.parse(response);
        if (serializedObj.result === false) {
          onOpen();
          setErrorMessage(serializedObj.number);
        }
      })
      .catch((error) => {
        console.log('handleRunScript error', error);
      });
  };

  return (
    <>
      <ModalException isOpen={isOpen} onClose={onClose} text={errorMessage} />
      <Tabs isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab>Заказы</Tab>
          <Tab>Хуекер</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Stack spacing={5} p="4" borderWidth="1px" borderRadius="md">
              <FormControl>
                <FormLabel>Сколько делать</FormLabel>
                <NumberInput min={1} defaultValue={1}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Количество потоков</FormLabel>
                <NumberInput min={1} defaultValue={1}>
                  <NumberInputField />
                  {/* <Button onClick={() => onOpen()}>Открыть</Button> */}
                  {/* <Button></Button> */}
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <Flex justifyContent="space-between" align="center">
                <RadioGroup defaultValue="1">
                  <Text mb={2}>Использовать прокси?</Text>
                  <Stack spacing={4} direction="row">
                    <Radio value="1">Да</Radio>
                    <Radio value="2">Нет</Radio>
                  </Stack>
                </RadioGroup>
                <Button onClick={handleClick}>Открыть</Button>
              </Flex>

              <Button
                loadingText="Submitting"
                size="lg"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={handleRunScript}
              >
                Запустить
              </Button>
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default MainWindow;
