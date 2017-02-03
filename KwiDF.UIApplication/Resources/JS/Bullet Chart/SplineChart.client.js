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
var noofSeries;
var actualData;
function renderCore(sfdata) {

    if (resizing) {
        return;
    }

    configData = sfdata.config;
    noofSeries = sfdata.config.noofSeries;
    actualData = sfdata.data;
    colName = sfdata.columns[2];
    var series = [];
    data = [];
    targetData = [];
    Rate40Data = [];
    Rate50Data = [];
    Rate60Data = [];
    Rate70Data = [];
    assetArray = [];
    indexdata = [];
    indicesarray = [];
    indicesarrayobject = [];
    markedAssets = [];


    var DateValue = new Date(sfdata.config.DateFilter);
    var DateValueFormatted = DateValue.valueOf();
    var nextDate = new Date(sfdata.config.DateFilter);
    var numberOfDaysToAdd = 1;
    nextDate.setDate(nextDate.getDate() + numberOfDaysToAdd);
    var nextDateValueFormatted = nextDate.valueOf();
    //   log("NextDate - " + nextDate);
    var actualData = sfdata.data;

    //   log("actualDataBefore" + actualData.length);
    /*actualData = actualData.filter(function (el) {
        DateValue = new Date(sfdata.config.DateFilter);
        DateValueFormatted = DateValue.valueOf();
        var formatedDate = el.items[4].replace("/Date(", "").replace(")/", "").valueOf();
        if (DateValueFormatted <= formatedDate && nextDateValueFormatted > formatedDate) {

            return (el);
        }

    });*/

    //  log("actualDataAfter" + actualData.length);


    for (var i = 0; i < sfdata.config.SeriesConfig.length; i++) {



        var seriesdata = GetSeriesdata(sfdata.config.SeriesConfig[i].index, actualData);
        var color = '';
        if (sfdata.config.SeriesConfig[i].color != undefined) {
            color = sfdata.config.SeriesConfig[i].color;

        }
        else {
            color = ''

        }


        var seriesChild = {
            name: sfdata.config.SeriesConfig[i].DisplayName,
            color: color,
            data: seriesdata,
            type: sfdata.config.SeriesConfig[i].type,
            pointPadding: 0,
            pointPlacement: 0,
            pointWidth: 30,
            point: {
                events: {
                    click: function ()
                        //{
                        //  runScript("OS1-Gauge");
                        //}
                    {


                    }


                }
            }

        }
        series.push(seriesChild);

    }

    var chartObj = $("#js_chart");

    if ($('#wrapper', chartObj).length == 0) {
        $(chartObj).wrapInner("<div id='wrapper'/>");
        $('#wrapper', chartObj).height(220);
    }

    Highcharts.Renderer.prototype.symbols.line = function (x, y, width, height) {
        return ['M', x, y + width / 2, 'L', x + height, y + width / 2];
    };

    var options = {
        credits: {
            enabled: false
        },
        chart: {
            renderTo: 'js_chart',
            type: 'spline',
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            events: {
                click: function (event) {


                    //} 
                }
            }
        },
        title: {
            text: '',
            color: '#fff',
            style: { color: '#ccc', fontSize: '13px', fontFamily: 'arial' },
        },
        xAxis: {
            tickLength: 0,
            lineColor: '#ccc',
            lineWidth: 0,



            labels:

			{

			    style: {
			        color: '#fff'
			    }
			}
        },
        yAxis: [{

            title: {
                text: "",
                style: { color: '#ccc', fontSize: '13px', fontFamily: 'arial' },
            },
            labels:

			{

			    style: {
			        color: '#fff'
			    }
			}, gridLineColor: 'rgba(255,255,255,.3)'
        }],
        legend: {
            shadow: false,
            enabled: false,
        },
        exporting: { enabled: false },
        tooltip: {
            //shared: true
            formatter: function () {
                ;
                return this.series.name + "<strong>" + Highcharts.numberFormat(this.x, 2) + "</strong><br></br>Head:<strong>" + Highcharts.numberFormat(this.y, 2) + "<strong>"
                ;
            }
        },
        plotOptions: {

            column: {
                color: {
                    linearGradient: [500, 0, 500, 0],
                    stops: [
                        [0, '#25acff'],
                                      [0.5, '#fff'],
                                    [1, '#25acff']
                    ]
                },
                grouping: false,
                shadow: false,
                borderWidth: 1,
                borderColor: 'transparent'

            }, scatter: {
                marker: {   
					symbol:'circle',
                    radius: 5,
                    lineColor: '#fcff01',

                }
            },
            line: {
                softThreshold: false
            }

        },
        series: series
    }
    chartVal = new Highcharts.Chart(options);
    //wait(sfdata.wait, sfdata.static);


    //log("markedAssets" + markedAssets.length);

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
function GetSeriesdata(index, actualData) {
    var seriesdata = [];
    var x = null;
    var y = null;
    for (i = 0; i < actualData.length-1; i++) {
        x = actualData[i].items[index];
        y = actualData[i].items[index + 1];
		if(x==0)
					{
						log("Value : " +x +  i ); 
						x = null;}
				if(y==0)
					{ y = null;}
					
					
        if (typeof (x) === 'string') {
            if (parseFloat(x) != NaN) {
                x = parseFloat(x);
                y = parseFloat(y);
				if(x==0)
					{
						log("Value : " +x +  i ); 
						x = null;}
				if(y==0)
					{ y = null;}
            }

            else {
                x = null;
                y = null;

            }

        }

        var series = { x: '', y: '' };




        series.x = x;
        series.y = y;
        seriesdata.push(series);


        //return ;

        /*if (sfdata.config.FilteredCategory != undefined && sfdata.config.FilteredCategory != "") {
              //if (sfdata.config.FilteredCategory == actualData[i].items[0]) {
                  //assetArray.push([actualData[i].items[1]]);
                  //data.push(actualData[i].items[2]);
  
                  //indexdata.push(actualData[i].hints.index);
                  //indicesobject = {};
                 // indicesobject.index = actualData[i].hints.index;
                 // indicesobject.Asset = actualData[i].items[1];
                 // indicesobject.marked = actualData[i].hints.marked != undefined ? actualData[i].hints.marked : false;
                 // indicesarrayobject.push(indicesobject);
                  //targetData.push(actualData[i].items[3]);
                 // if (actualData[i].hints.marked != undefined && actualData[i].hints.marked) {
                      //markedAssets.push(actualData[i].items[1]);
                  //}
                  
             // }
          }
          else {
              //log(actualData[i].hints.marked);
              //if (actualData[i].hints.marked != undefined && actualData[i].hints.marked) {
                 // markedAssets.push(actualData[i].items[1]);
              //}
  
              //indexdata.push(actualData[i].hints.index);
              //assetArray.push([actualData[i].items[1]]);
             // data.push(actualData[i].items[2]);
              //targetData.push(actualData[i].items[3]);
          }*/
    }
    return seriesdata;
}

// 
// #endregion Resizing Code
//////////////////////////////////////////////////////////////////////////////



