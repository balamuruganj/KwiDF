
--Page 5: Engineering 1 UI - Production

--DCP By Field
SELECT DATE , FIELD , SUM(DCP) DCP,SUM([DCPChange]) [DCPChange],SUM(DCPTarget) DCPTarget FROM [dbo].[OS_Manager_Overview] WHERE Date ='05-05-2016'
 GROUP BY  DATE , FIELD 
 --DCP By Well
SELECT DATE , UWI , SUM(DCP) DCP,SUM([DCPChange]) [DCPChange],SUM(DCPTarget) DCPTarget FROM [dbo].[OS_Manager_Overview] WHERE Date ='05-05-2016'
AND FIELD ='RA' GROUP BY  DATE , UWI 



--PGOR By field
SELECT DATE , FIELD , SUM([PGOROilProduction]) [PGOROilProduction],SUM([PGOROilProductionTarget]) [PGOROilProductionTarget],SUM([PGOROilProductionChange]) [PGOROilProductionChange] FROM [dbo].[OS_Manager_Overview] WHERE Date ='05-05-2016'
 GROUP BY  DATE , FIELD 
 --DCP By Well
SELECT DATE , UWI , SUM([PGOROilProduction]) [PGOROilProduction],SUM([PGOROilProductionTarget]) [PGOROilProductionTarget],SUM([PGOROilProductionChange]) [PGOROilProductionChange] FROM [dbo].[OS_Manager_Overview] WHERE Date ='05-05-2016'
AND FIELD ='RA' GROUP BY  DATE , UWI 

--KwiDFCalc By Field
SELECT DATE , FIELD , SUM([CalculatedOilProduction]) [CalculatedOilProduction],SUM([CalculatedOilProductionTarget]) [CalculatedOilProductionTarget],SUM([CalculatedOilProductionChange]) [CalculatedOilProductionChange] FROM [dbo].[OS_Manager_Overview] WHERE Date ='05-05-2016'
 GROUP BY  DATE , FIELD
 --KwiDFCalc By Well
SELECT DATE , UWI , SUM([CalculatedOilProduction]) [PGOROilProduction],SUM([CalculatedOilProductionTarget]) [PGOROilProductionTarget],SUM([CalculatedOilProductionChange]) [PGOROilProductionChange] FROM [dbo].[OS_Manager_Overview] WHERE Date ='05-05-2016'
AND FIELD ='RQ' GROUP BY  DATE , UWI 


--DWP By Field
SELECT DATE , FIELD , SUM(DWP) DWP,SUM([DWPChange]) [DWPChange],SUM(DWPTarget) DCPTarget FROM [dbo].[OS_Manager_Overview] WHERE Date ='05-05-2016'
 GROUP BY  DATE , FIELD 
 --DWP By Well
SELECT DATE , UWI , SUM(DWP) DWP,SUM([DWPChange]) [DWPChange],SUM(DWPTarget) FROM [dbo].[OS_Manager_Overview] WHERE Date ='05-05-2016'
AND FIELD ='RQ' GROUP BY  DATE , UWI 



--PGOR Water By Field
SELECT DATE , FIELD , SUM([PGORWaterProduction]) [PGORWaterProduction],SUM([PGORWaterProductionTarget]) [PGORWaterProductionTarget],SUM([PGORWaterProductionChange]) [PGORWaterProductionChange] FROM [dbo].[OS_Manager_Overview] WHERE Date ='05-05-2016'
 GROUP BY  DATE , FIELD 
 --PGOR Water Well
SELECT DATE , UWI , SUM([PGORWaterProduction]) [PGORWaterProduction],SUM([PGORWaterProductionTarget]) [PGORWaterProductionTarget],SUM([PGORWaterProductionChange]) [PGORWaterProductionChange] FROM [dbo].[OS_Manager_Overview] WHERE Date ='05-05-2016'
AND FIELD ='RQ' GROUP BY  DATE , UWI 

--Calc Fy Field well
SELECT DATE , FIELD , SUM([CalculatedWaterProduction]) [CalculatedWaterProduction],SUM([CalculatedWaterProductionTarget]) [CalculatedWaterProductionTarget],SUM([CalculatedWaterProductionChange]) [CalculatedWaterProductionChange] FROM [dbo].[OS_Manager_Overview] WHERE Date ='05-05-2016'
 GROUP BY  DATE , FIELD
 --KwiDFCalc By Well
SELECT DATE , UWI , SUM([CalculatedWaterProduction]) [CalculatedWaterProduction],SUM([CalculatedWaterProductionTarget]) [CalculatedWaterProductionTarget],SUM([CalculatedWaterProductionChange]) [CalculatedWaterProductionChange] FROM [dbo].[OS_Manager_Overview] WHERE Date ='05-05-2016'
AND FIELD ='AD' GROUP BY  DATE , UWI 


--Oil Losses by field
SELECT DATE , FIELD , SUM([OilProductionGainLoss]) [OilProductionGainLoss],SUM([OilProductionGainLossTarget]) [OilProductionGainLossTarget],SUM([OilProductionGainLossChange]) [OilProductionGainLossChange] FROM [dbo].[OS_Manager_Overview] WHERE Date ='05-05-2016'
 GROUP BY  DATE , FIELD
 --Oil Losses  By Well
SELECT DATE , UWI , SUM([OilProductionGainLoss]) [OilProductionGainLoss],SUM([OilProductionGainLossTarget]) [OilProductionGainLossTarget],SUM([OilProductionGainLossChange]) [OilProductionGainLossChange] FROM [dbo].[OS_Manager_Overview] WHERE Date ='05-05-2016'
AND FIELD ='AD' GROUP BY  DATE , UWI 

--Gain By well
SELECT DATE , UWI , SUM([OilProductionGainLoss]) [OilProductionGainLoss],SUM([OilProductionGainLossTarget]) [OilProductionGainLossTarget],SUM([OilProductionGainLossChange]) [OilProductionGainLossChange] FROM [dbo].[OS_Manager_Overview] WHERE Date ='05-05-2016'
AND FIELD ='AD' and [OilProductionGainLoss] >0  GROUP BY  DATE , UWI ORDER BY [OilProductionGainLoss] DESC
--Losses By Well
SELECT DATE , UWI , SUM([OilProductionGainLoss]) [OilProductionGainLoss],SUM([OilProductionGainLossTarget]) [OilProductionGainLossTarget],SUM([OilProductionGainLossChange]) [OilProductionGainLossChange] FROM [dbo].[OS_Manager_Overview] WHERE Date ='05-05-2016'
AND FIELD ='AD' and [OilProductionGainLoss] <0  GROUP BY  DATE , UWI ORDER BY [OilProductionGainLoss] DESC


--Gain By Cause
SELECT DATE , GainCauses,UWI , SUM([OilProductionGainLoss]) [OilProductionGainLoss] FROM [dbo].[OS_Manager_Overview] WHERE Date ='05-05-2016'
AND FIELD ='AD' and [OilProductionGainLoss] >0  GROUP BY  DATE , UWI , GainCauses ORDER BY [OilProductionGainLoss] DESC


--Loss By Cause
SELECT DATE , LossCauses , SUM([OilProductionGainLoss]) [OilProductionGainLoss] FROM [dbo].[OS_Manager_Overview] WHERE Date ='05-05-2016'
AND FIELD ='AD' and [OilProductionGainLoss] <0  GROUP BY  DATE ,LossCauses ORDER BY [OilProductionGainLoss] DESC


-- Allocation Factor
SELECT Date, GC, SUM( CalculatedOilRatio) as AllocationFactor FROM [dbo].[OS_Manager_Overview] WHERE Date ='05-05-2016' AND GC IS NOT NULL
GROUP BY  DATE ,GC 