TestChart.CHART_NAME = [
  "再エネAAA",
  "非再エネAAA",
  "再エネBBB",
  "非再エネBBB",
  "再エネCCC",
  "非再エネCCC",
  "再エネDDD",
  "非再エネDDD",
  "再エネEEE",
  "非再エネEEE",
  "その他AAA",
  "その他BBB",
];

$(document).ready(function () {
  const testChart = new TestChart("chart");
  testChart.init();
});

function TestChart(chartId) {
  this.chartId = chartId;
  this.chart = null;
}

TestChart.prototype.init = function () {
  let panel = this;
  $("input[name='mode']").change(function () {
    const mode = $(this).val();
    const rawData = panel.fetchData(); // ダミーデータを取得
    const data = panel.applyMode(mode, rawData);
    panel.renderChart(data);
  });

  const initialData = panel.fetchData(); // 初期データを取得
  panel.createCheckboxes(initialData);
  panel.renderChart(initialData);

  // // 簡易モードを適用してグラフを表示
  // const initialMode = $("input[name='mode']:checked").val();
  // const dataWithInitialMode = panel.applyMode(initialMode, initialData);
  // panel.renderChart(dataWithInitialMode);
};

TestChart.prototype.applyMode = function (mode, data) {
  const newData = JSON.parse(JSON.stringify(data));

  if (mode === "simple") {
    let nonRenewableSum = Array(data.labels.length).fill(0);

    newData.datasets = newData.datasets.filter((dataset, index) => {
      if (dataset.category === "nonRenewable") {
        dataset.data.forEach((value, dataIndex) => {
          nonRenewableSum[dataIndex] += value;
        });
        return false;
      }
      return true;
    });

    newData.datasets.push({
      label: "非再エネ",
      data: nonRenewableSum,
      type: "bar",
      category: "nonRenewable",
      borderColor: "rgba(255, 206, 86, 1)",
      backgroundColor: "rgba(255, 206, 86, 0.2)",
      borderWidth: 1,
      stack: "nonRenewableStack",
    });

    this.chart.options.scales.y.stacked = true;
    newData.datasets.forEach((dataset) => {
      if (dataset.category === "nonRenewable") {
        dataset.stack = "nonRenewableStack";
      } else {
        dataset.stack = "noStack";
      }
    });
  } else {
    newData.datasets = data.datasets;
    this.chart.options.scales.y.stacked = false;
    newData.datasets.forEach((dataset) => {
      dataset.stack = "";
    });
  }

  this.updateCheckboxes(mode); // チェックボックスを更新
  return newData;
};

TestChart.prototype.createCheckboxes = function (data) {
  const panel = this;
  const checkboxContainer = $("#checkboxContainer");
  checkboxContainer.empty();

  TestChart.CHART_NAME.forEach((name, index) => {
    if (name === "非再エネ") {
      panel.createSingleCheckbox("非再エネ", index);
    } else if (name.startsWith("非再エネ")) {
      if ($("input[name='mode']:checked").val() !== "simple") {
        panel.createSingleCheckbox(name, index);
      }
    } else {
      panel.createSingleCheckbox(name, index);
    }
  });

  // イベントリスナーを追加
  checkboxContainer.on("change", "input[type='checkbox']", function () {
    const dataIndex = $(this).data("index");
    const isChecked = $(this).is(":checked");
    panel.chart.data.datasets[dataIndex].hidden = !isChecked;
    panel.chart.update();
  });
};

TestChart.prototype.updateCheckboxes = function (mode) {
  const checkboxContainer = $("#checkboxContainer");

  if (mode === "simple") {
    $(".checkbox-wrapper").has("input.non-renewable").slice(1).hide();

    $(".checkbox-wrapper")
      .has("input.non-renewable")
      .first()
      .show()
      .find("label")
      .text("非再エネ");
  } else {
    $(".checkbox-wrapper").has("input.non-renewable").show();

    TestChart.CHART_NAME.forEach((name, index) => {
      if (name.includes("非再エネ")) {
        const checkboxId = "checkbox-" + index;
        const checkbox = $("#" + checkboxId);

        if (!checkbox.length) {
          this.createSingleCheckbox(name, index);
        } else {
          $("#" + checkboxId)
            .siblings("label")
            .text(name);
        }
      }
    });
  }
};

TestChart.prototype.createSingleCheckbox = function (name, index) {
  const checkboxContainer = $("#checkboxContainer");
  const checkboxId = "checkbox-" + index;

  const checkboxWrapper = $("<div></div>").addClass("checkbox-wrapper");
  const checkbox = $('<input type="checkbox" checked />')
    .attr("id", checkboxId)
    .data("index", index)
    .addClass(name.includes("非再エネ") ? "non-renewable" : "");

  const label = $("<label></label>").attr("for", checkboxId).text(name);

  checkboxWrapper.append(checkbox, label);
  checkboxContainer.append(checkboxWrapper);
};

TestChart.prototype.renderChart = function (data) {
  const ctx = document.getElementById("chart").getContext("2d");

  if (this.chart) {
    chart.destroy();
  }

  this.chart = new Chart(ctx, {
    type: "bar",
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: true,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  });
};

TestChart.prototype.fetchData = function () {
  return {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: TestChart.CHART_NAME.map((name, index) => ({
      label: name,
      data: Array(6).fill(index * 10),
      type: index % 2 === 0 ? "bar" : "line",
      category:
        index < 10 ? (index % 2 === 0 ? "renewable" : "nonRenewable") : "other",
      borderColor: `rgba(${index * 20}, ${255 - index * 20}, ${index * 10}, 1)`,
      backgroundColor: `rgba(${index * 20}, ${255 - index * 20}, ${
        index * 10
      }, 0.2)`,
      borderWidth: 1,
    })),
  };
};
