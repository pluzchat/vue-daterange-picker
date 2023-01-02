<template>
  <div class="date-picker">
    <div class="main">
      <div class="head">
        <div class="side">
          <div class="prev-year year"
            v-if="canPrevYear"
            @click="prevYear" >
            <i class="ri-skip-back-mini-fill" style="font-size: 20px; color: #9E9E9E"></i>
          </div>
          <div class="prev-month month"
            v-if="canPrevMonth"
            @click="prevMonth">
            <i class="ri-rewind-mini-fill" style="font-size: 20px; color: #9E9E9E"></i>
          </div>
        </div>
        <div class="text" v-if="language === 'en'">
          {{monthsInEnglish[month]}} {{year}}
        </div>
        <div class="text" v-else-if="language === 'vi'">
          Tháng {{month + 1}} - {{year}}
        </div>
        <div class="text" v-else>
          {{year}}年{{month + 1}}月
        </div>
        <div class="side">
          <div class="next-month month"
            v-if="canNextMonth"
            @click="nextMonth">
            <i class="ri-speed-mini-fill" style="font-size: 20px; color: #9E9E9E"></i>
          </div>
          <div class="next-year year"
            v-if="canNextYear"
            @click="nextYear" >
            <i class="ri-skip-forward-mini-fill" style="font-size: 20px; color: #9E9E9E"></i>
          </div>
        </div>
      </div>
      <div class="weeks">
        <span
          class="week"
          v-for="(item, i) in weeks[language]"
          :key="i">
            {{item}}
        </span>
      </div>

      <div class="days">
        <day
          v-for="item in days"
          :key="item.stamp"
          :item="item"
          :canHover="canHover"
          :certainDays="certainDays"
          :hoverDay="hoverDay"></day>
      </div>
    </div>
  </div>
</template>

<script>
  import day from './Day'
  export default {
    props: {
      certainDays: {
        type: Array
      },
      hoverDay: {
        type: Number
      },
      year: {
        type: Number
      },
      month: {
        type: Number
      },
      canNextMonth: {
        type: Boolean,
        default: true
      },
      canNextYear: {
        type: Boolean,
        default: true
      },
      canPrevMonth: {
        type: Boolean,
        default: true
      },
      canPrevYear: {
        type: Boolean,
        default: true
      },
      canHover: {
        type: Boolean,
        default: false
      },
      language: {
        type: String
      },
    },
    data: () => ({
      days: [],
      weeks: {
        'zh': ["日", "一", "二", "三", "四", "五", "六"],
        'jp': ["日", "月", "火", "水", "木", "金", "土"],
        'en': ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        'vi': ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
      },
      monthsInEnglish: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    }),
    components: {
      day
    },
    methods: {
      firstDay() {
        const date = new Date(this.year, this.month, 1)
        const temp = date.setDate(1)
        return new Date(temp)
      },
      isToday(date) {
        const today = new Date()
        return date.getFullYear() === today.getFullYear()
          && date.getMonth() === today.getMonth()
          && date.getDate() === today.getDate()
      },
      getDayCountOfMonth(year, month) {
        if ([3, 5, 8, 10].includes(month)) {
          return 30
        }
        if (month === 1) {
          if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
            return 29
          } else {
            return 28
          }
        }
        return 31
      },
      prevDays() {
        const firstDay = this.firstDay()
        if (firstDay.getDay() === 0) return []
        const count = this.getDayCountOfMonth(this.year, this.month - 1)
        const date = new Date(this.year, this.month - 1, count)
        const nums = date.getDay() + 1
        const days = []
        for (let i = 0; i < nums; i++) {
          const day = {
            stamp: +new Date(this.year, this.month - 1, count - i),
            day: count - i,
            valid: false,
            today: false
          }
          days.unshift(day)
        }
        return days
      },
      currentDays() {
        const vm = this
        const count = vm.getDayCountOfMonth(vm.year, vm.month)
        const days = []
        for (let i = 0; i < count; i++) {
          const date = new Date(vm.year, vm.month, i + 1)
          const day = {
            stamp: +date,
            day: i + 1,
            valid: true,
            today: vm.isToday(date)
          }
          days.push(day)
        }
        return days
      },
      nextDays() {
        const firstDay = this.firstDay()
        if (firstDay.getDay === 6) return []
        const count = this.getDayCountOfMonth(this.year, this.month)
        const lastDay = new Date(this.year, this.month, count)
        const remain = 6 - lastDay.getDay()
        const days = []
        for (let i = 0; i < remain; i++) {
          const day = {
            stamp: +new Date(this.year, this.month + 1, i + 1),
            day: i + 1,
            valid: false,
            today: false
          }
          days.push(day)
        }
        return days
      },
      getDays() {
        const days = []
        const prevDays = this.prevDays()
        const currentDays = this.currentDays()
        const nextDays = this.nextDays()
        return days.concat(prevDays).concat(currentDays).concat(nextDays)
      },
      nextMonth() {
        this.$emit('nextMonth')
      },
      prevMonth() {
        this.$emit('prevMonth')
      },
      nextYear() {
        this.$emit('nextYear')
      },
      prevYear() {
        this.$emit('prevYear')
      }
    },
    created() {
      this.days = this.getDays()
    },
    watch: {
      year() {
        this.days = this.getDays()
      },
      month() {
        this.days = this.getDays()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .date-picker {
    width: 320px;
    margin: 0 auto;
    .main {
      width: 280px;
      margin: 0 auto;
    }
    .days {
      padding-bottom: 32px;
    }
    .head {
      padding-bottom: 20px;
      padding-top: 20px;
      display: flex;
      align-items: center;
      .text {
        flex-grow: 1;
        text-align: center;
        font-size: 14px;
        font-weight: bold;
      }
      .side {
        width: 49px;
        height: 20px;
        flex-shrink: 0;
        position: relative;
        display: flex;
        gap: 12px;
        .year {
          display: flex;
          cursor: pointer;
        }
        .month {
          cursor: pointer;
        }
      }
    }
    .weeks {
      display: flex;
      padding-bottom: 10px;
      .week {
        display: inline-block;
        text-align: center;
        font-weight: bold;
        width: 40px;
        color: #222;
        font-size: 14px;
      }
    }
  }
</style>

