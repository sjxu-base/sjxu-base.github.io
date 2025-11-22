---
title: "Vault：在 CICD 中管理密数据"
date: 2022-05-18
excerpt: "Why you should use vault in your office"
categories: ["CICD"]
tags: ["Vault", "Hashicorp"]
---

# 0x01 Vault 设计背景

## 什么是密数据

秘密数据是凭证列表，用于支持系统对用户身份验证或对其他系统进行授权，下面这些数据都属于密数据：

- Username and Password
- DB Credentials
- API Token
- TLS Certificates

## 密数据管理

密数据管理设施核心就是要为公司解决三个问题：

- List：谁能知道密数据
- Read：谁能使用密数据
- Rotate：如何轮换密数据

## 秘密扩散问题

密数据的安全风险来源于密数据使用过程中的**秘密扩散（Secret Sprawl）**，密数据通常需要在下面这些地方使用：

- 源代码，Source code
- 配置文件，Configuration
- 持续集成流程，Version Control，例如 Github

没有基础设施统一管理的密数据，往往非常难以审计和轮换，系统管理员很难搞清到底谁在用、怎么用，更难以为大量用户统一更新密数据。

## Vault 如何解决秘密扩散问题？

- 通过 **中心化** 解决秘密扩散问题，将所有密数据转移到中心化存储中；
- 使用 **保险库** 加密存储一切密数据，并在仅向**需要使用密数据的用户**传输密数据；
- 使用 **细粒度** 的访问控制（ACL），保证用户仅可访问允许访问的部分密数据；
- 支持 **跟踪审计** 功能，保证秘密使用的生命周期；

## 应用不可信任问题

在密数据使用过程中，应用程序通常是不能被信任的，我们的密数据可能会被在日志文件和输出中看到。

### Solution：动态密数据管理

- 生命周期：永久生命的 Credentials 一定会被泄露，所以一定要为每个 Credentials 制定非永久的生命周期；
- 密数据唯一性：每个凭据对每个客户端都是唯一的；
- 支持撤销：当密数据泄露发生时，系统应当可以隔离泄漏点并保持服务，保持撤销的影响范围可控；

## Vault 设计面临的问题

现实密数据使用中，我们应当假设应用程序是并不总能正确实现加密算法。

因而将直接加密密钥交给用户去操作并不是一个很合理的设计。

如果不把加密密钥交给用户，Vault 就需要处理如何加密的问题。

### Solution：加密即服务 Encrypt as Service

加密服务需要实现的 API 功能：

- Encrypt
- Decrypt
- Sign
- Verify

密钥管理的生命周期：

- Key versioning
- Key rotation
- Key decommissioning

# 0x02 Vault 的架构与实现

## 认证中心

**认证中心**用于为不同的用户提供不同的提供者，提供者可以提供应用程序或人的身份。常见的认证来源包括：

- EC2 VM
- AWS
- LDAP/AD
- K8S

The Notion of identity call

## 审计后台

**审计后台**要求系统可以将**密数据请求的响应审计**输出到外部系统，使我们能够跟踪谁做了什么。

- Splunk
- syslog

## 存储后端

**存储后端**用于提供需要提供高可用的持久化存储服务，保证可以应对部分数据丢失带来的威胁。

- RDBMS
- Consuls
- Spanner

## 密数据库 / 保险库

密数据库是真正存放密数据的地方，需要为用户提供访问不同秘密的途径。

它和普通数据库最大的区别在于它需要支持用户动态使用秘密功能。

- key-value: basic data like name and password
- database plugins: to offer complicated dynamic secret management
- RabbitMQ
- AWS short-lived credentials
- PKI: It can be nightmare to keeping go through the process of generating certificates. So we can defined some very short lived certificates, like short to 72 or 24 hours
- SSH

# 0x03 Vault 的高可用设计

Vault 集群中可以设置多个实例。系统将选举一个实例为领导节点。

在使用中，如果我们与非领导节点对话，我们的请求将被透明转发到当前存活的领导节点。

其他具有共享网络服务的多个实例，将作为网络中的 API 客户端向 API 提供支持。

Vault 集群只有一个公开 API。

---

## Reference

 - [Armon Dadgar 对 HashiCorp Vault 介绍](https://www.youtube.com/watch?v=VYfl-DpZ5wM&ab_channel=HashiCorp)
 - [Vault Documentation](https://developer.hashicorp.com/vault/docs)