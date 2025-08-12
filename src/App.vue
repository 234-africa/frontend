<template>
  <div id="app" class="text-capitalize">
    <nav class="navbar-fixed-top bi "> 
      <topp />
    </nav>
    

      <div class="">
        <div>
          <notifications position="top right" classes="my-custom-class" />
        </div>
        <router-view />
        <sitemap />
      </div>
   
  </div>
</template>
<script>
import topp from "./components/homepage/topp.vue";
import sitemap from "./components/sitemap.vue";
export default {
  components: {
    topp,
    sitemap,
  },
};
</script>

<style>
  :root {
    --bs-primary: #f4a213 !important; ;
  }

  .btn-primary {
    background-color: var(--bs-primary) !important;
    border-color: var(--bs-primary) !important;
    color: white !important;
  }
body .text-primary {
    color: var(--bs-primary) !important;
  }
  .btn-outline-primary{
 background-color: transparent !important;
    border-color: var(--bs-primary) !important;
    color: var(--bs-primary) !important;

  }
    .btn-outline-primary:hover{
 background-color: var(--bs-primary) !important;
    border-color: var(--bs-primary) !important;
    color: white !important;
    
  }
  .btn-primary:hover {
    background-color: white !important;
    border-color: var(--bs-primary) !important;
    color: var(--bs-primary) !important;
  }

  .text-primary {
    color: var(--bs-primary) !important;
  }

  .bg-primary {
    background-color: var(--bs-primary) !important;
  }

  .border-primary {
    border-color: var(--bs-primary) !important;
  }
</style>

