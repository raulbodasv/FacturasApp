package com.facturas.facturas.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.facturas.facturas.services.FacturaService;

@Controller
public class IndexController {
	
	private final FacturaService service;

	public IndexController(FacturaService facturaService) {
		this.service = facturaService;
    }
	
	@GetMapping("/")
	public String index(Model model) {
		model.addAttribute("title", "Facturación");
		return "index";
	}
	
	@GetMapping("/listarFactura")
	public String listarFacturas(Model model) {
		model.addAttribute("title", "Listado de Facturas");
		model.addAttribute("facturas", service.getAllFacturas());
		return "listarFacturas"; 
	}
	
	@GetMapping("/nuevaFactura")
	public String nuevaFactura(Model model) {
		model.addAttribute("title", "Nueva Factura");
		return "nuevaFactura";
	}
}
