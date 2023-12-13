<template>
	<component :is="renderLoop(column)"></component>
</template>

<script setup lang="tsx" name="LProTableTableColumn">
import { inject, ref, useSlots } from "vue";
import { ElTableColumn, ElTag } from "element-plus";
import { ColumnProps } from "./interface/index";

const slots = useSlots();
defineProps<{ column: ColumnProps }>();

const enumMap = inject("enumMap", ref(new Map()));

// 渲染表格数据
const renderCellData = (item: ColumnProps, scope: { [key: string]: any }) => {
	return enumMap.value.get(item.prop) && item.isFilterEnum
		? filterEnum(handleRowAccordingToProp(scope.row, item.prop!), enumMap.value.get(item.prop)!, item.fieldNames)
		: formatValue(handleRowAccordingToProp(scope.row, item.prop!));
};

// 获取 tag 类型
const getTagType = (item: ColumnProps, scope: { [key: string]: any }) => {
	return filterEnum(handleRowAccordingToProp(scope.row, item.prop!), enumMap.value.get(item.prop), item.fieldNames, "tag") as any;
};

const renderLoop = (item: ColumnProps) => {
	return (
		<>
			{item.isShow && (
				<ElTableColumn
					{...item}
					align={item.align ?? "center"}
					showOverflowTooltip={item.showOverflowTooltip ?? item.prop !== "operation"}
				>
					{{
						default: (scope: any) => {
							if (item._children) return item._children.map(child => renderLoop(child));
							if (item.render) return item.render(scope);
							if (slots[item.prop!]) return slots[item.prop!]!(scope);
							if (item.tag) return <ElTag type={getTagType(item, scope)}>{renderCellData(item, scope)}</ElTag>;
							return renderCellData(item, scope);
						},
						header: () => {
							if (item.headerRender) return item.headerRender(item);
							if (slots[`${item.prop}Header`]) return slots[`${item.prop}Header`]!({ row: item });
							return item.label;
						}
					}}
				</ElTableColumn>
			)}
		</>
	);
};

// ------ utils ------ //
/**
 * @description 根据枚举列表查询当需要的数据（如果指定了 label 和 value 的 key值，会自动识别格式化）
 * @param {String} callValue 当前单元格值
 * @param {Array} enumData 枚举列表
 * @param {String} type 过滤类型（目前只有 tag）
 * @return string
 * */
const filterEnum = (
	callValue: any,
	enumData: { [key: string]: any } | undefined,
	searchProps?: { [key: string]: any },
	type?: string
) => {
	const value = searchProps?.value ?? "value";
	const label = searchProps?.label ?? "label";
	let filterData: any = {};
	if (Array.isArray(enumData)) filterData = enumData.find((item: any) => item[value] === callValue);
	if (type == "tag") return filterData?.tagType ? filterData.tagType : "";
	return filterData ? filterData[label] : "--";
}

/**
 * @description 处理无数据情况
 * @param {String} callValue 需要处理的值
 * @return string
 * */
const formatValue = (callValue: any) => {
	// 如果当前值为数组,使用 / 拼接（根据需求自定义)
	if (callValue && Array.isArray(callValue)) return callValue.length ? callValue.join(" / ") : "--";
	return callValue ?? "--";
}

/**
 * @description 处理 prop 为多级嵌套的情况(列如: prop:user.name)
 * @param {Object} row 当前行数据
 * @param {String} prop 当前 prop
 * @return any
 * */
const handleRowAccordingToProp = (row: { [key: string]: any }, prop: string) => {
	if (!prop.includes(".")) return row[prop];
	prop.split(".").forEach(item => {
		row = row[item] ?? "--";
	});
	return row;
}
</script>
