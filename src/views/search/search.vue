<template>
  <div>
    <div class="search">
      <el-input
        v-model="keyword"
        placeholder="请输入内容"
        class="inputbox"
        @change="
          GotoSearchDetails(keyword);
          GotoSearchSinger(keyword);
          GotoSearchAlbum(keyword);
        "
      ></el-input>
    </div>
    <!-- 路由占位符 -->
    <router-view
      :searchValSong="searchVal"
      :searchValSinger="searchValSinger"
      :searchValAlbums="searchValAlbums"
    ></router-view>
  </div>
</template>
<script>
export default {
  name: "search",
  props: ["searchKeyword"],
  data() {
    return {
      // 接收父路由传来的参数
      key: this.$route.query.key,
      keyword: "",
      // 歌曲data
      searchVal: [],

      // 歌手data
      searchValSinger: [],

      // 专辑
      searchValAlbums: [],

      flag: true,
    };
  },
  watch: {
    //vue路由参数改变触发页面组件刷新
    $route(to, from) {
      //监听路由是否变化
      if (to.query.key != from.query.key) {
        this.key = to.query.key;
        this.GotoSearchDetails(this.key);
      }
    },
    searchKeyword: function (val) {
      this.GotoSearchDetails(val);
      this.GotoSearchSinger(val);
      this.GotoSearchAlbum(val);
    },
    key: function (val) {
      this.GotoSearchDetails(val);
      this.GotoSearchSinger(val);
      this.GotoSearchAlbum(val);
    },
  },
  methods: {
    // 去搜索详情（发送歌曲）   搜索接口 /search?keywords=
    async GotoSearchDetails(keyword) {
      //
      if (!keyword || keyword == "") return;
      const result = await this.$http.get("/cloudsearch?keywords=" + keyword);
      if (result.status !== 200) {
        return this.$message.error("获取搜索歌曲失败！");
      }
      //  将歌曲数据传给子组件
      this.searchVal = result.data.result.songs;
    },

    // 去搜索详情（发送歌手）   搜索接口 /search?keywords=
    async GotoSearchSinger(keyword) {
      //
      if (!keyword || keyword == "") return;
      const result = await this.$http.get(
        "/cloudsearch?keywords=" + keyword + "&type=100&limit=36"
      );
      if (result.status !== 200) {
        return this.$message.error("获取搜索歌手失败！");
      }
      // console.log(result.data);
      //  将歌手数据传给子组件
      this.searchValSinger = result.data.result.artists;
    //   console.log(this.searchValSinger); // 在需要传值的方法中处理
    },

    // 去搜索详情（发送专辑）   搜索接口 /search?keywords=
    async GotoSearchAlbum(keyword) {
      //
      if (!keyword || keyword == "") return;
      const result = await this.$http.get(
        "/cloudsearch?keywords=" + keyword + "&type=10&limit=36"
      );
      if (result.status !== 200) {
        return this.$message.error("获取搜索专辑失败！");
      }
      this.searchValAlbums = result.data.result.albums;
      // console.log(this.searchValAlbums);
    },
  },
  // DOM加载完成后执行
  mounted: function () {
    //  由搜索弹框进入的处理函数
    if (this.key) {
      this.GotoSearchDetails(this.key);
      this.GotoSearchSinger(this.key);
      this.GotoSearchAlbum(this.key);
    }
    // 关闭弹框
    // var btn = document.querySelector(".el-button--default");
    // btn.click();
  },
};
</script>
<style>
/* elementui+vue项目中，在当前vue文件中使用style scoped包裹的样式中重置input框的样式无法生效 */
.inputbox input.el-input__inner {
  border-radius: 15px;
  color: rgb(27, 25, 25) !important;
}
</style>
<style lang="less" scoped>
.search {
  width: 100%;
  height: 400px;
  /*flex 布局*/
  display: flex;
  /*实现垂直居中*/
  align-items: center;
  /*实现水平居中*/
  justify-content: center;
  color: #fff;
  border-radius: 15px;
  background: url("~assets/img/snow.jpg");
  background-position: 50% 42%;
  .inputbox {
    width: 50%;
    border-radius: 15px;
    background: rgba(241, 241, 241, 0.5);
    ::-webkit-input-placeholder {
      color: rgb(27, 25, 25);
    }

    .el-input__inner {
      color: rgb(27, 25, 25) !important;
    }
    input {
      color: rgb(27, 25, 25) !important;
    }
  }
}
</style>