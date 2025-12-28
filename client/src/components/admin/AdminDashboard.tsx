// client/src/pages/AdminDashboard.tsx

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useEvent } from '../../contexts/EventContext';
import { useAuth } from '../../contexts/AuthContext';
import { Event } from '../../types/Event';
import { Group } from '../../types/Group';
import { PriceTier } from '../../types/PriceTier';
import GroupList from './GroupList';
import DashboardStats from './DashboardStats';
import EditGroupModal from './EditGroupModal';
import EditEventModal from './EditEventModal';
import SearchAndSort from './SearchAndSort';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Button } from '../ui/button';
import Sidebar from './Sidebar';
import Spinner from '../Spinner';
import { updateGroup, deleteGroup, deleteReceipt, createEvent, deleteEvent, updateEvent } from '../../api/adminApi';
import { getEvents, getEventInfo, getGroups, getGroup } from '../../api/userApi'
import { Menu } from 'lucide-react';
import { toast } from 'sonner';
import EventList from './EventList';

const AdminDashboard: React.FC = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const { eventId, setEventId, currentEvent, loadingEvent } = useEvent();
  const [events, setEvents] = useState<Event[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupSortKey, setGroupSortKey] = useState<'groupName' | 'leaderName'>('groupName');
  const [eventSortKey, setEventSortKey] = useState<'eventName'>('eventName');
  const [activeTab, setActiveTab] = useState<'groups' | 'events'>('groups');
  const [placeholder, setPlaceholder] = useState('Search...');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/admin/login');
    }
  }, [authLoading, isAdmin, navigate]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const eventData = await getEvents();
        setEvents(eventData);

        const storedEventId = localStorage.getItem('selectedEventId');
        const initialId = storedEventId || eventData[0]?.eventId;

        if (!initialId) {
          console.warn('No eventId found in localStorage or events list');
          return;
        }

        const selectedEvent = eventData.find((e: Event) => e.eventId === initialId);
        if (!selectedEvent) {
          console.warn('Selected eventId not found in fetched events:', initialId);
          return;
        }

        setEventId(initialId);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [setEventId]);



  useEffect(() => {
    if (!eventId) return;

    const fetchGroups = async () => {
      setLoading(true);
      try {
        const groupData = await getGroups(eventId);
        setGroups(groupData);
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [eventId]);


  useEffect(() => {}, [groups]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const sidebarEl = sidebarRef.current;
      const toggleEl = toggleButtonRef.current;

      if (
        sidebarEl &&
        toggleEl &&
        !sidebarEl.contains(e.target as Node) &&
        !toggleEl.contains(e.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const updatePlaceholder = () => {
      setPlaceholder(window.innerWidth < 640 ? 'Search...' : 'Search groups or leaders');
    };
    updatePlaceholder(); // run once on load
    window.addEventListener('resize', updatePlaceholder);
    return () => window.removeEventListener('resize', updatePlaceholder);
  }, []);

  useEffect(() => {
    if (toastMsg) {
      toast( toastMsg );
      setToastMsg('');
    }
  }, [toastMsg, toast]);

  const handleEventSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    localStorage.setItem('selectedEventId', selectedId);
    setEventId(selectedId); 
  };

  const handleEventEditClick = async (eventId: string) => {
    try {
      const fullEvent = await getEventInfo(eventId);
      setEditingEvent(fullEvent);
    } catch (error) {
      toast.error('Failed to load event data');
      console.error(error);
    }
  };

  const handleSaveEvent = async (updated: Event) => {
    try {
      if (updated.eventId != '') {
        await updateEvent(updated.eventId, updated);
        setToastMsg('Event updated successfully!');
      } else {
        await createEvent(updated);
        toast.success('Event created!');
      }

      setEditingEvent(null);
      const refreshed = await getEvents();
      setEvents(refreshed);

      if (updated.eventId === eventId) {
        setEventId(updated.eventId);
      }
      setActiveTab('events');
    } catch (error) {
      console.error(error);
      setToastMsg('Error updating event.');
    }
  };

  const handleDeleteEvent = async (idToDelete: string) => {
    try {
      await deleteEvent(idToDelete);
      setToastMsg('Event deleted successfully!');
      setEditingEvent(null);

      const refreshed = await getEvents();
      setEvents(refreshed);

      // If the deleted event was the selected one, update eventId
      if (idToDelete === eventId) {
        const fallbackEventId = refreshed[0]?.eventId || '';
        localStorage.setItem('selectedEventId', fallbackEventId);
        setEventId(fallbackEventId);
      }

      setActiveTab('events');
    } catch (error) {
      console.error(error);
      setToastMsg('Error deleting event.');
    }
  };


  const handleSaveGroup = async (updated: Group) => {
    try {
      await updateGroup(eventId, updated.groupId, updated);
      setToastMsg('Group updated successfully!');
      setEditingGroup(null);
      // Refresh groups
      const refreshed = await getGroups(eventId);
      setGroups(refreshed);
      setActiveTab('groups');
    } catch (error) {
      console.error(error);
      setToastMsg('Error updating group.');
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await deleteGroup(eventId, groupId);
      setToastMsg('Group deleted successfully!');
      setEditingGroup(null);
      const refreshed = await getGroups(eventId);
      setGroups(refreshed);
    } catch (error) {
      console.error(error);
      setToastMsg('Error deleting group.');
    }
  };

  const handleGroupClick = async (groupId: string) => {
    try {
      const fullGroup = await getGroup(eventId, groupId);
      setEditingGroup(fullGroup);
    } catch (error) {
      toast.error('Failed to load group data');
      console.error(error);
    }
  };

  const handleDeleteReceipt = async (receiptId: string) => {
    try {
      await deleteReceipt(eventId, editingGroup!.groupId!, receiptId);
      setEditingGroup(prev => {
      if (!prev || !prev.groupId) return prev;

      return {
        ...prev,
        receipts: prev.receipts?.filter(r => r.receiptId !== receiptId) || []
      };
    });
      toast.success('Receipt deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete receipt');
    }
  };

  const handleTierChange = (index: number, field: keyof PriceTier, value: string) => {
    const updatedTiers = [...editingEvent!.priceTiers];
    updatedTiers[index] = {
        ...updatedTiers[index],
        [field]: field === "price" ? parseFloat(value) : field === 'priceChangeDate' ? new Date(value) : value,
    };
    setEditingEvent(prev => {
      if (!prev) return null;
      return {
        ...prev,
        priceTiers: updatedTiers,
      };
    });
  };

  const handleAddTier = () => {
    setEditingEvent(prev => {
      if (!prev) return null;
      return {
        ...prev,
        priceTiers: [...prev.priceTiers, { tierName: "", price: 0, priceChangeDate: new Date() }],
      };
    });
  };

  const handleRemoveTier = (index: number) => {
    const updatedTiers = [...editingEvent!.priceTiers];
    updatedTiers.splice(index, 1);
    setEditingEvent(prev => {
      if (!prev) return null;
      return {
        ...prev,
        priceTiers: updatedTiers,
      };
    });
  };

  const filteredGroups = groups
    .filter(group => {
      const search = searchTerm.toLowerCase();
      const matchesGroupName = group.groupName.toLowerCase().includes(search);
      const matchesLeaderName = group.leaderName.toLowerCase().includes(search);
      const matchesReceiptId = group.receipts?.some(receipt =>
        receipt.receiptId?.toLowerCase().includes(search)
      );
      return matchesGroupName || matchesLeaderName || matchesReceiptId;
  })
    .sort((a, b) => a[groupSortKey].localeCompare(b[groupSortKey])
  );

  const filteredEvents = events
    .filter(evt => evt.eventName.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a[eventSortKey].localeCompare(b[eventSortKey])
  );


  if (authLoading || loading || loadingEvent) return <Spinner />;

  return (
    <div className="flex h-screen overflow-hidden">
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

      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button
            ref={toggleButtonRef}
            variant="ghost"
            className="md:hidden fixed bottom-6 left-4 z-50 bg-white shadow-lg rounded-full p-5"
            onClick={() => setSidebarOpen(prev => !prev)}
          >
            <Menu size={44} />
          </Button>
        </div>
        

        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'groups' | 'events')} className="w-full">
          <TabsList>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="groups">
            <DashboardStats groups={groups} maxAttendees={currentEvent?.maxAttendees ?? null} />
        
            <SearchAndSort
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              sortKey={groupSortKey}
              setSortKey={setGroupSortKey}
              placeholder={
                windowWidth < 640 ? 'Search...' : 'Search by group, leader, or receipt ID'
              }
              options={['groupName', 'leaderName']}
            />
  
            <GroupList groups={filteredGroups} onGroupClick={handleGroupClick} />
            {/* Group Modal */}
            {editingGroup && (
              <EditGroupModal
                group={editingGroup}
                setGroup={setEditingGroup}
                onClose={() => setEditingGroup(null)}
                onSave={handleSaveGroup}
                onDeleteGroup={handleDeleteGroup}
                onDeleteReceipt={handleDeleteReceipt}
              />
            )}    
          </TabsContent>

          <TabsContent value="events">
            <SearchAndSort
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              sortKey={eventSortKey}
              setSortKey={setEventSortKey}
              placeholder={windowWidth < 640 ? 'Search...' : 'Search by event name'}
              options={['eventName']}
            />

            <Button
              className="mb-4"
              onClick={() =>
                setEditingEvent({
                  eventId: '',
                  eventName: '',
                  eventDate: new Date(),
                  registrationStartDate: new Date(),
                  maxAttendees: 0,
                  registrationOpen: false,
                  waiverURL: '',
                  priceTiers: [],
                })
              }
            >
              Create New Event
            </Button>

            {!editingEvent && (
              <EventList 
              events={filteredEvents} 
              onEventClick={handleEventEditClick} 
              onDeleteEvent={handleDeleteEvent}
              />
            )}

            
            {editingEvent && (
              <EditEventModal
                event={editingEvent}
                setEvent={setEditingEvent}
                onClose={() => setEditingEvent(null)}
                onSave={handleSaveEvent}
                onAddTier={handleAddTier}
                onRemoveTier={handleRemoveTier}
                onTierChange={handleTierChange}
              />
            )}
          </TabsContent>
        </Tabs>

        <Outlet context={{ eventId }} />
      </main>

      
    </div>
  )
}

export default AdminDashboard;
