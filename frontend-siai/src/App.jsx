import { useState, useEffect } from 'react'

function App() {
  const [atividade, setAtividade] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Função para remover as tags HTML e mostrar texto limpo
  const limparHTML = (html) => {
    if (!html) return "";
    let doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || doc.body.innerText || "";
  };

  // Função para colocar as tags de volta antes de salvar no SQL
  const prepararParaSalvar = (texto) => {
    return `<html>\r\n  <head>\r\n    \r\n  </head>\r\n  <body>\r\n    <p style="margin-top: 0">\r\n      ${texto}\r\n    </p>\r\n  </body>\r\n</html>\r\n`;
  };

  useEffect(() => {
    fetch('http://localhost:8080/api/atividades/3082')
      .then(res => res.json())
      .then(data => {
        // Limpamos os campos HTML ao carregar
        const dadosLimpos = {
          ...data,
          reaTeste: limparHTML(data.reaTeste),
          reaExtensao: limparHTML(data.reaExtensao),
          reaCriterio: limparHTML(data.reaCriterio),
          reaObservacao: limparHTML(data.reaObservacao),
          reaNaoConformidade: limparHTML(data.reaNaoConformidade),
          reaReincidente: limparHTML(data.reaReincidente),
          reaRecomendacao: limparHTML(data.reaRecomendacao)
        };
        setAtividade(dadosLimpos);
        setCarregando(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAtividade(prev => ({ ...prev, [name]: value }));
  };

  const salvar = () => {
    // Antes de enviar ao Java, envelopamos os campos em HTML de novo
    const dadosParaEnviar = {
      ...atividade,
      reaTeste: prepararParaSalvar(atividade.reaTeste),
      reaExtensao: prepararParaSalvar(atividade.reaExtensao),
      reaCriterio: prepararParaSalvar(atividade.reaCriterio),
      reaObservacao: prepararParaSalvar(atividade.reaObservacao),
      reaNaoConformidade: prepararParaSalvar(atividade.reaNaoConformidade),
      reaReincidente: prepararParaSalvar(atividade.reaReincidente),
      reaRecomendacao: prepararParaSalvar(atividade.reaRecomendacao)
    };

    fetch('http://localhost:8080/api/atividades/salvar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosParaEnviar)
    })
    .then(res => res.json())
    .then(sucesso => {
      if(sucesso) alert("✅ Gravado no SQL Server com formato compatível!");
      else alert("❌ Erro ao salvar.");
    });
  };

  if (carregando) return <div style={{padding: '50px'}}>Limpando dados do banco...</div>;

  return (
    <div style={{ padding: '20px', backgroundColor: '#e9ecef', minHeight: '100vh', fontFamily: 'Segoe UI' }}>
      
      {/* BLOCO 1: CABEÇALHO */}
      <div style={cardStyle}>
        <h1 style={{ textAlign: 'center', color: '#2c3e50', fontSize: '22px', marginBottom: '20px' }}>RELATÓRIO DE AUDITORIA</h1>
        <div style={grid2Col}>
          <div>
            <label style={labelStyle}>RELATÓRIO (SETOR)</label>
            <input value={atividade.relSetor || 'CONTROLADORIA'} readOnly style={inputReadOnly} />
          </div>
          <div>
            <label style={labelStyle}>ABERTURA DO RELATÓRIO</label>
            <textarea name="relAbertura" value={atividade.relAbertura || ''} onChange={handleChange} style={textAreaStyle} placeholder="Texto de abertura..." />
          </div>
        </div>
      </div>

      {/* BLOCO 2: TEXTOS DAS ATIVIDADES */}
      <div style={cardStyle}>
        <h3 style={titleStyle}>TEXTOS DAS ATIVIDADES DO RELATÓRIO</h3>
        <div style={grid2Col}>
          <div><label style={labelStyle}>Nº RELATÓRIO</label><input value={atividade.relId} readOnly style={inputReadOnly} /></div>
          <div><label style={labelStyle}>ATIVIDADE</label><input value={atividade.atvDescricaoPTA} readOnly style={inputReadOnly} /></div>
        </div>
        
        <div style={{marginTop: '15px'}}>
          <label style={labelStyle}>TESTES REALIZADOS</label>
          <textarea name="reaTeste" value={atividade.reaTeste || ''} onChange={handleChange} style={textAreaStyle} />
        </div>

        <div style={grid3Col}>
          <div><label style={labelStyle}>EXTENSÃO DOS EXAMES</label><textarea name="reaExtensao" value={atividade.reaExtensao || ''} onChange={handleChange} style={textAreaStyle} /></div>
          <div><label style={labelStyle}>CRITÉRIO / AMOSTRAGEM</label><textarea name="reaCriterio" value={atividade.reaCriterio || ''} onChange={handleChange} style={textAreaStyle} /></div>
          <div>
            <label style={labelStyle}>PERÍODO / SITUAÇÃO EM</label>
            <input type="date" name="reaPeriodoInicial" value={atividade.reaPeriodoInicial || ''} onChange={handleChange} style={inputStyle} />
            <input type="date" name="reaPeriodoFinal" value={atividade.reaPeriodoFinal || ''} onChange={handleChange} style={{...inputStyle, marginTop: '5px'}} />
          </div>
        </div>

        <div style={{marginTop: '15px'}}>
          <label style={labelStyle}>OBSERVAÇÃO / RESUMO DA SITUAÇÃO</label>
          <textarea name="reaObservacao" value={atividade.reaObservacao || ''} onChange={handleChange} style={textAreaStyle} />
        </div>

        <div style={{marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center'}}>
          <button style={btnAction}>👤 Adicionar Executor</button>
          <span style={{fontSize: '14px', color: '#666'}}>Classificação: <strong>{atividade.reaClassificacao || 'Normal'}</strong></span>
          <button style={{...btnAction, backgroundColor: '#6c757d'}}>📝 Anotação Interna</button>
        </div>
      </div>

      {/* BLOCO 3: PENDÊNCIAS */}
      <div style={cardStyle}>
        <h3 style={titleStyle}>TEXTO DAS PENDÊNCIAS DO RELATÓRIO</h3>
        <div style={grid2Col}>
          <div><label style={labelStyle}>NÃO CONFORMIDADE / OPORTUNIDADE</label><textarea name="reaNaoConformidade" value={atividade.reaNaoConformidade || ''} onChange={handleChange} style={textAreaStyle} /></div>
          <div><label style={labelStyle}>REINCIDENTE?</label><textarea name="reaReincidente" value={atividade.reaReincidente || ''} onChange={handleChange} style={textAreaStyle} /></div>
        </div>
        <div style={grid2Col}>
          <div><label style={labelStyle}>RECOMENDAÇÃO</label><textarea name="reaRecomendacao" value={atividade.reaRecomendacao || ''} onChange={handleChange} style={textAreaStyle} /></div>
          <div><label style={labelStyle}>DATA PARA SOLUÇÃO</label><input type="date" name="reaDataSolucao" value={atividade.reaDataSolucao || ''} onChange={handleChange} style={inputStyle} /></div>
        </div>
      </div>

      {/* BLOCO 4: FECHAMENTO */}
      <div style={cardStyle}>
        <h3 style={titleStyle}>TEXTO FECHAMENTO DO RELATÓRIO</h3>
        <div style={grid2Col}>
          <div><label style={labelStyle}>DATA TÉRMINO</label><input type="date" name="reaDataFinal" value={atividade.reaDataFinal || ''} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={labelStyle}>GESTOR DA ÁREA AUDITADA</label><input name="relGestor" value={atividade.relGestor || ''} onChange={handleChange} style={inputStyle} /></div>
        </div>
        <div style={{marginTop: '15px'}}>
          <label style={labelStyle}>SUGESTÕES E ORIENTAÇÕES</label>
          <textarea name="relSugestao" value={atividade.relSugestao || ''} onChange={handleChange} style={textAreaStyle} />
        </div>
      </div>

      <div style={{textAlign: 'center', paddingBottom: '40px'}}>
         <button onClick={salvar} style={btnSave}>GRAVAR ALTERAÇÕES</button>
      </div>

    </div>
  );
}

// Estilos repetidos (omiti os objetos de estilo para brevidade, use os mesmos do código anterior)
const cardStyle = { backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxWidth: '1000px', margin: '0 auto 20px auto' };
const titleStyle = { color: '#2980b9', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px', fontSize: '16px' };
const labelStyle = { display: 'block', fontWeight: 'bold', fontSize: '12px', color: '#7f8c8d', marginBottom: '5px' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' };
const inputReadOnly = { ...inputStyle, backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', color: '#6c757d' };
const textAreaStyle = { width: '100%', height: '80px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', resize: 'vertical' };
const grid2Col = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };
const grid3Col = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '15px' };
const btnAction = { padding: '8px 15px', border: 'none', borderRadius: '5px', backgroundColor: '#3498db', color: 'white', cursor: 'pointer', fontWeight: 'bold' };
const btnSave = { padding: '15px 50px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '30px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(39, 174, 96, 0.4)' };

export default App;