<template>
  <div class="grid-content">
    <div class="grid-content-tit">
      <title-box :title="title"></title-box>
    </div>
    <ul class="rankingUl" v-if="SongListData.length > 0">
      <li
        v-loading="loading"
        slot="songlist"
        class="SongList"
        :key="index"
        v-for="(item, index) in SongListData"
        @click="gotolistdetails(item)"
      >
        <span class="PlayCount" v-if="ShowPlayCount">
          <i class="My-new-iconbofang"></i>
          <span>{{ item.playCount | GetPlayCount() }}</span>
        </span>
        <img :src="item | GetPic()" alt="" />
        <div>
          {{ item.name ? item.name : item.nickName }}
          <div v-if="item.topicPerson">人气：{{ item.topicPerson }}</div>
        </div>
      </li>
    </ul>
    <h1 v-else style="margin: 55px">暂无数据...</h1>
  </div>
</template>
<script>
// 小标题组件
import TitleBox from "@/components/common/Title/title.vue";
export default {
  props: {
    title: {
      type: String,
      default: null,
    },
    SongListData: {
      type: Array,
      default: () => [],
    },
    ShowPlayCount: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    SongListData() {
      // 监听当前数据变化，然后停止加载动画
      setTimeout(() => {
        this.loading = false;
      }, 500);
      this.loading = true;
    },
  },
  data() {
    return {
      loading: true,
    };
  },
  components: {
    TitleBox,
  },
  methods: {
    //  去详细
    async gotolistdetails(item) {
      if ((item.hasOwnProperty("adType") && item.adType == 0) || item.alg) {
        this.$router.push("/rankingdetails/" + item.id);
      } else if (item.musicSize && item.musicSize >= 0) {
        this.$router.push("/SingerDetails/" + item.id);
      } else if (item.hasOwnProperty("company")) {
        this.$router.push("/AlbumDetails/" + item.id);
      }
    },
  },
  filters: {
    GetPlayCount(val) {
      return val >= 10000 ? Math.floor(val / 10000) + "w" : val;
    },
    GetPic(val) {
      // picUrl 或 coverImgUrl
      let pic = "";
      if (val.picUrl) {
        pic = val.picUrl + "?param=130y130";
      } else if (val.coverImgUrl) {
        pic = val.coverImgUrl + "?param=130y130";
      } else if (val.avatarUrl) {
        pic = val.avatarUrl + "?param=130y130";
      }
      return pic;
    },
  },
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 500);
  },
};
</script>
<style lang="less">
.rankingUl {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 30px;
  .SongList {
    width: 10%;
    margin-top: 15px;
    position: relative;
    cursor: pointer;
    .PlayCount {
      position: absolute;
      text-align: center;
      right: 44px;
      top: 1px;
      font-size: 12px;
      display: inline;
      border-radius: 4px;
      color: rgba(245, 243, 243, 0.9);
      background: rgba(0, 0, 0, 0.2);
      i,
      span {
        margin: 0 2px;
      }
    }
    img {
      width: 100px;
      border-radius: 10px;
      box-shadow: 6px 6px 3px -1px rgba(37, 37, 37, 0.3);
    }
  }
}

// 榜单名称
.rankingUl > li > div {
  width: 100px;
  font-size: 12px;
  transform: translateX(5%);
  // 强制一行
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; //以此类推，3行4行直接该数字就好啦
}

.grid-content-tit {
  display: flex;
  margin-bottom: 10px;
  // 垂直居中
  align-items: center;
  span {
    font-size: 18px;
    font-weight: 600;
  }
  .TitSpan {
    width: 3px;
    height: 20px;
    background-color: red;
    margin-right: 7px;
  }
}

.el-loading-mask {
  left: -5px !important;
}
</style>