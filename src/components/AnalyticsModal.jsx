import React, { useState, useEffect } from 'react';
import { FiX, FiCalendar } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import ReactECharts from 'echarts-for-react';
import { format, subDays, parseISO, isWithinInterval } from 'date-fns';
import { da, nb } from 'date-fns/locale';

const AnalyticsModal = ({ widget, onClose }) => {
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [clickData, setClickData] = useState([]);
  const [totalClicks, setTotalClicks] = useState(0);

  const language = widget.language || 'da';
  const locale = language === 'da' ? da : nb;

  useEffect(() => {
    // Load click data from localStorage
    try {
      const allClickData = JSON.parse(localStorage.getItem('widgetClicks') || '{}');
      const widgetClicks = allClickData[widget.id] || [];
      
      // Filter clicks by date range
      const filteredClicks = widgetClicks.filter(click => {
        const clickDate = parseISO(click.timestamp);
        const start = new Date(`${startDate}T00:00:00`);
        const end = new Date(`${endDate}T23:59:59`);
        
        return isWithinInterval(clickDate, { start, end });
      });
      
      setClickData(filteredClicks);
      setTotalClicks(filteredClicks.length);
    } catch (err) {
      console.error('Error loading click data:', err);
      setClickData([]);
      setTotalClicks(0);
    }
  }, [widget.id, startDate, endDate]);

  const getChartOption = () => {
    // Group clicks by date
    const clicksByDate = {};
    
    clickData.forEach(click => {
      const date = format(parseISO(click.timestamp), 'yyyy-MM-dd');
      if (!clicksByDate[date]) {
        clicksByDate[date] = 0;
      }
      clicksByDate[date]++;
    });
    
    // Create date range for x-axis
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateRange = [];
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      dateRange.push(format(currentDate, 'yyyy-MM-dd'));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Create series data with all dates in range
    const seriesData = dateRange.map(date => {
      return {
        date,
        clicks: clicksByDate[date] || 0,
        displayDate: format(new Date(date), 'd. MMM', { locale })
      };
    });
    
    return {
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          const data = params[0].data;
          return `${data.displayDate}: ${data.clicks} ${language === 'da' ? 'klik' : 'klikk'}`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: seriesData.map(item => item.displayDate),
        axisLabel: {
          interval: Math.ceil(seriesData.length / 8),
          rotate: seriesData.length > 10 ? 45 : 0
        }
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        name: language === 'da' ? 'Antal klik' : 'Antall klikk'
      },
      series: [{
        name: language === 'da' ? 'Klik' : 'Klikk',
        type: 'bar',
        data: seriesData.map(item => ({
          value: item.clicks,
          date: item.date,
          displayDate: item.displayDate
        })),
        itemStyle: {
          color: '#3b82f6'
        }
      }]
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {language === 'da' ? 'Statistik for' : 'Statistikk for'}: {widget.productTitle}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <SafeIcon icon={FiX} className="text-2xl" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-blue-800 mb-2 flex items-center">
              <SafeIcon icon={FiCalendar} className="mr-2" />
              {language === 'da' ? 'Vælg datointerval' : 'Velg datoperiode'}
            </h3>
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'da' ? 'Fra dato' : 'Fra dato'}
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'da' ? 'Til dato' : 'Til dato'}
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">
                  {language === 'da' ? 'Klik i perioden' : 'Klikk i perioden'}
                </h4>
                <p className="text-3xl font-bold text-gray-900">{totalClicks}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">
                  {language === 'da' ? 'Klik i alt' : 'Klikk totalt'}
                </h4>
                <p className="text-3xl font-bold text-gray-900">{widget.clicks || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              {language === 'da' ? 'Klik over tid' : 'Klikk over tid'}
            </h3>
            {clickData.length > 0 ? (
              <div className="h-64">
                <ReactECharts option={getChartOption()} style={{height: '100%'}} />
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                {language === 'da' 
                  ? 'Ingen klikdata i den valgte periode' 
                  : 'Ingen klikkdata i valgte periode'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModal;