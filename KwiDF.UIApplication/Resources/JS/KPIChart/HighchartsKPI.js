﻿$(document).ready(function () {
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
            setDocumentProperty("RefreshKPIWF", "false");
            setDocumentProperty("RefreshKPIWHP", "false");
            setDocumentProperty("RefreshKPIEWI", "false");
            setDocumentProperty("RefreshKPIEWA", "false");
            var actual = actualVal + ' as ' + actualDisplay;
            if (showTarget == "true") {
                var target = targetVal + ' as ' + targetDisplay;
                runScript("DynamicProductionCategory", [{ "Key": "actualValue", "Value": actual }, { "Key": "targetValue", "Value": target }, { "Key": "isDelete", "Value": 0 }]);
            }
            else {
                runScript("DynamicProductionCategory", [{ "Key": "actualValue", "Value": actual }, { "Key": "targetValue", "Value": "" }, { "Key": "isDelete", "Value": 0 }]);
            }
            if (isWellActivities == "true") {
                log("Marking");
                runScript("MapMarkingFromKPI", [{ "Key": "layerName", "Value": labelText }, { "Key": "isDelete", "Value": 0 }, { "Key": "isReset", "Value": 1 }]);
            }
            if (isWellEvents == "true") {
                log("Marking");
                setDocumentProperty("CategoryConditionEWEActual", selectedCategoryActual + " - " + labelText);
                runScript("MapMarkingFromKPI", [{ "Key": "layerName", "Value": labelText }, { "Key": "isDelete", "Value": 0 }, { "Key": "isReset", "Value": 1 }]);
            }

        } else {
            $(".overlay", $(this)).hide();
            updateColor();

            setDocumentProperty("RefreshKPI", "false");
            setDocumentProperty("RefreshKPIGC", "false");
            setDocumentProperty("RefreshKPIEP", "false");
            setDocumentProperty("RefreshKPIWF", "false");
            setDocumentProperty("RefreshKPIWHP", "false");
            setDocumentProperty("RefreshKPIEWI", "false");
            setDocumentProperty("RefreshKPIEWA", "false");
            var actual = actualVal + ' as ' + actualDisplay;
            if (showTarget == "true") {
                var target = targetVal + ' as ' + targetDisplay;
                runScript("DynamicProductionCategory", [{ "Key": "actualValue", "Value": actual }, { "Key": "targetValue", "Value": target }, { "Key": "isDelete", "Value": 1 }]);
            }
            else {

                runScript("DynamicProductionCategory", [{ "Key": "actualValue", "Value": actual }, { "Key": "targetValue", "Value": "" }, { "Key": "isDelete", "Value": 1 }]);
            }
            if (isWellActivities == "true") {
                runScript("MapMarkingFromKPI", [{ "Key": "layerName", "Value": labelText }, { "Key": "isDelete", "Value": 1 }, { "Key": "isReset", "Value": 1 }]);
            }
            if (isWellEvents == "true") {
                log("Marking");

                setDocumentProperty("CategoryConditionEWEActual", selectedCategoryActual + " - " + labelText);
                runScript("MapMarkingFromKPI", [{ "Key": "layerName", "Value": labelText }, { "Key": "isDelete", "Value": 1 }, { "Key": "isReset", "Value": 1 }]);
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
var dataLabel;
var hpLoading = "";
var DWPConfig = "";
var gainLossIndicator = "";
var lossParameters = "";
var targetLabelText = "";
var ALRunLife = "";
var isWellActivities = "";
var labelText = "";
var targetSeries = [];
var isMultiSeries = "";
var isShowActualValue = "";
var isWellEvents = "";
var actualVolumeValue = "";
var changeVolumeValue = "";
var targetVolumeValue = "";
var actualVolumeData = 0;
var targetVolumeData = 0;
var changeVolumeData = 0;
var uomText = "";
var gaugeLabel = "";
function renderCore(sfdata) {

    //var UrlCSS = "http://localhost/KwiDF/Resources/CSS/font-awesome.css"; //replace with sfdata.config
    var UrlCSS = sfdata.config.UrlCSS;
    //var UrlCSS = getDocumentProperty("UrlCSS");
    $("head").append("<link>");
    var css = $("head").children(":last");
    css.attr({
        rel: "stylesheet",
        type: "text/css",
        href: UrlCSS
    });

    var DateValue = new Date(sfdata.config.DateFilter.replace('-', " "));
    var DateValueFormatted = DateValue.valueOf();
    var nextDate = DateValue;
    var numberOfDaysToAdd = 1;
    nextDate.setDate(nextDate.getDate() + numberOfDaysToAdd);
    var nextDateValueFormatted = nextDate.valueOf();
    showTarget = sfdata.config.ShowTarget;
    showChange = sfdata.config.ShowChange;
    labelText = sfdata.config.lableText;
    uomText = sfdata.config.UOMText;
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
    if (sfdata.config.hasOwnProperty("HPLoading")) {
        hpLoading = sfdata.config.HPLoading;
    }
    if (sfdata.config.hasOwnProperty("IsDWP")) {
        DWPConfig = sfdata.config.IsDWP;
    }
    if (sfdata.config.hasOwnProperty("GainLossIndicator")) {
        gainLossIndicator = sfdata.config.GainLossIndicator;
    }
    if (sfdata.config.hasOwnProperty("LossParameters")) {
        lossParameters = sfdata.config.LossParameters;
    }
    if (sfdata.config.hasOwnProperty("TargetLableText")) {
        targetLabelText = sfdata.config.TargetLableText;
    }
    if (sfdata.config.hasOwnProperty("ALRunLife")) {
        ALRunLife = sfdata.config.ALRunLife;
    }
    if (sfdata.config.hasOwnProperty("IsWellActivities")) {
        isWellActivities = sfdata.config.IsWellActivities;
    }
    if (sfdata.config.hasOwnProperty("IsMultiSeries")) {
        isMultiSeries = sfdata.config.IsMultiSeries;
    }
    if (sfdata.config.hasOwnProperty("IsShowActualValue")) {
        isShowActualValue = sfdata.config.IsShowActualValue;
    }
    if (sfdata.config.hasOwnProperty("IsWellEvents")) {
        isWellEvents = sfdata.config.IsWellEvents;
    }
    if (sfdata.config.RefreshKPI == "true") {
        dateRange = sfdata.config.DateRange;

        var date2 = new Date(sfdata.config.DateFilter.replace('-', " "));
        date2.setDate(date2.getDate() - dateRange);

        var actualData = sfdata.data;
        actualData = actualData.filter(function (el) {
            DateValue = new Date(sfdata.config.DateFilter.replace('-', " "));
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
            targetSeries = [];
            if (selectionType == undefined || selectionType == "")
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
                name: sfdata.config.lableText,
                data: data,
                color: colorCode,
                type: "line"
            };
            processed_json.push(series);

            if (isMultiSeries == "true") {
                for (i = 0; i < actualData.length; i++) {
                    targetSeries.push([parseInt(actualData[i].items[0].replace("/Date(", "").replace(")/", "")), actualData[i].items[3]]);
                }
                series = {
                    name: "Target",
                    data: targetSeries,
                    color: "#ffff00",
                    type: "line"
                }
                processed_json.push(series);
            }


            var lastData = 0;
            if (data.length > 0) {
                var len = data.length - 1;
                var currentdate = data[len][0];
                if (data[len][0] == DateValue.valueOf()) {

                    lastData = data[len][1] != 0 && data[len][1] != "" ? Math.round(data[len][1]) : 0;
                    lastTopData = lastData;
                    topValue = numberWithCommas(lastData);
                    gaugeLabel = topValue;

                    if (targetData.length > 0) {
                        var len = targetData.length - 1;
                        lastTargetData = targetData[len][1] != 0 && targetData[len][1] != "" ? Math.round(targetData[len][1]) : 0;
                        targetValue = numberWithCommas(lastTargetData);
                    }
                    if (sfdata.config.ShowChange == "true") {
                        if (changeData.length > 0) {
                            var len = changeData.length - 1;
                            var bottomData = changeData[len] != 0 && changeData[len] != "" ? Math.round(changeData[len]) : 0;
                            //log(changeData.length);
                            //log(changeData[len]);
                            bottomValue = numberWithCommas(bottomData);
                        }
                    }
                    var minactual = actualData.length > 0 ? actualData[0].items[2] : 0;
                    var minTarget = actualData.length > 0 ? actualData[0].items[3] : 0;

                    if (hpLoading == "true") {
                        $.each(actualData, function (i, v) {
                            thisVal = v.items[2];
                            minactual = (minactual > thisVal) ? thisVal : minactual;
                        })
                        $.each(actualData, function (i, v) {
                            thisVal = v.items[3];
                            minTarget = (minTarget > thisVal) ? thisVal : minTarget;
                        })
                    }
                    var min = 0;
                    if (hpLoading == "true") {
                        min = minTarget < minactual ? minTarget : minactual;

                    }
                    else {
                        min = 0;
                    }

                    if (lastTopData > lastTargetData) {

                        if (lastTargetData < 0) {
                            minValue = lastTargetData + ((20 / 100) * lastTargetData);
                        }
                        else {
                            minValue = min;
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

                            minValue = min;

                        }


                        if (lastTargetData < 0)
                            maxValue = lastTargetData - ((20 / 100) * lastTargetData);
                        else
                            maxValue = lastTargetData + ((20 / 100) * lastTargetData);

                    }
                }
                else {
                    topValue = "No Data";
                    bottomValue = "";
                    targetValue = 0;
                    lastTargetData = 0;
                    lastTopData = 0;
                }


            }
            else {
                topValue = "No Data";
                bottomValue = "";
                targetValue = 0;
                lastTargetData = 0;
                lastTopData = 0;
            }
            //Showing Volume with Percentage
            var actualVolume = [];
            var targetVolume = [];
            var changeVolume = [];
            if (isShowActualValue == "true") {
                for (i = 0; i < actualData.length; i++) {
                    actualVolume.push([parseInt(actualData[i].items[0].replace("/Date(", "").replace(")/", "")), actualData[i].items[5]]);
                    targetVolume.push([parseInt(actualData[i].items[0]), actualData[i].items[6]]);
                    if (sfdata.config.ShowChange == "true") {
                        changeVolume.push(actualData[i].items[7]);
                    }

                }
                var lastActual = 0;
                if (actualVolume.length > 0) {
                    var len = actualVolume.length - 1;
                    if (actualVolume[len][0] == DateValue.valueOf()) {

                        lastActual = actualVolume[len][1] != 0 && actualVolume[len][1] != "" ? Math.round(actualVolume[len][1]) : 0;
                        actualVolumeData = lastActual;
                        actualVolumeValue = numberWithCommas(lastActual);
                        if (targetVolume.length > 0) {
                            var len = targetVolume.length - 1;
                            targetVolumeData = targetVolume[len][1] != 0 && targetVolume[len][1] != "" ? Math.round(targetVolume[len][1]) : 0;
                            targetVolumeValue = numberWithCommas(targetVolumeData);
                        }
                        if (sfdata.config.ShowChange == "true") {
                            if (changeVolume.length > 0) {
                                var len = changeVolume.length - 1;
                                changeVolumeData = changeVolume[len] != 0 && changeVolume[len] != "" ? Math.round(changeVolume[len]) : 0;
                                changeVolumeValue = numberWithCommas(changeVolumeData);
                            }
                        }
                        topValue = topValue + "% (" + actualVolumeValue;
                        targetValue = targetValue + "%(" + targetVolumeValue + ")";
                        bottomValue = bottomValue + "%(" + changeVolumeValue + ")";

                    }
                    else {
                        actualVolumeValue = "No Data";
                        changeVolumeValue = "";
                        targetVolumeValue = "";
                        actualVolumeData = 0;
                        targetVolumeData = 0;
                        changeVolumeData = 0;
                    }
                }
                else {
                    actualVolumeValue = "No Data";
                    changeVolumeValue = "";
                    targetVolumeValue = "";
                    actualVolumeData = 0;
                    targetVolumeData = 0;
                    changeVolumeData = 0;
                }

            }
            var chartObj = $("#js_chart");

            if ($('.wrapper', chartObj).length == 0) {

                $(chartObj).wrapInner("<div class='wrapper'/>");
                var drawChart = $('.wrapper', chartObj);
                $(drawChart).addClass("smallSection");


                $(drawChart).append("<header/>");
                $(drawChart).append("<section class='chartHolder' id='chartHolder'/>");
                $(drawChart).append("<section class='gaugeHolder' id='gaugeHolder'/>");


                $("header", drawChart).append("<h2>" + sfdata.config.lableText + " <span></span></h2>").append("<p>" + topValue + "</p>");
                $("header ", drawChart).append("<span class='uom'>" + uomText + "<span>" + ")" + "</span></span>");
                if (isShowActualValue == "true") {
                    $(".uom ", drawChart).after("<span class='close-br'>" + " )" + "</span>");
                }
                $("header", drawChart).append("<div class='target-holder'/>");
                $("header .target-holder", drawChart).append("<div>" + targetLabelText + "</div><div>" + targetValue + "</div>");

                $(drawChart).append("<footer id='footer'/>");
                if (sfdata.config.ShowChange == "true") {
                    $("footer", drawChart).append("<span class='up'>" + bottomValue + "</span>");
                }
                //    dataLabel = '<span class="dataLabels" id="lableVal">testing' + topValue + '</span>';
                //$("#footer").after(dataLabel);

                $("footer", drawChart).append("<div class='icon-holder'/>");
                $("footer .icon-holder", drawChart).append('<button onclick="clickMaximize()" id="btnMaximize" style="display:none;"><i class="fa fa-window-maximize" aria-hidden="true"></i></button>');
                $("footer .icon-holder", drawChart).append('<button onclick="clickMinimize()" id="btnMinimize" style="display:none;"><i class="fa fa-expand" aria-hidden="true"></i></button>');

                $("footer .icon-holder", drawChart).append('<button onclick="clickedGuage()"  class="active" id="guage"><i class="fa fa-tachometer" aria-hidden="true"></i></button>');
                $("footer .icon-holder", drawChart).append('<button onclick="clickedLine()"  id="line"><i class="fa fa-line-chart" aria-hidden="true"></i></button>');
                $("footer .icon-holder", drawChart).append('<button onclick="clickedChart()" id="bar"><i class="fa fa-bar-chart" aria-hidden="true"></i></button>');

                //$("footer .icon-holder",drawChart).append('<button onclick="clickedCurrency()"  id="currency"><i class="fa fa-arrows-h" aria-hidden="true"></i></button>');
                drawChart.append("<div class='overlay'/>");

            }
            $(".gaugeHolder").attr("data-top", gaugeLabel);
            $("header p").html(topValue);
            $("header .uom").html(uomText);
            //$("header .uom").after("<span>" + " )"  + "</span>");
            $("#lableVal").html(topValue);
            if (sfdata.config.ShowChange == "true") {
                $("footer span").html(bottomValue);
            }
            $("header .target-holder").html("<div>" + targetLabelText + "</div><div>" + targetValue + "</div>");

            if (lastTopData > lastTargetData) {
                if (DWPConfig != "") {
                    $(".smallSection header").removeClass('green');
                    $(".smallSection header").removeClass('yellow');
                    $(".smallSection header").addClass('red');
                }
                else {
                    $(".smallSection header").addClass('green');
                    $(".smallSection header").removeClass('yellow');
                    $(".smallSection header").removeClass('red');
                }


            }
            else if (lastTopData < lastTargetData) {
                if (DWPConfig != "") {
                    $(".smallSection header").removeClass('red');
                    $(".smallSection header").removeClass('yellow');
                    $(".smallSection header").addClass('green');
                }
                else {
                    $(".smallSection header").addClass('red');
                    $(".smallSection header").removeClass('yellow');
                    $(".smallSection header").removeClass('green');
                }

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
            if (selectionType == undefined || selectionType == "")
                selectionType = sfdata.config.ChartType;
            colorCode = sfdata.config.ColorCode;

            for (i = 0; i < actualData.length; i++) {

                data.push([parseInt(actualData[i].items[0].replace("/Date(", "").replace(")/", "")), actualData[i].items[2]]);
                targetData.push([parseInt(actualData[i].items[0]), actualData[i].items[3]]);

                if (sfdata.config.ShowChange == "true") {
                    changeData.push(actualData[i].items[3]);
                }
                if (targetData.length > 0) {
                    var len = targetData.length - 1;
                    lastTargetData = targetData[len][1] != 0 && targetData[len][1] != "" ? Math.round(targetData[len][1]) : 0;
                    targetValue = numberWithCommas(lastTargetData);
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
                if (data[len][0] == DateValue.valueOf()) {

                    lastData = data[len][1] != 0 && data[len][1] != "" ? Math.round(data[len][1]) : 0;
                    lastTopData = lastData;
                    topValue = numberWithCommas(lastData);
                    gaugeLabel = topValue;


                    if (sfdata.config.ShowChange == "true") {
                        if (changeData.length > 0) {
                            var len = changeData.length - 1;
                            var bottomData = changeData[len] != 0 && changeData[len] != "" ? Math.round(changeData[len]) : 0;
                            bottomValue = numberWithCommas(bottomData);
                        }
                    }
                    var minactual = actualData.length > 0 ? actualData[0].items[2] : 0;
                    if (hpLoading == "true") {
                        $.each(actualData, function (i, v) {
                            thisVal = v.items[2];
                            minactual = (minactual > thisVal) ? thisVal : minactual;
                        })
                    }

                    if (lastTopData < 0) {
                        minValue = lastTopData + ((20 / 100) * lastTopData);
                    }
                    else {
                        if (hpLoading == "true") {
                            minValue = minactual;
                        }
                        else {
                            minValue = 0;
                        }
                    }

                    if (lastTopData < 0)
                        maxValue = lastTopData - ((20 / 100) * lastTopData);
                    else
                        maxValue = lastTopData + ((20 / 100) * lastTopData);

                }
                else {
                    topValue = "No Data";
                    bottomValue = "";
                    targetValue = 0;
                    lastTargetData = 0;
                    lastTopData = 0;
                }

            }
            else {
                topValue = "No Data";
                bottomValue = "";
                targetValue = 0;
                lastTargetData = 0;
                lastTopData = 0;
            }
            //Showing Volume with Percentage
            var actualVolume = [];
            var targetVolume = [];
            var changeVolume = [];
            if (isShowActualValue == "true") {
                for (i = 0; i < actualData.length; i++) {
                    actualVolume.push([parseInt(actualData[i].items[0].replace("/Date(", "").replace(")/", "")), actualData[i].items[5]]);
                    //targetVolume.push([parseInt(actualData[i].items[0]), actualData[i].items[6]]);
                    if (sfdata.config.ShowChange == "true") {
                        changeVolume.push(actualData[i].items[6]);
                    }

                }
                var lastActual = 0;
                if (actualVolume.length > 0) {
                    var len = actualVolume.length - 1;
                    if (actualVolume[len][0] == DateValue.valueOf()) {

                        lastActual = actualVolume[len][1] != 0 && actualVolume[len][1] != "" ? Math.round(actualVolume[len][1]) : 0;
                        actualVolumeData = lastActual;
                        actualVolumeValue = numberWithCommas(lastActual);
                        /*if (targetVolume.length > 0) {
							var len = targetVolume.length - 1;
							targetVolumeData = targetVolume[len][1] != 0 && targetVolume[len][1] != "" ? Math.round(targetVolume[len][1]) : 0;
							targetVolumeValue = numberWithCommas(targetVolumeData);
						}*/
                        if (sfdata.config.ShowChange == "true") {
                            if (changeVolume.length > 0) {
                                var len = changeVolume.length - 1;
                                changeVolumeData = changeVolume[len] != 0 && changeVolume[len] != "" ? Math.round(changeVolume[len]) : 0;
                                changeVolumeValue = numberWithCommas(changeVolumeData);
                            }
                        }
                        topValue = topValue + "% (" + actualVolumeValue;
                        //targetValue=targetValue+"%("+targetVolumeValue+")";
                        bottomValue = bottomValue + "%(" + changeVolumeValue + ")";

                    }
                    else {
                        actualVolumeValue = "No Data";
                        changeVolumeValue = "";
                        targetVolumeValue = "";
                        actualVolumeData = 0;
                        targetVolumeData = 0;
                        changeVolumeData = 0;
                    }
                }
                else {
                    actualVolumeValue = "No Data";
                    changeVolumeValue = "";
                    targetVolumeValue = "";
                    actualVolumeData = 0;
                    targetVolumeData = 0;
                    changeVolumeData = 0;
                }

            }
            var chartObj = $("#js_chart");

            if ($('.wrapper', chartObj).length == 0) {

                $(chartObj).wrapInner("<div class='wrapper'/>");
                var drawChart = $('.wrapper', chartObj);
                $(drawChart).addClass("smallSection");


                $(drawChart).append("<header/>");
                $(drawChart).append("<section class='chartHolder' id='chartHolder'/>");
                $(drawChart).append("<section class='gaugeHolder' id='gaugeHolder'/>");


                $("header", drawChart).append("<h2>" + sfdata.config.lableText + " <span></span></h2>").append("<p>" + topValue + "</p>");
                $("header ", drawChart).append("<span class='uom'>" + uomText + "<span>" + ")" + "</span></span>");
                if (isShowActualValue == "true") {
                    $(".uom ", drawChart).after("<span class='close-br'>" + " )" + "</span>");
                }
                if (ALRunLife == "true") {
                    $("header", drawChart).append("<div class='target-holder'/>");
                    $("header .target-holder", drawChart).append("<div>" + sfdata.config.TargetLableText + "</div><div>" + targetValue + "</div>");

                }


                $(drawChart).append("<footer/>");
                if (sfdata.config.ShowChange == "true") {
                    $("footer", drawChart).append("<span class='up'>" + bottomValue + "</span>");
                }
                //  var dataLabel = '<span class="dataLabels" id="lableVal">' + topValue + '</span>';
                //   $("#footer").after(dataLabel);

                $("footer", drawChart).append("<div class='icon-holder'/>");

                $("footer .icon-holder", drawChart).append('<button onclick="clickMaximize()" id="btnMaximize" style="display:none;"><i class="fa fa-window-maximize" aria-hidden="true"></i></button>');
                $("footer .icon-holder", drawChart).append('<button onclick="clickMinimize()" id="btnMinimize" style="display:none;"><i class="fa fa-expand" aria-hidden="true"></i></button>');

                $("footer .icon-holder", drawChart).append('<button onclick="clickedGuage()"  class="active" id="guage"><i class="fa fa-tachometer" aria-hidden="true"></i></button>');
                $("footer .icon-holder", drawChart).append('<button onclick="clickedLine()"  id="line"><i class="fa fa-line-chart" aria-hidden="true"></i></button>');
                $("footer .icon-holder", drawChart).append('<button onclick="clickedChart()" id="bar"><i class="fa fa-bar-chart" aria-hidden="true"></i></button>');
                drawChart.append("<div class='overlay'/>");

            }
            $(".gaugeHolder").attr("data-top", gaugeLabel);
            $("header p").html(topValue);
            $("header .uom").html(uomText);
            $("#lableVal").html(topValue);
            if (sfdata.config.ShowChange == "true") {
                $("footer span").html(bottomValue);
            }
            if (gainLossIndicator == "true") {
                if (lastTopData == 0) {
                    $(".smallSection header").removeClass('red');
                    $(".smallSection header").removeClass('green');
                    $(".smallSection header").addClass('gray');
                }
                else if (lastTopData < 0) {
                    $(".smallSection header").addClass('red');
                    $(".smallSection header").removeClass('green');
                    $(".smallSection header").removeClass('gray');
                }
                else {
                    $(".smallSection header").removeClass('red');
                    $(".smallSection header").addClass('green');
                    $(".smallSection header").removeClass('gray');
                }
            }
            else {
                $(".smallSection header").addClass('gray');
            }



        }
        if (sfdata.config.ShowChange == "true") {
            if (bottomData < 0) {
                if (DWPConfig != "") {
                    $(".smallSection span").addClass("lossdown");
                    $(".smallSection span").removeClass("lossup");
                    $(".smallSection span").removeClass("up");
                    $(".smallSection span").removeClass("neutral");
                    $(".smallSection header").addClass('red');
                    $(".smallSection span").removeClass("down");
                }
                else {
                    if (lossParameters == "true") {
                        $(".smallSection span").addClass("lossdown");
                        $(".smallSection span").removeClass("lossup");
                        $(".smallSection span").removeClass("up");
                        $(".smallSection span").removeClass("neutral");
                        $(".smallSection header").addClass('red');
                        $(".smallSection span").removeClass("down");
                    }
                    else {
                        $(".smallSection span").addClass("down");
                        $(".smallSection span").removeClass("up");
                        $(".smallSection span").removeClass("neutral");
                        $(".smallSection header").addClass('red');
                    }
                }

            }
            else if (bottomData == 0) {
                $(".smallSection span").addClass("neutral");
                $(".smallSection span").removeClass("up");
                $(".smallSection span").removeClass("down");

            }
            else {
                if (DWPConfig != "") {
                    //log("condition matching");
                    $(".smallSection span").addClass("lossup");
                    $(".smallSection span").removeClass("lossdown");
                    $(".smallSection span").removeClass("down");
                    $(".smallSection span").removeClass("up");
                    $(".smallSection span").removeClass("neutral");
                }
                else {
                    if (lossParameters == "true") {
                        $(".smallSection span").addClass("lossup");
                        $(".smallSection span").removeClass("lossdown");
                        $(".smallSection span").removeClass("down");
                        $(".smallSection span").removeClass("up");
                        $(".smallSection span").removeClass("neutral");
                    }
                    else {
                        $(".smallSection span").removeClass("down");
                        $(".smallSection span").addClass("up");
                        $(".smallSection span").removeClass("neutral");
                    }
                }


            }

        }

        Highcharts.setOptions({

            lang: {
                decimalPoint: '.',
                thousandsSep: ','
            }
        });

        var options = {
            chart: {
                renderTo: 'chartHolder',
                spacingBottom: 2,
                spacingTop: 5,
                spacingLeft: 5,
                spacingRight: 5
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
                allowDecimals: false,
                lineWidth: 1,
                opposite: true,
                lineColor: '#fff',
                labels: {
                    enabled: true,
                    align: 'left',
                    x: 5,
                    style: {
                        color: '#fff'
                    },
                    formatter: function () {
                        //return Highcharts.numberFormat(this.value, 0)
                        if (this.value < 10000 && this.value > -10000) {
                            return Highcharts.numberFormat(this.value, 0);
                        }
                        else {
                            return this.axis.defaultLabelFormatter.call(this);
                        }

                    }
                },

                gridLineDashStyle: 'Dash',
                className: 'highcharts-color-0',

                title: {
                    enabled: false,
                    text: ''
                }

            }, ],


            /*  tooltip: {
                  formatter: function () {
                      var d1 = new Date(this.x);
                      var calendarNextDay = ("00" + (d1.getDate()).toString()).slice(-2) + "-" + ("00" + (d1.getMonth() + 1).toString()).slice(-2) + "-" + d1.getFullYear();
                      return 'Date:' + calendarNextDay + '<br/>' + sfdata.config.lableText + ':'
                       + Highcharts.numberFormat(this.y, 0); //Math.round(this.y) 
                  }
              },*/
            tooltip: {
                formatter: function () {
                    var s = [];

                    $.each(this.points, function (i, point) {
                        if (i == 0) {
                            var d1 = new Date(point.x);
                            var calendarNextDay = ("00" + (d1.getDate()).toString()).slice(-2) + "-" + ("00" + (d1.getMonth() + 1).toString()).slice(-2) + "-" + d1.getFullYear();
                            s.push('<span>' + 'Date:' + calendarNextDay + '<br/>' + point.series.name + ' : ' +
								Highcharts.numberFormat(point.y, 0) + '<span>');
                        }
                        else {
                            s.push('<span>' + point.series.name + ' : ' +
								Highcharts.numberFormat(point.y, 0) + '<span>');
                        }
                    });

                    return s.join(' <br/> ');
                },
                shared: true
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

        if (isWellEvents == "true") {
            if (selectedCategoryActual != "" && selectedCategoryActual != undefined) {
                if (selectedCategoryActual.indexOf(labelText) > -1) {
                    kpiactive = true;

                }
                else {
                    kpiactive = false;
                }
            }
            else {
                kpiactive = false;
            }
        }
        else {
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
        $(".dataLabels").css("display", "none")
    }
    else if (selectionType == "Line") {
        clickedLine();
        $(".dataLabels").css("display", "none")
    }
    else {
        clickedGuage();
        $(".dataLabels").css("display", "block")
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
        if (isMultiSeries == "true") {
            chart.series[1].options.color = "#ffff00";
            chart.series[1].update(chartValue.series[1].options);
        }
    }

}


function createCustomGauge() {

    gaugeTitle = "";
    var startColor = "";
    var stopColor = "";
    var borderColor = "";
    if (DWPConfig != "") {
        plotBandStartColor = "#429e2f";
        plotBandEndColor = "#ff5050";
    }
    else {
        plotBandStartColor = "#ff5050";
        plotBandEndColor = "#429e2f";
    }

    //MidColor
    if (showTarget == "true") {
        if (lastTopData > lastTargetData) {
            startColor = "#a5a5a5";
            stopColor = "#000";
            borderColor = "#434242";

        }
        else if (lastTopData < lastTargetData) {
            startColor = "#a5a5a5";
            stopColor = "#000";
            borderColor = "#434242";

        }
        else {
            startColor = "#a5a5a5";
            stopColor = "#000";
            borderColor = "#434242";

        }
    }
    else {

        startColor = "#a5a5a5";
        stopColor = "#000";
        borderColor = "#434242";

        if (showTarget == "false") {
            lastTargetData = lastTopData;
            if (lastTopData > 0) {
                plotBandStartColor = "#429e2f";
                plotBandEndColor = "#429e2f";
            }
            else if (lastTopData < 0) {
                plotBandStartColor = "#ff5050";
                plotBandEndColor = "#ff5050";
            }
        }

    }
    if (minValue == 0 && maxValue == 0) {
        minValue = 0;
        maxValue = 100;
        lastTargetData = 0;
    }
    // log("=================================");
    // log("actualValue " + lastTopData);
    // log("targetValue " + lastTargetData);
    // log("minValue " + minValue);
    // log("maxValue " + maxValue);
    // log("=================================");
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
            center: ['50%', '93%'],
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
			    outerRadius: '102%',
			    innerRadius: '10%',
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
                enabled: false,
                distance: 5,
                rotation: 50,
                style: {
                    color: '#fff',

                    fontSize: '11px',
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
                    //var kmh = topValue;

                },

                y: 12,
                zIndex: 10,

            },
            tooltip: {
                valueSuffix: showTarget == "true" ? '<br></br>Target: <b>' + Highcharts.numberFormat(lastTargetData, 0) + '</b>' : '',
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
    $(".dataLabels").css("display", "block")
    $("#guage").addClass("active");

    selection = "gaugeHolder";
    selectionType = "";
}
function clickMaximize() {
    $("#btnMinimize").css("display", "block")
    $("#btnMaximize").css("display", "none")
    runScript("Maximize Visualization", [{ "Key": "title", "Value": "Calculated Production" }]);
}
function clickMinimize() {
    $("#btnMinimize").css("display", "none")
    $("#btnMaximize").css("display", "block")
    runScript("Minimize Visualization", [{ "Key": "title", "Value": "Calculated Production" }]);
}
function clickedLine() {
    $('.chartHolder').removeClass("pushBack");
    $('.gaugeHolder').addClass("pushBack");
    $(".dataLabels").css("display", "none")
    var chart = $('.chartHolder').highcharts();
    chart.inverted = false;
    chart.xAxis[0].update({}, false);
    chart.yAxis[0].update({}, false);
    chart.series[0].update({
        type: 'line'
    });
    if (isMultiSeries == "true") {
        chart.series[1].update({
            type: 'line'
        });
    }
    $(".icon-holder button").removeClass("active");
    $("#line").addClass("active");
    selection = "chartHolder";
    selectionType = "Line";
}

function clickedChart() {
    $('.chartHolder').removeClass("pushBack");
    $('.gaugeHolder').addClass("pushBack");
    $(".dataLabels").css("display", "none")
    var chart = $('.chartHolder').highcharts();
    chart.inverted = false;
    chart.xAxis[0].update({}, false);
    chart.yAxis[0].update({}, false);
    chart.series[0].update({
        type: 'column'
    });
    if (isMultiSeries == "true") {
        chart.series[1].update({
            type: 'column'
        });
    }

    $(".icon-holder button").removeClass("active");
    $("#bar").addClass("active");
    selection = "chartHolder";
    selectionType = "Bar";
}

function checkNoData() {
    if (chartValue.series[0].data.length > 0) {
        //alert("data available")
        chartValue.yAxis[0].update({ lineWidth: 1, })
        /*if(isMultiSeries=="true")
		{
			chartValue.yAxis[1].update({ lineWidth: 1, })
		}*/
    }
    else {
        chartValue.yAxis[0].update({ lineWidth: 0, })
        /*if(isMultiSeries=="true")
		{
			chartValue.yAxis[1].update({ lineWidth: 0, })
		}*/
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
// JavaScript source code
