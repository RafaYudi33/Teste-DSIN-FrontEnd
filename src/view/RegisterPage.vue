<template>
  <div class="flex-center">
    
    <h1 class="salon-name">Beauty Leila Salon</h1>

    <div class="register-wrapper">
      
      <h2 class="register-title">Crie sua conta:</h2>

      
      <div class="register-container">
        <form @submit.prevent="register">
          <input type="text" v-model="name" placeholder="Nome Completo" required />
          <input type="text" v-model="username" placeholder="Nome de Usuário" required />
          <input type="password" v-model="password" placeholder="Senha" @input="checkPasswordStrength" required />
          
          
          <div class="password-strength">
            <div class="strength-bar" :class="passwordStrengthClass"></div>
            <p class="strength-text">{{ passwordStrengthText }}</p>
          </div>

          <input type="password" v-model="confirmPassword" placeholder="Confirme sua Senha" required />
          <button type="submit" class="btn btn-primary">CADASTRAR</button>
        </form>

       
        <transition name="fade">
          <p v-if="successMessage" class="success">{{ successMessage }}</p>
        </transition>

       
        <transition name="fade">
          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </transition>

        <p class="login-text">
          Já tem uma conta? 
          <router-link to="/" class="login-link">Faça login</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/services/api";
import zxcvbn from "zxcvbn";

export default {
  data() {
    return {
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
      successMessage: "", 
      errorMessage: "",
      passwordStrengthText: "", 
      passwordStrengthClass: "", 
    };
  },
  methods: {
    checkPasswordStrength() {
      const result = zxcvbn(this.password);
      const score = result.score;

      const strengthMap = {
        0: { text: "Muito Fraca", class: "weak" },
        1: { text: "Fraca", class: "weak" },
        2: { text: "Média", class: "medium" },
        3: { text: "Forte", class: "strong" },
        4: { text: "Muito Forte", class: "very-strong" },
      };

      this.passwordStrengthText = strengthMap[score].text;
      this.passwordStrengthClass = strengthMap[score].class;
    },

    async register() {
      this.errorMessage = "";
      this.successMessage = "";

      if (this.password !== this.confirmPassword) {
        this.errorMessage = "As senhas não coincidem.";
        return;
      }

      try {
        const response = await api.post("/client", {
          name: this.name,
          username: this.username,
          password: this.password,
        });

        console.log("Cadastro realizado com sucesso:", response.data);

       
        this.successMessage = "Cadastro realizado com sucesso! Redirecionando...";

        
        setTimeout(() => {
          this.$router.push("/");
        }, 3000);
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = "Erro ao cadastrar. Tente novamente.";
        }
        console.error("Erro no cadastro:", error);
      }
    },
  },
};
</script>

<style scoped>
@import "../assets/css/register.css";


.success {
  color: #28a745;
  font-size: 14px;
  margin-top: 10px;
  font-weight: bold;
  text-align: center;
}


.error {
  color: #E63946;
  font-size: 14px;
  margin-top: 10px;
  font-weight: bold;
  text-align: center;
}


.password-strength {
  margin-top: 8px;
}

.strength-bar {
  height: 6px;
  width: 100%;
  border-radius: 5px;
  transition: width 0.3s ease-in-out;
}


.weak {
  background-color: #e74c3c;
  width: 25%;
}

.medium {
  background-color: #f39c12;
  width: 50%;
}

.strong {
  background-color: #2ecc71;
  width: 75%;
}

.very-strong {
  background-color: #27ae60;
  width: 100%;
}


.strength-text {
  font-size: 14px;
  margin-top: 5px;
  text-align: center;
  font-weight: bold;
  color: #4a4a4a;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
