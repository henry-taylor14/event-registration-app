import React, { useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import { Event } from '../../types/Event';

interface SidebarWrapperProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  eventId: string;
  events: Event[];
  handleEventSelection: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SidebarWrapper: React.FC<SidebarWrapperProps> = ({
  sidebarOpen,
  setSidebarOpen,
  eventId,
  events,
  handleEventSelection,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const sidebarEl = sidebarRef.current;
      if (sidebarEl && !sidebarEl.contains(e.target as Node)) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-gray-800 z-50 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 md:block w-64`}
      >
        <Sidebar
          eventId={eventId}
          events={events}
          onSelectEvent={handleEventSelection}
        />
      </div>
    </>
  );
};

export default SidebarWrapper;
