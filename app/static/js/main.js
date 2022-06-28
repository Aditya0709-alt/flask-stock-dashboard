const app = new Vue({
  el: "#app",
  delimiters: ["[[", "]]"],
  data: {
    stocks: [],
    chartRefs: {},
    message: {},
    chartBgColor: "#44b4f8",
    stocksHistory: {},
  },
  methods: {
    updateChart(canavasId, xData, yData) {
      let chart = this.chartRefs[canavasId];
      if (chart.data.labels.length > 15) {
        chart.data.labels.splice(0, 1);
        chart.data.datasets[0].data.splice(0, 1);
      }
      chart.data.labels.push(xData);
      chart.data.datasets[0].data.push(yData);
      chart.update();
    },
    loadCharts(stocks) {
      stocks.forEach((s) => {
        this.chartRefs[s.symbol] = createChart(s.symbol, this.chartBgColor);
      });
    },
    updateStock(newStock) {
      this.stocks = this.stocks.map((x) => {
        return x.symbol === newStock.symbol ? newStock : x;
      });
    },
    updateStockHistory(symbol, newCurrent) {
      newCurrent = parseFloat(newCurrent);
      let stocksHistory = { ...this.stocksHistory };
      let updated = { ...this.stocksHistory[symbol] };
      let oldCurrent = this.stocksHistory[symbol]["current"];
      updated["current"] = newCurrent;
      updated["increased"] = oldCurrent <= newCurrent ? true : false;
      updated["changed"] = (
        (Math.abs(oldCurrent - newCurrent) * 100) /
        oldCurrent
      ).toFixed(3);
      stocksHistory[symbol] = updated;
      this.stocksHistory = stocksHistory;
    },
    setUpSSE() {
      const source = new EventSource("/stream-stocks");
      source.onmessage = (e) => {
        let data = JSON.parse(e.data);
        this.message = { symbol: data.stock.symbol, name: data.stock.name };
        this.updateChart(data.stock.symbol, data.time, data.stock.current);
        this.updateStock(data.stock);
        this.updateStockHistory(data.stock.symbol, data.stock.current);
      };
    },
  },
  created: function () {
    $.get("/stocks", (data) => {
      this.stocks = data;
      data.forEach((x) => {
        this.stocksHistory[x.symbol] = {
          current: parseFloat(x.current),
          increased: false,
          changed: 0,
        };
      });
      setTimeout(() => {
        this.loadCharts(data);
        this.setUpSSE();
      }, 1000);
    });
  },
});
