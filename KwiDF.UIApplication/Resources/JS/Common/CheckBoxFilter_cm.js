
$(document).ready(function () {

    var chartObj = $("#js_chart");
    $(chartObj).wrapInner("<div class='wrapper' style='margin-top:15px'/>");
    $(".wrapper").append("<ul style='list-style: none;margin:0;padding:0'><li style='padding-bottom:5px;'><input class='Checkbox' type='checkbox' id='checkbox0' value='Sum([DownTimeHours]) as [DownTime(Hrs)]' /> <span style='color: #ffffff;'>DownTime(Hrs)&nbsp;&nbsp;</span>&nbsp;</li><li style='padding-bottom:5px;'><input class='Checkbox' type='checkbox' id='checkbox1' value='Sum([OilProductionGainLoss]) as [Losses(stb/day)]' /> <span style='color: #ffffff;'>Losses(stb/day)</span>&nbsp;</li><li style='padding-bottom:5px;'><input class='Checkbox' type='checkbox' id='checkbox2' value='Sum([WellPotential]) as [Well Potential]' /> <span style='color: #ffffff;'>Well Potential</span>&nbsp;</li><li style='padding-bottom:5px;'><input class='Checkbox' id='checkbox3' type='checkbox' value='Sum([ReservoirPotential]) as [Reservoir Potential]' /> <span style='color: #ffffff;'>Reservoir Potential</span>&nbsp;</li><li style='padding-bottom:5px;'><input class='Checkbox' type='checkbox' id='checkbox4' value='Sum([PipelinePotential]) as [Pipeline Potential]' /> <span style='color: #ffffff;'>Pipeline Potential </span>&nbsp;</li><li style='padding-bottom:5px;'><input class='Checkbox' type='checkbox' value='Sum([IntegrityCapacity]) as [Integrity Capacity]'  id='checkbox5'/> <span style='color: #ffffff;'>Integrity Capacity</span>&nbsp;</li><li><input class='Checkbox' type='checkbox' value='Sum([DCPFull]) as [DCP Full]' id='checkbox6' /> <span style='color: #ffffff;'>DCP Full</span></li></ul>");    
if ($('.wrapper', chartObj).length >0) {
              $('.wrapper span',chartObj).css({'color':'#fff','fontSize':'15px', 'fontFamily':'Arial'});
}

    var chartObj = $("#js_chart");
    chartObj.on('click', '.Checkbox', function () {

        //log("Clicked");

        $(this).toggleClass('selected');

        //log("DocClick" + selectedCategoryActual);
     if ($(this).prop("checked") == true)  {
            // $(".overlay", $(this)).show();
            //updateColor();
            log($(this).val());
            //selectedCategoryActual+="," + $(this).val();
            //log("selectedCategoryActual : " + selectedCategoryActual);
            assignDocPropertyValue(0, $(this).val());
            setDocumentProperty("RefreshKPI", "false");
			setDocumentProperty("RefreshKPIcm", "false");
			log("ifactualVal"+ actualVal +  "selectedCategoryTarget" + selectedCategoryTarget);
            // runScript("DynamicProductionCategory", [{ "Key": "colName", "Value": "Sum([" + configData.FilteredCategory[0] + "])"+ ","+ "Sum([" + configData.FilteredCategory[1] + "])" }, { "Key": "isDelete", "Value": 0 }]);
            runScript("DynamicProductionCategory_cm", [{ "Key": "actualValue", "Value": actualVal }, { "Key": "targetValue", "Value": selectedCategoryTarget }]);
        }

        else {
            //$(".overlay", $(this)).hide();
            //updateColor();
            assignDocPropertyValue(1, $(this).val());
            setDocumentProperty("RefreshKPI", "false");
			setDocumentProperty("RefreshKPIcm", "false");
			log("elseactualVal"+ actualVal +  "selectedCategoryTarget" + selectedCategoryTarget);
            //runScript("DynamicProductionCategory", [{ "Key": "colName", "Value": "Sum([" + configData.FilteredCategory[0] + "])"+ ","+ "Sum([" + configData.FilteredCategory[1] + "])" }, { "Key": "isDelete", "Value": 1 }]);
            runScript("DynamicProductionCategory_cm", [{ "Key": "actualValue", "Value": actualVal }, { "Key": "targetValue", "Value": selectedCategoryTarget }]);
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


