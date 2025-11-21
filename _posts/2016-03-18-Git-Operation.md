---
title: "Git 入门：工作区概念 与 基础 Git 操作"
date: 2016-03-18
excerpt: "Just First Try on Git"
categories: ["CICD"]
tags: ["Git"]
toc: true
---

# 0x01 工作区与版本库

## Git 基本工作流程

Git 分为三个区：暂存区、工作区、版本库。

```shell
# 将所有修改加入暂存区
git add .
# 将修改提交到分支
git commit -m "description message"
# 查看工作区状态
git status
# 查看工作区与版本库差异
git diff HEAD -- filename
```

## 状态反馈类型

Changes not staged for commit：已修改但未暂存的文件

Untracked files：未跟踪的新建文件

Changes to be committed：已暂存待提交的文件

working directory clean：工作区干净，与版本库一致



# 0x02 工作区分支管理

## 基本分支操作

```shell
# 创建与切换分支
git checkout -b dev        # 创建并切换分支
git branch dev             # 创建分支
git checkout dev           # 切换分支

# 查看与合并
git branch                 # 查看当前分支（*标记当前分支）
git merge dev              # 将dev分支与当前分支合并

# 清理与查看
git branch -d dev          # 删除分支
git status                 # 查看合并冲突文件
git log                    # 查看分支合并情况

# 图形化查看分支合并
git log --graph --pretty=oneline --abbrev-commit
```

## 分支合并策略选项

- `--ff`：默认策略，尽可能使用快进合并
- `--no-ff`：总是创建合并提交
- `--ff-only`：仅允许快进合并，否则拒绝合并

## 工作现场保存与恢复

```shell
git stash                  # 保存工作现场
git stash apply            # 恢复工作现场
git stash drop             # 删除保存的现场
git stash pop              # 恢复并删除现场
git stash list             # 查看所有保存的现场
git stash apply stash@{0}  # 恢复指定版本的现场
```

# 远程协作开发

## Fork 工作流

```shell
# 设置原始代码库别名
git remote add upstream git://github.com/user_name/proj_name.git
git fetch upstream         # 获取原始代码库更新

# 同步与合并
git push origin master     # 提交到自己的代码库
git merge upstream/master  # 合并原始代码库更新
```

## 多账号管理

## 代码提交策略

个人开发流程中，没个新功能进行一次 commit，方便后续对每个 commit 进行单独测试。

每天结束前至少进行一次 push 操作，上传代码到远程服务器，保证所有提交都可以保留在版本库中。

对于离线开发场景：可以连续几天本地开发并 commit，上线后 push 所有修改，保持完整的开发历史记录。

但对于企业级别开发中，最好每次 commit 后，尽可能快完成 Push。

一方面便于使用线上 CI 工具进行代码监测，另一方面避免代码抢占现象，可能会引发代码冲突。

## Stash区使用场景

最常见的场景就是临时切换分支做Hotfix时候，未提交代码不足以作为一个commit，同时又不想丢弃：

```shell
# 在 dev 分支上
# ... 修改了一些文件 ...

# 此时需要切到 main 分支修复 Bug
git stash           # 将未完成的修改存入“储物柜”
git checkout main   # 现在工作目录是干净的了，可以顺利切换分支

# ... 在 main 分支上修复 Bug 并提交 ...

# 切换回原来的分支
git checkout dev
# 从“储物柜”取出之前暂存的修改，恢复工作现场
git stash pop
```
 