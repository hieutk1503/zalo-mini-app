import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Chatbot from './pages/Chatbot';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="chatbot" element={<Chatbot />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
