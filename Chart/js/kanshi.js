Kanshi.CHART_NAME = [
    "再エネAAA","非再エネAAA","再エネBBB",
    "非再エネBBB","再エネCCC","非再エネCCC",
    "再エネDDD","非再エネDDD","再エネEEE",
    "非再エネEEE","その他AAA","その他BBB"];

$(document).ready(function() {
    const kanshi = new Kanshi("myChart");
    kanshi.init();
});

/**
 * Kanshi(chartId) - Kanshiクラスのコンストラクタ。
 * 引数にグラフを描画するHTMLキャンバス要素のIDを受け取り、それをクラスのプロパティとして保存します。 
 * @param chartId 
 */
function Kanshi(chartId) {
    this.chartId = chartId;
    this.chart = null;
}

/**
 * Kanshiクラスの初期化メソッド。
 * グラフオプションを生成し、チェックボックスを生成してイベントリスナーを設定します。
 */
Kanshi.prototype.init = function() {
    let panel = this;
    this.chart = this.generateChartOption();
    this.generateCheckboxes();

    $('#bulk-renewable').on('change', function() {
        panel.toggleBulkCheckboxes('renewable', $(this).is(':checked'));
    });

    $('#bulk-nonrenewable').on('change', function() {
        panel.toggleBulkCheckboxes('nonrenewable', $(this).is(':checked'));
    });
};

/**
 * グラフの各データセットに対応するチェックボックスとラベルを生成し、DOMに追加します。
 * チェックボックスの状態が変更されると、toggleDatasetVisibilityメソッドが呼び出されます。
 */
Kanshi.prototype.generateCheckboxes = function() {
    Kanshi.CHART_NAME.forEach((name, index) => {
        const category = name.startsWith('再エネ') ? 'renewable' : 'nonrenewable';
        const checkbox = $('<input type="checkbox" checked>')
            .attr('id', `checkbox-${index}`)
            .attr('data-category', category)
            .addClass('chart-checkbox');
        const label = $('<label>').attr('for', `checkbox-${index}`).text(name);

        checkbox.on('change', this.toggleDatasetVisibility.bind(this, index));

        $("#checkboxes").append(checkbox, label);
    });
}

/**
 * 引数で指定されたインデックスのデータセットの表示状態を切り替えます。
 * データセットが表示されている場合、非表示にし、非表示の場合は表示します。
 * @param {*} index 
 */
Kanshi.prototype.toggleDatasetVisibility = function(index) {
    this.chart.data.datasets[index].hidden = !this.chart.data.datasets[index].hidden;
    this.chart.update();
}

/**
 * 与えられたカテゴリ（'renewable'または'nonrenewable'）のチェックボックスの状態を、引数で指定された値に一括で設定します。
 * @param {*} category 
 * @param {*} checked 
 */
Kanshi.prototype.toggleBulkCheckboxes = function(category, checked){
    $('.chart-checkbox[data-category="' + category + '"]').each(function() {
        $(this).prop('checked', checked).change();
    });
}

/**
 * Chart.jsのオプションを生成し、グラフを作成して返します。
 * @returns 
 */
Kanshi.prototype.generateChartOption = function(){
    const ctx = $("#" + this.chartId)[0].getContext("2d");
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: this.generateChartData()
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * 各データセットのラベル、データ、色、線の太さなどのプロパティを持つオブジェクトの配列を生成して返します。
 * この配列は、グラフのデータセットとして使用されます。
 * @returns 
 */
Kanshi.prototype.generateChartData = function () {
    return Kanshi.CHART_NAME.map((name, index) => ({
        label: name,
        data: Array.from({length: 6}, () => Math.floor(Math.random() * 100)),
        borderColor: `hsla(${index * 30}, 100%, 50%, 1)`,
        backgroundColor: `hsla(${index * 30}, 100%, 50%, 0.5)`,
        borderWidth: 1,
        hidden: false
    }));
}
