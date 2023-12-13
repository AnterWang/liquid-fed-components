<template>
	<div class="liquid-search-form">
		<el-form ref="formRef" :model="searchParams" :inline="false" label-position="left" label-width="auto">
			<el-row :gutter="10">
				<slot name="search"></slot>

				<template v-if="!collapsed">
					<slot name="searchCollapsed"></slot>
				</template>

				<el-col :span="colSpan" style="margin-left: auto;">
					<div class="operation">
						<el-button type="primary" :icon="Search" @click="search">搜索</el-button>
						<el-button :icon="Delete" @click="reset">重置</el-button>
						<template v-if="slotSearchCollapsed">
							<el-button type="primary" link class="search-isOpen" @click="collapsed = !collapsed">
								{{ collapsed ? "展开" : "收起" }}
								<el-icon class="el-icon--right">
									<component :is="collapsed ? ArrowDown : ArrowUp"></component>
								</el-icon>
							</el-button>
						</template>
					</div>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>
<script setup lang="ts" name="LSearchForm">
import { computed, ref, useSlots } from "vue";
import { Delete, Search, ArrowDown, ArrowUp } from "@element-plus/icons-vue";

interface FormProps {
	searchParams?: { [key: string]: any }; // 搜索参数
	searchInitParams?: { [key: string]: any }; // 搜索默认参数 （如有）
	colSpan?: number; // col span值，默认为6，如有修改，外部solt的col值要注意
}

// props
const props = withDefaults(defineProps<FormProps>(), {
	searchParams: () => ({}), // v-model:searchParams
	searchInitParams: () => ({}),
	colSpan: 6
});

// emit
const emits = defineEmits(['search', 'reset', 'update:searchParams']);

// 搜索
const search = () => {
	emits('search')
}

// 重置
const reset = () => {
	let initParams: any = {}
	// 重置搜索表单的时，如果有默认搜索参数，则重置默认的搜索参数
	Object.keys(props.searchInitParams).forEach((key) => {
		initParams[key] = props.searchInitParams[key];
	});
	emits('update:searchParams', initParams)
	setTimeout(() => {
		emits('reset')
	}, 0)
}

// 是否默认折叠搜索项
const collapsed = ref(true);
// 是否有折叠项
const slotSearchCollapsed = !!useSlots().searchCollapsed;

</script>

<style lang="scss" scoped>
// search-form 表格搜索样式
.liquid-search-form {
	padding-bottom: 0;

	:deep(.el-form) {

		.el-input,
		.el-select,
		.el-cascader,
		.el-date-editor--timerange,
		.el-date-editor--datetimerange,
		.el-date-editor--daterange {
			width: 100%;
		}

		// 去除时间选择器上下 padding
		.el-range-editor.el-input__wrapper {
			padding: 0 10px;
		}

		// el-select 为多选时不换行显示
		.el-select__tags {
			overflow: hidden;
			white-space: nowrap;
		}

		.el-form-item__label-wrap {
			margin-right: 0 !important;
		}
	}

	.operation {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 15px;
	}

}
</style>
