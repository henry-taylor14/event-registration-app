import React from 'react';
import { Group } from '../../types/Group';
import { Receipt } from '../../types/Receipt';

interface EditGroupModalProps {
  group: Group;
  onClose: () => void;
  onSave: (group: Group) => void;
  onDeleteGroup: (groupId: string) => void;
  onDeleteReceipt: (receiptId: string) => void;
  setGroup: React.Dispatch<React.SetStateAction<Group | null>>; 
}


const EditGroupModal: React.FC<EditGroupModalProps> = ({
  group,
  onClose,
  onSave,
  onDeleteGroup,
  onDeleteReceipt,
  setGroup,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg sm:max-w-xl md:max-w-2xl bg-white rounded-lg shadow-lg p-6 max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">Edit Group: {group.groupName}</h2>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Leader Name</label>
          <input
            type="text"
            value={group.leaderName}
            onChange={(e) =>
              setGroup({ ...group, leaderName: e.target.value })
            }
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Group Size</label>
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            value={group.groupSize}
            onChange={(e) =>
              setGroup({ ...group, groupSize: Number(e.target.value) })
            }
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            value={group.email}
            onChange={(e) =>
              setGroup({ ...group, email: e.target.value })
            }
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Checked In</label>
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            value={group.numberCheckedIn || 0}
            onChange={(e) =>
              setGroup({ ...group, numberCheckedIn: Number(e.target.value) })
            }
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Receipts</h3>
          <ul className="space-y-2">
            {group.receipts?.map((receipt: Receipt) => (
              <li
                key={receipt.receiptId}
                className="flex items-center justify-between p-2 bg-gray-100 rounded"
              >
                <div className="text-sm">
                  <p>
                    <span className="font-medium">Size:</span> {receipt.groupSize}
                    {' • '}
                    <span className="font-medium">Receipt ID:</span> {receipt.receiptId}
                    {' • '}
                    <span className="font-medium">Total Paid:</span> $
                    {receipt.paymentTotal.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => onDeleteReceipt(receipt.receiptId)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium ml-4"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => onDeleteGroup(group.groupId)}
          >
            Delete
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => onSave(group)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGroupModal;
