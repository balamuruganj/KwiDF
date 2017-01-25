/*
Copyright (c) 2016 TIBCO Software Inc

THIS SOFTWARE IS PROVIDED BY TIBCO SOFTWARE INC. ''AS IS'' AND ANY EXPRESS OR
IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
SHALL TIBCO SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

//////////////////////////////////////////////////////////////////////////////
// #region Drawing Code
//

var gauges = [];
$(document).ready(function () {
    var chartObj = $("#js_chart");
    chartObj.on('click', '.wrapper', function () {
        var objId = $(this).attr('id');
        var ind = objId.split('wrapper');
        if (parseInt(ind[1]) == 0) {
            index = 0;
            indexVal = 1;
        }
        else {
            index = parseInt(ind[1]) + parseInt(ind[1]);
            indexVal = index + 1;
        }
        var act = actualValueArray[index] + ' as ' + actualDisplayArray[index]
        var tar = actualValueArray[indexVal] + ' as ' + actualDisplayArray[indexVal]
        if ($(this).hasClass("selected")) {
            $(this).removeClass('selected');
            setDocumentProperty("RefreshKPIGC", "false");
            runScript("DynamicProductionCategory", [{ "Key": "actualValue", "Value": act }, { "Key": "targetValue", "Value": tar }, { "Key": "isDelete", "Value": 1 }, { "Key": "individualScale", "Value": 1 }]);
        } else {
            //$('.wrapper').removeClass('selected');
            $(this).addClass('selected');
            setDocumentProperty("RefreshKPIGC", "false");
            runScript("DynamicProductionCategory", [{ "Key": "actualValue", "Value": act }, { "Key": "targetValue", "Value": tar }, { "Key": "isDelete", "Value": 0 }, { "Key": "individualScale", "Value": 1 }]);
        }
    });

});

function dictSize(obj) {
    var size = 0,
	key;
    for (key in obj) {
        if (obj.hasOwnProperty(key))
            size++;
    }
    return size;
}

function createGauge(name, label, size, min, max, actualdata) {
    var config = {
        size: size,
        label: label,
        min: undefined != min ? min : 0,
        max: undefined != max ? max : 100,
        minorTicks: 5
    }

    var range = config.max - config.min;
    config.greenZones = [{
        from: config.min,
        to: actualdata
    }
    ];
    config.yellowZones = [{
        from: actualdata,
        to: config.min + range * 0.9
    }
    ];
    config.redZones = [{
        from: config.min + range * 0.9,
        to: config.max
    }
    ];

    gauges[name] = new Gauge(name, config);
    gauges[name].render();
}

function updateGauges() {
    for (var key in gauges) {
        var value = getRandomValue(gauges[key])
        gauges[key].redraw(value);
    }
}

//
// Main Drawing Method
//
var actualValueArray = [];
var actualDisplayArray = [];
var titleArray = [];
var columns;

var selectedCategoryActual = "";
var selectedCategoryTarget = "";

function renderCore(sfdata) {

    if (resizing) {
        return;
    }

    // Extract the columns
    columns = sfdata.columns;
    actualValueArray = sfdata.config.ColumnName;
    actualDisplayArray = sfdata.config.DisplayName;
    selectedCategoryActual = sfdata.config.CategoryConditionActual;
    selectedCategoryTarget = sfdata.config.CategoryConditionTarget;
    // Extract the data array section
    var chartdata = sfdata.data;
    var DateValue = new Date(sfdata.config.DateFilter);
    var DateValueFormatted = DateValue.valueOf();
    var nextDate = new Date(sfdata.config.DateFilter);
    var numberOfDaysToAdd = 1;
    nextDate.setDate(nextDate.getDate() + numberOfDaysToAdd);
    var nextDateValueFormatted = nextDate.valueOf();
    //log("NextDate - " + nextDate);
    var chartdataformatted = chartdata.filter(function (el) {
        DateValue = new Date(sfdata.config.DateFilter);
        DateValueFormatted = DateValue.valueOf();
        var formatedDate = el.items[8].replace("/Date(", "").replace(")/", "").valueOf();
        if (DateValueFormatted <= formatedDate && nextDateValueFormatted > formatedDate) {

            return (el);
        }

    });
    var actualData = [];
    var targetData = [];
    if (chartdataformatted.length > 0) {
        for (var j = 0; j < chartdataformatted[0].items.length; j++) {
            if (j % 2 == 0) {
                actualData.push(chartdataformatted[0].items[j]);
                //actualData.push(123);
            } else {
                targetData.push(chartdataformatted[0].items[j]);

            }
            if (j == 8) {

            }
        }
    }

    //log("filteredDataLength - " +chartdataformatted.length);
    var config = sfdata.config;

    titleArray = config.title;
    var gaugesize = undefined != config.gaugesize ? config.gaugesize : 350;

    var idx;
    if (sfdata.config.RefreshKPI == "true") {
        var chartObj = $("#js_chart");

        // Extract the config params section

        for (var i = 0; i < config.noOfGauges; i++) {
            var wrapperObj = 'wrapper' + i;
            var gaugeObj = 'gaugeHolder' + i;
            if ($('#' + wrapperObj, chartObj).length == 0) {
                $(chartObj).append("<div id=" + wrapperObj + " class='wrapper' />");
                $("#" + wrapperObj).append("<div id=" + gaugeObj + " class='gaugeHolder' />");
                $("#" + wrapperObj).append("<div class='footer' />");
                var gaugeTitle = config.title[i];
                $("#" + gaugeObj).attr('data-title', gaugeTitle);

                //$('#' + wrapperObj, chartObj).height(170);
                $('#' + gaugeObj, chartObj).height(170);


            }
            var gaugeTitle = config.title[i];
            //var gaugeParam=config.category[i];
            var scriptName = config.Script;
            if (targetData.length > 0) {
                createCustomGauge(gaugeObj, actualData[i], targetData[i], gaugeTitle, scriptName);

            }
            else {
                createCustomGauge(gaugeObj, actualData[i], 0, gaugeTitle, scriptName);
            }
            var dataLabel = '<span class="dataLabels" >' + actualData[i] + '%</span>';
            $("#" + wrapperObj + " .highcharts-container", chartObj).after(dataLabel);
        }
        for (var i = 0; i < actualDisplayArray.length - 1; i++) {
            if (selectedCategoryActual != "" && selectedCategoryActual != undefined) {
                if (selectedCategoryActual.indexOf(actualDisplayArray[i]) > -1) {
                    if (i == 0) {
                        $("#wrapper0").addClass('selected');
                    }
                    else {
                        var n = i / 2;
                        $("#wrapper" + n).addClass('selected');
                    }

                }
                else {
                    if (i == 0) {
                        $("#wrapper" + i).removeClass('selected');
                    }
                    else {
                        var n = i / 2;
                        $("#wrapper" + n).removeClass('selected');
                    }
                }
            }
            else {
                if (i == 0) {
                    $("#wrapper" + i).removeClass('selected');
                }
                else {
                    var n = i / 2;
                    $("#wrapper" + n).removeClass('selected');
                }
            }
        }
        $(".highcharts-container ", chartObj).after("<div class='overlay'/>");


    }
    // wait ( sfdata.wait, sfdata.static );
}

function createCustomGauge(renderObject, actualValue, targetValue, gaugeTitle, scriptName) {
    //var chartVal=new Highcharts.Chart({
    var startColor = "";
    var stopColor = "";
    var borderColor = "";
    plotBandStartColor = "#429e2f";
    plotBandEndColor = "#ff5050";
    if (actualValue > targetValue) {
        startColor = "#a5a5a5";
        stopColor = "#000";
        borderColor = "#434242";

    }
    else if (actualValue < targetValue) {
        startColor = "#a5a5a5";
        stopColor = "#000";
        borderColor = "#434242";

    }
    else {
        startColor = "#a5a5a5";
        stopColor = "#000";
        borderColor = "#434242";

    }
    var maxValue;
    var minValue;
    if (actualValue > targetValue) {
        maxValue = actualValue + ((20 / 100) * actualValue);
        if (maxValue < 100)
            maxValue = 100;
        if (targetValue < 0) {
            minValue = targetValue - ((20 / 100) * targetValue);
        }
        else {
            minValue = 0;
        }
    }
    else {
        maxValue = targetValue + ((20 / 100) * targetValue);
        if (maxValue < 100)
            maxValue = 100;
        if (actualValue < 0) {
            minValue = actualValue - ((20 / 100) * actualValue);
        }
        else {
            minValue = 0;
        }
    }

    //log("actualValue " + actualValue);
    //log("targetValue " + targetValue);
    //log("minValue " + minValue);
    //log("maxValue " + maxValue);

    var options = {
        chart: {
            renderTo: renderObject,
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
            text: '',
            style: { color: '#fff', 'font-size': '13px' }

        },

        pane: {
            startAngle: -90,
            endAngle: 90,
            center: ['50%', '95%'],
            size: '100%',
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
            tickPositions: [targetValue],
            lineColor: '#transparent',
            tickColor: '#fff',
            minorTickColor: '#fff',
            minorTickPosition: 'inside',
            tickLength: 20,
            tickWidth: 3,
            minorTickWidth: 0,
            minorTickLength: 7,
            offset: 0,
            lineWidth: 1.5,
            labels: {
                distance: 15,
                rotation: 0,
                format: '{value}%',
                style: {
                    color: '#fff',

                    fontSize: '13px',
                    fontWeight: 'normal'
                }
            },
            endOnTick: false,
            plotBands: [{
                from: 0,
                to: targetValue,
                thickness: '17%',
                color: plotBandStartColor // green
            }, {
                from: targetValue,
                to: maxValue,
                thickness: '17%',
                color: plotBandEndColor // red
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
                    var kmh = this.y;
                    //   return '<span style="color:#bed730;font-size:11px; font-weight:normal;stroke:none;z-index:10000;">' + kmh + '/' + targetValue + '</span>';
                },
                y: 12,
                zIndex: 10,

            },
            tooltip: {
                valueSuffix: '<br></br>Target:' + targetValue,
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
    chartVal = new Highcharts.Chart(options);
    setInterval(chartFunction(chartVal, actualValue), 500);

}
var chartFunction = function (chartVal, actualValue) {
    var point = chartVal.series[0].points[0],
	newVal,
	inc = actualValue;

    newVal = inc;
    if (newVal < 0 || newVal > 100) {
        newVal = actualValue;
    }

    point.update(newVal);
}

function markModel(markMode, rectangle) { }



var resizing = false;

window.onresize = function (event) {
    // No resizing logic for now
    resizing = true;
    if ($("#js_chart")) { }
    resizing = false;
}

//
// #endregion Resizing Code
//////////////////////////////////////////////////////////////////////////////

