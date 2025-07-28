document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
        window.location = "login.html";
        return;
    }
    
    console.log("token valido");
})