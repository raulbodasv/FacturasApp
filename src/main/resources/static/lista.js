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
    this.updateStats()
  }

  bindEvents() {
    document.getElementById("exportAllBtn").addEventListener("click", () => this.exportAllInvoices())
  }

  updateStats() {
    const countRows = document.getElementById("invoicesTableBody");
	const totalFacturas = countRows.children.length;
    
    //Total importe
    let totalImporte = 0.0
	document.querySelectorAll(".total").forEach(el => {
		const value = parseFloat(el.textContent.replace(/[^0-9.-]+/g, ""));
		  if (!isNaN(value)) {
		    totalImporte += value;
		  }
	});

	//Total IVA
	let totalIVA = 0.0
	document.querySelectorAll(".iva").forEach(el => {
	  const value = parseFloat(el.textContent.replace(/[^0-9.-]+/g, ""));
	  if (!isNaN(value)) {
	    totalIVA += value;
	  }
	});

    const promedioFactura = totalFacturas > 0 ? totalImporte / totalFacturas : 0
    
    document.getElementById("totalFacturas").textContent = totalFacturas
    document.getElementById("totalImporte").textContent = `€${totalImporte.toFixed(2)}`
    document.getElementById("totalIVA").textContent = `€${totalIVA.toFixed(2)}`
    document.getElementById("promedioFactura").textContent = `€${promedioFactura.toFixed(2)}`
  }

  exportAllInvoices() {
    this.showNotification("No está configurado aun la exportacion de facturas", "success")
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

document.addEventListener("click", function (e) {
  if (e.target.matches(".btn-delete")) {
    e.preventDefault();

    const id = e.target.getAttribute("data-id");

    fetch(`/api/factura/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al borrar el registro");
        }
        return response.ok;
      })
      .then(() => {
        console.log("Registro borrado");
        location.reload(); // refrescar
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }
});


// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", () => {
  window.invoiceManager = new InvoiceManager()
})
