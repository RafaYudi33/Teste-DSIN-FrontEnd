
<h1 align="center">Frontend do Teste da DSIN</h1>

<br>
<p align="center">
 <a href="#tecnologias">Tecnologias</a> • 
 <a href="#como-rodar">Como Rodar</a> • 
 <a href="#telas">Telas</a>
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

A aplicação estará disponível em `http://localhost:8080`.

<h2 id="telas">📱 Telas</h2>

Descreva aqui as principais telas da sua aplicação e suas funcionalidades, como:

- **Tela de Cadastro**: Permite que novos clientes criem uma conta no sistema.
- **Tela de Login**: Tela para autenticação dos usuários.
- **Dashboard do Cliente**: Página inicial após o login do cliente, mostrando os agendamentos futuros e opções para criar novos agendamentos, e editar agendamentos existentes.
- **Dashboard do Administrador**: Acesso restrito ao admin para gerenciar todos os agendamentos e visualizar relatórios.

<h3 id="tela-de-cadastro">Tela de Cadastro</h3>

Descreva detalhadamente a tela de cadastro, incluindo informações sobre os campos necessários para cadastro, validações realizadas no frontend e qualquer feedback visual fornecido ao usuário durante o processo de cadastro.

<h3 id="tela-de-login">Tela de Login</h3>

Detalhe a tela de login, explicando como os usuários podem entrar no sistema, quais campos são necessários, e como são tratados os erros de autenticação, como mensagens de erro para credenciais inválidas.

<h3 id="dashboard-do-cliente">Dashboard do Cliente</h3>

Explique as funcionalidades disponíveis no dashboard do cliente, como visualização de agendamentos futuros, opções para criar novos agendamentos ou editar agendamentos existentes, e qualquer outra funcionalidade específica desta visão.

<h3 id="dashboard-do-administrador">Dashboard do Administrador</h3>

Forneça detalhes sobre o dashboard do administrador, incluindo como ele pode gerenciar agendamentos, visualizar relatórios e acessar controles administrativos, como criação e gerenciamento de serviços, usuários e configurações do sistema.

### Outras Telas

Se houver outras telas que precisem de descrição, você pode continuar adicionando seções como as anteriores para cada uma delas, garantindo que todas as funcionalidades e fluxos de interação estejam bem documentados.


### Telas Adicionais

Descreva quaisquer outras telas importantes e suas funções específicas dentro do aplicativo.
