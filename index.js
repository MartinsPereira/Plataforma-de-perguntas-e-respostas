const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const perguntaModel = require('./database/Pergunta');
const respostaModel = require('./database/Resposta');

//Database
connection
  .authenticate()
  .then(() => {
    console.log('Conexão feita com sucesso!');
  })
  .catch((msgErro) => {
    console.log(msgErro);
  });

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  perguntaModel
    .findAll({ raw: true, order: [['id', 'DESC']] })
    .then((perguntas) => {
      res.render('index', { perguntas });
    });
});

app.get('/perguntar', (req, res) => {
  res.render('perguntar');
});

app.post('/salvarpergunta', (req, res) => {
  let titulo = req.body.titulo;
  let descricao = req.body.descricao;
  perguntaModel
    .create({
      titulo,
      descricao,
    })
    .then(() => {
      res.redirect('/');
    });
});

app.get('/pergunta/:id', (req, res) => {
  var id = req.params.id;
  perguntaModel.findOne({ raw: true, where: { id: id } }).then((pergunta) => {
    if (pergunta) {
      respostaModel
        .findAll({ raw: true, where: { perguntaId: pergunta.id } })
        .then((respostas) => {
          res.render('pergunta', { pergunta, respostas });
        });
    } else {
      res.redirect('/');
    }
    console.log(pergunta);
  });
});

app.post('/responder', (req, res) => {
  let resposta = req.body.resposta;
  let pergunta = req.body.pergunta;
  respostaModel
    .create({
      corpo: resposta,
      perguntaId: pergunta,
    })
    .then(() => {
      res.redirect('/pergunta/' + pergunta);
    });
});

app.listen(4000, (error) => {
  if (error) {
    console.log('Erro ao iniciar!');
  } else {
    console.log('Servidor Iniciado com sucesso');
  }
});
