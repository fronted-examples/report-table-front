with rate1 as(
  --每月汇率
  select
    fdate,
    FEXCHANGERATE
  from
    (
      select
        a.FCyToID,
        b.fname name1,
        a.fcyforid,
        c.fname name2,
        fbegdate,
        fenddate,
        DATE_FORMAT(a.fenddate, 'yyyy-MM') fdate,
        DATE_FORMAT(a.fenddate, 'yyyy') fyear,
        FEXCHANGERATE
      from
        dw.dw_db_dim_t_bd_rate a
        left join dw.dw_db_dim_t_bd_currency b on a.FCyToID = b.fcurrencyid
        left join dw.dw_db_dim_t_bd_currency c on a.fcyforid = c.fcurrencyid
      WHERE
        a.fcyforid = 7
        and a.FCyToID = 1
        and fbegdate != fenddate
    ) t
  where
    fyear > 2021
),
rate2 as(
  --每年预估汇率
  select
    dates as fdate,
    target as FEXCHANGERATE
  from
    ods.ods_mysql_wl_fact_comtarget
  where
    projectname = '当年预估汇率'
),
fpreprice as (
  --业务销售额（美元） 预算金额
  select
    t.fprojectname,
    t.fdate,
    t.fyear,
    round(sum(t.fpreprice / t1.FEXCHANGERATE), 4) as fpreprice
  from
    (
      --业务销售额 预算部分 服饰/家居销售净额 预算金额
      select
        '业务销售额（美元）' as fprojectname,
        dates as fdate,
        substr(dates, 0, 4) as fyear,
        sum(target) as fpreprice
      from
        ods.ods_mysql_fact_comtarget
      where
        secsubjectname = '销售净额'
        and substr(dates, 0, 4) > 2021
      group by
        dates
      union
      ALL --业务销售额 预算部分 亮丰国际研发部销售净额 预算金额
      select
        '业务销售额（美元）' as fprojectname,
        dates as fdate,
        substr(dates, 0, 4) as fyear,
        sum(target) as fpreprice
      from
        ods.ods_mysql_lf_fact_comtarget
      where
        secsubjectname = '销售净额'
        and classname = '国际研发部'
        and substr(dates, 0, 4) > 2021
      group by
        dates
    ) t
    left join rate2 t1 on t.fyear = t1.fdate
  group by
    t.fprojectname,
    t.fdate,
    t.fyear
),
factualprice as(
  --业务销售额（美元） 实际金额
  select
    t0.fprojectname,
    t0.fdate,
    t0.fyear,
    case
      when sum(t.factualprice / t1.FEXCHANGERATE) is null then 0
      else round(sum(t.factualprice / t1.FEXCHANGERATE), 4)
    end factualprice
  from
    fpreprice t0
    left join (
      --业务销售额 实际部分 服饰/家居销售净额
      select
        '业务销售额（美元）' as fprojectname,
        `年月` as fdate,
        `年` as fyear,
        sum(`金额`) as factualprice
      from
        ods.ods_mysql_dms_fact_mian
      where
        `年` > 2021
        and `二级科目` = '销售净额'
        and (
          `部门` LIKE '%家居事业部%'
          OR `部门` LIKE '%服饰事业部%'
        )
      group by
        `年月`,
        `年` --业务销售额 预算部分 亮丰国际研发部销售净额
      union
      all
      select
        '业务销售额（美元）' as fprojectname,
        fdate,
        substr(fdate, 0, 4) as fyear,
        sum(famount) as factualprice
      from
        dm.dm_lf_fact_mian_test
      where
        secsubjectname = '销售净额'
        and fswsalesdepartname = '国际研发部'
      group BY
        fdate
    ) t on t0.fdate = t.fdate
    left join rate1 t1 on t.fdate = t1.fdate
  group by
    t0.fprojectname,
    t0.fdate,
    t0.fyear
),
fmonthactualprice as(
  --业务销售额（美元） 当年1月到当前月实际汇总金额
  SELECT
    fprojectname,
    fdate,
    fyear,
    SUM(factualprice) OVER(
      ORDER BY
        fdate
    ) AS fmonthactualprice
  FROM
    factualprice
),
fmonthpreprice as(
  --业务销售额（美元） 当年1月到当前月预算汇总金额
  SELECT
    fprojectname,
    fdate,
    fyear,
    SUM(fpreprice) OVER(
      ORDER BY
        fdate
    ) AS fmonthpreprice
  FROM
    fpreprice
),
fpreprice2 as (
  --部门基础费用收入（人民币） 预算金额
  select
    '部门基础费用收入（人民币）' as fprojectname,
    a.fdate,
    a.fyear,
    a.fpreprice * 0.003 * b.FEXCHANGERATE as fpreprice
  from
    fpreprice a
    left join rate2 b on a.fyear = b.fdate
),
factualprice2 as (
  --部门基础费用收入（人民币） 实际金额
  select
    '部门基础费用收入（人民币）' as fprojectname,
    a.fdate,
    a.fyear,
    case
      when a.factualprice is null
      or b.FEXCHANGERATE is null then 0
      else a.factualprice * 0.003 * b.FEXCHANGERATE
    end factualprice
  from
    factualprice a
    left join rate1 b on a.fdate = b.fdate
),
fmonthactualprice2 as(
  --部门基础费用收入（人民币） 当年1月到当前月实际汇总金额
  SELECT
    fprojectname,
    fdate,
    fyear,
    SUM(factualprice) OVER(
      ORDER BY
        fdate
    ) AS fmonthactualprice
  FROM
    factualprice2
),
fmonthpreprice2 as(
  --部门基础费用收入（人民币） 当年1月到当前月预算汇总金额
  SELECT
    fprojectname,
    fdate,
    fyear,
    SUM(fpreprice) OVER(
      ORDER BY
        fdate
    ) AS fmonthpreprice
  FROM
    fpreprice2
)
insert
  overwrite table dm.dm_wl_fact_main_test --业务销售额（美元）
select
  a.fprojectname,
  a.fdate,
  a.fyear,
  round(a.fpreprice, 4) as fpreprice,
  null as fprepricezb,
  round(b.factualprice, 4) as factualprice,
  null as factualpricezb,
  null as fprepricerate,
  null as fdifference,
  round(c.fmonthpreprice, 4) as fmonthpreprice,
  null as fmonthprepricezb,
  round(d.fmonthactualprice, 4) as fmonthactualprice,
  null as fmonthactualpricezb,
  null as fmonthprepricerate,
  null as fmonthdifference
from
  fpreprice a
  left join factualprice b on a.fprojectname = b.fprojectname
  and a.fdate = b.fdate
  left join fmonthpreprice c on a.fprojectname = c.fprojectname
  and a.fdate = c.fdate
  left join fmonthactualprice d on a.fprojectname = d.fprojectname
  and a.fdate = d.fdate
union
ALL --部门基础费用收入（人民币）
select
  a.fprojectname,
  a.fdate,
  a.fyear,
  round(a.fpreprice, 4) as fpreprice,
  null as fprepricezb,
  round(b.factualprice, 4) as factualprice,
  null as factualpricezb,
  null as fprepricerate,
  null as fdifference,
  round(c.fmonthpreprice, 4) as fmonthpreprice,
  null as fmonthprepricezb,
  round(d.fmonthactualprice, 4) as fmonthactualprice,
  null as fmonthactualpricezb,
  null as fmonthprepricerate,
  null as fmonthdifference
from
  fpreprice2 a
  left join factualprice2 b on a.fprojectname = b.fprojectname
  and a.fdate = b.fdate
  left join fmonthpreprice2 c on a.fprojectname = c.fprojectname
  and a.fdate = c.fdate
  left join fmonthactualprice2 d on a.fprojectname = d.fprojectname
  and a.fdate = d.fdate
