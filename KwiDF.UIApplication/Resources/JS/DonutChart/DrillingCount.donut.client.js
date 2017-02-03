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

//
// Main Drawing Method
//
var chartVal;
var colName;
var configData;
var dataLabel;
function renderCore(sfdata) {
    configData = sfdata.config;
    var actualData = sfdata.data;
    colName = sfdata.columns[2];
    data = [];
    targetData = [];
    assetArray = [];
    assetArrayData = [];
    var totalCount = 0;
    indexdata = [];
    indicesarray = [];
    indicesarrayobject = [];
    markedAssets = [];
    titleTooltip = sfdata.config.title;

    var DateValue = new Date(sfdata.config.DateFilter);
    var DateValueFormatted = DateValue.valueOf();
    var nextDate = new Date(sfdata.config.DateFilter);
    var numberOfDaysToAdd = 1;
    nextDate.setDate(nextDate.getDate() + numberOfDaysToAdd);
    var nextDateValueFormatted = nextDate.valueOf();
    //   log("NextDate - " + nextDate);
    //var actualData = sfdata.data;

    //   log("actualDataBefore" + actualData.length);
    actualData = actualData.filter(function (el) {
        DateValue = new Date(sfdata.config.DateFilter);
        DateValueFormatted = DateValue.valueOf();
        var formatedDate = el.items[3].replace("/Date(", "").replace(")/", "").valueOf();
        if (formatedDate >= DateValueFormatted && formatedDate < nextDate) {

            return (el);
        }

    });




    // Extract the config params section
    var config = sfdata.config;
    //categoryArray=config.title;
    //var gaugesize = undefined != config.gaugesize ? config.gaugesize : 350;

    var idx;

    var chartObj = $("#js_chart");

    for (var j = 0; j < config.noOfGauges; j++) {
        var wrapperObj = 'wrapper' + j;
        if ($('#' + wrapperObj, chartObj).length == 0) {
            $(chartObj).append("<div id=" + wrapperObj + " class='wrapper' />");
            $('#' + wrapperObj, chartObj).height($(window).height());



        }
        var Title = config.title[j];
        //var scriptName =config.Script;

        assetArray = [];
        for (i = 0; i < actualData.length; i++) {
            if (sfdata.config.FilteredCategory != undefined && sfdata.config.FilteredCategory != "") {
                if (sfdata.config.FilteredCategory == actualData[i].items[0]) {
                    assetArray.push([actualData[i].items[j + 2], actualData[i].items[j + 1]]);
                    assetArrayData.push([actualData[i].items[j + 2], actualData[i].items[j + 1]]);
                    //totalCount = actualData[i].items[2];
                    indexdata.push(actualData[i].hints.index);
                    indicesobject = {};
                    indicesobject.index = actualData[i].hints.index;
                    indicesobject.Asset = actualData[i].items[1];
                    indicesobject.marked = actualData[i].hints.marked != undefined ? actualData[i].hints.marked : false;
                    indicesarrayobject.push(indicesobject);
                    targetData.push(actualData[i].items[3]);
                    if (actualData[i].hints.marked != undefined && actualData[i].hints.marked) {
                        markedAssets.push(actualData[i].items[2]);
                    }
                }
            }
            else {
                assetArray.push([actualData[i].items[j + 2], actualData[i].items[j + 1]]);
                assetArrayData.push([actualData[i].items[j + 2], actualData[i].items[j + 1]]);
                //totalCount = actualData[i].items[2];

                //log(actualData[i].hints.marked);
                if (actualData[i].hints.marked != undefined && actualData[i].hints.marked) {
                    markedAssets.push(actualData[i].items[2]);
                }

                indexdata.push(actualData[i].hints.index);
            }
            //totalCount += totalCount;
        }

        createCustomControl(wrapperObj, Title, assetArrayData, titleTooltip[j])

    }
    $(".highcharts-container ", chartObj).after("<div class='overlay'/>");

}

function createCustomControl(renderObject, Title, data, tooltipName) {

    //data =  assetArray;
    Highcharts.setOptions({
        colors: ['#25acff', '#429e2f', '#fcff01', '#275076', '#fd8f00', '#10d1fa']
    });
    //
    var options = {
        credits: {
            enabled: false
        },
        chart: {
            margin: [20, 0, 0, 0],
            spacingTop: 10,
            spacingBottom: 0,
            spacingLeft: 0,
            spacingRight: 0,
            renderTo: renderObject,
            type: 'pie',
            backgroundColor: 'transparent',

            events: {
                click: function (event) {
                    log("Chart  Clicked");


                    for (var k = 0; k < assetArray.length; k++) {
                        log("assetArray" + assetArray[k][0]);
                        //var x= 

                        //log(this.x + "," +  this.y + "," + this.name);
                        if (assetArray[k][0] == this.name) {
                            log("series matched" + this.name);
                            log("indexdata" + indexdata.length);
                            indicesarray.push(indexdata[k]);
                            log("index" + indicesarray.length);
                        }
                    }
                    var markData = {};
                    //log("markIndices series click" + markData);
                    markData.markMode = "Replace";
                    markData.indexSet = indicesarray;
                    //if ( typeof(JSViz) != 'undefined' )
                    //{
                    markIndices(markData);
                    //} 

                }
            }
        },
        title: {
            text: Title,
            style: { color: '#fff', fontSize: '14px' }
        },
        subtitle: {
            text: ''
        },
        plotOptions: {
            pie: {
                innerSize: 80,
                depth: 20,
                dataLabels: {
                    distance: 10,
                    enabled: true,
                    color: '#fff',
                    style: { fontFamily: 'arial', fontSize: '11px', fontWeight: 'normal', }
                }
            }
        },
        series: [{

            name: tooltipName,
            data: data,
            point: {
                events: {
                    click: function ()
                        //{
                        //  runScript("OS1-Gauge");
                        //}
                    {
                        log("Chart Series Clicked");

                        log("assetArray" + assetArray.length);
                        for (var k = 0; k < assetArray.length; k++) {
                            log("assetArray" + assetArray[k][0]);
                            //var x= 

                            //log(this.x + "," +  this.y + "," + this.name);
                            if (assetArray[k][0] == this.name) {
                                log("series matched" + this.name);
                                log("indexdata" + indexdata.length);
                                indicesarray.push(indexdata[k]);
                                log("index" + indicesarray.length);
                            }
                        }
                        var markData = {};
                        //log("markIndices series click" + markData);
                        markData.markMode = "Replace";
                        markData.indexSet = indicesarray;
                        //if ( typeof(JSViz) != 'undefined' )
                        //{
                        markIndices(markData);
                        //} 

                    }


                }
            }

        }],
        exporting: { enabled: false },



    };

    // var chartVal = Highcharts.chart('js_chart', options);
    var chartVal = new Highcharts.Chart(options);
    //log("markedAssets" + markedAssets[0]);
    if (markedAssets.length > 0) {


        for (i = 0; i < chartVal.series[0].data.length; i++) {
            //log(chartVal.series[0].data.length);
            log(Title);

            var marked = false;
            var flag = true;
            for (j = 0; j < markedAssets.length; j++) {
                log("MarkedAssetValue" + markedAssets[j]);
                log("ChartValue" + chartVal.series[0].data[i].name);
                //log("thisChartValue"+this.chartVal.series[0].data[i].name);
                if (chartVal.series[0].data[i].name == markedAssets[j]) {
                    //chartVal.series[0].data[i].opacity='0.25';
                    //this.chartVal.series[i].data[0].update({ color: 'red' });

                    marked = true;
                    //this.chartVal.series[0].data[i].update({ color: 'rgba(216, 24, 28, 1)', borderColor: '#fff' });
                    //chartVal.series[0].data[i].setState('hover');
                    //chartVal.series[0].data[i].update({ color: '#80FF0000', borderColor: '#fff' });

                    //chartVal.series[0].fillOpacity= '0.1';
                    //log("Chart value matched(IF)");
                    log("DefaultColor:" + chartVal.series[0].data[i].color);
                    //chartVal.series[0].data[i].update({ setState: 'hover' });
                    /*if (this.chartVal.series[1].data[i].y >= this.chartVal.series[0].data[i].y) {
                                                                                                
                                                                                                                        this.chartVal.series[0].data[i].update({ color: 'rgba(216, 24, 28, 1)', borderColor: '#fff' });

                    } 
                                                                                
else {
                                                                                                
                                                                                                                        this.chartVal.series[0].data[i].update({ color: 'rgba(31, 174, 57, 1)', borderColor: '#fff' });

                    }*/
                    var color = "";
                    if (chartVal.series[0].data[i].color.indexOf("#") != -1) {
                        color = convertHex(chartVal.series[0].data[i].color, 100);;

                        //log("color after marking" + color)
                        chartVal.series[0].data[i].update({ color: color });
                    }

                    else {
                        if (chartVal.series[0].data[i].color.indexOf("rgba") != -1)

                            color = chartVal.series[0].data[i].color;
                        color = color.replace(/[^,]+(?=\))/, '1');
                        chartVal.series[0].data[i].update({ color: color });
                    }






                }


                else if (!marked) {

                    //chartVal.series[0].data[i].color.opacity=1;

                    //chartVal.series[0].data[i].update({ color: '#80FF0000', borderColor: '#fff' });
                    //chartVal.series[0].data[i].update({ setState: '' });


                    //  if (this.chartVal.series[0].data[i].y >= this.chartVal.series[0].data[i].y) {
                    //this.chartVal.series[0].data[i].update({ color: 'rgba(216, 24, 28, 0.3)' });
                    log("ColorHexCode:" + chartVal.series[0].data[i].color);
                    if (chartVal.series[0].data[i].color.indexOf("#") != -1) {
                        color = convertHex(chartVal.series[0].data[i].color, 30);
                        //log("ColorCode:"+color);
                        chartVal.series[0].data[i].update({ color: color });
                    }
                    else {
                        if (chartVal.series[0].data[i].color.indexOf("rgba") != -1)

                            color = chartVal.series[0].data[i].color;
                        color = color.replace(/[^,]+(?=\))/, '0.3');
                        chartVal.series[0].data[i].update({ color: color });
                    }


                    //log("Chart value matched(ELSE)");


                    // } 

                    /*else {
                                                 
                                                                         this.chartVal.series[0].data[i].update({ color: 'rgba(31, 174, 57, 0.3)' });

}*/
                    //this.chartVal.series[0].data[i].update({ color: '#294251' });
                }
            }
        }
    }
    //$("#js_chart .highcharts-container").after("<span class='dataLabels'>"+totalCount+"</span>");


    //chartVal = new Highcharts.Chart(options);
    //setInterval(chartFunction(chartVal, actualValue), 500);

}

//wait(sfdata.wait, sfdata.static);





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
}

// 
// #endregion Marking Code
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
// #region Resizing Code
//

var resizing = false;

window.onresize = function (event) {
    // No resizing logic for now
    resizing = true;
    if ($("#js_chart")) {
    }
    resizing = false;
}

function convertHex(hex, opacity) {
    hex = hex.replace('#', '');
    //log("hex" + hex);
    r = parseInt(hex.substring(0, 2), 16);
    //log("R" + r);
    g = parseInt(hex.substring(2, 4), 16);
    //log("G" + g);
    b = parseInt(hex.substring(4, 6), 16);
    //log("B" + b);


    result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
    return result;
}

// 
// #endregion Resizing Code
//////////////////////////////////////////////////////////////////////////////

