
$(document).ready(function () {

    var chartObj = $("#js_chart");
    $(chartObj).wrapInner("<div class='wrapper' style='margin-top:15px'/>");
    $(".wrapper").append("<p><input class='Checkbox' type='checkbox' value='Sum([DownTimeHours])' /> <span style='color: #ffffff;'>DownTime(Hrs)&nbsp;&nbsp;</span>&nbsp;<input class='Checkbox' type='checkbox' value='Sum([OilProductionGainLoss])' /> <span style='color: #ffffff;'>Losses(stb/day)</span>&nbsp;<input class='Checkbox' type='checkbox' value='Sum([LiquidHandleCapacity])' /> <span style='color: #ffffff;'>Liquid handling capacity(stb/day)</span><input class='Checkbox' type='checkbox' value='Sum([DCP])' /> <span style='color: #ffffff;'>DCP</span><input class='Checkbox' type='checkbox' value='Sum([DWP])' /> <span style='color: #ffffff;'>DWP</span><input class='Checkbox' type='checkbox' value='Sum([WaterHandleCapacity])' /> <span style='color: #ffffff;'>Water Handling Capacity</span></p>");    
if ($('.wrapper', chartObj).length >0) {
               $('.wrapper span',chartObj).css({'color':'#fff','fontSize':'17px','marginBottom':'5px', 'fontFamily':'Arial'});
}

    var chartObj = $("#js_chart");
    chartObj.on('click', '.Checkbox', function () {

        //log("Clicked");

        $(this).toggleClass('selected');

        //log("DocClick" + selectedCategoryActual);
        if ($(this).hasClass('selected')) {
            // $(".overlay", $(this)).show();
            //updateColor();
            log($(this).val());
            //selectedCategoryActual+="," + $(this).val();
            //log("selectedCategoryActual : " + selectedCategoryActual);
            assignDocPropertyValue(0, $(this).val());
            setDocumentProperty("RefreshKPI", "false");
			log("ifactualVal"+ actualVal +  "selectedCategoryTarget" + selectedCategoryTarget);
            // runScript("DynamicProductionCategory", [{ "Key": "colName", "Value": "Sum([" + configData.FilteredCategory[0] + "])"+ ","+ "Sum([" + configData.FilteredCategory[1] + "])" }, { "Key": "isDelete", "Value": 0 }]);
            runScript("DynamicProductionCategory", [{ "Key": "actualValue", "Value": actualVal }, { "Key": "targetValue", "Value": selectedCategoryTarget }]);
        }

        else {
            $(".overlay", $(this)).hide();
            //updateColor();
            assignDocPropertyValue(1, $(this).val());
            setDocumentProperty("RefreshKPI", "false");
			log("elseactualVal"+ actualVal +  "selectedCategoryTarget" + selectedCategoryTarget);
            //runScript("DynamicProductionCategory", [{ "Key": "colName", "Value": "Sum([" + configData.FilteredCategory[0] + "])"+ ","+ "Sum([" + configData.FilteredCategory[1] + "])" }, { "Key": "isDelete", "Value": 1 }]);
            runScript("DynamicProductionCategory", [{ "Key": "actualValue", "Value": actualVal }, { "Key": "targetValue", "Value": selectedCategoryTarget }]);
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
var actualVal = "";
var targetVal = "";

function renderCore(sfdata) {
    selectedCategoryActual = sfdata.config.CategoryConditionActual;
    selectedCategoryTarget = sfdata.config.CategoryConditionTarget;
}


