---
title: "企业级开源虚拟机解决方案：Proxmox 运维手册"
date: 2022-02-17
excerpt: "前司一直在使用 Proxmox 作为虚拟机解决方案，但随着线上压力逐渐增加，Proxmox 管理能力捉襟见肘，这篇博客结合官方资料和使用经验，总结下生产环境中 Proxmox 的运维经验以及最佳实践。"
categories: ["CloudNative"]
tags: ["Proxmox", "VM"]
published: false
---

# 0x01 使用背景

目前公司采用 pve 来做虚拟化解决方案，运行的虚拟机包括：

- dhcpd，用于办公室的网络分配
- consul，用于服务发现配置
- telegraf(depercated)

对于虚拟机的创建、删除，建议使用原生工具 proxmox-tool（基于 python 和 proxmox RESTful API 开发）完成。

首先，本地编译 proxmox-tool

```shell
make build proxmox_tool
```

构建完成后，在 `.bashrc` 中添加环境变量

```shell
# alias proxmox tool
alias proxmox-tool="~/work/ponyai/.sub-repos/make8-bin/common/tools/proxmox/proxmox_tool"
alias p-t="~/work/ponyai/.sub-repos/make8-bin/common/tools/proxmox/proxmox_tool"
```

# 0x02 日常维护

## VM 状态查询工具 pvesh

pvesh 是直接调用 pve API 的一种方法，通常包括 GET / DELETE / SET / LIST / USAGE 几种命令。

其中 GET / DELETE / SET 分别对应GET/DELETE/PUT三种HTTP请求方式

使用以下参数控制输出格式

- --human-readable \<boolean\>
- --noborder
- --noheader
- --output-format \<jsonnet \| json-pretty \| text \| yaml\>
- --quiet \<boolean\>

这里展示最常用的vm列表查询和vm状态查询API

```shell
# 查询 yz-proxmox-001 上所有存在的虚拟机，包括已关闭的虚拟机
sudo pvesh get /cluster/resources

# 查询 yz-proxmox-001 中vmid为9012的服务器当前状态
sudo pvesh get /nodes/yz-proxmox-001/qemu/9012/status/current
```