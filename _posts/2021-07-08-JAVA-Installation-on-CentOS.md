---
title: "CentOS 安装 JAVA 教程"
date: 2021-07-08
excerpt: ""
categories:
- Language
tags:
- JAVA
---

# 0x01 下载 & 检测

通过 `wget` 从 [Java官网](https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html) 下载安装包，并检测安装包大小。

```shell
# 自行更新 Java 官网地址
wget https://download.oracle.com/otn/java/jdk/8u171-b11/512cd62ec5174c3487ac17c61aaa89e8/jdk-8u171-linux-x64.tar.gz

# 应该是 183M 左右
ls -lht
```

创建安装目录（推荐使用`/usr/local/java/`），并将安装包解压进去

```shell
tar -zxvf jdk-8uxxx-linux-x64.tar.gz -C /usr/local/java/
```

# 0x02 修改环境变量

通过 `/etc/profile` 文件修改环境变量

```shell
export JAVA_HOME=/usr/local/java/jdk1.8.0_171
export JRE_HOME=${JAVA_HOME}/jre 
export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib 
export PATH=${JAVA_HOME}/bin:$PATH

# 生效新的环境变量并添加软连接
source /etc/profile
ln -s /usr/local/java/jdk1.8.0_xxx/bin/java /usr/bin/java
```

---

## Reference

- [CentOS 7 安装 JAVA环境（JDK 1.8）](https://www.cnblogs.com/stulzq/p/9286878.html)
- [CentOS 7 安装JDK 1.8 环境教程](https://timberkito.com/?p=12)
