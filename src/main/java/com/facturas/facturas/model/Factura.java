package com.facturas.facturas.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

@Getter
@Setter
@Entity
@ToString
@Table(name = "facturas")
public class Factura {

	@Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "factura_seq")
    @SequenceGenerator(name = "factura_seq", sequenceName = "factura_seq", allocationSize = 1)
    private Long id;

    private Integer numero;

    private LocalDate fecha; 

    @Column(name = "n_factura")
    private String nFactura;

    private String nif;

    private String nombre;

    private String concepto;

    private String segSocial;

    private String suministros;

    @Column(name = "gtos_financieros")
    private String gtosFinancieros;

    private String seguros;

    private String gtos;

    private String tributar;

    private String tipos;

    private String iva;

    private String total;

    @Column(name = "base_imponible")
    private Double baseImponible;

    //Cuando se inserte, agrega la fecha de creacion
    @CreationTimestamp
    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

}

