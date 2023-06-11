import {
  Text,
  Tabs,
  TabList,
  Tab,
  Flex,
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
  useToast,
  Progress,
} from '@chakra-ui/react';

import ModalException from './ModalException';
import React from 'react';
import { MenuSettings } from './MenuSettings';
import ModalInputDownload from './ModalInputDownload';
import ModalOutputSuccess from './ModalOutputSuccess';

const MainWindow = () => {
  const [countWorks, setCountWorks] = React.useState(1);
  const [countThreads, setCountThreads] = React.useState(1);
  const [progress, setProgress] = React.useState(0);
  const [useProxy, setUseProxy] = React.useState('1');
  const [disabledRunButton, setDisabledRunButton] = React.useState(false);
  const deltaProgressRef = React.useRef(0);
  const progressRef = React.useRef(0);

  const {
    isOpen: isOpenException,
    onOpen: onOpenException,
    onClose: onCloseException,
  } = useDisclosure();

  const {
    isOpen: isOpenInputDownload,
    onOpen: onOpenInputDownload,
    onClose: onCloseInputDownload,
  } = useDisclosure();

  const {
    isOpen: isOpenOutputSuccess,
    onOpen: onOpenOutputSuccess,
    onClose: onCloseOutputSuccess,
  } = useDisclosure();

  const [errorMessage, setErrorMessage] = React.useState();
  const toast = useToast();

  const handleChangeCountWorks = (
    valueAsString: string,
    valueAsNumber: number
  ) => {
    setCountWorks(valueAsNumber);
  };

  const handleChangeCountThreads = (
    valueAsString: string,
    valueAsNumber: number
  ) => {
    setCountThreads(valueAsNumber);
  };

  const handleUseProxyChange = (value: string) => {
    setUseProxy(value);
  };

  const setProgressHandler = React.useCallback(() => {
    setProgress(deltaProgressRef.current + progressRef.current);
    progressRef.current += deltaProgressRef.current;
  }, [countWorks, progress, progressRef.current]);

  React.useEffect(() => {
    const updateProgressListener = (_event: any, data: any) => {
      setProgressHandler();
      console.log(_event);
    };

    window.electron.ipcRenderer.sendMessage(
      'update-progress',
      updateProgressListener
    );

    return () => {
      window.electron.ipcRenderer.removeListener(
        'update-progress',
        updateProgressListener
      );
    };
  }, []);

  const handleRunScript = async () => {
    setProgress(1);
    progressRef.current = 0;
    deltaProgressRef.current = 100 / countWorks;

    setDisabledRunButton(true);
    window.electron.ipcRenderer
      .sendCommandRun('run-python-script', {
        countWorks,
        countThreads,
        useProxy: !!+useProxy,
      })
      .then((response) => {
        if (!response) {
          onOpenException();
          setErrorMessage(response.number);
        } else {
          toast({
            title: 'Выполнено успешно',
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        console.log('handleRunScript error', error);
      })
      .finally(() => {
        setDisabledRunButton(false);
        setProgress(100);
      });
  };

  return (
    <>
      <ModalException
        isOpen={isOpenException}
        onClose={onCloseException}
        text={errorMessage}
      />
      <ModalInputDownload
        isOpen={isOpenInputDownload}
        onClose={onCloseInputDownload}
      />
      <ModalOutputSuccess
        isOpen={isOpenOutputSuccess}
        onClose={onCloseOutputSuccess}
      />
      <MenuSettings />
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
                <NumberInput
                  min={1}
                  defaultValue={countWorks}
                  value={countWorks}
                  onChange={handleChangeCountWorks}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Количество потоков</FormLabel>
                <NumberInput
                  min={1}
                  defaultValue={countThreads}
                  value={countThreads}
                  onChange={handleChangeCountThreads}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <Flex justifyContent="space-between" align="center">
                <RadioGroup value={useProxy} onChange={handleUseProxyChange}>
                  <Text mb={2}>Использовать прокси?</Text>
                  <Stack spacing={4} direction="row">
                    <Radio value="1">Да</Radio>
                    <Radio value="0">Нет</Radio>
                  </Stack>
                </RadioGroup>
              </Flex>

              <Flex justifyContent="space-between" align="center">
                <Button
                  loadingText="Submitting"
                  size="lg"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  onClick={onOpenInputDownload}
                >
                  Открыть окно загрузки
                </Button>
                <Button
                  loadingText="Submitting"
                  size="lg"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  onClick={onOpenOutputSuccess}
                >
                  Открыть выполненные
                </Button>
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
                isDisabled={disabledRunButton}
              >
                Запустить
              </Button>
              <Progress hasStripe mt="5" value={progress} />
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default MainWindow;
