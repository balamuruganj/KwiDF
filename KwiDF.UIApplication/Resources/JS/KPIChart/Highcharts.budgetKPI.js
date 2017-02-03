$(document).ready(function () {
    var chartObj = $("#js_chart");
    chartObj.on('click', '.wrapper', function () {
        $(this).toggleClass('selected');
        if ($(this).hasClass('selected')) {
            $(".overlay", $(this)).show();
            updateColor();

            setDocumentProperty("RefreshKPI", "false");
            setDocumentProperty("RefreshKPIGC", "false");
            var visibility = $("#currencyUSD").is(":visible");
            log(visibility);
            if (visibility) {

                runScript("DynamicProductionCategory", [{ "Key": "actualValue", "Value": KD }, { "Key": "targetValue", "Value": "" }, { "Key": "isDelete", "Value": 0 }]);
            }
            else {

                runScript("DynamicProductionCategory", [{ "Key": "actualValue", "Value": USD }, { "Key": "targetValue", "Value": "" }, { "Key": "isDelete", "Value": 0 }]);
            }

        } else {
            setDocumentProperty("RefreshKPI", "false");
            setDocumentProperty("RefreshKPIGC", "false");
            $(".overlay", $(this)).hide();
            updateColor();
            var visibility = $("#currencyUSD").is(":visible");
            if (visibility) {

                runScript("DynamicProductionCategory", [{ "Key": "actualValue", "Value": KD }, { "Key": "targetValue", "Value": "" }, { "Key": "isDelete", "Value": 1 }]);
            }
            else {

                runScript("DynamicProductionCategory", [{ "Key": "actualValue", "Value": USD }, { "Key": "targetValue", "Value": "" }, { "Key": "isDelete", "Value": 1 }]);
            }
        }
    });

    chartObj.on('click', ".icon-holder button", function (event) {
        event.stopPropagation();
    });


});



var kpiactive = false;
var chartValue;
var gaugaChart;
var colName;
var configData;
var topExpenditureValue = "";
var topExpenditureKDValue = "";
var bottomValue = "";
var targetValue = 0;
var topExpenditureData = 0;
var topExpenditureKDData = 0;
var selection = "chartHolder";
var selectionType = "";
var expenditureUSDdata = [];
var expenditureKDData = [];
var expenditurechangeData = [];
var selectedCategory = "";
var refreshKPI = "";
var USDVal = "";
var USDDisplay = "";
var KDVal = "";
var KDDisplay = "";
var USD = "";
var KD = "";

function renderCore(sfdata) {

    //var UrlCSS = "http://localhost/KwiDF/Resources/CSS/font-awesome.css"; //replace with sfdata.config
    var UrlCSS = sfdata.config.UrlCSS;
    $("head").append("<link>");
    var css = $("head").children(":last");
    css.attr({
        rel: "stylesheet",
        type: "text/css",
        href: UrlCSS
    });

    configData = sfdata.config;
    var actualData = sfdata.data;
    colName = sfdata.columns[2];
    var series = {};
    var processed_json = new Array();


    //log(sfdata.config.DateFilter);
    var month = new Date(sfdata.config.FilterDate).getUTCMonth() + 1; //months from 1-12
    var year = new Date(sfdata.config.FilterDate).getUTCFullYear();
    refreshKPI = sfdata.config.RefreshKPI;
    configData = sfdata.config;
    var actualData = sfdata.data;
    actualData = actualData.filter(function (el) {
        //DateValue = new Date(sfdata.config.DateFilter);
        //DateValueFormatted = DateValue.valueOf();

        var dateip = new Date(year, month - 1).valueOf();
        var dateop = new Date(el.items[5], el.items[0] - 1).valueOf();


        //log("DateValueFormatted" + DateValueFormatted + "DateValue" + el.items[0]);
        return dateop <= dateip;

    });

    selectedCategory = sfdata.config.CategoryConditionActual;

    USDVal = sfdata.config.ColumnName[0];
    USDDisplay = sfdata.config.DisplayName[0];
    KDVal = sfdata.config.ColumnName[1];
    KDDisplay = sfdata.config.DisplayName[1];

    USD = USDVal + ' as ' + USDDisplay;
    KD = KDVal + ' as ' + KDDisplay;
    if (refreshKPI == "true") {
        for (i = 0; i < actualData.length; i++) {

            expenditureUSDdata.push([actualData[i].items[0], actualData[i].items[2]]);
            expenditureKDData.push([actualData[i].items[0], actualData[i].items[3]]);
            expenditurechangeData.push(actualData[i].items[4]);

        }
        series = {
            name: "USD",
            data: expenditureUSDdata
        };
        processed_json.push(series);

        topExpenditureData = 0;
        if (expenditureUSDdata.length > 0) {
            var len = expenditureUSDdata.length - 1;
            topExpenditureData = expenditureUSDdata[len][1] != 0 && expenditureUSDdata[len][1] != "" ? Math.round(expenditureUSDdata[len][1]) : 0;
            topExpenditureValue = numberWithCommas(topExpenditureData);

            if (expenditureKDData.length > 0) {
                var len = expenditureKDData.length - 1;
                topExpenditureKDData = expenditureKDData[len][1] != 0 && expenditureKDData[len][1] != "" ? Math.round(expenditureKDData[len][1]) : 0;
                topExpenditureKDValue = numberWithCommas(topExpenditureKDData);
            }
            if (expenditurechangeData.length > 0) {
                var len = expenditurechangeData.length - 1;
                var bottomData = expenditurechangeData[len] != 0 && expenditurechangeData[len] != "" ? Math.round(expenditurechangeData[len]) : 0;
                bottomValue = numberWithCommas(bottomData);
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
            //$(".chartHolder", drawChart).highcharts({



            $("header", drawChart).append("<h2>" + sfdata.config.lableText + " <span>" + sfdata.config.UOMText + "</span></h2>").append("<p>" + topExpenditureValue + "</p>");

            $(drawChart).append("<footer/>");
            $("footer", drawChart).append("<span class='up'>" + bottomValue + "</span>");
            $("footer", drawChart).append("<div class='icon-holder'/>");
            $("footer .icon-holder", drawChart).append("<div class='icon-switch' />");
            $("footer .icon-holder .icon-switch", drawChart).append('<button onclick="clickedCurrency(true)"  id="currencyUSD" style="display:none;"><i class="fa fa-usd" aria-hidden="true"></i></button>');
            $("footer .icon-holder .icon-switch", drawChart).append('<button onclick="clickedCurrencyKD(true)"  id="currencyKD" ><i class="fa fa-btc" aria-hidden="true"></i></button>');

            $("footer .icon-holder", drawChart).append('<button onclick="clickedLine()"  id="line" class="active"><i class="fa fa-line-chart" aria-hidden="true"></i></button>');
            $("footer .icon-holder", drawChart).append('<button onclick="clickedChart()" id="bar"><i class="fa fa-bar-chart" aria-hidden="true"></i></button>');

            drawChart.append("<div class='overlay'/>");
        }

        Highcharts.setOptions({

            lang: {
                decimalPoint: '.',
                thousandsSep: ','
            }
        });

        var options = {
            chart: {
                renderTo: 'chartHolder'
            },
            backgroundColor: 'transparent',
            borderWidth: 0,
            plotBackgroundColor: 'transparent',
            plotShadow: false,
            plotBorderWidth: 0,
            margin: 0,
            padding: 0,
            spacing: [0, 0, 0, 0],
            title: {
                text: ' ',


            },

            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
                    month: '%e. %b',
                    year: '%b'
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
                    marker: {
                        enabled: true,
                        symbol: 'circle',
                        radius: 2,
                        // if you want to remove hover efect, add the following lines

                        states: {
                            hover: {
                                radius: 3
                            }
                        }

                    },

                    color: '#fff',

                    lineWidth: .8,
                    // pointPadding: 0,
                    // groupPadding: 0,
                    //pointWidth:10
                }
            },


            exporting: { enabled: false },
            yAxis: [{

                lineWidth: 1,
                opposite: true,

                labels: {
                    enabled: true,
                    align: 'left',
                    x: 5,
                    style: {
                        //color: '#fff'
                    },
                    formatter: function () {
                        return Highcharts.numberFormat(this.value, 0)
                    }
                },

                gridLineDashStyle: 'Dash',
                className: 'highcharts-color-0',

                title: {
                    enabled: false,
                    text: 'Temperature (°C)'
                }

            }, ],


            tooltip: {
                formatter: function () {
                    var name = getMonthName(this.x - 1)
                    return "Expenditure for the month " + name + " is " + Highcharts.numberFormat(this.y, 0) + " " + this.series.name;
                    //return this.x + this.y
                }
            },
            legend: {
                //  layout: 'vertical',
                //  align: 'center',
                // verticalAlign: 'bottom',
                // borderWidth: 0
                enabled: false
            },
            series: processed_json,




        }
        chartValue = new Highcharts.Chart(options);


        //createCustomGauge();



        $("header p").html(topExpenditureValue);
        //log(bottomData);
        //bottomVal = numberWithCommas(bottomData);
        $("footer span").html(bottomValue);
        if (bottomData < 0) {
            $(".smallSection span").addClass("down");
            $(".smallSection span").removeClass("up");
            $(".smallSection span").removeClass("neutral");
            $(".smallSection header").css("background", "red")
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
        log("Selected Category - " + selectedCategory + ",USD Val - " + USD);
        log("Selected Category - " + selectedCategory + ",KD Val - " + KD);


        chooseSelection();
        checkNoData();
        //  wait ( sfdata.wait, sfdata.static ); 

        if (selectedCategory != "" && selectedCategory != undefined) {
            if (selectedCategory.indexOf(USD) > -1) {
                kpiactive = true;
                clickedCurrency(false);
            }
            else if (selectedCategory.indexOf(KD) > -1) {
                kpiactive = true;
                clickedCurrencyKD(false);
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
            updateColor();
            //log("KPI Style Selected added-"+kpiactive);
        }
        else {
            log("KPI ACTIVE False Condition - " + kpiactive);
            $('.wrapper', chartObj).removeClass('selected');
            $(".overlay", chartObj).hide();
            updateColor();
            //log("KPI Style Selected removed-"+kpiactive);
        }

    }
    if (selectedCategory != "" && selectedCategory != undefined) {
        if (selectedCategory.indexOf(USD) > -1) {
            kpiactive = true;
            //clickedCurrency();
        }
        else if (selectedCategory.indexOf(KD) > -1) {
            kpiactive = true;
            // clickedCurrencyKD();
        }
        else {
            kpiactive = false;
        }

    }
    else {
        kpiactive = false;
    }
}
function getMonthName(monthNo) {
    var months = ["January", "February", "March", "April", "May", "June",
               "July", "August", "September", "October", "November", "December"];

    return months[monthNo];
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

function chooseSelection() {

    $('.chartHolder').addClass("pushBack");

    if (selection == "gaugeHolder") {
        clickedGuage();
    } else {
        if (selectionType == "line") {
            clickedLine();
        } else {
            clickedChart();
        }
    }
    updateColor();
}


function updateColor() {
    var chart = $('.chartHolder').highcharts();
    if (chart.series != undefined) {
        if ($('.overlay').is(':visible')) {

            if (chart.series.length > 0) {
                chart.series[0].options.color = "#00f";
                chart.series[0].update(chartValue.series[0].options);
            }
        } else {
            if (chart.series.length > 0) {
                chart.series[0].options.color = "#fff";
                chart.series[0].update(chartValue.series[0].options);
            }
        }
    }

}


function createCustomGauge() {

    gaugeTitle = "";

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
						[0, '#407aaa'],
						[1, '#04142d']
			        ]
			    },
			    borderColor: '#494b4c',
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
            min: 0,
            title: {
                text: ''
            },
            max: lastTargetData + 2000,
            lineColor: '#transparent',
            tickColor: '#000',
            minorTickColor: '#000',
            minorTickPosition: 'inside',
            tickLength: 25,
            tickWidth: 5,
            minorTickLength: 8,
            offset: 0,
            lineWidth: 1.5,
            labels: {
                distance: -30,
                rotation: 0,
                style: {
                    color: '#fff',

                    fontSize: '13px',
                    fontWeight: 'normal'
                }
            },
            endOnTick: true,
            plotBands: [{
                from: 0,
                to: lastTargetData,
                thickness: '17%',
                color: '#b1bdcd' // green
            }, {
                from: lastTargetData,
                to: lastTargetData + 2000,
                thickness: '17%',
                color: '#5b7290' // red
            },
            ]
        }
        ],

        series: [{

            name: 'Value',
            data: [0],
            dataLabels: {
                formatter: function () {
                    var kmh = topValue;
                    dataLabel = '<span class="dataLabels">' + kmh + '/' + targetValue + '</span>';
                    $("#gaugeHolder .highcharts-container").after(dataLabel);
                },

                y: 12,
                zIndex: 10,

            },
            tooltip: {
                valueSuffix: '',
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
    selectionType = "line";
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
    selectionType = "column";
}
function clickedCurrency(isRunScript) {


    chartValue.series[0].update({
        name: "USD",
        data: expenditureUSDdata
    }, true);
    $("header p").html(topExpenditureValue);
    $("header h2 span").html("($)");
    $(".icon-holder button").removeClass("active");
    $("#currencyUSD").removeClass("active");
    $("#currencyUSD").css("display", "none");
    $("#currencyKD").css("display", "block");
    $("#currencyKD").addClass("active");
    log("kpiactive USD" + kpiactive);
    if (kpiactive == true && isRunScript == true) {
        runScript("DynamicProductionCategory", [{ "Key": "actualValue", "Value": KD }, { "Key": "targetValue", "Value": "" }, { "Key": "isDelete", "Value": 1 }]);

        runScript("DynamicProductionCategory", [{ "Key": "actualValue", "Value": USD }, { "Key": "targetValue", "Value": "" }, { "Key": "isDelete", "Value": 0 }]);
    }

}
function clickedCurrencyKD(isRunScript) {
    /*series = {
        name: "KD",
        data: expenditureKDData
    };*/
    chartValue.series[0].update({
        name: "KD",
        data: expenditureKDData
    }, true); //true / false to redraw
    //chartValue.series[0].setData(series);
    $("header p").html(topExpenditureKDValue);
    $("header h2 span").html("(KD)");
    $(".icon-holder button").removeClass("active");
    $("#currencyKD").removeClass("active");
    $("#currencyKD").css("display", "none");
    $("#currencyUSD").css("display", "block");
    $("#currencyUSD").addClass("active");
    log("kpiactive KD" + kpiactive);
    if (kpiactive == true && isRunScript == true) {
        runScript("DynamicProductionCategory", [{ "Key": "actualValue", "Value": USD }, { "Key": "targetValue", "Value": "" }, { "Key": "isDelete", "Value": 1 }]);
        runScript("DynamicProductionCategory", [{ "Key": "actualValue", "Value": KD }, { "Key": "targetValue", "Value": "" }, { "Key": "isDelete", "Value": 0 }]);
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
