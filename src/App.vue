<template>
  <div id="app">
    <h1>{{ msg }}</h1>
    <div style="width: 200px">
      <date-range-picker
        language="vi"
        v-model="dates"
      >
      </date-range-picker>
    </div>
  </div>
</template>

<script>
import { parseTime } from './util.js'
import DateRangePicker from "./date-range-picker/Picker";
import moment from "moment"

export default {
  name: 'app',
  data () {
    return {
      msg: 'vue-daterange-picker',
      dates: {
        // start: moment().subtract(30,'days').startOf('day').valueOf(), end: moment().subtract(1, 'days').startOf('day').valueOf()
      }
    }
  },
  methods: {
    parseTime,
    closePicker() {
      this.show = false
    },
    showPicker() {
      this.show = true
    },
  },
  components: {
    DateRangePicker,
  }
}
</script>

<style lang="scss">
.panelIn-enter {
  transform: translateY(-10px);
}
.panelIn-enter-active {
  transition: transform 0.3s ease;
}
.panelIn-enter-to {
  transform: translateY(0);
}
</style>
