class InvoiceManager {
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

    this.currentEditingId = null
    this.init()
  }

  init() {
    this.bindEvents()
    //this.loadInvoicesList()
    //this.updateStats()
  }

  bindEvents() {
    // Eventos de la lista
    document.getElementById("searchInput").addEventListener("input", (e) => this.filterInvoices(e.target.value))
    document.getElementById("exportAllBtn").addEventListener("click", () => this.exportAllInvoices())
  }


  updateCalculations() {
    const baseImponible =
      this.formData.segSocial +
      this.formData.suministros +
      this.formData.gtosFinancieros +
      this.formData.seguros +
      this.formData.gtos

    const ivaCalculado = (baseImponible * this.formData.tipos) / 100
    const totalCalculado = baseImponible + ivaCalculado

    this.formData.iva = Number.parseFloat(ivaCalculado.toFixed(2))
    this.formData.total = Number.parseFloat(totalCalculado.toFixed(2))

    document.getElementById("iva").value = this.formData.iva.toFixed(2)
    document.getElementById("total").value = this.formData.total.toFixed(2)

    document.getElementById("baseImponible").textContent = `€${baseImponible.toFixed(2)}`
    document.getElementById("tipoIVA").textContent = `${this.formData.tipos}%`
    document.getElementById("ivaValue").textContent = `€${this.formData.iva.toFixed(2)}`
    document.getElementById("totalValue").textContent = `€${this.formData.total.toFixed(2)}`
  }


  saveDraft() {
    localStorage.setItem("invoiceDraft", JSON.stringify(this.formData))
    this.showNotification("Borrador guardado correctamente", "success")
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
    Object.keys(this.formData).forEach((key) => {
      const element = document.getElementById(key)
      if (element) {
        element.value = this.formData[key]
      }
    })
  }

  submitForm() {
    if (!this.formData.fecha || !this.formData.nFactura || !this.formData.nombre) {
      this.showNotification("Por favor, complete los campos obligatorios: Fecha, N. Factura y Nombre", "error")
      return
    }

    const invoices = this.getInvoices()
    const baseImponible =
      this.formData.segSocial +
      this.formData.suministros +
      this.formData.gtosFinancieros +
      this.formData.seguros +
      this.formData.gtos

    const invoiceData = {
      ...this.formData,
      id: this.currentEditingId || Date.now().toString(),
      baseImponible: baseImponible,
      fechaCreacion: new Date().toISOString(),
    }

    if (this.currentEditingId) {
      // Editar factura existente
      const index = invoices.findIndex((inv) => inv.id === this.currentEditingId)
      if (index !== -1) {
        invoices[index] = invoiceData
        this.showNotification("Factura actualizada correctamente", "success")
      }
    } else {
      // Nueva factura
      invoices.push(invoiceData)
      this.showNotification("Factura registrada correctamente", "success")
    }

    localStorage.setItem("invoices", JSON.stringify(invoices))
    localStorage.removeItem("invoiceDraft")

    this.clearForm()
    this.showList()
  }

  getInvoices() {
    const invoices = localStorage.getItem("invoices")
    return invoices ? JSON.parse(invoices) : []
  }

  loadInvoicesList() {
    const invoices = this.getInvoices()
    const tbody = document.getElementById("invoicesTableBody")
    const emptyState = document.getElementById("emptyState")

    if (invoices.length === 0) {
      tbody.innerHTML = ""
      emptyState.classList.remove("hidden")
      return
    }

    emptyState.classList.add("hidden")
    tbody.innerHTML = invoices
      .map(
        (invoice) => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${invoice.numero || "-"}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${this.formatDate(invoice.fecha)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${invoice.nFactura}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${invoice.nombre}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${invoice.nif || "-"}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">€${invoice.baseImponible.toFixed(2)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-600">€${invoice.iva.toFixed(2)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">€${invoice.total.toFixed(2)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                    <button onclick="window.invoiceManager.viewInvoice('${invoice.id}')" 
                            class="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50">Ver</button>
                    <button onclick="window.invoiceManager.editInvoice('${invoice.id}')" 
                            class="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50">Editar</button>
                    <button onclick="window.invoiceManager.deleteInvoice('${invoice.id}')" 
                            class="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50">Eliminar</button>
                </div>
            </td>
        </tr>
    `,
      )
      .join("")
  }

  updateStats() {
    const invoices = this.getInvoices()
    const totalFacturas = invoices.length
    const totalImporte = invoices.reduce((sum, inv) => sum + inv.total, 0)
    const totalIVA = invoices.reduce((sum, inv) => sum + inv.iva, 0)
    const promedioFactura = totalFacturas > 0 ? totalImporte / totalFacturas : 0

    document.getElementById("totalFacturas").textContent = totalFacturas
    document.getElementById("totalImporte").textContent = `€${totalImporte.toFixed(2)}`
    document.getElementById("totalIVA").textContent = `€${totalIVA.toFixed(2)}`
    document.getElementById("promedioFactura").textContent = `€${promedioFactura.toFixed(2)}`
  }

  filterInvoices(searchTerm) {
    const invoices = this.getInvoices()
    const filteredInvoices = invoices.filter(
      (invoice) =>
        invoice.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.nFactura.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.nif.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const tbody = document.getElementById("invoicesTableBody")
    tbody.innerHTML = filteredInvoices
      .map(
        (invoice) => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${invoice.numero || "-"}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${this.formatDate(invoice.fecha)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${invoice.nFactura}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${invoice.nombre}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${invoice.nif || "-"}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">€${invoice.baseImponible.toFixed(2)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-600">€${invoice.iva.toFixed(2)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">€${invoice.total.toFixed(2)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                    <button onclick="window.invoiceManager.viewInvoice('${invoice.id}')" 
                            class="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50">Ver</button>
                    <button onclick="window.invoiceManager.editInvoice('${invoice.id}')" 
                            class="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50">Editar</button>
                    <button onclick="window.invoiceManager.deleteInvoice('${invoice.id}')" 
                            class="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50">Eliminar</button>
                </div>
            </td>
        </tr>
    `,
      )
      .join("")
  }

  viewInvoice(id) {
    const invoices = this.getInvoices()
    const invoice = invoices.find((inv) => inv.id === id)
    if (!invoice) return

    const modalContent = document.getElementById("modalContent")
    modalContent.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><strong>Número:</strong> ${invoice.numero || "-"}</div>
            <div><strong>Fecha:</strong> ${this.formatDate(invoice.fecha)}</div>
            <div><strong>N. Factura:</strong> ${invoice.nFactura}</div>
            <div><strong>NIF:</strong> ${invoice.nif || "-"}</div>
            <div class="md:col-span-2"><strong>Cliente:</strong> ${invoice.nombre}</div>
            <div class="md:col-span-2"><strong>Concepto:</strong> ${invoice.concepto || "-"}</div>
        </div>
        <div class="border-t pt-4 mt-4">
            <h4 class="font-semibold mb-2">Desglose de Gastos:</h4>
            <div class="grid grid-cols-2 gap-2 text-sm">
                <div>Seg. Social: €${invoice.segSocial.toFixed(2)}</div>
                <div>Suministros: €${invoice.suministros.toFixed(2)}</div>
                <div>Gtos. Financieros: €${invoice.gtosFinancieros.toFixed(2)}</div>
                <div>Seguros: €${invoice.seguros.toFixed(2)}</div>
                <div>Otros Gastos: €${invoice.gtos.toFixed(2)}</div>
            </div>
        </div>
        <div class="border-t pt-4 mt-4 bg-gray-50 p-4 rounded">
            <div class="grid grid-cols-2 gap-4">
                <div><strong>Base Imponible:</strong> €${invoice.baseImponible.toFixed(2)}</div>
                <div><strong>Tipo IVA:</strong> ${invoice.tipos}%</div>
                <div><strong>IVA:</strong> €${invoice.iva.toFixed(2)}</div>
                <div><strong class="text-green-600">Total:</strong> <strong class="text-green-600">€${invoice.total.toFixed(2)}</strong></div>
            </div>
        </div>
    `

    document.getElementById("detailModal").classList.remove("hidden")
  }


  closeModal() {
    document.getElementById("detailModal").classList.add("hidden")
  }

  exportAllInvoices() {
    const invoices = this.getInvoices()
    if (invoices.length === 0) {
      this.showNotification("No hay facturas para exportar", "error")
      return
    }

    const dataStr = JSON.stringify(invoices, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `facturas_${new Date().toISOString().split("T")[0]}.json`
    link.click()

    this.showNotification("Facturas exportadas correctamente", "success")
  }

  formatDate(dateString) {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES")
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div")
    const bgColor = type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500"

    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm`
    notification.textContent = message

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.remove()
    }, 3000)
  }
}

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", () => {
  window.invoiceManager = new InvoiceManager()
  window.invoiceManager.loadDraft()
})
