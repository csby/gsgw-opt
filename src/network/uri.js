const uri = {
  // 获取获取验证码
  getCaptcha: '/opt.api/captcha',
  // 用户登录
  login: '/opt.api/login',
  // 退出登录
  logout: '/opt.api/logout',
  // 获取登录账号
  getLoginAccount: '/opt.api/login/account',
  // 获取在线用户
  getOnlineUsers: '/opt.api/online/users',

  // 通知订阅
  websocketNotify: '/opt.api/websocket/notify',

  // 系统角色
  // 获取服务角色
  sysRoleServer: '/opt.api/sys/role/server',

  // 后台服务
  // 获取服务信息
  svcInfo: '/opt.api/service/info',
  // 是否可在线重启
  svcRestartEnable: '/opt.api/service/restart/enable',
  // 重启服务
  svcRestart: '/opt.api/service/restart',
  // 是否可在线更新
  svcUpdateEnable: '/opt.api/service/update/enable',
  // 更新服务
  svcUpdate: '/opt.api/service/update',

  // 更新管理
  // 是否支持
  updEnable: '/opt.api/update/enable',
  // 获取服务信息
  updInfo: '/opt.api/update/info',
  // 是否可在线重启
  updRestartEnable: '/opt.api/update/restart/enable',
  // 重启服务
  updRestart: '/opt.api/update/restart',
  // 是否可在线更新
  updUploadEnable: '/opt.api/update/upload/enable',
  // 更新服务
  updUpload: '/opt.api/update/upload',

  // 系统信息
  // 获取主机信息
  monitorHost: '/opt.api/monitor/host',
  // 获取网卡信息
  monitorNetworkInterfaces: '/opt.api/monitor/network/interfaces',
  // 获取监听端口
  monitorListenPorts: '/opt.api/monitor/network/listen/ports',

  // 网站管理
  // 根站点
  // 获取文件列表
  siteRootFileList: '/opt.api/site/root/file/list',
  // 上传文件
  siteRootFileUpload: '/opt.api/site/root/file/upload',
  // 删除文件
  siteRootFileDelete: '/opt.api/site/root/file/delete',
  // 应用站点
  // 获取网站列表(ID)
  siteWebAppList: '/opt.api/site/app/list',
  // 获取网站信息
  siteWebAppInfo: '/opt.api/site/app/info',
  // 上传网站
  siteWebAppUpload: '/opt.api/site/app/upload',

  // 云端服务
  // 获取所有节点
  cloudNodeListAll: '/opt.api/cloud/node/list/all',
  // 获取在线节点
  cloudNodeListOnline: '/opt.api/cloud/node/list/online',
  // 修改节点信息
  cloudNodeInfoMod: '/opt.api/cloud/node/info/mod',
  // 删除节点
  cloudNodeInfoDel: '/opt.api/cloud/node/info/del',
  // 获取节点转发连接
  cloudNodeFwdConnList: '/opt.api/cloud/node/fwd/conn/list',

  // 节点服务
  // 获取节点信息
  nodeInfoGet: '/opt.api/node/info',
  // 获取启用状态
  nodeCfgEnableGet: '/opt.api/cfg/node/enable/get',
  // 获取在线状态
  nodeOnlineState: '/opt.api/node/online/state',
  // 获取在线目标节点
  nodeOnlineTargetList: '/opt.api/node/online/target/list',
  // 端口转发
  // 获取运行状态
  nodeFwdInputListenState: '/opt.api/node/fwd/input/listen/state',
  // 获取启用状态
  nodeFwdEnableGet: '/opt.api/cfg/node/fwd/enable/get',
  // 设置启用状态
  nodeFwdEnableSet: '/opt.api/cfg/node/fwd/enable/set',
  // 启动服务
  nodeFwdInputSvcListenStart: '/opt.api/cfg/node/fwd/input/svc/listen/start',
  // 停止服务
  nodeFwdInputSvcListenStop: '/opt.api/cfg/node/fwd/input/svc/listen/stop',
  // 获取转发列表
  nodeFwdItemList: '/opt.api/cfg/node/fwd/item/list',
  // 添加转发项目
  nodeFwdItemAdd: '/opt.api/cfg/node/fwd/item/add',
  // 修改转发项目
  nodeFwdItemMod: '/opt.api/cfg/node/fwd/item/mod',
  // 删除转发项目
  nodeFwdItemDel: '/opt.api/cfg/node/fwd/item/del'
}

export default {
  uris: uri
}
