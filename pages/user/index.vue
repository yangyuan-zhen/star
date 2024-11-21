<template>
  <div class="user-center">
    <!-- 用户信息区域 -->
    <div class="user-info">
      <image class="avatar" src="/static/logo.png" mode="aspectFill"></image>
      <div class="info">
        <div class="nickname">游客</div>
        <div class="desc">这个人很懒，什么都没留下</div>
      </div>
    </div>

    <!-- 功能列表 -->
    <div class="menu-list">
      <div class="menu-item" @tap="handleMenuClick('collection')">
        <i class="icon-star"></i>
        <span>我的收藏</span>
        <i class="icon-arrow"></i>
      </div>
      <div class="menu-item" @tap="handleMenuClick('history')">
        <i class="icon-history"></i>
        <span>观看历史</span>
        <i class="icon-arrow"></i>
      </div>
      <div class="menu-item" @tap="handleMenuClick('about')">
        <i class="icon-info"></i>
        <span>关于我们</span>
        <i class="icon-arrow"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const handleMenuClick = (type: string) => {
  uni.showToast({
    title: "功能开发中",
    icon: "none",
  });
};
</script>

<style scoped lang="scss">
.user-center {
  min-height: 100vh;
  background: #f5f5f5;

  .user-info {
    background: #fff;
    padding: 40rpx 32rpx;
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;

    .avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      margin-right: 24rpx;
    }

    .info {
      .nickname {
        font-size: 32rpx;
        font-weight: bold;
        margin-bottom: 8rpx;
      }

      .desc {
        font-size: 24rpx;
        color: #999;
      }
    }
  }

  .menu-list {
    background: #fff;

    .menu-item {
      display: flex;
      align-items: center;
      padding: 32rpx;
      border-bottom: 1rpx solid #eee;

      i {
        font-size: 40rpx;
        margin-right: 16rpx;
        color: #666;
      }

      span {
        flex: 1;
        font-size: 28rpx;
        color: #333;
      }

      .icon-arrow {
        color: #999;
      }
    }
  }
}
</style>
