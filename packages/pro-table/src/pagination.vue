<template>
	<!-- 分页组件 -->
	<el-pagination :current-page="pageable.pageNum" :page-size="pageable.pageSize" :page-sizes="[10, 25, 50, 100, 500]"
		:background="true" layout="total, sizes, prev, pager, next, jumper" :total="pageable.total"
		@update:page-size="handleSizeChange" @update:current-page="handleCurrentChange"></el-pagination>
</template>

<script setup lang="ts" name="LProTablePagination">
interface Pageable {
	pageNum: number;
	pageSize: number;
	total: number;
}

interface PaginationProps {
	pageable: Pageable;
	handleSizeChange: (size: number) => void;
	handleCurrentChange: (currentPage: number) => void;
}

defineProps<PaginationProps>();
</script>
