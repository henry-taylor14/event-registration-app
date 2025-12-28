import React from 'react';
import { Event } from '../../types/Event';
import { PriceTier } from '../../types/PriceTier';
import PriceTiers from './PriceTiers';

interface EditEventModalProps {
  event: Event;
  onClose: () => void;
  onSave: (updatedEvent: Event) => void;
  setEvent: React.Dispatch<React.SetStateAction<Event | null>>;
  onTierChange: (index: number, field: keyof PriceTier, value: any) => void;
  onAddTier: () => void;
  onRemoveTier: (index: number) => void;
}

const EditEventModal: React.FC<EditEventModalProps> = ({ 
    event, 
    onClose, 
    onSave, 
    setEvent,
    onTierChange,
    onAddTier,
    onRemoveTier,
}) => {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative z-10 w-full max-w-lg sm:max-w-xl md:max-w-2xl bg-white rounded-lg shadow-lg p-6 max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Edit Event: {event.eventName}</h2>

            <div className="mb-4">
                <label className="block font-semibold mb-1">Event Name</label>
                <input
                    type="text"
                    value={event.eventName}
                    onChange={(e) =>
                    setEvent({ ...event, eventName: e.target.value })
                    }
                    className="w-full border rounded p-2"
                />
            </div>

            <div className="mb-4">
                <label className="block font-semibold mb-1">Event Capacity (Maximum)</label>
                <input
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={event.maxAttendees}
                    onChange={(e) =>
                    setEvent({ ...event, maxAttendees: Number(e.target.value) })
                    }
                    className="w-full border rounded p-2"
                />
            </div>

            <div className="mb-4">
                <label className="block font-semibold mb-1">Event Date</label>
                <input
                    type="date"
                    value={
                    event.eventDate instanceof Date
                        ? event.eventDate.toISOString().slice(0, 10)
                        : typeof event.eventDate === 'string' && !isNaN(new Date(event.eventDate).getTime())
                        ? new Date(event.eventDate).toISOString().slice(0, 10)
                        : ''
                    }
                    onChange={(e) =>
                    setEvent({ ...event, eventDate: new Date(e.target.value) })
                    }
                    className="w-full border rounded p-2"
                />
            </div>


            <div className="mb-4">
                <label className="block font-semibold mb-1">Registration Start Date</label>
                <input
                    type="date"
                    value={
                    event.registrationStartDate instanceof Date
                        ? event.registrationStartDate.toISOString().slice(0, 10)
                        : typeof event.registrationStartDate === 'string' && !isNaN(new Date(event.registrationStartDate).getTime())
                        ? new Date(event.registrationStartDate).toISOString().slice(0, 10)
                        : ''
                    }
                    onChange={(e) =>
                        setEvent({ ...event, registrationStartDate: new Date(e.target.value) })
                    }
                    className="w-full border rounded p-2"
                />
            </div>

            <div className="mb-4">
                <label className="block font-semibold mb-1">Waiver URL</label>
                <input
                    type="text"
                    value={event.waiverURL}
                    onChange={(e) =>
                    setEvent({ ...event, waiverURL: e.target.value })
                    }
                    className="w-full border rounded p-2"
                />
            </div>

            <div className="mb-4">
                <label className="block font-semibold mb-1">Price Tiers</label>
                <PriceTiers
                    priceTiers={event.priceTiers}
                    onAddTier={onAddTier}
                    onRemoveTier={onRemoveTier}
                    onTierChange={onTierChange}
                />
            </div>

            <div className="flex justify-end space-x-2 mt-4">
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => onSave(event)}
                >
                    Save
                </button>
                <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    </div>
  );
};

export default EditEventModal;
