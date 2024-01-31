// MainView.jsx
import React from 'react';
// import StatisticsGraph from './StatisticsGraph';

const MainView = () => {
  // Example data for Doughnut chart
  const doughnutData = {
    labels: ['Label 1', 'Label 2', 'Label 3'],
    values: [12, 12, 12],
    colors: ['red', 'blue', 'green'], // Example colors
  };

  return (
    <div>
      <h1>Main View</h1>
      {/* Other components or content */}
      {/* <StatisticsGraph data={doughnutData} /> */}
    </div>
  );
};

export default MainView;
