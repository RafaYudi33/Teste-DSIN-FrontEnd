<template>
  <div class="page-container admin-dashboard">
    <!-- Header -->
    <header class="header">
      <h1 class="salon">Beauty Leila Salon - Admin</h1>
      <div class="header-right">
        <div class="user-info">
          <p class="user-name">{{ adminName }}</p>
          <p class="user-username">@{{ adminUsername }}</p>
        </div>
        <button class="logout-btn" @click="logout">Sair</button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="content">
      <div class="table-container">
        <div class="table-header">
          <h2>Todos os agendamentos dos clientes</h2>
          <button class="btn btn-primary" @click="openNewAppointmentDialog">Novo Agendamento</button>
        </div>

        <AppointmentsTableAdmin @openEditDialog="openEditDialog" />
      </div>
    </main>

    <!-- Messages -->
    <div v-if="showSuccessMessage" class="success-banner">
      Ação realizada com sucesso!
    </div>

    <div v-if="showErrorMessage" class="error-banner">
      {{ errorMessage }}
    </div>

    <!-- Modal de Novo Agendamento -->
    <div v-if="showNewAppointmentDialog" class="modal">
      <div class="modal-content">
        <h2>Novo Agendamento</h2>

        <label>Selecione os serviços:</label>
        <div class="service-options">
          <label v-for="service in services" :key="service.id" class="service-checkbox">
            <input type="checkbox" :value="service.id" v-model="selectedServices" />
            {{ service.name }} - R$ {{ service.price.toFixed(2) }} ({{ service.durationMinutes }} min)
          </label>
        </div>

        <label for="appointment-date">Escolha a data e hora:</label>
        <input type="datetime-local" v-model="appointmentDate" id="appointment-date" class="date-input" />

        <div class="modal-actions">
          <button class="btn btn-success" @click="createAppointment">Agendar</button>
          <button class="btn btn-error" @click="closeNewAppointmentDialog">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Footer -->
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
      showNewAppointmentDialog: false,
      showSuccessMessage: false,
      showErrorMessage: false,
      errorMessage: "",
      selectedServices: [],
      services: [],
      appointmentDate: "",
    };
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push("/");
    },
    openNewAppointmentDialog() {
      this.showNewAppointmentDialog = true;
      this.fetchServices();
    },
    closeNewAppointmentDialog() {
      this.showNewAppointmentDialog = false;
      this.selectedServices = [];
      this.appointmentDate = "";
    },
    async fetchServices() {
      try {
        const token = localStorage.getItem("authToken");
        const response = await api.get("/beauty-services", {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.services = response.data;
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
      }
    },
    async createAppointment() {
      if (!this.selectedServices.length || !this.appointmentDate) {
        this.errorMessage = "Selecione pelo menos um serviço e escolha uma data!";
        this.showErrorMessage = true;
        setTimeout(() => {
          this.showErrorMessage = false;
        }, 3000);
        return;
      }

      const appointmentData = {
        clientId: localStorage.getItem("idUser"),
        beautyServicesIds: this.selectedServices,
        dateTime: this.appointmentDate,
      };

      try {
        const token = localStorage.getItem("authToken");
        await api.post("/appointment", appointmentData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.showSuccessMessage = true;
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);

        this.closeNewAppointmentDialog();
      } catch (error) {
        this.errorMessage = error.response?.data?.message || "Erro ao criar agendamento.";
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
  background: #F5F5F5;
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
</style>
