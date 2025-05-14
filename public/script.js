async function fetchTorD() {
    const type = document.getElementById('type').value;
    const lang = document.getElementById('lang').value;
    const resultDiv = document.getElementById('result');

    try {
        const response = await fetch(`/TorD?type=${type}&lang=${lang}`);
        const data = await response.json();

        if (data.error) {
            resultDiv.innerHTML = `Error: ${data.error}`;
        } else {
            resultDiv.innerHTML = `<strong>${data.type}:</strong> ${data.content}`;
        }
    } catch (error) {
        resultDiv.innerHTML = 'Error: Unable to fetch data.';
    }
}
