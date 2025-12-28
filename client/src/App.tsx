import React from 'react';
import { Toaster } from 'sonner';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './components/admin/AdminLogin';
import EventsHome from './components/EventsHome';
import GroupRegisterForm from './components/GroupRegisterForm';
import CheckoutPage from './components/CheckoutPage';
import ReceiptPage from './components/ReceiptPage';
import NotFound from './components/NotFound';
import AdminDashboard from './components/admin/AdminDashboard';
import ProtectedRoute from './components/admin/ProtectedRoute';
// import GroupList from './components/admin/GroupList';
// import Group from './components/admin/Group';
// import AdminRegisterForm from './components/admin/AdminRegisterForm';

const App: React.FC = () => {


  return (
    <>
      <Toaster richColors position="top-center" />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<EventsHome />} />
          <Route path="/register/:eventId" element={<GroupRegisterForm />}/>
          <Route path='/checkout' element={<CheckoutPage />}/>
          <Route path='/receipt' element={<ReceiptPage />}/>

          <Route
            path="/admin/login"
            element={
              <AdminLogin />
            }
            />

          {/* Admin Routes (Protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            {/* <Route path="/admin/:eventName/groups" element={<GroupList />} />
            <Route path="/admin/:eventName/groups/:groupId" element={<Group />} /> */}
            <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
            
          </Route>


          {/* Redirect unknown routes to home */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
