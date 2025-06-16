function calculate() {
  const amount = parseFloat(document.getElementById("sekAmount").value);
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  const errorDiv = document.getElementById("error-message");
  if (errorDiv) errorDiv.textContent = "";

  const cheapestPrice = Math.min(...products.map((p) => p.price));

  if (isNaN(amount) || amount <= 0 || amount < cheapestPrice) {
    const errorDivNew = document.createElement("div");
    errorDivNew.id = "error-message";
    errorDivNew.textContent = "Du kan inte köpa något för det lilla, jobba lite övertid.";
    resultsDiv.appendChild(errorDivNew);
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
      if (name.includes("(japansk") && japanskCount >= 2) return false;
      if (name.includes("(koreansk") && koreanskCount >= 2) return false;
      if (name.includes("(kinesisk") && kinesiskCount >= 2) return false;
      return true;
    });

    if (affordable.length === 0) break;

    const choice = affordable[Math.floor(Math.random() * affordable.length)];
    const price = choice.product.price;

    // Pick 1 to 3 randomly, limited by remaining budget
    const maxQty = Math.min(Math.floor(remaining / price), 3);
    const qty = Math.floor(Math.random() * maxQty) + 1;

    quantities[choice.index] += qty;
    remaining -= price * qty;

    const name = choice.product.name.toLowerCase();
    if (name.includes("(japansk")) japanskCount += qty;
    if (name.includes("(koreansk")) koreanskCount += qty;
    if (name.includes("(kinesisk")) kinesiskCount += qty;
  }

  // Insert a divider above results
  const divider = document.createElement("hr");
  resultsDiv.appendChild(divider);

  products.forEach((product, i) => {
    const qty = quantities[i];
    if (qty > 0) {
      const totalPrice = qty * product.price;

      const productDiv = document.createElement("div");
      productDiv.className = "product";
      productDiv.style.animationDelay = `0ms`; // no delay, instant animation

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
  leftoverDiv.style.animationDelay = `0ms`; // no delay
  resultsDiv.appendChild(leftoverDiv);

  // Scroll results into view if not visible
  const top = resultsDiv.getBoundingClientRect().top + window.scrollY;
  const buffer = 200;
  if (window.scrollY + buffer < top) {
    resultsDiv.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Scroll-to-top button logic
const scrollBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollBtn.classList.add("show");
  } else {
    scrollBtn.classList.remove("show");
  }
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
