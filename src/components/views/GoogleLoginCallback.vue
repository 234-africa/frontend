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

<<<<<<< HEAD
    axios.get(`https://event-ticket-backend-yx81.onrender.com/api/auth/google/callback?code=${code}`)
=======
    axios.get(`https://event-ticket-qa70.onrender.com/api/auth/google/callback?code=${code}`)
>>>>>>> 24f4f118 (m)
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
