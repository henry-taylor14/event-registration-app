// client/src/pages/Sidebar.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../../types/Event';
import { Button } from '../ui/button';
import { auth } from '../../config/firebaseConfig';

interface SidebarProps {
  eventId: string;
  events: Event[];
  onSelectEvent: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  userEmail?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  eventId,
  events,
  onSelectEvent,
  userEmail
}) => {
  return (
    <div className="w-64 bg-gray-800 text-white p-4 space-y-6 h-full relative z-50">
      <h2 className="text-2xl font-bold mb-4">Admin</h2>

      {/* Event Selector */}
      <div className="bg-gray-700 p-3 rounded-lg shadow-inner">
        <label className="block text-md font-medium mb-1">Select An Event:</label>
        <select
          value={eventId}
          onChange={onSelectEvent}
          className="w-full p-2 rounded bg-gray-300 text-black font-semibold"
        >
          <option value="" disabled>Select an event</option>
          {events.map(event => (
            <option key={event.eventId} value={event.eventId}>
              {event.eventName}
            </option>
          ))}
        </select>
      </div>

      {/* Nav */}
      <nav className="flex flex-col space-y-2">
        <Link to="/admin" className="hover:text-blue-300">Dashboard Home</Link>
        <Link to="/admin/email" className="hover:text-blue-300">Email Attendees</Link>
      </nav>

      {/* User Info */}
      <div className="absolute bottom-4 left-4 right-4 text-sm space-y-2">
        {userEmail && (
          <p>
            Logged in as <strong>{userEmail}</strong>
          </p>
        )}
        <Button
          variant="ghost"
          onClick={async () => {
            await auth.signOut();
          }}
          className="w-full"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;


// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Event } from '../../types/Event';


// interface SidebarProps {
//   eventId: string;
//   events: Event[];
//   onSelectEvent: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//   onToggle: (e: React.ChangeEvent<HTMLSelectElement>) => void;
// }

// const Sidebar: React.FC<SidebarProps> = ({ eventId, events, onSelectEvent }) => {
//   return (
//     <div className="w-64 bg-gray-800 text-white p-4 space-y-6 h-full">
//       <h2 className="text-2xl font-bold mb-4">Admin</h2>

//       {/* Highlighted Event Selector */}
//       <div className="bg-gray-700 p-3 rounded-lg shadow-inner">
//         <label className="block text-md font-medium mb-1">Event:</label>
//         <select
//           value={eventId}
//           onChange={onSelectEvent}
//           className="w-full p-2 rounded bg-gray-300 text-black font-semibold"
//         >
//           <option value="" disabled>Select an event</option>
//           {events.map(event => (
//             <option key={event.eventId} value={event.eventId}>
//               {event.eventName}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Navigation */}
//       <nav className="flex flex-col space-y-2">
//         <Link to="/admin" className="hover:text-blue-300">Dashboard Home</Link>
//         <Link to="/admin/groups" className="hover:text-blue-300">Group List</Link>
//         <Link to="/admin/groups/register" className="hover:text-blue-300">Add Group</Link>
//         <Link to="/admin/email" className="hover:text-blue-300">Email Attendees</Link>
//         <Link to="/admin/events" className="hover:text-blue-300">Manage Events</Link>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;
