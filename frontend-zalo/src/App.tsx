import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<div>Trang chủ sẽ nằm ở đây</div>} />
          <Route path="chatbot" element={<div>Chatbot sẽ nằm ở đây</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
