<template>
  <div class="SingerDetails" v-cloak>
    <!-- mian -->
    <el-row :gutter="10" class="mian">
      <el-col :xs="1" :sm="3" :md="4" :lg="3" :xl="3"
        ><div class="grid-content adapt"></div
      ></el-col>
      <!-- 左侧 -->
      <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="12" class="albumLeftBox">
        <div class="grid-content albumLeft">
          <div class="main-left">
            <div class="top">
              <div class="top_head">
                <img :src="album.blurPicUrl" alt="" />
                <div class="top_head_tit">
                  <h4>专辑名：{{ album.name }}</h4>
                  <h5>公司：{{ album.company }}</h5>
                </div>
                <div class="top_head_artist">
                  <h4>作者相关信息：</h4>
                  <div>
                    <span>作者：{{ album.artist && album.artist.name }}</span>
                    <span
                      >专辑数：{{
                        album.artist && album.artist.albumSize
                      }}</span
                    >
                    <span
                      >单曲数：{{
                        album.artist && album.artist.musicSize
                      }}</span
                    >
                  </div>
                </div>
                <div class="top_head_dynamic">
                  <h4>专辑动态：</h4>
                  <div>
                    <span
                      ><i class="iconfont icon-pinglun"></i> 评论：{{
                        dynamic.commentCount
                      }}</span
                    >
                    <span
                      ><i class="iconfont icon-fenxiang"></i>分享：{{
                        dynamic.shareCount
                      }}</span
                    >
                    <span>已售：{{ onSale }}</span>
                  </div>
                </div>
                <div class="jianjie_div">
                  <h4 class="jianjie">专辑简介：</h4>
                  <p class="jianjie_p" v-if="album.description">
                    {{ album.description }}
                  </p>
                  <p class="jianjie_p" v-else>没有留下什么...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 右侧 -->
      <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="6">
        <div class="grid-content rankRight">
          <div class="main-right">
            <h3>专辑单曲列表</h3>
            <ul>
              <li
                v-for="item in songs"
                :key="item.id"
                @click="playMusic(item.id)"
              >
                <img :src="item.al.picUrl" alt="" />
                <h5>{{ item.name }}</h5>
              </li>
            </ul>
          </div>
        </div>
      </el-col>

      <el-col :xs="1" :sm="3" :md="4" :lg="3" :xl="3"
        ><div class="grid-content adapt"></div
      ></el-col>
    </el-row>
  </div>
</template>

<script>
import { playMisic } from "@/network/PlayMisic.js";
export default {
  components: {},
  filters: {},
  name: "albumdetails",
  //局部刷新组件要用到的数据
  inject: ["reload"],
  data() {
    return {
      // 接受动态路由传来的参数
      albumId: this.$route.params.id,
      //专辑数据
      album: {},
      //专辑动态
      dynamic: {},
      //歌曲
      songs: [],
      al: {},
    };
  },
  computed: {
    onSale() {
      let onsale = this.dynamic.onSale ? "在售" : "停售";
      let sale = this.dynamic.sales ? this.dynamic.sales : "0";
      return sale + "(" + onsale + ")";
    },
  },
  methods: {
    //获取专辑内容详情
    async getAlbumDetails() {
      const result = await this.$http.get("/album?id=" + this.albumId);
      if (result.status !== 200) {
        return this.$message.error("获取失败！");
      }
      this.album = result.data.album;
      this.songs = result.data.songs;
      this.al = result.data.songs.al;
      // console.log(this.album);
      // console.log(this.songs);
    },
    //获取专辑动态信息
    async getAlbumDetailsDynamic() {
      const result = await this.$http.get(
        "/album/detail/dynamic?id=" + this.albumId
      );
      if (result.status !== 200) {
        return this.$message.error("获取失败！");
      }
      // console.log(result.data);
      this.dynamic = result.data;
    },
    playMusic(id) {
      playMisic(id).then((musicdata) => {
        // 通过事件总线发送事件并传入数据 -> 歌曲数据和歌曲id
        this.$bus.$emit("getMusicMessage", { musicdata, id });

        let newsData = {
          picUrl: musicdata.picUrl,
          Singer: musicdata.Singer,
          picname: musicdata.picname,
        };
        // 将当前播放的音乐数据传给vuex进行管理
        this.$store.commit("setMusicData", newsData);
        // 跳转到评论区
        this.$router.push({ name: "SongDetails", query: { id: id } });
      });
    },
  },
  // 生命周期函数  页面刷新完成时调用
  mounted() {
    this.getAlbumDetails();
    this.getAlbumDetailsDynamic();
  },
  created() {},
};
</script>
<style lang="less" scoped>
[v-cloak] {
  display: none !important;
}
.main-left {
  .top {
    .top_head {
      img {
        width: 100%;
        height: 320px;
      }
      .top_head_tit {
        height: 50px;
        h4 {
          float: left;
        }
        h5 {
          float: right;
        }
      }
      .top_head_artist,
      .top_head_dynamic {
        h4 {
          margin: 14px 0;
        }
        div {
          display: flex;
          justify-content: space-between;
          span {
            font-size: 14px;
          }
        }
      }
      .jianjie_div {
        background: #f3eaea;
        border-radius: 30px;
        padding: 3px 0;
        margin: 10px 0;
        .jianjie {
          margin: 0;
          padding-top: 15px;
        }
        .jianjie_p {
          font-size: 13px;
          line-height: 20px;
          text-indent: 2em;
          line-height: 25px;
          padding: 0 15px;
        }
      }
    }
  }
}
.main-right {
  h3 {
    text-align: center;
    margin-top: 0;
  }
  li {
    width: 100%;
    img {
      width: 100%;
      height: 300px;
    }
    h5 {
      margin: 5px 0 10px 0;
    }
  }
}
</style>
