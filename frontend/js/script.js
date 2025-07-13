document.addEventListener("DOMContentLoaded", () => { // ao terminar de carregar a pagina...
    const path = window.location.pathname

    if (path.includes('login.html')) { // se for a pagina de login...
        const form = document.getElementById("loginForm");
        form?.addEventListener("submit", async(e) => { // ? só faz se o elemento existir
            e.preventDefault(); // nao deixa atualizar o form
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries()); // esses montam os dados pro backend
            const response = await fetch("http://localhost:8080/aluno/login", {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({matricula, senha})
            })
            console.log("Enviei pro backend: ", matricula, " ", senha)
        })
    }
})