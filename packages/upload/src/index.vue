<template>
	<el-upload class="liquid-upload" ref="uploadRef" drag :multiple="multiple" :auto-upload="true" :limit="1"
		:http-request="httpRequest" :on-remove="onRemove" :before-upload="beforeUpload">
		<el-icon class="el-icon--upload">
			<UploadFilled />
		</el-icon>
		<div class="el-upload__text">
			拖拽到这里 或 <em>点击上传</em>
		</div>
		<template #tip>
			<div class="el-upload__tip">{{ tips }}</div>
		</template>
	</el-upload>
</template>

<script setup lang="ts" name="LUpload">
import { computed, ref } from "vue";
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from "element-plus";
import type { UploadRawFile, UploadFile, UploadFiles, Action, UploadUserFile } from 'element-plus'

const props = defineProps({
	// 是否允许多个
	multiple: {
		type: Boolean,
		default: true
	},
	// 个数
	limit: {
		type: Number,
		default: 1
	},
	// 提示
	tips: {
		type: String,
		default: ''
	},
	// 文件类型
	fileType: {
		type: Array,
		default: ['.so']
	},
	// 文件大小 单位： M
	fileSize: {
		type: Number,
		default: 10
	},
	// 是否直接上传
	autoUpload: {
		type: Boolean,
		default: false
	},
	// 自动上传方法
	autoUploadFun: {
		type: Function
	}
});
const emits = defineEmits(['change']);

const uploadRef = ref()
let myFiles: any = [] // 存上传的文件

// 上传文件前的勾子
const beforeUpload = (file: UploadRawFile) => {
	const nameArr = file.name.split('.')
	const type = `.${nameArr[nameArr.length - 1]}`
	if (props.fileType.indexOf(type) === -1) {
		ElMessage.error(`上传的文件类型必须是${props.fileType.toString()}!`)
		return false
	} else if (file.size / 1024 / 1024 > props.fileSize) {
		ElMessage.error(`文件大小不能超${props.fileSize}MB!`)
		return false
	}
	return true
}

// 上传自定义请求
const httpRequest = (options: any) => {
	myFiles.push(options.file)
	emits('change', myFiles)
	if (!props.autoUpload) return
	props.autoUploadFun && props.autoUploadFun()
}

// 移除文件列表
const onRemove = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
	const name = uploadFile.name
	const index = myFiles.findIndex((v: any) => { return v.name === name })
	myFiles.splice(index, 1)
	emits('change', myFiles)
}

</script>
