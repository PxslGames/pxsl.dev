function goTo(url) {
    const t = document.getElementById("transition");
  
    t.classList.add("active");
  
    setTimeout(() => {
      window.location.href = url;
    }, 450);
  }