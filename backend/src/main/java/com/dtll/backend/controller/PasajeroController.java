package com.dtll.backend.controller;

import com.dtll.backend.model.Pasajero;
import com.dtll.backend.repository.PasajeroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pasajeros")
public class PasajeroController {

    @Autowired
    private PasajeroRepository pasajeroRepository;

    @PostMapping("/batch")
    public List<Pasajero> saveBatch(@RequestBody List<Pasajero> pasajeros) {
        return pasajeroRepository.saveAll(pasajeros);
    }

    @GetMapping
    public List<Pasajero> getAll() {
        return pasajeroRepository.findAll();
    }
}
