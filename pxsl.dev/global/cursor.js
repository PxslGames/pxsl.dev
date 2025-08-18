document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.createElement("div");
  cursor.classList.add("cursor-circle");
  document.body.appendChild(cursor);

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });
});