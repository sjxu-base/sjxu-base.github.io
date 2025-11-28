class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        if len(nums)==0:
            return 0
        f=[]
        for i in range(len(nums)):
            if i==0:
                f.append(nums[i])
                continue
            curMax=max(f[-1]+nums[i],nums[i])
            f.append(curMax)
        return max(f)

        