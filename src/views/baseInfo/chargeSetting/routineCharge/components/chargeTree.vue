<template>
  <div class="chargeTree" v-if="showTree">
    <div class="sideBar" :style="contentStyleObj">
      <el-tree
        ref="chargeTree"
        highlight-current
        :props="treeList"
        :load="loadNode"
        lazy
        accordion
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
      >
        <span slot-scope="{ data }" class="custom-tree-node">
          <template>
            <svg-icon
              v-if="data.propertyState === 1"
              icon-class="compony"
              style="margin-right: 4px"
            />
            <svg-icon v-else icon-class="charge" style="margin-right: 4px" />
          </template>
          <span style="font-size: 13px"
            ><template v-if="data.no !== undefined"> [{{ data.no }}] </template
            >{{ data.propertyName }}</span
          >
        </span>
      </el-tree>
      <div id="rightMove" @mousedown="dragEagle" />
    </div>
  </div>
</template>

<script>
import {
  ChargeStandItems,
  ChargeItemTree,
  ChargeStandSource,
} from "@/api/system/commonCharge";

export default {
  props: {
    treeList: {
      type: Array,
      default: () => []
    },
    showTree: {
      type: Boolean,
      default: false
    },
    contentStyleObj: {
      type: Object,
      default: () => {},
    },
    chargeItems: {
      type: Array,
      default: () => [],
    },
    defaultSpread: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      top: 0,
      left: 0,
      wyItemsList: [],
      wyChargeItemList: [],
      selectedNodeId: 0
    };
  },
  methods: {
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
    //懒加载时触发
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.$nextTick(() => {
          let newArr = [...this.treeList]
          setTimeout(() => {
            return resolve(newArr);
          }, 500);
        });
      }
      if (node.level > 2) return resolve([]);

      if (node.level === 1) {
        this.$nextTick(() => {
          return this.getChildrenNode(node, resolve);
        });
      }
      if (node.level === 2) {
        this.$nextTick(() => {
          return this.getChargeItems(node, resolve);
        });
      }
    },
    // 二级节点
    getChildrenNode(node, resolve) {
      this.selectedNodeId = node.data.propertyId;
      ChargeStandItems({ propertyId: this.selectedNodeId }).then((res) => {
        this.wyItemsList = [];
        this.getRangeTree(res.data, this.wyItemsList);
        return resolve(this.wyItemsList);
      });
      this.getChargeStandSource(this.selectedNodeId);
    },
    // 三级节点
    getChargeItems(node, resolve) {
      ChargeItemTree({
        propertyId: this.selectedNodeId,
        billingItemsId: node.data.propertyId,
      }).then((res) => {
        this.wyChargeItemList = [];
        this.getRangeTree(res.data, this.wyChargeItemList);
        return resolve(this.wyChargeItemList);
      });
    },
    getChargeStandSource(id) {
      ChargeStandSource({ propertyId: id }).then((res) => {
        this.$emit("chargeItemOptions", [...res.data]);
      });
    },
    getRangeTree(treeList, newTreeList) {
      treeList.map((c) => {
        let tempData = {
          propertyName: c.billingName || c.projectName,
          propertyId:
            c.chargingStandardList !== undefined
              ? c.billingItemsId
              : c.chargingStandardId,
          no: c.no,
          leaf:
            c.chargingStandardList && c.chargingStandardList.length > 0
              ? false
              : true,
          nodeType: c.chargingStandardList === undefined ? 3 : 2,
        };
        if (c.chargingStandardList && c.chargingStandardList.length > 0) {
          tempData.chargingStandardList = [];
          this.getRangeTree(
            c.chargingStandardList,
            tempData.chargingStandardList
          );
        }
        newTreeList.push(tempData);
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.chargeTree {
  box-sizing: border-box;
  margin: 22px 22px 0 12px;
  position: relative;
  .sideBar {
    width: 274px;
    padding: 12px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    overflow-y: scroll;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
    #rightMove {
      width: 3px;
      height: 100%;
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
