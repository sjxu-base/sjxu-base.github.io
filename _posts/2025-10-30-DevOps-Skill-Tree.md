---
title: "DevOps技能树"
date: 2025-10-30
categories: ["CloudNative"]
tags: ["DevOps", "SRE"]
excerpt: "DevOps、SRE技能树"
toc: true
toc_sticky: true
---

进入基础架构行业工作四年了，每次面试难免都要回忆基础知识。

但 SRE、DevOps、IT 各个层级的内容相互覆盖，为了方便查缺补漏，就总结了这个知识树，也方便日后将新知识补充进来。

## Part A.基础知识

### A01.计算机网络

#### 基础概念：OSI网络模型

#### 网络协议

1. TCP 与 UDP
2. TCP 中的握手、离手概念、滑动窗口
3. HTTP 与 HTTPS

#### 网络诊断

1. Linux 网络诊断命令

2. Wireshark 抓包分析
3. 防火墙、SELinux设置

#### 网络服务

1. DNS 查询原理

2. SeLinuX、四层、七层路由

### A02.操作系统 / Linux

#### 进程管理

1. 进程的7个状态、进程调度、进程间通信、daemon进程

#### 内存管理：虚拟内存、内存分页与交换、内存应谁（mmap）、缓冲与缓存

#### 文件管理

1. FHS
2. 什么是inode&block
3. 文件类型
4. 挂载机制（mount\umount）

#### 容器原理

1. 容器的基本原理
   - namespace 隔离机制
   - cgroups 资源限制

2. 容器运行时原理

#### 性能调优

- 系统调优参数（sysctl）
- 内存回收机制
- I/O调度算法

#### 安全功能

1. 什么是 SELinux 和 AppArmor
2. 如何调取审计日志（auditd）
3. 系统加固原则

### A03.计算机组成原理

#### 系统引导

1. 什么是 BIOS/UEFI、Bootloader、Kernel、Init、Runlevel、systemd初始化系统
2. 内核机制：系统调用（syscall）、中断处理、模块加载与卸载

#### CPU & GPU

1. 如何计算 CPU 时钟频率
2. CPU 和 GPU区别

#### Memory

#### Disk

1. RAID 有哪几类？
2. 如何选择最合适的系统 RAID？

## Part B.硬件管理与系统管理（IT1 部分）

### B01.系统交付

#### 带外管理服务

1. ipmi 和 redfish 是什么?
2. 使用 ipmitool 远程获取系统信息

#### 系统引导服务

1. 系统应答文件 AutoInstall
2. 使用 netboot 根据 SN 号引导进入不同镜像
3. 对 dhcpd 服务进行 IaC 改造

#### 系统镜像管理

1. 如何更改 Linux 内核参数
2. 常见 Linux 内核调优参数
3. 使用 Packer 构建自动镜像打包服务

### B02.CMDB 支持

#### NetBox

## Part C.基础架构管理（DevOps 部分）

### C01.容器服务

#### Docker

1. 基础概念：cgroup、不可变交付、隔离依赖
2. 基础知识：
   - 什么是 DOCKER-CE
   - 基本 Docker 容器运行命令 `docker run`
   - 编写 Dockerfile
   - Image 管理：构建、推送、版本控制
   - Docker 网络管理：bridge、host、overlay、各级别通信模型
   - 存储管理：储存外挂、文件权限
3. 进阶知识：
   - 为服务编写 docker-composer
   - docker 镜像构建阶段

#### Kubernetes

1. 基础资源定义 Pod/Deployment/Service/Ingress资源管理
2. Ingress服务发现与负载均衡
3. 配置管理（ConfigMap/Secret）
存储管理（PV/PVC/StorageClass）
    - HPA/VPA自动扩缩容
    - 网络策略（NetworkPolicy）
    - 集群运维（备份恢复、升级）
    - 本地实践：
        - minikube
        - microk8s
        - k3s
    - Helm/Kuberlizer

### C02.虚拟机服务

#### Proxmox

- 虚拟机生命周期管理
- 集群管理与高可用
- 存储配置（LVM、Ceph）
- 备份与恢复策略
- 安全隔离设计

### C03.云原生服务

#### Openstack

1. Openstack 基本概念与核心组件：`Nova`|`Neutron`|`Cinder`
2. 如何实现云资源管理
3. 如何实现多租户隔离
4. 如何实现计量与计费

### C04.CICD

#### CI

- Jenkins
- ArgoWorkflow
- Gitea
- GithubAction

#### CD

- ArgoCD
- FluxCD

#### CICD 完整技术方案

- Jenkins => Docker => Shell
- Gitea => Python => Shell
- Gitlab CI/CD => Docker|Kubernetes => Shell

### C05.IaC 相关

#### Terraform

#### Ansible

1. Ansible 基础概念：幂等性、模块、Playbook
2. Ansible 常用模块
3. Ansible 调试与输出
4. Ansible Tower

#### jsonnet 开发

### C06.监控与告警系统

#### 基础知识

- Prometheus
- Grafana
- Alertmanager
- APM+Agent探针

#### 可观测性：日志、指标、追踪

- Elasticsearch
  - 集群规划与容量管理
  - 索引生命周期管理
  - 性能调优
  - 安全配置
- 日志收集
  - Fluentd/Fluent Bit：日志采集与转发
  - Logstash：日志处理管道
  - Loki：轻量级日志聚合
- 链路追踪
  - Jaeger：分布式追踪
  - Zipkin：调用链分析
  - OpenTelemetry：可观测性标准
- 指标监控
  - VictoriaMetrics：高性能时序数据库
  - InfluxDB：时间序列数据存储
- Istio
  - 什么是 Service Mesh 服务网格
  - [Istio 是什么？](https://istio.io/latest/zh/docs/overview/what-is-istio/)
  - Istio 功能：服务发现、负载均衡、故障恢复、度量和监控等
  - 使用 Istio 支持更复杂的运维需求：AB 测试、金丝雀发布、速率限制、访问控制和端到端认证。
  - API 流量管控
  - 多版本API分流

### C07.数据库服务

#### 数据库基础概念

- ACID特性
- 事务隔离级别
- 索引原理与优化
- 查询执行计划
- 备份恢复策略
- 高可用方案（主从、集群）

#### MySQL

#### MongoDB

### C08.KV 存储服务

#### 一致性基础知识

1. 什么是 Raft 算法
2. 脑裂问题与处理方案

#### Redis

#### etcd

### C09.消息队列

#### Kafka

#### RabbitMQ

### C10.对象存储及文件存储

#### Ceph

#### MinIO

#### NFS服务

#### CephFS

## Part D.公有云服务（DevOps 与 SRE 重合部分）

### D01.AWS云服务

## Part E.稳定性工程（SRE 部分）

### E01.系统指标

1. 什么是 SLO/SLA/SLI？
2. 系统占用率评估

### E02.服务发布 SOP

1. 使用 Apach Benchmark 进行系统容量测算
2. 使用 metric-server 构建系统监控指标
3. 使用 ClusterAutoscaler + HPA 设置自动扩容方案
4. 使用 Route53 + ALB + NLB 设置蓝绿发布与灰度发布
5. 服务监控环节：服务、k8s、基础架构

### E03.高可用系统构建

1. 自动扩容设计

### E04.容灾演练与方案预设

### E05.系统成本审计

## Part F.编程语言

### F01.Shell 脚本开发

#### 文本处理工具

- gawk
- sed
- grep

#### 文件处理

- 目录处理：ls\cat\find\rm\mv\touch\mkdir
- 文件比较：diff\cmp
- 压缩解压：tar\gzip\zip

#### 权限管理

- chmod\chown\chgrp
- 文件权限（rwx）、特殊权限（suid\sgid\sticky）
- useradd\groupadd\passwd

#### IO 处理

- 管道、重定向、stdin
- 参数传递：xargs
- 脚本调试：set\trap
- 脚本传参：$0、$1、$*、$@

#### 网络连接

- 基础诊断：telnet/ssh/ping/traceroute
- 文件传输：scp/rsync/wget/curl
- 内网穿透：frp/ngrok
- 防火墙：iptables/firewalld/ufw
- 网络配置：ifconfig/ip/route

#### 系统监控

- 进程监控：top/htop/ps/pstree/perf
  - [Linux Perf 性能分析工具及火焰图浅析](https://zhuanlan.zhihu.com/p/54276509)
- 性能分析：vmstat/iostat/mpstat
- 内存监控：free/smaps
- 磁盘监控：df/du/lsblk/lsof
- 网络监控：netstat/ss/iftop

#### 系统服务

- systemctl：服务启停、状态查看、开机自启
- journalctl：日志查看与分析
- cron：定时任务管理

#### 安装包管理

- apt 与 dpkg：Debian/Ubuntu
- yum 与 rpm： CentOS/RHEL

### F02.Python 开发

### F03.Golang 开发

## Part G.算法

### G01.数据结构基础

#### 链表

1. 使用 Python 快速构建链表

#### 树

1. 使用平衡二叉树、二叉搜索树
2. 构建 AVL 与 红黑树

#### 队列

1. LRU 算法实现（LFU、FIFO 算法）

### G02.算法类型

#### 浮点数

#### 字符串

#### 双指针

1. 典型双指针：接雨水

#### 动态规划

1. 动态规划基础思路
2. 背包问题：背包九讲 与 打家劫舍

#### 深搜 与 广搜

#### 贪心算法

1. 贪心算法与动态搜索的区别

#### 线段树

#### 启发式搜索
