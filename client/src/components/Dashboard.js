import React, { useEffect, useState } from "react";
import faker from "faker";
import { Bar, Pie, Doughnut } from "react-chartjs-2";

function Dashboard() {
  const [male, setMale] = useState(0);
  const [others, setOthers] = useState(0);
  const [female, setFemale] = useState(0);
  const [bhiwandi, setBhiwandi] = useState(0);
  const [vasai, setVasai] = useState(0);
  const [thane, setThane] = useState(0);
  const [borivali, setBorivali] = useState(0);
  const [ag, setAGrp] = useState(0);
  const [bg, setBGrp] = useState(0);
  const [cg, setCGrp] = useState(0);
  const [dg, setDGrp] = useState(0);
  const [eg, setEGrp] = useState(0);

  useEffect(() => {
    const fetchDetails = () => {
      fetch("http://localhost:4001/result")
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          var m = 0,
            f = 0,
            o = 0,
            bh = 0,
            th = 0,
            bo = 0,
            va = 0,
            agrp = 0,
            bgrp = 0,
            cgrp = 0,
            dgrp = 0,
            egrp = 0;
          for (let i = 0; i < result.length; i++) {
            if (result[i].gender === "Female") {
              f++;
            } else if (result[i].gender === "Male") {
              m++;
            } else if (result[i].gender === "Others") {
              o++;
            }

            if (result[i].location === "Bhiwandi") {
              bh++;
            } else if (result[i].location === "Thane") {
              th++;
            } else if (result[i].location === "Vasai") {
              va++;
            } else if (result[i].location === "Borivali") {
              bo++;
            }

            if (
              parseInt(result[i].age) >= 18 &&
              parseInt(result[i].age) <= 30
            ) {
              agrp++;
            } else if (
              parseInt(result[i].age) >= 31 &&
              parseInt(result[i].age) <= 45
            ) {
              bgrp++;
            } else if (
              parseInt(result[i].age) >= 46 &&
              parseInt(result[i].age) <= 60
            ) {
              cgrp++;
            } else if (
              parseInt(result[i].age) >= 61 &&
              parseInt(result[i].age) <= 75
            ) {
              dgrp++;
            } else if (
              parseInt(result[i].age) >= 76 &&
              parseInt(result[i].age) <= 90
            ) {
              egrp++;
            }
          }
          setMale(m);
          setFemale(f);
          setOthers(o);
          setThane(th);
          setVasai(va);
          setBorivali(bo);
          setBhiwandi(bh);
          setAGrp(agrp);
          setBGrp(bgrp);
          setCGrp(cgrp);
          setDGrp(dgrp);
          setEGrp(egrp);
        });
    };
    fetchDetails();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "City Chart",
      },
    },
  };

  const options3 = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Gender Chart",
      },
    },
  };

  const options2 = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Age Chart",
      },
    },
  };

  const data = {
    labels: ["Bhiwandi", "Vasai", "Borivali", "Thane"],
    datasets: [
      {
        label: "City",
        data: [bhiwandi, vasai, borivali, thane],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const data2 = {
    labels: ["18-30", "31-45", "45-60", "61-75", "76-90"],
    datasets: [
      {
        label: "# of Votes",
        data: [ag, bg, cg, dg, eg],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const data3 = {
    labels: ["Male", "Female", "Others"],
    datasets: [
      {
        label: "# of Votes",
        data: [male, female, others],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <div>
      <div className="container">
        <div
          className="pie-chart"
          style={{
            padding: "15px",
            marginTop: "1rem",
            margin: "0 auto",
          }}
        >
          <Doughnut options={options3} data={data3} />
        </div>
        <div style={{ padding: "15px" }}>
          <Bar options={options} data={data} />
        </div>
        <div
          className="pie-chart"
          style={{
            padding: "15px",
            marginTop: "1rem",
            margin: "0 auto",
            // width: "50%",
          }}
        >
          <Pie options={options2} data={data2} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
