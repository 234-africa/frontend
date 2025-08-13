<template>
  <div class="container text-start py-5">
    <div class="row align-items-center">
      <!-- Text Section -->
      <div class="col-lg-6 mb-4 mb-lg-0">
        <h1 class="fw-bold mb-3">About Us</h1>
        <p class="fs-6 text-muted mb-4">
          Welcome to 234 AFRICA, your premier event ticketing platform dedicated
          to connecting people with unforgettable experiences across Africa.
        </p>
        <p class="fs-6 text-muted">
          Our platform connects event organizers and attendees in a seamless
          way, giving you real-time access to tickets, event details, and more.
        </p>
        <p class="fs-6 text-muted">
          Join our growing community and never miss out on the next big thing
          around you!
        </p>
      </div>

      <!-- Image Section -->
      <div class="col-lg-6 text-center">
        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
          alt="People enjoying an event"
          class="img-fluid rounded"
        />
      </div>
    </div>
  </div>
</template>

<style>
.typewriter {
  display: inline-block;
  overflow: hidden;
  animation: typing 2s steps(40, end), blink-caret 0.75s step-end infinite;
}

@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes blink-caret {
  from,
  to {
    border-color: transparent;
  }
  50% {
    border-color: #000;
  }
}
</style>
