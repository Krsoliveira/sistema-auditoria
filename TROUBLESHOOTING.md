# 🚑 Manual de Sobrevivência e Resolução de Problemas (Troubleshooting)

Este documento mapeia os erros mais comuns encontrados na arquitetura do Sistema de Auditoria (React + Spring Boot + SQL Server) e fornece a "cirurgia" exata para os resolver rapidamente.

---

## 1. Erros de Comunicação (Frontend ↔ Backend)

### 🔴 Erro no F12 (Consola do Navegador): `Blocked by CORS policy`
* **Sintoma:** A interface React carrega a estrutura, mas os dados não aparecem. O navegador bloqueia o pedido por razões de segurança.
* **Causa:** O Spring Security ou a configuração do controlador não estão a permitir o acesso vindo da porta do React (ex: `localhost:5173`).
* **Solução:** 1. Verificar se a classe `SecurityConfig.java` tem o `.permitAll()` ativado para a rota ou `.anyRequest().permitAll()` no ambiente de desenvolvimento.
  2. Confirmar se o respetivo *Controller* (ex: `RelatorioController`) possui a anotação `@CrossOrigin(origins = "*")`.

### 🔴 Erro no F12 (Consola do Navegador): `TypeError: Failed to fetch`
* **Sintoma:** A aplicação React falha silenciosamente ao tentar buscar dados ou apresenta estado de carregamento infinito.
* **Causa:** O servidor backend (Java) não está a correr ou está a reiniciar.
* **Solução:** Iniciar a aplicação Spring Boot no IntelliJ/IDE e aguardar pela mensagem `Tomcat started on port 8080` no terminal.

---

## 2. Erros de Base de Dados (Hibernate e SQL Server)

### 🔴 Erro no Terminal Java: `NonUniqueResultException: Query did not return a unique result`
* **Sintoma:** O backend devolve um erro 500 ao tentar abrir os detalhes de uma auditoria específica.
* **Causa:** A query nativa, ao usar `JOINs` (como as tabelas de unidades e grupos no banco legado), multiplicou os resultados. O Java esperava apenas 1 registo (Capa/Cabeçalho) e encontrou vários.
* **Solução:** Adicionar o comando `TOP 1` logo após o `SELECT` na sua query nativa no *Repository* (ex: `SELECT TOP 1 r.relCabecalho...`).

### 🔴 Dados Misturados no Frontend ou Erro de Instanciação do DTO
* **Sintoma:** O campo "Gestor" mostra o valor de "Situação", o "Grupo" aparece com texto truncado, ou o terminal Java avisa `Cannot instantiate query result type... exactly X parameters`.
* **Causa:** O Hibernate, ao mapear uma Query Nativa para uma *Interface Projeção (DTO)*, tende a ordenar as propriedades de forma alfabética e empurrar os dados do `SELECT` na mesma ordem.
* **Solução:** Garantir que as colunas no `SELECT` da query no *Repository* e os `getters` declarados na *Interface DTO* estão em **ordem estritamente alfabética**.

---

## 3. Erros de Ecrã e Renderização (React)

### 🔴 O ecrã pisca e fica totalmente em branco (White Screen of Death)
* **Sintoma:** A aplicação *crasha* instantaneamente ao abrir um modal ou aceder a uma nova rota.
* **Causa:** Erro fatal de JavaScript, geralmente ao tentar ler uma propriedade de um objeto nulo ou indefinido (ex: ler `cabecalho.grupo.nome` quando `grupo` ainda não foi carregado).
* **Solução:** Utilizar *Optional Chaining* (`?.`) no JSX: escrever `cabecalho?.grupo?.nome`.

### 🔴 Tabela preenchida com traços (`---`) ou dados ausentes
* **Sintoma:** O Dashboard ou a Tabela de Atividades carrega, mas as datas ou outros campos aparecem vazios/com traços, mesmo estando corretos no banco de dados.
* **Causa:** A query no *Repository* Java não está a devolver os campos (ou os *alias* `AS` não correspondem exatamente ao que o React espera no JSON).
* **Solução:** Confirmar que todos os campos esperados no *Frontend* constam no `SELECT` do *Backend* e na *Interface DTO*.

---

## 4. Erros de Controlo de Versões (Git)

### 🔴 O Fantasma do Código Esmagado
* **Sintoma:** Após um `git pull`, funcionalidades que já estavam prontas desapareceram misteriosamente.
* **Causa:** Atualização remota sobrescreveu o trabalho local porque as alterações da máquina não foram consolidadas (*commited*) antes de puxar as novidades da nuvem.
* **Solução (A Regra de Ouro do Git):** Executar sempre o "Fluxo Seguro" antes de sincronizar:
  1. `git add .` (Colocar alterações na área de preparação)
  2. `git commit -m "feat: salva trabalho local seguro"` (Gravar a "fotografia" na máquina)
  3. `git pull origin main` (Sincronizar de forma segura)
  4. `git push origin main` (Subir as alterações finais)