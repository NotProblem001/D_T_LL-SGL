package com.dtll.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class DocumentoAdjunto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombreArchivo;
    private String rutaLocal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "viaje_id")
    @JsonIgnore
    private Viaje viaje;

    public DocumentoAdjunto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNombreArchivo() { return nombreArchivo; }
    public void setNombreArchivo(String nombreArchivo) { this.nombreArchivo = nombreArchivo; }
    
    public String getRutaLocal() { return rutaLocal; }
    public void setRutaLocal(String rutaLocal) { this.rutaLocal = rutaLocal; }
    
    public Viaje getViaje() { return viaje; }
    public void setViaje(Viaje viaje) { this.viaje = viaje; }
}
