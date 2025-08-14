package com.facturas.facturas.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.facturas.facturas.model.Factura;
import com.facturas.facturas.services.FacturaService;

@Controller
@RequestMapping("/api")
public class FacturaController {
	
	private final FacturaService service;

	public FacturaController(FacturaService facturaService) {
		this.service = facturaService;
    }
	
	@PostMapping("/factura") 
	public String nuevaFactura(Model model, Factura fac) {
		model.addAttribute("title", "Nueva Factura"); 
		service.saveFactura(fac);
		return "redirect:/nuevaFactura";
	}
	
	@DeleteMapping("/factura/{id}")
	@ResponseBody
	public ResponseEntity<String> borrarFactura(@PathVariable String id) {
		System.out.println(id);
		service.deleteFactura(id);
		return ResponseEntity.ok("Factura eliminada");
	}
	
	@GetMapping("/factura")
	public String exportarFactura(Model model, Factura fac) {
		model.addAttribute("title", "Nueva Factura");
		service.saveFactura(fac);
		return "redirect:/nuevaFactura";
	}
}
