<template>
  <date-range-picker
    ref="picker"
    :locale-data="{ firstDay: 1, format: 'DD-MM-YYYY' }"
    :autoApply="autoApply"
    v-model="dateRange"
    :dateFormat="dateFormat"
    :ranges="ranges"
    :zIndex="200000"
    :appendToBody="true"
    format="mm/dd/yyyy"
    @select="onDateRangePicked"
  >
    <!--    input slot (new slot syntax)-->
    <template v-slot:input="picker">
      <span class="text-mg-20">From</span> <span class="text-mg-20">{{ picker.startDate | date }}</span> to
      <span class="text-mg-20">{{ picker.endDate | date }}</span>
      <i class="mdi mdi-calendar-multiple mdi-18px text-mg-20"></i>
    </template>
    <!--    ranges (new slot syntax) -->
    <template #ranges="ranges">
      <div class="ranges">
        <ul>
          <li v-for="(range, name) in ranges.ranges" :key="name" @click="ranges.clickRange(range)">
            <b>{{ name }}</b>
            <!-- <small class="text-muted">{{ range[0].toDateString() }} - {{ range[1].toDateString() }}</small> -->
          </li>
        </ul>
      </div>
    </template>
  </date-range-picker>
</template>

<script>
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
import moment from 'moment';
import 'moment-timezone';

export default {
  props: {
    handler: Function,
    timezone: String,
  },
  components: { DateRangePicker },
  data() {
    let { from, to } = this.$route.query;
    let currDate = moment();
    currDate.tz(this.timezone);
    let yesterday = moment();
    yesterday.set('date', yesterday.get('date') - 1);
    yesterday.tz(this.timezone);

    let lastSevenDays = moment();
    lastSevenDays.set('date', lastSevenDays.get('date') - 7);
    lastSevenDays.tz(this.timezone);

    let lastThirdtyDays = moment();
    lastThirdtyDays.set('month', lastThirdtyDays.get('month') - 1);
    lastThirdtyDays.tz(this.timezone);

    let lastNinetyDays = moment();
    lastNinetyDays.set('month', lastNinetyDays.get('month') - 3);
    lastNinetyDays.tz(this.timezone);

    let lastMonth = moment();
    lastMonth.set('month', lastMonth.get('month') - 1);
    lastMonth.tz(this.timezone);

    let weekToDate = moment();
    let currentDay = weekToDate.get('date');
    let distance = 1 - currentDay;
    weekToDate.set('date', weekToDate.get('date') + distance);
    weekToDate.tz(this.timezone);

    let monthToDate = moment();
    monthToDate.set('date', 1);
    monthToDate.tz(this.timezone);

    let currDateConverted = this.momentToDate(currDate);
    return {
      dateRange: {
        startDate: from || null, //this.momentToDate(currDate),
        endDate: to || null, //this.momentToDate(currDate),
      },
      currDate: currDate,
      minDate: currDate,
      autoApply: true,
      ranges: {
        Today: [currDateConverted, currDateConverted],
        Yesterday: [this.momentToDate(yesterday), this.momentToDate(yesterday)],
        'Last 7 days': [this.momentToDate(lastSevenDays), currDateConverted],
        'Last 30 days': [this.momentToDate(lastThirdtyDays), currDateConverted],
        'Last 90 days': [this.momentToDate(lastNinetyDays), currDateConverted],
        'Last month': [this.momentToDate(lastMonth), currDateConverted],
        'Week to date': [this.momentToDate(weekToDate), currDateConverted],
        'Month to date': [this.momentToDate(monthToDate), currDateConverted],
      },
    };
  },
  filters: {
    date(val) {
      return val ? moment(val).format('YYYY-MM-DD') : '';
    },
  },
  computed: {},
  methods: {
    dateFormat(classes, date) {
      if (!classes.disabled) {
        let today = moment();
        today.tz(this.timezone);
        let todayDate = this.momentToDate(today.endOf('date'));
        classes.disabled = todayDate.getTime() < date.getTime();
      }
      return classes;
    },
    onDateRangePicked(pickedDate) {
      this.$props.handler(pickedDate);
    },
    momentToDate(time) {
      let date = new Date(time.format('YYYY-MM-DDTHH:mm:ss.sss'));
      // if (this.isSafari()) {
      //   date = new Date(time.format('YYYY-MM-DDTHH:mm:ss.sssZ'));
      // }
      return date;
    },
    isSafari() {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.indexOf('safari') != -1) {
        if (ua.indexOf('chrome') > -1) {
          return false; // Chrome
        } else {
          return true; // Safari
        }
      }
      return false;
    },
    updateValue() {
      this
    }
  },
  watch: {
    '$route.query': {
      handler(query) {
        // console.log(query);
        if (!query.from && !query.to) {
          console.log(query);
          this.dateRange.startDate = null;
          this.dateRange.endDate = null;
        }
      },
      immediate: true,
    },
  }
};
</script>

<style scoped>
.slot {
  background-color: #aaa;
  padding: 0.5rem;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.text-black {
  color: #000;
}
@media only screen and (max-width: 480px) {
  .text-mg-40 {
    margin: 0px 2px !important;
  }
  .text-mg-20 {
    margin: 0px 5px !important;
  }
}
.text-mg-40 {
  margin: 0px 40px;
}
.text-mg-20 {
  margin: 0px 10px;
}
</style>
