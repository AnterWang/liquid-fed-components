<template>
	<el-input v-model="inputValue" v-bind="$attrs" clearable class="liquid-input-select" @input="inputChange">
		<template #append>
			<el-select v-model="inputValue" style="width: 70px;font-size: 13px;" placeholder="选择" @change="selectChange">
				<el-option v-for="(item, index) in selectList" :key="index" :value="getValue(item)" :label="getLabel(item)" />
			</el-select>
		</template>
	</el-input>
</template>

<script setup lang="ts" name="LInputSelect">
import { ref, reactive, computed } from "vue"

const props = defineProps({
	value: { // v-model:value
		type: [String, Number],
		default: ''
	},
	selectList: {
		type: Array,
		default: () => []
	},
	valueKey: {
		type: [String],
		default: 'value'
	},
	labelKey: {
		type: [String],
		default: 'label'
	}
});
const emits = defineEmits(['update:value', 'change']);

const inputValue = computed({
	get: () => {
		return props.value
	},
	set: (val) => {
		return val
	}
});

const getValue = (v: any) => {
	const key = props.valueKey
	return v[key]
}
const getLabel = (v: any) => {
	const key = props.labelKey
	return v[key]
}

const inputChange = (val: string | number) => {
	// console.log(val)
	emits('update:value', val)
	emits('change', val)
}

const selectChange = (val: string | number) => {
	// console.log(val)
	emits('update:value', val)
	emits('change', val)
}

</script>

<style lang="scss" scoped>
.liquid-input-select {
	width: 100%;

	:deep(.el-input-group__append) {
		.el-input__wrapper {
			.el-input__inner {
				color: transparent;
			}
		}
	}
}
</style>
