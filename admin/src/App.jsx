import React, { useContext, useState } from 'react'
import { MasterContext } from './context/MasterContext';
import { AdminContext } from './context/AdminContext';
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddMaster from './pages/Admin/AddMaster';
import MastersList from './pages/Admin/DoctorsList';
import EditMaster from './pages/Admin/EditMaster';
import Login from './pages/Login';
import MasterAppointments from './pages/Master/MasterAppointments';
import MasterDashboard from './pages/Master/MasterDashboard';
import MasterProfile from './pages/Master/MasterProfile';
import MasterSchedule from './pages/Master/MasterSchedule';
import MasterStats from './pages/Master/MasterStats';
import Support from './pages/Admin/Support';
import ReviewModeration from './pages/Admin/ReviewModeration';
import JobApplications from './pages/Admin/JobApplications';

const App = () => {

  const { mToken } = useContext(MasterContext)
  const { aToken } = useContext(AdminContext)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return mToken || aToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <div className='flex items-start'>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <Routes>
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-master' element={<AddMaster />} />
          <Route path='/master-list' element={<MastersList />} />
          <Route path='/edit-master/:docId' element={<EditMaster />} />
          <Route path='/master-dashboard' element={<MasterDashboard />} />
          <Route path='/master-appointments' element={<MasterAppointments />} />
          <Route path='/master-profile' element={<MasterProfile />} />
          <Route path='/master-schedule' element={<MasterSchedule />} />
          <Route path='/master-stats' element={<MasterStats />} />
          <Route path='/support' element={<Support />} />
          <Route path='/review-moderation' element={<ReviewModeration />} />
          <Route path='/job-applications' element={<JobApplications />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  )
}

export default App
