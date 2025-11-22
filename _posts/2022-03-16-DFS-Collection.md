---
title: "算法练习：深度优先搜索 DFS 合集"
date: 2022-03-16
excerpt: "关于模拟的五道题，尤其注意回溯和深度搜索的使用"
categories: ["Algorithm"]
tags: ["Leetcode", "DFS"]
toc: true
---

# 0x01 [LC37](https://leetcode-cn.com/problems/sudoku-solver/)｜解数独

## 题目

    编写一个程序，通过填充空格来解决数独问题。
    数独的解法需 遵循如下规则：

    1. 数字 1-9 在每一行只能出现一次。
    2. 数字 1-9 在每一列只能出现一次。
    3. 数字 1-9 在每一个以粗实线分隔的 3x3 宫内只能出现一次。（请参考示例图）

    数独部分空格内已填入了数字，空白格用 '.' 表示。

## 测试用例

    输入：board = [
        ["5","3",".",".","7",".",".",".","."],
        ["6",".",".","1","9","5",".",".","."],
        [".","9","8",".",".",".",".","6","."],
        ["8",".",".",".","6",".",".",".","3"],
        ["4",".",".","8",".","3",".",".","1"],
        ["7",".",".",".","2",".",".",".","6"],
        [".","6",".",".",".",".","2","8","."],
        [".",".",".","4","1","9",".",".","5"],
        [".",".",".",".","8",".",".","7","9"]]

    输出：result = [
        ["5","3","4","6","7","8","9","1","2"],
        ["6","7","2","1","9","5","3","4","8"],
        ["1","9","8","3","4","2","5","6","7"],
        ["8","5","9","7","6","1","4","2","3"],
        ["4","2","6","8","5","3","7","9","1"],
        ["7","1","3","9","2","4","8","5","6"],
        ["9","6","1","5","3","7","2","8","4"],
        ["2","8","7","4","1","9","6","3","5"],
        ["3","4","5","2","8","6","1","7","9"]]

    备注：题目保证每个数独仅有唯一解

## 解析

爆搜，但是比较 tricky 的地方在于行、列、块中出现数字的记录方式。

如果为了进一步压缩空间，可以使用一个二进制数压缩对应记录。

实现时候容易卡住的地方，在于**回溯终点的处理**以及**函数返回**的位置。

## 题解

```python
class Solution:
    def solveSudoku(self, board: List[List[str]]) -> None:
        """
        Do not return anything, modify board in-place instead.
        """
        line=[[False]*9 for _ in range(9)]
        column=[[False]*9 for _ in range(9)]
        cell=[[[False]*9 for _a in range(3)] for _b in range(3)]
        space=[]
        valid=False

        def dfs(pos:int)->None:
            # 使用 nonlocal 保护状态变量
            nonlocal line,column,cell,space,valid
            if pos==len(space):
                valid=True
                return
            i,j=space[pos]
            for x in range(9):
                if valid is True:
                    return
                if line[i][x]==column[j][x]==cell[i//3][j//3][x]==False:
                    line[i][x]=column[j][x]=cell[i//3][j//3][x]=True
                    board[i][j]=str(x+1)
                    dfs(pos+1)
                    line[i][x]=column[j][x]=cell[i//3][j//3][x]=False
        for i in range(9):
            for j in range(9):
                if board[i][j] =='.':
                    space.append((i,j))
                else:
                    val=int(board[i][j])-1
                    line[i][val]=True
                    column[j][val]=True
                    cell[i//3][j//3][val]=True
        dfs(0)
```

# 0x02 [LC67](https://leetcode-cn.com/problems/add-binary/)｜二进制求和

## 题目

    给你两个二进制字符串，返回它们的和（用二进制表示）。
    输入为 非空 字符串且只包含数字 1 和 0。

## 测试用例

    输入: a = "11", b = "1"
    输出: "100"

## 解析

理论上讲，应当按位运算，自己模拟进位操作。

但是 Python 和 Java 都有字符转二进制的内建函数，于是就有了下面这种 Python 偷鸡办法了。

## 题解

```python
class Solution:
    def addBinary(self, a, b) -> str:
        return '{0:b}'.format(int(a, 2) + int(b, 2))
```

# 0x03 [LC94](https://leetcode-cn.com/problems/binary-tree-inorder-traversal/)｜二叉树的中序遍历

## 题目

    给定一个二叉树的根节点 root ，返回它的中序遍历。

## 测试用例

    输入：root = [1,null,2,3]
    输出：[1,3,2]

## 解析

这道题是可以无脑处理的 Easy Level。

不过这里有一个细节，就是在编写中序遍历和后续遍历的时候，当从树结构映射到数组的时候，最好不要尝试在一个函数里完成。

单开一个递归函数，实现起来会比较清晰。

对于前序遍历，如后面的 100 题，直接用也会比较轻松。

## 题解

```python
class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        rest=[]
        if not root: return rest
        # 使用递归函数，进行多次 Return
        def searchNode(nodex: TreeNode)->None:
            # 使用 nonlocal 保护状态变量
            nonlocal rest
            if nodex.left:
                searchNode(nodex.left)
            rest.append(nodex.val)
            if nodex.right:
                searchNode(nodex.right)
            return
        # 从根节点开始搜索
        searchNode(root)
        return rest
```

# 0x04 [LC100](https://leetcode-cn.com/problems/same-tree/)｜相同的树

## 题目

    给你两棵二叉树的根节点 p 和 q ，编写一个函数来检验这两棵树是否相同。
    如果两个树在结构上相同，并且节点具有相同的值，则认为它们是相同的。

## 测试用例

    输入：p = [1,2,3], q = [1,2,3]
    输出：true

## 题目解析

为了最快速度判断两棵树不一致，首先需要判断当根节点的数值是否一致，一旦不符则直接结束比对，之后再去比较左右子树。

所以这个题必须使用**先序遍历**来比较两棵树。

特别注意对于叶子结点的处理，对于两个节点同时为 `null` 的情况，返回 True 即可。否则如果其中任一节点为 `null`，则返回 False。

## 题解

```python
class Solution:
    def isSameTree(self, p: TreeNode, q: TreeNode) -> bool:
        if p is None and q is None:
            return True
        if p is None or q is None:
            return False
        return p.val==q.val and self.isSameTree(p.left,q.left) and self.isSameTree(p.right,q.right)
```

# 0x05 [LC2044](https://leetcode-cn.com/problems/count-number-of-maximum-bitwise-or-subsets)｜统计按位或能得到最大值的子集数目

## 题目

给你一个整数数组 nums ，请你找出 nums 子集 按位或 可能得到的 最大值 ，并返回按位或能得到最大值的 不同非空子集的数目 。

如果数组 a 可以由数组 b 删除一些元素（或不删除）得到，则认为数组 a 是数组 b 的一个 子集 。如果选中的元素下标位置不一样，则认为两个子集 不同 。

对数组 a 执行 按位或 ，结果等于 a[0] OR a[1] OR ... OR a[a.length - 1]（下标从 0 开始）。

## 测试用例

    输入：nums = [2,2,2]
    输出：7
    解释：[2,2,2] 的所有非空子集的按位或都可以得到 2 。总共有 23 - 1 = 7 个子集。

## 解析

直接依次搜索即可，默认搜法可以理解为从 `0001` 搜索到 `1111`，逐位确定取不取，最终统一计算按位或，每次计算过程时间复杂度为 $O(N)$。

如果使用回溯，就不用重复计算某个数字之前的按位或之和。

可以将时间复杂度从 $O(2^n×n)$ 提升为 $O(2^0+2^1+...+2^n)=O(2×2^n)=O(2^n)$。

## 题解

```python
class Solution:
    def countMaxOrSubsets(self, nums: List[int]) -> int:
        cnt,maxVal=0,0
        def dfs(pos: int,OrVal: int)->None:
            # 使用 nonlocal 保护状态变量
            nonlocal cnt,maxVal
            if pos==len(nums):
                if OrVal>maxVal:
                    maxVal,cnt=OrVal,1
                elif OrVal==maxVal:
                    cnt+=1
                return
            dfs(pos+1,OrVal | nums[pos])
            dfs(pos+1,OrVal)
            return
        dfs(0,0)
        return cnt
```


# 0x06 DFS 小结

DFS 类题目的实现要点基本就是递归、模拟，要注意以下几点：

- Python 实现深度优先搜索时，**状态变量**最好在函数中通过 `nonlocal` 关键字重新声明
- DFS 类题目的实现核心点在于：
  - 递归的写法：如何在函数内重复调用自身函数
  - 递归终点处理：
    - 在递归前是否需要恢复空间状态
    - 在哪些地方写`return`
    - 是否有返回值
- DFS 实现上比较坑的点在于，一个分支搜索完了一定要记得**恢复状态**，再进行下一分支搜索
- DFS 难点往往在于想明白如何实现：
  - 通过**优化状态记录方法**降低空间复杂度
  - 通过**剪枝**降低时间复杂度
- 大模拟方法往往就是爆搜。核心是循环嵌套，务必定义好循环层数，尽量保证低于 $O(2^N)$ 的时间复杂度。
