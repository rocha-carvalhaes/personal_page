export function enviarPontuacao(name, score) {

  fetch('https://personal-page-6udp.onrender.com/api/new-score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name,
      score: score
    })
  })
  .then(response => response.json())
//   .then(data => {
//     document.getElementById("confirmation").textContent = data.status || "Enviado!";
//     document.getElementById("nameInput").value = "";
//     document.getElementById("questionInput").value = "";
//   })
  .catch(error => {
    console.error("Erro ao enviar:", error);
    document.getElementById("confirmation").textContent = "Erro ao enviar a score.";
  });
}
