async function analyze() {
  const input = document.getElementById("inputText").value;

  const res = await fetch("http://127.0.0.1:5000/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ input })
  });

  const data = await res.json();

  if (data.error) {
    document.getElementById("result").innerText = data.error;
    return;
  }

  document.getElementById("result").innerHTML = `
    <p><strong>Score:</strong> ${data.score}</p>
    <p><strong>Status:</strong> ${data.warning}</p>
    <p><strong>Fact-check:</strong></p>
    <a href="${data.fact_check_links[0]}" target="_blank">Snopes</a><br>
    <a href="${data.fact_check_links[1]}" target="_blank">FactCheck</a>
  `;
}