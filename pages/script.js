window.addEventListener("load", () => {
    setInterval(() => {
      console.log(
        "%cHey! What are you doing here? - Pxsl",
        `
        background: #111114;
        color: #d6b3ff;
  
        padding: 18px 28px;
  
        border-radius: 12px;
        border: 1px solid #9d4edd;
  
        font-family: Inter, sans-serif;
        font-size: 34px;
        font-weight: 800;
  
        letter-spacing: 2px;
        `
      );
    }, 1000);
  });
  
function goTo(url) {
    const t = document.getElementById("transition");

    t.classList.add("active");

    setTimeout(() => {
    window.location.href = url;
    }, 450);
}

function togglePages() {
  const card = document.getElementById("masterCard");

  card.classList.toggle("open");
}