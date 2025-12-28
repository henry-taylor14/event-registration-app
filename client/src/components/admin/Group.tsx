import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db, auth } from '../../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const Group: React.FC = () => {
  const [group, setGroup] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { eventId, groupId } = useParams(); // Dynamic eventId and groupId

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().isAdmin) {
          setIsAdmin(true);
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchGroup = async () => {
      if (!eventId || !groupId) return;  // Ensure eventId and groupId are available
      const groupRef = doc(db, `events/${eventId}/groups`, groupId);
      const groupSnap = await getDoc(groupRef);
      if (groupSnap.exists()) {
        setGroup(groupSnap.data());
      } else {
        setGroup(null);
      }
    };
    if (isAdmin) fetchGroup();
  }, [isAdmin, eventId, groupId]);

  if (loading) return <p>Loading...</p>;
  if (!isAdmin) return <p>You do not have access to this page.</p>;

  return (
    <div>
      {group ? (
        <>
          <h2>Group Information</h2>
          <p><strong>Group Name:</strong> {group.name}</p>
          <p><strong>Leader Name:</strong> {group.leaderName}</p>
          <p><strong>Leader Email:</strong> {group.email}</p>
          <p><strong>Leader Phone:</strong> {group.phone}</p>
          <p><strong>Number of Attendees:</strong> {group.numAttendees}</p>
          <button onClick={() => navigate(`/events/${eventId}/groups/update/${groupId}`)}>Update Group</button>
        </>
      ) : (
        <p>Group not found.</p>
      )}
    </div>
  );
};

export default Group;
