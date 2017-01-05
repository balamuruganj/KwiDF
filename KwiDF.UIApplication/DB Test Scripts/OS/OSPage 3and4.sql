 -- Query to Validate the Page 3- Losses By Field

  SELECT Date, Field, SUM(OilProductionGainLoss)     FROM [dbo].[OS_Manager_Overview]
   WHERE DATE ='05-05-2016' AND  GC IS NOT NULL GROUP BY date, Field
  -- AND FIELD ='SA'  
   
  

 -- Query to Validate the Page 3- Down time by Field

  SELECT Date, Field, SUM(DownTimeHours)     FROM [dbo].[OS_Manager_Overview]
   WHERE DATE ='05-05-2016' AND  GC IS NOT NULL GROUP BY date, Field

   
   
    -- Query to Validate the Page 3- Down time by Cause

  SELECT  Date, SUM(DownTimeHours)  , GC   FROM [dbo].[OS_Manager_Overview]
   WHERE DATE ='05-05-2016'  and DownTimeCauses ='Esp Trip'
   group by date , Field , GC

   SELECT Date, SUM(DownTimeHours)     FROM [dbo].[OS_Manager_Overview]
   WHERE DATE ='05-05-2016'  and DownTimeCauses ='FlowLine Problems'
   group by date , Field 


       -- Query to Validate the Page 3- Loss by Cause

  SELECT Date, SUM([OilProductionGainLoss])     FROM [dbo].[OS_Manager_Overview]
   WHERE DATE ='05-05-2016'  and DownTimeCauses ='Esp Trip'
   group by date , Field 

   SELECT Date, SUM([OilProductionGainLoss])     FROM [dbo].[OS_Manager_Overview]
   WHERE DATE ='05-05-2016'  and DownTimeCauses ='FlowLine Problems'
   group by date , Field 
   

   --Page 4:
   --Bottleneck analysis
   SELECT [Date]
     
      ,[Field]
     
      ,SUM([ReservoirPotential]) [ReservoirPotential]
      ,SUM([WellPotential]) [WellPotential]
      ,SUM([PipelinePotential]) [PipelinePotential]
      ,SUM([IntegrityCapacity]) [IntegrityCapacity]
      ,SUM([DCPFull]) [DCPFull]
      
  FROM [ProdOps].[dbo].[OS_Manager_Overview] WHERE DATE ='01-27-2016'  AND [ReservoirPotential] IS NOT NULL
  GROUP BY FIELD, DATE

  --