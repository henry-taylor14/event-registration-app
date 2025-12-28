import React, { useState } from 'react';
import { auth } from '../../config/firebaseConfig';

type Props = {
  eventId: string;
  groupId: string;
};

const CheckInButton: React.FC<Props> = ({ eventId, groupId }) => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/admin/events/${eventId}/groups/${groupId}/checkIn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Check-in failed');
      setCheckedIn(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleCheckIn} disabled={loading || checkedIn} className="bg-blue-600 text-white px-4 py-2 rounded">
      {checkedIn ? 'Checked In' : loading ? 'Checking In...' : 'Check In'}
    </button>
  );
};

export default CheckInButton;
