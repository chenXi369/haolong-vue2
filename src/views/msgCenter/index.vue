<template>
  <div>
    <article class="page-msgCenter">
      <section class="head-btn">
        <span class="btn-item"
          ><el-button
            type="primary"
            icon="el-icon-edit"
            plain
            @click="editMessage"
            >新建信息</el-button
          ></span
        >
        <span class="btn-item"
          ><el-button
            type="danger"
            icon="el-icon-delete"
            plain
            @click="deleteSelect"
            >删除选中</el-button
          ></span
        >
        <span class="btn-item"
          ><el-button type="success" icon="el-icon-s-promotion" plain
            >发送信息</el-button
          ></span
        >
      </section>

      <section>
        <el-tabs v-model="active" tab-position="left" style="height: 780px">
          <el-tab-pane name="inBox" >
            <el-button slot="label" class="content-btn"
              ><svg-icon icon-class="inBox"></svg-icon> 收件箱({{
                inNum
              }})</el-button
            >
            <In-Box
              :inTableData="inTableData"
              @inDeleteClick="inDeleteClick"
              @inReduce="inReduce"
            ></In-Box>
          </el-tab-pane>
          <el-tab-pane name="outBox" >
            <el-button slot="label" class="content-btn"
              ><svg-icon icon-class="outBox"></svg-icon> 发件箱({{
                outNum
              }})</el-button
            >
            <Out-Box></Out-Box>
          </el-tab-pane>
          <el-tab-pane name="dustbin" >
            <el-button slot="label" class="content-btn"
              ><svg-icon icon-class="dustbin"></svg-icon> 垃圾箱({{
                dustbinNum
              }})</el-button
            >
            <Dustbin></Dustbin>
          </el-tab-pane>
          <el-tab-pane name="roughBook" >
            <el-button slot="label" class="content-btn"
              ><svg-icon icon-class="roughBook"></svg-icon> 草稿本({{
                bookNum
              }})</el-button
            >
            <Rough-Book></Rough-Book>
          </el-tab-pane>
        </el-tabs>
      </section>

      <Tinymce :editDialog="editDialog" @closeEdit="closeEdit"></Tinymce>
    </article>
  </div>
</template>

<script>
import InBox from "./components/inBox";
import OutBox from "./components/outBox";
import Dustbin from "./components/dustbin";
import RoughBook from "./components/roughBook";
import Tinymce from "./components/tinymce";

export default {
  name: "msgCenter",
  data() {
    return {
      active: 'inBox',
      inNum: 0,
      outNum: 0,
      dustbinNum: 0,
      bookNum: 0,
      editDialog: false,
      inTableData: [
        {
          date: "2016-05-03  08:00",
          addressor: "张三",
          title: "招商信诺赠险电子保单 P00006667895",
          receiver: "Joker",
        },
        {
          date: "2016-05-02  12:00",
          addressor: "李四",
          title: "招商信诺赠险电子保单 P00006667895",
          receiver: "Joker",
        },
        {
          date: "2016-05-04  15:00",
          addressor: "王五",
          title: "招商信诺赠险电子保单 P00006667895",
          receiver: "Joker",
        },
        {
          date: "2016-05-01  20:00",
          addressor: "王大毛",
          title: "招商信诺赠险电子保单 P00006667895",
          receiver: "Joker",
        },
        {
          date: "2016-05-08  22:00",
          addressor: "亚瑟",
          title: "招商信诺赠险电子保单 P00006667895",
          receiver: "Joker",
        },
      ],
      inReduceList: [],
    };
  },
  components: {
    InBox,
    OutBox,
    Dustbin,
    RoughBook,
    Tinymce,
  },
  methods: {
    editMessage() {
      this.editDialog = true;
    },
    closeEdit() {
      this.editDialog = false;
    },
    inReduce(val) {
      this.inReduceList = val;
    },
    // 删除选中项
    deleteSelect() {
      const newArr = this.inTableData.concat(this.inReduceList)
      console.log(newArr)
    },
    // 收件箱的单删
    inDeleteClick(val) {
      this.inTableData.splice(val, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.page-msgCenter {
  text-align: right;
  .head-btn {
    padding: 12px;
    .btn-item {
      margin: 8px;
    }
  }
  .content-btn {
    margin: 0px 10px;
  }
}
</style>
