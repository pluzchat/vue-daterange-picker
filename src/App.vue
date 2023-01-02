<template>
  <div id="app">
    <h1>{{ msg }}</h1>
    <div class="range-date-picker-container">
      <transition name="panelIn">
        <date-range-picker
          class="range-date-picker"
          language="vi"
          v-model="dates"
          v-show="show"
          @closePicker="closePicker"></date-range-picker>
      </transition>
      <input
        class="range-date-input"
        @click="showPicker"
        placeholder="click to use vue-range-datepicker"
        :value="rangeDates"/>
    </div>
  </div>
</template>

<script>
import { parseTime } from './util.js'
import DateRangePicker from "./date-range-picker/Picker";

export default {
  name: 'app',
  data () {
    return {
      msg: 'vue-daterange-picker',
      show: false,
      dates: {
        start: Date.now(),
        end: Date.now()
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
    }
  },
  computed: {
    rangeDates() {
      if (Object.keys(this.dates).length === 2) {
        return `${this.parseTime(this.dates.start, 'y-m-d')}  -  ${this.parseTime(this.dates.end, 'y-m-d')}`
      } else {
        return ""
      }
    }
  },
  components: {
    DateRangePicker,
  }
}
</script>

<style lang="scss">
.range-date-picker-container {
  cursor: pointer;
  font-size: 14px;
  position: relative;
  .range-date-picker {
    position: absolute;
    top: 50px;
    left: 0px;
  }
  .range-date-input {
    padding: 10px;
    width: 300px;
  }
}
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
