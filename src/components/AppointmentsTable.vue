<template>
    <div class="appointments-table">
      <vue-good-table
        :columns="columns"
        :rows="appointments"
        :pagination-options="{
          enabled: true,
          perPage: 5,
          position: 'bottom',
          perPageDropdown: [5, 10, 15],
        }"
        styleClass="vgt-table"
      >
        <template #table-row="props">
          <span v-if="props.column.field === 'actions'" class="action-buttons">
            <button class="btn btn-primary btn-small" @click="viewDetails(props.row)">Detalhes</button>
            <button class="btn btn-edit btn-small" @click="openEditDialog(props.row)">Editar</button>
          </span>
        </template>
      </vue-good-table>

      <!-- 🔥 Banner de Sucesso -->
      <div v-if="showSuccessMessage" class="success-banner">
        Agendamento atualizado com sucesso!
      </div>

      <!-- 🔥 Banner de Erro -->
      <div v-if="showErrorMessage" class="error-banner">
        {{ errorMessage }}
      </div>

      <!-- Modal de Detalhes -->
      <div v-if="showDetails" class="modal">
        <div class="modal-content">
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
      columns: [
        { label: "Data", field: "dateTime", formatFn: this.formatDate },
        { label: "Status", field: "status" },
        { label: "Qtd. Serviços", field: "serviceCount" },
        { label: "Ações", field: "actions", sortable: false },
      ],
      showDetails: false,
      showEditDialog: false,
      showSuccessMessage: false,
      showErrorMessage: false,
      errorMessage: "",
      selectedAppointment: {},
    };
  },
  methods: {
    async fetchAppointments() {
      try {
        const userId = localStorage.getItem("idUser");
        const token = localStorage.getItem("authToken");

        const response = await api.get(`/appointment?id=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.appointments = response.data.map(appointment => ({
          id: appointment.id,
          dateTime: appointment.dateTime,
          status: appointment.status,
          serviceCount: appointment.beautyServices.length,
          beautyServices: appointment.beautyServices,
        }));
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
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
    },
    closeEditDialog() {
      this.showEditDialog = false;
      this.selectedAppointment = {};
      this.selectedServices = [];
      this.appointmentDate = "";
    },
    async updateAppointment() {
      const token = localStorage.getItem("authToken");

      const updatedAppointment = {
        id: this.selectedAppointment.id,
        beautyServicesIds: this.selectedServices,
        dateTime: this.appointmentDate,
      };

      try {
        await api.put("/appointment", updatedAppointment, {
          headers: { Authorization: `Bearer ${token}` },
        });

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
        }, 4000);
      }
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
/* Botões alinhados */
.action-buttons {
  display: flex;
  gap: 6px;
}

/* Estilização geral para botões pequenos */
.btn-small {
  padding: 6px 12px;
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
</style>
