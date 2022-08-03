import request from "@/utils/request";

export const getTables = params => {
  return request({
    url: "/sql-server/getTables",
    method: "get",
    params
  });
};

export const addTable = data => {
  return request({
    url: "/sql-server/addTable",
    method: "post",
    data
  });
};

export const getTableById = params => {
  return request({
    url: "/sql-server/getTableById",
    method: "get",
    params
  });
};

export const addDataSource = data => {
  return request({
    url: "/datasource/addDataSource",
    method: "post",
    data
  });
};

export const connectionTest = data => {
  return request({
    url: "/datasource/connectionTest",
    method: "post",
    data
  });
};

export const getDataSourcesByKeyword = (params, data) => {
  return request({
    url: "/datasource/getDataSourcesByKeyword",
    method: "post",
    params,
    data
  });
};

export const execSql = data => {
  return request({
    url: "/datasource/execSql",
    method: "post",
    data
  });
};

export const getReportTypeByKeyword = (params, data) => {
  return request({
    url: "/report-type/getReportTypeByKeyword",
    method: "post",
    params,
    data
  });
};

export const addReportTpl = data => {
  return request({
    url: "/report-tpl/addReportTpl",
    method: "post",
    data
  });
};

export const getReportTplByKeyword = (params, data) => {
  return request({
    url: "/report-tpl/getReportTplByKeyword",
    method: "post",
    params,
    data
  });
};

export const addTplDataSets = data => {
  return request({
    url: "/report-tpl-dataset/addTplDataSets",
    method: "post",
    data
  });
};

export const getDatasetsByTplId = params => {
  return request({
    url: "/report-tpl-dataset/getDatasetsByTplId",
    method: "get",
    params
  });
};

export const saveLuckySheetTpl = data => {
  return request({
    url: "/report-data/saveLuckySheetTpl",
    method: "post",
    data
  });
};

export const previewLuckySheetReportData = data => {
  return request({
    url: "/report-data/previewLuckySheetReportData",
    method: "post",
    data
  });
};

export const getReportDatasetsParam = params => {
  return request({
    url: "/report-data/getReportDatasetsParam",
    method: "get",
    params
  });
};

export const getLuckySheetTplSettings = params => {
  return request({
    url: "/report-tpl/getLuckySheetTplSettings",
    method: "get",
    params
  });
};
