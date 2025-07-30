document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token || !isAlunoTokenValid(token)) {
        window.location = "login.html";
        return;
    }
    
    console.log("token valido");
})

const isAlunoTokenValid = async (token) => {
    return true;
    // const response =  await fetch("http://localhost:8080/aluno/validate",{
    //     method: "GET",
    //     headers: {"Authorization":"Bearer "+token}
    // })
    // console.log(response.status);
    // if(response.ok) return true
    // return false;
}