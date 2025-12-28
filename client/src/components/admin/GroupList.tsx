import React from 'react';
import { Link } from 'react-router-dom';
import { Group } from '../../types/Group';

interface GroupListProps {
  groups: Group[];
  onGroupClick: (groupId: string) => void;
}

const GroupList: React.FC<GroupListProps> = ({ groups, onGroupClick }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Registered Groups</h2>
      <div className="max-h-[400px] overflow-y-auto border rounded-lg p-4">
        <ul className="space-y-2">
          {groups.map((group) => (
            <li
              key={group.groupId}
              className="p-3 bg-white text-black rounded shadow hover:bg-gray-100 transition"
              onClick={() => onGroupClick(group.groupId)}
            >
              <Link
                to={`/admin/groups/${group.groupId}`}
                className="font-medium text-blue-600 hover:underline"
              >
                {group.groupName}
              </Link>
              <div className="text-sm text-gray-700">
                Leader: {group.leaderName} • { group.groupSize } registrants • $
                {group.paymentTotal?.toFixed(2) || '0.00'} paid •{' '}
                {group.numberCheckedIn === group.groupSize
                  ? 'All Checked In!'
                  : `${group.numberCheckedIn}/${group.groupSize} checked in.`}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GroupList;
