package com.dtll.backend.repository;

import com.dtll.backend.model.Viaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ViajeRepository extends JpaRepository<Viaje, Long> {
    List<Viaje> findByFechaBetween(LocalDate start, LocalDate end);
    List<Viaje> findByConductorContainingIgnoreCase(String conductor);
}
