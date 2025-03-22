
<h1 align="center">Frontend do Teste da DSIN</h1>

<br>
<p align="center">
 <a href="#tecnologias">Tecnologias</a> • 
 <a href="#como-rodar">Como Rodar</a> • 
 <a href="#telas">Telas</a> • 
 <a href="#protecao-de-rotas-e-sessao-expirada">Proteção de Rotas e Sessão Expiradas</a>
</p>

<br>

<p align="center">
  <b>Interface de usuário para o gerenciamento de agendamentos da Leilaleila.</b>
</p>

<h2 id="tecnologias">🛠 Tecnologias</h2>

- JavaScript
- CSS
- Vue.js
- Axios para requisições HTTP

<h2 id="como-rodar">🚀 Como Rodar</h2>

### Pré-requisitos
- Vue 3 
- Node.js instalado
- Gerenciador de pacotes (npm ou yarn)

### Clonando

```bash
git clone https://github.com/RafaYudi33/Teste-DSIN-FrontEnd.git
```

### Instalando Dependências

```bash
cd Teste-DSIN-FrontEnd
npm install # ou yarn install
```

### Configuração

Antes de executar a aplicação, você deve configurar a variável de ambiente para apontar para a API:

```env
VUE_APP_API_BASE_URL=http://localhost:8080/api
```

Se você mudar a porta do backend, atualize essa variável no arquivo `.env`. 

### Executando o Projeto

```bash
npm run serve # ou yarn serve
```

A aplicação estará disponível em `http://localhost:8080`. Entretanto as funcionalidades só estarão disponíveis, se a API do back-end estiver rodando.

<h2 id="telas">📱 Telas</h2>

- **Tela de Cadastro**: Permite que novos clientes criem uma conta no sistema.
- **Tela de Login**: Tela para autenticação dos usuários.
- **Dashboard do Cliente**: Página inicial após o login do cliente, mostrando os agendamentos futuros e opções para criar novos agendamentos, e editar agendamentos existentes.
- **Dashboard do Administrador**: Acesso restrito ao admin para gerenciar todos os agendamentos e visualizar relatórios.

- Usuario e Senha do Admin
   - Leilaleila
   - adminLeila**
---
<h3 id="tela-de-cadastro">Tela de Cadastro</h3>

![Tela de Cadastro](./screenshots/TelaDeCadastro.png)

A Tela de Cadastro é onde novos usuários podem criar uma conta para acessar o sistema. Esta tela é projetada para ser intuitiva e amigável, facilitando para o usuário fornecer as informações necessárias para se registrar.

### Funcionalidades e Validações

- **Campos do Formulário**: A tela possui campos para nome de usuário, senha e confirmação de senha. Cada campo é claramente rotulado para garantir que o usuário saiba o que é necessário.
- **Validações Implementadas**:
  - **Campos Vazios Não Permitidos**: Todos os campos devem ser preenchidos; campos vazios não são permitidos e o usuário receberá um alerta se tentar enviar o formulário incompleto.
  - **Senhas Idênticas**: O sistema verifica se a senha e a confirmação de senha são idênticas antes de permitir que o usuário prossiga com o cadastro.
  - **Força da Senha**: A senha deve atender a critérios de média a forte segurança.
  - **Usuário Único**: Antes de submeter o formulário, o sistema verifica se o nome de usuário escolhido já existe na base de dados, garantindo que cada usuário tenha um identificador único.
  
### Feedback Visual

Durante o preenchimento do formulário, o usuário recebe feedback visual imediato sobre a validade das informações inseridas. Campos com dados inválidos são destacados, e mensagens claras são exibidas para indicar o problema, como "Senhas não coincidem", "Senha muito fraca", ou "Nome de usuário indísponivel".

### Endpoint Consumido

- **POST /api/client** -  Este endpoint é utilizado para criar uma nova conta de usuário no sistema.


---

<h3 id="tela-de-login">Tela de Login</h3>

![Tela de Login](./screenshots/TelaDeLogin.png)

A Tela de Login permite que os usuários acessem suas contas inserindo seu nome de usuário e senha. Esta tela realiza verificações básicas para garantir que os campos não sejam enviados vazios e valida as credenciais do usuário.

### Validações
- **Campos Vazios**: Não são permitidos e resultam em uma solicitação ao usuário para preencher todos os campos.
- **Credenciais Inválidas**: Caso o nome de usuário ou a senha estejam incorretos, o sistema notifica o usuário para verificar suas credenciais.

### Endpoint Consumido
- **POST /api/login**


**Response da api contém dados que são usados durante a sessão desse usuário**: 
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJUZXN0ZS1EU0lOIiwic3ViIjoibGVybyIsImV4cCI6MTc0NDMxMjk5OH0.zo2W9-hdPCQB57fOIDqSENIWnTjz6gODJmLzkQhX1ks",
  "expirationTime": 1742514798,
  "role": "ROLE_CLIENT",
  "idUser": 5,
  "name": "Leticia Rotoli",
  "username": "lero"
}
```

### Importância do Token
O token JWT fornecido é crucial para acessar áreas protegidas do sistema. Ele deve ser armazenado de forma segura e enviado em cabeçalhos de autorização para requisições autenticadas subsequentes. Assim como o id do Usuário e sua role, que também serão usados.

---

<h3 id="dashboard-do-cliente">Dashboard do Cliente</h3>

![Dashboard do Cliente](./screenshots/TelaDeDashboardCliente.png)

A **Dashboard do Cliente** é a tela principal para os usuários após o login. Aqui, os clientes podem visualizar seus agendamentos, acessar detalhes, editar ou criar novos. 

### Funcionalidades Principais
- **Header**: Exibe o nome e o usuário do cliente logado. 
- **Botão Novo Agendamento**: Permite ao usuário criar novos agendamentos diretamente.
- **Tabela de Agendamentos**: Mostra todos os agendamentos do cliente com informações como data, status e quantidade de serviços. Cada agendamento possui botões para "Detalhes" e "Editar".

### Endpoint Consumido
- GET /api/appointment?id={userId} - Busca todos os agendamentos do cliente logado.
  
### Modais de Interação

A partir desta tela, os usuários podem interagir com três modais diferentes, cada um com funcionalidades específicas:

1. **Modal de Novo Agendamento**
   - ### Endpoint Consumido
     - POST /api/appointment.
   - **Descrição**: Permite ao usuário adicionar um novo agendamento. Aqui, o cliente pode selecionar os serviços desejados, escolher a data e o horário, e submeter o agendamento para confirmação.
   - **Validações**:
     - Não permite datas passadas.
     - Verifica se o cliente já possui um agendamento na mesma semana e sugere consolidar os serviços em um único agendamento, sem proibir novos agendamentos.
   - ![Novo Agendamento](./screenshots/ModalNovoAgendamento.png)

3. **Modal de Detalhes do Agendamento**
   - **Descrição**: Oferece uma visualização detalhada de um agendamento específico. Mostra todas as informações pertinentes, como serviços inclusos, horários, status, entre outros.
   - ![Detalhes do Agendamento](./screenshots/ModalDetalhesAgendamento.png)

4. **Modal de Edição de Agendamento**
   - ### Endpoint Consumido
     - PUT /api/appointment.
   - **Descrição**: Permite que o usuário faça alterações em um agendamento existente. Pode-se alterar a data e serviços.
   - **Validações**:
     - Não permite a edição para datas passadas.
     - Exige que as modificações sejam feitas com pelo menos dois dias de antecedência em relação à data agendada.
   - ![Edição de Agendamento](./screenshots/ModalEdicaoAgendamento.png)

---


<h3 id="dashboard-do-administrador">Dashboard do Administrador</h3>

![Dashboard do Administrador](./screenshots/TelaDeDashboardAdm.png)

O **Dashboard do Administrador** permite uma visão abrangente e controle sobre todos os agendamentos dentro do sistema. É a central de gerenciamento onde o administrador pode monitorar, ajustar e analisar as operações do salão de beleza.

### Endpoint Consumido
- GET /api/appointment/all - Pra buscar agendamentos de todos os clientes.

### Funcionalidades Principais
- **Header**: Exibe 'Admin' seguido nome de usuário do administrador logado.
- **Botões de Ação Rápida**: Inclui botões para "Editar", "Confirmar" e "Detalhes", permitindo ações imediatas sobre qualquer agendamento listado.
- **Tabela de Agendamentos**: Apresenta todos os agendamentos de todos os clientes. Informações como cliente, data, status e quantidade de serviços são mostradas. Administração completa sobre o status dos agendamentos é fornecida aqui.

### Modais de Interação

O administrador tem acesso a modais específicos que permitem a gestão detalhada e o monitoramento de desempenho:

1. **Modal de Edição de Agendamento**
   - ### Endpoint Consumido
     - PUT /api/appointment/full-update - Consegue editar tudo, com adição do status.
   - **Descrição**: Permite ao administrador editar qualquer aspecto de um agendamento, incluindo a mudança de seu status entre "Confirmado", "Pendente" e "Cancelado".
   - **Validações**:
     - Não permite alterações em datas passadas, mas diferente do cliente, o adm pode editar com quantos dias de antecedência quiser.
   - ![Edição de Agendamento](./screenshots/ModalEdicaoAgendamentoAdmin.png)

3. **Modal de Desempenho Semanal**
   - ### Endpoint Consumido
     - GET /api/reports/last-week
   - **Descrição**: Fornece um relatório detalhado do desempenho semanal, mostrando o faturamento total, a quantidade de agendamentos e o serviço mais lucrativo da semana.
   - ![Desempenho Semanal](./screenshots/ModalDesempenhoSemanal.png)

- Para o botão confirmar foi usado o endpoint /api/appointment/confirm?id={idAgendamento}

### Segurança e Acesso
- **Acesso Restrito**: Apenas usuários autenticados com privilégios administrativos podem acessar este painel, garantindo segurança e integridade das operações.

OBS: Para buscar os serviços, nos dashboards de Admin e Cliente, foi usado o endpoint GET /api/beauty-services

<h2 id="protecao-de-rotas-e-sessao-expirada">🔒 Proteção de Rotas e Sessão Expirada</h2>

### Tratamento de Sessão Expirada
No `App.vue`, a verificação da expiração do token é realizada de forma contínua através do método `checkTokenExpiration`, que é chamado a cada 30 segundos. Este método verifica se o tempo atual excede o tempo de expiração do token armazenado no `localStorage`. Se o token estiver expirado, todas as informações armazenadas localmente são limpas e o estado `sessionExpired` é definido como `true`, exibindo uma mensagem de erro que informa ao usuário que sua sessão expirou. Após um curto período, o usuário é redirecionado para a página de login.

```vue
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
```

### Proteção de Rotas
As rotas são protegidas usando o Vue Router, onde cada rota pode especificar metadados customizados que definem os requisitos de autenticação e de role. O `beforeEach` global guard é usado para verificar esses metadados antes de cada navegação:

- **Autenticação Necessária**: Se a rota requer autenticação (`requiresAuth`), o guard verifica se existe um token válido. Se não houver token, o usuário é redirecionado para a página de login.
- **Role Específica**: Se a rota requer uma role específica (por exemplo, `ROLE_ADMIN` para o dashboard do administrador), o guard verifica se a role do usuário corresponde à role necessária para a rota. Se não corresponder, o usuário é redirecionado para a dashboard apropriada conforme sua role ou para a página de login se não estiver logado.

```javascript
import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "@/view/LoginPage.vue";
import RegisterPage from "@/view/RegisterPage.vue";
import AdminDashboard from "@/view/AdminDashboard.vue";
import ClientDashboard from "@/view/ClientDashboard.vue";

const routes = [
  { path: "/", name: "Login", component: LoginPage },
  { path: "/register", component: RegisterPage },
  { 
    path: "/admin-dashboard", 
    component: AdminDashboard, 
    meta: { requiresAuth: true, role: "ROLE_ADMIN" } 
  },
  { 
    path: "/client-dashboard", 
    component: ClientDashboard, 
    meta: { requiresAuth: true, role: "ROLE_CLIENT" } 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");

  if (to.meta.requiresAuth) {
    if (!token) {
      return next({ path: "/" });
    }

    if (to.meta.role && to.meta.role !== userRole) {
      if (userRole === "ROLE_CLIENT") {
        return next({ path: "/client-dashboard" });
      } else if (userRole === "ROLE_ADMIN") {
        return next({ path: "/admin-dashboard" });
      } else {
        return next({ path: "/" });
      }
    }
  }

  next();
});

export default router;
```

Esses métodos garantem que apenas usuários autorizados acessam recursos sensíveis e que os usuários são informados e redirecionados apropriadamente quando suas sessões expiram.


