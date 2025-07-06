import React, { useEffect, useRef } from 'react';
import {
  createChart,
  CrosshairMode,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
  CandlestickSeries,
} from 'lightweight-charts';

import { ChartData, TimeframeType } from '../types/trading';

interface MarketChartProps {
  data: ChartData[] | undefined;
  symbol: string;
  timeframe: TimeframeType;
  isRealData: boolean;
}

const MarketChart: React.FC<MarketChartProps> = ({
  data,
  symbol,
  timeframe,
  isRealData,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        backgroundColor: '#000',
        textColor: '#fff',
      },
      grid: {
        vertLines: { color: '#333' },
        horzLines: { color: '#333' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: { borderColor: '#475569' },
      timeScale: { borderColor: '#475569', timeVisible: true, secondsVisible: false },
      localization: { locale: 'en-US' },
    });

    candleSeriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      wickUpColor: '#22c55e',
    });

    return () => {
      chartRef.current?.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!candleSeriesRef.current) return;

    // Defensive: always map on array
    const safeData = Array.isArray(data) ? data : [];
    const lcData = safeData.map(d => ({
      time: Math.floor(new Date(d.timestamp).getTime() / 1000) as UTCTimestamp,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));

    candleSeriesRef.current.setData(lcData);
    chartRef.current?.timeScale().fitContent();
  }, [data]);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Optional: show message if no data at all
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div
        style={{
          width: '100%',
          height: 400,
          background: '#000',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 18,
        }}
      >
        No chart data available.
      </div>
    );
  }

  return (
    <div
      ref={chartContainerRef}
      style={{
        width: '100%',
        height: 400,
        background: '#000',
        borderRadius: '10px',
      }}
    />
  );
};

export default MarketChart;
