---
title: "Markdown的一些操作小技巧"
date: 2025-11-03
excerpt: "Markdown 小技巧以及一些编写博客的最佳实践"
categories: ["Language"]
tags: ["Markdown"]
mermaid: true
---

# 0x01 章节定位符

许多 Markdown 处理器支持标题的自定义ID，部分 Markdown 渲染器会自动添加它们。

添加自定义 ID 可以允许直接链接到标题并使用 CSS 对其进行修改。

要添加自定义标题ID，与标题相同的行上用大括号括起该自定义ID `{#user_defined_id}`。


# 0x02 图片样式规范

使用 Markdown 插入图片一般有两种方式

- Markdown 原生语法 `![]()`
- HTML 的 `<img>` 和 `<figure>`标签

但是前者无法定义图片大小和图片解释词，所以最好使用 HTML 进行标定。

- 修改图片大小

    ```html
    <img src="/images/rocks.jpg" width="200" height="100">
    ```

- 为图片添加注释

    ```html
    <figure style="text-align: center;">
        <img src="/images/20210802/netfilter.png" alt="20210802" width="500" height="150">
        <figcaption>A Netfilter Demo Pic</figcaption>
    </figure>
    ```
    
    实际效果如下

    <figure style="text-align: center;">
        <img src="/images/20210802/netfilter.png" alt="20210802" width="500" height="150">
        <figcaption>A Netfilter Demo Pic</figcaption>
    </figure>

## 在 Markdown 中使用 HTML 的最佳实践

1. 使用语义化的 HTML 标签
2. 添加样式增强
3. 确保内容的可访问性
4. 保持代码整洁和可维护

# 0x03 使用 FrontMatter

Front Matter 是位于文件顶部、用分隔符包围的元数据区块，用于存储文档的元信息。

很多静态网站生成器都支持 Front Matter：

- Jekyll (Ruby)
- Hugo (Go) - 支持 YAML、TOML、JSON 格式
- Next.js (React/JavaScript)
- Hexo (Node.js)
- GitBook
 
使用过程中，最佳实践是在分隔符后保持一行空行。

- 分行可以从而保持更好的可读性，清晰区分元数据和内容。
- 避免解析问题，例如在 Jekyll 中紧接 `---` 的内容会被认为是 FrontMatter 的一部分，并引发渲染错误。
- 符合 CommonMark 标准：空行有助于 Markdown 解析器正确识别段落。

# 0x04 使用 Mermaid 绘图



# 0x05 开启文章目录

# 0x06 本地测试

https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/creating-a-github-pages-site-with-jekyll