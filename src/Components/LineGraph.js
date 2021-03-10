import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
   legend: {
      display: false,
   },
   elements: {
      point: {
         radius: 0,
      },
   },
   maitainAspectRation: false,
   tootips: {
      mode: "index",
      intersect: false,
      callbacks: {
         label: function (tooltipItem, data) {
            return numeral(tooltipItem.value).format("+0.0");
         },
      },
   },
   scales: {
      xAxes: [
         {
            type: "time",
            time: {
               format: "MM/DD/YY",
               tooltipFormat: "ll",
            },
         },
      ],
      yAxes: [
         {
            gridlines: {
               display: false,
            },
            ticks: {
               //Include a dollar sign in the ticks
               callback: function (value, index, values) {
                  return numeral(value).format("0a");
               },
            },
         },
      ],
   },
};
function LineGraph({ casesType, ...props }) {
   const [data, setData] = useState({});

   //https://disease.sh/v3/covid-19/historical/all/?lastdays=120
   //Make request to get the data to the graph
   useEffect(() => {
      const getGraphData = async () => {
         const res = await fetch(
            "https://disease.sh/v3/covid-19/historical/all/?lastdays=120"
         );
         const resGraphData = await res.json();
         let chartData = buildChartData(resGraphData, casesType);
         setData(chartData);
      };
      getGraphData();
   }, [casesType]);

   //Transform Data Recived to put date in x axis and value on y axis
   const buildChartData = (data, casesType) => {
      const chartData = [];
      let lastDataPoint;
      for (let date in data.cases) {
         if (lastDataPoint) {
            //Create new data point for today with the difference betwenn lastdate and current date(new cases)
            let newDataPoint = {
               x: date,
               y: data[casesType][date] - lastDataPoint,
            };
            //Add new data point to chart
            chartData.push(newDataPoint);
         }
         lastDataPoint = data[casesType][date];
      }
      return chartData;
   };

   function styleChar(casesType) {
      if (casesType === "cases") {
         return {
            backgroundColor: "#DAA520",
            borderColor: "#906b0f",
         };
      } else if (casesType === "recovered") {
         return {
            backgroundColor: "rgb(125, 215, 29)",
            borderColor: "#8eb8ad",
         };
      }
      return {
         backgroundColor: "rgba(204, 16, 52, 0.5)",
         borderColor: "#CC1034",
      };
   }

   return (
      <div className={props.className}>
         {data?.length > 0 && (
            <Line
               options={options}
               data={{
                  datasets: [
                     {
                        backgroundColor: styleChar(casesType).backgroundColor,
                        borderColor: styleChar(casesType).borderColor,
                        data: data,
                     },
                  ],
               }}
            />
         )}
      </div>
   );
}

export default LineGraph;
