package com.dtll.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Viaje {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fecha;
    private String conductor;
    private String cliente;
    private String origen;
    private String destino;
    private Double peajes;
    private Double otrosCostos;
    private Double total;

    @ManyToMany
    @JoinTable(
        name = "viaje_pasajero",
        joinColumns = @JoinColumn(name = "viaje_id"),
        inverseJoinColumns = @JoinColumn(name = "pasajero_id")
    )
    private List<Pasajero> pasajeros = new ArrayList<>();

    public Viaje() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
    
    public String getConductor() { return conductor; }
    public void setConductor(String conductor) { this.conductor = conductor; }
    
    public String getCliente() { return cliente; }
    public void setCliente(String cliente) { this.cliente = cliente; }
    
    public String getOrigen() { return origen; }
    public void setOrigen(String origen) { this.origen = origen; }
    
    public String getDestino() { return destino; }
    public void setDestino(String destino) { this.destino = destino; }
    
    public Double getPeajes() { return peajes; }
    public void setPeajes(Double peajes) { this.peajes = peajes; }
    
    public Double getOtrosCostos() { return otrosCostos; }
    public void setOtrosCostos(Double otrosCostos) { this.otrosCostos = otrosCostos; }
    
    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public List<Pasajero> getPasajeros() { return pasajeros; }
    public void setPasajeros(List<Pasajero> pasajeros) { this.pasajeros = pasajeros; }
}
