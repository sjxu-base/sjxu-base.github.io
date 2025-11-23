---
title: "Synology：基于群晖构建的家庭影音平台"
date: 2025-11-24
excerpt: "今年 618 就到手的群晖 DS219+，迟迟未能上线，恰逢朋友给了个退役的投影仪，于是在家折腾起了自己的影音系统。"
categories: ["Misc"]
tags: ["NAS", "Synology"]
published: false
---

# 0x02 在云服务器构建个人摄影网站

在云服务器上部署个人摄影网站，在本地构建Gitlab，通过Github Action来完成持续部署。

[x] 研究github.io中更新部分
[ ] 优化github action集成流程
[ ] 使用cloudflare搭建图床优化image元素读取速度
[ ] 编写docker发布主站
[ ] 在NAS上搭建备用站点

# 0x03 使用爬虫构建投资面板

[ ] 启用阿里云上的InfluxDB服务
[ ] 将爬虫部署到E450中
[ ] 部署阿里云上metabase可视化
[ ] 编写docker镜像实现自动发布

# 0x04 构建支持混合云的高可用隧道

[ ] 在AWS主机搭建流量转发节点
[ ] 使用terraform实现ci
[ ] 调用ip资源池项目保证高可用

# 0x05 构建远程计算节点

构建私有云，将p340作为家中的计算节点，使用mac作为移动接入节点。

1. 数据备份
2. 安装Ubuntu系统
3. 构建多容器运行环境
4. 使用Teamviewer实现远程连接
5. 远程运行机器学习demo
6. 将小米电源接入家庭wifi实现远程开关机
7. （可选）测试耗能

# 0x06 在NAS中使用minikube搭建试验集群

[ ] NAS中部署proxmox cluster
[ ] 在pve中部署家用`isc-dhcp-serve`服务和系统镜像站
[ ] 使用腾讯云部署k8s集群
[ ] k8s进群中发布CovidView