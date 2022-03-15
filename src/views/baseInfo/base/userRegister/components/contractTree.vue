<template>
  <div class="article">
    <div class="sideBar" :style="contentStyleObj">
      <el-tree
        ref="tree"
        :key="isExpand"
        accordion
        :data="orgList"
        :default-expand-all="isExpand"
        :props="isExpand ? defaultPropTwo : defaultPropOne"
        :expand-on-click-node="false"
        :highlight-current="true"
        :default-checked-keys="defaultChecked"
        @node-click="handleNodeClick"
        @node-contextmenu="openMenu"
      >
        <span slot-scope="{ data }" class="custom-tree-node">
          <template v-if="isExpand">
            <svg-icon
              v-if="data.groupType === '0'"
              icon-class="jituan"
              style="margin-right: 3px"
            />
            <svg-icon
              v-else-if="data.groupType === '1'"
              icon-class="compony"
              style="margin-right: 3px"
            />
            <svg-icon
              v-else-if="data.groupType === '2'"
              icon-class="houseDict"
              style="margin-right: 3px"
            />
            <svg-icon
              v-else
              icon-class="wy"
              style="margin-right: 3px"
            />
          </template>
          <template v-else>
            <svg-icon
              v-if="data.hasOwnProperty('simpleOverdueFine')"
              icon-class="compony"
              style="margin-right: 3px"
            />
            <svg-icon
              v-else-if="data.groupType === '1'"
              icon-class="jituan"
              style="margin-right: 3px"
            />
            <svg-icon
              v-else
              icon-class="houseDict"
              style="margin-right: 3px"
            />
          </template>
          <span style="font-size: 14px">{{
            isExpand ? data.orgName : data.propertyName || data.buildingName
          }}</span>
        </span>
      </el-tree>
      <!-- <ul
        v-show="visible"
        :style="{ left: left + 'px', top: top + 'px' }"
        class="contextmenu"
      >
        <li @click="createRooms">成批生成房间</li>
        <li>关闭所有</li>
      </ul> -->
      <div id="rightMove" @mousedown="dragEagle" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showTable: {
      type: Boolean,
      default: false
    },
    contentStyleObj: {
      type: Object,
      default: () => {}
    },
    orgList: {
      type: Array,
      default: () => []
    },
    isExpand: {
      type: Boolean,
      default: false
    },
    defaultChecked: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // visible: false,
      top: 0,
      left: 0,
      defaultPropOne: {
        children: 'buildingList',
        label: 'orgName'
      },
      defaultPropTwo: {
        children: 'children',
        label: 'orgName'
      }
    }
  },
  watch: {
    // visible(value) {
    //   if (value) {
    //     document.body.addEventListener("click", this.closeMenu);
    //   } else {
    //     document.body.removeEventListener("click", this.closeMenu);
    //   }
    // },
  },
  methods: {
    openMenu(e, object, Node, VueComponent) {
      // const menuMinWidth = 105;
      // const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      // const offsetWidth = this.$el.offsetWidth; // container width
      // const maxLeft = offsetWidth - menuMinWidth; // left boundary
      // const left = e.clientX - offsetLeft + 15; // 15: margin right

      // if (left > maxLeft) {
      //   this.left = maxLeft;
      // } else {
      //   this.left = left;
      // }

      // this.top = e.clientY - 250;
      // console.log(this.top);
      // this.visible = true;
    },
    handleNodeClick(node) {
      const data = {
        node: node,
        value: true
      }
      this.$emit('changeShow', data)
    },

    // 鼠标拖拽事件
    dragEagle: function(e) {
      const targetDiv = document.getElementById('rightMove') // e.target.parentNode.parentNode;.children[0]
      const treeWidth = document.querySelector('.sideBar').offsetWidth
      // 得到点击时该地图容器的宽高：

      const startX = e.clientX

      const _this = this

      document.onmousemove = function(e) {
        e.preventDefault()
        // 得到鼠标拖动的宽高距离:
        const distX = e.clientX - startX
        document.querySelector('.sideBar').style.width =
          treeWidth + distX + 'px'
        _this.$emit('changeWidth', treeWidth + distX)
      }

      document.onmouseup = function() {
        document.onmousemove = null
      }
    },
    // 打开批量生成房间的弹窗
    createRooms() {
      this.$emit('createRoom', true)
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.article {
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
