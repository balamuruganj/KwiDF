
$(document).ready(function () {

    var chartObj = $("#js_chart");
    $(chartObj).wrapInner("<div class='wrapper' style='margin-top:15px'/>");
    //$(".wrapper").append("<p><input class='Checkbox' id='checkbox0' type='checkbox' value='Sum([DownTimeHours]) as [DownTime(Hrs)]' /> <span style='color: #ffffff;'>DownTime(Hrs)&nbsp;&nbsp;</span>&nbsp;<input id='checkbox1' class='Checkbox' type='checkbox' value='Sum([OilProductionGainLoss]) as [Losses(stb/day)]' /> <span style='color: #ffffff;'>Losses(stb/day)</span>&nbsp;<input id='checkbox2' class='Checkbox' type='checkbox' value='Sum([LiquidHandleCapacity]) as [Liquid Handling Capacity] ' /> <span style='color: #ffffff;'>Liquid handling capacity(stb/day)</span><input class='Checkbox' type='checkbox' id='checkbox3' value='Sum([DCP]) as [DCP]' /> <span style='color: #ffffff;'>DCP</span><input class='Checkbox' type='checkbox' id='checkbox4' value='Sum([DWP]) as [DWP] ' /> <span style='color: #ffffff;'>DWP</span><input  id="checkbox5" class='Checkbox' type='checkbox' value='Sum([WaterHandleCapacity]) as [Water Handling Capacity]' /><span style='color: #ffffff;'>Water Handling Capacity</span></p>");    
$(".wrapper").append("<p><input class='Checkbox' id='checkbox0' type='checkbox' value='Sum([DownTimeHours]) as [DownTime(Hrs)]' /> <span style='color: #ffffff;'>DownTime(Hrs)&nbsp;&nbsp;</span>&nbsp;<input  id='checkbox1' class='Checkbox' type='checkbox' value='Sum([OilProductionGainLoss]) as [Losses(stb/day)]' /> <span style='color: #ffffff;'>Losses(stb/day)</span>&nbsp;<input class='Checkbox'  id='checkbox2' type='checkbox' value='Sum([LiquidHandleCapacity]) as [Liquid Handling Capacity] ' /> <span style='color: #ffffff;'>Liquid Handling Capacity(stb/day)</span><input id='checkbox3' class='Checkbox' type='checkbox' value='Sum([DCP]) as [DCP]' /> <span style='color: #ffffff;'>DCP</span><input id='checkbox4' class='Checkbox' type='checkbox' value='Sum([DWP]) as [DWP] ' /> <span style='color: #ffffff;'>DWP</span><input class='Checkbox' type='checkbox'  id='checkbox5' value='Sum([WaterHandleCapacity]) as [Water Handling Capacity]' /> <span style='color: #ffffff;'>Water Handling Capacity</span></p>");
	if ($('.wrapper', chartObj).length >0) {
              $('.wrapper span',chartObj).css({'color':'#fff','fontSize':'15px', 'fontFamily':'Arial'});
}

    var chartObj = $("#js_chart");
    chartObj.on('click', '.Checkbox', function () {

        //log("Clicked");

        $(this).toggleClass('selected');

        //log("DocClick" + selectedCategoryActual);
        if ($(this).prop("checked") == true) {
            // $(".overlay", $(this)).show();
            //updateColor();
            log($(this).val());
            //selectedCategoryActual+="," + $(this).val();
            //log("selectedCategoryActual : " + selectedCategoryActual);
            assignDocPropertyValue(0, $(this).val());
            setDocumentProperty("RefreshKPI", "false");
			setDocumentProperty("RefreshKPIPage3", "false");
			log("ifactualVal"+ actualVal +  "selectedCategoryTarget" + selectedCategoryTarget);
            // runScript("DynamicProductionCategory", [{ "Key": "colName", "Value": "Sum([" + configData.FilteredCategory[0] + "])"+ ","+ "Sum([" + configData.FilteredCategory[1] + "])" }, { "Key": "isDelete", "Value": 0 }]);
            runScript("DynamicProductionCategory", [{ "Key": "actualValue", "Value": actualVal }, { "Key": "targetValue", "Value": selectedCategoryTarget }]);
        }

        else {
           // $(".overlay", $(this)).hide();
            //updateColor();
            assignDocPropertyValue(1, $(this).val());
            setDocumentProperty("RefreshKPI", "false");
			setDocumentProperty("RefreshKPIPage3", "false");
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
 actualValueArray = sfdata.config.ColumnName;
    actualDisplayArray = sfdata.config.DisplayName;
    selectedCategoryActual = sfdata.config.CategoryConditionActual;
    selectedCategoryTarget = sfdata.config.CategoryConditionTarget;
	 if (sfdata.config.RefreshKPI == "true") {
			for(var i=0;i<actualValueArray.length;i++)
			{
				if (selectedCategoryActual != "" && selectedCategoryActual != undefined) { 
					log("Checkbox true set condition met0");
					if (selectedCategoryActual.indexOf(actualValueArray[i]) > -1) {
					log("Checkbox true set condition met1");
					log("Checkbox true set condition met2");
					   if(i==0)
					   {
						   $("#checkbox0").prop('checked', true);
					   }
					   else
					   {
						   var n=i;
						   $("#checkbox" + n).prop('checked', true);
					   }
						
						
					}
					else {
						if(i==0)
					   {
						   $("#checkbox0").prop('checked', false);
					   }
					   else
					   {
						   var n=i;
						   $("#checkbox" + n).prop('checked', false);
					   }
					}
				}
				else
				{
					if(i==0)
					   {
						   $("#checkbox0").prop('checked', false);
					   }
					   else
					   {
						   var n=i;
						   $("#checkbox" + n).prop('checked', false);
					   }
				}
			}
	 }
}


