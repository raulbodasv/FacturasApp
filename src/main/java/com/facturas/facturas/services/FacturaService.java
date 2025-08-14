package com.facturas.facturas.services;

import java.util.List;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;

import com.facturas.facturas.repository.FacturaRepository;
import com.facturas.facturas.model.Factura;

@Service
public class FacturaService {
	
	private final FacturaRepository facturaRepository;

    public FacturaService(FacturaRepository facturaRepository) {
        this.facturaRepository = facturaRepository;
    }
	
    public List<Factura> getAllFacturas() {
        return facturaRepository.findAll();
    }
    
    public String saveFactura(Factura f) {
    	double baseImponible = Stream.of(
    	        f.getSegSocial(),
    	        f.getSuministros(),
    	        f.getGtosFinancieros(),
    	        f.getGtos(),
    	        f.getSeguros()
    	    )
    	    .mapToDouble(Double::parseDouble)
    	    .sum();

    	f.setBaseImponible(baseImponible);	
    	
    	facturaRepository.save(f);
    	String message = "Factura guardada correctamente";
    	System.out.println(message);
        return message;
    }
    
    public String deleteFactura(String id) {  	
    	System.out.println(id);
    	facturaRepository.deleteById(id);
    	String message = "Factura borrada correctamente";
    	System.out.println(message);
        return message;
    }
}
