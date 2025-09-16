'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Search, Filter, ChevronRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: 'cultural' | 'sports' | 'meeting' | 'celebration' | 'workshop' | 'maintenance';
  maxAttendees?: number;
  currentAttendees: number;
  isPublic: boolean;
  organizer: string;
  imageUrl?: string;
}

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'New Year Celebration 2024',
        description: 'Join us for a spectacular New Year celebration with cultural programs, dinner, and fireworks. Fun activities for all ages including games, music, and dance performances.',
        date: '2024-01-31',
        time: '20:00',
        location: 'Community Hall',
        category: 'celebration',
        maxAttendees: 200,
        currentAttendees: 145,
        isPublic: true,
        organizer: 'Event Committee'
      },
      {
        id: '2',
        title: 'Monthly Community Meeting',
        description: 'Regular monthly meeting to discuss community matters, upcoming projects, and resident concerns. All residents are encouraged to participate.',
        date: '2024-02-15',
        time: '19:00',
        location: 'Community Hall',
        category: 'meeting',
        currentAttendees: 0,
        isPublic: true,
        organizer: 'Management Committee'
      },
      {
        id: '3',
        title: 'Cricket Tournament',
        description: 'Annual inter-building cricket tournament. Teams from each building will compete for the championship trophy. Registration required.',
        date: '2024-02-20',
        time: '16:00',
        location: 'Sports Ground',
        category: 'sports',
        maxAttendees: 100,
        currentAttendees: 67,
        isPublic: true,
        organizer: 'Sports Committee'
      },
      {
        id: '4',
        title: 'Gardening Workshop',
        description: 'Learn about organic gardening, composting, and plant care. Expert gardeners will share tips and techniques for maintaining beautiful gardens.',
        date: '2024-02-25',
        time: '10:00',
        location: 'Garden Area',
        category: 'workshop',
        maxAttendees: 30,
        currentAttendees: 18,
        isPublic: true,
        organizer: 'Green Committee'
      },
      {
        id: '5',
        title: 'Cultural Evening',
        description: 'An evening of music, dance, and poetry performances by talented residents. Showcase your skills or enjoy the performances.',
        date: '2024-03-05',
        time: '18:30',
        location: 'Community Hall',
        category: 'cultural',
        maxAttendees: 150,
        currentAttendees: 89,
        isPublic: true,
        organizer: 'Cultural Committee'
      }
    ];

    setTimeout(() => {
      setEvents(mockEvents);
      setIsLoading(false);
    }, 1000);
  }, []);

  const categories = [
    { value: 'all', label: 'All Events' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'sports', label: 'Sports' },
    { value: 'meeting', label: 'Meetings' },
    { value: 'celebration', label: 'Celebrations' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'maintenance', label: 'Maintenance' }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory && event.isPublic;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cultural': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'sports': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'meeting': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'celebration': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400';
      case 'workshop': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'maintenance': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isEventUpcoming = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    return eventDate >= today;
  };

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200/50 dark:border-purple-700/50 backdrop-blur-sm mb-6">
            <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
            <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm">
              Community Events
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Events Calendar
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover and participate in exciting community events and activities
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={Search}
                  className="w-full"
                />
              </div>
              <div className="md:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-white"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Events List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-300 mt-4">Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-12"
            >
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No events found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No events have been scheduled yet.'}
              </p>
            </motion.div>
          ) : (
            filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Badge className={getCategoryColor(event.category)}>
                        {event.category.toUpperCase()}
                      </Badge>
                      {isEventUpcoming(event.date) && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          UPCOMING
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {event.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {event.description}
                    </p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <Clock className="w-4 h-4 text-purple-500" />
                        <span>{formatTime(event.time)}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <MapPin className="w-4 h-4 text-purple-500" />
                        <span>{event.location}</span>
                      </div>
                      
                      {event.maxAttendees && (
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                          <Users className="w-4 h-4 text-purple-500" />
                          <span>{event.currentAttendees} / {event.maxAttendees} attendees</span>
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(event.currentAttendees / event.maxAttendees) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Organized by {event.organizer}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={ChevronRight}
                        iconPosition="right"
                        onClick={() => handleViewDetails(event)}
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Event Details Modal */}
        <Modal
          isOpen={showEventModal}
          onClose={() => setShowEventModal(false)}
          title={selectedEvent?.title || "Event Details"}
          showCloseButton={true}
        >
          {selectedEvent && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge className={getCategoryColor(selectedEvent.category)}>
                  {selectedEvent.category.toUpperCase()}
                </Badge>
                {isEventUpcoming(selectedEvent.date) && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    UPCOMING
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedEvent.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                      <p className="font-medium text-gray-900 dark:text-white">{formatDate(selectedEvent.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                      <p className="font-medium text-gray-900 dark:text-white">{formatTime(selectedEvent.time)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedEvent.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Organizer</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedEvent.organizer}</p>
                    </div>
                  </div>
                </div>

                {selectedEvent.maxAttendees && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Attendance</h4>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {selectedEvent.currentAttendees} / {selectedEvent.maxAttendees} attendees
                      </span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(selectedEvent.currentAttendees / selectedEvent.maxAttendees) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    disabled={!!(selectedEvent.maxAttendees && selectedEvent.currentAttendees >= selectedEvent.maxAttendees)}
                  >
                    {selectedEvent.maxAttendees && selectedEvent.currentAttendees >= selectedEvent.maxAttendees 
                      ? 'Event Full' 
                      : 'Register for Event'
                    }
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default EventsPage;