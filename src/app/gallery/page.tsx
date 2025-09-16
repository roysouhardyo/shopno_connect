'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image, Search, Filter, Heart, Download, Eye, Grid, List } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: 'events' | 'facilities' | 'achievements' | 'community' | 'maintenance' | 'other';
  tags: string[];
  uploadedBy: string;
  isPublic: boolean;
  likes: number;
  views: number;
  createdAt: string;
}

const GalleryPage: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockGalleryItems: GalleryItem[] = [
      {
        id: '1',
        title: 'New Year Celebration 2024',
        description: 'Memorable moments from our grand New Year celebration with cultural programs and fireworks.',
        imageUrl: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&h=600&fit=crop',
        category: 'events',
        tags: ['celebration', 'new year', 'community', 'fireworks'],
        uploadedBy: 'Event Committee',
        isPublic: true,
        likes: 45,
        views: 234,
        createdAt: '2024-01-31T22:00:00Z'
      },
      {
        id: '2',
        title: 'Community Garden',
        description: 'Our beautiful community garden in full bloom during spring season.',
        imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
        category: 'facilities',
        tags: ['garden', 'flowers', 'nature', 'spring'],
        uploadedBy: 'Green Committee',
        isPublic: true,
        likes: 32,
        views: 156,
        createdAt: '2024-01-25T10:30:00Z'
      },
      {
        id: '3',
        title: 'Cricket Tournament Winners',
        description: 'Congratulations to Building A team for winning the annual cricket tournament.',
        imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=600&fit=crop',
        category: 'achievements',
        tags: ['cricket', 'tournament', 'winners', 'sports'],
        uploadedBy: 'Sports Committee',
        isPublic: true,
        likes: 67,
        views: 289,
        createdAt: '2024-01-20T18:45:00Z'
      },
      {
        id: '4',
        title: 'Community Hall Renovation',
        description: 'Before and after photos of our newly renovated community hall with modern facilities.',
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
        category: 'facilities',
        tags: ['renovation', 'community hall', 'modern', 'facilities'],
        uploadedBy: 'Management Committee',
        isPublic: true,
        likes: 28,
        views: 178,
        createdAt: '2024-01-15T14:20:00Z'
      },
      {
        id: '5',
        title: 'Children\'s Day Celebration',
        description: 'Fun-filled Children\'s Day celebration with games, performances, and prizes.',
        imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop',
        category: 'events',
        tags: ['children', 'celebration', 'games', 'fun'],
        uploadedBy: 'Cultural Committee',
        isPublic: true,
        likes: 89,
        views: 345,
        createdAt: '2024-01-10T16:00:00Z'
      },
      {
        id: '6',
        title: 'Swimming Pool Area',
        description: 'Our well-maintained swimming pool area perfect for relaxation and exercise.',
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
        category: 'facilities',
        tags: ['swimming pool', 'recreation', 'fitness', 'relaxation'],
        uploadedBy: 'Facilities Team',
        isPublic: true,
        likes: 41,
        views: 201,
        createdAt: '2024-01-08T12:15:00Z'
      }
    ];

    setTimeout(() => {
      setGalleryItems(mockGalleryItems);
      setIsLoading(false);
    }, 1000);
  }, []);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'events', label: 'Events' },
    { value: 'facilities', label: 'Facilities' },
    { value: 'achievements', label: 'Achievements' },
    { value: 'community', label: 'Community' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'other', label: 'Other' }
  ];

  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory && item.isPublic;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'events': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'facilities': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'achievements': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'community': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'maintenance': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-pink-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-200/50 dark:border-pink-700/50 backdrop-blur-sm mb-6">
            <Image className="w-5 h-5 text-pink-600 dark:text-pink-400 mr-2" />
            <span className="text-pink-600 dark:text-pink-400 font-semibold text-sm">
              Community Gallery
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Photo Gallery
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Share and view memorable moments from our vibrant community
          </p>
        </motion.div>

        {/* Search, Filter and View Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search photos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={Search}
                  className="w-full"
                />
              </div>
              <div className="lg:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900 dark:text-white"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  icon={Grid}
                  onClick={() => setViewMode('grid')}
                  className="px-4"
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  icon={List}
                  onClick={() => setViewMode('list')}
                  className="px-4"
                >
                  List
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Gallery Grid/List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
          {isLoading ? (
            <div className={`${viewMode === 'grid' ? 'col-span-full' : ''} text-center py-12`}>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-300 mt-4">Loading gallery...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`${viewMode === 'grid' ? 'col-span-full' : ''} text-center py-12`}
            >
              <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No photos found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No photos have been uploaded yet.'}
              </p>
            </motion.div>
          ) : (
            filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className={`overflow-hidden ${viewMode === 'list' ? 'flex' : ''}`}>
                  <div className={`${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'aspect-video'} relative overflow-hidden`}>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Heart}
                            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                          >
                            <span className="sr-only">Like</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Download}
                            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                          >
                            <span className="sr-only">Download</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={getCategoryColor(item.category)}>
                        {item.category.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    
                    {item.description && (
                      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded-md">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{item.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{item.views}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{item.uploadedBy}</div>
                        <div>{formatDate(item.createdAt)}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;