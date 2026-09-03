import React, { useState, useMemo } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { FileText, Search, Filter, AlertTriangle, CheckCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react';

/**
 * LogAnalyzer Component
 * Displays and analyzes log files for assessment questions
 */
const LogAnalyzer = ({
  logData = '',
  filters = [],
  suspiciousEntries = [],
  onFilterSelect = () => {},
  onSearch = () => {}
}) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter log data based on search and filter
  const filteredLogs = useMemo(() => {
    let result = logData || '';
    
    // Apply search
    if (searchQuery && logData) {
      result = logData.split('\n')
        .filter(line => line.toLowerCase().includes(searchQuery.toLowerCase()))
        .join('\n');
    }
    
    return result;
  }, [logData, searchQuery, selectedFilter]);

  // Count suspicious entries
  const suspiciousCount = suspiciousEntries.length;
  const errorCount = (logData || '').split('\n').filter(line => 
    line.includes('ERROR') || line.includes('error') || line.includes('Failed')
  ).length;
  const warningCount = (logData || '').split('\n').filter(line => 
    line.includes('WARN') || line.includes('warning') || line.includes('Warning')
  ).length;

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    onFilterSelect(filter);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  // Highlight suspicious entries
  const highlightSuspicious = (line, lineNumber) => {
    const isSuspicious = suspiciousEntries.includes(lineNumber);
    const hasError = line.includes('ERROR') || line.includes('error') || line.includes('Failed');
    const hasWarning = line.includes('WARN') || line.includes('warning') || line.includes('Warning');
    
    return (
      <div 
        className={`px-2 py-1 rounded ${isSuspicious ? 'bg-red-100 dark:bg-red-900/30' : 
                   hasError ? 'bg-red-50 dark:bg-red-900/20' :
                   hasWarning ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}`}
      >
        {line}
      </div>
    );
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <FileText size={24} className="text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Log Analysis
          </h2>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 flex-wrap">
          <StatBadge
            icon={<AlertTriangle size={14} className="text-red-600" />}
            label="Suspicious"
            value={suspiciousCount}
            color="red"
          />
          <StatBadge
            icon={<XCircle size={14} className="text-red-600" />}
            label="Errors"
            value={errorCount}
            color="red"
          />
          <StatBadge
            icon={<AlertTriangle size={14} className="text-yellow-600" />}
            label="Warnings"
            value={warningCount}
            color="yellow"
          />
        </div>

        {/* Search and Filter */}
        <form onSubmit={handleSearch} className="flex gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search logs..."
              className="input input-primary w-full pr-10"
            />
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="select select-primary min-w-[150px]"
          >
            <option value="all">All Logs</option>
            <option value="errors">Errors Only</option>
            <option value="warnings">Warnings Only</option>
            <option value="suspicious">Suspicious Only</option>
          </select>
          <Button type="submit" startIcon={<Search size={14} />}>
            Search
          </Button>
        </form>

        {/* Log Content */}
        <div className="flex-1 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-900 text-green-400 font-mono text-xs">
          {logData ? (
            <pre className="whitespace-pre-wrap break-words">
              {filteredLogs.split('\n').map((line, index) => (
                <div key={index} className="min-h-[1.25rem]">
                  {highlightSuspicious(line, index + 1)}
                </div>
              ))}
            </pre>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>No log data available</p>
            </div>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 flex-wrap pt-2 border-t border-gray-200 dark:border-gray-700">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSelectedFilter('all')}
          >
            Show All
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSelectedFilter('errors')}
            startIcon={<XCircle size={12} />}
          >
            Errors ({errorCount})
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSelectedFilter('warnings')}
            startIcon={<AlertTriangle size={12} />}
          >
            Warnings ({warningCount})
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSelectedFilter('suspicious')}
            startIcon={<TrendingUp size={12} />}
          >
            Suspicious ({suspiciousCount})
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Stat Badge Component
const StatBadge = ({ icon, label, value, color = 'gray' }) => (
  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/30`}>
    {icon}
    <div>
      <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-600 dark:text-gray-300">{label}</p>
    </div>
  </div>
);

LogAnalyzer.defaultProps = {
  logData: '',
  filters: [],
  suspiciousEntries: [],
  onFilterSelect: () => {},
  onSearch: () => {}
};

export default LogAnalyzer;