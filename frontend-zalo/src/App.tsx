import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="chatbot" element={<div>Chatbot sẽ nằm ở đây</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
