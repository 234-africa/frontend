<template>
  <div>
    <p>Loading...</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  mounted() {
    const code = this.$route.query.code;

    axios.get(`https://event-ticket-qa70.onrender.com/api/auth/google/callback?code=${code}`)
      .then(response => {
        const token = response.data.token;
        // Store the token or perform other actions as needed
      })
      .catch(error => {
        console.log('Error:', error);
      });
  },
};
</script>
