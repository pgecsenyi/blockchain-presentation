export class AssistantBitcoinSupply {
  constructor(canvasName) {
    this.canvasName = canvasName;

    this.config = this.getConfig();
  }

  activate() {
    this.drawChart();
  }

  deactivate() {
  }

  getConfig() {
    return {
      type: 'line',
      data: this.getData(),
      options: this.getOptions(),
      title: { text: 'Bitcoin supply' }
    };
  }

  getData() {
    return {
      labels: [2016, 2020, 2024, 2028, 2032, 2036, 2040, 2044, 2048, 2052, 2056, 2060, 2064, 2068, 2072, 2076, 2080, 2084, 2088, 2092, 2096, 2100, 2104, 2108, 2112, 2116, 2120, 2124, 2128, 2132, 2136],
      datasets: [
        {
          data: [15768000, 18396000, 19710000, 20367000, 20695500, 20859750, 20941875, 20982937.5, 21003468.75, 21013734.375, 21018867.1875, 21021433.59375, 21022716.796875, 21023358.3984375, 21023679.19921875, 21023839.599609375, 21023919.799804688, 21023959.899902344, 21023979.949951172, 21023989.974975586, 21023994.987487793, 21023997.493743896, 21023998.74687195, 21023999.373435974, 21023999.686717987, 21023999.843358994, 21023999.921679497, 21023999.96083975, 21023999.980419874, 21023999.990209937, 21023999.99510497],
          label: 'BTC',
          backgroundColor: 'rgba(48,132,201,0.2)',
          borderColor: 'rgba(48,132,201,1.0)',
          lineTension: 0,
          pointColor: 'rgba(48,132,201,1.0)',
          pointStrokeColor: 'rgba(48,132,201,0.8)',
          pointHighlightFill: 'rgba(48,132,201,0.5)',
          pointHighlightStroke: 'rgba(48,132,201,0.5)',
          strokeColor: 'rgba(48,132,201,0.3)',
          steppedLine: false
        }
      ]
    };
  }

  getOptions() {
    return {
      animation: {
        duration: 1500
      },
      legend: {
        display: false
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            ticks: {
              callback: label => (label / 1000000 + 'M')
            }
          }
        ]
      },
      scaleFontColor: '#555'
    };
  }

  drawChart() {
    var canvas = document.getElementById(this.canvasName);
    if (canvas == null)
      throw 'No canvas available with this name: ' + this.canvasName + '.';
    var context = canvas.getContext('2d');
    new Chart(context, this.config);
  }
}
