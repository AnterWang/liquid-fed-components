import LDialog from './dialog/src/index.vue'
import LDrawer from './drawer/src/index.vue'
import LUpload from './upload/src/index.vue'
import LInputSelect from './input-select/src/index.vue'
import LDateTimePick from './date-time-pick/src/index.vue'
import LGrid from './grid/src/index.vue'
import LSearchForm from './search-form/src/index.vue'
import LProTable from './pro-table/src/index.vue'

declare module 'vue' {
  export interface GlobalComponents {
    LDialog: typeof LDialog
    LDrawer: typeof LDrawer
    LUpload: typeof LUpload
    LInputSelect: typeof LInputSelect
    LDateTimePick: typeof LDateTimePick
    LGrid: typeof LGrid
    LSearchForm: typeof LSearchForm
    LProTable: typeof LProTable
  }
}