#!/usr/bin/env python3
import argparse
import datetime as _dt
import json
import re
from pathlib import Path
from typing import Any, Dict, List, Optional

import requests
from bs4 import BeautifulSoup


def _extract_next_data(html: str) -> Dict[str, Any]:
    """
    从页面 HTML 中提取 __NEXT_DATA__ 这段 JSON，
    LeetCode(CN) 的题目数据一般都在这里面。
    """
    m = re.search(
        r'<script id="__NEXT_DATA__" type="application/json">(.+?)</script>',
        html,
        re.DOTALL,
    )
    if not m:
        raise ValueError("Cannot find __NEXT_DATA__ script in page")
    return json.loads(m.group(1))


def _find_question_node(obj: Any) -> Optional[Dict[str, Any]]:
    """
    递归搜索 JSON，找到包含 questionId / questionFrontendId
    且含有 translatedContent/content 的那个节点。
    """
    if isinstance(obj, dict):
        # 判断这个 dict 是否像一个“题目对象”
        if (
            ("questionId" in obj or "questionFrontendId" in obj)
            and ("translatedContent" in obj or "content" in obj)
        ):
            return obj
        for v in obj.values():
            res = _find_question_node(v)
            if res is not None:
                return res
    elif isinstance(obj, list):
        for item in obj:
            res = _find_question_node(item)
            if res is not None:
                return res
    return None


def _split_description_and_example(translated_content: str) -> (List[str], List[str]):
    """
    粗略地从 translated_content 的 HTML 中，
    拆出【题目描述】和【第一个示例】。

    返回：(description_lines, example_lines)
    - description_lines: 题目描述（纯文本行）
    - example_lines: 示例部分（纯文本行）
    """
    soup = BeautifulSoup(translated_content, "html.parser")
    text = soup.get_text("\n")
    lines = [line.strip() for line in text.splitlines()]
    # 去掉空行
    lines = [ln for ln in lines if ln]

    example_idx = None
    for i, ln in enumerate(lines):
        if ln.startswith("示例") or ln.startswith("样例"):
            example_idx = i
            break

    if example_idx is None:
        # 找不到“示例”标记，那就把全体当成描述
        return lines, []

    desc_lines = lines[:example_idx]

    # 从第一个“示例”往后，截取若干行作为样例展示
    example_lines: List[str] = []
    for ln in lines[example_idx:]:
        # 到“提示/注意”等段落就停
        if ln.startswith("提示") or ln.startswith("注意"):
            break
        # 如果出现下一个“示例”，只用第一个示例
        if ln.startswith("示例") and example_lines:
            break
        if not ln:
            continue
        if ln.startswith("示例"):
            # 跳过“示例 1：”这行
            continue
        example_lines.append(ln)
        # 防止太长，通常几行就够了
        if len(example_lines) >= 6:
            break

    return desc_lines, example_lines


def generate_markdown(url: str, out_dir: Path) -> Path:
    """
    从 LeetCode 题目 URL 抓取题目信息，并在 out_dir 中生成 Markdown 文件。
    返回生成的文件路径。
    """
    resp = requests.get(url)
    resp.raise_for_status()
    html = resp.text

    next_data = _extract_next_data(html)
    qnode = _find_question_node(next_data)
    if qnode is None:
        raise ValueError("Cannot locate question data in __NEXT_DATA__ JSON")

    # 基本字段
    q_id = str(qnode.get("questionFrontendId") or qnode.get("questionId"))
    if not q_id:
        raise ValueError("Cannot determine question ID")

    title_cn = qnode.get("translatedTitle") or qnode.get("title") or ""
    translated_content = qnode.get("translatedContent") or qnode.get("content") or ""

    desc_lines, example_lines = _split_description_and_example(translated_content)

    today = _dt.date.today().strftime("%Y-%m-%d")
    filename = f"{today}-leetcode-{q_id}.md"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / filename

    # 标题中的链接：去掉最后的 /description/
    url_clean = re.sub(r"/description/?$", "/", url.rstrip("/"))

    front_matter_title = f"LC{q_id} {title_cn}".strip()
    permalink = f"/leetcode/{q_id}/"

    # 生成 Markdown 内容
    lines: List[str] = []
    # --- front matter ---
    lines.append("---")
    lines.append(f'title: "{front_matter_title}"')
    lines.append(f"date: {today}")
    lines.append('categories: ["Algo"]')
    lines.append('tags: ["Leetcode"]')
    lines.append(f"permalink: {permalink}")
    lines.append("---")
    lines.append("")
    # 题目部分
    lines.append(f"## 题目[{q_id}]({url_clean})")
    lines.append("")
    if desc_lines:
        # 用 4 空格缩进，和你给的格式一致
        for ln in desc_lines:
            lines.append(f"    {ln}")
        lines.append("")

    # 输入样例
    lines.append("## 输入样例")
    lines.append("")
    if example_lines:
        for ln in example_lines:
            lines.append(f"> {ln}")
        lines.append("")
    else:
        lines.append("> （原题目暂无示例或解析失败）")
        lines.append("")

    # 解析 & 题解骨架
    lines.append("## 解析")
    lines.append("")
    lines.append("## 题解")
    lines.append("")
    lines.append("```python")
    lines.append("")
    lines.append("```")
    lines.append("")

    out_path.write_text("\n".join(lines), encoding="utf-8")
    return out_path


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Fetch LeetCode CN problem and generate markdown post."
    )
    parser.add_argument(
        "url",
        help=(
            "LeetCode problem URL, e.g. "
            "https://leetcode.cn/problems/path-in-zigzag-labelled-binary-tree/description/"
        ),
    )
    parser.add_argument(
        "--out-dir",
        default="../posts",
        help="Output directory for markdown files (default: ../posts)",
    )
    args = parser.parse_args()

    out_dir = Path(args.out_dir).expanduser().resolve()
    out_path = generate_markdown(args.url, out_dir)
    print(f"Markdown generated at: {out_path}")


if __name__ == "__main__":
    main()
