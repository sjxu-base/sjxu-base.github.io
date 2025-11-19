---
title: "在 Windows 中部署 Docker Desktop 的 Issue"
date: 2021-06-28
excerpt: "关于Windows 下 Docker Desktop 后台运行出错的一点经验积累"
categories: ["CloudNative"]
tags: ["Docker"]
---

# 0x01 出错现象

打开软件时报错弹窗，运行命令时报错反馈

> error during connect: Get http://%2F%2F.%2Fpipe%2Fdocker_engine/v1.25/version: open //./pipe/docker_engine: The system cannot find the file
> specified. In the default daemon configuration on Windows, the docker client must be run elevated to connect. This error may also indicate that the docker daemon is not running.

> 连接时出现错误：获取http://.pipe.docker_engine/v1.25/version: open //./pipe/docker_engine：系统找不到文件
在指定。
> 在Windows上的默认守护进程配置中，必须运行提升的docker客户端才能进行连接。此错误也可能表明docker守护进程未运行。

# 0x02 官方文档

在Windows上的默认守护进程配置中，必须运行提升的 Docker 客户端才能连接 Docker 镜像站。

# 0x03 解决方案

将 Docker 运行环境从 Windows 容器中切换到 Linux 容器中：

- **Powershell Solution**:
  1. 使用 管理员模式 打开 PowerShell
  2. 运行指令: `& 'C:\Program Files\Docker\Docker\DockerCli.exe' -SwitchDaemon`

- **cmd Solution**:
  1. 使用 管理员模式 打开 cmd
  2. 运行指令: `"C:\Program Files\Docker\Docker\DockerCli.exe" -SwitchDaemon`