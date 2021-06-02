export const menuList = [{
  name: '网关配置',
  id: 'Gateway',
  children: [{
    name: '概览',
    id: 'Overview',
    componentName: '/Overview'
  }, {
    name: '映射配置',
    id: 'Mapping',
    componentName: '/Mapping'
  }, {
    name: '插件配置',
    id: 'Plug',
    componentName: 'Plug'
  }]
}, {
  name: '流量管控',
  id: 'Flow',
  children: [{
    name: '流量监控',
    id: 'FlowMonitor',
    componentName: '/FlowMonitor'
  }, {
    name: '流量配置',
    id: 'TraffiConfig',
    componentName: '/TraffiConfig'
  }]
}]
