<template>
  <div>
    <!-- 个人中心 -->
    <el-row :gutter="10" class="el-row01">
      <el-col :xs="1" :sm="3" :md="4" :lg="3" :xl="3"
        ><div class="grid-content adapt"></div
      ></el-col>
      <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="13" class="personalLeft">
        <div class="grid-content">
          <div class="videobox">
            <video :src="MVurl" controls="controls"></video>
          </div>
          <div class="grid-content-MVdec">
            <div class="MVname">
              <span class="el-icon-loading"></span>
              {{ MVname }}
            </div>
            <div class="label">
              <span :key="index" v-for="(item, index) in videoGroup"
                ># {{ item.name }}
              </span>
            </div>
            <div class="promulgator">
              <span>发布：{{ publishTime }}</span>
              <span>时长：{{ duration | GetTime() }}</span>
              <span>播放次数：{{ playCount }}</span>
              <span>作者：{{ artistName }}</span>
            </div>
            <div class="btnbox">
              <div class="btn">
                <span class="el-icon-thumb">{{ likedCount }}</span>
              </div>
              <div class="btn">
                <span class="el-icon-star-on">666</span>
              </div>
              <div class="btn">
                <span class="el-icon-link">{{ shareCount }}</span>
              </div>
            </div>
            <div class="Commentnumber">
              <div class="Commentnumberbox">
                <span class="el-icon-chat-dot-square"></span>
                <span>{{ commentCount }}条评论</span>
              </div>
              <div class="Commentnumberbox">
                <span class="el-icon-user"></span>
                <span v-if="userToken">{{ nickname }},你好</span>
                <span v-else
                  >没有登录，请<a href="javascript:;" @click="goToLogin"
                    >登录</a
                  ></span
                >
              </div>
              <div class="areaText">
                <img class="areaTextimg" :src="avatarUrls" alt="" />
                <el-input
                  type="textarea"
                  placeholder="请输入内容"
                  v-model="textarea"
                  maxlength="350"
                  show-word-limit
                  resize="none"
                  height="200px"
                  @focus="areaFocus"
                  @blur="areaBlur"
                >
                </el-input>
                <div class="sendcomment" @click="SendComment(textarea)">
                  评论
                </div>
                <h3>精彩评论</h3>
                <ul>
                  <li
                    class="sendcommentLi"
                    :key="index"
                    v-for="(item, index) in hotComments"
                  >
                    <div class="user">
                      <div class="user_div_one">
                        <img :src="item.user.avatarUrl" alt="" />
                        <strong>{{ item.user.nickname }}</strong>
                      </div>
                      <div class="sendcommentLi-div-one">
                        <span class="sendtime">{{
                          item.time | GetCommentTime()
                        }}</span>
                        <span class="el-icon-thumb like"></span>
                        <span>({{ item.likedCount }})</span>
                        <span class="sendcommentLi-div-vertical"> | </span>
                        <span class="el-icon-chat-dot-square"></span>
                      </div>
                    </div>
                    <div class="sendcommentLi-div">
                      <div class="commentContent">{{ item.content }}</div>
                    </div>
                  </li>
                </ul>
                <div class="more" v-if="commentCount > 0">
                  <a href="javascript:;" @click="GoToMoreComment(MVid)"
                    >更多>></a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="5" class="personalRight">
        <div class="grid-content">
          <!-- 右边 -->
          <div class="grid-content-right">
            <div class="mycover">
              <div class="grid-content-right-title">
                <span>|</span>
                <strong>视频简介</strong>
                <div class="introduce-time">发布时间：{{ publishTime }}</div>
                <div class="introduce-num">播放次数：{{ playCount }}</div>
                <div class="desc_pic">
                  <img :src="cover" alt="" />
                </div>
                <div class="introduce-dec">
                  描述：
                  <p v-if="desc" style="text-indent: 2em">{{ desc }}</p>
                  <p v-else style="text-indent: 2em">暂无相关介绍...</p>
                </div>
              </div>
            </div>
          </div>

          <div class="grid-content-right">
            <div class="grid-content-right-title">
              <span>|</span>
              <strong>相关推荐</strong>
            </div>
            <div class="mycover">
              <ul class="grid-content-right-ul">
                <li
                  :key="index"
                  v-for="(item, index) in mvs"
                  @click="GoToMVdetails(item.id)"
                >
                  <img :src="item.cover" alt="" />
                  <div class="grid-content-right-li-title">{{ item.name }}</div>
                </li>
              </ul>
            </div>
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
// 格式化时间
import { filtrationTime } from "@/assets/js/SongTime.js";
export default {
  name: "MVdetails",
  inject: ["reload"],
  data() {
    return {
      UserId: this.$store.state.userId,
      userToken: this.$store.state.userToken,
      cookie: this.$store.state.cookie,

      avatarUrls: "",
      nickname: "",

      // 接受动态路由传来的参数(用户id)
      MVid: this.$route.params.id,

      // 控制显示最近一周还是使用时间 (默认是最近一周)
      flag: true,

      // 控制样式 变量
      changeSelectStyle: "",

      // 控制显示隐藏变量
      flag1: true,
      flag2: false,

      mvs: "",

      // MV播放地址
      MVurl: "",

      // MV名字
      MVname: "",

      // 输入框内容
      textarea: "快来发表评论吧~",

      // 发表时间
      publishTime: "",

      // 描述
      desc: "",
      cover: "",

      // 视频标签
      videoGroup: "",

      // 播放数量
      playCount: "",

      // 时长
      duration: "",
      artistName: "",

      // 点赞,评论，分享数量
      likedCount: "",
      commentCount: "",
      shareCount: "",

      //热门评论
      hotComments: "",
    };
  },
  methods: {
    // 获取用户详情
    async getUserDetails() {
      if (this.userToken) {
        const result = await this.$http.get("/user/detail?uid=" + this.UserId);
        if (result.status !== 200) {
          return this.$message.error("获取用户信息失败！");
        }
        if (result.data.code !== 400) {
          // 保存头像地址
          this.avatarUrls = result.data.profile.avatarUrl;
          this.nickname = result.data.profile.nickname;
        }
      }
    },
    //评论框获得/失去焦点
    areaFocus() {
      if (this.textarea == "快来发表评论吧~") {
        this.textarea = "";
      } else {
      }
    },
    areaBlur() {
      if (this.textarea == "") {
        this.textarea = "快来发表评论吧~";
      } else {
      }
    },

    changeflag2() {
      this.flag2 = true;
      this.flag1 = false;
    },
    changeflag1() {
      this.flag2 = false;
      this.flag1 = true;
    },

    changeStyle(index) {
      this.changeSelectStyle = index;
    },

    // 获取相似MV
    async getsimiMV() {
      const result = await this.$http.get("/simi/mv?mvid=" + this.MVid);
      this.mvs = result.data.mvs;
    },

    // 去mv详情
    GoToMVdetails(id) {
      this.$router.push({ name: "MVdetails", params: { id: id } });
      //  局部刷新当前组件
      this.reload();
    },
    // 去更多评论
    GoToMoreComment(id) {
      this.$router.push({ name: "MoreComment", params: { id: id } });
    },
    //去登录
    goToLogin() {
      this.$router.push("/login");
    },
    // 获取MV详细
    async getMVdetails() {
      const result = await this.$http.get("/mv/detail?mvid=" + this.MVid);
      // console.log(result.data.data);
      this.MVname = result.data.data.name;
      this.desc = result.data.data.desc;
      this.cover = result.data.data.cover;
      this.publishTime = result.data.data.publishTime;
      // 视频标签
      this.videoGroup = result.data.data.videoGroup;
      // 播放数量
      this.playCount = result.data.data.playCount;
      // 持续时间
      this.duration = result.data.data.duration;
      // 作者
      this.artistName = result.data.data.artistName;
    },

    // 获取MV地址
    async getMVURL() {
      const result = await this.$http.get("/mv/url?id=" + this.MVid);
      this.MVurl = result.data.data.url;
    },

    // 获取 mv 点赞转发评论数数据
    async getMVflowData() {
      const result = await this.$http.get("/mv/detail/info?mvid=" + this.MVid);
      //评论总数
      const result2 = await this.$http.get(
        `/comment/new?type=1&id=${this.MVid}`
      );
      console.log(result2);
      if (result2.data.code == 200) {
        this.commentCount = result2.data.data.totalCount;
      } else {
        this.commentCount = 0;
      }
      this.likedCount = result.data.likedCount;
      this.shareCount = result.data.shareCount;
    },

    // 获取热门评论
    async getMVHotcomment() {
      const result = await this.$http.get(
        "/comment/hot?id=" + this.MVid + "&type=1"
      );
      this.hotComments = result.data.hotComments;
    },

    // 发表评论
    async SendComment(content) {
      if (this.cookie) {
        const result = await this.$http.get(
          "/comment?t=1&type=1&id=" +
            this.MVid +
            "&content=" +
            content +
            "&cookie=" +
            this.cookie
        );
        console.log(result);
        // 清空输入域
        this.textarea = "";
        // 新增数据
        this.$message.success("评论成功!");
        this.commentCount++;
      } else {
        this.$message.warning(" 请登录后再操作！");
        return this.$router.push("/login");
      }
    },
  },

  filters: {
    GetTime(val) {
      return filtrationTime(val);
    },
    GetCommentTime(val) {
      let newTime = new Date(val);
      let year = newTime.getFullYear() + "年";
      let month = newTime.getMonth() + 1 + "月";
      let date = newTime.getDate() + "日";
      return year + month + date;
    },
  },
  // 生命周期函数  页面刷新时调用
  mounted() {
    this.getsimiMV();
    this.getMVdetails();
    this.getMVURL();
    this.getMVflowData();
    this.getMVHotcomment();
    this.getUserDetails();
  },
};
</script>
<style lang="less" scoped>
.grid-content {
  padding: 0;
}
// 左边右边中间的布局
.personalLeft {
  border-radius: 5px;
  margin: 10px 5px;
  box-shadow: 4px 4px 55px 1px #e0e0e0;
}

// 左
.personalLeft {
  padding: 0 !important;
  .videobox {
    width: 100%;
    height: 565px;
    position: relative;
    video {
      width: 100%;
      height: 100%;
      position: absolute;
      margin-top: 24px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .grid-content-MVdec {
    padding: 20px;
    .MVname {
      font-weight: 600;
      margin: 10px 0;
    }
    .label {
      margin-bottom: 15px;
      span {
        font-size: 14px;
        margin: 0 6px;
        color: rgb(255, 0, 0);
      }
    }
    .promulgator {
      font-size: 12px;
      color: rgb(167, 167, 167);
      span {
        margin-right: 20px;
      }
    }
    .Commentnumber {
      .Commentnumberbox {
        font-size: 16px;
        color: #707070;
        padding: 15px 0px;
        span {
          margin-left: 10px;
        }
      }
      .areaText {
        position: relative;
        .more {
          position: absolute;
          bottom: -120px;
          right: 35px;
          font-size: 13px;
        }
      }

      .areaTextimg {
        width: 65px;
        margin-right: 15px;
        border-radius: 5px;
      }
      .sendcomment {
        float: right;
        width: 80px;
        height: 35px;
        background: red;
        color: #fff;
        text-align: center;
        line-height: 35px;
        border-radius: 5%;
        // 鼠标小手
        cursor: pointer;
        margin-right: 39px;
      }
      .sendcommentLi {
        margin-bottom: 35px;
        .user {
          display: flex;
          justify-content: space-between;
          width: 435px;
          .user_div_one {
            display: flex;
            img {
              width: 40px;
              height: 40px;
            }
            strong {
              display: block;
              height: 40px;
              line-height: 60px;
            }
          }
          .sendcommentLi-div-one {
            line-height: 60px;
            height: 40px;
            span {
              font-size: 14px;
            }
            .sendtime {
              font-size: 12px;
              margin: 0 10px;
              color: rgb(158, 158, 158);
            }
          }
        }

        .sendcommentLi-div {
          width: 93%;
          float: left;
          margin: 10px 0 30px 0;
          .commentContent {
            background: #e9e9e9;
            box-sizing: border-box;
            padding: 10px;
            line-height: 20px;
            font-size: 13px;
            border-radius: 5px;
            margin-top: 5px;
          }
          .sendcommentLi-div-vertical {
            margin: 0 8px;
          }
          .like {
            margin-right: 5px;
          }
        }
      }
    }
  }

  .dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    background: red;
    border-radius: 50%;
    margin-right: 10px;
    margin-bottom: 5px;
  }
  .grid-content-cover {
    width: 100%;
    img {
      width: 320px;
    }
  }
  // 头像
  .headPic {
    width: 50px;
  }
  .left01 {
    /*flex 布局*/
    display: flex;
    /*实现垂直居中*/
    align-items: center;
    padding: 5px 15px;
    span {
      margin-left: 5%;
    }
    button {
      transform: translateX(190%);
    }
  }
  .left02 {
    box-sizing: border-box;
    padding: 0 15px;
  }
  .left03 {
    /*flex 布局*/
    display: flex;
    /*实现垂直居中*/
    align-items: center;
    /*实现水平居中*/
    justify-content: center;
    .left03-son {
      display: inline-block;
      padding: 30px;
    }
  }

  .left04 {
    /*flex 布局*/
    display: flex;
    /*实现垂直居中*/
    align-items: center;
    /*实现水平居中*/
    justify-content: center;
    padding-bottom: 15px;
    button {
      margin: 0 10px;
    }
  }
}

// 右
.grid-content-right {
  margin: 10px;
  border-radius: 5px;
  width: 90%;
  box-sizing: border-box;
  padding: 15px;
  margin-top: 10px;
  box-shadow: 4px 4px 55px 1px #e0e0e0;
  .grid-content-right-title {
    padding: 0 5px;
    margin-bottom: 15px;
    span {
      display: inline-block;
      width: 5px;
      height: 100%;
      margin-right: 5px;
      color: red;
      font-size: 14px;
      font-weight: 600;
      background: red;
    }
  }
  .mycover {
    width: 100%;
    position: relative;
    .desc_pic {
      position: absolute;
      top: 0px;
      right: 0px;
      width: 220px;
      height: 80px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .introduce-time {
      margin-top: 15px;
    }
    .introduce-num,
    .introduce-time {
      color: rgb(168, 168, 168);
      font-size: 14px;
    }
    .introduce-dec {
      margin-top: 15px;
      font-size: 14px;
    }
    .grid-content-right-ul {
      width: 100%;
      box-sizing: border-box;
      li {
        display: inline-block;
        width: 95%;
        margin: 10px;
        margin-right: 20px;
        margin-left: 8px;
        border-radius: 5px;
        .grid-content-right-li-title {
          margin-top: 6px;
          font-size: 14px;
          font-weight: 600;
        }
        img {
          width: 100%;
          border-radius: 5px;
        }
      }
    }
  }
}

// 按钮样式
.el-button.is-round {
  border-radius: 20px;
  padding: 9px 18px;
}

.el-button--danger {
  color: #fff;
  background-color: rgb(250, 40, 0);
  border-color: #f56c6c;
}

// 点击改变的样式
.addColor {
  color: rgb(240, 6, 6);
}

// 按钮样式
.btn {
  display: inline-block;
  width: 70px;
  height: 32px;
  // background: #ff0000;
  border: 1px solid #e6e6e6;
  border-radius: 24px;
  line-height: 32px;
  text-align: center;
  font-weight: 600;
  // color: whitesmoke;
  font-size: 14px;
  margin: 15px;
}
.el-textarea {
  width: 92%;
  height: 100%;
  margin-bottom: 10px;
}
</style>
