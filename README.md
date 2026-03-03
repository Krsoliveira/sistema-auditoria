# 🛡️ Sistema de Auditoria SIAI

Bem-vindo ao repositório do **Sistema de Auditoria SIAI**. Este projeto tem como objetivo modernizar e revitalizar o sistema legado de auditoria da empresa, criando uma interface web rápida, fluida e responsiva, mantendo a rica inteligência de negócios já existente no banco de dados.

## 🚀 Tecnologias Utilizadas

**Frontend (A Vitrine):**
* [React](https://reactjs.org/) (inicializado com [Vite](https://vitejs.dev/))
* CSS3 Avançado (Conceito de *Glassmorphism*, UI escura, CSS Grid)
* React Router DOM (Navegação)

**Backend (O Motor):**
* [Java 17+](https://www.oracle.com/java/) 
* [Spring Boot 3](https://spring.io/projects/spring-boot)
* Spring Data JPA (Focado em `@Query` nativas para lidar com o banco legado)
* Spring Security (Configuração de acessos e liberação de CORS)

**Banco de Dados:**
* SQL Server (Sistema Legado)

---

## 🗺️ Mapa do Banco de Dados (O Segredo de Ouro)

O banco de dados possui uma maturidade alta e guarda regras de negócio profundas. **Atenção especial:** O sistema antigo possuía um editor de texto embutido, então **textos descritivos estão salvos no banco com tags HTML nativas** (`<p>`, `<b>`, `<br>`).

Aqui está o mapeamento da arquitetura principal (`[Auditoria].[Auditoria]`):

1. **`Relatorio` (A Capa):** Informações gerais do documento (Gestor, Abertura). Liga-se ao cronograma (`croId`). Chave Primária: `relId`.
2. **`RelatorioAtividade` (O Corpo):** O passo a passo, testes executados e o veredito. É aqui que os textos HTML residem. Chave Primária: `reaId`. Liga-se ao relatório pelo `relId`.
3. **`RelatorioAtividadeAnotacao` (O Fórum):** Guarda a conversa de revisão e aprovação entre Auditor e Gerente (Status de "Vai e Vem"). Liga-se à Atividade pelo `reaId`.
4. **`RelatorioAtividadeAnexo` (O Cofre):** Guarda os arquivos de evidência. **Nota:** PDFs e planilhas Excel estão salvos em formato Hexadecimal (bytes) diretamente na coluna `raaArquivo`.
5. **`Equipe/Executores` (`extId`):** Tabela que permite a alocação de múltiplos auditores para assinarem uma mesma atividade.
6. **`RelatorioAtividadeHistorico` (A Máquina do Tempo):** Tabela de Log (Change Data Capture) que tira "fotografias" e guarda o histórico de edições do passado.

---

## ⚙️ Como rodar o projeto localmente

Siga os passos abaixo para configurar o ambiente de desenvolvimento na sua máquina.

### Pré-requisitos
* Git
* Node.js (v18+)
* Java JDK (17 ou superior)
* IDEs recomendadas: IntelliJ IDEA (Java) e VS Code (React)

### 1. Clonando o repositório
```bash
git clone [https://github.com/Krsoliveira/sistema-auditoria.git](https://github.com/Krsoliveira/sistema-auditoria.git)
cd sistema-auditoria


2. Configurando e Rodando o Backend (Java)
Abra a pasta auditoria-backend na sua IDE Java (ex: IntelliJ).

Deixe o Maven baixar todas as dependências.

⚠️ IMPORTANTE: Crie ou edite o arquivo src/main/resources/application.properties com as credenciais do seu banco de dados local/homologação. (Não suba senhas reais para o Git!)

Execute o arquivo principal AuditoriaBackendApplication.java.

O servidor iniciará na porta http://localhost:8080.

3. Configurando e Rodando o Frontend (React)
Abra um terminal e navegue até a pasta do frontend:

Bash
cd frontend-siai
Instale as dependências do Node:

Bash
npm install
Inicie o servidor de desenvolvimento:

Bash
npm run dev

Acesse a aplicação no navegador em: http://localhost:5173

📂 Estrutura de Pastas Resumida
Frontend
/src/pages/Dashboard.jsx: Tela inicial com filtro de anos e lista de relatórios.

/src/pages/DetalhesAuditoria.jsx: Tela interna com a tabela de atividades. Inclui lógica de reordenação local e um Modal Gigante que usa dangerouslySetInnerHTML para renderizar os textos ricos do banco.

/src/Dashboard.css: O coração do design visual (Glassmorphism).

Backend
/model: Contém as Entidades JPA e as Interfaces DTO (AtividadeDTO, CabecalhoDTO) usadas para moldar os dados exatos do Frontend.

/repository: Contém as interfaces com consultas SQL Nativas (nativeQuery = true).

/controller: Expõe as rotas da API REST.

/config/SecurityConfig.java: Central de segurança e política de liberação de CORS.