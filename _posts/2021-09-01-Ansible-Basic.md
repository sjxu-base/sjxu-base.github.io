---
title: "Ansible Basic"
date: 2021-09-01
excerpt: "Ansible basic architecture"
categories: ["CICD"]
tags: ["Ansible"]
---

# 0x01 自动化运维应用场景

- 平台架构组建
- 日常运营保障
- 性能、效率优化

## 工具组件

| 任务           | 工具                                                             |
| -------------- | ---------------------------------------------------------------- |
| 代码管理 SCM   | Github \| GitLab \| SubVersion                                   |
| 构建工具       | maven \| gradle                                                  |
| 自动部署       | Capistrano \| CodeDeploy                                         |
| 持续集成 CI    | Jenkins \| Travis                                                |
| 配置管理       | Ansible \| Saltstack \| Chef \| Puppet                           |
| 容器           | Docker \| Podman \| LXC \| AWS                                   |
| 编排           | Kubernetes \| Core \| Mesos                                      |
| 服务注册与发现 | Zookeeper \| etcd \| Consul                                      |
| 日志管理       | ELK \| Logentries                                                |
| 系统监控       | Prometheus \| Zabbix \| Datadog \| Graphite \| Ganglia \| Nagios |
| 性能监控       | Splunk \| New Relic \| AppDynamics                               |
| 压力测试       | JMeter \| Blaze Meter \| loader.io                               |
| 应用服务器     | Tomcat \| JBoss                                                  |
| Web 服务器     | Nginx                                                            |
| 数据库         | ==MySQL== \| Oracle \| PostgreSQL \| mongoDB \| ==redis==        |
| 项目管理       | Jira \| Asana \| Taiga \| Trello \| Basecamp \| Pivotal Tracker  |

## 任务路线

【基础运维】IT 解决 :arrow_right:【监控运维】外包到机房:arrow_right:【系统运维】PXE 解决 Intake 问题 :arrow_right:【应用运维】Infra 主要职责:arrow_right:【自动化运维】Infra 主要职责 :arrow_right: 架构师 & CTO

## 上线流程

> 开发：Bug 修复、更新数据
>
> 测试：测试用例、性能评测、条件构造
>
> 准备：Review、合并分支、打包
>
> 预上线：配置修复、预发部署、发布验收
>
> 上线：环境准备、上线部署、配置修改、添加监控

## 常用 IaaS 解决方案

- Ansible：python，Agentless，适应于几百台
- Saltstack：python，agent，专有协议效率高。适用于上千台机器
- Puppt：ruby，重型、配置复杂、适合大型环境（tweet、fb 使用经验）
- Fabric：Python 编写，agentless
- Chef：ruby 编写，国内应用少

# 2. Ansible 架构

## Features

- 三个 Python 关键模块
  - Paramiko：基于 ssh 的远程控制模块
  - PyYAML
  - Jinja2：模板生成
- 部署简单、基于 python 和 SSH，agentless，无需代理，不依赖 PKI
- 幂等性，执行一遍与多遍，结果相同
- 支持 playbook 编排任务，多层解决方案 Role

## Architecture

### Intro

![ansible_arch_1](../assets/images/posts/20210901/ansible_arch_1.jpg)

![ansible_arch_2](../assets/images/posts/20210901/ansible_arch_2.jpg)

Ansible 的 API 调用者包括：

- Users 的手工调用
- Users 编写的 Playbook
- CMDB 配置数据库的调用
- 公有云及私有云中的调用

Ansible 自动化引擎内容包括：

- Inventory：Ansible 管理主机清单`/etc/ansible/hosts`
- Modules：Ansible 执行命令的功能模块，多为内置模块，亦可自定义
- Plugins：模块功能补充，如连接插件，循环插件，变量插件，过滤插件（不常用）
- API：供第三方使用的编程接口

Ansible 最终作用对象通常是 hosts 主机或者 Network 设备

运行 Ansible 位置一般被称作主控端、中控、master 或堡垒机

| Role          | Need                                     |
| ------------- | ---------------------------------------- |
| Master Server | Python>2.6                               |
|               | Windows 无法作为 master server 使用      |
| Slave Server  | Python<2.4 时需要 python-simplejson      |
|               | 开启 SELinux 时，需要`libselinux-python` |

### Files

- Ansible 主配置文件`/etc/ansible/ansible.cfg`
- Inventory 主机清单`/etc/ansible/hosts`
- Roles Collection`/etc/ansible/roles`

### Project

- Ansible 主程序`/usr/bin/ansible`
- Doc 调阅程序`/usr/bin/ansible-doc`
- Ansible 官网下载程序（ansible-galaxy）`/usr/bin.ansible-galaxy`
- 定制化任务`/usr/bin/ansible-playbook`
- 文件加密程序`/usr/bin/ansible-vault`
- Console 界面程序`/usr/bin/ansible-console`

# 3. Example

```shell
# use ping module on target server
ansible 192.168.1.101 -m ping

# define multiple servers as target(not ordered)
ansible 192.168.1.101,192.168.1.102 ping

# use all servers in inventory as target servers
ansible all ping
```

## Reference

- [Ansible and Ansible Architecture](https://medium.com/@madhukaudantha/ansible-and-ansible-architecture-2f309fe53fa)
- [The Ansible Architecture](https://www.ecanarys.com/Blogs/ArticleID/401/The-Ansible-Architecture)
- [Ansible 基础及企业应用](https://www.bilibili.com/video/BV1HZ4y1p7Bf)
