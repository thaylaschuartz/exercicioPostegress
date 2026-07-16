import pg from 'pg';
const { Client } = pg;
import prompt from 'prompt-sync';

const client = new Client({
    host:     'localhost',       // onde o banco está rodando
    port:     5432,              // porta padrão do PostgreSQL
    user:     'postgres',        // usuário do banco
    password: 'postgres',        // a mesma senha que você usa no pgAdmin
    database: 'escola_db_bb'     // o banco que criamos agora pouco
});

async function totalAlunos() {
    try {
        console.log("=====> LISTA JOGOS");
        const promptFn = prompt(); 
        const genero = promptFn('Digite um gênero: '); 

        // Conecta ao banco antes de fazer as consultas
        await client.connect();

        const alunos = await client.query('SELECT COUNT(*) FROM alunos');
        const notas = await client.query('SELECT AVG(nota) FROM alunos');

        // Protegendo contra SQL Injection usando parâmetros ($1)
        const jogos = await client.query('SELECT titulo, nota FROM jogos WHERE genero = $1 ORDER BY nota DESC', [genero]);

        if (jogos.rows.length === 0) {
            console.log("Nenhum jogo encontrado para o gênero informado.");
        } else {
            // Correção da sintaxe do fechamento do forEach aqui:
            jogos.rows.forEach(e => {
                console.log("Titulo:", e.titulo);
                console.log("Nota:", e.nota);
            });
        }

        console.log("==============");
        console.log(`Total de alunos: ${alunos.rows[0].count}`);

        // O retorno de AVG geralmente vem como string, convertemos para número
        const media = Number(notas.rows[0].avg);
        console.log("=====> MÉDIA");
        console.log(`Média: ${media.toFixed(2)}`);

        // Protegendo a query com parâmetro numérico ($1)
        const aprovados = await client.query('SELECT nome, nota FROM alunos WHERE nota > $1', [media]);

        console.log("=====> LISTA DE ALUNOS ACIMA DA MÉDIA");
        aprovados.rows.forEach(e => {
            console.log("Nome:", e.nome);
            console.log("Nota:", e.nota);
        });
        
        console.log(`Alunos aprovados: ${aprovados.rows.length}`);

    } catch (erro) {
        console.log('❌ Erro:', erro.message);
    } finally {
        // Garante que a conexão feche sempre
        await client.end();
    }
}

totalAlunos();