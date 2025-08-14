package com.facturas.facturas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.facturas.facturas.model.Factura;

public interface FacturaRepository extends JpaRepository<Factura, String> {
	
}
