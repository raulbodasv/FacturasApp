# FacturasApp

### Levantar docker de Postgresql
docker run --name facturasPostgreSQL -e POSTGRES_PASSWORD=admin1001 -p 5432:5432 -d postgres

### Creacion de tabla facturas en bbdd
	
	CREATE TABLE public.facturas (
		id varchar(255) NOT NULL,
		numero int4 NULL,
		fecha date NULL,
		n_factura varchar(255) NULL,
		nif varchar(255) NULL,
		nombre varchar(255) NULL,
		concepto varchar(255) NULL,
		seg_social varchar(255) NULL,
		suministros varchar(255) NULL,
		gtos_financieros varchar(255) NULL,
		seguros varchar(255) NULL,
		gtos varchar(255) NULL,
		tributar varchar(255) NULL,
		tipos varchar(255) NULL,
		iva varchar(255) NULL,
		total varchar(255) NULL,
		base_imponible varchar(255) NULL,
		fecha_creacion timestamp NULL,
		CONSTRAINT facturas_pkey PRIMARY KEY (id)
	);



