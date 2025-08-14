class InvoiceCalculator {
  constructor() {
    this.formData = {
      numero: "",
      fecha: "",
      nFactura: "",
      nif: "",
      nombre: "",
      concepto: "",
      segSocial: 0,
      suministros: 0,
      gtosFinancieros: 0,
      seguros: 0,
      gtos: 0,
      tributar: "",
      tipos: 0,
      iva: 0,
      total: 0,
    }

    this.init()
  }

  init() {
    this.bindEvents()
    this.updateCalculations()
  }

  bindEvents() {
    // Eventos para campos numéricos que afectan los cálculos
    const numericFields = ["segSocial", "suministros", "gtosFinancieros", "seguros", "gtos"]
    numericFields.forEach((field) => {
      const element = document.getElementById(field)
      element.addEventListener("input", (e) => {
        this.formData[field] = Number.parseFloat(e.target.value) || 0
        this.updateCalculations()
      })
    })

    // Evento para el selector de tipo de IVA
    document.getElementById("tipos").addEventListener("change", (e) => {
      this.formData.tipos = Number.parseFloat(e.target.value) || 0
      this.updateCalculations()
    })

    // Eventos para otros campos del formulario
    const textFields = ["numero", "fecha", "nFactura", "nif", "nombre", "concepto", "tributar"]
    textFields.forEach((field) => {
      const element = document.getElementById(field)
      element.addEventListener("input", (e) => {
        this.formData[field] = e.target.value
      })
    })

    // Evento para limpiar formulario
    document.getElementById("clearBtn").addEventListener("click", () => {
      this.clearForm()
    })

    // Evento para guardar borrador
    document.getElementById("draftBtn").addEventListener("click", () => {
      this.saveDraft()
    })

    // Evento para enviar formulario
    document.getElementById("invoiceForm").addEventListener("submit", (e) => {
      //e.preventDefault()
      this.submitForm()
    })
  }

  updateCalculations() {
    // Calcular base imponible
    const baseImponible =
      this.formData.segSocial +
      this.formData.suministros +
      this.formData.gtosFinancieros +
      this.formData.seguros +
      this.formData.gtos

    // Calcular IVA
    const ivaCalculado = (baseImponible * this.formData.tipos) / 100

    // Calcular total
    const totalCalculado = baseImponible + ivaCalculado

    // Actualizar valores en el objeto
    this.formData.iva = Number.parseFloat(ivaCalculado.toFixed(2))
    this.formData.total = Number.parseFloat(totalCalculado.toFixed(2))

    // Actualizar campos en el DOM
    document.getElementById("iva").value = this.formData.iva.toFixed(2)
    document.getElementById("total").value = this.formData.total.toFixed(2)

    // Actualizar resumen
    document.getElementById("baseImponible").textContent = `€${baseImponible.toFixed(2)}`
    document.getElementById("tipoIVA").textContent = `${this.formData.tipos}%`
    document.getElementById("ivaValue").textContent = `€${this.formData.iva.toFixed(2)}`
    document.getElementById("totalValue").textContent = `€${this.formData.total.toFixed(2)}`
  }

  clearForm() {
    // Resetear objeto de datos
    this.formData = {
      numero: "",
      fecha: "",
      nFactura: "",
      nif: "",
      nombre: "",
      concepto: "",
      segSocial: 0,
      suministros: 0,
      gtosFinancieros: 0,
      seguros: 0,
      gtos: 0,
      tributar: "",
      tipos: 0,
      iva: 0,
      total: 0,
    }

    // Limpiar todos los campos del formulario
    document.getElementById("invoiceForm").reset()

    // Resetear valores numéricos a 0
    const numericFields = ["segSocial", "suministros", "gtosFinancieros", "seguros", "gtos"]
    numericFields.forEach((field) => {
      document.getElementById(field).value = "0"
    })

    // Resetear selector de tipos a 0
    document.getElementById("tipos").value = "0"

    // Actualizar cálculos
    this.updateCalculations()

    alert("Formulario limpiado correctamente")
  }

  saveDraft() {
    // Guardar en localStorage
    localStorage.setItem("invoiceDraft", JSON.stringify(this.formData))
    alert("Borrador guardado correctamente")
  }

  loadDraft() {
    const draft = localStorage.getItem("invoiceDraft")
    if (draft) {
      this.formData = JSON.parse(draft)
      this.populateForm()
      this.updateCalculations()
    }
  }

  populateForm() {
    // Llenar campos del formulario con datos guardados
    Object.keys(this.formData).forEach((key) => {
      const element = document.getElementById(key)
      if (element) {
        element.value = this.formData[key]
      }
    })
  }

  submitForm() {
    // Validar campos obligatorios
    if (!this.formData.fecha || !this.formData.nFactura || !this.formData.nombre) {
      alert("Por favor, complete los campos obligatorios: Fecha, N. Factura y Nombre")
      return
    }

    // Simular envío del formulario
    console.log("Datos del formulario:", this.formData)
    alert(
      `Factura registrada correctamente!\n\nResumen:\nBase Imponible: €${(this.formData.segSocial + this.formData.suministros + this.formData.gtosFinancieros + this.formData.seguros + this.formData.gtos).toFixed(2)}\nIVA (${this.formData.tipos}%): €${this.formData.iva.toFixed(2)}\nTotal: €${this.formData.total.toFixed(2)}`,
    )

    // Limpiar borrador guardado
    localStorage.removeItem("invoiceDraft")
  }

  // Método para exportar datos (opcional)
  exportData() {
    const dataStr = JSON.stringify(this.formData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `factura_${this.formData.nFactura || "sin_numero"}.json`
    link.click()
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  const calculator = new InvoiceCalculator()

  // Cargar borrador si existe
  calculator.loadDraft()

  // Hacer la instancia global para debugging (opcional)
  window.invoiceCalculator = calculator
})
