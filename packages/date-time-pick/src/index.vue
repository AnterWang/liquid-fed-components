<template>
  <div class="liquid-datetime">
    <el-date-picker v-model="dateValue" type="datetimerange" range-separator="-" start-placeholder="开始时间"
      end-placeholder="结束时间" :value-format="valueFormat" class="custom-picker" />
    <el-button link type="primary" @click="updateTime(1)">最近1天</el-button>
    <el-button link type="primary" @click="updateTime(2)">最近2天</el-button>
    <el-button link type="primary" @click="updateTime(7)">最近7天</el-button>
  </div>
</template>

<script setup lang="ts" name="LDateTimePick">
import { computed } from "vue";
import { dayjs } from 'element-plus'

const props = defineProps({
  time: {
    type: [String, Array, Number, Date],
    default: ''
  },
  valueFormat: {
    type: [String],
    default: 'YYYY-MM-DD HH:mm:ss',
    validator: (value: string) => {
      return ['YYYY-MM-DD HH:mm:ss', 'x'].indexOf(value) !== -1
    }
  },
});
const emits = defineEmits(['update:time']);

const dateValue = computed({
  get: () => {
    return props.time
  },
  set: (val) => {
    emits("update:time", val)
  }
});

const updateTime = (day: number) => {
  const end = new Date()
  const start = new Date()
  start.setTime(start.getTime() - 3600 * 1000 * 24 * day)
  const timeS = dayjs(start).format(props.valueFormat)
	const timeE = dayjs(end).format(props.valueFormat)
	const time = [props.valueFormat === 'x' ? Number(timeS) : timeS, props.valueFormat === 'x' ? Number(timeE) : timeE]
  emits("update:time", time)
}

defineExpose({
  updateTime
})
</script>

<style lang="scss" scoped>
.liquid-datetime {
  display: flex;
  flex-direction: row;

  .custom-picker {
    margin-right: 8px;
  }
}
</style>
