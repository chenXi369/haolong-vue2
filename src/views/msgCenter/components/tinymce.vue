<template>
  <div class="components-container">
    <el-dialog
      title="新建信息"
      :visible="editDialog"
      width="900px"
      min-width="100%"
      :before-close="handleClose"
      center
    >
      <div>
        <tinymce v-model="content" :height="300" />
      </div>
      <div class="editor-content" v-html="content" />
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";

export default {
  name: "TinymceDemo",
  props: {
    editDialog: {
      type: Boolean,
      default: false
    }
  },
  components: { Tinymce },
  data() {
    return {
      content: `<h1 style="text-align: center;">欢迎使用 TinyMCE demo!</h1><p style="text-align: center; font-size: 15px;"><ul>
        <li>Our <a href="//www.tinymce.com/docs/">documentation</a> is a great resource for learning how to configure TinyMCE.</li>
        <li>Have a specific question? Visit the <a href="https://community.tinymce.com/forum/">Community Forum</a>.</li>
        <li>We also offer enterprise grade support as part of <a href="https://tinymce.com/pricing">TinyMCE premium subscriptions</a>.</li>
      </ul>`,
    };
  },
  methods: {
    handleClose() {
      this.$emit("closeEdit", false)
    }
  }
};
</script>

<style scoped>
.editor-content {
  margin-top: 20px;
}
</style>

