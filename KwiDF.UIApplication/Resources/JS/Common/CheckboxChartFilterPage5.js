
$(document).ready(function () {

    var chartObj = $("#js_chart");
    $(chartObj).wrapInner("<div class='wrapper' style='margin-top:15px'/>");
    $(".wrapper").append("<input class='Checkbox' type='checkbox' value='Sum([DrillingRigsCount])' id='checkbox0' /> <span style='color: #ffffff;'>Gain by Causes</span><input class='Checkbox' type='checkbox' value='Sum([WorkoverRigsCount])' id='checkbox1' /> <span style='color: #ffffff;'>Loss by Causes</span>");
    if ($('.wrapper', chartObj).length > 0) {
        $('.wrapper span', chartObj).css({ 'color': '#fff', 'fontSize': '17px', 'marginBottom': '5px', 'fontFamily': 'Arial', 'display': 'inline-block', 'marginRight': '15px' });

    }


    var chartObj = $("#js_chart");
    chartObj.on('click', '.Checkbox', function () {


        var objId = $(this).attr('id');
        var ind = objId.split('checkbox');



        if ($(this).prop("checked") == true) {
            var yAxis = actualValueArray[ind] + ' as ' + actualDisplayArray[ind]
            if (ind[1] == 0) {
                $("#checkbox1").prop('checked', false);
                var colorAxis = colorAxisArray[0]
            }
            else {
                $("#checkbox0").prop('checked', false);
                var colorAxis = colorAxisArray[1]
            }
            //log($(this).val());

            setDocumentProperty("RefreshKPI", "false");
            setDocumentProperty("RefreshKPIGC", "false");
            //setDocumentProperty("RefreshKPIEP", "false");
            log("checkbox -" + colorAxis);

            runScript("DynamicColorByScript", [{ "Key": "colorBy", "Value": colorAxis }]);
        }
        else {

            $("#checkbox" + ind[1]).prop('checked', false);
            runScript("DynamicColorByScript", [{ "Key": "colorBy", "Value": "" }]);
        }

    });



});

var selectedCategoryActual = "";

var actualValueArray = [];
var targetValue = "";
var actualDisplayArray = [];

var colorAxisArray = []
function renderCore(sfdata) {
    actualValueArray = sfdata.config.ColumnName;
    actualDisplayArray = sfdata.config.DisplayName;
    selectedColorBy = sfdata.config.SelectedColorByAxis;
    colorAxisArray = sfdata.config.ColorBy;

    if (sfdata.config.RefreshKPI == "true") {
        for (var i = 0; i < colorAxisArray.length; i++) {
            if (selectedColorBy != "" && selectedColorBy != undefined) {
                if (selectedColorBy.indexOf(colorAxisArray[i]) > -1) {
                    $("#checkbox0").prop('checked', false);
                    $("#checkbox1").prop('checked', false);
                    $("#checkbox" + [i]).prop('checked', true);

                }

            }
            else {
                $("#checkbox0").prop('checked', false);
                $("#checkbox1").prop('checked', false);
            }

        }
    }
    else {
        $("#checkbox0").prop('checked', false);
        $("#checkbox1").prop('checked', false);
    }

}





