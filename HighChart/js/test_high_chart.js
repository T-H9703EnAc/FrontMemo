$(document).ready(function () { // jQueryを使ってドキュメントが準備完了したら実行
  $('#container').highcharts({ // containerはグラフを表示するdiv要素のID
      title: {
          text: 'サンプルグラフ'
      },
      xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      series: [{
          type: 'line',
          name: 'Observation',
          data: [1, 3, 2, 4, 6, 8, 3, 5, 7, 6, 7, 8]
      }]
  });
});
