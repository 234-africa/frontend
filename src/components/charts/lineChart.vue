<template>
  <div>
    <div class="">
      <div class="text-start border-0 pb-0 d-sm-flex d-block">
        <div class="header-content">
          <h4 class="card-title mb-1">Sales</h4>
          <small class="mb-0">Lorem ipsum dolor sit amet, consectetur</small>
        </div>
        <div class="dropdown mt-3 mt-sm-0">
          <div class="dropdown">
            <button
              class="btn btn-primary dropdown-toggle"
              type="button"
              id="filterDropdown"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {{ filter }}
            </button>
            <div class="dropdown-menu" style="color: #f4a213;" aria-labelledby="filterDropdown">
              <a
                class="dropdown-item"
                :class="{ active: filter === 'daily' }"
                @click="filter = 'daily'; filterChart('daily')"
              >Daily</a>
              <a
                class="dropdown-item"
                :class="{ active: filter === 'weekly' }"
                @click="filter = 'weekly'; filterChart('weekly')"
              >Weekly</a>
              <a
                class="dropdown-item"
                :class="{ active: filter === 'monthly' }"
                @click="filter = 'monthly'; filterChart('monthly')"
              >Monthly</a>
            </div>
          </div>
        </div>
      </div>
      <div class="">
        <div class="tab-content" id="myTabContent">
          <div class="tab-pane fade show active" id="user" role="tabpanel">
            <div id="chart"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ApexCharts from 'apexcharts';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      filter: 'daily', // Initial filter value
 // Placeholder for chart instance
    };
  },
  mounted() {
    this.$store.dispatch('fetchOrders').then(() => {
      this.renderChart();
    });
  },
  computed: {
    ...mapGetters(['getOrders']),
  },
  methods: {
    renderChart() {
      const orders = this.getOrders;
      const salesData = this.calculateSalesData(orders, 'daily').reverse(); // Reverse the salesData array

      const options = {
        series: [
          {
            name: 'Total Sales',
            data: salesData,
          },
        ],
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'straight',
        },
        title: {
          text: 'Total Sales per Day',
          align: 'left',
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: this.generateDates(salesData.length),
        },
      };

      const chart = new ApexCharts(document.querySelector('#chart'), options);
      chart.render();

      // Store the chart instance
      this.chart = chart;
    },
    calculateSalesData(orders, timeframe) {
      const salesData = [];
      const salesByDate = {};
      const salesByWeek = {};
      const salesByMonth = {};

      orders.forEach(order => {
        const date = this.extractDate(order.created_at);
        const week = this.getWeekNumber(order.created_at);
        const month = this.getMonthYear(order.created_at);

        // Calculate total sales per day
        if (salesByDate[date]) {
          salesByDate[date] += order.products[0].totalPrice;
        } else {
          salesByDate[date] = order.products[0].totalPrice;
        }

        // Calculate total sales per week
        if (salesByWeek[week]) {
          salesByWeek[week] += order.products[0].totalPrice;
        } else {
          salesByWeek[week] = order.products[0].totalPrice;
        }

        // Calculate total sales per month
        if (salesByMonth[month]) {
          salesByMonth[month] += order.products[0].totalPrice;
        } else {
          salesByMonth[month] = order.products[0].totalPrice;
        }
      });

      // Get the sales data for the selected timeframe (per day, per week, or per month)
      let selectedSalesData = [];
      if (timeframe === 'daily') {
        selectedSalesData = Object.values(salesByDate);
      } else if (timeframe === 'weekly') {
        selectedSalesData = Object.values(salesByWeek);
      } else if (timeframe === 'monthly') {
        selectedSalesData = Object.values(salesByMonth);
      }

      selectedSalesData.forEach(totalPrice => {
        salesData.push(totalPrice);
      });

      return salesData;
    },
    extractDate(dateTime) {
      const dateObj = new Date(dateTime);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    },
    getWeekNumber(dateTime) {
      const date = new Date(dateTime);
      const oneJan = new Date(date.getFullYear(), 0, 1);
      const weekNum = Math.ceil(((date - oneJan.getDay() + 1) + 7) / 7);

      return `${date.getFullYear()}-W${weekNum}`;
    },
    getMonthYear(dateTime) {
      const dateObj = new Date(dateTime);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');

      return `${year}-${month}`;
    },
    generateDates(length) {
      const dates = [];
      const today = new Date();

      for (let i = length - 1; i >= 0; i--) {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        const formattedDate = this.formatDate(date);
        dates.push(formattedDate);
      }

      return dates;
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    },
    filterChart(timeframe) {
      const orders = this.getOrders;
      const salesData = this.calculateSalesData(orders, timeframe).reverse();

      this.chart.updateSeries([{ data: salesData }]);
      this.chart.updateOptions({
        title: {
          text: `Total Sales per ${timeframe.charAt(0).toUpperCase()}${timeframe.slice(1)}`,
        },
        xaxis: {
          categories: this.generateDates(salesData.length),
        },
      });
    },
  },
};
</script>
<style>
.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.header-content {
  flex: 1;
}

@media (max-width: 576px) {
  /* Apply specific styles for small screens (e.g., mobile devices) */
  .card-header {
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }

  .header-content {
    margin-bottom: 1rem; /* Add some bottom margin for spacing */
  }

  .dropdown {
    margin-top: 1rem; /* Add some top margin for spacing */
  }
}
</style>
