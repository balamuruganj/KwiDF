--Well Availability (%)

SELECT DATE , GC , WellAvailabilityPercentage, WellAvailabilityPercentageChange  FROM [dbo].[OS_Manager_DataByGc] WHERE DATE ='05-05-2016'

--Opportunity Well Count (#)
SELECT DATE , GC , OpportunityWellCount, OpportunityWellCountChange FROM [dbo].[OS_Manager_DataByGc] WHERE DATE ='05-05-2016'
--# Wells above Target BHP (#)

SELECT DATE , GC , WellsaboveTargetBHPCount,
WellsaboveTargetBHPCountChange FROM [dbo].[OS_Manager_DataByGc] WHERE DATE ='05-05-2016'



--Wells bellow Target BHP (#)
SELECT DATE , GC , WellsbelowTargetBHPCount,
WellsbelowTargetBHPCountChange FROM [dbo].[OS_Manager_DataByGc] WHERE DATE ='05-05-2016'


--# Failures (#)
SELECT DATE , GC , DownTimeCausesCount,
DownTimeCausesCountChange
 FROM [dbo].[OS_Manager_DataByGc] WHERE DATE ='05-05-2016'

--# Declared Workover (#)
SELECT DATE , GC , DeclaredWorkoverCount,
DeclaredWorkoverCountChange
 FROM [dbo].[OS_Manager_DataByGc] WHERE DATE ='05-05-2016'

--# DAERL (Days)
SELECT DATE , GC , RunLifeCount,
RunLifeCountChange
 FROM [dbo].[OS_Manager_DataByGc] WHERE DATE ='05-05-2016'

--Wells out pump limit (#)
SELECT DATE , GC , WellsOutpumplimitCount
WellsOutpumplimitCountChange
 FROM [dbo].[OS_Manager_DataByGc] WHERE DATE ='05-05-2016'

 --Wells with Losses (#)
 SELECT DATE , GC , WellsLossCount,
WellsLossCountChange
 FROM [dbo].[OS_Manager_DataByGc] WHERE DATE ='05-05-2016'

 

--# Wells with Gains(#)
 SELECT DATE , GC , WellsGainCount,
WellsGainCountChange
 FROM [dbo].[OS_Manager_DataByGc] WHERE DATE ='05-05-2016'

--Bottle Necks Pipes (#)
 SELECT DATE , GC , BottleNecksCount,
BottleNecksCountChange
 FROM [dbo].[OS_Manager_DataByGc] WHERE DATE ='05-05-2016'
--Flow Stability
 SELECT DATE , GC , FlowStabilityCount,
FlowStabilityCountChange
 FROM [dbo].[OS_Manager_DataByGc] WHERE DATE ='05-05-2016'

 ----Facility Capacity
 SELECT DATE , GC, LiquidProduced,
OilProduced, LiquidHandlingCapacity FROM OS_Manager_DataByGc WHERE DATE ='05-05-2016'
