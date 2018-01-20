export class AssistantMiningReward {
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
            title: { text: 'Mining reward' }
        };
    }

    getData() {
        return {
            labels: [2016, 2020, 2024, 2028, 2032, 2036, 2040, 2044, 2048, 2052, 2056, 2060, 2064, 2068, 2072, 2076, 2080, 2084, 2088, 2092, 2096, 2100, 2104, 2108, 2112, 2116, 2120, 2124, 2128, 2132, 2136],
            datasets: [
                {
                    data: [12.5, 6.25, 3.125, 1.5625, 0.78125, 0.390625, 0.1953125, 0.09765625, 0.048828125, 0.0244140625, 0.01220703125, 0.006103515625, 0.0030517578125, 0.00152587890625, 0.000762939453125, 0.0003814697265625, 0.00019073486328125, 0.000095367431640625, 0.0000476837158203125, 0.00002384185791015625, 0.000011920928955078125, 0.0000059604644775390625, 0.0000029802322387695312, 0.0000014901161193847656, 7.450580596923828e-7, 3.725290298461914e-7, 1.862645149230957e-7, 9.313225746154785e-8, 4.6566128730773926e-8, 2.3283064365386963e-8, 1.1641532182693481e-8],
                    label: 'BTC',
                    backgroundColor: 'rgba(48,132,201,0.2)',
                    borderColor: 'rgba(48,132,201,1.0)',
                    pointColor: 'rgba(48,132,201,1.0)',
                    pointStrokeColor: 'rgba(48,132,201,0.8)',
                    pointHighlightFill: 'rgba(48,132,201,0.5)',
                    pointHighlightStroke: 'rgba(48,132,201,0.5)',
                    strokeColor: 'rgba(48,132,201,0.3)',
                    steppedLine: true
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
