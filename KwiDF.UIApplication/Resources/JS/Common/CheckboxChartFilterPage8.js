
$(document).ready(function () {

    var chartObj = $("#js_chart");
    $(chartObj).wrapInner("<div class='wrapper' style='margin-top:15px'/>");
    $(".wrapper").append("<input class='Checkbox' type='checkbox' value='Sum([DrillingRigsCount])' id='checkbox0' /> <span style='color: #ffffff;'>THP Variance</span><input class='Checkbox' type='checkbox' value='Sum([WorkoverRigsCount])' id='checkbox1' /> <span style='color: #ffffff;'>FLP Variance</span>");
    if ($('.wrapper', chartObj).length > 0) {
        $('.wrapper span', chartObj).css({ 'color': '#fff', 'fontSize': '17px', 'marginBottom': '5px', 'fontFamily': 'Arial', 'display': 'inline-block', 'marginRight': '15px' });

    }


    var chartObj = $("#js_chart");
    chartObj.on('click', '.Checkbox', function () {

        //log("Clicked");
        var objId = $(this).attr('id');
        var ind = objId.split('checkbox');
        if (parseInt(ind[1]) == 0) {
            index = 0;

        }
        else {
            index = 1;
        }
        log("Document Ready ActualValueArray - " + actualValueArray.length);
        log("Document Ready ActualDisplayArray - " + actualDisplayArray.length);
        var act = actualValueArray[index] + ' as ' + actualDisplayArray[index]


        if ($(this).prop("checked") == true) {

            log($(this).val());

            log("checkbox -" + act);
            setDocumentProperty("RefreshKPIEWI", "false");


            runScript("DynamicProductionCategory", [{ "Key": "actualValue", "Value": act }, { "Key": "targetValue", "Value": "" }, { "Key": "isDelete", "Value": 0 }]);
        }

        else {
            log("checkbox -" + act);
            $(".overlay", $(this)).hide();

            setDocumentProperty("RefreshKPIEWI", "false");

            runScript("DynamicProductionCategory", [{ "Key": "actualValue", "Value": act }, { "Key": "targetValue", "Value": "" }, { "Key": "isDelete", "Value": 1 }]);
        }
    });



});

var selectedCategoryActual = "";
var selectedCategoryTarget = "";
var actualValueArray = [];
var targetValue = "";
var actualDisplayArray = [];
var targetDisplay = "";
function renderCore(sfdata) {
    actualValueArray = sfdata.config.ColumnName;
    actualDisplayArray = sfdata.config.DisplayName;
    //log("Render core ActualValueArray - "+actualValueArray.length);
    //log("Render core ActualDisplayArray - "+actualDisplayArray.length);
    selectedCategoryActual = sfdata.config.CategoryConditionActual;
    selectedCategoryTarget = sfdata.config.CategoryConditionTarget;
    if (sfdata.config.RefreshKPI == "true") {
        for (var i = 0; i < actualValueArray.length - 1; i++) {
            if (selectedCategoryActual != "" && selectedCategoryActual != undefined) {
                if (selectedCategoryActual.indexOf(actualValueArray[i]) > -1) {
                    if (i == 0) {
                        $("#checkbox0").prop('checked', true);
                    }
                    else {

                        $("#checkbox1").prop('checked', true);
                    }


                }
                else {
                    if (i == 0) {
                        $("#checkbox0").prop('checked', false);
                    }
                    else {

                        $("#checkbox1").prop('checked', false);
                    }
                }
            }
            else {
                if (i == 0) {
                    $("#checkbox0").prop('checked', false);
                }
                else {

                    $("#checkbox1").prop('checked', false);
                }
            }
        }
    }
}


