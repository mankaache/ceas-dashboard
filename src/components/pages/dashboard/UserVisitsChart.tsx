// UserVisitsChart.tsx
import React from "react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import { ChartData, ChartOptions, registerables } from "chart.js";
import {
  Chart,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import dayjs from "dayjs";
import "chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm";

dayjs.locale("fr");

Chart.register(
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TimeScale,
  ...registerables
);

interface VisitData {
  date: string; // Assuming 'date' is a string in ISO format (or can be Date)
  visits: number;
}

interface UserVisitsChartProps {
  data: VisitData[];
}

const UserVisitsChart: React.FC<UserVisitsChartProps> = ({ data }) => {
  const [selectedPoint, setSelectedPoint] = React.useState<number | null>(null);

  const chartData: ChartData<"line", number[], string> = {
    labels: data.map((entry) => entry.date),
    datasets: [
      {
        label: "Number of Users",
        data: data.map((entry) => entry.visits),
        fill: false,
        // borderColor: "rgb(75, 192, 192)",
        borderColor: "hsla(221.2 83.2% 53.3%)",
        backgroundColor: "white",
        tension: 0.1,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time", // Assuming 'date' is a Date object or a parseable string
        time: {
          //   unit: "day", // Display x-axis labels by day
          unit: "month", // Display x-axis labels by month
        },
      },
      y: {
        beginAtZero: true, // Start y-axis at zero
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: function (tooltipItem) {
            // Customize tooltip title, e.g., show date
            return tooltipItem[0].label;
          },
          label: function (tooltipItem) {
            // Customize tooltip label, e.g., show number of visits
            return `Nombre de visites: ${tooltipItem.raw}`;
          },
        },
      },
    },
    interaction: {
      mode: "index", // Enable index mode for tooltip interaction
      intersect: false, // Disable tooltip intersect mode to show all tooltips at the same x-value
    },
  };

  //   const handlePointClick = (
  //     event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  //   ) => {
  //     const chart = event.target as any; // Type cast to any to access Chart.js instance
  //     const activePoints = chart.getElementsAtEventForMode(
  //       event.nativeEvent,
  //       "nearest",
  //       { intersect: true },
  //       false
  //     );
  //     if (activePoints.length > 0) {
  //       const clickedDatasetIndex = activePoints[0].datasetIndex;
  //       const clickedElementIndex = activePoints[0].index;
  //       setSelectedPoint(clickedElementIndex);
  //     }
  //   };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-[50vh] relative mb-12"
    >
      <h2 className="text-slate-500">
        Visites des utilisateurs au fil du temps
      </h2>
      <div className="line p-4 w-full h-full bg-white mt-2 shadow-sm rounded-md">
        <Line
          // @ts-ignore
          type="line"
          data={chartData}
          options={options}
          //   getElementAtEvent={(
          //     event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
          //   ) => handlePointClick(event)}
        />
      </div>
      {/* {selectedPoint !== null && (
        <div className="mt-4">
          <p className="font-semibold">Statistics for Selected Point:</p>
          <p>Date: {data[selectedPoint].date}</p>
          <p>Number of Visits: {data[selectedPoint].visits}</p>
        </div>
      )} */}
    </motion.div>
  );
};

export default UserVisitsChart;
