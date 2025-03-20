<template>
  <div class="appointments-table admin-table">
    <vue-good-table
      :columns="columns"
      :rows="appointments"
      :pagination-options="{
        enabled: true,
        perPage: 10,
        position: 'bottom',
        perPageDropdown: [10, 20, 30],
      }"
      styleClass="vgt-table"
    >
      <template #table-row="props">
        <span v-if="props.column.field === 'actions'" class="action-buttons">
          <button class="btn btn-primary btn-small" @click="viewDetails(props.row)">Detalhes</button>
          <button class="btn btn-edit btn-small" @click="openEditDialog(props.row)">Editar</button>
          <button
            class="btn btn-success btn-small btn-confirm"
            @click="confirmAppointment(props.row)"
            :disabled="props.row.status === 'CONFIRMADO'"
          >
            {{ props.row.status === 'CONFIRMADO' ? "Confirmado" : "Confirmar" }}
          </button>
        </span>
      </template>
    </vue-good-table>

    <!-- 🔥 Banner de Sucesso -->
    <div v-if="showSuccessMessage" class="success-banner">
      {{ successMessage }}
    </div>

    <!-- 🔥 Banner de Erro -->
    <div v-if="showErrorMessage" class="error-banner">
      {{ errorMessage }}
    </div>

    <!-- Modal de Detalhes -->
    <div v-if="showDetails" class="modal">
      <div class="modal-content">
        <h2>Detalhes do Agendamento</h2>
        <p><strong>Cliente:</strong> {{ selectedAppointment.clientName }}</p>
        <p><strong>Data:</strong> {{ formatDate(selectedAppointment.dateTime) }}</p>
        <p><strong>Status:</strong> {{ selectedAppointment.status }}</p>
        <h4>Serviços:</h4>
        <div v-for="service in selectedAppointment.beautyServices" :key="service.id" class="service-item">
          <p><strong>{{ service.name }}</strong> - R$ {{ service.price.toFixed(2) }} ({{ service.durationMinutes }} min)</p>
          <p class="service-description"><em>{{ service.description }}</em></p>
        </div>
        <button class="btn btn-error" @click="closeDetails">Fechar</button>
      </div>
    </div>

    <!-- Modal de Edição -->
    
    <div v-if="showEditDialog" class="modal">
      <div class="modal-content">
        <h2>Editar Agendamento</h2>

        <label>Selecione os serviços:</label>
        <div class="service-options">
          <label v-for="service in services" :key="service.id" class="service-checkbox">
            <input type="checkbox" :value="service.id" v-model="selectedServices" />
            {{ service.name }} - R$ {{ service.price.toFixed(2) }} ({{ service.durationMinutes }} min)
          </label>
        </div>

        <label for="appointment-date">Escolha a data e hora:</label>
        <input type="datetime-local" v-model="appointmentDate" id="appointment-date" class="date-input" />

        <!-- Dropdown Customizado -->
        <label>Status do agendamento:</label>
        <div class="dropdown">
          <button class="btn btn-status" @click="dropdownOpen = !dropdownOpen">
            {{ selectedStatus || 'Selecione o status' }}
          </button>
          <div v-show="dropdownOpen" class="dropdown-content">
            <button 
              v-for="option in statusOptions" 
              :key="option.value"
              class="btn"
              :class="{ 
                'btn-success': option.value === 'CONFIRMADO',
                'btn-error': option.value === 'CANCELADO'
              }"
              @click="selectStatus(option.value)"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn btn-success" @click="updateAppointment">Salvar</button>
          <button class="btn btn-error" @click="closeEditDialog">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { VueGoodTable } from "vue-good-table-next";
import "vue-good-table-next/dist/vue-good-table-next.css";
import api from "@/services/api";
import "@/assets/css/modal.css"; 
import "@/assets/css/success-banner.css"; 
import "@/assets/css/error-banner.css"; 

export default {
  components: {
    VueGoodTable,
  },
  data() {
    return {
      appointments: [],
      services: [],
      selectedServices: [],
      appointmentDate: "",
      selectedStatus: "", // Mantido para controle do dropdown
      columns: [
        { label: "Cliente", field: "clientName" },
        { label: "Data", field: "dateTime", formatFn: this.formatDate },
        { label: "Status", field: "status" },
        { label: "Qtd. Serviços", field: "serviceCount" },
        { label: "Ações", field: "actions", sortable: false },
      ],
      dropdownOpen: false,
      statusOptions: [
        { value: 'PENDENTE', label: 'Pendente' },
        { value: 'CONFIRMADO', label: 'Confirmado' },
        { value: 'CANCELADO', label: 'Cancelado' },
        
      ],
      showEditDialog: false,
      showDetails: false,
      showSuccessMessage: false,
      showErrorMessage: false,
      errorMessage: "",
      successMessage: "",
      selectedAppointment: {},
    };
  },
  methods: {
    selectStatus(status) {
      this.selectedStatus = status;
      this.dropdownOpen = false;
    },
    async fetchAppointments() {
      try {
        const token = localStorage.getItem("authToken");

        const response = await api.get("/appointment/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.appointments = response.data.map(appointment => ({
          id: appointment.id,
          clientName: appointment.client.name, 
          dateTime: appointment.dateTime,
          status: appointment.status,
          serviceCount: appointment.beautyServices.length,
          beautyServices: appointment.beautyServices,
        }));
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
      }
    },
    async confirmAppointment(appointment) {
      try {
        const token = localStorage.getItem("authToken");
        const response = await api.put(`/appointment/confirm`, {}, {
          params: { id: appointment.id },
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {  

          this.successMessage = "Agendamento confirmado com sucesso!";
          appointment.status = "CONFIRMADO";
          this.showSuccessMessage = true;

          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 3000);
        } else {
          
          this.errorMessage = "Não foi possível confirmar o agendamento. Tente novamente.";
          this.showErrorMessage = true;

          setTimeout(() => {
            this.showErrorMessage = false;
          }, 3000);
        }
      } catch (error) {
        console.error("Erro ao confirmar agendamento:", error);
        this.errorMessage = "Erro ao confirmar o agendamento.";
        this.showErrorMessage = true;

        setTimeout(() => {
          this.showErrorMessage = false;
        }, 3000);
      }
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
    async updateAppointment() {
      const token = localStorage.getItem("authToken");

      const updatedAppointment = {
        id: this.selectedAppointment.id,
        beautyServicesIds: this.selectedServices,
        dateTime: this.appointmentDate,
        status: this.selectedStatus,
      };

      try {
        await api.put("/appointment/full-update", updatedAppointment, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.successMessage = "Agendamento atualizado com sucesso!";
        this.showSuccessMessage = true;
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);

        this.fetchAppointments();
        this.closeEditDialog();
      } catch (error) {
        if (error.response && error.response.data) {
          const responseData = error.response.data;

          if (responseData.message === "Modificações só são permitidas em mais de 2 dias do agendamento") {
            this.errorMessage = "Você só pode editar agendamentos com pelo menos 2 dias de antecedência!";
          } else if (responseData.errors && responseData.errors.dateTime) {
            this.errorMessage = "Não é permitido selecionar datas passadas!";
          } else {
            this.errorMessage = "Erro ao atualizar agendamento. Tente novamente.";
          }
        } else {
          this.errorMessage = "Erro inesperado ao atualizar agendamento.";
        }

        this.showErrorMessage = true;
        setTimeout(() => {
          this.showErrorMessage = false;
        }, 3000);
      }
    },
    viewDetails(appointment) {
      this.selectedAppointment = appointment;
      this.showDetails = true;
    },
    closeDetails() {
      this.showDetails = false;
      this.selectedAppointment = {};
    },
    async openEditDialog(appointment) {
      this.selectedAppointment = appointment;
      this.showEditDialog = true;

      await this.fetchServices();

      this.selectedServices = appointment.beautyServices.map(service => service.id);
      this.appointmentDate = appointment.dateTime.slice(0, 16);
      this.selectedStatus = appointment.status;
    },
    closeEditDialog() {
      this.showEditDialog = false;
      this.selectedAppointment = {};
      this.selectedServices = [];
      this.appointmentDate = "";
      this.selectedStatus = "";
    },
    formatDate(dateTime) {
      const date = new Date(dateTime);
      return date.toLocaleDateString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit" });
    },
  },
  mounted() {
    this.fetchAppointments();
  },
};
</script>



<style scoped>
/* Tornando a tabela mais larga */
.admin-table {
  max-width: 1000px;
  margin: 0 auto;
}

/* Botões alinhados */
.action-buttons {
  display: flex;
  gap: 6px;
}

/* Estilização geral para botões pequenos */
.btn-small {
  padding: 6px 14px;
  font-size: 13px;
}

/* Botão Editar */
.btn-edit {
  background-color: #4A4A4A;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

.btn-edit:hover {
  background-color: #363636;
}

/* Botão Confirmar */
.btn-success {
  background-color: #28a745;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

.btn-confirm {
  min-width: 110px;
  text-align: center;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-success:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

/* 🔥 Estilização do Dropdown */
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown .btn-status {
  
  background-color: transparent;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 6px 12px;
  cursor: pointer;
  width: 100%;
  text-align: left;
  font-size: 14px;
}

.dropdown .btn-status:hover {
  background-color: #f8f8f8;
}


.dropdown-content {
  position: absolute;
  background-color: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  z-index: 10;
  min-width: 150px;
  top: 100%;
  left: 0;
  padding: 5px 0;
  border: 1px solid #ccc;
}


.dropdown-content .btn {
  content: "▼";
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  border: none;
  background: none;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
}

.dropdown-content .btn:hover {
  background-color: #f1f1f1;
}


.dropdown-content .btn-success {
  color: green;
}

.dropdown .btn-status::after {
  content: "▼";
  font-size: 12px;
  color: #666;
  margin-left: 8px;
}

.dropdown-content .btn-error {
  color: red;
}


.dropdown-content .btn:disabled {
  color: gray;
  cursor: not-allowed;
}
</style>

