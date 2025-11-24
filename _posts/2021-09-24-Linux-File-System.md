---
title: "Linux File System"
date: 2021-09-24
excerpt: "Linux文件系统中的基础概念记录"
categories: ["Linux"]
tags: ["File System", "Linux"]
published: false
---

# 0x01 Linux 文件系统概念解析

## 数据概念解析 sector、block、group
## 磁盘分区方式：GPT 与 MBR
## 文件管理系统：从 `ext2` 到 `xfs`

# 0x02 常用文件系统工具与命令

## 1. 分区查看与修改

- 统计分区状态 `df`
- 查看分区信息 `dumpe2fs`
- 挂载分区 `mount/umount`
- 查看 ext2/3 文件系统参数 `tune2fs`
- 修改 block 信息 `lsblk` / `blkid` / `blockdev`
- 标定分区 `e2label`

## 2. 文件操作

- 查看空间占用 `du`
- 查看详细信息 `stat`
- 查找使用文件进程 `fuser`

## 3. 变更分区

- 格式化分区 `mkfs`、`mke2fs`
- 查看管理分区 `fdisk`
- 检查修复分区 `fsck` / `badblocks` / `filefrag`

---

## Reference

- [Linux inode详解](https://www.cnblogs.com/llife/p/11470668.html)
- [Linux存储相关命令](https://blog.liu-kevin.com/2020/11/01/linuxcun-chu-xiang-guan-ming-ling/)

