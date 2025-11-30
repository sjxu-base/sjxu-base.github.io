---
title: "算法练习：动态规划 DP 合集"
date: 2025-11-27
excerpt: "关于动态规划的五道题，核心在处理无"
categories: ["Algorithm"]
tags: ["Leetcode", "DP"]
toc: true
toc_sticky: true
---

## [LC53](https://leetcode.cn/problems/house-robber/)｜最大子数组和

### 题目

    给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

    子数组是数组中的一个连续部分。

    示例 1：
    输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
    输出：6
    解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。
    
    示例 2：
    输入：nums = [1]
    输出：1

    示例 3：
    输入：nums = [5,4,-1,7,8]
    输出：23
    

    提示：
    1 <= nums.length <= 105
    -104 <= nums[i] <= 104

### 解析

两种方法，递推、分治。难点在于如果分治思路，很难理解，（需要剪枝），但递推相对容易，递推难点在于想明 $f(n)$ 记录的是必抢第 n 家的最大值，而不是从 0 到 n 的最大值；

n=0 必抢的情况，$f(0)=num[0]$
n=1 必抢的情况，$f(1)=max(f(0)+num[1], num[1])$
n=2 必抢的情况，$f(2)=max(f(1)+num[2], num[2])$
...
n=n 必抢的情况，$f(n)=max(f(n-1)+num[n], num[n])$

此外，关于分治思路，每次求解f(i,j)，代表从i到j的最大子段和。
线段和问题基本思路，将f(i,j)拆解四个子问题

1. 必定包含左端点的最大值 $$lSum(l,r)=max(num[l],num[l]+lSum(l+1,r))$$
2. 必定包含右端点的最大值 $$rSum(l,r)=max(num[r], num[r]+rSum(l,r-1))$$
3. 最大子段和（最终问题）$$mSum(l,r) = max(lSum(l,r),rSum(l,r),mSum(l+1,r-1),iSum(l+1,r-1))$$
4. 区间和 $$iSum(l,r)=num[l]+num[r]+iSum(l,r)$$

只计算4，就会退化为暴力，导致 $O(N^2)$ 的时间复杂度。
此外 3，4 两个问题比较困扰我，当时没想清楚如何拆解出 1 和 2 两个子状态。但这应该是线段树的基础思路。

### 题解

递推方案：

```python
class Solution():
    def maxSubArray(self, nums: List[int]) -> int:
        if len(nums)==0:
            return 0
        dp=[[0 for i in range(len(nums))] for j in range(len(nums))]
        maxSum=max(nums)
        for i in range(len(nums)):
            dp[i][i]=nums[i]
        for i in range(len(nums)):
            for j in range(i, len(nums),1):
                if i==j:
                    continue
                elif j==i+1:
                    dp[i][j]=dp[i][j-1]+nums[j]
                else:
                    dp[i][j]=dp[i][j-1]+nums[i]+nums[j]
                    maxSum=max(dp[i][j],maxSum)
        for i in range(len(nums)):
            print(dp[i])
        return maxSum
```

分治版本

```python

```


## [LC198](https://leetcode.cn/problems/house-robber/)｜打家劫舍

### 题目

### 解析

### 题解

```python
class Solution:
    def rob(self, nums: List[int]) -> int:
        if not nums: return 0
        size=len(nums)
        # 有一家的情况，直接抢唯一一家
        if size==1: return nums[0]
        # 有两家的情况，去抢最有钱的一家
        first, second = nums[0],max(nums[0],nums[1])
        for i in range(2,size):
            # 通过前两项递推第三项
            first,second=second,max(first+nums[i],second)
        return second
```

## [LC740](https://leetcode.cn/problems/delete-and-earn/description/)｜删除并获得点数

### 题目

    给你一个整数数组 nums ，你可以对它进行一些操作。
    每次操作中，选择任意一个 nums[i] ，删除它并获得 nums[i] 的点数。之后，你必须删除 所有 等于 nums[i] - 1 和 nums[i] + 1 的元素。
    开始你拥有 0 个点数。返回你能通过这些操作获得的最大点数。

    示例 1：
    输入：nums = [3,4,2]
    输出：6
    解释：
    删除 4 获得 4 个点数，因此 3 也被删除。
    之后，删除 2 获得 2 个点数。总共获得 6 个点数。
    
    示例 2：
    输入：nums = [2,2,3,3,3,4]
    输出：9
    解释：
    删除 3 获得 3 个点数，接着要删除两个 2 和 4 。
    之后，再次删除 3 获得 3 个点数，再次删除 3 获得 3 个点数。
    总共获得 9 个点数。

    提示：
    1 <= nums.length <= 2 * 104
    1 <= nums[i] <= 104

### 解析

### 题解

```python
class Solution:
    def deleteAndEarn(self, nums: List[int]) -> int:
        if not nums: return 0
        numSet=set(nums)
        enum=list(numSet)
        enum.sort()
        record={}
        for i in enum:
            record[str(i)]=i*nums.count(i)
        dp=[]
        dp.append(record[str(enum[0])])
        if len(enum)==1:
            return record[str(enum[0])]
        if enum[1]!=enum[0]+1:
            dp.append(dp[0]+record[str(enum[1])])
        else:
            dp.append(max(record[str(enum[1])],dp[0]))
        if len(enum)==2:
            return dp[1]
        for i in range(2,len(enum)):
            if enum[i]!=enum[i-1]+1:
                dp.append(dp[i-1]+record[str(enum[i])])
            else:
                dp.append(max(dp[i-1],dp[i-2]+record[str(enum[i])]))
        return dp[-1]     
```
## [LC1143](https://leetcode.cn/problems/longest-common-subsequence)｜最长公共子序列

### 题目

### 解析

### 题解

```python
class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        if not text1 or not text2:
            return 0
        dp=[[0 for _ in range(len(text2)+1)] for x in range(len(text1)+1)]
        for i in range(1,len(text1)+1):
            for j in range(1,len(text2)+1):
                if text1[i-1]==text2[j-1]:
                    dp[i][j]=dp[i-1][j-1]+1
                else:
                    dp[i][j]=max(dp[i-1][j],dp[i][j-1])
        return dp[-1][-1]
```

## 动态规划（DP）小结

### 问题特点：最优子结构 和 无后效性

DP 类问题最主要的特点就是 **无后效性**，即一个大问题可以拆成多个小问题，每个小问题有两个特性

- 最优子结构（无后效性）：只需要记录最优解，而非最优解对后续求解不会产生影响
- 重叠子问题：每个小问题的解会被反复使用，所以需要 `dp` 数组来记录小问题的解

> 首先，虽然动态规划的核心思想就是穷举求最值，但是问题可以千变万化，穷举所有可行解其实并不是一件容易的事，需要你熟练掌握递归思维，只有列出正确的「状态转移方程」，才能正确地穷举。
>
> 而且，你需要判断算法问题是否具备「最优子结构」，是否能够通过子问题的最值得到原问题的最值。
>
> 另外，动态规划问题存在「重叠子问题」，如果暴力穷举的话效率会很低，所以需要你使用「备忘录」或者「DP table」来优化穷举过程，避免不必要的计算。

而拆解这种小问题，就包括两种方式，一个是自底向上，一个是自顶向下。

### 状态转移方程：自底向上 和 自顶向下

自底向上拆解方法最典型的就是斐波那契数列，需要首先定义 `dp[0]`，`dp[1]` 等初始的状态，然后通过状态转移方程，自动推理到 `dp[len(nums)]` 一类的状态。代码上，通常通过循环实现。

自顶向下拆解方法则是采用分治办法，首先将大问题拆解为小问题，例如 求解 `dp[20]`，需要求解小问题 `dp[19]` 和 `dp[18]`，求解过程中，对于未知的子问题进行迭代求解，并将已经解决的子问题归入已解决问题的范畴，对于已知的子问题，直接调用已经记录的子状态。代码上，通常通过函数递归实现。

这两者的本质是一样的，可以互相转化。迭代解法中的那个 dp 数组，就是递归解法中的 memo 数组。自顶向下、自底向上两种解法本质其实是差不多的，大部分情况下，效率也基本相同。

### 模版思路

本质：暴力枚举，原问题不断拆分为子问题。
思考思路：选或不选（大部分是），枚举选哪个
解决方法：记忆化搜索（较容易）或者 dp 数组递推（较难）
关于计算 dp 时间复杂度的理解：1. 子问题个数 × 得到子问题解的复杂度。 2. 状态个数 × 得到每个状态的复杂度

思路基本确定，回归到具体题目中，

解决动态规划类问题，通常分为四步

第一步，构建正确的问题状态表征，尽量去除无用的参数。如果这部搞得不清楚，就会做出很多重复性计算，无后效性就会变差，甚至退化为暴力求解。

第二步，构建状态转移方程，需要搞清楚**大问题**和**小问题**之间的推进分析管理，即各个小问题的解如何合并成大问题的解，这一步至关重要。

第三步，开始编码，去关注一些边际问题，例如`dp[0]`等初始值的设立，无效子问题的合理解设定等。

---

## Reference

- [五大基本算法之动态规划算法 DP dynamic programming](https://houbb.github.io/2020/01/23/data-struct-learn-07-base-dp#%E7%AE%97%E6%B3%95%E5%AE%9E%E6%88%98-%E8%B7%AF%E5%BE%84)
- [动态规划解题套路框架](https://labuladong.online/algo/essential-technique/dynamic-programming-framework-2/)
- [动态规划常见题型、模版总结](https://leetcode.cn/discuss/post/obCjFP/)
