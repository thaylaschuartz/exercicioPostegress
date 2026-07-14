import { copyFileSync } from 'fs';
import pg from 'pg';
const {Client} = pg;

const client = new Client({
    host:     'localhost',  // onde o banco está rodando
    port:     5432,         // porta padrão do PostgreSQL
    user:     'postgres',   // usuário do banco
    password: 'root',       // a mesma senha que você usa no pgAdmin
    database: 'escola_db_bb' // o banco que criamos agora pouco
});

async function totalAlunos() {

    try {

        // Aqui fica tudo que queremos tentar fazer
        // Se qualquer linha aqui der erro, o catch captura

        await client.connect();
        const alunos = await client.query('SELECT COUNT(*) FROM alunos');
        const notas = await client.query('SELECT AVG(nota) FROM alunos');

        console.log(alunos.rows[0].count);

        const media =  notas.rows[0].avg
        console.log(`Média: ${media}`);
        const aprovados = await client.query(`SELECT nome, nota FROM alunos WHERE nota > ${media}`);


        aprovados.rows.forEach(e => {

        console.log( "Nota:", e.nota);
        console.log( "Nome:", e.nome);
       
            
        });
        console.log(`Alunos aprovados: ${aprovados.rows.length}`);



    } catch (erro) {

        // Se algo deu errado no try, cai aqui
        // O erro tem uma mensagem que nos diz o que aconteceu
        console.log('❌ Erro:', erro.message);

    } finally {

        // Isso SEMPRE executa — deu certo ou não
        // É aqui que fechamos a conexão com o banco
        await client.end();

    }
}
totalAlunos();