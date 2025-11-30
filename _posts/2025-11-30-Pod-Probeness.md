---
title: "k8s 中的探针问题"
date: 2025-11-30
excerpt: "之前写过pod的优雅关闭问题，其实同一篇文档里还提到了探针的定义"
categories: ["CloudNative"]
tags: ["Kubernetes", "Pod"]
toc: true
toc_sticky: true
---

之前写过pod的优雅关闭问题，其实同一篇文档里还提到了探针的定，Pod资源探针包括三种类型是

1. **存活探针**
2. **就绪探针**
3. **启动探针**

## 存活探针 LivenessProbe

- **用途**：**判断 Pod 是否“活着”**。如果探测失败，kubelet 会认为 Pod 已经挂掉，然后根据 `restartPolicy` 重启容器。
- **核心作用**：**挽救卡死或异常的应用**。它是应用的最后一道防线，通过重启来尝试恢复服务。
- **使用场景**：你的应用在运行过程中可能因为死锁、内存泄漏、外部依赖丢失等原因而停止响应，但它本身的进程还在。这时存活探针会失败，从而触发重启。

### 就绪探针 ReadinessProbe

- **目的**：**判断 Pod 是否“准备好”接收外部流量**。如果探测失败，该 Pod 会从与其关联的 Service 的负载均衡器中**被移除**，直到探测成功才会重新加入。
- **核心作用**：**保证流量的质量**。确保不会将请求发送给还没有完全启动、正在执行繁重任务或暂时无法处理请求的 Pod。
- **使用场景**：
  - **启动阶段**：应用可能需要加载大量数据或配置才能提供服务。
  - **运行阶段**：应用可能依赖一个临时不可用的数据库，此时它不应该处理请求。
  - **高负载阶段**：应用暂时处理不了更多请求。

### 3. 启动探针 StartupProbe

- **目的**：**判断容器应用是否已经启动完成**。在启动探针成功之前，所有其他探针（存活和就绪）都会被禁用。
- **核心作用**：**保护慢启动容器**。对于启动速度很慢的应用（如大型 Java 应用），如果使用存活探针，可能会因为它在启动超时时间内没有响应而不断被重启，陷入“启动->探测失败->重启->启动...”的死循环。启动探针解决了这个问题。
- **使用场景**：专门用于那些需要较长时间（例如超过 `initialDelaySeconds + failureThreshold * periodSeconds`）才能启动完毕的应用。

------

### 三者的区别与联系（对比表格）

| 特性               | 存活探针                        | 就绪探针                               | 启动探针                                     |
| :----------------- | :------------------------------ | :------------------------------------- | :------------------------------------------- |
| **探测失败的结果** | **重启 Pod**（根据重启策略）    | **将 Pod 从 Service Endpoints 中移除** | **杀死容器并根据策略重启**                   |
| **对流量的影响**   | 间接影响。重启期间 Pod 不可用。 | **直接影响**。流量不会被发送到该 Pod。 | 在启动成功前，Pod 不会接收任何流量。         |
| **主要目标**       | 恢复故障应用                    | 确保流量只发给健康的 Pod               | 保护慢启动容器                               |
| **禁用其他探针**   | 否                              | 否                                     | **是**（在它成功之前，存活和就绪探针不生效） |
| **配置建议**       | 相对敏感，快速发现无响应        | 相对保守，避免因临时波动被踢出         | 设置足够长的超时时间以覆盖启动过程           |
| **适用阶段**       | 整个 Pod 生命周期               | 整个 Pod 生命周期                      | **仅在容器启动阶段**                         |

------

### 一个生动的比喻：餐厅的后厨

你可以把一个 Kubernetes Service 想象成一家**餐厅的前台**，把 Pod 想象成**后厨的厨师**。

- **启动探针**：就像厨师**上班打卡**。在他打卡成功之前，餐厅经理（kubelet）不会给他分配任何任务，也不会检查他是否在工作（存活探针）或是否准备好做菜（就绪探针）。他可能还在换衣服、预热烤箱。
- **就绪探针**：就像厨师面前的**“准备就绪”指示灯**。如果厨师正在处理一个非常复杂的菜品，或者灶台暂时满了，他可以把灯按灭。前台（Service）看到灯灭了，就不会把新的点菜单（网络请求）分配给他。等他忙完了，再把灯按亮，重新接收订单。
- **存活探针**：就像餐厅经理**定期检查厨师是否还活着**（比如看他有没有心跳）。如果经理发现厨师突然晕倒了（应用崩溃），经理会立刻叫人（kubelet）把他抬出去，并换一个新的厨师进来（重启容器），以确保后厨整体能继续运作。

------

### 配置示例

在 Pod 的 YAML 文件中，你可以同时配置这三种探针。每种探针都有三种定义方式：`httpGet`、`tcpSocket` 和 `exec`。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app-pod
spec:
  containers:
  - name: my-app
    image: my-app:latest
    ports:
    - containerPort: 8080
    # 启动探针 - 使用 HTTP GET 请求
    startupProbe:
      httpGet:
        path: /health-startup
        port: 8080
      failureThreshold: 30 # 尝试 30 次
      periodSeconds: 10    # 每 10 秒一次 -> 总共允许 300 秒启动时间
    # 存活探针 - 使用 TCP 端口检查
    livenessProbe:
      tcpSocket:
        port: 8080
      initialDelaySeconds: 5 # 容器启动后 5 秒开始探测
      periodSeconds: 5       # 每 5 秒探测一次
    # 就绪探针 - 执行一个命令
    readinessProbe:
      exec:
        command:
        - cat
        - /tmp/healthy
      initialDelaySeconds: 5
      periodSeconds: 5
```

### 总结与最佳实践

1. **所有生产级应用都应该至少定义就绪和存活探针**。这是保证应用高可用的基石。
2. **启动探针不是必须的**，但如果你有启动很慢的旧应用，它将是救命稻草。
3. **探针检查的逻辑应该是轻量的、无副作用的**，并且不依赖外部服务（如数据库）。如果就绪探针因为数据库挂掉而失败，会导致所有 Pod 同时被踢出服务，引发雪崩效应。
4. **合理设置超时和阈值**，避免因网络抖动或临时高负载导致不必要的重启或流量切换。

通过组合使用这三种探针，你可以精确地控制 Pod 的生命周期和流量分配，从而构建出健壮、可自愈的微服务应用。

## 读取探针

读取 Kubernetes 探针的结果并不像直接查看日志那样直观，因为探针的执行和决策是由 kubelet 在节点上完成的。但是，我们有多种有效的方法来了解和诊断探针的状态。

以下是读取和分析探针结果的几种主要方法，从最简单到最详细：

### 方法一：使用 `kubectl describe` 命令（最直接）

这是最快速、最常用的方法，可以查看 Pod 当前状态和最近的事件，其中包含了探针失败的重要信息。

bash

```
kubectl describe pod <pod-name> -n <namespace>
```



在命令输出中，重点关注两个部分：

1. **`Containers` 部分**：
   这里会显示每个容器的**当前探针状态**。

   ```yaml
   Containers:
     my-app-container:
       Container ID:   docker://abc123...
       Image:          my-app:latest
       Image ID:       docker-pullable://my-app@sha256...
       Port:           8080/TCP
       Host Port:      0/TCP
       State:          Running
         Started:      Wed, 01 Jan 2023 12:00:00 +0800
       Ready:          True   # <--- 就绪探针的结果。True 表示通过，False 表示失败。
       Restart Count:  2      # <--- 如果这个数字频繁增加，很可能是存活探针失败导致的重启！
       Liveness:       http-get http://:8080/healthz delay=0s timeout=1s period=10s #success=1 #failure=3
       Readiness:      http-get http://:8080/ready delay=0s timeout=1s period=5s #success=1 #failure=3
       Startup:        http-get http://:8080/startup delay=0s timeout=1s period=10s #success=1 #failure=30
   ```

   

2. **`Events` 部分**：
   这里记录了 Pod 生命周期中的重要事件，**探针失败和容器重启都会在这里显示**。

   ```shell
   Events:
     Type     Reason     Age                   From               Message
     ----     ------     ----                  ----               -------
     Normal   Scheduled  5m                    default-scheduler  Successfully assigned default/my-app-pod to node-01
     Normal   Pulled     5m                    kubelet            Successfully pulled image "my-app:latest"
     Normal   Created    5m                    kubelet            Created container my-app-container
     Normal   Started    5m                    kubelet            Started container my-app-container
     Warning  Unhealthy  2m (x6 over 4m)       kubelet            Liveness probe failed: HTTP probe failed with statuscode: 500
     Normal   Killing    2m                    kubelet            Container my-app-container failed liveness probe, will be restarted
     Warning  Unhealthy  90s (x10 over 3m30s)  kubelet            Readiness probe failed: Get "http://10.1.0.25:8080/ready": context deadline exceeded (Client.Timeout exceeded while awaiting headers)
   ```

   **关键事件解读**：

   - `Liveness probe failed: ...`：存活探针失败的具体原因（如 HTTP 500、连接超时等）。
   - `Killing ... will be restarted`：kubelet 正在杀死并重启容器，这是存活探针失败的**直接后果**。
   - `Readiness probe failed: ...`：就绪探针失败，Pod 会被从 Service 端点中移除。

------

### 方法二：查看 Pod 状态（快速概览）

使用 `kubectl get pods` 可以快速查看 Pod 的总体状态，其中 `READY` 列直接反映了就绪探针的结果。

```bash
kubectl get pod <pod-name> -n <namespace>
# 输出示例
# NAME          READY   STATUS    RESTARTS   AGE
# my-app-pod    0/1     Running   5          10m
```

- **`READY` 列**： `0/1` 表示 Pod 内有 1 个容器，但有 0 个是就绪状态。这通常意味着**就绪探针失败了**。
- **`RESTARTS` 列**： 如果这个数字在不断增长，几乎可以肯定是**存活探针失败导致容器在不断重启**。
- **`STATUS` 列**： 如果是 `CrashLoopBackOff`，通常也与存活探针失败后的频繁重启有关。

------

### 方法三：查看 Kubelet 日志（最详细）

当 `describe` 的事件信息不足以诊断问题时，需要去节点上查看 kubelet 的详细日志。kubelet 会记录每次探针检查的详细过程。

**具体操作取决于你的系统配置：**

1. **如果使用 `journald`（大多数现代 Linux 发行版）**：

   bash

   ```shell
   # 首先找到 Pod 所在的节点
   kubectl get pod <pod-name> -o wide
   
   # 然后登录到该节点，查看 kubelet 日志
   journalctl -u kubelet -f --since "1 hour ago" | grep <pod-name>
   ```

2. **如果日志写在文件中（如 `/var/log/kubelet.log`）**：

   ```shell
   tail -f /var/log/kubelet.log | grep <pod-name>
   ```

**在日志中你会看到非常详细的探针执行记录**，例如：

```
Probe for pod-my-namespace_my-app-pod(abc123...) container "my-app-container" succeeded
Probe for pod-my-namespace_my-app-pod(abc123...) container "my-app-container" failed: HTTP probe failed with statuscode: 503
```

------

### 方法四：检查探针端点本身（排除法）

很多时候，探针失败不是因为 Pod 有问题，而是因为探针配置或端点本身有问题。

1. **进入 Pod 内部手动执行命令（针对 `exec` 探针）**：

   ```shell
   kubectl exec -it <pod-name> -- <command>
   # 例如，探针配置是 `cat /tmp/healthy`
   kubectl exec -it <pod-name> -- cat /tmp/healthy
   # 查看命令的退出码
   echo $?
   ```

   

2. **从集群内部访问 HTTP/TCP 端点（针对 `httpGet` 和 `tcpSocket` 探针）**：

   ```bash
   # 启动一个临时的调试 Pod，例如使用 busybox
   kubectl run -it --rm debug --image=busybox --restart=Never -- sh
   
   # 在 debug Pod 内部，尝试访问目标 Pod 的探针端点
   # 对于 HTTP 探针
   wget -O- http://<pod-ip>:<port>/<path>
   # 或者
   telnet <pod-ip> <port>
   ```

   

   *注意：你需要先用 `kubectl get pod -o wide` 获取 Pod 的 IP 地址。*

### 总结与工作流

当怀疑探针出现问题时，建议按照以下流程进行排查：

1. **快速定位**：使用 `kubectl get pods` 和 `kubectl describe pod` 查看 `READY` 状态、`RESTARTS` 次数和 `Events` 事件，确认是否是探针问题以及是哪种探针。
2. **初步诊断**：从 `Events` 中获取失败原因（如 HTTP 500、超时等）。
3. **深入排查**：
   - 如果是 **就绪探针** 失败，重点检查应用是否真的已经准备好（如依赖服务、初始化逻辑）。
   - 如果是 **存活探针** 失败导致重启，重点检查应用是否卡死、内存溢出或出现内部错误。
   - 如果是 **启动探针** 失败导致无法启动，检查应用启动是否太慢，或者启动脚本是否有问题。
4. **验证端点**：通过 `kubectl exec` 或启动临时 Pod 的方式，手动验证探针配置的端点是否按预期工作。
5. **查看详请**：如果以上步骤无法解决问题，去节点上查看 kubelet 的详细日志。

通过这套组合拳，你可以清晰地“读取”到探针的结果并快速定位根本原因。