<template>
  <div class="SongDetails">
    <el-row :gutter="10">
      <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3"
        ><div class="grid-content bg-purple visibilityBox"></div
      ></el-col>
      <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
        <div class="top">
          <div class="videobox">
            <video :src="MVurl" controls="controls"></video>
            <div class="video_desc">
              <div class="MVname">{{ MVname }} - {{ artistName }}</div>
              <div class="promulgator">
                <span>发布：{{ publishTime }}</span>
                <span>时长：{{ duration | GetTime() }}</span>
                <span>播放次数：{{ playCount }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="comment">
          <h2>
            评论 <span>总共{{ commentCount }}条评论</span>
          </h2>
          <div class="btn">
            <el-button type="primary" round @click="changeSortType(1)"
              >按推荐排序</el-button
            >
            <el-button type="success" round @click="changeSortType(2)"
              >按热度排序</el-button
            >
            <el-button type="warning" round @click="changeSortType(3)"
              >按时间排序</el-button
            >
          </div>
          <ul class="Commentarea">
            <li
              :key="index"
              v-for="(item, index) in AllComments"
              v-loading="loading"
            >
              <div class="Commentareabox">
                <div class="pic">
                  <img :src="item.user.avatarUrl + '?param=50y50'" alt="" />
                </div>
                <div class="side">
                  <div class="CommentTitle">
                    <span class="nickname">{{ item.user.nickname }}：</span>
                    <span>{{ item.content }}</span>
                  </div>
                  <div class="timerorlike">
                    <span class="timer">{{
                      item.time | filtrationTime(that)
                    }}</span>

                    <span class="My-new-icondianzan">{{
                      item.likedCount
                    }}</span>
                    <span class="vertical">|</span>
                    <span>回复</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3"
        ><div class="grid-content visibilityBox"></div
      ></el-col>
    </el-row>
  </div>
</template>

<script>
// 引入监听下拉的js文件
import {
  getDocumentTop,
  getWindowHeight,
  getScrollHeight,
} from "@/assets/js/downLoad.js";
// 格式化时间
import { filtrationTime } from "@/assets/js/SongTime.js";
export default {
  name: "MoreComment",
  inject: ["reload"],
  data() {
    return {
      MVid: this.$route.params.id,

      // MV播放地址
      MVurl: "",
      // MV名字
      MVname: "",
      artistName: "",
      commentCount: 0,

      // 发表时间
      publishTime: "",
      // 播放数量
      playCount: "",
      // 时长
      duration: "",

      sortType: 1, //排序方式,1:按推荐排序,2:按热度排序,3:按时间排序
      cursor: 0,
      pageNo: 1, //分页参数,第N页,默认为1
      pageSize: 20, // 分页参数,每页多少条数据,默认20

      // 当前数据
      currentData: "",
      that: this,
      // AllComments
      AllComments: [],
      flag: "false",
      // 下拉加载等待
      loading: false,
    };
  },
  filters: {
    GetTime(val) {
      return filtrationTime(val);
    },
    // 格式化时间
    filtrationTime(val, that) {
      var newTime = new Date(val);
      var year = newTime.getFullYear() + "年";
      var month = that.zeroize(newTime.getMonth() + 1) + "月";
      var date = that.zeroize(newTime.getDate()) + "日" + " ";
      var Hours = that.zeroize(newTime.getHours()) + ":";
      var Minutes = that.zeroize(newTime.getMinutes());
      return [year, month, date, Hours, Minutes].join("");
    },
  },
  methods: {
    //修改排序方式
    changeSortType(type) {
      this.sortType = type;
      this.getAllComment(this.sortType, this.pageSize, this.pageNo);
      // this.reload()
    },
    // 获取MV地址
    async getMVURL() {
      const result = await this.$http.get("/mv/url?id=" + this.MVid);
      this.MVurl = result.data.data.url;
    },
    // 获取MV详细
    async getMVdetails() {
      const result = await this.$http.get("/mv/detail?mvid=" + this.MVid);
      // console.log(result.data.data);
      this.MVname = result.data.data.name;
      this.artistName = result.data.data.artistName;
      this.publishTime = result.data.data.publishTime;
      // 播放数量
      this.playCount = result.data.data.playCount;
      // 持续时间
      this.duration = result.data.data.duration;
    },
    //下拉加载事件内容
    scrollHander() {
      if (getScrollHeight() == getWindowHeight() + getDocumentTop()) {
        this.loading = true;
        //当滚动条到底时,这里是触发内容
        this.pageSize += 20
        // this.pageNo += 1
        this.getAllComment(this.sortType, this.pageSize, this.pageNo);
      }
    },

    // 补零函数
    zeroize(date) {
      return date > 10 ? date : "0" + date;
    },

    // 获取全部评论
    async getAllComment(sortType, pageSize, pageNo) {
      const result = await this.$http.get(
          `/comment/new?type=1&id=${this.MVid}&sortType=${sortType}&pageSize=${pageSize}&pageNo=${pageNo}`
        );
      this.commentCount = result.data.data.totalCount;
      // 解构对象
      this.AllComments = result.data.data.comments;
      // console.log(this.AllComments);
      this.loading = false;
    },
  },
  mounted() {
    // this.reload()
    this.getMVURL();
    this.getMVdetails();
    this.getAllComment(this.sortType, this.pageSize, this.pageNo);
  },
  created() {
    //  添加下拉监听事件函数
    window.addEventListener("scroll", this.scrollHander);
  },
  // vue实例销毁时
  destroyed() {
    // 移除下拉监听事件
    window.removeEventListener("scroll", this.scrollHander);
  },
};
</script>

<style lang="less" scoped>
.top {
  position: relative;
  height: 360px;
  .videobox {
    width: 60%;
    height: 100%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    video {
      width: 100%;
      height: 90%;
    }
    .video_desc {
      display: flex;
      justify-content: space-between;
      line-height: 20px;
      .MVname {
        font-weight: 600;
        margin: 0;
      }
      .promulgator {
        font-size: 12px;
        color: rgb(167, 167, 167);
        span {
          margin-right: 20px;
        }
      }
    }
  }
}
.comment {
  .btn {
    margin-top: 10px;
  }
  h2 {
    margin: 0;
    span {
      font-size: 14px;
      padding: 0 10px;
      font-weight: normal;
      color: #e04141;
    }
  }
  .Commentarea {
    li {
      font-size: 14px;
      margin: 10px 0;
      width: 100%;
      border-bottom: 1px dashed rgb(204, 204, 204);
      .Commentareabox {
        padding: 15px 0;
        overflow: hidden;
        .pic,
        .side {
          float: left;
          .nickname {
            color: skyblue;
          }
          .timerorlike {
            margin-top: 15px;
            .timer {
              color: #999;
            }
            .vertical {
              margin: 0 10px;
            }
          }
        }
        .pic {
          img {
            width: 50px;
            margin-right: 10px;
          }
        }

        .side {
          width: 93%;
          .timerorlike {
            .timer {
              float: left;
            }
            span {
              float: right;
            }
          }
        }
      }
    }
  }
}
</style>