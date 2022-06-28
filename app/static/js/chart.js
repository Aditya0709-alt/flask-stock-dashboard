const options = {
  responsive: true,
  legend: {
    display: false,
  },
};

const getData = (color) => {
  return {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
        fill: false,
        label: false,
      },
    ],
  };
};

const createChart = (id, color) => {
  var ctx = document.getElementById(id).getContext("2d");
  return new Chart(ctx, {
    type: "line",
    data: getData(color),
    options: options,
  });
};
