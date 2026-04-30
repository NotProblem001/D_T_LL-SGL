package com.dtll.backend.repository;

import com.dtll.backend.model.DocumentoAdjunto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentoAdjuntoRepository extends JpaRepository<DocumentoAdjunto, Long> {
    List<DocumentoAdjunto> findByViajeId(Long viajeId);
}
