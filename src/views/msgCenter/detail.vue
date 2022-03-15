<template>
  <div class="detail-article">
    <article>
      <el-page-header @back="goBack" :content="directory" class="goBack">
      </el-page-header>

      <main class="main">
        <p class="title">{{ detailData.title }}</p>
        <p class="addressor">
          <span class="left">发件人：</span><span class="right">{{ detailData.addressor }}</span>
        </p>
        <p class="date">
          <span class="left">时 间：</span><span class="right">{{ detailData.date }}</span>
        </p>
        <p class="receiver">
          <span class="left">收件人：</span><span class="right">{{ detailData.receiver }}</span>
        </p>

        <p class="content">具体的内容</p>
      </main>
    </article>
  </div>
</template>

<script>
export default {
  name: "msgDetail",
  data() {
    return {
      oneStep: "",
      detailData: {}
    };
  },
  computed: {
    directory() {
      return `${this.oneStep} / ${this.detailData.title}`;
    },
  },
  mounted() {
    this.oneStep = this.$route.query.type
    this.detailData = JSON.parse(sessionStorage.getItem('msgVal'))
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" socped>
.detail-article {
  .goBack {
    padding: 20px;
    border-bottom: 1px solid #eaeaea;
    &:hover {
      background-color: #e8f4ff;
      color: #46a6ff;
      box-shadow: 0px 0px 2px 4px #f5f5f5;
    }
  }
  .main {
    padding: 10px 40px;
    .title {
      font-size: 22px;
      font-weight: 600;
      color: #333;
    }
    .addressor {
      .left {
        color: #999999;
      }
      .right {
        color: #46a6ff;
      }
    }
    .date {
      color: #999999;
    }
    .receiver {
      .left {
        color: #999999;
      }
      .right {
        color: #18FF3B;
      }
    }
    .content {
      padding: 15px;
      height: 560px;
      border: 1px solid #eaeaea;
    }
  }
}
</style>
<style>
.el-page-header__content {
  font-size: 16px;
  color: #666;
}
</style>
