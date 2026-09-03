import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { AlertTriangle, ShieldCheck, XCircle, CheckCircle, FileText, Search, Filter, Clock } from 'lucide-react';

/**
 * ViolationLogger Component
 * Logs and displays policy violations during assessments
 */
const ViolationLogger = ({
  violations = [],
  severityLevels = ['low', 'medium', 'high', 'critical'],
  onClearAll = () => {},
  onExport = () => {},
  autoClear = false
}) => {
  const [filteredSeverity, setFilteredSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredViolations = violations.filter(violation => {
    const matchesSeverity = filteredSeverity === 'all' || violation.severity === filteredSeverity;
    const matchesSearch = !searchQuery || 
      violation.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      violation.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      violation.timestamp.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return <XCircle size={14} />;
      case 'high': return <AlertTriangle size={14} />;
      case 'medium': return <AlertTriangle size={14} />;
      case 'low': return <ShieldCheck size={14} />;
      default: return <FileText size={14} />;
    }
  };

  const getActionIcon = (action) => {
    switch (action?.toLowerCase()) {
      case 'blocked': return <ShieldCheck size={12} />;
      case 'warned': return <AlertTriangle size={12} />;
      case 'deducted': return <XCircle size={12} />;
      default: return <FileText size={12} />;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle size={24} className="text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Violation Log
            </h2>
            <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              {violations.length} total
            </Badge>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onExport} startIcon={<FileText size={12} />}>
              Export
            </Button>
            <Button variant="danger" size="sm" onClick={onClearAll} startIcon={<XCircle size={12} />}>
              Clear All
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search violations..."
              className="input input-primary w-full pr-10"
            />
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          
          <select
            value={filteredSeverity}
            onChange={(e) => setFilteredSeverity(e.target.value)}
            className="select select-primary min-w-[150px]"
          >
            <option value="all">All Severities</option>
            {severityLevels.map(level => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)} Severity
              </option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {severityLevels.map(level => {
            const count = violations.filter(v => v.severity === level).length;
            return (
              <StatCard
                key={level}
                label={`${level.charAt(0).toUpperCase() + level.slice(1)}`}
                value={count}
                color={level}
                icon={getSeverityIcon(level)}
              />
            );
          })}
        </div>

        {/* Violations List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredViolations.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <ShieldCheck size={48} className="mx-auto mb-4 opacity-50" />
              <p>No violations detected</p>
              <p className="text-sm mt-2">Keep following the assessment policies</p>
            </div>
          ) : (
            filteredViolations.map((violation, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border border-gray-200 dark:border-gray-700 ${getSeverityColor(violation.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {getSeverityIcon(violation.severity)}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium text-gray-900 dark:text-white truncate">
                          {violation.type}
                        </h5>
                        <Badge className={getSeverityColor(violation.severity)}>
                          {violation.severity}
                        </Badge>
                        {violation.points && (
                          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">
                            -{violation.points} pts
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-1">
                        {violation.message}
                      </p>
                      
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        <Clock size={12} className="inline mr-1" />
                        {violation.timestamp || new Date().toLocaleTimeString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    {violation.action && (
                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200">
                        {getActionIcon(violation.action)} {violation.action}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {filteredViolations.length > 0 && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Summary:</strong> {filteredViolations.length} violations detected. 
              {violations.reduce((sum, v) => sum + (v.points || 0), 0) > 0 && (
                <span>Total penalty: -{violations.reduce((sum, v) => sum + (v.points || 0), 0)} points</span>
              )}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

// Stat Card Component
const StatCard = ({ label, value, color, icon }) => (
  <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
    <div className="flex items-center justify-center gap-1 mb-1">
      {icon}
      <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
    </div>
    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
  </div>
);

ViolationLogger.defaultProps = {
  violations: [],
  severityLevels: ['low', 'medium', 'high', 'critical'],
  onClearAll: () => {},
  onExport: () => {},
  autoClear: false
};

export default ViolationLogger;