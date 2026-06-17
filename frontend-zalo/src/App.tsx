import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Chatbot from './pages/Chatbot';
import Appointments from './pages/Appointments';
import Feedbacks from './pages/Feedbacks';
import Profile from './pages/Profile';
import Procedures from './pages/Procedures';
import ProcedureDetail from './pages/ProcedureDetail';
import NewsDetail from './pages/NewsDetail';
import Documents from './pages/Documents';
import Hotline from './pages/Hotline';
import MapLocation from './pages/MapLocation';
import AdminImport from './pages/AdminImport';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="feedbacks" element={<Feedbacks />} />
          <Route path="profile" element={<Profile />} />
          <Route path="procedures" element={<Procedures />} />
          <Route path="procedures/:id" element={<ProcedureDetail />} />
          <Route path="news/:id" element={<NewsDetail />} />
          <Route path="documents" element={<Documents />} />
          <Route path="hotline" element={<Hotline />} />
          <Route path="map" element={<MapLocation />} />
          <Route path="admin/import" element={<AdminImport />} />
        </Route>
        <Route path="admin/login" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}



export default App;
