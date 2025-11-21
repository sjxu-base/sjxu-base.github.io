---
title: "Serverless：新一代云原生架构方案"
date: 2021-08-05
excerpt: "面试京东云过程中，和京东基础架构团队负责人张金柱聊到了 Serverless 概念。后续上网找到了他在一次会议中对 Serverless 的介绍，依然感觉比较抽象，结合他的介绍和查到的一些相关资料，简单概述 Serverless 的概念，可预见的是落地依然很难。"
categories: ["CloudNative"]
tags: ["Serverless", "FaaS", "IaaS", "BaaS"]
---

# 0x01 从云原生说起

在进入 Serverless 时代之前，首先需要了解云原生 Cloud Native 的含义。

简单来说，Cloud Native 是 “一系列架构、研发流程、团队文化的**最佳实践组合**”。 

CloudNative 不是某一种技术或最佳架构方式，而是一些列技术的集合。

一般情况下，它与云强相关，包括公有云、私有云，包括京东、BAT 内部也有一些云的架构，云的基础设施，在此基础上搭建一整套研发流程和团队的工作方式。

## 云原生主要特点

- **弹性** 过去单体软件架构或私有机房时，流行托管或采购物理机，资源有限，随着业务流量增加，扩展性很差。在有云的情况下，利用其规模、基础设施更容易做到弹性扩容和缩容;
- **多租户**；
- **自服务** 用户可以像购买商品一样去通过 API 去购买云上的资源；
- **基于API协作** 如今云上也集成了 AI 等各种基于 API 方式提供的服务，大家可以更便捷地去使用；
- **分布式**；
- **反脆弱性**，互联网系统最担心宕机，而通过云的能力，我们可以引入高可用的架构、进行**破坏性测试**等；
- **按需申请和计费**，云把 IT 的基础设施商品化，让大家能够根据自己的需求去实时申请和释放；

## 云原生的实现方案

通过下图可以清楚了解到，在架构上云原生上是如何去落地的。

云提供敏捷开发基础设施与公共服务，配合微服务达到可扩展性高、可用性高、性能强、一致性的云原生架构。

![img](https://pic2.zhimg.com/v2-46ff8ceac29fb1bd3172a92e52bcf3c1_b.jpg)

根据各家大厂进化历史，云原生架构可以拆解多个阶段的进化过程：

1. 单体软件架构，一套系统解决了所有的问题，但这时它的优缺点都非常明显，虽然架构简单了，但同时也牵一发则动全身，如只想修改一点东西就导致整个服务停掉。
2. 微服务的架构，通过分布式带来的升级。主要是让大家做到关注点分离、减少团队沟通、提高效率。
3. 服务发现架构，根据 Gartner 最新报告，云资源管理运维的职位逐渐增加，其职责就是将各家的云的资源和服务通过 API 整合，提供给上层的业务开发者。
4. Serverless 架构，Serverless 架构的几个主要特色有
   - 免运维、甚至结合 AI 能力做运维的提升；
   - 数据库配置管理优化、使用 SQL 自动优化配置；
   - 弹性伸缩；
   - 按需付费；
   - 高度自动化和自愈能力等；

![img](https://pic2.zhimg.com/v2-fc4348f17942b4ffc25bea5b93e3d8a1_b.jpg)

# 0x02 What：Serverless 到底是什么？

## 与 FaaS 的区别

首先要明确两个易于混淆的概念，Serverless 并不是 传统云服务中的 函数即服务（FaaS, Function as a Service）。

目前各家公有云上都会有 FaaS 的产品，例如 AWS 的 Lambda，但其只是 Serverless 在计算资源层面上的抽象和实现。

Serverless 还有大量的服务，如 AWS 的 S3、京东的 KV 存储等。

Serverless 更突出的是可以给大家带来的是便捷申请的，按需付费的云服务。

![img](https://pic4.zhimg.com/v2-b71ed89cbd91ef022c65221c2d4c7697_b.jpg)

云服务是将大家对基础架构的需求抽象出来，由专业团队支持，并且整合数据来形成平台。

现在百花齐放的云服务，相当于给 Serverless 提供更多的基础支持。

Serverless 脱胎于云时代架构的思想，Serverless 是只属于云时代的。

云服务的基础设施层 IaaS 以为 Serverless 的“弹性”特征提供基础，保证弹性服务有了真正落地的可能。

不仅如此，回顾云计算的历程，从早期的虚拟化（网络、计算、存储）到 PaaS、SaaS，再到现在 Serverless 的出现，这是云计算技术发展的体现。

对于应用开发者而言，或许会更关注**开发模式是否有变更、效率是否有提高、成本是否有降低**。

特别强调的一点是，Serverless不等于FaaS，它提供的是弹性的计算服务，FaaS只是一种计算资源的抽象方式。

## Serverless 的落地场景

![img](https://pic2.zhimg.com/v2-a7abc1e34346b349233d3a6ecf8850fd_b.jpg)

Serverless的常见应用场景，可以分为三类，

### 后端应用场景

随着 App 移动开发的兴起，大量 Server 端和移动端已经做了很好的解耦，后端本质上是一个 Web 服务，包括 IoT 的后端。

比如智能家电，每时每刻都在产生数据，并将数据上传到云端。

所以对于海量物联网设备产生的海量数据，只有具备弹性能力的系统才能满足其需求。

### 事件驱动场景

这类场景包括文件处理、流数据处理、ETL 等。

它产生的事件是可以跟**函数服务**绑定的，完全可以由队列服务配合去实现。在 Serverless 的场景下，只要有一个事件，就可以去驱动任务的调起。

### AI 应用场景

举个真实的案例，有一家做智能客服的公司，虽然夜里咨询量不高，但也会配备一些运维同事值班，因为智能客服一旦出现问题，就需要有运维的干预。

而使用Serverless架构就可以把运维的事情完全托给云厂商，完全不用担心夜里扩容或故障报警。

![img](https://pic1.zhimg.com/v2-2ace0cdb66f82b8df194a51aec286e10_b.jpg)

值得注意的是，BaaS 和 PaaS 需要区别开。

BaaS 主要是以 API 的方式给用户提供商业服务，并且这些服务是一个用户架构里面通用的功能；PaaS 的概念很大，包括数据库、中间件、Web Server 等，都可以囊括进来。

因此，可以简单的理解为 BaaS 是 PaaS 的子集。

# 0x03 How：Serverless 如何落地？

目前，Serverless 还没有统一的技术标准和接口定义，但各大公司都在积极推动相关的规范和运营标准的统一化制定。

Serverless 可以明确的是会将基础架构系统开发为三个模块：客户端、服务端、数据。

所有的基础架构的业务都需要通过这三个角色去处理，包括购买服务、搜索组件、用户管理等。

下图展示了电商场景下，Serverless 的架构图：

![img](https://pic1.zhimg.com/v2-78843ae3a7fb5a8cd841df4b8e111fa0_b.jpg)

最后再说一说常见的Serverless的工具，主要包括公有云、私有云，以及对Serverless平台的包装工具。开发者可以基于Kubernetes搭建Serverless架构。

# 0x04 Serverless 的未来

随着 Serverless 概念的持续探索，Serverless 的发展也面临诸多挑战，主要包括以下四个方面：

- Serverless 缺乏时效性
  
  过去的 Web服务可能是一个后端，用户请求处理完了就可以返回；但在 Serverless 架构下，请求响应的路径变长，导致服务响应时间变慢。同时系统流程增加，debug 成本也会更高。

- 分布式难题
  
  在 Serverless 实践中，传统分布式系统相关的问题，例如选举、数据一致、事务管理等问题，目前依然没有很好的解决方案。导致传统的分布式架构很难迁移到 Serverless 平台。

- 安全问题
  
  用户思想上没有完全接受 Serverless 的概念。这一点主要体现在对安全的担忧，将自己的数据全都交出去，还是不能完全放心。此外，鉴于 Serverless 没有公认成熟开发框架或方法论，用户也无法做到完全不关心底层架构。

- IaaS 层的挑战
  
  在 Serverless 平台下，对底层基础架构的依赖性大大增加。可预见的是，谁家的容器启动速度越快，性能损耗越小，谁家的 Serverless 平台就会获得更好的效能。

但随着云基础设施的日臻成熟，Serverless 也将应该更好的发展。

除了上面的难点，下面几个常见的 Serverless 问题也欢迎大家在评论区探讨。

- 小程序的兴起是不是代表 Serverless 落地的好时代来了：纯服务端，零后端模式？
- AWS 在 Serverless 概念下做了哪些支持与平台建设？
- 如果一家企业的多平台 Serverless 平台 90% 时间都处于扩容状态，那他们是否还有价值去实践 Serverless？
- FaaS 是否可以取代 MicroService 模式？
- FaaS 在哪些场景不适用？

---

## Reference

- [Berkeley \| Understanding and Exploring Serverless Cloud Computing](https://www2.eecs.berkeley.edu/Pubs/TechRpts/2022/EECS-2022-273.pdf)
- [Berkeley \| Practical and Scalable Serverless Computing](https://www2.eecs.berkeley.edu/Pubs/TechRpts/2021/EECS-2021-238.pdf)
- [Berkeley \| A Berkeley View on Serverless Computing](https://www2.eecs.berkeley.edu/Pubs/TechRpts/2019/EECS-2019-3.pdf)
- [RedHat \| What is FaaS](https://www.redhat.com/zh/topics/cloud-native-apps/what-is-faas)
- [RedHat \| What is Serverless](https://www.redhat.com/zh/topics/cloud-native-apps/what-is-serverless)