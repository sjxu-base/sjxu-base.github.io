---
title: "Kubernetes 请求准入机制开发：基于 Pod 标签的请求准入系统"
date: 2024-10-21
categories: ["CloudNative"]
tags: ["Kubernetes", "Admission Webhook", "apiserver"]
published: false
mermaid: true
---

在 Kubernetes 日常使用中，确保只部署具有特定标签的 pod 是执行组织策略或资源分配策略的常见要求。

这里演示如何通过一个 Admission Webhook 来基于标签限制 Pod 创建请求。通过实现自定义外部配置文件，用户可以自定义允许启动哪些 Pod，确保只有设置了指定标签的 Pod 请求才可以部署，最终增强 Kubernetes 集群的安全性和一致性。

## 0x00 背景知识：Admission Webhook

### 什么是 Admission Controller

在 Kubernetes 执行用户请求的过程中，当请求到达 apiserver 后，经过对请求来源的认证和鉴权后，对请求内容本身还有一个验证阶段，包括 `Validating` 和 `Mutating` 两个阶段，通过验证后的请求才能被持久化到 etcd 当中。

所以通俗上理解，`Admission Controller` 就是在Kubernetes中变更持久化之前用于对请求进行拦截和修改的一种自动化工具。而在处理请求的两个阶段中

- `Mutating` 控制器在前，可以修改发送请求中的资源对象
- `Validating` 控制器在后，不会修改请求中的资源对象

但当两个控制器中任一个拒绝了请求，则整个请求会被直接拒绝掉。apiserver 可以选择将错误返回给用户，或者直接丢弃请求。

### 如何开启 Admission Webhook

为了支持 Admission Webhook，需要调整 apiserver 的门控特性（Feature Gateway）。

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    component: kube-apiserver
    tier: control-plane
  name: kube-apiserver-ydzs-master
  namespace: kube-system
...
spec:
  containers:
  - command:
    - kube-apiserver
    - --advertise-address=10.151.30.11
    - --allow-privileged=true
    - --authorization-mode=Node,RBAC
    - --client-ca-file=/etc/kubernetes/pki/ca.crt
    - --enable-admission-plugins=NodeRestriction,MutatingAdmissionWebhook,ValidatingAdmissionWebhook
```

上面的 `enable-admission-plugins` 配置中，如果包含 `MutatingAdmissionWebhook` 和 `ValidatingAdmissionWebhook` 两个插件，就代表 apiserver 已经开启了对 AdmissionWebhook 的支持。如果没有的，添加上这两个插件后，需要重启 apiserver。

```shell
kubectl api-versions | grep admission
# admissionregistration.k8s.io/v1
# TypeMeta
```

## 0x01 设置 Admission Webhook

## 0x02 构建 Webhook 响应服务器

### 设置请求筛选功能

### 构建服务器镜像

直接Pull example Image

### 部署服务器

CSR 资源及 Secret

### 更新 Admission Webhook

## 0x03 功能测试

## 0x04 通过外置文件动态更新配置

---

## Reference

- [Dynamic Admission Control](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/)
