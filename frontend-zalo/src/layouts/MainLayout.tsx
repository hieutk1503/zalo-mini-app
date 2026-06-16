import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="min-h-screen max-w-md mx-auto bg-white shadow-xl relative pb-16">
      <div className="bg-zalo-blue text-white p-4 text-center font-bold text-lg sticky top-0 z-50">
        Tự Lạn Smart
      </div>
      <div className="p-4 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
