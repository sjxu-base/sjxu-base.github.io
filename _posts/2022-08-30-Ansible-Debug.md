---
title: "Ansible 进阶用法：debug 与 流程控制"
date: 2022-08-30
excerpt: "对于Ansible 测试工作中获得的经验做的一些总结，主要是对如何通过 debug 参数来提升测试效率，以及如何通过调整系统变量来指定测试的部分。"
categories: ["CICD"]
tags: ["Ansible", "CD"]
---

对于Ansible 测试工作中获得的经验做的一些总结，主要是对如何通过 debug 参数来提升测试效率，以及如何通过调整系统变量来指定测试的部分。

## 0x01 Debug 场景：测试 Playbook 中部分代码

当开发一个 Playbook 时，如果只想执行其中部分 Task。参考 [Ansible 中文权威指南](http://www.ansible.com.cn/docs/playbooks_startnstep.html)，可用下面三个参数来限制 Playbook 的执行流程。

1. `--start-at`：从指定任务开始执行
2. `tag`：指定需要测试的任务
3. `step`：逐步执行任务

可以参考下面代码设置脚本：

```shell
ansible-playbook -i $region_name -l $node_name /
  $playbook_name /
  --user $username /
  --ask-become-pass /
  --start-at=$task_name
```

## 0x02 根据系统变量来判断 Playbook 是否进行

当我们想设置对于某些服务器不执行某个Playbook中后续Task时，同时又不想让Playbook报错，根据 [Ansible 官方文档](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/meta_module.html)，可以使用 meta 模块的 end_host 设置来控制 Playbook 的执行流程。

```yaml
- name: Check bonding status
  meta: end_host
  when: '"bond0" in ansible_interfaces'
```

## 0x03 使用 ad-hoc 方式运行指定任务

[Ansible 官方文档](https://docs.ansible.com/ansible/latest/user_guide/intro_adhoc.html)中介绍了 ad-hoc 的使用方式。

```shell
ansible -i $region_name -l $node_name -m "setup" -a "filter=ansible_interfaces"

ansible -i $region_name -l $node_name -m "shell" -a "cmd='ping baidu.com'"
```

## 0x04 中间变量管理：`set_fact` 和 `var` 的区别

`var` 无法作为单独的 task 使用，而且和 `shell` 等命令使用不兼容，最好编写一个单独的 `set_fact` Task 来设定一些变量。

不过偶尔会出现 `set_fact` 定义的变量在使用时被定义为 UNDIFINE 的问题，往往是因为 `set_fact` 的参数中包含变量，导致在调用时还未赋值。这时候可以通过添加 `default`过滤器来设定默认值。

```yaml
- name: get interface info
  set_fact:
    interface_available: "{{ interface_alive.stdout | difference(basic_interfaces) }}"
    interface_number: "{{ interface_available | default([]) | count }}"
```

## 0x05 常用模块参考

### 执行命令类

- [shell](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/shell_module.html)
- [command](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/command_module.html)
- [debug](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/debug_module.html)

### 软件安装 & 提权

- [apt](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/apt_module.html)
- [become](https://docs.ansible.com/ansible/latest/user_guide/become.html)

### 变量声明

- [facts and magic variables](https://docs.ansible.com/ansible/latest/user_guide/playbooks_vars_facts.html)
- [Variables](https://docs.ansible.com/ansible/latest/user_guide/playbooks_variables.html)
  - [Scoping](https://docs.ansible.com/ansible/latest/user_guide/playbooks_variables.html#scoping-variables)
  - [precedence](https://docs.ansible.com/ansible/latest/user_guide/playbooks_variables.html#scoping-variables)

### 流程控制

- [when,condition](https://docs.ansible.com/ansible/latest/user_guide/playbooks_conditionals.html#conditionals-based-on-ansible-facts)
- [meta](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/meta_module.html)

---

## Reference

- [Jinja2 Filters Document](https://ansible-docs.readthedocs.io/zh/stable-2.0/rst/playbooks_filters.html#filters-often-used-with-conditionals)
- [Ansible 中的 Jinja2 Filter](https://www.cnblogs.com/ccbloom/p/15508645.html)
- [Ansible Return Value](https://docs.ansible.com/ansible/latest/reference_appendices/common_return_values.html)