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
  // 获取本地用户列表
  getLocalUsers: '/opt.api/user/local/list',
  // 新建本地用户
  createLocalUser: '/opt.api/user/local/create',
  // 删除本地用户
  deleteLocalUser: '/opt.api/user/local/delete',
  // 修改本地用户信息
  modifyLocalUser: '/opt.api/user/local/modify',
  // 重置本地用户密码
  resetLocalUserPassword: '/opt.api/user/local/password/reset',
  // 修改本地用户密码
  changeLocalUserPassword: '/opt.api/user/local/password/change',
  // 获取LDAP
  cfgOptLdapGet: '/opt.api/user/ldap/get',
  // 设置LDAP
  cfgOptLdapSet: '/opt.api/user/ldap/set',

  // 通知订阅
  websocketNotify: '/opt.api/websocket/notify',

  // 数据库
  // 获取SQL Server实例列表
  dbMsSqlInstanceList: '/opt.api/db/mssql/instance/list',

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

  // 系统资源-主机
  // 获取主机信息
  monitorHost: '/opt.api/monitor/host',

  // 系统资源-网络
  // 获取网卡信息
  monitorNetworkInterfaces: '/opt.api/monitor/network/interfaces',
  // 获取网卡吞吐量
  monitorNetworkThroughputList: '/opt.api/monitor/network/throughput/list',
  // 获取监听端口
  monitorListenPorts: '/opt.api/monitor/network/listen/ports',

  // 系统资源-CPU
  // 获取CPU使用率
  monitorCpuUsageList: '/opt.api/monitor/cpu/usage/list',

  // 系统资源-内存
  // 获取内存使用率
  monitorMemUsageList: '/opt.api/monitor/mem/usage/list',

  // 系统资源-磁盘
  // 获取磁盘分区信息
  monitorDiskUsageList: '/opt.api/monitor/disk/usage/list',

  // 系统资源-进程
  // 获取进程信息
  monitorProcessInfo: '/opt.api/monitor/process/info',

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

  // 反向代理
  // 获取服务设置
  proxyServiceSettingGet: '/opt.api/proxy/service/setting/get',
  // 修改服务设置
  proxyServiceSettingSet: '/opt.api/proxy/service/setting/set',
  // 获取服务状态
  proxyServiceStatus: '/opt.api/proxy/service/status',
  // 启动服务
  proxyServiceStart: '/opt.api/proxy/service/start',
  // 停止服务
  proxyServiceStop: '/opt.api/proxy/service/stop',
  // 重启服务
  proxyServiceRestart: '/opt.api/proxy/service/restart',
  // 获取连接列表
  proxyConnList: '/opt.api/proxy/conn/list',
  // 获取服务器列表
  proxyServerList: '/opt.api/proxy/server/list',
  // 添加服务器
  proxyServerAdd: '/opt.api/proxy/server/add',
  // 删除服务器
  proxyServerDel: '/opt.api/proxy/server/del',
  // 修改服务器
  proxyServerMod: '/opt.api/proxy/server/mod',
  // 获取目标地址列表
  proxyTargetList: '/opt.api/proxy/target/list',
  // 添加目标地址
  proxyTargetAdd: '/opt.api/proxy/target/add',
  // 删除目标地址
  proxyTargetDel: '/opt.api/proxy/target/del',
  // 修改目标地址
  proxyTargetMod: '/opt.api/proxy/target/mod',

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
  nodeFwdItemDel: '/opt.api/cfg/node/fwd/item/del',

  // 系统服务-自定义
  // 获取服务配置信息
  svcCustomCfgInfoGet: '/opt.api/svc/custom/cfg/info/get',
  // 获取服务外壳程序信息
  svcCustomShellInfo: '/opt.api/svc/custom/shell/info',
  // 更新服务外壳程序
  svcCustomShellUpdate: '/opt.api/svc/custom/shell/update',
  // 获取服务列表
  svcCustomList: '/opt.api/svc/custom/list',
  // 添加服务
  svcCustomAdd: '/opt.api/svc/custom/add',
  // 更新服务
  svcCustomMod: '/opt.api/svc/custom/mod',
  // 下载服务: /opt.api/svc/custom/download/:name
  svcCustomDownload: '/opt.api/svc/custom/download/',
  // 删除服务
  svcCustomDel: '/opt.api/svc/custom/del',
  // 获取服务详细信息
  svcCustomDetail: '/opt.api/svc/custom/app/detail',
  // 安装服务
  svcCustomInstall: '/opt.api/svc/custom/install',
  // 卸载服务
  svcCustomUninstall: '/opt.api/svc/custom/uninstall',
  // 启动服务
  svcCustomStart: '/opt.api/svc/custom/start',
  // 停止服务
  svcCustomStop: '/opt.api/svc/custom/stop',
  // 重启服务
  svcCustomRestart: '/opt.api/svc/custom/restart',
  // 获取服务日志文件列表
  svcCustomLogFileList: '/opt.api/svc/custom/log/file/list',
  // 下载服务日志文件: /opt.api/svc/custom/log/file/download/:path
  svcCustomLogFileDownload: '/opt.api/svc/custom/log/file/download/',
  // 查看服务日志文件: /opt.api/svc/custom/log/file/content/:path
  svcCustomLogFileContent: '/opt.api/svc/custom/log/file/content/',

  // 系统服务-tomcat
  // 获取服务列表
  svcTomcatList: '/opt.api/svc/tomcat/svc/list',
  // 启动服务
  svcTomcatStart: '/opt.api/svc/tomcat/svc/start',
  // 停止服务
  svcTomcatStop: '/opt.api/svc/tomcat/svc/stop',
  // 重启服务
  svcTomcatRestart: '/opt.api/svc/tomcat/svc/restart',
  // 获取应用列表
  svcTomcatAppList: '/opt.api/svc/tomcat/app/list',
  // 下载应用程序: /opt.api/svc/tomcat/app/download/:name/:app
  svcTomcatAppDownload: '/opt.api/svc/tomcat/app/download/',
  // 上传应用程序
  svcTomcatAppMod: '/opt.api/svc/tomcat/app/mod',
  // 删除应用程序
  svcTomcatAppDel: '/opt.api/svc/tomcat/app/del',
  // 获取应用程序序详细信息
  svcTomcatAppDetail: '/opt.api/svc/tomcat/app/detail',
  // 获取配置列表
  svcTomcatCfgTree: '/opt.api/svc/tomcat/cfg/tree',
  // 新建应用配置文件夹
  svcTomcatCfgFolderAdd: '/opt.api/svc/tomcat/cfg/folder/add',
  // 上传应用配置
  svcTomcatCfgMod: '/opt.api/svc/tomcat/cfg/mod',
  // 删除应用配置
  svcTomcatCfgDel: '/opt.api/svc/tomcat/cfg/del',
  // 查看应用配置文件: /opt.api/svc/tomcat/cfg/file/content/:name/:path
  svcTomcatCfgView: '/opt.api/svc/tomcat/cfg/file/content/',
  // 下载应用配置文件: /opt.api/svc/tomcat/cfg/file/download/:name/:path
  svcTomcatCfgDownload: '/opt.api/svc/tomcat/cfg/file/download/',
  // 获取服务日志列表
  svcTomcatLogTree: '/opt.api/svc/tomcat/log/tree',
  // 查看服务日志文件: /opt.api/svc/tomcat/log/file/content/:name/:path
  svcTomcatLogView: '/opt.api/svc/tomcat/log/file/content/',
  // 下载服务日志文件: /opt.api/svc/tomcat/log/file/download/:name/:path
  svcTomcatLogDownload: '/opt.api/svc/tomcat/log/file/download/',
  // 删除服务日志
  svcTomcatLogDel: '/opt.api/svc/tomcat/log/del',

  // 系统服务-其他
  // 获取服务列表
  svcOtherList: '/opt.api/svc/other/svc/list',
  // 启动服务
  svcOtherStart: '/opt.api/svc/other/svc/start',
  // 停止服务
  svcOtherStop: '/opt.api/svc/other/svc/stop',
  // 重启服务
  svcOtherRestart: '/opt.api/svc/other/svc/restart',

  // 系统服务-nginx
  // 获取服务列表
  svcNginxList: '/opt.api/svc/nginx/svc/list',
  // 启动服务
  svcNginxStart: '/opt.api/svc/nginx/svc/start',
  // 停止服务
  svcNginxStop: '/opt.api/svc/nginx/svc/stop',
  // 重启服务
  svcNginxRestart: '/opt.api/svc/nginx/svc/restart',
  // 上传应用程序
  svcNginxAppMod: '/opt.api/svc/nginx/app/mod',
  // 获取站点程序详细信息
  svcNginxAppDetail: '/opt.api/svc/nginx/app/detail',

  // 系统服务-文件
  // 查看文件内容: /opt.api/svc/file/content/:path
  svcFileContent: '/opt.api/svc/file/content/',
  // 下载文件: /opt.api/svc/file/download/:path
  svcFileDownload: '/opt.api/svc/file/download/',
  // 上传文件
  svcFileMod: '/opt.api/svc/file/mod',
  // 删除文件
  svcFileDel: '/opt.api/svc/file/del'
}

export default {
  uris: uri
}
