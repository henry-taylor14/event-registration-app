// src/components/AdminConsole.tsx
import { useEffect, useState } from 'react';
import { getGroups, getWaiverInfo } from '../../api/userApi';
import { updateGroup } from '../../api/adminApi';
import { useParams } from 'react-router-dom';
import { Group } from '../../types/Group';

const AdminConsole = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [waivers, setWaivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { eventId } = useParams()

  useEffect(() => {
 
  }, [eventId]);

  useEffect(() => {
      if (!eventId) return;
  
      const fetchGroups = async () => {
        setLoading(true);
        try {
          const groupData = await getGroups(eventId)
          setGroups(groupData);
        } catch (error) {
          console.error('Error fetching groups', error)
        }
      };
      fetchGroups();
    }, []);

  const handleGroupClick = async (group: Group) => {
    setSelectedGroup(group);
    try {
      const waiverData = await getWaiverInfo(eventId!, group.groupId);
      setWaivers(waiverData.waivers);
    } catch (err) {
      console.error(err);
      setWaivers([]);
    }
  };

  const togglePaidStatus = async () => {
    if (!selectedGroup) return;
    const updated = { ...selectedGroup, paid: !selectedGroup.paymentStatus };
    await updateGroup(eventId!, selectedGroup.groupId, updated);
    setSelectedGroup(updated);
    setGroups(prev => prev.map(g => (g.groupId === updated.groupId ? updated : g)));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Admin Console</h2>
      <div className="flex gap-8">
        <div className="w-1/2">
          <h3 className="font-semibold mb-2">Groups</h3>
          <ul className="space-y-2">
            {groups.map(group => (
              <li
                key={group.groupId}
                className="border p-2 rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => handleGroupClick(group)}
              >
                {group.groupName} ({group.groupSize}) - {group.paymentStatus ? '✅ Paid' : '❌ Unpaid'}
              </li>
            ))}
          </ul>
        </div>
        {selectedGroup && (
          <div className="w-1/2">
            <h3 className="font-semibold mb-2">Group Details</h3>
            <div className="border p-4 rounded bg-gray-50">
              <p><strong>Name:</strong> {selectedGroup.groupName}</p>
              <p><strong>Leader:</strong> {selectedGroup.leaderName}</p>
              <p><strong>Email:</strong> {selectedGroup.email}</p>
              <p><strong>Phone:</strong> {selectedGroup.phone}</p>
              <p><strong>People:</strong> {selectedGroup.groupSize}</p>
              <p><strong>Paid:</strong> {selectedGroup.paymentStatus ? 'Yes' : 'No'}</p>
              <button
                onClick={togglePaidStatus}
                className="mt-2 px-4 py-1 bg-blue-500 text-white rounded"
              >
                Toggle Paid Status
              </button>
            </div>
            <h4 className="font-semibold mt-4">Waivers ({waivers.length})</h4>
            <ul className="list-disc list-inside">
              {waivers.map((w, i) => (
                <li key={i}>{w.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminConsole;