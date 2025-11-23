---
title: "Linux 故障排查小节"
date: 2021-06-25
excerpt: "简单总结下在 Linux 环境中常用的系统监控命令与监控工具，帮助全面了解如何监控和分析系统性能，确保服务器的稳定运行。重点讨论磁盘、内存、CPU以及网络的监控工具和方法。"
categories: ["OS"]
tags: ["Linux", "Monitoring", "Debug"]
published: false
---

# 0x01 磁盘监控：iostat/df/du/fdisk

## 1. IO 状态监测 `iostat`

iostat 主要用于监控系统设备的 IO 负载情况，iostat 首次运行时显示自系统启动开始的各项统计信息，之后运行 iostat 将显示自上次运行该命令以后的统计信息。

iostat 的特点是汇报磁盘活动统计情况，同时也会汇报出 CPU 使用情况。

**注意**：*iostat 的 CPU 统计数据，是使用**所有处理器之间的平均值**在系统范围内计算的*。

所以 iostat 命令的弱点就是不能对某个进程进行深入分析，仅**对系统的整体情况进行分析**。

`iostat` 命令可以查看两项内容：

-  CPU 状态统计信息，使用 `iostat -c` 即可只显示 CPU 部分信息
-  设备读写磁盘信息，使用 `iostat -d` 即可只显示 Device 部分信息。

### 使用技巧

```shell
iostat [ -c ] [ -d ] [ -h ] [ -k | -m ] [ -N ] [ -t ] [ -V ] [ -x ] [ -y ] [ -z ]
	   [ -j  {  ID  | LABEL | PATH | UUID | ... } ]
	   [ [ -T ] -g group_name ]
	   [ -p [device [,...] | ALL ] ]
	   [ device [...] | ALL ] 
	   [ interval [ count ] ]

# 查看指定设备信息：查看sda/sdb写入情况
iostat -d sda sdb

# 查看详细信息：查看完成sda的io状态
iostat -x -d sda

# 指定输出频率，每2秒输出一次sda状态，一共输出3次
iostat 2 3 -d sda
```

## 分析方法：仅关注设备IO状态分析

1. 设备表项分析
   - Device：设备名称，通常在/dev目录中可找到
   - tps：每秒的磁盘传输次数
   - Blk_reads/s / Blk_wrtn/s：设备每秒的读写数据量
   - Blk_read / Blk_wrtn：设备的总读写数据量
   - rrqm/s / wrqm/s：每秒被合并的读写请求数
   - r/s / w/s：每秒从设备读写的数据量
   - rsec/s / wsec/s：每秒读写的扇区数
   - avgrq-sz：平均请求扇区的大小
   - avgqu-sz：平均请求队列长度，较短的队列长度代表更好的性能
   - await：每个IO请求的平均处理时间
   - r_await / w_await：读写请求的平均响应时间
   - svctm：平均每次设备I/O操作的服务时间（以毫秒为单位）
   - %util：设备处理I/O时间占总时间的比例，反映设备的繁忙程度

## 2.磁盘容量 `du/df`

## 3. 文件系统 `fdisk`

# 0x02 内存监控：top/free/vmstat

## 1. 查看内存使用情况 top


# 0x03 CPU监控：top/mpstat

CPU是系统最重要的硬件之一，监控CPU的使用情况可以帮助识别性能瓶颈。

## 1. 查看进程状态 top

top 是 Linux 中最常用的实时系统监控工具之一。

运行原理是通过实施获取 `/proc` 下所有进程信息，计算 CPU 和 Memeory 使用率。



### 使用技巧

top第一部分信息：

```shell
Processes: 517 total, 3 running, 514 sleeping, 4565 threads  15:33:59
Load Avg: 2.10, 2.68, 2.94 
CPU usage: 9.49% user, 5.60% sys, 84.90% idle
SharedLibs: 428M resident, 83M data, 91M linkedit.
MemRegions: 1385821 total, 4190M resident, 152M private, 1970M shared.
PhysMem: 15G used (2530M wired, 5690M compressor), 95M unused.
VM: 328T vsize, 4272M framework vsize, 2889715(0) swapins, 4274768(0) swapouts.
Networks: packets: 57271428/49G in, 60182957/65G out.
Disks: 73703981/1713G read, 51562019/632G written.
```



top 第二部分信息

```shell
PID    COMMAND      %CPU TIME     #TH    #WQ  #PORTS MEM    PURG   CMPRS  PGRP  PPID  STATE    BOOSTS                 %CPU_ME %CPU_OTHRS UID  FAULTS
40761  Electron     47.7 40:21.68 47     2    1348-  138M-  0B     51M-   40761 1     sleeping *0-[9349]              0.41404 1.00424    501  7643303+
373    WindowServer 31.0 24:38:00 25     6    5169   1350M+ 16M    529M-  373   1     sleeping *0[1]                  3.30488 0.84863    88   212539652+
0      kernel_task  13.7 18:07:10 623/10 0    0      67M+   0B     0B     0     0     running   0[0]                  0.00000 0.00000    0    42955
54288  Code Helper  9.5  03:48.93 22     1    264+   239M-  0B     42M    40761 40761 sleeping *0[5]                  0.00000 0.00000    501  639306+
12609  top          8.2  00:03.93 1/1    0    30     6561K  0B     0B     12609 96690 running  *0[1]                  0.00000 0.00000    0    16228+
52481  WeChat       6.7  07:33.17 53     5    1385-  528M-  0B     407M-  52481 1     sleeping *0[1042]               0.22716 1.25726    501  1899020+
```

%CPU：每个进程所使用的CPU百分比。

%MEM：每个进程所使用的内存百分比。

## 2. 查看多核信息 mpstat

mpstat 用于显示每个CPU的使用情况。它比top更侧重于多核处理器的监控，能够提供每个处理器的独立信息。

尤其适用于处理 **CPU载荷不均衡** 和 **CPU异常中断** 相关问题。

### 使用技巧

最常见的就是**指定间隔、次数**来统计**指定内核**的信息（使用 `-P` 指定统计哪个核）。

如无指定，则统计所有内核从开机以来的平均信息。

```shell
mpstat [ -A ] [ --dec={ 0 | 1 | 2 } ] [ -H ] [ -n ] [ -U ] [ -u ]
       [ -T ] [ -V ] [ -I { keyword[,...] | ALL } ] [ -o JSON ]
	   [ -N { node_list | ALL } ]
	   [ -P { cpu_list | ALL } ] 
	   [ interval [ count ] ]

# 每 2 秒统计一次所有内核的全局信息，统计 5 次
mpstat 2 5

# 每 2 秒统计一次各个内核的信息，统计 5 次
mpstat -P ALL 2 5
```

# 0x04 网络监控：ifstat/netstat/ss

## 1. 流量统计 `ifstat`

## 2. 查看连接、路由表、接口 `netstat`

## 3. 精确网络路由信息 `ss`

---

## Reference

- [Linux iostat 命令](https://www.cnblogs.com/sparkdev/p/10427049.html)
- [深入理解iostat](https://bean-li.github.io/dive-into-iostat/)
- [mpstat(1) — Linux manual page](https://man7.org/linux/man-pages/man1/mpstat.1.html#top_of_page)
- [Linux CPU实时监控mpstat命令详解](https://www.cnblogs.com/ggjucheng/archive/2013/01/13/2858775.html)
