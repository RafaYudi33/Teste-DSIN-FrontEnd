<template>
  <div class="flex-center">
   
    <h1 class="salon-name">Beauty Leila Salon</h1>

    <div class="login-wrapper">
      
      <h2 class="login-title">Faça seu Login:</h2>

      <div class="login-container">
        <form @submit.prevent="login">
          <input type="text" v-model="username" placeholder="Nome de usuário" required />
          <input type="password" v-model="password" placeholder="Senha" required />
          <button type="submit" class="btn btn-primary">ENTRAR</button>
        </form>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <p class="register-text">
          Não tem uma conta? 
          <router-link to="/register" class="register-link">Cadastre-se</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/services/api";

export default {
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async login() {
      try {
        const response = await api.post("/login", {
          username: this.username,
          password: this.password,
        });

        const { token,expirationTime,role,idUser,name,username} = response.data;

        localStorage.setItem("authToken", token);
        localStorage.setItem("userRole", role);
        localStorage.setItem("tokenExpiration", expirationTime);
        localStorage.setItem("idUser", idUser);
        localStorage.setItem("name", name);
        localStorage.setItem("username", username);


        console.log("Dados armazenados com sucesso:", { token, role, expirationTime });
        
        if (role === "ROLE_ADMIN") {
          this.$router.push("/admin-dashboard");
        } else if (role === "ROLE_CLIENT") {
          this.$router.push("/client-dashboard");
        } else {
          this.errorMessage = "Permissão desconhecida. Contate o suporte.";
        }

      } catch (error) {
        this.errorMessage = "Erro ao fazer login. Verifique suas credenciais.";
        console.error("Erro no login:", error);
      }
    },
  },
};
</script>

<style scoped>
@import "../assets/css/login.css";
</style>
