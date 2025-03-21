<template>
  <div>
   
    <div v-if="sessionExpired" class="error-banner">
      Sua sessão expirou. Faça login novamente.
    </div>
    
   
    <router-view />
  </div>
</template>

<script>

import "@/assets/css/error-banner.css";

export default {
  data() {
    return {
      sessionExpired: false, 
    };
  },
  mounted() {
    this.checkTokenExpiration();
    setInterval(this.checkTokenExpiration, 30000);
  },
  methods: {
    checkTokenExpiration() {
      const tokenExpiration = localStorage.getItem("tokenExpiration");
      if (!tokenExpiration) return;

      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime >= parseInt(tokenExpiration)) {
        localStorage.clear(); 
        this.sessionExpired = true;

        setTimeout(() => {
          this.$router.push({ path: "/", query: { expired: "true" } });
          this.sessionExpired = false;
        }, 4000);
      }
    }
  }
};
</script>
