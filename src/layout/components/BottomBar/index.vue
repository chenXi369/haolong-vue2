<template>
  <div class="bottom-view">
    <el-popover placement="top" width="200"  trigger="click">
      <p>{{ company }} / {{ department }}</p>
      <span slot="reference" class="bottom-msg">登录人：admin</span>
    </el-popover>

    <span class="line-fg"></span>
    <el-popover placement="top" width="300" trigger="click">
      <h4 style="margin-top: 0px">在线列表</h4>
      <div v-for="o in 4" :key="o" class="text item">
        {{ "name " + o }}
      </div>
      <span slot="reference" class="bottom-msg">在线人数：10</span>
    </el-popover>
    <span class="line-fg"></span>
    <span class="bottom-label">
      <svg-icon class-name="size-icon" icon-class="officeWeb"></svg-icon>
      <el-link
        type="primary"
        href="http://www.oklong.com.cn"
        target="_blank"
        class="officeWeb"
        >www.oklong.com.cn</el-link
      >
    </span>
    <span class="line-fg"></span>
    <el-popover placement="top" width="600" trigger="click">
      <!-- 输入嵌套内容 -->
      <h2 style="margin-top: 0px">
        好邻邦物业管理信息系统<span style="font-size: 15px">(财务版)</span>
      </h2>
      <p>网页端 Version 1.0.0</p>
      <div>
        <span>用户名：</span>
        <p style="padding: 0 80px 0 44px">深圳×××公司</p>
      </div>
      <div>
        <span>服务商： </span>
        <p style="padding: 0 80px 0 44px">深圳市×××有限公司</p>
        <p style="padding: 0 80px 0 44px">版权所有（C） 1997-2020 好邻邦软件</p>
      </div>
      <div>
        <span>声 明： </span>
        <p style="padding: 0 80px 0 44px; margin-bottom: 0px">
          本计算机程序受版权法和国际条约的保护。如未经授权而擅自复制或者传播本程序（或其中任何部分），
          将受到严厉的刑事及民事制裁，并将在法律许可的范围内受到最大可能的起诉。
        </p>
      </div>
      <span slot="reference" class="bottom-msg"
        >代理商信息：<span>×××有限公司：0755-26503033</span></span
      >
    </el-popover>
    <span class="line-fg"></span>
    <el-popover placement="top" width="600" trigger="click">
      <!-- 输入嵌套内容 -->
      <h2 style="margin-top: 0px">
        好邻邦物业管理信息系统<span style="font-size: 15px">(财务版)</span>
      </h2>
      <p>网页端 Version 1.0.0</p>
      <div>
        <span>用户名：</span>
        <p style="padding: 0 80px 0 44px">深圳好邻邦物业管理集团公司</p>
      </div>
      <div>
        <span>开发商： </span>
        <p style="padding: 0 80px 0 44px">深圳市好邻邦电脑软件技术有限公司</p>
        <p style="padding: 0 80px 0 44px">版权所有（C） 1997-2020 好邻邦软件</p>
      </div>
      <div>
        <span>声 明： </span>
        <p style="padding: 0 80px 0 44px; margin-bottom: 0px">
          本计算机程序受版权法和国际条约的保护。如未经授权而擅自复制或者传播本程序（或其中任何部分），
          将受到严厉的刑事及民事制裁，并将在法律许可的范围内受到最大可能的起诉。
        </p>
      </div>

      <span slot="reference" class="bottom-msg"
        >服务商信息：<span
          >深圳市好邻邦技术软件有限公司：0755-26503033</span
        ></span
      >
    </el-popover>
  </div>
</template>

<script>
export default {
  data() {
    return {
      company: "深圳好邻邦物业管理集团公司",
      department: "集团工程部"
    };
  },
  methods: {},
};
</script>

<style lang="scss">
.bottom-view {
  padding: 0 10px;
  z-index: 2020;
  width: 100%;
  height: 30px;
  color: #666;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: fixed;
  bottom: 0px;
  background: #ffffff;
  box-shadow: 0 0 2px 2px rgba(0, 21, 41, 0.08);
  .bottom-label {
    line-height: 22px;
    font-size: 13px;
    padding: 0 4px;
    margin: 4px 4px;
    border-radius: 4px;
    display: inline-block;
    &:first-child {
      margin-left: 12px;
    }
  }
  .bottom-msg {
    line-height: 22px;
    font-size: 13px;
    padding: 0 10px;
    margin: 4px 8px;
    display: inline-block;
    &:hover {
      background-color: #e8f4ff;
      color: #46a6ff;
      border-radius: 12px;
    }
    &:active {
      background-color: #e8f4ff;
      color: #46a6ff;
      border-radius: 12px;
    }
  }
  .line-fg {
    content: "";
    display: inline-block;
    width: 1px;
    height: 12px;
    margin: 0px 20px;
    background: #999;
  }
  .officeWeb {
    padding-bottom: 3px;
    margin-left: 6px;
  }
}
</style>
