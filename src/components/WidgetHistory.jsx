import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiClock, FiMousePointer, FiBarChart2, FiInfo } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const WidgetHistory = ({ widgetHistory, loadWidget, deleteWidget, viewAnalytics }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredWidget, setHoveredWidget] = useState(null);

  if (widgetHistory.length === 0) {
    return null;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <SafeIcon icon={FiClock} className="text-blue-500" />
          Tidligere widgets
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800"
        >
          {isExpanded ? 'Vis mindre' : 'Vis alle'}
        </button>
      </div>
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Navn
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Oprettet
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sprog
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center justify-center">
                  <SafeIcon icon={FiMousePointer} className="mr-1" />
                  Klik
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Handlinger
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(isExpanded ? widgetHistory : widgetHistory.slice(0, 5)).map((widget) => (
              <tr 
                key={widget.id} 
                className="hover:bg-gray-50"
                onMouseEnter={() => setHoveredWidget(widget.id)}
                onMouseLeave={() => setHoveredWidget(null)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{widget.productTitle}</div>
                  {widget.lastModified && hoveredWidget === widget.id && (
                    <div className="text-xs text-gray-500">
                      Opdateret: {formatDate(widget.lastModified)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{formatDate(widget.createdAt)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {widget.language === 'da' ? 'Dansk' : 'Norsk'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm font-medium text-gray-900">{widget.clicks || 0}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center">
                    {widget.lastModified ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        <SafeIcon icon={FiInfo} className="mr-1" />
                        Auto-opdateret
                      </span>
                    ) : (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Standard
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => viewAnalytics(widget)}
                    className="text-green-600 hover:text-green-900 mr-3"
                    title="Vis statistik"
                  >
                    <SafeIcon icon={FiBarChart2} className="inline mr-1" />
                    Statistik
                  </button>
                  <button
                    onClick={() => loadWidget(widget)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <SafeIcon icon={FiEdit} className="inline mr-1" />
                    Rediger
                  </button>
                  <button
                    onClick={() => deleteWidget(widget.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <SafeIcon icon={FiTrash2} className="inline mr-1" />
                    Slet
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WidgetHistory;