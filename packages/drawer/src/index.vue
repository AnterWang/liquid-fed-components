<template>
	<el-drawer v-model="drawerVisible" :title="title" :size="width" v-bind="$attrs" destroy-on-close lock-scroll
		@close="close" class="liquid-drawer">
		<template #default>
			<slot></slot>
		</template>
		<!-- header -->
		<template v-if="slots.header" #header>
			<slot name="header"></slot>
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
	</el-drawer>
</template>

<script setup lang="ts" name="LDrawer">
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
	width: [String, Number], // drawer 的 size 改写为 width
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
const drawerVisible = computed({
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
