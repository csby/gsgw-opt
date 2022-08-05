const ids = {
  // 用户登陆
  // data: {userAccount: "", userName: "", loginIp: "", loginTime: "2019-07-12 20:29:31"}
  wsOptUserLogin: 101,
  // 用户注销
  // data: null
  wsOptUserLogout: 102,
  // 用户上线
  // data: null
  wsOptUserOnline: 103,
  // 用户下线
  // data: null
  wsOptUserOffline: 104,

  // 上传并发布后台服务管理网站
  // data: {"id":"96d2197b51f14870b00a01f08b67ae63","name":"测试网站","url":"http://192.168.123.201:8085/apps/test/","root":"/home/dev/projects/go/tmp/site/apps/test","guid":"","version":"","deployTime":"2021-02-12 13:09:25"}
  wsSiteUpload: 110,
  // 根站点-上传文件
  // data: {"url":"http://192.168.123.201:8085/test.txt","name":"test.txt","uploadTime":"2021-02-22 14:10:20"}
  wsRootSiteUploadFile: 111,
  // 根站点-删除文件
  // data: {"name":"test.txt"}
  wsRootSiteDeleteFile: 112,

  // 节点转发开始
  // data: {"id": "", "time":"", "sourceNode": {}, "targetNode": {}, "targetHost": ""}
  wsNodeForwardTcpStart: 123,
  // 节点转发结束
  // data: "id"
  wsNodeForwardTcpEnd: 124,

  // 节点注册
  // data: {"id": "", "name":"", "instances": []}
  wsNodeRegister: 131,
  // 节点注销
  // data: {"id": ""}
  wsNodeRevoke: 132,
  // 节点修改
  // data: {"id": "", "displayName":"", "remark": ""}
  wsNodeModify: 133,
  // 节点实例上线
  // data: {"node": "", "id": "", "ip": "", "version": "", "time": "2022-01-17 13:05:54"}
  wsNodeInstanceOnline: 135,
  // 节点实例下线
  // data: {"node": "", "id": "", "ip": "", "version": "", "time": "2022-01-17 13:05:54"}
  wsNodeInstanceOffline: 136,

  // 节点在线状态改变
  // data: {"online": false}
  wsNodeOnlineStateChanged: 140,
  // 节点转发服务状态
  // data: {"running": false, "error": ""}
  wsNodeFwdInputListenSvcState: 141,
  // 节点转发项目状态
  // data: {"id": "", "running": false, "error": ""}
  wsNodeFwdInputListenItemState: 142,

  // 系统资源-网络
  // data: {"name":"eth0", "flow": {"time": "2022-01-05 12:19:42","bytesSpeedSent": 4230,"bytesSpeedRecv": 9164,"bytesSpeedSentText": "4.1Kbps","bytesSpeedRecvText": "8.9Kbps"}}
  wsNetworkThroughput: 211,

  // 系统资源-CPU
  // data: {"time": "2022-01-05 12:19:42","usage": 35.7}}
  wsCpuUsage: 212,

  // 系统资源-内存
  // data: {"time": "2022-01-05 12:19:42","usage": 50, "total": 17179869184, "used": 8589934592}}
  wsMemUsage: 213,

  // 反向代理服务状态信息
  // data: {"status":1,"startTime":null,"error":""}
  wsReviseProxyServiceStatus: 301,
  // 反向代理连接已打开
  // data:
  wsReviseProxyConnectionOpen: 302,
  // 反向代理连接已关闭
  // data:
  wsReviseProxyConnectionShut: 303,
  // 反向代理添加服务器
  // data: {"id":"6619850aec7340788f43eb6075d9dc91","name":"http","disable":false,"tls":false,"ip":"","port":"80"}
  wsReviseProxyServerAdd: 311,
  // 反向代理删除服务器
  // data: {"id":"b0962e13f8734cd9b844556ffd7706ac"}
  wsReviseProxyServerDel: 312,
  // 反向代理修改服务器
  // data: {"id":"6619850aec7340788f43eb6075d9dc91","name":"http","disable":true,"tls":true,"ip":"","port":"80"}
  wsReviseProxyServerMod: 313,
  // 反向代理添加目标地址
  // data: {"serverId":"99b1d5cfba734176a68f1521d704f022","target":{"id":"f7bc87bb3c3d4c0baa1f77028b8a2924","domain":"tt","ip":"22","port":"24","version":0,"disable":false}}
  wsReviseProxyTargetAdd: 321,
  // 反向代理删除目标地址
  // data: {"serverId":"99b1d5cfba734176a68f1521d704f022","targetId":"f7bc87bb3c3d4c0baa1f77028b8a2924"}
  wsReviseProxyTargetDel: 322,
  // 反向代理修改目标地址
  // data: {"serverId":"99b1d5cfba734176a68f1521d704f022","target":{"id":"76cacef32eac4ebe9d8aa575b28f409b","domain":"test.com","ip":"172.16.99.70","port":"443","version":1,"disable":false}}
  wsReviseProxyTargetMod: 323,
  // 反向代理修改目标地址
  // data: {"sourceId":"99b1d5cfba734176a68f1521d704f022","targetId":"", "addrId":"","alive":false,"count":0}}
  wsReviseProxyTargetStatusChanged: 331,

  // 服务状态改变
  // data: {"name":"example", "status": 0}
  wsSvcStatusChanged: 411,

  // 添加自定义服务
  // data: {"name":"example", "exec": "", "args": "", "systemName": "svc-example", "displayName": "自定义服务示例",  "description": "", "folder": "", "deployTime": "2021-12-29 08:52:53", "status": 0}
  wsCustomSvcAdded: 421,
  // 更新自定义服务
  // data: {"name":"example", "exec": "", "args": "", "systemName": "svc-example", "displayName": "自定义服务示例",  "description": "", "folder": "", "deployTime": "2021-12-29 08:52:53", "status": 0}
  wsCustomSvcUpdated: 422,
  // 删除自定义服务
  // data: {"name":"example"}
  wsCustomSvcDeleted: 423,

  // 添加tomcat应用
  // data: {"name":"example", "app": ""}
  wsTomcatAppAdded: 431,
  // 更新tomcat应用
  // data: {"name":"example", "app": ""}
  wsTomcatAppUpdated: 432,
  // 删除tomcat应用
  // data: {"name":"example", "app": ""}
  wsTomcatAppDeleted: 433,

  // 添加tomcat配置
  // data: {"name":"example"}
  wsTomcatCfgAdded: 41,
  // 更新tomcat配置
  // data: {"name":"example"}
  wsTomcatCfgUpdated: 442,
  // 删除tomcat配置
  // data: {"name":"example"}
  wsTomcatCfgDeleted: 443
}

export default {
  ids
}
