---
title: "Network 配置新实践：Network Manager"
date: 2021-09-23
excerpt: "使用 Network Manager 配置 CentOS 网络"
categories: ["OS"]
tags: ["Network", "Linux", "CentOS"]
toc: true
---

# 0x01 手工配置网络方案

日常运维操作过程里，启动新集群过程中，新机器的网卡配置是个非常**繁复且易错**的步骤。

小集群装机流程通常需要逐个手工配置 CentOS 网络文件 `ifcfg-eth0`。

```shell
vim /etc/sysconfig/network-scripts/ifcfg-eth0
```

Network Config 文件修改内容参考如下配置

```ini
  DEVICE = eth0               # 网卡设备名称   
  ONBOOT = yes                # 启动时是否激活 yes | no  
  BOOTPROTO = static          # 协议类型 dhcp bootp none  
  IPADDR = 192.168.1.90       # 网络IP地址  
  NETMASK = 255.255.255.0     # 网络子网地址  
  GATEWAY = 192.168.1.1       # 网关地址  
  BROADCAST = 192.168.1.255   # 广播地址  
  HWADDR = 00:0C:29:FE:1A:09  # 网卡MAC地址  
  TYPE = Ethernet             # 网卡类型为以太网
```

修改完成后，还需要重启 Network 服务使之生效。

```shell
  /etc/init.d/network reload
```

这种方式虽然直观，但在现代系统中存在几个明显问题：

- 配置文件分散，修改后容易遗漏；
- 无法快速查看当前连接状态；
- 不支持动态管理与多网卡优先级；
- 在云环境或容器节点上不便自动化。

因此，在 CentOS 7 及之后版本，NetworkManager 成为主流网络管理方案。

# 0x02 使用 NetworkManager 软件配置

## 1. NetworkManager 简介

NetworkManager 是 Red Hat 推出的统一网络配置与管理服务，用于简化 Linux 网络接口的配置和动态切换。

它在底层依然使用 /etc/sysconfig/network-scripts/ifcfg-* 文件，但提供了更高层次的管理命令与 DBus API。

相比传统 network 服务，NetworkManager 具有以下优点：

- 支持命令行、图形界面、API 多方式管理；
- 支持自动识别 **无线网络、VPN、桥接、Bond** 等复杂场景；
- 提供连接配置模板（Profile）；
- 支持热插拔与 DHCP 自动检测。

## 2. 基本命令工具 `nmcli`

NetworkManager 的命令行客户端是 `nmcli`，另有基于 curses 的交互式工具 `nmtui`。

```shell
# 查看设备状态
nmcli device status
# 显示所有保存的连接（profile）
nmcli connection show
# 启用名为 eth0 的配置
nmcli connection up eth0
# 停用 eth0
nmcli connection down eth0
# 修改静态 IP
nmcli connection modify eth0 ipv4.addresses 192.168.1.100/24 ipv4.gateway 192.168.1.1
# 使用 DHCP 模式自动获取 IP
nmcli connection modify eth0 ipv4.method auto
# 重载配置文件并立即生效
nmcli connection reload
# 删除连接配置 eth0 
nmcli connection delete eth0
```

## 3. 静态 IP 配置示例

假设我们要将网卡 `ens33` 配置为静态地址：

```shell
  nmcli connection add type ethernet con-name ens33 ifname ens33 \
  ipv4.addresses 192.168.1.90/24 \
  ipv4.gateway 192.168.1.1 \
  ipv4.dns 8.8.8.8 \
  ipv4.method manual \
  autoconnect yes
```

激活并检查 `ens33`：

```shell
  nmcli connection show ens33
  nmcli connection up ens33
```

这样配置会在后台自动生成 `/etc/NetworkManager/system-connections/ens33.nmconnection` 文件，格式为 `keyfile`，比旧的 `ifcfg` 文件更规范，也方便版本控制与导出。

## 4. 图形化与 TUI 配置 `nmtui`

在无桌面环境但需要交互式操作时，可使用 nmtui：

```shell
  nmtui
```

进入后可以选择：

- “Edit a connection” 修改现有配置；
- “Activate a connection” 启动/关闭网络；
- “Set system hostname” 修改主机名。

操作完成后，NetworkManager 会即时更新网络状态，无需重启系统。

## 5. NetworkManager 与传统配置文件的关系

在 CentOS 7 及之后版本中 `/etc/sysconfig/network-scripts/ifcfg-*` 仍然存在。

- NetworkManager 会自动读取和写入这些文件；
- 建议使用 `nmcli` 或 `nmtui` 管理配置，而不是直接编辑文件。

若需要兼容旧系统脚本，可通过以下方式启用传统网络管理：

```shell
  systemctl stop NetworkManager
  systemctl disable NetworkManager
  systemctl enable network
  systemctl start network
```

但这会失去动态管理与自动检测能力，除非特殊需求（如 PXE 环境），一般不推荐。

# 0x03 方案对比

传统 `ifcfg` 文件方式 与现代 NetworkManager 的主要区别如下：

<table style="width:100%; border-collapse:collapse; text-align:center;">
  <thead>
    <tr style="background-color:#f2f2f2;">
      <th style="padding:8px; border:1px solid #ddd;">对比维度</th>
      <th style="padding:8px; border:1px solid #ddd;">手工配置</th>
      <th style="padding:8px; border:1px solid #ddd;">NetworkManager</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding:8px; border:1px solid #ddd;">配置文件</td>
      <td style="padding:8px; border:1px solid #ddd;"><code>/etc/sysconfig/network-scripts/ifcfg-*</code></td>
      <td style="padding:8px; border:1px solid #ddd;"><code>/etc/NetworkManager/system-connections/*.nmconnection</code></td>
    </tr>
    <tr>
      <td style="padding:8px; border:1px solid #ddd;">管理方式</td>
      <td style="padding:8px; border:1px solid #ddd;">文本手动编辑</td>
      <td style="padding:8px; border:1px solid #ddd;"><code>nmcli</code> / <code>nmtui</code> / 图形界面</td>
    </tr>
    <tr>
      <td style="padding:8px; border:1px solid #ddd;">动态管理</td>
      <td style="padding:8px; border:1px solid #ddd;">不支持</td>
      <td style="padding:8px; border:1px solid #ddd;">支持热插拔与自动切换</td>
    </tr>
    <tr>
      <td style="padding:8px; border:1px solid #ddd;">自动化脚本</td>
      <td style="padding:8px; border:1px solid #ddd;">复杂且易错</td>
      <td style="padding:8px; border:1px solid #ddd;">提供统一命令接口，易于集成</td>
    </tr>
    <tr>
      <td style="padding:8px; border:1px solid #ddd;">适用场景</td>
      <td style="padding:8px; border:1px solid #ddd;">传统静态服务器</td>
      <td style="padding:8px; border:1px solid #ddd;">云主机 / 虚拟化环境 / 集群部署</td>
    </tr>
  </tbody>
</table>

在自动化部署与云原生集群中，NetworkManager 已成为配置网络的首选方式。

无论是通过脚本批量执行 nmcli 命令，还是直接封装为 Ansible 任务，都能显著提升网络配置的可维护性与稳定性。

---

## Reference

- [centos 配置 ifcfg-ethx](https://www.cnblogs.com/zonglonglong/p/12545400.html)
- [ArchLinuxC: NetworkManager](https://wiki.archlinuxcn.org/zh-sg/NetworkManager)
- [2.7. 使用 NetworkManager 和 sysconfig 文件](https://docs.redhat.com/zh-cn/documentation/red_hat_enterprise_linux/7/html/networking_guide/sec-using_networkmanager_with_sysconfig_files)
- [3.3. 使用 nmcli 配置 IP 网络](https://docs.redhat.com/zh-cn/documentation/red_hat_enterprise_linux/7/html/networking_guide/sec-configuring_ip_networking_with_nmcli)
- [nmcli-examples](https://networkmanager.dev/docs/api/latest/nmcli-examples.html)