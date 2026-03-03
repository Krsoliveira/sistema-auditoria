package br.com.siai.auditoria_backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(schema = "Auditoria", name = "RelatorioAtividade")
public class RelatorioAtividade {

    // 👇 A mágica do JPA está aqui: Avisamos que este é o ID da tabela
    @Id
    private int reaId;

    // Campos principais do banco legado
    private int relId, atvId, reaItem, reaDias, colId, carClassificacao, reaFlagNum, atgObrigatorio;
    private int reaUsuarioInclusaoId, reaUsuarioAlteracaoId, reaPendencia, penId, reaQuebra, reaQuebraPendencia;

    private String atvDescricaoPTA, reaDataInicial, reaDataFinal, reaHoraInicial, reaHoraFinal, reaHoras;
    private String carNome, reaFlag, reaClassificacao, reaUltimasAuditorias, reaObs;
    private String reaDataInclusao, reaDataAlteracao, reaHoraInclusao, reaHoraAlteracao;
    private String reaUsuarioInclusao, reaUsuarioAlteracao, reaTeste, reaExtensao, reaCriterio;
    private String reaPeriodoInicial, reaPeriodoFinal, reaPeriodoAbrangido, reaObservacao;
    private String reaNaoConformidade, reaReincidente, reaRecomendacao, reaDataSolucao, antObsSituacao;

    // Auxiliares (Join com outras tabelas)
    private String atvDescricao, atvPassoPasso, atvNota, atvClassificacao, colNome;
    private String relNumero, relData, relSugestao, relCabecalho1, relCabecalho2, relCabecalho3, relGestor;

    // --- GETTERS E SETTERS ---
    public int getReaId() { return reaId; }
    public void setReaId(int reaId) { this.reaId = reaId; }

    public int getRelId() { return relId; }
    public void setRelId(int relId) { this.relId = relId; }

    public int getAtvId() { return atvId; }
    public void setAtvId(int atvId) { this.atvId = atvId; }

    public String getAtvDescricaoPTA() { return atvDescricaoPTA; }
    public void setAtvDescricaoPTA(String atvDescricaoPTA) { this.atvDescricaoPTA = atvDescricaoPTA; }

    public String getReaTeste() { return reaTeste; }
    public void setReaTeste(String reaTeste) { this.reaTeste = reaTeste; }

    public String getReaExtensao() { return reaExtensao; }
    public void setReaExtensao(String reaExtensao) { this.reaExtensao = reaExtensao; }

    public String getReaCriterio() { return reaCriterio; }
    public void setReaCriterio(String reaCriterio) { this.reaCriterio = reaCriterio; }

    public String getReaObservacao() { return reaObservacao; }
    public void setReaObservacao(String reaObservacao) { this.reaObservacao = reaObservacao; }

    public String getReaDataInicial() { return reaDataInicial; }
    public void setReaDataInicial(String reaDataInicial) { this.reaDataInicial = reaDataInicial; }

    public String getReaDataFinal() { return reaDataFinal; }
    public void setReaDataFinal(String reaDataFinal) { this.reaDataFinal = reaDataFinal; }

    public String getReaNaoConformidade() { return reaNaoConformidade; }
    public void setReaNaoConformidade(String reaNaoConformidade) { this.reaNaoConformidade = reaNaoConformidade; }

    public String getReaReincidente() { return reaReincidente; }
    public void setReaReincidente(String reaReincidente) { this.reaReincidente = reaReincidente; }

    public String getReaRecomendacao() { return reaRecomendacao; }
    public void setReaRecomendacao(String reaRecomendacao) { this.reaRecomendacao = reaRecomendacao; }

    public String getReaDataSolucao() { return reaDataSolucao; }
    public void setReaDataSolucao(String reaDataSolucao) { this.reaDataSolucao = reaDataSolucao; }

    public String getAntObsSituacao() { return antObsSituacao; }
    public void setAntObsSituacao(String antObsSituacao) { this.antObsSituacao = antObsSituacao; }

    public String getReaUsuarioAlteracao() { return reaUsuarioAlteracao; }
    public void setReaUsuarioAlteracao(String reaUsuarioAlteracao) { this.reaUsuarioAlteracao = reaUsuarioAlteracao; }

    public int getReaItem() { return reaItem; }
    public void setReaItem(int reaItem) { this.reaItem = reaItem; }
    public String getReaHoraInicial() { return reaHoraInicial; }
    public void setReaHoraInicial(String reaHoraInicial) { this.reaHoraInicial = reaHoraInicial; }
    public String getReaHoraFinal() { return reaHoraFinal; }
    public void setReaHoraFinal(String reaHoraFinal) { this.reaHoraFinal = reaHoraFinal; }
    public int getReaDias() { return reaDias; }
    public void setReaDias(int reaDias) { this.reaDias = reaDias; }
    public String getReaHoras() { return reaHoras; }
    public void setReaHoras(String reaHoras) { this.reaHoras = reaHoras; }
    public int getColId() { return colId; }
    public void setColId(int colId) { this.colId = colId; }
    public String getCarNome() { return carNome; }
    public void setCarNome(String carNome) { this.carNome = carNome; }
    public int getCarClassificacao() { return carClassificacao; }
    public void setCarClassificacao(int carClassificacao) { this.carClassificacao = carClassificacao; }
    public String getReaFlag() { return reaFlag; }
    public void setReaFlag(String reaFlag) { this.reaFlag = reaFlag; }
    public int getReaFlagNum() { return reaFlagNum; }
    public void setReaFlagNum(int reaFlagNum) { this.reaFlagNum = reaFlagNum; }
    public int getAtgObrigatorio() { return atgObrigatorio; }
    public void setAtgObrigatorio(int atgObrigatorio) { this.atgObrigatorio = atgObrigatorio; }
    public String getReaClassificacao() { return reaClassificacao; }
    public void setReaClassificacao(String reaClassificacao) { this.reaClassificacao = reaClassificacao; }
    public String getReaUltimasAuditorias() { return reaUltimasAuditorias; }
    public void setReaUltimasAuditorias(String reaUltimasAuditorias) { this.reaUltimasAuditorias = reaUltimasAuditorias; }
    public String getReaObs() { return reaObs; }
    public void setReaObs(String reaObs) { this.reaObs = reaObs; }
    public String getReaDataInclusao() { return reaDataInclusao; }
    public void setReaDataInclusao(String reaDataInclusao) { this.reaDataInclusao = reaDataInclusao; }
    public String getReaDataAlteracao() { return reaDataAlteracao; }
    public void setReaDataAlteracao(String reaDataAlteracao) { this.reaDataAlteracao = reaDataAlteracao; }
    public String getReaHoraInclusao() { return reaHoraInclusao; }
    public void setReaHoraInclusao(String reaHoraInclusao) { this.reaHoraInclusao = reaHoraInclusao; }
    public String getReaHoraAlteracao() { return reaHoraAlteracao; }
    public void setReaHoraAlteracao(String reaHoraAlteracao) { this.reaHoraAlteracao = reaHoraAlteracao; }
    public String getReaUsuarioInclusao() { return reaUsuarioInclusao; }
    public void setReaUsuarioInclusao(String reaUsuarioInclusao) { this.reaUsuarioInclusao = reaUsuarioInclusao; }
    public int getReaUsuarioInclusaoId() { return reaUsuarioInclusaoId; }
    public void setReaUsuarioInclusaoId(int reaUsuarioInclusaoId) { this.reaUsuarioInclusaoId = reaUsuarioInclusaoId; }
    public int getReaUsuarioAlteracaoId() { return reaUsuarioAlteracaoId; }
    public void setReaUsuarioAlteracaoId(int reaUsuarioAlteracaoId) { this.reaUsuarioAlteracaoId = reaUsuarioAlteracaoId; }
    public String getReaPeriodoAbrangido() { return reaPeriodoAbrangido; }
    public void setReaPeriodoAbrangido(String reaPeriodoAbrangido) { this.reaPeriodoAbrangido = reaPeriodoAbrangido; }
    public int getReaPendencia() { return reaPendencia; }
    public void setReaPendencia(int reaPendencia) { this.reaPendencia = reaPendencia; }
    public int getPenId() { return penId; }
    public void setPenId(int penId) { this.penId = penId; }
    public int getReaQuebra() { return reaQuebra; }
    public void setReaQuebra(int reaQuebra) { this.reaQuebra = reaQuebra; }
    public int getReaQuebraPendencia() { return reaQuebraPendencia; }
    public void setReaQuebraPendencia(int reaQuebraPendencia) { this.reaQuebraPendencia = reaQuebraPendencia; }
    public String getAtvDescricao() { return atvDescricao; }
    public void setAtvDescricao(String atvDescricao) { this.atvDescricao = atvDescricao; }
    public String getAtvPassoPasso() { return atvPassoPasso; }
    public void setAtvPassoPasso(String atvPassoPasso) { this.atvPassoPasso = atvPassoPasso; }
    public String getAtvNota() { return atvNota; }
    public void setAtvNota(String atvNota) { this.atvNota = atvNota; }
    public String getAtvClassificacao() { return atvClassificacao; }
    public void setAtvClassificacao(String atvClassificacao) { this.atvClassificacao = atvClassificacao; }
    public String getColNome() { return colNome; }
    public void setColNome(String colNome) { this.colNome = colNome; }
    public String getRelNumero() { return relNumero; }
    public void setRelNumero(String relNumero) { this.relNumero = relNumero; }
    public String getRelData() { return relData; }
    public void setRelData(String relData) { this.relData = relData; }
    public String getRelSugestao() { return relSugestao; }
    public void setRelSugestao(String relSugestao) { this.relSugestao = relSugestao; }
    public String getRelCabecalho1() { return relCabecalho1; }
    public void setRelCabecalho1(String relCabecalho1) { this.relCabecalho1 = relCabecalho1; }
    public String getRelCabecalho2() { return relCabecalho2; }
    public void setRelCabecalho2(String relCabecalho2) { this.relCabecalho2 = relCabecalho2; }
    public String getRelCabecalho3() { return relCabecalho3; }
    public void setRelCabecalho3(String relCabecalho3) { this.relCabecalho3 = relCabecalho3; }
    public String getRelGestor() { return relGestor; }
    public void setRelGestor(String relGestor) { this.relGestor = relGestor; }
    public String getReaPeriodoInicial() { return reaPeriodoInicial; }
    public void setReaPeriodoInicial(String reaPeriodoInicial) { this.reaPeriodoInicial = reaPeriodoInicial; }
    public String getReaPeriodoFinal() { return reaPeriodoFinal; }
    public void setReaPeriodoFinal(String reaPeriodoFinal) { this.reaPeriodoFinal = reaPeriodoFinal; }
}