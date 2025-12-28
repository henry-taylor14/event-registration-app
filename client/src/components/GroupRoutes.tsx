import React from 'react';
import { Routes, Route, useParams } from 'react-router';
import GroupRegisterForm from '../components/GroupRegisterForm';
// import GroupUpdateForm from './admin/GroupUpdateForm';

const GroupRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/register/:eventId" element={<GroupRegisterWrapper />} />
      {/* <Route path="/update/:eventId/:groupId" element={<GroupUpdateWrapper />} /> */}
    </Routes>
  );
};

// Wrapper to extract eventId for GroupRegisterForm
const GroupRegisterWrapper: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  if (!eventId) return <div>Missing event ID</div>;
  return <GroupRegisterForm />;
};

// // Wrapper to extract eventId and groupId for GroupUpdateForm
// const GroupUpdateWrapper: React.FC = () => {
//   const { eventId, groupId } = useParams<{ eventId: string; groupId: string }>();
//   if (!eventId || !groupId) return <div>Missing event or group ID</div>;
//   return <GroupUpdateForm eventId={eventId} />;
// };

export default GroupRoutes;

