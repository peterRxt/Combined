
let sequenceRows = [];

function normalize(text) {
  return (text || "").toString().trim().toLowerCase();
}

function parseEasternFile() {
  const file = document.getElementById("sequenceFile").files[0];
  if (!file) return alert("Please upload a file.");
  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });
    sequenceRows = [];
    rows.forEach(row => {
      const shop = row[1];
      const weight = parseFloat(row[4]);
      if (shop && !isNaN(weight)) {
        sequenceRows.push({ shop: shop.toString().trim(), weight });
      }
    });
    populateShopCheckboxes();
  };
  reader.readAsArrayBuffer(file);
}

function populateShopCheckboxes() {
  const shopSet = new Set();
  sequenceRows.forEach(row => shopSet.add(row.shop));
  const container = document.getElementById("shopListContainer");
  container.innerHTML = "";
  [...shopSet].sort().forEach(shop => {
    const div = document.createElement("div");
    div.innerHTML = `<label><input type="checkbox" value="${shop}" /> ${shop}</label>`;
    container.appendChild(div);
  });
  document.getElementById("shopSection").style.display = "block";
  document.getElementById("copyButton").style.display = "none";
  document.getElementById("resultText").textContent = "";
}

function viewSelectedShops() {
  const checkboxes = document.querySelectorAll("#shopListContainer input:checked");
  const selectedShops = Array.from(checkboxes).map(cb => normalize(cb.value));
  if (!selectedShops.length) return alert("Select at least one shop.");
  const shopWeights = {};
  sequenceRows.forEach(row => {
    const shop = normalize(row.shop);
    if (selectedShops.includes(shop)) {
      shopWeights[shop] = (shopWeights[shop] || 0) + row.weight;
    }
  });
  let output = "";
  let total = 0;
  Object.entries(shopWeights).forEach(([shop, weight]) => {
    output += `${shop.charAt(0).toUpperCase() + shop.slice(1)}: ${weight.toFixed(2)} kg\n`;
    total += weight;
  });
  output += `\nTotal Weight: ${total.toFixed(2)} kg`;
  document.getElementById("resultText").textContent = output;
  document.getElementById("copyButton").style.display = "inline-block";
}

function copyWeights() {
  navigator.clipboard.writeText(document.getElementById("resultText").textContent)
    .then(() => alert("Weights copied to clipboard!"))
    .catch(() => alert("Failed to copy."));
}

function clearEastern() {
  document.getElementById("sequenceFile").value = "";
  document.getElementById("shopListContainer").innerHTML = "";
  document.getElementById("resultText").innerHTML = "";
  document.getElementById("shopSection").style.display = "none";
  document.getElementById("copyButton").style.display = "none";
}
