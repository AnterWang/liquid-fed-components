<template>
	<div class="liquid-pro-table">
		<SearchForm v-if="isShowSearch" v-show="searchShow" @reset="search" @search="search"
			v-model:searchParams="searchParamsAsyc" :searchInitParams="searchInitParams" :colSpan="colSpan"
			:class="{ 'card': cardStyle, 'margin-b': cardStyle }">
			<template v-if="!!useSlots().search" #search>
				<slot name="search"></slot>
			</template>
			<template v-if="!!useSlots().searchCollapsed" #searchCollapsed>
				<slot name="searchCollapsed"></slot>
			</template>
		</SearchForm>

		<!-- 表格内容 -->
		<div class="liquid-table" :class="{ 'card': cardStyle }">
			<!-- 表格头部 操作按钮 -->
			<div class="table-header">
				<div class="header-button-lf">
					<slot name="tableHeader" :selectedListIds="selectedListIds" :selectList="selectedList" :isSelected="isSelected">
					</slot>
				</div>
				<div class="header-button-ri" v-if="toolButton">
					<el-button :icon="Refresh" circle @click="getTableList"> </el-button>
					<el-button :icon="Operation" circle v-if="columns.length" @click="openColSetting"> </el-button>
					<el-button :icon="Search" circle v-if="isShowSearch" @click="searchShow = !searchShow"> </el-button>
				</div>
			</div>
			<!-- 表格主体 -->
			<el-table ref="tableRef" v-bind="$attrs" v-loading="loading" :data="tableData" :border="border" :row-key="rowKey"
				@selection-change="selectionChange">
				<!-- 默认插槽 -->
				<slot></slot>
				<template v-for="item in tableColumns" :key="item">
					<!-- selection || index -->
					<el-table-column v-bind="item" :align="item.align ?? 'center'" :width="item.width"
						:reserve-selection="item.type == 'selection'" v-if="item.type == 'selection' || item.type == 'index'">
					</el-table-column>
					<!-- expand 支持 tsx 语法 && 作用域插槽 (tsx > slot) -->
					<el-table-column v-bind="item" :align="item.align ?? 'center'" v-if="item.type == 'expand'" v-slot="scope">
						<component :is="item.render" :row="scope.row" v-if="item.render"> </component>
						<slot :name="item.type" :row="scope.row" v-else></slot>
					</el-table-column>
					<!-- other 循环递归 -->
					<TableColumn v-if="!item.type && item.prop && item.isShow" :column="item">
						<template v-for="slot in Object.keys($slots)" #[slot]="scope">
							<slot :name="slot" :row="scope.row"></slot>
						</template>
					</TableColumn>
				</template>
				<!-- 无数据 -->
				<template #empty>
					<div class="table-empty">
						<img src="./images/notData.png" alt="notData" />
						<div>暂无数据</div>
					</div>
				</template>
			</el-table>
			<!-- 分页组件 -->
			<Pagination v-if="pagination" :pageable="pageable" :handleSizeChange="handleSizeChange"
				:handleCurrentChange="handleCurrentChange" />
		</div>
		<!-- 列设置 -->
		<ColSetting v-if="toolButton" ref="colRef" v-model:colSetting="colSetting" />
	</div>
</template>

<script setup lang="ts" name="LProTable">
import { ref, watch, computed, provide, onMounted, useSlots } from "vue";
import { Refresh, Operation, Search } from "@element-plus/icons-vue";
import { useTable } from "./hooks/useTable";
import { useSelection } from "./hooks/useSelection";
import { ColumnProps } from "./interface/index";
import { TableProps } from "element-plus";
import SearchForm from "@/search-form/src/index.vue"
import Pagination from "./pagination.vue";
import ColSetting from "./colSetting.vue";
import TableColumn from "./tableColumn.vue";

// 初始化的时候需要做的事情就是 设置表单查询默认值 && 获取表格数据(reset函数的作用刚好是这两个功能)
onMounted(() => {
	props.mountedRequest && search();
});

interface ProTableProps extends Partial<Omit<TableProps<any>, "data">> {
	columns: ColumnProps[]; // 列配置项
	pagination?: boolean; // 是否需要分页组件 ==> 非必传（默认为true）
	pageSize?: number; // 每页条数 ===> 默认10 非必传
	border?: boolean; // 是否带有纵向边框 ==> 非必传（默认为true）
	toolButton?: boolean; // 是否显示表格功能按钮 ==> 非必传（默认为true）
	rowKey?: string; // 当表格数据多选时，所指定的 id ==> 非必传（默认为 id）
	cardStyle?: boolean; // 是否为卡片风格 ==> 非必传（默认为true）
	// 请求信息参数 v
	requestApi: (params: any) => Promise<any>; // 请求表格数据的api ==> 必传
	requestParam?: any; // 初始化请求参数 ==> 非必传（默认为{}
	requestPageName?: any; // 初始化请求参数 ===> 分页参数名称 ===> 非必传
	requestCallback?: (data: any) => any; // 返回数据的回调函数，可以对数据进行处理 ==> 非必传
	// 搜索项
	searchParams?: any; // 搜索参数 ==> 如需搜索，必传
	searchInitParams?: any; // 搜索默认参数 ==> 非必传
	colSpan?: any; // 非必传
	// 是否在onMounted请求接口
	mountedRequest?: boolean; // 默认true
}

// 接受父组件参数，配置默认值
const props = withDefaults(defineProps<ProTableProps>(), {
	columns: () => [],
	pagination: true,
	pageSize: 10,
	border: true,
	toolButton: true,
	rowKey: "id",
	cardStyle: true,
	// 请求信息参数 v
	requestParam: {},
	requestPageName: ['pageNum', 'pageSize'],
	// 搜索项
	searchParams: {},
	searchInitParams: {},
	colSpan: 6,
	// 是否在onMounted请求接口
	mountedRequest: true
});

// * --- table --- * //
// 表格 DOM 元素
// const tableRef = ref<InstanceType<typeof ElTable>>();
const tableRef = ref<HTMLElement | null>(null)
// 表格多选 Hooks
const { selectionChange, selectedList, selectedListIds, isSelected } = useSelection(props.rowKey);
// 表格操作 Hooks
const { tableData, pageable, loading, getTableList, handleSizeChange, handleCurrentChange, handleChangePager, updatedTotalParam } =
	useTable(props.pagination, props.pageSize, props.requestApi, props.requestParam, props.requestPageName, props.requestCallback);

// 接收 columns 并设置为响应式
const tableColumns = ref<ColumnProps[]>(props.columns);

// 监听页面 requestParam 改化，重新获取表格数据
watch(
	() => props.requestParam,
	() => {
		getTableList();
	},
	{ deep: true }
);

// 定义 enumMap 存储 enum 值（避免异步请求无法格式化单元格内容 || 无法填充搜索下拉选择）
const enumMap = ref(new Map<string, { [key: string]: any }[]>());
provide("enumMap", enumMap);
// 扁平化 columns && 处理 tableColumns 数据
const flatColumnsFunc = (columns: ColumnProps[], flatArr: ColumnProps[] = []) => {
	columns.forEach(async col => {
		if (col._children?.length) flatArr.push(...flatColumnsFunc(col._children));
		flatArr.push(col);

		// 给每一项 column 添加 isShow && isFilterEnum 属性
		col.isShow = col.isShow ?? true;
		col.isFilterEnum = col.isFilterEnum ?? true;

		if (!col.enum) return;
		// 如果当前 enum 为后台数据需要请求数据，则调用该请求接口，并存储到 enumMap
		if (typeof col.enum !== "function") return enumMap.value.set(col.prop!, col.enum);
		const { data } = await col.enum();
		enumMap.value.set(col.prop!, data);
	});
	return flatArr.filter(item => !item._children?.length);
};
// 扁平 columns
const flatColumns = ref<ColumnProps[]>();
flatColumns.value = flatColumnsFunc(tableColumns.value as any);

// 搜索
const search = () => {
	handleChangePager(1)
	updatedTotalParam(props.searchParams);
	getTableList();
};

// * --- search form --- * //
const searchShow = ref(true)
const searchParamsAsyc = computed({
	get() {
		return props.searchParams
	},
	set(value) {
		emits('update:searchParams', value)
	}
})
const isShowSearch = !!useSlots().search || !!useSlots().searchCollapsed

// * --- toolButton 操作按钮 --- * //
// 列设置 ==> 过滤掉不需要设置显隐的列
const colRef = ref();
const colSetting = tableColumns.value!.filter(item => {
	return item.isShow && item.type !== "selection" && item.type !== "index" && item.type !== "expand" && item.prop !== "operation";
});
const openColSetting = () => {
	colRef.value.openColSetting();
};

// emit
const emits = defineEmits(['update:searchParams']);

// 暴露给父组件的参数和方法(外部需要什么，都可以从这里暴露出去)
defineExpose({ element: tableRef, tableData, pageable, getTableList, search });
</script>

<style lang="scss" scoped>
.liquid-table {

	/* stylelint-disable-next-line scss/double-slash-comment-empty-line-before */
	// 表格 header 样式
	.table-header {
		.header-button-lf {
			float: left;
		}

		.header-button-ri {
			float: right;
		}

		:deep(.el-button) {
			margin-bottom: 15px;
		}
	}

	// el-table 表格样式
	:deep(.el-table) {
		flex: 1;

		// 修复 safari 浏览器表格错位
		table {
			width: 100%;
		}

		.el-table__header th {
			height: 45px;
			font-size: 15px;
			font-weight: bold;
			color: var(--el-text-color-primary);
			background: var(--el-fill-color-light);
		}

		.el-table__row {
			height: 45px;
			font-size: 14px;
		}

		// 设置 el-table 中 header 文字不换行，并省略
		.el-table__header .el-table__cell>.cell {
			white-space: nowrap;
		}

		// 解决表格数据为空时样式不居中问题(仅在element-plus中)
		.el-table__empty-block {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);

			.table-empty {
				line-height: 30px;
			}
		}

		// table 中 image 图片样式
		.table-image {
			width: 50px;
			height: 50px;
			border-radius: 50%;
		}

		// no-data 
		.el-scrollbar__wrap {
			min-height: 130px;
		}
	}

	// 表格 pagination 样式
	:deep(.el-pagination) {
		display: flex;
		justify-content: flex-end;
		margin-top: 20px;
	}

}

.margin-b {
	margin-bottom: 10px;
}
</style>
