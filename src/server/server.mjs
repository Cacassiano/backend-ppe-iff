import {createServer} from 'node:http';

const server = createServer((req, resp) => {
    resp.writeHead(302, {"Location":"https://nodejs.org/pt"});
    resp.end();
});

server.listen(3000,  "127.0.0.1", () => {
    console.log("Funcionou");
});