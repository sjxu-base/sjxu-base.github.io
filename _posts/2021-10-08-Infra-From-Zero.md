---
title: "DevOps 指南：如何从 0 到 1 为一家AI公司打造开源基础设施解决方案"
date: 2021-10-08
excerpt: "总结一下职业生涯里看到的基础架构部门主要的工作，以及如何从零开始进行公司基础架构的演化"
categories: ["Cloud Native"]
tags: ["Infra", "ML"]
---

# 0x01 底层资源管理：设备入场阶段

## 硬件设备管理：ipmitool

## 设备管理：cmdb+Netbox

## 网络管理：dhcpd, NetBox、powerdns

## 自动装机系统：ipxe

## 虚拟机管理：Proxmox -> KubeVirt

## 跳板机：Jumpserver -> Teleport

# 0x02 基础服务搭建：裸机部署阶段

## 数据基础设施

### 关系数据库：PostgreSQL

### 对象存储：MinIO

### kv存储：Redis

## 代码基础设施

### 运行环境管理：Docker

### 代码管理：Gitea -> Github Enterprise

### 持续集成：Jenkins -> Github Action -> ArgoWorkflow

### 持续部署：Ansible -> ArgoCD

### 密数据管理：Vault

## 服务优化设施

### 消息队列：Kafka

### 制件管理：Artifactory

### 日志管理：Elasticsearch -> Loki

# 0x03 生产环境构建

随着产品迭代更新速度加快，资源消耗也愈发加大。随着机房容量扩大，就开始需要考虑部署一个规模化的，各项环节均可优化的生产环境。

## 资源管控：Kubernetes

## 负载均衡：Gimbal

## 服务发现：consul

## 监控：Grafana+Prometheus

- lxc vs kvm

## 工具

- docker

- k8s

- **proxmox**

- VMware & VisualBox

## 2. 存储资源管理：对象存储、SQL数据库

## 3. 网络资源管理：路由管理、服务发现

# 负载均衡 

## 概念

四层负载均衡 vs 七层负载均衡

## 工具

- LVS

- Nginx

# 安全Security

## 概念

- kerborse认证过程

## 工具

- jumpserver
- **teleport**
- **Vault**

# 监控和报警 Monitor and Alert

## 监控 Monitoring

- **prometheus**
- zabbix
- nagios
- ElasticSearch

## 报警 Alerting

- **AlertManager**

# 日志收集 Logging

- Logstash
- FileBeats
- **fluent-bit**

# 网络管理 Network

## DNS

- **powerdns**

## DHCP

- **dhcpd**
- dnsmasq

## VPN

- openvpn

# 装机 Netboot

- PXE
- iPXE
- **netboot.xyz**
- ubuntu preseeding
- centos kickstart

# 微服务 Micro Service

## 概念

- 服务网格 Service Mash
- 微服务Micro Service
- 服务发现: https://www.infoq.cn/article/lknumimtzy08qxqckqma

## 工具

- **consul**

- zookeeper

- Eureka

# CI/CD

- **Argo Server**
- **Jenkins**
- Git Action

# Data

## 关系型数据库 RDB

- **PostgreSQL**
- MySQL

## 非关系型数据库 NoSQL

- MongoDB

## 时序数据存储 Time Serial DB

- **TiDB**

## KV存储 Key-Value Storage

- **etcd**
- Redis

## 分布式文件系统 Distribution File System

- **HDFS**
- **ceph**

## 对象存储 Objective Storage

- **minio**

## CMDB(Configuration Managerment Database)

- netbox

# 发布管理 Repository Manager

## 概念

- apt
- dpkg

## 工具

- **Nexus**
- Maven
- apt-mirror

# 交叉交换设备 Switch

- Cisco IOS
- Cisco Nexus

# 基础架构平台

## 概念

- saltstack vs ansible https://www.educba.com/saltstack-vs-ansible/
- terraform: infrastructure as code

## 工具

- **terraform**
- **ansible**
- saltstack
- openstack