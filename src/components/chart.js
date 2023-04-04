import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

function Graph() {
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    const fetchDataAndGraph = async () => {
      try {
        const response = await fetch('log.txt');
        const data = await response.text();
        const lines = data.trim().split('\n');
        const newDataPoints = [];

        lines.forEach((line) => {
          const [ yValue] = line.split(',');
          newDataPoints.push({
            x: new Date().getTime(),
            y: parseFloat(yValue),
          });
        });

        setDataPoints(newDataPoints);
      } catch (error) {
        console.error(error);
      }
    };

    // call function initially
    fetchDataAndGraph();

    // call function every 5 seconds
    const interval = setInterval(fetchDataAndGraph, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = document.getElementById('myChart').getContext('2d');

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Detector de somnolencia',
            data: dataPoints,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            pointRadius: 0,
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                displayFormats: {
                  minute: 'h:mm:ss a',
                },
              },
              scaleLabel: {
                display: true,
                labelString: 'Time',
              },
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Y-value',
              },
            },
          ],
        },
      },
    });

    return () => chart.destroy();
  }, [dataPoints]);

  return <canvas id="myChart"></canvas>;
}

export default Graph;
