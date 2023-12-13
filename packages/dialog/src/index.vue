<template>
  <el-dialog v-model="dialogVisible" :title="title" v-bind="$attrs" destroy-on-close lock-scroll @close="close"
    class="liquid-dialog">
    <template #default>
      <slot></slot>
    </template>
    <!-- footer -->
    <template v-if="slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
    <template v-if="!slots.footer && showFooter" #footer>
      <div>
        <el-button @click="cancel">{{ cancelText }}</el-button>
        <el-button type="primary" @click="confirm" :loading="confirmLoading">{{ confirmText }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="LDialog">
import { computed, useAttrs, useSlots } from "vue";

const props = defineProps({
  show: { // v-model:show
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'title'
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  confirmText: {
    type: String,
    default: '确认'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  confirmLoading: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(['update:show', 'cancel', 'confirm', 'close']);

// 插槽
const slots = useSlots()

// 弹窗状态
const dialogVisible = computed({
  get: () => {
    return props.show
  },
  set: (val) => {
    return val
  }
});

// 取消
const cancel = () => {
  emits('update:show', false)
  emits('cancel')
}

// 确认
const confirm = () => {
  emits('confirm')
}

// 关闭回调
const close = () => {
  emits('update:show', false)
  emits('close')
}
</script>

<style lang="scss" scoped>
/* 垂直水平居中，如开启dialog拖动，第一次拖动会有卡一下 */
/* .el-overlay-dialog { */
  .liquid-dialog {
    top: 40%;
    margin: 0 auto !important;
    transform: translateY(-40%);
  }
/* } */
</style>
