// @ts-nocheck
'use client'
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
} from 'chart.js';
import { useState, useEffect } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

const DailyTicketSalesChart = () => {
  const isMobile = useIsMobile();
  const now = new Date();
  const currentHour = now.getHours();

  // Toutes les heures formatées 00-23
  const allLabels = Array.from({length: 24}, (_, i) => 
    i.toString().padStart(2, '0')
  );

  // Version modifiée des labels avec "Now" à l'heure actuelle
  const formattedLabels = allLabels.map((label, i) => 
    i === currentHour ? `Now` : label
  );

  const allData = [];
  // const allData = [100, 85, 92, 105, 110, 100, 115, 120, 130, 140, 150, 160, 175, 190, 180, 170, 165, 160, 150, 145, 140, 135, 130, 125];

  // Fonction pour sélectionner 13 heures en mobile (incluant l'heure actuelle)
  const getMobileLabels = () => {
    const visibleHours = 13;
    const halfRange = Math.floor(visibleHours / 2);
    
    let start = Math.max(0, currentHour - halfRange);
    let end = Math.min(23, currentHour + halfRange);
    
    // Ajustement si près des bords
    if (start === 0) end = visibleHours - 1;
    if (end === 23) start = 23 - visibleHours + 1;
    
    return formattedLabels.slice(start, end + 1);
  };

  const data = {
    labels: isMobile ? getMobileLabels() : formattedLabels,
    datasets: [
      {
        label: 'Ventes',
        data: isMobile ? 
          allData.slice(
            allLabels.indexOf(getMobileLabels()[0].replace('Now (', '').substring(0, 2)),
            allLabels.indexOf(getMobileLabels()[getMobileLabels().length - 1].replace('Now (', '').substring(0, 2)) + 1
          ) 
          : allData,
        fill: {
          target: 'origin',
          above: (context: any) => {
            const chart = context.chart;
            const {ctx, chartArea} = chart;
            
            if (!chartArea) return;
            
            const gradient = ctx.createLinearGradient(
              0, chartArea.top,
              0, chartArea.bottom
            );
            
            gradient.addColorStop(0, 'rgba(249, 115, 22, 0.3)');
            gradient.addColorStop(0.5, 'rgba(249, 115, 22, 0.15)');
            gradient.addColorStop(1, 'rgba(249, 115, 22, 0)');
            
            return gradient;
          }
        },
        borderColor: '#F97316',
        borderWidth: 1.5,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointBackgroundColor: '#F97316',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context: any) => `${context.parsed.y}`,
          title: (context: any) => {
            const label = context[0].label;
            return label.includes('Now') ? `Heure actuelle` : `Heure: ${label}`;
          }
        },
        displayColors: false,
        backgroundColor: '#000000',
        titleFont: {
          size: 10,
          weight: 'normal',
          color: "#8F96A1"
        },
        bodyFont: {
          size: 18,
          weight: 'bold'
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          maxRotation: 0,
          minRotation: 0,
          padding: 14,
          autoSkip: false,
          font: (context: any) => ({
            size: isMobile ? 8 : 10,
            weight: context.tick.label.includes('Now') ? 'bold' : 'normal'
          }),
          color: (context: any) => 
            context.tick.label.includes('Now') ? '#F97316' : '#666',
        },
      },
      y: {
        beginAtZero: false,
        min: Math.min(...allData) * 0.9,
        grid: {
          color: '#E5E7EB',
          drawBorder: false,
        },
        border: {
          display: false
        },
        ticks: {
          display: false
        }
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div className="w-full h-[175px] lg:h-[200px]">
      <Line data={data} options={options} />
    </div>
  );
};

export default DailyTicketSalesChart;