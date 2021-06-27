<template>
  <footer>
    <div class="dd">
      <div class="ddson">
        <div class="ddicon"></div>
        <span class="top"
          >岁月很长，人海茫茫，别回头也别将就，自然会有良人来爱你。</span
        >
        <br>
        <div class="ddicon"></div>
        <span class="top"
          >惊喜是一件没有预期的礼物。在时间的沉淀下，在你的成长中，它总会到来，现在我们做的一切只为让惊喜更好地降临。</span
        >
        <br>
        <div class="ddicon"></div>
        <span class="top"
          >没有完美无缺的东西，没有尽善尽美的人，关键是知道到底想要什么，想得到什么，假如什么都想要，结果只会什么都得不到。</span
        >
      </div>
      <span class="bottom">版权所有©13084991856@163.com 黄先森设计。</span>
    </div>
  </footer>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
footer {
  margin-top: 30px;
  margin-bottom: 90px;
  width: 100%;
  height: 170px;
  background-color: #161e27;
  color: #161e27;

  .dd {
    position: relative;
    width: 80%;
    height: 100%;
    margin: 0 auto;
    .bottom {
      position: absolute;
      bottom: 0px;
      color: rgba(255, 255, 255, 0.3);
      font-size: 12px;
      padding: 15px 0;
    }

    .ddson {
      position: absolute;
      top: 26px;
      line-height: 33px;
    }

    .top {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.6);
    }
    .ddicon {
      display: inline-block;
      width: 3px;
      height: 15px;
      background: red;
      margin-right: 10px;
      margin-bottom: -3px;
    }
  }
}
</style>