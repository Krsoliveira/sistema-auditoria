package br.com.siai.auditoria_backend.service;

import br.com.siai.auditoria_backend.repository.RelatorioLegadoRepository;
import org.docx4j.Docx4J;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

@Service
public class RelatorioService {

    private final RelatorioLegadoRepository repositorioLegado;

    public RelatorioService(RelatorioLegadoRepository repositorioLegado) {
        this.repositorioLegado = repositorioLegado;
    }

    // Repassa o ID da tela (croId) para o repositório verificar
    public Long verificarExistenciaAnexoLegado(Long croIdDaTela) {
        return repositorioLegado.buscarIdArquivoPorRelatorio(croIdDaTela);
    }

    public byte[] buscarEConverterRelatorioLegado(Long idArquivo) {
        String hexString = repositorioLegado.buscarHexadecimalDoRelatorio(idArquivo);
        if (hexString == null) throw new RuntimeException("Arquivo vazio no banco.");

        String cleanHex = hexString.replaceAll("^0[xX]", "").replaceAll("\\s+", "");

        if (cleanHex.toUpperCase().startsWith("25504446")) {
            return hexParaBytes(cleanHex); // Já é PDF
        } else if (cleanHex.toUpperCase().startsWith("504B0304")) {
            return converterDocxParaPdf(cleanHex); // É pacote Office (Word)
        }
        throw new RuntimeException("Tipo de arquivo não suportado.");
    }

    private byte[] hexParaBytes(String hex) {
        byte[] data = new byte[hex.length() / 2];
        for (int i = 0; i < hex.length(); i += 2) {
            data[i / 2] = (byte) ((Character.digit(hex.charAt(i), 16) << 4) + Character.digit(hex.charAt(i+1), 16));
        }
        return data;
    }

    private byte[] converterDocxParaPdf(String hexString) {
        try {
            byte[] bytes = hexParaBytes(hexString);
            ByteArrayInputStream bais = new ByteArrayInputStream(bytes);
            WordprocessingMLPackage wordMLPackage = WordprocessingMLPackage.load(bais);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Docx4J.toPDF(wordMLPackage, baos);
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao converter DOCX: " + e.getMessage());
        }
    }
}