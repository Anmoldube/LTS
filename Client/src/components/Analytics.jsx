import React, { useRef } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import ReactToPrint from "react-to-print";

// Register the necessary components with Chart.js
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const Analytics = ({ allSoftwareData }) => {
  const totalSoftware = allSoftwareData.length;
  const componentRef = useRef();

  // Function to get color based on expiry date
  const getColorBasedOnExpiry = (expDate) => {
    const expiryDate = new Date(expDate);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 10) {
      return "red"; // Expiring in 10 days or less
    } else if (diffDays <= 15) {
      return "blue"; // Expiring in 15 days or less
    } else {
      return "green"; // More than 15 days remaining
    }
  };

  const pieData = {
    labels: allSoftwareData.map((software) => software.Name),
    datasets: [
      {
        data: allSoftwareData.map((software) => {
          const expiryDate = new Date(software.EXP);
          const today = new Date();
          const diffTime = expiryDate - today;
          return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }),
        backgroundColor: allSoftwareData.map((software) =>
          getColorBasedOnExpiry(software.EXP)
        ),
      },
    ],
  };

  const barData = {
    labels: allSoftwareData.map((software) => software.Name),
    datasets: [
      {
        label: "Days until Expiry",
        data: allSoftwareData.map((software) => {
          const expiryDate = new Date(software.EXP);
          const today = new Date();
          const diffTime = expiryDate - today;
          return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }),
        backgroundColor: allSoftwareData.map((software) =>
          getColorBasedOnExpiry(software.EXP)
        ),
      },
    ],
  };

  return (
    <div className="row w-[50vw]">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            Total Software Licenses: {totalSoftware}
          </div>
          <div className="card-body">
            <Pie data={pieData} />
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">Software Expiry Dates</div>
          <div className="card-body">
            <Bar data={barData} />
          </div>
        </div>
      </div>

      <div style={{ display: "none" }}>
        <div ref={componentRef}>
          <div className="row m-3">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  Total Software Licenses: {totalSoftware}
                </div>
                <div className="card-body">
                  <Pie data={pieData} />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">Software Expiry Dates</div>
                <div className="card-body">
                  <Bar data={barData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
