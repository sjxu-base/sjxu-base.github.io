---
title: "Proxmox 运维手册"
date: 2022-02-17
excerpt: "之前公司一直在使用 Proxmox 作为虚拟机解决方案，但 Proxmox 单薄的管理能力，实际上在国外一直是作为家用级别在使用。这里结合公司的用法，总结一下日常对 Proxmox 的运维经验。"
categories: ["CloudNative"]
tags: ["Proxmox"]
---

# 0x01 使用情况
目前pony采用pve来做虚拟化，主要运行的虚拟机包括

- dhcp，用于办公室的网络分配
- consul
- telegraf(depercated)

对于虚拟机的创建、删除，建议使用内部工具proxmox-tool（基于python和proxmox RESTful API开发）完成

首先，编译proxmox-tool

```shell
make build proxmox_tool
```

之后，在.bashrc中添加命名

```shell
# alias proxmox tool
alias proxmox-tool="/home/{{ username }}/work/ponyai/.sub-repos/make8-bin/common/tools/proxmox/proxmox_tool"
alias p-t="/home/sitong/work/ponyai/.sub-repos/make8-bin/common/tools/proxmox/proxmox_tool"
```

## Topic-A VM Status Check

### Option-A A Proxmox Tool: pvesh

pvesh是直接调用pve API的一种方法，通常包括 get/delete/ls/usage/set五种方法，其中get/delege/set分别对应GET/DELETE/PUT三种HTTP请求方式

使用以下参数控制输出格式

- --human-readable \<boolean\>
- --noborder
- --noheader
- --output-format \<jsonnet \| json-pretty \| text \| yaml\>
- --quiet \<boolean\>

这里展示最常用的vm列表查询和vm状态查询API

```shell
# 查询yz-proxmox-001上所有存在的虚拟机，包括已关闭的虚拟机
sudo pvesh get /cluster/resources

# 查询yz-proxmox-001中vmid为9012的服务器当前状态
sudo pvesh get /nodes/yz-proxmox-001/qemu/9012/status/current
```