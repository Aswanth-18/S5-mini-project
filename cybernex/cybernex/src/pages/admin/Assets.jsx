import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { usePermissions } from '../../hooks/usePermissions';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DataTable from '../../components/common/DataTable';
import SearchBar from '../../components/common/SearchBar';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { Plus, Edit2, Trash2, Eye, Download, Upload, Image, FileText, Database, Filter, Server, Code, Folder, Clock, CheckCircle, X } from 'lucide-react';

const Assets = () => {
  const { user } = useAuth();
  const { isLoading } = useData();
  const { hasPermission } = usePermissions();
  
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    images: 0,
    documents: 0,
    videos: 0,
    labs: 0,
    totalSize: 0
  });

  // Mock data for assets - in a real app this would come from context/data
  const mockAssets = [
    {
      id: 'ASSET-001',
      name: 'Cybersecurity Fundamentals PDF',
      type: 'document',
      category: 'course_material',
      extension: 'pdf',
      size: 2.5,
      uploadedBy: 'admin',
      uploadedAt: new Date('2024-01-15T10:30:00').toISOString(),
      lastModified: new Date('2024-01-15T10:30:00').toISOString(),
      downloads: 125,
      isActive: true,
      description: 'Comprehensive guide to cybersecurity fundamentals'
    },
    {
      id: 'ASSET-002',
      name: 'Network Security Diagram',
      type: 'image',
      category: 'diagram',
      extension: 'png',
      size: 1.2,
      uploadedBy: 'faculty-001',
      uploadedAt: new Date('2024-02-20T14:45:00').toISOString(),
      lastModified: new Date('2024-03-10T09:15:00').toISOString(),
      downloads: 89,
      isActive: true,
      description: 'Network security architecture diagram'
    },
    {
      id: 'ASSET-003',
      name: 'Linux Security Lab',
      type: 'lab',
      category: 'practice',
      extension: 'zip',
      size: 15.8,
      uploadedBy: 'faculty-002',
      uploadedAt: new Date('2024-03-05T16:20:00').toISOString(),
      lastModified: new Date('2024-03-05T16:20:00').toISOString(),
      downloads: 45,
      isActive: true,
      description: 'Linux security configuration lab environment'
    },
    {
      id: 'ASSET-004',
      name: 'Web Security Video Tutorial',
      type: 'video',
      category: 'tutorial',
      extension: 'mp4',
      size: 125.5,
      uploadedBy: 'admin',
      uploadedAt: new Date('2024-02-28T11:00:00').toISOString(),
      lastModified: new Date('2024-03-12T13:45:00').toISOString(),
      downloads: 203,
      isActive: true,
      description: 'Comprehensive web security tutorial video'
    },
    {
      id: 'ASSET-005',
      name: 'Password Policy Template',
      type: 'document',
      category: 'template',
      extension: 'docx',
      size: 0.8,
      uploadedBy: 'faculty-001',
      uploadedAt: new Date('2024-01-10T08:45:00').toISOString(),
      lastModified: new Date('2024-01-20T10:20:00').toISOString(),
      downloads: 67,
      isActive: false,
      description: 'Organization password policy template'
    }
  ];

  useEffect(() => {
    if (mockAssets.length > 0) {
      setFilteredAssets(mockAssets);
      
      const images = mockAssets.filter(a => a.type === 'image').length;
      const documents = mockAssets.filter(a => a.type === 'document').length;
      const videos = mockAssets.filter(a => a.type === 'video').length;
      const labs = mockAssets.filter(a => a.type === 'lab').length;
      const totalSize = mockAssets.reduce((sum, a) => sum + a.size, 0);
      
      setStats({
        total: mockAssets.length,
        images,
        documents,
        videos,
        labs,
        totalSize
      });
    }
  }, []);

  useEffect(() => {
    let filtered = [...mockAssets];
    
    // Filter by search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(lowerQuery) ||
        asset.description.toLowerCase().includes(lowerQuery) ||
        asset.id.toLowerCase().includes(lowerQuery) ||
        asset.extension.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(asset => asset.type === filterType);
    }
    
    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(asset => asset.category === filterCategory);
    }
    
    // Sort by upload date (newest first)
    filtered.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    
    setFilteredAssets(filtered);
  }, [searchQuery, filterType, filterCategory]);

  const handleDelete = (asset) => {
    setSelectedAsset(asset);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedAsset) return;
    
    try {
      // In a real app, this would call a service to delete the asset
      // For now, we'll just close the modal
      setShowDeleteModal(false);
      setSelectedAsset(null);
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'image': return <Image size={20} />;
      case 'document': return <FileText size={20} />;
      case 'video': return <Database size={20} />;
      case 'lab': return <Code size={20} />;
      default: return <Server size={20} />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'image': return 'bg-purple-100 text-purple-800';
      case 'document': return 'bg-blue-100 text-blue-800';
      case 'video': return 'bg-orange-100 text-orange-800';
      case 'lab': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'course_material': return 'bg-yellow-100 text-yellow-800';
      case 'practice': return 'bg-green-100 text-green-800';
      case 'tutorial': return 'bg-blue-100 text-blue-800';
      case 'template': return 'bg-purple-100 text-purple-800';
      case 'diagram': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    {
      header: 'Asset',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(row.type)}`}>
            {getTypeIcon(row.type)}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{row.name}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">.{row.extension}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Type',
      accessor: 'type',
      render: (row) => (
        <Badge className={getTypeColor(row.type)}>
          {row.type.replace('_', ' ')}
        </Badge>
      )
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (row) => (
        <Badge className={getCategoryColor(row.category)}>
          {row.category.replace('_', ' ')}
        </Badge>
      )
    },
    {
      header: 'Size',
      accessor: 'size',
      render: (row) => (
        <div className="text-center">
          <div className="font-semibold text-gray-900 dark:text-white">{row.size} MB</div>
        </div>
      )
    },
    {
      header: 'Downloads',
      accessor: 'downloads',
      render: (row) => (
        <div className="text-center">
          <div className="font-semibold text-blue-600">{row.downloads}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">times</div>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'isActive',
      render: (row) => (
        <Badge className={getStatusColor(row.isActive)}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      header: 'Uploaded',
      accessor: 'uploadedAt',
      render: (row) => (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {new Date(row.uploadedAt).toLocaleDateString()}
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" startIcon={<Download size={14} />}>
            Download
          </Button>
          <Link to={`/admin/assets/${row.id}/edit`}>
            <Button variant="outline" size="sm" startIcon={<Edit2 size={14} />}>
              Edit
            </Button>
          </Link>
          {hasPermission('assets.manage') && (
            <Button 
              variant="outline" 
              size="sm" 
              startIcon={<Trash2 size={14} />} 
              onClick={() => handleDelete(row)}
              className="text-red-600 hover:text-red-700"
            >
              Delete
            </Button>
          )}
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Asset Library</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage all learning resources, documents, and media files</p>
        </div>
        
        {hasPermission('assets.manage') && (
          <Link to="/admin/assets/new">
            <Button variant="primary" startIcon={<Plus size={18} />}>
              Upload Asset
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="text-center">
          <Folder size={24} className="mx-auto mb-2 text-blue-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Assets</div>
        </Card>
        <Card className="text-center">
          <Image size={24} className="mx-auto mb-2 text-purple-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.images}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Images</div>
        </Card>
        <Card className="text-center">
          <FileText size={24} className="mx-auto mb-2 text-orange-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.documents}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Documents</div>
        </Card>
        <Card className="text-center">
          <Database size={24} className="mx-auto mb-2 text-green-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.videos}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Videos</div>
        </Card>
        <Card className="text-center">
          <Code size={24} className="mx-auto mb-2 text-yellow-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.labs}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Labs</div>
        </Card>
        <Card className="text-center">
          <Server size={24} className="mx-auto mb-2 text-red-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalSize.toFixed(1)} MB</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Size</div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex gap-4 flex-wrap items-center">
          <SearchBar
            placeholder="Search assets by name, type, or extension..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="flex-1 min-w-[250px]"
          />
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="select select-primary select-sm"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="document">Documents</option>
              <option value="video">Videos</option>
              <option value="lab">Labs</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="select select-primary select-sm"
            >
              <option value="all">All Categories</option>
              <option value="course_material">Course Material</option>
              <option value="practice">Practice</option>
              <option value="tutorial">Tutorial</option>
              <option value="template">Template</option>
              <option value="diagram">Diagram</option>
            </select>
          </div>
          
          <Button 
            variant="outline" 
            startIcon={<Filter size={16} />} 
            onClick={() => {
              setSearchQuery('');
              setFilterType('all');
              setFilterCategory('all');
            }}
            className="ml-auto"
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Assets Table */}
      <Card>
        <DataTable
          columns={columns}
          data={filteredAssets}
          keyExtractor={(row) => row.id}
          emptyMessage="No assets found"
          emptyIcon={<Folder size={48} className="text-gray-400" />}
        />
      </Card>

      {/* Bulk Actions */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bulk Actions</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Perform actions on multiple assets at once
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" startIcon={<Upload size={16} />}>
              Bulk Upload
            </Button>
            <Button variant="outline" startIcon={<Download size={16} />}>
              Bulk Download
            </Button>
            {hasPermission('assets.manage') && (
              <Button variant="outline" startIcon={<Trash2 size={16} />} className="text-red-600">
                Bulk Delete
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Asset"
        message={`Are you sure you want to delete "${selectedAsset?.name || ''}"? This action cannot be undone and the file will be permanently removed from the system.`}
        confirmText="Delete Asset"
        confirmVariant="danger"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Assets;