package com.dtll.backend.controller;

import com.dtll.backend.model.DocumentoAdjunto;
import com.dtll.backend.model.Viaje;
import com.dtll.backend.repository.DocumentoAdjuntoRepository;
import com.dtll.backend.service.ViajeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/viajes")
public class ViajeController {

    @Autowired
    private ViajeService viajeService;

    @Autowired
    private DocumentoAdjuntoRepository documentoRepository;

    @GetMapping
    public List<Viaje> getAllViajes() {
        return viajeService.findAll();
    }

    @PostMapping("/batch")
    public List<Viaje> saveViajesBatch(@RequestBody List<Viaje> viajes) {
        return viajeService.saveAll(viajes);
    }

    @PostMapping("/{id}/adjuntos")
    public ResponseEntity<DocumentoAdjunto> uploadAdjunto(@PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        try {
            DocumentoAdjunto doc = viajeService.adjuntarArchivo(id, file);
            return ResponseEntity.ok(doc);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}/adjuntos")
    public List<DocumentoAdjunto> getAdjuntos(@PathVariable Long id) {
        return viajeService.getAdjuntos(id);
    }

    @GetMapping("/adjuntos/{adjuntoId}/download")
    public ResponseEntity<Resource> downloadAdjunto(@PathVariable Long adjuntoId) {
        DocumentoAdjunto doc = documentoRepository.findById(adjuntoId)
                .orElseThrow(() -> new RuntimeException("Adjunto no encontrado"));

        try {
            Path file = Paths.get(doc.getRutaLocal());
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\"" + doc.getNombreArchivo() + "\"")
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .body(resource);
            } else {
                throw new RuntimeException("Could not read the file!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }
}
