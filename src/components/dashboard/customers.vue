<template>
  <div class="content-boy">
    <div class="">
      <!-- row -->
      <div class="containr-fluid">
        <div class="form-head d-flex mb-3 align-items-start">
          <div class="mr-auto d-none d-lg-block">
            <h2 class="text-black font-w600 mb-0">General Customers</h2>
            <p class="mb-0">Here is your general customers list data</p>
          </div>

        </div>

        <div class="row">
          <div class="col-12">
            <div class="table-responsive">
              <table
                id="example5"
                class="display mb-4 dataTablesCard"

              >
                <thead>
                  <tr>
                    <th>Customer ID</th>
                    <th>Join Date</th>

                    <th>Customer Name</th>
                    <th>Address</th>
                    <th>Total Spent</th>
                    <th>Last Order</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr   v-for="user in getUsers" :key="user._id"
                  >
                    <td>{{ user._id }}</td>
                    <td>{{ new Date(user.time).toLocaleString() }}</td>
                    <td>{{ user.name }}</td>
                    <td v-if="user.address">{{ user.address.streetAddress  }}</td>
                     <td v-else>N/A</td>
                    <td>{{ userOrderTotals[user._id] ? '$' + userOrderTotals[user._id] : '-' }}</td>
                    <td><span class="btn btn-sm light btn-secondary fs-16">$ {{ getLastOrderPrice(user._id) }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["getUsersWithAddresses", "getUsers", "getOrders", "error"]),
    usersWithAddresses() {
      return this.getUsersWithAddresses;
    },
    user() {
      return this.getUsers;
    },
    orders() {
      return this.getOrders;
    },
    userOrderTotals() {
      // Calculate total order price for each user
      const userOrderTotals = {};

  this.orders.forEach(order => {
  const userId = order.owner;

  const totalPrice = Array.isArray(order.products)
    ? order.products.reduce((total, product) => {
        return total + (product.totalPrice || 0);
      }, 0)
    : 0;

  if (userOrderTotals.hasOwnProperty(userId)) {
    userOrderTotals[userId] += totalPrice;
  } else {
    userOrderTotals[userId] = totalPrice;
  }
});


      return userOrderTotals;
    }
  },
  mounted() {
 
  },
  methods: {
  
    getLastOrderPrice(userId) {
      const userOrders = this.orders.filter(order => order.owner === userId);
      if (userOrders.length > 0) {
        const lastOrder = userOrders[userOrders.length - 1];
        return lastOrder.products.reduce((total, product) => {
          return total + product.totalPrice;
        }, 0);
      } else {
        return 0;
      }
    },
    getTotalMoneySpent(customer) {
      if (customer.orders && customer.orders.length > 0) {
        // Sum up the total prices of the customer's orders
        return customer.orders.reduce((total, order) => {
          return (
            total +
            order.products.reduce((subtotal, product) => {
              return subtotal + product.totalPrice;
            }, 0)
          );
        }, 0);
      } else {
        return 0;
      }
    }
  }
};
</script>
<style>
td,th {
  padding: 10px;
}

.customer-row {
  margin-bottom: 10px;
}

</style>
