
$(document).ready(function () {

    var chartObj = $("#js_chart");
    $(chartObj).wrapInner("<div class='wrapper' style='margin-top:15px'/>");
    $(".wrapper").append("<input class='Checkbox' type='checkbox' value='Sum([DrillingRigsCount])' id='checkbox0' /> <span style='color: #ffffff;'>Drilling Rigs</span><input class='Checkbox' type='checkbox' value='Sum([WorkoverRigsCount])' id='checkbox1' /> <span style='color: #ffffff;'>Workover Rigs</span><input class='Checkbox' type='checkbox' value='Sum([ActiveInjectors])' id='checkbox2' /> <span style='color: #ffffff;'>Active Injectors</span><input class='Checkbox' type='checkbox' value='Sum([ActiveProducers])' id='checkbox3' /> <span style='color: #ffffff;'>Active Producers</span>");
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
            indexVal = 1;
        }
        else {
            index = parseInt(ind[1]) + parseInt(ind[1]);
            indexVal = index + 1;
        }
        var act = actualValueArray[index] + ' as ' + actualDisplayArray[index]
        var tar = actualValueArray[indexVal] + ' as ' + actualDisplayArray[indexVal]
        // $(this).toggleClass('selected');

        //log("DocClick" + selectedCategoryActual);
        if ($(this).prop("checked") == true) {
            // $(".overlay", $(this)).show();
            //updateColor();
            log($(this).val());
            //selectedCategoryActual+="," + $(this).val();
            //log("selectedCategoryActual : " + selectedCategoryActual);
            //assignDocPropertyValue(0, $(this).val());
            setDocumentProperty("RefreshKPI", "false");
            setDocumentProperty("RefreshKPIGC", "false");
            log("checkbox -" + act);
            // runScript("DynamicProductionCategory", [{ "Key": "colName", "Value": "Sum([" + configData.FilteredCategory[0] + "])"+ ","+ "Sum([" + configData.FilteredCategory[1] + "])" }, { "Key": "isDelete", "Value": 0 }]);
            runScript("DynamicProductionCategory", [{ "Key": "actualValue", "Value": act }, { "Key": "targetValue", "Value": tar }, { "Key": "isDelete", "Value": 0 }]);
        }

        else {
            log("checkbox -" + act);
            $(".overlay", $(this)).hide();
            //updateColor();
            //assignDocPropertyValue(1, $(this).val());
            setDocumentProperty("RefreshKPI", "false");
            setDocumentProperty("RefreshKPIGC", "false");
            //runScript("DynamicProductionCategory", [{ "Key": "colName", "Value": "Sum([" + configData.FilteredCategory[0] + "])"+ ","+ "Sum([" + configData.FilteredCategory[1] + "])" }, { "Key": "isDelete", "Value": 1 }]);
            runScript("DynamicProductionCategory", [{ "Key": "actualValue", "Value": act }, { "Key": "targetValue", "Value": tar }, { "Key": "isDelete", "Value": 1 }]);
        }
    });



});
function assignDocPropertyValue(isDelete, SelectedValue) {
    var splitActual = [];
    actualVal = "";
    splitActual = selectedCategoryActual.split(',');
    for (var i = 0; i < splitActual.length; i++) {

        if (SelectedValue != splitActual[i])
            if (actualVal == '')
                actualVal = splitActual[i]
            else
                actualVal += ',' + splitActual[i]
    }
    if (isDelete == 0) {
        if (actualVal != "") {
            actualVal += ',' + SelectedValue;
        }
        else {
            actualVal = SelectedValue;
        }
    }
    log(actualVal);
    //setDocumentProperty(propertyName[0],actualVal);                                 
    /*var splitTarget=[];
    targetVal="";
    splitTarget=selectedCategoryTarget.split(',');
    for(var i=0;i<splitTarget.length;i++)
    {
                        
        if (columnsArray[3] != splitTarget[i])
            if(targetVal == '')
                targetVal = splitTarget[i]
            else
                targetVal+=','+splitTarget[i]
    }
    if(isDelete==0)
    {
        if(targetVal!="")
        {
            targetVal+=','+columnsArray[3]
        }
        else
        {
            targetVal=columnsArray[3];
        }
    }
    log(targetVal);*/
    //setDocumentProperty(propertyName[1],targetVal);   
}
var selectedCategoryActual = "";
var selectedCategoryTarget = "";
var actualValueArray = [];
var targetValue = "";
var actualDisplayArray = [];
var targetDisplay = "";
function renderCore(sfdata) {
    actualValueArray = sfdata.config.ColumnName;
    actualDisplayArray = sfdata.config.DisplayName;
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
                        var n = i / 2;
                        $("#checkbox" + n).prop('checked', true);
                    }


                }
                else {
                    if (i == 0) {
                        $("#checkbox0").prop('checked', false);
                    }
                    else {
                        var n = i / 2;
                        $("#checkbox" + n).prop('checked', false);
                    }
                }
            }
            else {
                if (i == 0) {
                    $("#checkbox0").prop('checked', false);
                }
                else {
                    var n = i / 2;
                    $("#checkbox" + n).prop('checked', false);
                }
            }
        }
    }
}


