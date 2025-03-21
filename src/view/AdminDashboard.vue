<template>
  <div class="page-container admin-dashboard">
   
    <header class="header">
      <h1 class="salon">Beauty Leila Salon</h1>
      <div class="header-right">
        <div class="user-info">
          <p class="user-name">{{ adminName }}</p>
          <p class="user-username">admin @{{ adminUsername }}</p>
        </div>
        <button class="logout-btn" @click="logout">Sair</button>
      </div>
    </header>

    
    <main class="content">
      <div class="table-container">
        <div class="table-header">
          <h2>Painel Admin - Agendamentos</h2>
          <button class="btn btn-primary" @click="openPerformanceDialog">Desempenho Semanal</button>
        </div>
        <AppointmentsTableAdmin />
      </div>
    </main>

    
    <div v-if="showSuccessMessage" class="success-banner">
      Ação realizada com sucesso!
    </div>

    <div v-if="showErrorMessage" class="error-banner">
      {{ errorMessage }}
    </div>

    
    <div v-if="showPerformanceDialog" class="modal">
      <div class="modal-content">
        <h2>Relatório de Desempenho Semanal</h2>
        <div v-if="performanceData">
          <table class="performance-table">
            <tr v-for="(value, key) in performanceData" :key="key">
              <td class="metric-name">{{ key.replace(/_/g, ' ') }}</td>
              <td class="metric-value">{{ value }}</td>
            </tr>
          </table>
        </div>
        <button class="btn btn-error" @click="closePerformanceDialog">Fechar</button>
      </div>
    </div>

    
    <footer class="footer">
      <p>© 2025 Beauty Leila Salon - Todos os direitos reservados</p>
    </footer>
  </div>
</template>

<script>
import AppointmentsTableAdmin from "@/components/AppointmentsTableAdmin.vue";
import api from "@/services/api";
import "@/assets/css/header.css";
import "@/assets/css/footer.css";
import "@/assets/css/success-banner.css";
import "@/assets/css/error-banner.css";
import "@/assets/css/modal.css";

export default {
  name: "AdminDashboard",
  components: {
    AppointmentsTableAdmin,
  },
  data() {
    return {
      adminName: localStorage.getItem("name") || "Administrador",
      adminUsername: localStorage.getItem("username") || "admin",
      showPerformanceDialog: false,
      showSuccessMessage: false,
      showErrorMessage: false,
      errorMessage: "",
      performanceData: null, 
    };
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push("/");
    },
    openPerformanceDialog() {
      this.showPerformanceDialog = true;
      this.fetchPerformanceData();
    },
    closePerformanceDialog() {
      this.showPerformanceDialog = false;
    },
    async fetchPerformanceData() {
      try {
        const token = localStorage.getItem("authToken");

        const response = await api.get("/reports/last-week", {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.performanceData = response.data; 


      } catch (error) {
        this.closePerformanceDialog();
        this.errorMessage = "Erro ao gerar relatório semanal"
        this.showErrorMessage = true;
        setTimeout(() => {
          this.showErrorMessage = false;
        }, 4000);
      }
    },
  },
};
</script>

<style scoped>
.admin-dashboard {
  background: #E0DCD9 !important;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.table-container {
  width: 100%;
  max-width: 1000px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.table-header .btn-primary {
  background-color: #4A4A4A;
  color: white;
  width: auto;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;
}

.table-header .btn-primary:hover {
  background-color: #363636;
}

.performance-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.performance-table tr {
  border-bottom: 1px solid #ddd;
}

.performance-table td {
  padding: 10px;
  text-align: left;
}

.metric-name {
  font-weight: bold;
  text-transform: capitalize;
}

</style>
