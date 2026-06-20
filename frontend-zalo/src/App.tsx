import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
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
import Planning from './pages/Planning';
import Investment from './pages/Investment';
import Bidding from './pages/Bidding';
import WorkSchedule from './pages/WorkSchedule';
import Forms from './pages/Forms';
import AdminImport from './pages/AdminImport';
import AdminLogin from './pages/AdminLogin';
import AdminFeedbacks from './pages/AdminFeedbacks';
import AdminAppointments from './pages/AdminAppointments';

import AdminNews from './pages/AdminNews';
import AdminPlanning from './pages/AdminPlanning';
import AdminInvestment from './pages/AdminInvestment';
import AdminBidding from './pages/AdminBidding';
import AdminDocuments from './pages/AdminDocuments';
import AdminProcedures from './pages/AdminProcedures';
import AdminFormTemplates from './pages/AdminFormTemplates';
import AdminWorkSchedule from './pages/AdminWorkSchedule';

import AdminDashboard from './pages/AdminDashboard';
import AdminCitizens from './pages/AdminCitizens';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User Routes (Mobile Layout) */}
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
          <Route path="planning" element={<Planning />} />
          <Route path="investment" element={<Investment />} />
          <Route path="bidding" element={<Bidding />} />
          <Route path="work-schedule" element={<WorkSchedule />} />
          <Route path="forms" element={<Forms />} />
        </Route>

        {/* Admin Login */}
        <Route path="admin/login" element={<AdminLogin />} />

        {/* Admin Routes (Desktop Layout) */}
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="citizens" element={<AdminCitizens />} />
          <Route path="feedbacks" element={<AdminFeedbacks />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="planning" element={<AdminPlanning />} />
          <Route path="investment" element={<AdminInvestment />} />
          <Route path="bidding" element={<AdminBidding />} />
          <Route path="documents" element={<AdminDocuments />} />
          <Route path="procedures" element={<AdminProcedures />} />
          <Route path="form-templates" element={<AdminFormTemplates />} />
          <Route path="work-schedule" element={<AdminWorkSchedule />} />
          <Route path="import" element={<AdminImport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
