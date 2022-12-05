import request from "@/utils/request"
import Mixin from '@/mixins/index'

export const getTables = (params, data) => {
  return request({
    url: "/sql-server/getTables",
    method: "post",
    params,
    data
  })
}

export const addTable = data => {
  return request({
    url: "/sql-server/addTable",
    method: "post",
    data
  })
}

export const getTableById = params => {
  return request({
    url: "/sql-server/getTableById",
    method: "get",
    params
  })
}

export const addDataSource = data => {
  return request({
    url: "/datasource/addDataSource",
    method: "post",
    data
  })
}

export const connectionTest = data => {
  return request({
    url: "/datasource/connectionTest",
    method: "post",
    data
  })
}

export const getTablesByDataSource = params => {
  return request({
    url: "/datasource/getTablesByDataSource",
    method: "get",
    params
  })
}

export const getDataSourcesByKeyword = (params, data) => {
  return request({
    url: "/datasource/getDataSourcesByKeyword",
    method: "post",
    params,
    data
  })
}

export const execSql = data => {
  return request({
    url: "/datasource/execSql",
    method: "post",
    data
  })
}

export const getReportTypeByKeyword = (params, data) => {
  return request({
    url: "/report-type/getReportTypeByKeyword",
    method: "post",
    params,
    data
  })
}

export const addReportTpl = data => {
  return request({
    url: "/report-tpl/addReportTpl",
    method: "post",
    data
  })
}

export const getReportTplByKeyword = (params, data) => {
  return request({
    url: "/report-tpl/getReportTplByKeyword",
    method: "post",
    params,
    data
  })
}

export const addTplDataSets = data => {
  return request({
    url: "/report-tpl-dataset/addTplDataSets",
    method: "post",
    data
  })
}

export const getDatasetsByTplId = params => {
  return request({
    url: "/report-tpl-dataset/getDatasetsByTplId",
    method: "get",
    params
  })
}

export const saveLuckySheetTpl = data => {
  return request({
    url: "/report-data/saveLuckySheetTpl",
    method: "post",
    data
  })
}

export const previewLuckySheetReportData = data => {
  return request({
    url: "/report-data/previewLuckySheetReportData",
    method: "post",
    data
  })
}

export const getReportDatasetsParam = params => {
  return request({
    url: "/report-data/getReportDatasetsParam",
    method: "get",
    params
  })
}

export const getLuckySheetTplSettings = params => {
  return request({
    url: "/report-tpl/getLuckySheetTplSettings",
    method: "get",
    params
  })
}

export const sendCode = (params) => {
  return request({
    url: "/author/auth/sendCode",
    method: 'get',
    params
  })
}

export const getToken = (params) => {
  return request({
    url: "/author/auth/token",
    method: 'post',
    params
  })
}

export const toLogin = () => {
  return request({
    url: "/sso/toLogin",
    method: 'get'
  })
}

export const getSession = () => {
  return request({
    url: "/sso/getSession",
    method: 'get'
  })
}

export const getCurrentUser = () => {
  return request({
    url: "/sso/getCurrentUser",
    method: 'get'
  })
}

export const ssoLogout = () => {
  return request({
    url: "/sso/api/logout",
    method: 'get'
  })
}
