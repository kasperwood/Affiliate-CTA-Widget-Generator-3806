import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiClock, FiUser, FiSearch, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { motion, AnimatePresence } from 'framer-motion';

const WidgetHistory = ({ widgetHistory, loadWidget, deleteWidget, isLoading }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);

  if (widgetHistory.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <SafeIcon icon={FiClock} className="text-blue-500" />
            Alle Widgets
          </h2>
        </div>
        <p className="text-gray-500 text-center py-4">
          {isLoading ? (
            <span className="flex flex-col items-center">
              <span className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></span>
              Indlæser widgets...
            </span>
          ) : (
            'Ingen widgets fundet. Opret din første widget ovenfor.'
          )}
        </p>
      </motion.div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const sortedAndFilteredWidgets = [...widgetHistory]
    .filter(widget => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        widget.productTitle.toLowerCase().includes(searchLower) ||
        widget.language.toLowerCase().includes(searchLower) ||
        (widget.userEmail && widget.userEmail.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.productTitle.localeCompare(b.productTitle);
          break;
        case 'language':
          comparison = a.language.localeCompare(b.language);
          break;
        case 'user':
          comparison = (a.userEmail || '').localeCompare(b.userEmail || '');
          break;
        default: // date
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const displayedWidgets = isExpanded ? sortedAndFilteredWidgets : sortedAndFilteredWidgets.slice(0, 5);

  const getSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortDirection === 'asc' ? <SafeIcon icon={FiChevronUp} className="ml-1" /> : <SafeIcon icon={FiChevronDown} className="ml-1" />;
  };

  const handleDeleteClick = (widgetId) => {
    setShowConfirmDelete(widgetId);
  };

  const confirmDelete = (widgetId) => {
    deleteWidget(widgetId);
    setShowConfirmDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <SafeIcon icon={FiClock} className="text-blue-500" />
          Alle Widgets ({widgetHistory.length})
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Søg widgets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <SafeIcon icon={FiSearch} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
          >
            <SafeIcon icon={isExpanded ? FiChevronUp : FiChevronDown} className="mr-1" />
            {isExpanded ? 'Vis mindre' : 'Vis alle'}
          </motion.button>
        </div>
      </div>

      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>Bemærk:</strong> Alle brugere kan se, redigere og slette alle widgets. Dette er en delt workspace.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('title')}>
                <div className="flex items-center">
                  Navn {getSortIcon('title')}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('date')}>
                <div className="flex items-center">
                  Oprettet {getSortIcon('date')}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('language')}>
                <div className="flex items-center">
                  Sprog {getSortIcon('language')}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('user')}>
                <div className="flex items-center">
                  Oprettet af {getSortIcon('user')}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Handlinger
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {displayedWidgets.map((widget) => (
                <motion.tr
                  key={widget.id}
                  className="hover:bg-gray-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{widget.productTitle}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(widget.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {widget.language === 'da' ? 'Dansk' : 'Norsk'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <SafeIcon icon={FiUser} className="text-gray-400 mr-1.5" />
                      <span className="text-sm text-gray-500">{widget.userEmail || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => loadWidget(widget)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <SafeIcon icon={FiEdit} className="inline mr-1" />
                      Rediger
                    </motion.button>
                    {showConfirmDelete === widget.id ? (
                      <span className="inline-flex items-center">
                        <span className="text-red-600 mr-2">Er du sikker?</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => confirmDelete(widget.id)}
                          className="text-green-600 hover:text-green-800 mr-2"
                        >
                          Ja
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={cancelDelete}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          Nej
                        </motion.button>
                      </span>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteClick(widget.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <SafeIcon icon={FiTrash2} className="inline mr-1" />
                        Slet
                      </motion.button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {displayedWidgets.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  Ingen resultater fundet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {sortedAndFilteredWidgets.length > 5 && !isExpanded && (
        <div className="mt-4 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(true)}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center mx-auto"
          >
            <SafeIcon icon={FiChevronDown} className="mr-1" />
            Vis alle {sortedAndFilteredWidgets.length} widgets
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default WidgetHistory;