
const shops = [
  "Bidii investments", "Mattumat", "Wamo agencies", "Greenvast order", "Target",
  "Mzuri", "Hallmark 136kg", "Northern Mart", "Harir", "Arabey", "Kensomart", "Garissa ndogO"
];
const skus = [
  "Bread 100", "Bread 200", "Bread 2000", "Bread 300", "Bread 500", "Bread 700",
  "Bread 800", "Bread 900", "Bread 1000", "Bread 6000", "Bread 7000", "Bread 9000", "Bread 50000"
];

document.addEventListener("DOMContentLoaded", () => {
  const shopList = document.getElementById("shopList");
  shops.forEach(shop => {
    const option = document.createElement("option");
    option.value = shop;
    shopList.appendChild(option);
  });

  const skuList = document.getElementById("skuList");
  skus.forEach(sku => {
    const option = document.createElement("option");
    option.value = sku;
    skuList.appendChild(option);
  });
});

let currentOrder = [];

function addOrder() {
  const sku = document.getElementById("skuInput").value.trim();
  const qty = parseInt(document.getElementById("qtyInput").value);
  if (!sku || isNaN(qty)) return alert("Please enter SKU and valid quantity.");
  currentOrder.push({ sku, qty });
  renderOrderTable();
}

function renderOrderTable() {
  const tbody = document.getElementById("orderTable").querySelector("tbody");
  tbody.innerHTML = "";
  currentOrder.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${item.sku}</td><td>${item.qty}</td>
                     <td><button onclick="removeItem(${index})">Remove</button></td>`;
    tbody.appendChild(row);
  });
}

function removeItem(index) {
  currentOrder.splice(index, 1);
  renderOrderTable();
}

function saveOrder() {
  const shop = document.getElementById("shopSelect").value.trim();
  if (!shop) return alert("Please select a shop.");
  if (currentOrder.length === 0) return alert("No order items to save.");
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();
  doc.text(`Shop: ${shop}`, 10, 10);
  doc.text(`Date: ${date}`, 10, 20);
  let y = 40;
  doc.text("SKU", 10, 30);
  doc.text("Quantity", 100, 30);
  currentOrder.forEach(item => {
    doc.text(item.sku, 10, y);
    doc.text(item.qty.toString(), 100, y);
    y += 10;
  });
  const filename = `${shop.replace(/\s+/g, "_")}_${date.replace(/\//g, "-")}.pdf`;
  doc.save(filename);
}

function clearOrder() {
  currentOrder = [];
  renderOrderTable();
}

function viewOrders() {
  document.getElementById("viewOrdersSection").style.display = "block";
}

function filterOrders() {
  const from = document.getElementById("fromDate").value;
  const to = document.getElementById("toDate").value;
  if (!from || !to) return alert("Please select both dates.");
  document.getElementById("ordersList").innerHTML = `<p>Feature coming soon: Filter orders between ${from} and ${to}</p>`;
}
