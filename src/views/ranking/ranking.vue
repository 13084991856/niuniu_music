<template>
  <div v-loading="loading">
    <layout>
      <song-list
        title="所有榜单前三十"
        :SongListData="featureRankingglobal"
        :ShowPlayCount="false"
      />
    </layout>

    <layout>
      <song-list
        title="歌手榜单前三十"
        :SongListData="artistList"
        :ShowPlayCount="false"
      />
    </layout>
    <layout>
      <song-list
        title="最热主播榜单前三十"
        :SongListData="popularList"
        :ShowPlayCount="false"
      />
    </layout>
  </div>
</template>

<script>
import layout from "@/components/content/layout/layout.vue";
import SongList from "@/components/content/song_list/SongList.vue";
export default {
  components: {
    SongList,
    layout,
  },
  data() {
    return {
      loading: true,
      // 所有榜单
      featureRankingglobal: [],
      // artist歌手榜单
      artistList: [],
      //最热主播榜单
      popularList: [],
    };
  },
  methods: {
    //  获取排行榜单
    getniceSongList() {
      this.$http.get("/toplist").then((result) => {
        //  所有榜单
        this.featureRankingglobal = result.data.list.slice(0, 30);
        this.loading = false;
      });
      this.$http.get("/toplist/artist").then((result) => {
        //  歌手榜单
        this.artistList = result.data.list.artists.slice(0, 30);
        //console.log(this.artistList);
        this.loading = false;
      });
      this.$http.get("/dj/toplist/popular?limit=30").then((result) => {
        //  电台 - 最热主播榜
        this.popularList = result.data.data.list;
        this.loading = false;
      });
    },
  },
  // 生命周期函数  页面刷新时调用
  mounted() {
    this.getniceSongList();
  },
};
</script>
<style lang="less" scoped>
</style>
