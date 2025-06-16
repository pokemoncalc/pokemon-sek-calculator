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

    // Apply language limits
    affordable = affordable.filter(({ product }) => {
      const name = product.name.toLowerCase();
      if (name.includes("(japansk") && japanskCount >= 2) return false;
      if (name.includes("(koreansk") && koreanskCount >= 2) return false;
      if (name.includes("(kinesisk") && kinesiskCount >= 2) return false;
      return true;
    });

    if (affordable.length === 0) break;

    const choice = affordable[Math.floor(Math.random() * affordable.length)];
    const price = choice.product.price;

    // Try to add 1 to 3 of the chosen product randomly
    const maxQty = Math.min(Math.floor(remaining / price), 3);
    const qty = Math.floor(Math.random() * maxQty) + 1;

    quantities[choice.index] += qty;
    remaining -= price * qty;

    const name = choice.product.name.toLowerCase();
    if (name.includes("(japansk")) japanskCount += qty;
    if (name.includes("(koreansk")) koreanskCount += qty;
    if (name.includes("(kinesisk")) kinesiskCount += qty;
  }

  products.forEach((product, i) => {
    const qty = quantities[i];
    if (qty > 0) {
      const totalPrice = qty * product.price;

      const productDiv = document.createElement("div");
      productDiv.className = "product";
      productDiv.style.animationDelay = `${i * 100}ms`;

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
        ${qty} × <a href="${product.url}" target="_blank" rel="noopener noreferrer">${product.name}</a><br/>
        Pris: ${qty} × ${product.price.toLocaleString()} kr = ${totalPrice.toLocaleString()} kr
      `;

      productDiv.appendChild(infoDiv);
      resultsDiv.appendChild(productDiv);
    }
  });

  const leftoverDiv = document.createElement("div");
  leftoverDiv.className = "leftover";
  leftoverDiv.textContent = `Pengar kvar: ${remaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr.`;
  leftoverDiv.style.animationDelay = `${products.length * 100}ms`;
  resultsDiv.appendChild(leftoverDiv);

  // Scroll into view if not already
  const top = resultsDiv.getBoundingClientRect().top + window.scrollY;
  const buffer = 200;
  if (window.scrollY + buffer < top) {
    resultsDiv.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
