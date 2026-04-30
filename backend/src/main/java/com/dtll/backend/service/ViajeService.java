package com.dtll.backend.service;

import com.dtll.backend.model.DocumentoAdjunto;
import com.dtll.backend.model.Viaje;
import com.dtll.backend.repository.DocumentoAdjuntoRepository;
import com.dtll.backend.repository.ViajeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class ViajeService {

    @Autowired
    private ViajeRepository viajeRepository;

    @Autowired
    private DocumentoAdjuntoRepository documentoRepository;

    private static final String UPLOAD_DIR = "C:/DTLL_Archivos/Facturas/";

    public List<Viaje> findAll() {
        return viajeRepository.findAll();
    }

    public Viaje save(Viaje viaje) {
        return viajeRepository.save(viaje);
    }

    public List<Viaje> saveAll(List<Viaje> viajes) {
        return viajeRepository.saveAll(viajes);
    }

    public DocumentoAdjunto adjuntarArchivo(Long viajeId, MultipartFile file) throws IOException {
        Viaje viaje = viajeRepository.findById(viajeId)
                .orElseThrow(() -> new RuntimeException("Viaje no encontrado"));

        File dir = new File(UPLOAD_DIR);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR + fileName);
        Files.write(filePath, file.getBytes());

        DocumentoAdjunto doc = new DocumentoAdjunto();
        doc.setNombreArchivo(file.getOriginalFilename());
        doc.setRutaLocal(filePath.toString());
        doc.setViaje(viaje);

        return documentoRepository.save(doc);
    }

    public List<DocumentoAdjunto> getAdjuntos(Long viajeId) {
        return documentoRepository.findByViajeId(viajeId);
    }
}
