from typing import List

class Solution():
    def maxSubArray(self, nums: List[int]) -> int:
        if len(nums)==0:
            return 0
        dp=[[0 for i in range(len(nums))] for j in range(len(nums))]
        maxSum=max(nums)
        for i in range(len(nums)):
            dp[i][i]=nums[i]
        for i in range(len(nums),0):
            for j in range(i, len(nums)):
                if i==j:
                    continue
                else:
                    dp[i][j]=max(dp[i+1][j-1]+nums[i]+nums[j])
                    maxSum=max(dp[i][j],maxSum)
        print(maxSum)
