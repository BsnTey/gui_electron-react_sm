import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import MainWindow from 'renderer/components/MainWindow';
import './App.scss';

export default function App() {
  return (
    <ChakraProvider>
      <CSSReset />
      <Router>
        <Routes>
          <Route path="/" element={<MainWindow />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}
