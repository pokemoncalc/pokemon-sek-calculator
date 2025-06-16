function calculate() {
  const amount = parseFloat(document.getElementById("sekAmount").value);
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  const cheapestPrice = Math.min(...products.map(p => p.price));

  if (isNaN(amount) || amount <= 0 || amount < cheapestPrice) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = "Du kan inte köpa något för det lilla, jobba lite övertid.";
    resultsDiv.appendChild(errorDiv);
    return;
  }

  let remaining = amount;
  const quantities = new Array(products.length).fill(0);

  let japanskCount = 0;
  let koreanskCount = 0;
  let kinesiskCount = 0;

  while (true) {
    let affordable = products
      .map((p, i) => ({ product: p, index: i }))
      .filter(({ product }) => product.price <= remaining);

    affordable = affordable.filter(({ product }) => {
      const name = product.name.toLowerCase();
      if (name.match(/\(japansk/i) && japanskCount >= 2) return false;
      if (name.match(/\(koreansk/i) && koreanskCount >= 2) return false;
      if (name.match(/\(kinesisk/i) && kinesiskCount >= 2) return false;
      return true;
    });

    if (affordable.length === 0) break;

    const choice = affordable[Math.floor(Math.random() * affordable.length)];

    quantities[choice.index]++;
    remaining -= choice.product.price;

    const chosenName = choice.product.name.toLowerCase();
    if (chosenName.match(/\(japansk/i)) japanskCount++;
    if (chosenName.match(/\(koreansk/i)) koreanskCount++;
    if (chosenName.match(/\(kinesisk/i)) kinesiskCount++;
  }

  products.forEach((product, i) => {
    if (quantities[i] > 0) {
      const quantity = quantities[i];
      const totalPrice = quantity * product.price;

      const productDiv = document.createElement("div");
      productDiv.className = "product";

      const link = document.createElement("a");
      link.href = product.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      const img = document.createElement("img");
      img.src = product.image;
      img.alt = product.name;

      link.appendChild(img);
      productDiv.appendChild(link);

      const infoDiv = document.createElement("div");
      infoDiv.className = "product-info";
      infoDiv.innerHTML = `
        ${quantity} × <a href="${product.url}" target="_blank" rel="noopener noreferrer">${product.name}</a><br/>
        Pris: ${quantity} × ${product.price.toLocaleString()} kr = ${totalPrice.toLocaleString()} kr
      `;

      productDiv.appendChild(infoDiv);
      resultsDiv.appendChild(productDiv);
    }
  });

  const leftoverDiv = document.createElement("div");
  leftoverDiv.className = "leftover";
  leftoverDiv.textContent = `Pengar kvar: ${remaining.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} kr.`;
  resultsDiv.appendChild(leftoverDiv);
}
