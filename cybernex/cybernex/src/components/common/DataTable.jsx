import React, { useState, useCallback, useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  ChevronUp, ChevronDown, MoreHorizontal, Search,
  ChevronLeft, ChevronRight, Filter, Eye, EyeOff
} from 'lucide-react';
import Button from './Button';
import Dropdown from './Dropdown';
import Pagination from './Pagination';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';

/**
 * Reusable Data Table component with sorting, filtering, pagination, and selection
 */
const DataTable = ({
  columns = [],
  data = [],
  keyField = 'id',
  loading = false,
  error = null,
  pageSize = 10,
  onRowClick,
  onSelectionChange,
  selectedRows = [],
  showPagination = true,
  showSearch = true,
  showColumnVisibility = true,
  showRowSelection = true,
  emptyMessage = 'No data available',
  emptyDescription = 'There are no items to display',
  className = ''
}) => {
  const { isDarkMode } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map(col => ({ ...col, visible: col.visible !== false }))
  );
  const [rowSelection, setRowSelection] = useState(selectedRows || []);

  // Filter columns based on visibility
  const visibleColumnsList = useMemo(() =>
    visibleColumns.filter(col => col.visible)
  , [visibleColumns]);

  // Handle search
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search
  }, []);

  // Handle sort
  const handleSort = useCallback((key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  }, [sortConfig]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (sortConfig.direction === 'ascending') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [data, sortConfig]);

  // Filter data by search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return sortedData;

    return sortedData.filter(row => {
      return visibleColumnsList.some(column => {
        const value = row[column.key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchQuery.toLowerCase());
      });
    });
  }, [sortedData, searchQuery, visibleColumnsList]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() =>
    filteredData.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    )
  , [filteredData, currentPage, pageSize]);

  // Handle row selection
  const handleRowSelection = useCallback((rowId, checked) => {
    let newSelection;
    if (checked) {
      newSelection = [...rowSelection, rowId];
    } else {
      newSelection = rowSelection.filter(id => id !== rowId);
    }
    setRowSelection(newSelection);
    if (onSelectionChange) onSelectionChange(newSelection);
  }, [rowSelection, onSelectionChange]);

  // Handle select all
  const handleSelectAll = useCallback((checked) => {
    const allRowIds = paginatedData.map(row => row[keyField]);
    setRowSelection(checked ? allRowIds : []);
    if (onSelectionChange) onSelectionChange(checked ? allRowIds : []);
  }, [paginatedData, keyField, onSelectionChange]);

  // Toggle column visibility
  const toggleColumnVisibility = useCallback((key, visible) => {
    setVisibleColumns(prev =>
      prev.map(col => col.key === key ? { ...col, visible } : col)
    );
  }, []);

  // Check if row is selected
  const isRowSelected = useCallback((rowId) =>
    rowSelection.includes(rowId)
  , [rowSelection]);

  // Check if all rows are selected
  const allRowsSelected = useMemo(() =>
    paginatedData.length > 0 &&
    paginatedData.every(row => rowSelection.includes(row[keyField]))
  , [paginatedData, rowSelection, keyField]);

  // Render cell value
  const renderCell = useCallback((row, column) => {
    const value = row[column.key];

    if (column.render) {
      return column.render(row, column);
    }

    if (value === null || value === undefined) {
      return <span className="text-gray-400">-</span>;
    }

    if (typeof value === 'boolean') {
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
        }`}>
          {value ? 'Yes' : 'No'}
        </span>
      );
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return value;
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className={`card ${className}`}>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`card ${className}`}>
        <EmptyState
          message="Error loading data"
          description={error}
          type="error"
        />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Left controls */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {showSearch && (
            <div className="w-full sm:w-64">
              <SearchBar
                placeholder={`Search ${visibleColumnsList.length} columns...`}
                onSearch={handleSearch}
                debounce={300}
              />
            </div>
          )}

          {showColumnVisibility && columns.length > 1 && (
            <Dropdown
              options={visibleColumns.map(col => ({
                value: col.key,
                label: col.header,
                checked: col.visible
              }))}
              value={visibleColumns.find(c => c.visible)?.key || ''}
              onChange={(key) => {
                const column = visibleColumns.find(c => c.key === key);
                toggleColumnVisibility(key, !column?.visible);
              }}
              placeholder="Columns"
              size="sm"
            />
          )}
        </div>

        {/* Right controls - for batch actions */}
        <div className="flex items-center gap-2">
          {showRowSelection && (
            <>
              <Button
                variant="outline"
                size="sm"
                disabled={rowSelection.length === 0}
              >
                Actions ({rowSelection.length} selected)
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {showRowSelection && (
                <th className="w-12 px-3 py-3 text-left">
                  <Checkbox
                    checked={allRowsSelected}
                    indeterminate={
                      rowSelection.length > 0 &&
                      rowSelection.length < paginatedData.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
              )}

              {visibleColumnsList.map((column) => (
                <th
                  key={column.key}
                  className={`px-3 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  } ${column.sortable ? 'cursor-pointer select-none' : ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.sortable && sortConfig?.key === column.key && (
                      sortConfig.direction === 'ascending' ?
                      <ChevronUp className="w-4 h-4" /> :
                      <ChevronDown className="w-4 h-4" />
                    )}
                    {column.sortable && sortConfig?.key !== column.key && (
                      <MoreHorizontal className="w-4 h-4 opacity-30" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <tr
                  key={row[keyField]}
                  className={`border-b border-gray-200 dark:border-gray-700 ${
                    onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''
                  }`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {showRowSelection && (
                    <td className="w-12 px-3 py-3">
                      <Checkbox
                        checked={isRowSelected(row[keyField])}
                        onChange={(checked) => handleRowSelection(row[keyField], checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}

                  {visibleColumnsList.map((column) => (
                    <td
                      key={column.key}
                      className="px-3 py-3 text-sm text-gray-900 dark:text-gray-100"
                    >
                      {renderCell(row, column)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={visibleColumnsList.length + (showRowSelection ? 1 : 0)}>
                  <EmptyState
                    message={emptyMessage}
                    description={emptyDescription}
                    className="py-8"
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          maxVisiblePages={5}
        />
      )}
    </div>
  );
};

// Default Checkbox component for row selection
const Checkbox = ({ checked, indeterminate, onChange, ...props }) => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-500"
      {...props}
    />
  );
};

export default DataTable;