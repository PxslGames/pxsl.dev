fetch('/version.json')
  .then(res => res.json())
  .then(data => {
    const footer = document.getElementById('site-footer');
    footer.textContent = `pxsl.dev - v${data.version} - made by pxsl`;
  })
  .catch(err => {
    console.error("Failed to load version.json:", err);
  });