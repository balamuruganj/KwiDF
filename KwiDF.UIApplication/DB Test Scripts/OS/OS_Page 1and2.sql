--Manager View Field

--Page 1 :Measured DCP:
SELECT SUM(DCP) AS DCP, SUM(DCPTarget) AS DCPTarget from  [dbo].[OS_Manager_Overview] where 
date ='01-01-2016' and Field ='RA' group by Date, Field

--Estimated
SELECT SUM([EstimatedActualDCP]) AS DCP, SUM([EstimatedTargetDCP]) AS DCPTarget from  [dbo].[OS_Manager_Overview] where 
date ='01-01-2016' and Field ='RA' group by Date, Field

--Oil/Gain Loss
SELECT SUM(OilProductionGainLoss) AS OilProductionGainLoss, SUM(OilProductionGainLossTarget) AS OilProductionGainLossTarget, SUM(OilProductionGainLossChange) AS OilProductionGainLossChange from  [dbo].[OS_Manager_Overview] where 
date ='01-01-2016' and Field ='RA' group by Date, Field

--DWP
SELECT SUM(DWP) AS DCP, SUM(DWPTarget) AS DCPTarget from  [dbo].[OS_Manager_Overview] where 
date ='01-01-2016' and Field ='RA' group by Date, Field

--Budget
SELECT FIELD, [BudgetExpenditure], [BudgetExpenditureKD],[BudgetExpenditureChange] from  OS_Manager_BudgetDataByField WHERE
MONTH =1 AND YEAR =2016 

--Active Producers Vs Target By Field
SELECT [ProducersActiveWell] AS ProducersActiveWell ,[ProducersActiveWellTarget]  AS ProducersActiveWellTarget from  [dbo].OS_Manager_DataByField where 
date ='01-01-2016' and Field ='RA' 

--Active Injectors Vs Target By field
SELECT [InjectorsActiveWell] AS [InjectorsActiveWell] ,[InjectorsActiveWellTarget]  AS [InjectorsActiveWellTarget] from  [dbo].OS_Manager_DataByField where 
date ='01-01-2016' and Field ='RA' 

--Losses by Field:
SELECT Field, SUM([OilProductionGainLoss]) AS [OilProductionGainLoss] from  [dbo].OS_Manager_DataByField where 
date ='01-01-2016' GROUP BY Field


--Drilling Rig Count
SELECT Field, SUM([DrillingRigsCount]) AS [DrillingRigsCount] from  [dbo].OS_Manager_DataByField where 
date ='01-01-2016' GROUP BY Field

--Workover Rig Count
SELECT Field, SUM([WorkoverRigsCount]) AS [WorkoverRigsCount] from  [dbo].OS_Manager_DataByField where 
date ='01-01-2016' GROUP BY Field


--Line Chart

SELECT SUM(DCP) AS DCP, SUM(DWP) AS DWP from  [dbo].[OS_Manager_Overview] where 
date between '01-01-2016' and '01-10-2016'  and Field ='RA' group by Date, Field


--GC View

--Page 2 : DCP:
SELECT SUM(DCP) AS DCP, SUM(DCPTarget) AS DCPTarget from  [dbo].[OS_Manager_Overview] where 
date ='01-01-2016' and GC ='GC23' group by Date, GC


--Oil Gain / Loss
SELECT SUM(OilProductionGainLoss) AS OilProductionGainLoss, SUM(OilProductionGainLossTarget) AS OilProductionGainLossTarget, SUM(OilProductionGainLossChange) AS OilProductionGainLossChange from  [dbo].[OS_Manager_Overview] where 
date ='01-01-2016' and GC ='GC23' group by Date, GC

--Water Production
SELECT SUM([DWP]) AS [DWP], SUM([DWPTarget]) AS [DWPTarget], SUM([DWPChange]) AS [DWPChange] from  [dbo].[OS_Manager_Overview] where 
date ='01-01-2016' and GC ='GC23' group by Date, GC


--Budget
SELECT GC, [BudgetExpenditure], [BudgetExpenditureKD],[BudgetExpenditureChange] from  [OS_Manager_BudgetDataByGc] WHERE
MONTH =2 AND YEAR =2016 


--Active Producers Vs Target By Field
SELECT [ProducersActiveWell] AS ProducersActiveWell ,[ProducersActiveWellTarget]  AS ProducersActiveWellTarget from  [dbo].[OS_Manager_DataByGc] where 
date ='01-01-2016' and GC ='GC23' 

--Active Injectors Vs Target By field
SELECT [InjectorsActiveWell] AS [InjectorsActiveWell] ,[InjectorsActiveWellTarget]  AS [InjectorsActiveWellTarget] from  [dbo].[OS_Manager_DataByGc] where 
date ='01-01-2016' and GC ='GC23' 


--Liquid handling Capacity and other 3 Gauges

SELECT TOP 1000 [GC]      
      ,[LiquidHandlingCapacity]      ,[LiquidHandlingTarget]      ,[WaterHandlingCapacity]      ,[WaterHandlingTarget]
      ,[EffluentWaterHandlingCapacity]      ,[EffluentWaterHandlingTarget]      ,[SeaWaterHandlingCapacity]
      ,[SeaWaterHandlingTarget]      ,[DrillingRigsCount]      ,[DrillingRigsTarget]
      , [WorkoverRigsCount],[WorkoverRigsTarget]
  FROM [ProdOps].[dbo].[OS_Manager_DataByGc] WHERE [Date] ='01-01-2016' AND GC='GC23'