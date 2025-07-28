document.addEventListener("DOMContentLoaded", () => { // ao terminar de carregar a pagina...
    const path = window.location.pathname

    if (path.includes('login.html')) { // se for a pagina de login...
        const form = document.getElementById("loginForm");

        form.addEventListener("submit", async(e) => { // quando houver o submit no form
            e.preventDefault(); // nao deixa atualizar o form quando submit
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries()); // esses montam os dados pro backend
            const response = await fetch("http://localhost:8080/aluno/login", { // lugar que a api espera
                method: 'POST',
                headers: {"Content-Type": "application/json"}, // especifica que é json
                body: JSON.stringify(data) // transforma os dados do form em um objeto json
            });
        if (response.ok) {
            const responseData = await response.json();
            const token = responseData.token;

            localStorage.setItem("token", token);
            window.location = "index.html"
        } 
    });

    } else if (path.includes('registro.html')) { // se for a pagina de registro
        const avisos = document.getElementById("avisos");
        const form = document.getElementById("formRegistro");

        form.addEventListener("submit", async(e) => {
            e.preventDefault();
            const formData = new FormData(form);
            if (formData.get("senha") != formData.get("confirmar-senha")) {
                avisos.style.color = "red";
                avisos.innerText = "As senhas não coincidem.";
                return;
            }
            formData.delete("confirmar-senha");
            const data = Object.fromEntries(formData.entries());
            avisos.innerText = "";

            const response = await fetch("http://localhost:8080/aluno/register", {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            })

            avisos.style.color = "chartreuse";
            avisos.innerText = "Usuário criado com sucesso!";
        })
    }
})