"use client"

import React from 'react';
import { Gauge } from '@mui/x-charts/Gauge';

interface SimpleGaugeProps {
  value: number | number;
  valueMin: number;
  valueMax: number;
  color: string;
}

const SimpleGauge: React.FC<SimpleGaugeProps> = ({ value, valueMin, valueMax, color }) => {

  const res = Math.min(valueMax, value)

  return (
      <Gauge
        title='Daily Intakes'
        height={250}
        value={value}
        valueMin={valueMin}
        valueMax={valueMax}
        startAngle={0}
        endAngle={360}
        innerRadius={80}
        outerRadius={95}
        className='sm:w-[630px]'

        margin={{bottom: 0, left: 0, right: 0, top: 20}}
        sx={{
          [`& .MuiGauge-valueArc`]: {
            fill: `${color}`,
            transition: 'linear 0.2s',
          },
          [`& .MuiGauge-valueText`]: {
            fontSize: 23,
            fontWeight: "medium", 
          },
        }}
        text={
           () => `${ Math.abs(valueMax - value)} ${value > valueMax ? "\nexceeded" : "\nremains"}`
        }
      />
  );
};

export default SimpleGauge;