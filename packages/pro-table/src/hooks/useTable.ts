import { Table } from "../interface/table";
import { reactive, computed, onMounted, toRefs } from "vue";

/**
 * @description table 页面操作方法封装
 * @param {Boolean} isPageable 是否有分页(非必传，默认为true)
 * @param {Number} pageSize 分页条数，默认10
 * @param {Function} requestApi 获取表格数据 api 方法(必传)
 * @param {Object} requestParam 获取数据初始化参数(非必传，默认为{})
 * @param {Array} requestPageName 分页参数名
 * @param {Function} requestCallback 对后台返回的数据进行处理的方法(非必传)
 * */
export const useTable = (
	isPageable: boolean = true,
	pageSize: number = 10,
	requestApi: (params: any) => Promise<any>,
	requestParam: object = {},
	requestPageName: any = [],
	requestCallback?: (data: any) => any,
) => {
	const state = reactive<Table.TableStateProps>({
		// 表格数据
		tableData: [],
		// 分页数据
		pageable: {
			// 当前页数
			pageNum: 1,
			// 每页显示条数
			pageSize: pageSize,
			// 总条数
			total: 0
		},
		// 总参数(包含分页和查询参数)
		totalParam: {},
		// 加载状态
		loading: false
	});

	/**
	 * @description 获取表格数据
	 * @return void
	 * */
	const getTableList = async () => {
		try {
			state.loading = true;

			// 把初始化参数和分页参数放到总参数里面
			Object.assign(state.totalParam, requestParam, filterPageParams());
			let res = await requestApi(state.totalParam);

			// 默认格式为 { code, rows, total, msg } 不是的话，用requestCallback处理
			requestCallback && (res = requestCallback(res));
			state.tableData = res?.rows || []

			// 解构后台返回的分页数据 (如果有分页更新分页信息)
			const { total = 0 } = res;
			isPageable && updatePageable({ pageNum: state.pageable.pageNum, pageSize: state.pageable.pageSize, total });

			state.loading = false
		} catch (error) {
			console.log(error);
			state.loading = false
		}
	};

	// 处理分页参数
	const filterPageParams = () => {
		return isPageable ? {
			[requestPageName[0]]: state.pageable.pageNum,
			[requestPageName[1]]: state.pageable.pageSize
		} : {}
	}

	/**
	 * @description 更新查询参数
	 * @return void
	 * */
	const updatedTotalParam = (searchParams: any) => {
		state.totalParam = {};
		// 处理查询参数，可以给查询参数加自定义前缀操作
		let nowSearchParam: { [key: string]: any } = {};
		// 防止手动清空输入框携带参数（这里可以自定义查询参数前缀）
		for (let key in searchParams) {
			// * 某些情况下参数为 false/0 也应该携带参数
			if (searchParams[key] || searchParams[key] === false || searchParams[key] === 0) {
				nowSearchParam[key] = searchParams[key];
			}
		}
		Object.assign(state.totalParam, nowSearchParam, filterPageParams());
	};

	/**
	 * @description 更新分页信息
	 * @param {Object} resPageable 后台返回的分页数据
	 * @return void
	 * */
	const updatePageable = (resPageable: Table.Pageable) => {
		Object.assign(state.pageable, resPageable);
	};

	/**
	 * @description 修改当前分页值
	 * @return void
	 * */
	const handleChangePager = (pageNum: number, pageSize: number = state.pageable.pageSize) => {
		state.pageable.pageNum = pageNum;
		state.pageable.pageSize = pageSize;
	};

	/**
	 * @description 每页条数改变
	 * @param {Number} val 当前条数
	 * @return void
	 * */
	const handleSizeChange = (val: number) => {
		state.pageable.pageNum = 1;
		state.pageable.pageSize = val;
		getTableList();
	};

	/**
	 * @description 当前页改变
	 * @param {Number} val 当前页
	 * @return void
	 * */
	const handleCurrentChange = (val: number) => {
		state.pageable.pageNum = val;
		getTableList();
	};

	return {
		...toRefs(state),
		getTableList,
		handleSizeChange,
		handleCurrentChange,
		handleChangePager,
		updatedTotalParam
	};
};
