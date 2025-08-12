<template>
  <div>
    <div
      id="user-activity"
      class=""
    >
      <div class="text-start border-0 pb-0 d-sm-flex d-block">
        <div>
          <h4 class="card-title mb-1">Customer Map</h4>
          <small class="mb-0">Lorem Ipsum is simply dummy text of the printing</small>
        </div>
        <div class="card-action card-tabs mt-3 mt-sm-0">
          <ul
            class="nav nav-tabs"
            role="tablist"
          >
            <li class="nav-item">
              <a
                class="nav-link active"
                data-toggle="tab"
                @click="setFilter('monthly')"
                role="tab"
              >
                Monthly
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                data-toggle="tab"
                @click="setFilter('weekly')"
                role="tab"
              >
                Weekly
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                data-toggle="tab"
                @click="setFilter('daily')"
                role="tab"
              >
                Today
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="card-body">
        <div
          class="tab-content"
          id="myTabContent"
        >
          <div
            class="tab-pane fade show active"
            id="user"
            role="tabpanel"
          >
            <div
              id="charts"
              class="chart-container"
            >
              <apexchart
                type="bar"
                :options="options"
                :series="series"
              ></apexchart>
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import { mapGetters } from "vuex";
import VueApexCharts from "vue3-apexcharts";

export default {
  components: {
    apexchart: VueApexCharts
  },
  computed: {
    ...mapGetters(["getVisits"])
  },
  data() {
    return {
      filter: "monthly",
      options: {},
      series: []
    };
  },
  mounted() {
    this.$store
      .dispatch("fetchVisits")
      .then(response => {
       // console.log(response);
        this.generateChart();
      })
      .catch(error => {
       // console.log(error);
      });
  },
  methods: {
    generateChart() {
      const visits = this.filterVisits();
      const countsMap = new Map();

      // Group counts by date and sum them
      visits.forEach(visit => {
        const date = visit.time.slice(0, 10);
        const count = visit.count;

        if (countsMap.has(date)) {
          countsMap.set(date, countsMap.get(date) + count);
        } else {
          countsMap.set(date, count);
        }
      });

      // Sort dates in ascending order
      const sortedDates = Array.from(countsMap.keys()).sort();

      const dates = sortedDates.map(date => date.slice(5)); // Extract month and day
      const counts = sortedDates.map(date => countsMap.get(date));

      this.options = {
        chart: {
          type: "bar"
        },
        series: [
          {
            name: "Total Visits",
            data: counts.map(count => Math.floor(count))
          }
        ],
        xaxis: {
          categories: dates
        }
      };
    },
    filterVisits() {
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        today.getDate()
      );

      if (this.filter === "daily") {
        return this.getVisits.filter(visit => {
          const visitDate = new Date(visit.time);
          return visitDate.toDateString() === today.toDateString();
        });
      } else if (this.filter === "weekly") {
        return this.getVisits.filter(visit => {
          const visitDate = new Date(visit.time);
          return visitDate >= weekAgo && visitDate <= today;
        });
      } else if (this.filter === "monthly") {
        return this.getVisits.filter(visit => {
          const visitDate = new Date(visit.time);
          return visitDate >= monthAgo && visitDate <= today;
        });
      }

      return [];
    },
    setFilter(filter) {
      this.filter = filter;
      this.generateChart();
    }
  }
};
</script>

<style>
#charts {
  max-width: 1000px;
  margin: 0 auto;
}
.chart-container {
  margin-bottom: 0; /* Remove bottom margin */
  padding-bottom: 1rem; /* Add some bottom padding */
}

@media (max-width: 576px) {
  /* Apply specific styles for small screens (e.g., mobile devices) */
  .chart-container {
    padding-bottom: 0.5rem; /* Adjust the padding as needed */
  }
}
</style>
