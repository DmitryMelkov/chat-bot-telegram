// chartConfig.js
import ChartDataLabels from 'chartjs-plugin-datalabels';

export const getChartConfig = ({ labels, data, title }) => {
  return {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 18,
          },
        },
        legend: {
          display: false,
        },
        datalabels: {
          anchor: 'end',
          align: 'start',
          formatter: (value) => (value !== 0 ? `${value}` : ''),
          font: {
            weight: 'normal',
            size: 13,
          },
          color: '#000',
        },
      },
    },
    plugins: [ChartDataLabels],
  };
};