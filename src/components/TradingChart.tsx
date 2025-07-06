import React from 'react';

const TradingChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No chart data available</p>
      </div>
    );
  }

  // Calculate min and max prices for scaling
  const prices = data.flatMap(d => [d.high, d.low]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;

  // Chart dimensions
  const chartHeight = 300;
  const chartWidth = 800;
  const padding = 40;

  const getY = (price) => {
    return chartHeight - padding - ((price - minPrice) / priceRange) * (chartHeight - 2 * padding);
  };

  const getX = (index) => {
    return padding + (index / (data.length - 1)) * (chartWidth - 2 * padding);
  };

  // Create path for the line chart
  const pathData = data.map((point, index) => {
    const x = getX(index);
    const y = getY(point.close);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-full">
        <svg width={chartWidth} height={chartHeight} className="border rounded-lg bg-white">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Price line */}
          <path
            d={pathData}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {data.map((point, index) => (
            <circle
              key={index}
              cx={getX(index)}
              cy={getY(point.close)}
              r="3"
              fill="#3b82f6"
              className="hover:r-5 transition-all cursor-pointer"
            >
              <title>{`Price: ${point.close}, Time: ${new Date(point.time).toLocaleString()}`}</title>
            </circle>
          ))}
          
          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const price = minPrice + ratio * priceRange;
            const y = getY(price);
            return (
              <g key={ratio}>
                <line x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                <text x={padding - 5} y={y + 4} textAnchor="end" fontSize="12" fill="#6b7280">
                  {price.toFixed(5)}
                </text>
              </g>
            );
          })}
          
          {/* X-axis labels */}
          {data.filter((_, index) => index % Math.ceil(data.length / 5) === 0).map((point, index) => {
            const originalIndex = index * Math.ceil(data.length / 5);
            const x = getX(originalIndex);
            return (
              <g key={originalIndex}>
                <line x1={x} y1={padding} x2={x} y2={chartHeight - padding} stroke="#e5e7eb" strokeWidth="1" />
                <text x={x} y={chartHeight - padding + 15} textAnchor="middle" fontSize="10" fill="#6b7280">
                  {new Date(point.time).toLocaleDateString()}
                </text>
              </g>
            );
          })}
        </svg>
        
        {/* Chart info */}
        <div className="mt-4 flex justify-between text-sm text-gray-600">
          <div>
            <span className="font-medium">Latest Price: </span>
            <span className="text-blue-600 font-semibold">{data[data.length - 1]?.close}</span>
          </div>
          <div>
            <span className="font-medium">Data Points: </span>
            <span>{data.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingChart;