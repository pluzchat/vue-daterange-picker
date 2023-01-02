<template>
  <div class="day"
    :class="{'invalid': !item.valid, 'today': item.today, 'active': active, selected: selected, 'end': end, 'start': start}"
    @click="toggleDay"
    @mouseover="changeHoverDay">
      <div class="wrapper">
        <div>
          {{item.day}}
        </div>
      </div>
  </div>
</template>
<script>
  export default {
    props: {
      item: {
        type: Object,
        default: null,
      },
      canHover: {
        type: Boolean,
        default: false
      },
      hoverDay: {
        type: Number
      },
      certainDays: {
        type: Array
      },
      colorToday: {
        type: String
      },
      colorActive: {
        type: String
      }
    },
    data: () => ({
      clicked: false
    }),
    methods: {
      toggleDay() {
        if (this.item.valid) {
          this.clicked = !this.clicked
          if (this.clicked || this.selected || this.active) {
            if (this.$parent.$parent.certainDays.length === 2) {
              this.$parent.$parent.certainDays = []
              this.$parent.$parent.hoverDay = null
            }
            this.$parent.$parent.certainDays.push(this.item.stamp)
          } else {
            this.$parent.$parent.certainDays.pop()
          }
        }
      },
      changeHoverDay() {
        if (this.canHover && this.item.valid && !this.selected) {
          this.$parent.$parent.hoverDay = this.item.stamp
        }
      }
    },
    computed: {
      selected() {
        return (this.certainDays.indexOf(this.item.stamp) !== -1
          && this.item.valid)
          || (this.item.stamp === this.hoverDay && this.item.valid)
      },
      start() {
        if (this.hoverDay && this.item.valid) {
          const certain = this.certainDays[0]
          const min = Math.min(certain, this.hoverDay)
          return this.item.stamp === min
        }
      },
      end() {
        if (this.hoverDay && this.item.valid) {
          const certain = this.certainDays[0]
          const max = Math.max(certain, this.hoverDay)
          return this.item.stamp === max
        }
      },
      active() {
        if (this.hoverDay && this.item.valid) {
          const certain = this.certainDays[0]
          const min = Math.min(certain, this.hoverDay)
          const max = Math.max(certain, this.hoverDay)
          return this.item.stamp <= max && this.item.stamp >= min
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .day {
    margin-top: 10px;
    display: inline-block;
    width: 40px;
    text-align: center;
    font-size: 14px;
    box-sizing: border-box;
    .wrapper {
      padding: 8px 0;
    }
  }
  .selected {
    background-color: #0052CC !important;
    color: white !important;
  }
  .active {
    background-color: #F5F5F5;
    color: #212121;
  }
  .invalid {
    color: #BDBDBD !important;
  }
</style>
