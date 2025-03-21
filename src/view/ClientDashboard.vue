<template>
  <div class="page-container client-dashboard">
    <!-- Header -->
    <header class="header">
      <h1 class="salon">Beauty Leila Salon</h1>
      <div class="header-right">
        <div class="user-info">
          <p class="user-name">{{ clientName }}</p>
          <p class="user-username">@{{ clientUsername }}</p>
        </div>
        <button class="logout-btn" @click="logout">Sair</button>
      </div>
    </header>

   
    <main class="content">
      <div class="table-container">
        <div class="table-header">
          <h2>Seus Agendamentos</h2>
          <button class="btn btn-primary" @click="openNewAppointmentDialog">Novo Agendamento</button>
          
        </div>

        <AppointmentsTable @openEditDialog="openEditDialog" />
      </div>
    </main>

    
    <div v-if="showSuccessMessage" class="success-banner">
      Agendamento realizado com sucesso!
    </div>

    
    <div v-if="showErrorMessage" class="error-banner">
      {{ errorMessage }}
    </div>

    <div v-if="showSuggestionMessage" class="warning-banner">
      {{ suggestionMessage }}
    </div>

    
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

    
    <footer class="footer">
      <p>© 2025 Beauty Leila Salon - Todos os direitos reservados</p>
    </footer>
  </div>
</template>

<script>
import AppointmentsTable from "@/components/AppointmentsTable.vue";
import api from "@/services/api";
import "@/assets/css/header.css";
import "@/assets/css/footer.css";
import "@/assets/css/success-banner.css";
import "@/assets/css/error-banner.css";
import "@/assets/css/warning-banner.css"; 
import "@/assets/css/modal.css"; 

export default {
  name: "ClientDashboard",
  components: {
    AppointmentsTable,
  },
  data() {
    return {
      clientName: localStorage.getItem("name") || "Cliente",
      clientUsername: localStorage.getItem("username") || "usuario",
      showNewAppointmentDialog: false,
      showSuggestionMessage: false,
      suggestionMessage: "",
      showEditDialog: false,
      showSuccessMessage: false,
      suggestedAppointment: {},
      showErrorMessage: false,
      hasSeenSuggestion: false,
      errorMessage: "",
      selectedAppointment: {},
      services: [],
      selectedServices: [],
      appointmentDate: "",
    };
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push("/");
    },


    openNewAppointmentDialog() {
      this.hasSeenSuggestion = false;
      this.showNewAppointmentDialog = true;
      this.fetchServices();
    },


    closeNewAppointmentDialog() {
      this.hasSeenSuggestion = false;
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
        }, 6000);
        return;
      }

      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("idUser");

      try {
        const response = await api.get(`/appointment?id=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userAppointments = response.data;

        const selectedDate = new Date(this.appointmentDate);
        const weekStart = new Date(selectedDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay()); 

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6); 

        const existingAppointment = userAppointments.find(appointment => {
          const appointmentDate = new Date(appointment.dateTime);
          return appointmentDate >= weekStart && appointmentDate <= weekEnd;
        });

        if (existingAppointment && !this.hasSeenSuggestion) {
          this.hasSeenSuggestion = true;
          this.showSuggestionMessage = true;

          const formattedDate = new Intl.DateTimeFormat("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(existingAppointment.dateTime));

          this.suggestedAppointment = existingAppointment;
          
          this.suggestionMessage = `Ops, verifiquei que você já tem um agendamento para ${formattedDate}. 
          Se preferir, volte ao painel, edite o agendamento e adicione os serviços desejados.`;

        setTimeout(() => {
          this.showSuggestionMessage = false
        }, 10000);

         
          return;
        }

        const appointmentData = {
          clientId: userId,
          beautyServicesIds: this.selectedServices,
          dateTime: this.appointmentDate,
        };

        await api.post("/appointment", appointmentData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        
        this.successMessage = "Agendamento realizado com sucesso!";
        this.showSuccessMessage = true;
        
        setTimeout(() => {
          this.showSuccessMessage = false;
          window.location.reload();
        }, 3000);

        this.closeNewAppointmentDialog();
      } catch (error) {
        if (error.response && error.response.data) {
          const responseData = error.response.data;

          if (responseData.message === "Validation error" && responseData.errors?.dateTime) {
            this.errorMessage = "Não é permitido selecionar datas passadas!";
          } else {
            this.errorMessage = responseData.message || "Erro ao criar agendamento. Tente novamente.";
          }
        } else {
          this.errorMessage = "Erro inesperado ao criar agendamento.";
        }

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

.client-dashboard {
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
  max-width: 800px;
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
