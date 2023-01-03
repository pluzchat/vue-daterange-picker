<template>
  <div class="picker-container" v-click-outside="closePicker">
    <div @click="showPicker">
      <slot name="input" :start="value.start" :end="value.end">
        <div class="picker-input">
          <span class="start-time">{{ startDate }}</span>
          <i class="ri-arrow-right-fill" style="font-size: 16px; color: #9E9E9E"></i>
          <span class="end-time">{{ endDate }}</span>
          <div style="flex-grow: 1"></div>
          <i class="ri-calendar-line" style="font-size: 20px; color: #9E9E9E"></i>
        </div>
      </slot>
    </div>
    <transition name="panelIn">
      <div class="picker" v-show="show">
        <div class="dates-wrapper">
          <date
            :year="leftYear"
            :month="leftMonth"
            :canNextMonth="canNextMonth"
            :canNextYear="canNextYear"
            :canHover="canHover"
            :certainDays="certainDays"
            :hoverDay="hoverDay"
            :language="language"
            @prevYear="leftPrevYear"
            @nextYear="leftNextYear"
            @prevMonth="leftPrevMonth"
            @nextMonth="leftNextMonth"></date>
          <date
            :year="rightYear"
            :month="rightMonth"
            :canPrevMonth="canPrevMonth"
            :canPrevYear="canPrevYear"
            :canHover="canHover"
            :certainDays="certainDays"
            :hoverDay="hoverDay"
            :language="language"
            @prevYear="rightPrevYear"
            @nextYear="rightNextYear"
            @prevMonth="rightPrevMonth"
            @nextMonth="rightNextMonth"></date>
        </div>
        <div class="quick-time">
          <div class="quick-time-btn" v-on:click="onToday">Hôm nay</div>
          <div class="quick-time-btn" v-on:click="onYesterday">Hôm qua</div>
          <div class="quick-time-btn" v-on:click="on7DaysAgo">7 ngày trước</div>
          <div class="quick-time-btn" v-on:click="on30DaysAgo">30 ngày trước</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import date from './Date'
import moment from "moment";
export default {
  name: "DateRangePicker",
  components: {
    date
  },
  props: {
    value: {
      type: Object,
      default: null,
    },
    language: {
      type: String,
      default: "zh"
    },
  },
  created() {
    this.certainDays = this.initCertainDays()
  },
  mounted() {
    this.leftYear = this.computedLeftYear()
    this.leftMonth = this.computedLeftMonth()
    this.rightYear = this.computedRightYear()
    this.rightMonth = this.computedRightMonth()
  },
  data() {
    return {
      leftYear: null,
      leftMonth: null,
      rightYear: null,
      rightMonth: null,
      certainDays: null,
      show: false,
    }
  },
  computed: {
    selected() {
      return this.certainDays.length === 2
    },
    canHover() {
      return this.certainDays.length === 1
    },
    canPrevMonth() {
      if (this.rightYear - this.leftYear > 1) {
        return true
      } else if (this.rightYear - this.leftYear === 1) {
        return this.rightMonth - this.leftMonth > -11
      } else if (this.rightYear === this.leftYear) {
        return this.rightMonth - this.leftMonth > 1
      } else {
        return false
      }
    },
    canPrevYear() {
      if (this.rightYear - this.leftYear > 1) {
        return true
      } else if (this.rightYear - this.leftYear === 1) {
        return this.rightMonth > this.leftMonth
      } else {
        return false
      }
    },
    canNextMonth() {
      if (this.rightYear - this.leftYear > 1) {
        return true
      } else if (this.rightYear - this.leftYear === 1) {
        return this.rightMonth - this.leftMonth > -11
      } else if (this.rightYear === this.leftYear) {
        return this.rightMonth - this.leftMonth > 1
      } else {
        return false
      }
    },
    canNextYear() {
      if (this.rightYear - this.leftYear > 1) {
        return true
      } else if (this.rightYear - this.leftYear === 1) {
        return this.rightMonth > this.leftMonth
      } else {
        return false
      }
    },
    hoverDay() {
      if (this.certainDays.length === 2 && (Math.min(...this.certainDays) < Math.max(...this.certainDays))) return this.formatDayToMidnight(this.value.end)
      return null
    },
    startDate() {
      return moment(this.value.start).format("DD/MM/YYYY")
    },
    endDate() {
      return moment(this.value.end).format("DD/MM/YYYY")
    }
  },
  methods: {
    closePicker() {
      this.show = false
    },
    showPicker() {
      this.show = true
    },
    isSameYearMonth() {
      const leftYear = new Date(Math.min(...this.certainDays)).getFullYear()
      const leftMonth = new Date(Math.min(...this.certainDays)).getMonth()
      const rightYear = new Date(Math.max(...this.certainDays)).getFullYear()
      const rightMonth = new Date(Math.max(...this.certainDays)).getMonth()

      return leftYear === rightYear && leftMonth === rightMonth
    },
    initCertainDays() {
      const certainDays = []
      const {start, end} = this.value
      if (start) certainDays.push(this.formatDayToMidnight(start))
      if (end) certainDays.push(this.formatDayToMidnight(end))
      return certainDays
    },
    formatDayToMidnight(day) {
      const date = new Date(day)
      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)
      date.setMilliseconds(0)
      return Date.parse(date)
    },
    leftNextYear() {
      this.leftYear += 1
    },
    leftNextMonth() {
      if (this.leftMonth === 11) {
        this.leftMonth = 0
        this.leftYear += 1
      } else {
        this.leftMonth += 1
      }
    },
    leftPrevYear() {
      this.leftYear -= 1
    },
    leftPrevMonth() {
      if (this.leftMonth === 0) {
        this.leftMonth = 11
        this.leftYear -= 1
      } else {
        this.leftMonth -= 1
      }
    },
    rightNextYear() {
      this.rightYear += 1
    },
    rightNextMonth() {
      if (this.rightMonth === 11) {
        this.rightMonth = 0
        this.rightYear += 1
      } else {
        this.rightMonth += 1
      }
    },
    rightPrevYear() {
      this.rightYear -= 1
    },
    rightPrevMonth() {
      if (this.rightMonth === 0) {
        this.rightMonth = 11
        this.rightYear -= 1
      } else {
        this.rightMonth -= 1
      }
    },
    computedLeftYear() {
      if (this.certainDays.length > 0) {
        return new Date(Math.min(...this.certainDays)).getFullYear()
      }
      return new Date().getFullYear()
    },
    computedLeftMonth() {
      if (this.certainDays.length > 0) {
        return new Date(Math.min(...this.certainDays)).getMonth()
      }
      return new Date().getMonth()
    },
    computedRightYear() {
      if (this.certainDays.length === 2) {
        if (this.isSameYearMonth()) {
          const leftDate = new Date(Math.min(...this.certainDays))
          return leftDate.getMonth() === 11 ? leftDate.getFullYear() + 1 : leftDate.getFullYear()
        }
        return new Date(Math.max(...this.certainDays)).getFullYear()
      }
      return new Date().getMonth() === 11 ? new Date().getFullYear() + 1 : new Date().getFullYear()
    },
    computedRightMonth() {
      if (this.certainDays.length === 2) {
        if (this.isSameYearMonth()) {
          const leftDate = new Date(Math.min(...this.certainDays))
          return leftDate.getMonth() === 11 ? 0 : leftDate.getMonth() + 1
        }
        return new Date(Math.max(...this.certainDays)).getMonth()
      }
      return new Date().getMonth() === 11 ? 0 : new Date().getMonth() + 1
    },
    onToday() {
      this.certainDays = [moment().startOf('day').valueOf(), moment().startOf('day').valueOf()];
    },
    onYesterday() {
      this.certainDays = [moment().subtract(1, 'days').startOf('day').valueOf(), moment().subtract(1,'days').startOf('day').valueOf()]
    },
    on7DaysAgo() {
      this.certainDays = [moment().subtract(7,'days').startOf('day').valueOf(), moment().startOf('day').valueOf()]
    },
    on30DaysAgo() {
      this.certainDays = [moment().subtract(30,'days').startOf('day').valueOf(), moment().startOf('day').valueOf()]
    },
  },
  watch: {
    certainDays(val) {
      if (val.length === 2) {
        this.closePicker()
        this.$emit('input', {
          start: Math.min(...val),
          end: Math.max(...val)
        })
        this.leftYear = this.computedLeftYear()
        this.leftMonth = this.computedLeftMonth()
        this.rightYear = this.computedRightYear()
        this.rightMonth = this.computedRightMonth()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@media (max-width: 540px) {
  .picker {
    max-width: 320px;
    .dates-wrapper {
      flex-wrap: wrap;
    }
  }
}

.picker-container {
  cursor: pointer;
  font-size: 14px;
  position: absolute;
  .picker-input {
    border: 1px solid #E0E0E0;
    border-radius: 4px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 280px;
    .start-time {
      font-family: "Exo", sans-serif;
      color: #212121;
    }
    .end-time {
      font-family: "Exo", sans-serif;
      color: #212121;
    }
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

.picker {
  font-family: "Exo", sans-serif;
  background-color: #fff;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  margin: 0 auto;
  .quick-time {
    display: flex;
    gap: 8px;
    padding: 0 20px 20px;
    .quick-time-btn {
      background-color: #F5F5F5;
      cursor: pointer;
      padding: 4px 8px;
      color: #424242;
      border-radius: 4px;
    }
  }
  .dates-wrapper {
    display: flex;
    position: relative;
  }
}
</style>

