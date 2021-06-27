<template>
  <div class="Determinelocation">
    <div>歌手ID：{{ SingerId }}</div>
    <div>{{ briefDesc }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      SingerId: this.$route.params.SingerId,
      briefDesc: "",
    };
  },
  methods: {
    // 获取歌手详情
    async gethotSingerDetails() {
      const result = await this.$http.get("/artist/detail?id=" + this.SingerId);
      if (result.status !== 200) {
        return this.$message.error("获取失败！");
      }
      this.briefDesc = result.data.data.artist.briefDesc;
    },
  },
  // 生命周期函数  页面刷新时调用
  mounted() {
    this.gethotSingerDetails();
  },
};
</script>
<style lang="less" scoped>
.Determinelocation{
  line-height: 30px;
  margin-bottom: 20px;
  div{
    font-size: 16px;
    text-indent: 2em;
  }
}
</style>
