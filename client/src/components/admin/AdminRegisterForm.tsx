import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db, auth } from '../../config/firebaseConfig';
import {
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface GroupUpdateFormProps {
  }

// const normalizeGroupName = (name: string) => {
//   return name.trim().toLowerCase().replace(/[^a-z0-9]/gi, '');
// };

const GroupUpdateForm: React.FC<GroupUpdateFormProps> = () => {
  const [group, setGroup] = useState<any>(null);
  const [groupName, setGroupName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [numAttendees, setNumAttendees] = useState<number>(1);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { groupId } = useParams();
  const { eventId } = useParams();

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
        setGroupName(groupSnap.data().name);
        setLeaderName(groupSnap.data().leaderName);
        setEmail(groupSnap.data().email);
        setPhone(groupSnap.data().phone);
        setNumAttendees(groupSnap.data().numAttendees);
      } else {
        setError('Group not found.');
      }
    };
    if (isAdmin) fetchGroup();
  }, [isAdmin, eventId, groupId]);

  const validateForm = () => {
    if (!groupName || !leaderName || !email || !phone || !numAttendees) {
      setError('Please fill in all required fields.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    const phoneRegex = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    if (!phoneRegex.test(phone)) {
      setError('Please enter a valid phone number.');
      return false;
    }

    if (isNaN(numAttendees) || numAttendees < 1 || numAttendees > 100) {
      setError('Please enter a valid number of attendees (1-100).');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) return;

    try {
    //   const normalizedInputName = normalizeGroupName(groupName);

      const groupRef = doc(db, `events/${eventId}/groups`, groupId!);
      const existingGroup = await getDoc(groupRef);

      if (existingGroup.exists()) {
        await setDoc(groupRef, {
          name: groupName,
          leaderName,
          email,
          phone,
          numAttendees,
          updatedAt: new Date()
        });
        setSuccess(true);
        setError('');
      } else {
        setError('Group not found.');
      }
    } catch (err) {
      setError('Something went wrong while updating the form.');
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!isAdmin) return <p>You do not have access to this page.</p>;

  return (
    <div>
      <h2>Update Group</h2>
      {group ? (
        <form onSubmit={handleSubmit}>
          <label>
            Group Name:
            <input
              type="text"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              required
            />
          </label>

          <label>
            Group Leader Name:
            <input
              type="text"
              value={leaderName}
              onChange={e => setLeaderName(e.target.value)}
              required
            />
          </label>

          <label>
            Leader Email:
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Leader Phone:
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
          </label>

          <label>
            Number of Attendees:
            <input
              type="number"
              value={numAttendees}
              onChange={e => setNumAttendees(Number(e.target.value))}
              required
            />
          </label>

          <button type="submit">Update Group</button>
        </form>
      ) : (
        <p>{error}</p>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Group updated successfully!</p>}
    </div>
  );
};

export default GroupUpdateForm;



// const normalizeGroupName = (name: string) => {
//   return name.trim().toLowerCase().replace(/[^a-z0-9]/gi, '');
// };

// const GroupUpdateForm: React.FC<GroupUpdateFormProps> = ({ eventId, groupId }) => {
//   const { eventId = 'summer24', groupId } = useParams<{ eventId: string; groupId?: string }>();
//   const [groups, setGroups] = useState<any[]>([]);
//   const [selectedGroupId, setSelectedGroupId] = useState<string>(groupId || '');
//   const [groupName, setGroupName] = useState('');
//   const [leaderName, setLeaderName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [numAttendees, setNumAttendees] = useState<number>(1);
//   const [error, setError] = useState<string>('');
//   const [success, setSuccess] = useState<boolean>(false);
//   const [isAdmin, setIsAdmin] = useState<boolean>(false);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async user => {
//       if (user) {
//         const userRef = doc(db, 'users', user.uid);
//         const userSnap = await getDoc(userRef);
//         if (userSnap.exists() && userSnap.data().isAdmin) {
//           setIsAdmin(true);
//         } else {
//           navigate('/');
//         }
//       } else {
//         navigate('/');
//       }
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, [navigate]);

//   useEffect(() => {
//     const fetchGroups = async () => {
//       const groupSnapshot = await getDocs(collection(db, `events/${eventId}/groups`));
//       const groupData = groupSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setGroups(groupData);

//       if (groupId) {
//         const matched = groupData.find(group => group.id === groupId);
//         if (matched) {
//           setSelectedGroupId(groupId);
//           setGroupName(matched.name);
//           setLeaderName(matched.leaderName);
//           setEmail(matched.email);
//           setPhone(matched.phone);
//           setNumAttendees(matched.numAttendees);
//         }
//       }
//     };
//     if (isAdmin && eventId) fetchGroups();
//   }, [isAdmin, eventId, groupId]);

//   const handleGroupSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     setSelectedGroupId(value);
//     setError('');
//     setSuccess(false);

//     if (value === 'new') {
//       setGroupName('');
//       setLeaderName('');
//       setEmail('');
//       setPhone('');
//     } else {
//       const selectedGroup = groups.find(group => group.id === value);
//       if (selectedGroup) {
//         setGroupName(selectedGroup.name);
//         setLeaderName(selectedGroup.leaderName);
//         setEmail(selectedGroup.email);
//         setPhone(selectedGroup.phone);
//         setNumAttendees(selectedGroup.numAttendees);
//       }
//     }
//   };

//   const validateForm = () => {
//     if (!groupName || !leaderName || !email || !phone || !numAttendees) {
//       setError('Please fill in all required fields.');
//       return false;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       setError('Please enter a valid email address.');
//       return false;
//     }

//     const phoneRegex = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
//     if (!phoneRegex.test(phone)) {
//       setError('Please enter a valid phone number.');
//       return false;
//     }

//     if (isNaN(numAttendees) || numAttendees < 1 || numAttendees > 100) {
//       setError('Please enter a valid number of attendees (1-100).');
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setSuccess(false);

//     if (!validateForm()) return;

//     try {
//       const normalizedInputName = normalizeGroupName(groupName);
//       const matchingGroup = groups.find(
//         group => normalizeGroupName(group.name) === normalizedInputName
//       );

//       const finalGroupId = selectedGroupId === 'new'
//         ? (matchingGroup ? matchingGroup.id : groupName)
//         : selectedGroupId;

//       const groupRef = doc(db, `events/${eventId}/groups`, finalGroupId);
//       const existingGroup = await getDoc(groupRef);

//       if (existingGroup.exists()) {
//         const existingData = existingGroup.data();
//         const updatedCount = (existingData?.numAttendees || 0) + numAttendees;
//         await setDoc(groupRef, {
//           ...existingData,
//           numAttendees: updatedCount,
//           updatedAt: new Date()
//         });
//       } else {
//         await setDoc(groupRef, {
//           name: groupName,
//           leaderName,
//           email,
//           phone,
//           numAttendees,
//           createdAt: new Date()
//         });
//       }

//       setSuccess(true);
//       setError('');
//     } catch (err) {
//       setError('Something went wrong while submitting the form.');
//       console.error(err);
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (!isAdmin) return <p>You do not have access to this page.</p>;

//   return (
//     <div>
//       <h2>Group Registration</h2>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Select Group:
//           <select value={selectedGroupId} onChange={handleGroupSelection} required>
//             <option value="">-- Select a group --</option>
//             {groups.map(group => (
//               <option key={group.id} value={group.id}>{group.name}</option>
//             ))}
//             <option value="new">Add New Group</option>
//           </select>
//         </label>

//         {(selectedGroupId === 'new' || !selectedGroupId) && (
//           <label>
//             Group Name:
//             <input type="text" value={groupName} onChange={e => setGroupName(e.target.value)} required />
//           </label>
//         )}

//         <label>
//           Group Leader Name:
//           <input type="text" value={leaderName} onChange={e => setLeaderName(e.target.value)} required />
//         </label>

//         <label>
//           Leader Email:
//           <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
//         </label>

//         <label>
//           Leader Phone:
//           <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
//         </label>

//         <label>
//           Number of Attendees:
//           <input type="number" value={numAttendees} onChange={e => setNumAttendees(Number(e.target.value))} required />
//         </label>

//         <button type="submit">Register Group</button>
//       </form>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {success && <p style={{ color: 'green' }}>Group registered successfully!</p>}
//     </div>
//   );
// };

// export default GroupUpdateForm;
