<template>
  <div class="drag" @mousedown="dragEagle"></div>
</template>

<script>
export default {
  props: {
    topHeight: {
      type: Object,
      default: () => {},
    },
    mainHeight: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      topRate: 0,
      bottomRate: 0,
    };
  },
  methods: {
    dragEagle(e) {
      const startY = e.clientY;
      const _this = this;
      document.onmousemove = function (e) {
        e.preventDefault();
        let dragHeight = {
          topHieght: 0,
          bottomHieght: 0,
        };
        dragHeight.topHieght = parseFloat(
          (
            _this.mainHeight.height *
            (_this.topRate === 0 ? 0.67 : _this.topRate)
          ).toFixed(2)
        );
        dragHeight.bottomHieght = parseFloat(
          (
            _this.mainHeight.height *
            (_this.bottomRate === 0 ? 0.33 : _this.bottomRate)
          ).toFixed(2)
        );
        // 得到鼠标拖动的宽高距离:
        const distY = e.clientY - startY;
        if (distY < 0) {
          dragHeight.topHieght -= Math.abs(distY);
          dragHeight.bottomHieght += Math.abs(distY);
        } else {
          dragHeight.topHieght += distY;
          dragHeight.bottomHieght -= distY;
        }
        let val = { ...dragHeight };
        _this.$emit("changeHeight", val);
      };

      document.onmouseup = function () {
        document.onmousemove = null;
        let topRate = parseFloat(
          (_this.topHeight.height / _this.mainHeight.height).toFixed(2)
        );
        _this.topRate = topRate;
        _this.bottomRate = 1 - topRate;
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.drag {
  width: 100%;
  height: 2px;
  background: #d5d5d5;
  cursor: ns-resize;
}
</style>