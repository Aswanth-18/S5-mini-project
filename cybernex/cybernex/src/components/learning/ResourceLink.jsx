import React, { useState } from 'react';
import { ExternalLink, BookOpen, FileText, PlayCircle, Download, Eye, EyeOff } from 'lucide-react';

/**
 * ResourceLink Component
 * Displays an external resource link with preview and actions
 */
const ResourceLink = ({
  url = '#',
  title = 'Resource Title',
  type = 'document',
  description = 'Resource description',
  isExternal = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTypeIcon = () => {
    switch (type.toLowerCase()) {
      case 'video': return <PlayCircle size={18} className="text-red-600" />;
      case 'article': return <BookOpen size={18} className="text-blue-600" />;
      case 'document': return <FileText size={18} className="text-green-600" />;
      case 'download': return <Download size={18} className="text-purple-600" />;
      default: return <ExternalLink size={18} className="text-gray-600" />;
    }
  };

  const getTypeLabel = () => {
    switch (type.toLowerCase()) {
      case 'video': return 'Video';
      case 'article': return 'Article';
      case 'document': return 'Document';
      case 'download': return 'Download';
      default: return 'Link';
    }
  };

  const handleClick = (e) => {
    if (isExternal) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    e.stopPropagation();
  };

  const getShortenedUrl = (url) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace('www.', '') + (parsed.pathname.length > 20 ? '...' : parsed.pathname);
    } catch {
      return url.length > 30 ? url.substring(0, 30) + '...' : url;
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col">
        <div 
          className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                {getTypeIcon()}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white truncate">{title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 px-2 py-0.5 rounded">
                    {getTypeLabel()}
                  </span>
                  {isExternal && <ExternalLink size={12} className="text-gray-400" />}
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              {isExpanded ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{description}</p>
            <div className="flex items-center justify-between">
              <button
                onClick={handleClick}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                {isExternal ? 'Open Resource' : 'View Resource'}
              </button>
              <a
                href={url}
                target={isExternal ? '_blank' : '_self'}
                rel={isExternal ? 'noopener noreferrer' : ''}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {getShortenedUrl(url)}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ResourceLink.defaultProps = {
  url: '#',
  title: 'Resource Title',
  type: 'document',
  description: 'Resource description',
  isExternal: true
};

export default ResourceLink;