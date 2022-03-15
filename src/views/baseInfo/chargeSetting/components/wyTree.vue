<template>
  <div class="wyTree">
    <article class="sideBar" :style="contentStyleObj">
      <el-tree
        v-loading="loading"
        ref="tree"
        accordion
        node-key="id"
        :data="wyList"
        :props="defaultPropOne"
        :expand-on-click-node="false"
        :highlight-current="true"
        @node-click="handleNodeClick"
      >
        <span slot-scope="{ data }" class="custom-tree-node">
          <template>
            <svg-icon
              v-if="data.type === 'wy'"
              icon-class="compony"
              style="margin-right: 3px"
            />
            <svg-icon v-else icon-class="houseDict" style="margin-right: 3px" />
          </template>
          <span style="font-size: 13px">{{ data.label }}</span>
        </span>
      </el-tree>
      <div
        id="rightMove"
        style="z-index: 99999"
        :style="{ height: dragStyleHeight }"
        @mousedown="dragEagle"
      />
    </article>
  </div>
</template>

<script>
import { getWyList } from "@/api/system/houseRes";
export default {
  props: {
    contentStyleObj: {
      type: Object,
      default: () => {},
    },
    hiddenBuilding: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      top: 0,
      left: 0,
      defaultPropOne: {
        children: "buildingList",
        label: "label",
      },
      wyList: [],
      loading: false,
    };
  },
  created() {
    // 紧凑结构
    this.getHomeTable();
  },
  computed: {
    dragStyleHeight() {
      let dragHeight =
        this.contentStyleObj.height.slice(
          0,
          this.contentStyleObj.height.indexOf("p")
        ) -
        2 +
        "px";
      return dragHeight;
    },
  },
  methods: {
    // 紧凑结构
    getHomeTable() {
      this.loading = true;
      getWyList().then((res) => {
        const newArr = [...res.data];
        this.getRangeTree(newArr, this.wyList);
        this.$nextTick(() => {
          // treeBox 元素的ref   value 绑定的node-key
          this.$refs.tree.setCurrentKey(this.wyList[0].propertyId);
        });
        this.handleNodeClick(this.wyList[0])
        this.loading = false;
      });
    },
    getRangeTree(treeList, newTreeList) {
      treeList.map((c) => {
        let tempData = {
          label: c.hasOwnProperty("buildingId")
            ? c.buildingName
            : `[${c.number}] ${c.propertyName}`,
          id: c.hasOwnProperty("buildingId") ? c.buildingId : c.propertyId,
          propertyId: c.propertyId,
          buildingId: c.hasOwnProperty("buildingId") ? c.buildingId : undefined,
          type: c.hasOwnProperty("buildingId") ? "build" : "wy",
          disabled: false,
        };
        if (c.buildingList && c.buildingList.length > 0) {
          if (!this.hiddenBuilding) {
            tempData.buildingList = [];
            this.getRangeTree(c.buildingList, tempData.buildingList);
          }
        }
        newTreeList.push(tempData);
      });
    },
    handleNodeClick(node) {
      const data = {
        node: node,
        value: true,
      };
      this.$emit("changeShow", data);
    },
    // 鼠标拖拽事件
    dragEagle: function (e) {
      const targetDiv = document.getElementById("rightMove"); // e.target.parentNode.parentNode;.children[0]
      const treeWidth = document.querySelector(".sideBar").offsetWidth;
      // 得到点击时该地图容器的宽高：
      const startX = e.clientX;
      const _this = this;
      document.onmousemove = function (e) {
        e.preventDefault();
        // 得到鼠标拖动的宽高距离:
        const distX = e.clientX - startX;
        document.querySelector(".sideBar").style.width =
          treeWidth + distX + "px";
        _this.$emit("transWidth", treeWidth + distX);
      };
      document.onmouseup = function () {
        document.onmousemove = null;
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.wyTree {
  box-sizing: border-box;
  margin: 20px 20px 0 18px;
  position: relative;
  .sideBar {
    width: 274px;
    padding: 12px 4px 12px 12px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    overflow-y: scroll;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
    #rightMove {
      width: 5px;
      cursor: e-resize;
      position: absolute;
      right: 0px;
      top: 0px;
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
