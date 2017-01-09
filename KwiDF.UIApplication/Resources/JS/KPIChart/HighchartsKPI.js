$(document).ready(function () {
    var chartObj = $("#js_chart");
    chartObj.on('click', '.wrapper', function () {
        $(this).toggleClass('selected');

        //log("DocClick" + selectedCategoryActual);
        if ($(this).hasClass('selected')) {
            $(".overlay", $(this)).show();
            updateColor();

            setDocumentProperty("RefreshKPI", "false");
            setDocumentProperty("RefreshKPIGC", "false");
            setDocumentProperty("RefreshKPIEP", "false");
			setDocumentProperty("RefreshKPIWF","false");
			setDocumentProperty("RefreshKPIWHP","false");
            var actual = actualVal + ' as ' + actualDisplay;
            if (showTarget == "true") {
                var target = targetVal + ' as ' + targetDisplay;
                runScript("DynamicProductionCategory", [{ "Key": "actualValue", "Value": actual }, { "Key": "targetValue", "Value": target }, { "Key": "isDelete", "Value": 0 }]);
            }
            else {
                runScript("DynamicProductionCategory", [{ "Key": "actualValue", "Value": actual }, { "Key": "targetValue", "Value": "" }, { "Key": "isDelete", "Value": 0 }]);
            }
        } else {
            $(".overlay", $(this)).hide();
            updateColor();

            setDocumentProperty("RefreshKPI", "false");
            setDocumentProperty("RefreshKPIGC", "false");
            setDocumentProperty("RefreshKPIEP", "false");
			setDocumentProperty("RefreshKPIWF","false");
			setDocumentProperty("RefreshKPIWHP","false");
            var actual = actualVal + ' as ' + actualDisplay;
            if (showTarget == "true") {
                var target = targetVal + ' as ' + targetDisplay;
                runScript("DynamicProductionCategory", [{ "Key": "actualValue", "Value": actual }, { "Key": "targetValue", "Value": target }, { "Key": "isDelete", "Value": 1 }]);
            }
            else {

                runScript("DynamicProductionCategory", [{ "Key": "actualValue", "Value": actual }, { "Key": "targetValue", "Value": "" }, { "Key": "isDelete", "Value": 1 }]);
            }


        }
    });

    chartObj.on('click', ".icon-holder button", function (event) {
        event.stopPropagation();
    });


});


//var RefreshKPI=true;
var kpiactive = false;
var chartValue;
var gaugaChart;
var colName;
var columnsArray;
var configData;
var topValue = "";
var bottomValue = "";
var targetValue = 0;
var lastTopData = 0;
var lastTargetData = 0;
var colorCode = "";
var selectionType = "";
var actualDisplay = "";
var targetDisplay = "";
var propertyName;
var actualVal = "";
var targetVal = "";
var maxValue;
var minValue;
var selectedCategoryActual = "";
var selectedCategoryTarget = "";
var showTarget = "";
var showChange = "";
var dateRange;
function renderCore(sfdata) {

    var DateValue = new Date(sfdata.config.DateFilter);
    var DateValueFormatted = DateValue.valueOf();
    var nextDate = DateValue;
    var numberOfDaysToAdd = 1;
    nextDate.setDate(nextDate.getDate() + numberOfDaysToAdd);
    var nextDateValueFormatted = nextDate.valueOf();
    showTarget = sfdata.config.ShowTarget;
    showChange = sfdata.config.ShowChange;
    if (sfdata.config.ShowTarget == "true") {
        actualVal = sfdata.config.ColumnName[0];
        targetVal = sfdata.config.ColumnName[1];
        actualDisplay = sfdata.config.DisplayName[0];
        targetDisplay = sfdata.config.DisplayName[1];
    }
    else {
        actualVal = sfdata.config.ColumnName[0];
        actualDisplay = sfdata.config.DisplayName[0];
    }
    if (sfdata.config.RefreshKPI == "true") {
        dateRange = sfdata.config.DateRange;

        var date2 = new Date(sfdata.config.DateFilter);
        date2.setDate(date2.getDate() - dateRange);

        var actualData = sfdata.data;
        actualData = actualData.filter(function (el) {
            DateValue = new Date(sfdata.config.DateFilter);
            DateValueFormatted = DateValue.valueOf();
            startDateValue = date2.valueOf();

            return el.items[0].replace("/Date(", "").replace(")/", "") >= startDateValue && el.items[0].replace("/Date(", "").replace(")/", "") <= DateValueFormatted;

        });
        if (sfdata.config.ShowTarget == "true") {
            selectedCategoryActual = sfdata.config.CategoryConditionActual;
            selectedCategoryTarget = sfdata.config.CategoryConditionTarget;
            var series = {};
            var processed_json = new Array();
            data = [];
            targetData = [];
            changeData = [];
			if(selectionType == undefined || selectionType == "")
				selectionType = sfdata.config.ChartType;
            colorCode = sfdata.config.ColorCode;

            for (i = 0; i < actualData.length; i++) {

                data.push([parseInt(actualData[i].items[0].replace("/Date(", "").replace(")/", "")), actualData[i].items[2]]);
                targetData.push([parseInt(actualData[i].items[0]), actualData[i].items[3]]);
                if (sfdata.config.ShowChange == "true") {
                    changeData.push(actualData[i].items[4]);
                }

            }
            series = {
                name: sfdata.columns[2],
                data: data
            };
            processed_json.push(series);

            var lastData = 0;
            if (data.length > 0) {
                var len = data.length - 1;
                lastData = data[len][1] != 0 && data[len][1] != "" ? Math.round(data[len][1]) : 0;
                lastTopData = lastData;
                topValue = numberWithCommas(lastData);

                if (targetData.length > 0) {
                    var len = targetData.length - 1;
                    lastTargetData = targetData[len][1] != 0 && targetData[len][1] != "" ? Math.round(targetData[len][1]) : 0;
                    targetValue = numberWithCommas(lastTargetData);
                }
                if (sfdata.config.ShowChange == "true") {
                    if (changeData.length > 0) {
                        var len = changeData.length - 1;
                        var bottomData = changeData[len] != 0 && changeData[len] != "" ? Math.round(changeData[len]) : 0;
                        bottomValue = numberWithCommas(bottomData);
                    }
                }

                if (lastTopData > lastTargetData) {

                    if (lastTargetData < 0) {
                        minValue = lastTargetData + ((20 / 100) * lastTargetData);
                    }
                    else {
                        minValue = 0;
                    }
                    if (lastTopData < 0)
                        maxValue = lastTopData - ((20 / 100) * lastTopData);
                    else
                        maxValue = lastTopData + ((20 / 100) * lastTopData);
                }
                else {

                    if (lastTopData < 0) {
                        minValue = lastTopData + ((20 / 100) * lastTopData);
                    }
                    else {
                        minValue = 0;
                    }
                    if (lastTargetData < 0)
                        maxValue = lastTargetData - ((20 / 100) * lastTargetData);
                    else
                        maxValue = lastTargetData + ((20 / 100) * lastTargetData);

                }

            }
            else {
                topValue = "";
                bottomValue = "";
                targetValue = 0;
                lastTargetData = 0;
                lastTopData = 0;
            }
            var chartObj = $("#js_chart");

            if ($('.wrapper', chartObj).length == 0) {

                $(chartObj).wrapInner("<div class='wrapper'/>");
                var drawChart = $('.wrapper', chartObj);
                $(drawChart).addClass("smallSection");


                $(drawChart).append("<header/>");
                $(drawChart).append("<section class='chartHolder' id='chartHolder'/>");
                $(drawChart).append("<section class='gaugeHolder' id='gaugeHolder'/>");


                $("header", drawChart).append("<h2>" + sfdata.config.lableText + " <span>" + sfdata.config.UOMText + "</span></h2>").append("<p>" + topValue + "</p>");
                $("header", drawChart).append("<div class='target-holder'/>");
                $("header .target-holder", drawChart).append("<div>Target</div><div>" + targetValue + "</div>");

                $(drawChart).append("<footer/>");
                if (sfdata.config.ShowChange == "true") {
                    $("footer", drawChart).append("<span class='up'>" + bottomValue + "</span>");
                }
                $("footer", drawChart).append("<div class='icon-holder'/>");
                $("footer .icon-holder", drawChart).append('<button onclick="clickedGuage()"  class="active" id="guage"><i class="fa fa-tachometer" aria-hidden="true"></i></button>');
                $("footer .icon-holder", drawChart).append('<button onclick="clickedLine()"  id="line"><i class="fa fa-line-chart" aria-hidden="true"></i></button>');
                $("footer .icon-holder", drawChart).append('<button onclick="clickedChart()" id="bar"><i class="fa fa-bar-chart" aria-hidden="true"></i></button>');
                //$("footer .icon-holder",drawChart).append('<button onclick="clickedCurrency()"  id="currency"><i class="fa fa-arrows-h" aria-hidden="true"></i></button>');
                drawChart.append("<div class='overlay'/>");

            }

            $("header p").html(topValue);
            if (sfdata.config.ShowChange == "true") {
                $("footer span").html(bottomValue);
            }
            $("header .target-holder").html("<div>Target</div><div>" + targetValue + "</div>");

            if (lastTopData > lastTargetData) {
                $(".smallSection header").addClass('green');
                $(".smallSection header").removeClass('yellow');
                $(".smallSection header").removeClass('red');

            }
            else if (lastTopData < lastTargetData) {
                $(".smallSection header").addClass('red');
                $(".smallSection header").removeClass('yellow');
                $(".smallSection header").removeClass('green');
            }
            else if (lastTopData == lastTargetData) {
                $(".smallSection header").addClass('yellow');
                $(".smallSection header").removeClass('red');
                $(".smallSection header").removeClass('green');

            }

        }

        else if (sfdata.config.ShowTarget == "false") {

            selectedCategoryActual = sfdata.config.CategoryConditionActual;
            var series = {};
            var processed_json = new Array();
            data = [];
            targetData = [];
            changeData = [];
			if(selectionType == undefined || selectionType == "")
				selectionType = sfdata.config.ChartType;
            colorCode = sfdata.config.ColorCode;

            for (i = 0; i < actualData.length; i++) {

                data.push([parseInt(actualData[i].items[0].replace("/Date(", "").replace(")/", "")), actualData[i].items[2]]);

                if (sfdata.config.ShowChange == "true") {
                    changeData.push(actualData[i].items[3]);
                }

            }
            series = {
                name: sfdata.columns[2],
                data: data
            };
            processed_json.push(series);

            var lastData = 0;
            if (data.length > 0) {
                var len = data.length - 1;
                lastData = data[len][1] != 0 && data[len][1] != "" ? Math.round(data[len][1]) : 0;
                lastTopData = lastData;
                topValue = numberWithCommas(lastData);

                if (sfdata.config.ShowChange == "true") {
                    if (changeData.length > 0) {
                        var len = changeData.length - 1;
                        var bottomData = changeData[len] != 0 && changeData[len] != "" ? Math.round(changeData[len]) : 0;
                        bottomValue = numberWithCommas(bottomData);
                    }
                }



                if (lastTopData < 0) {
                    minValue = lastTopData + ((20 / 100) * lastTopData);
                }
                else {
                    minValue = 0;
                }
                if (lastTopData < 0)
                    maxValue = lastTopData - ((20 / 100) * lastTopData);
                else
                    maxValue = lastTopData + ((20 / 100) * lastTopData);


            }
            else {
                topValue = "";
                bottomValue = "";
                targetValue = 0;
                lastTargetData = 0;
                lastTopData = 0;
            }
            var chartObj = $("#js_chart");

            if ($('.wrapper', chartObj).length == 0) {

                $(chartObj).wrapInner("<div class='wrapper'/>");
                var drawChart = $('.wrapper', chartObj);
                $(drawChart).addClass("smallSection");


                $(drawChart).append("<header/>");
                $(drawChart).append("<section class='chartHolder' id='chartHolder'/>");
                $(drawChart).append("<section class='gaugeHolder' id='gaugeHolder'/>");


                $("header", drawChart).append("<h2>" + sfdata.config.lableText + " <span>" + sfdata.config.UOMText + "</span></h2>").append("<p>" + topValue + "</p>");
                //$("header", drawChart).append("<div class='target-holder'/>");


                $(drawChart).append("<footer/>");
                if (sfdata.config.ShowChange == "true") {
                    $("footer", drawChart).append("<span class='up'>" + bottomValue + "</span>");
                }
                $("footer", drawChart).append("<div class='icon-holder'/>");
                $("footer .icon-holder", drawChart).append('<button onclick="clickedGuage()"  class="active" id="guage"><i class="fa fa-tachometer" aria-hidden="true"></i></button>');
                $("footer .icon-holder", drawChart).append('<button onclick="clickedLine()"  id="line"><i class="fa fa-line-chart" aria-hidden="true"></i></button>');
                $("footer .icon-holder", drawChart).append('<button onclick="clickedChart()" id="bar"><i class="fa fa-bar-chart" aria-hidden="true"></i></button>');
                drawChart.append("<div class='overlay'/>");

            }

            $("header p").html(topValue);
            if (sfdata.config.ShowChange == "true") {
                $("footer span").html(bottomValue);
            }

            $(".smallSection header").addClass('gray');

        }
        if (sfdata.config.ShowChange == "true") {
            if (bottomData < 0) {
                $(".smallSection span").addClass("down");
                $(".smallSection span").removeClass("up");
                $(".smallSection span").removeClass("neutral");
                $(".smallSection header").addClass('red');

            }
            else if (bottomData == 0) {
                $(".smallSection span").addClass("neutral");
                $(".smallSection span").removeClass("up");
                $(".smallSection span").removeClass("down");

            }
            else {
                $(".smallSection span").removeClass("down");
                $(".smallSection span").addClass("up");
                $(".smallSection span").removeClass("neutral");


            }
        }
        var options = {
            chart: {
                renderTo: 'chartHolder',
                spacingBottom: 0,
                spacingTop: 10,
                spacingLeft: 8,
                spacingRight: 3
            },
            backgroundColor: 'transparent',
            borderWidth: 0,
            plotBackgroundColor: 'transparent',
            plotShadow: false,
            plotBorderWidth: 0,
            title: {
                text: ' ',


            },

            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    day: '%e of %b'
                },
                lineWidth: 0,
                title: {
                    text: 'Date'
                },
                labels: {
                    enabled: false
                },


                title: {
                    enabled: false
                },
            },

            plotOptions: {
                series: {
                    color: colorCode,
                    pointPadding: 0,
                    groupPadding: 1,
                    lineWidth: .8,
                    pointPadding: 0,
                    groupPadding: 0,
                }
            },

            exporting: { enabled: false },
            yAxis: [{

                lineWidth: 1,
                opposite: true,
                lineColor: '#fff',
                labels: {
                    enabled: true,
                    align: 'left',
                    x: 5,
                    style: {
                        color: '#fff'
                    }
                },

                gridLineDashStyle: 'Dash',
                className: 'highcharts-color-0',

                title: {
                    enabled: false,
                    text: ''
                }

            }, ],


            tooltip: {
                formatter: function () {
                    var d1 = new Date(this.x);
                    var calendarNextDay = ("00" + (d1.getDate()).toString()).slice(-2) + "-" + ("00" + (d1.getMonth() + 1).toString()).slice(-2) + "-" + d1.getFullYear();
                    return 'Date:' + calendarNextDay + '<br/>' + sfdata.config.lableText + ':'
                     + Math.round(this.y);
                }
            },
            legend: {

                enabled: false
            },
            series: processed_json


        }
        chartValue = new Highcharts.Chart(options);


        createCustomGauge();
        chooseSelection();

        checkNoData();

        var smallSecObj = $('.smallSection', drawChart);

        if (selectedCategoryActual != "" && selectedCategoryActual != undefined) {
            if (selectedCategoryActual.indexOf(sfdata.columns[2]) > -1) {
                kpiactive = true;

            }
            else {
                kpiactive = false;
            }
        }
        else {
            kpiactive = false;
        }
        if (kpiactive) {
            $('.wrapper', chartObj).addClass('selected');
            $(".overlay", chartObj).show();
            //log("KPI Style Selected added-"+kpiactive);
        }
        else {
            $('.wrapper', chartObj).removeClass('selected');
            $(".overlay", chartObj).hide();
            //log("KPI Style Selected removed-"+kpiactive);
        }

    }


}

function chooseSelection() {

    $('.chartHolder,.gaugeHolder').addClass("pushBack");

    if (selectionType == "Bar") {
        clickedChart();
    }
    else if (selectionType == "Line") {
        clickedLine();
    }
    else {
        clickedGuage();
    }

    updateColor();
}


function updateColor() {
    var chart = $('.chartHolder').highcharts();
    if (chart.series != undefined) {
        if ($('.overlay').is(':visible')) {

            if (chart.series.length > 0) {
                chart.series[0].options.color = colorCode;
                chart.series[0].update(chartValue.series[0].options);
            }
        } else {
            if (chart.series.length > 0) {
                chart.series[0].options.color = colorCode;
                chart.series[0].update(chartValue.series[0].options);
            }
        }
    }

}


function createCustomGauge() {

    gaugeTitle = "";
    var startColor = "";
    var stopColor = "";
    var borderColor = "";
    plotBandStartColor = "#ff5050";
    plotBandEndColor = "#429e2f";

    //MidColor
	if (showTarget == "true")
	{
    if (lastTopData > lastTargetData) {
        startColor = "#ddb90a";
        stopColor = "#5e4f06";
        borderColor = "#473a00";

    }
    else if (lastTopData < lastTargetData) {
        startColor = "#ff0000";
        stopColor = "#a50101";
        borderColor = "#8f0000";

    }
    else {
        startColor = "#429e2f";
        stopColor = "#124a06";
        borderColor = "#104004";

    }
	}
	else
	{
		startColor = "#429e2f";
        stopColor = "#124a06";
        borderColor = "#104004";
	}
    log("=================================");
    log("actualValue " + lastTopData);
    log("targetValue " + lastTargetData);
    log("minValue " + minValue);
    log("maxValue " + maxValue);
    log("=================================");
    //var chartVal=new Highcharts.Chart({
    var options = {
        chart: {
            renderTo: 'gaugeHolder',
            type: 'gauge',
            alignTicks: false,
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            spacingTop: 0,
            spacingLeft: 0,
            spacingRight: 0,
            spacingBottom: 0,
            plotBorderWidth: 0,
            plotShadow: false,
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            events: {
                click: function () {
                    //alert('[Category] = \''+ gaugeTitle +'\'');
                    //runScript("DynamicProductionCategory", [{ "Key": "colName", "Value": '[Category] = \''+ gaugeTitle +'\'' }, { "Key": "isDelete", "Value": 0 }]);

                }
            }
        },

        title: {
            text: gaugeTitle,
            style: { color: '#fff', 'font-size': '13px' }

        },

        pane: {
            startAngle: -90,
            endAngle: 90,
            center: ['50%', '95%'],
            size: '140%',
            background:
			{
			    backgroundColor: {
			        radialGradient: {
			            cx: 0.5,
			            cy: 0.5,
			            r: .34
			        },
			        stops: [
						[0, startColor],
						[1, stopColor]
			        ]
			    },
			    borderColor: borderColor,
			    //outerRadius: '50%',
			    //innerRadius: '10%',
			}

        },

        plotOptions: {
            //ticker
            gauge: {

                dial: {
                    radius: '80%',
                    backgroundColor: {
                        linearGradient: {
                            x1: 0,
                            x2: 1,
                            y1: 0,
                            y2: 1
                        },
                        stops: [
							[1, '#f5b120'],
							[0, '#842829']
                        ]
                    },

                    topWidth: 1,
                    baseWidth: 3,
                    rearLength: '0',
                    borderColor: '#aa2707',
                    borderWidth: 1

                },
                pivot: {
                    radius: 22,
                    borderColor: 'gray',
                    backgroundColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 1,
                            y2: 1
                        },
                        stops: [
							[0, '#080808'],
							[1, '#262626']
                        ]
                    }
                },
            },

        },
        exporting: {
            enabled: false
        },
        yAxis: [{
            min: minValue,
            title: {
                text: ''
            },
            max: maxValue,
            tickPositions: [lastTargetData],
            lineColor: '#transparent',
            tickColor: '#fff',
            minorTickColor: '#fff',
            minorTickPosition: 'inside',
            minorTickWidth: 0,
            tickLength: 20,
            tickWidth: 3,
            minorTickLength: 7,
            offset: 0,
            lineWidth: 1.5,
            labels: {
                distance: 5,
                rotation: 50,
                style: {
                    color: '#fff',

                    fontSize: '12px',
                    fontWeight: 'normal'
                }
            },
            endOnTick: false,
            plotBands: [{
                from: minValue,
                to: lastTargetData,
                thickness: '17%',
                color: plotBandStartColor
            }, {
                from: lastTargetData,
                to: maxValue,
                thickness: '17%',
                color: plotBandEndColor
            },
            ]
        }
        ],
        tooltip: {
            pointFormat: '{series.name}: <b>{point.y}</b><br/>',
            enabled: true,
            shared: true
        },

        series: [{

            name: 'Actual',
            data: [0],
            dataLabels: {

                formatter: function () {
                    var kmh = topValue;
                    dataLabel = '<span class="dataLabels">' + kmh + '</span>';
                    $("#gaugeHolder .highcharts-container").after(dataLabel);
                },

                y: 12,
                zIndex: 10,

            },
            tooltip: {
                valueSuffix: showTarget == "true" ? '<br></br>Target: <b>' + lastTargetData + '</b>' : '',
                backgroundColor: null,
                borderWidth: 0,
                shadow: true,
                useHTML: true,
                style: {
                    padding: 0
                }
            }
        }
        ]

    };
    gaugaChart = new Highcharts.Chart(options);
    setInterval(chartFunction(gaugaChart, lastTopData), 500);

}
var chartFunction = function (gaugaChart, actualValue) {
    var point = gaugaChart.series[0].points[0],
	newVal,
	inc = actualValue;

    newVal = inc;
    if (newVal < 0 || newVal > 100) {
        newVal = actualValue;
    }

    point.update(newVal);
}



function numberWithCommas(x) {
    //log(x);
    if (x != 0 && x != "" && x != null)
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    else
        return 0;
}
Array.prototype.unique = function () {
    var n = [];
    for (var i = 0; i < this.length; i++) {
        if (n.indexOf(this[i].items[1]) == -1) n.push(this[i].items[1]);
    }
    return n;
}

function clickedGuage() {
    $('.chartHolder').addClass("pushBack");
    $('.gaugeHolder').removeClass("pushBack");
    $(".icon-holder button").removeClass("active");
    $("#guage").addClass("active");

    selection = "gaugeHolder";
    selectionType = "";
}

function clickedLine() {
    $('.chartHolder').removeClass("pushBack");
    $('.gaugeHolder').addClass("pushBack");
    var chart = $('.chartHolder').highcharts();
    chart.inverted = false;
    chart.xAxis[0].update({}, false);
    chart.yAxis[0].update({}, false);
    chart.series[0].update({
        type: 'line'
    });

    $(".icon-holder button").removeClass("active");
    $("#line").addClass("active");
    selection = "chartHolder";
    selectionType = "Line";
}

function clickedChart() {
    $('.chartHolder').removeClass("pushBack");
    $('.gaugeHolder').addClass("pushBack");
    var chart = $('.chartHolder').highcharts();
    chart.inverted = false;
    chart.xAxis[0].update({}, false);
    chart.yAxis[0].update({}, false);
    chart.series[0].update({
        type: 'column'
    });

    $(".icon-holder button").removeClass("active");
    $("#bar").addClass("active");
    selection = "chartHolder";
    selectionType = "Bar";
}

function checkNoData() {
    if (chartValue.series[0].data.length > 0) {
        //alert("data available")
        chartValue.yAxis[0].update({ lineWidth: 1, })
    }
    else {
        chartValue.yAxis[0].update({ lineWidth: 0, })
    }
}




// 
// #endregion Drawing Code
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
// #region Marking Code
//

//
// This method receives the marking mode and marking rectangle coordinates
// on mouse-up when drawing a marking rectangle
//
function markModel(markMode, rectangle) {
    // Implementation of logic to call markIndices or markIndices2 goes here
}

//
// Legacy mark function 2014 HF2
//
function mark(event) {
}

// 
// #endregion Marking Code
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
// #region Resizing Code
//

var resizing = false;

window.onresize = function (event) {
    resizing = true;
    if ($("#js_chart")) {
    }
    resizing = false;
}
