/* Somente para manipulação do meu DOM */
const { ipcRenderer } = require('electron');
/* vou usar meu timer como se fosse um modulo node */
const timer = require('./timer');
/* responsavel por popular a tela com que já foi feito */
const data = require('../../data');


let linkSobre = document.querySelector('#link-sobre');
let botaoPlay = document.querySelector('.botao-play');
let tempo = document.querySelector('.tempo');
let curso = document.querySelector('.curso');
let botaoAdicionar = document.querySelector('.botao-adicionar');
let campoAdicionar = document.querySelector('.campo-adicionar');

window.onload = () => {
	data.pegaDados(curso.textContent)
		.then((dados) => {
			console.log(dados);
			tempo.textContent = dados.tempo;
		})
}

linkSobre.addEventListener('click' , function(){
    ipcRenderer.send('abrir-janela-sobre');
});


let imgs = ['img/play-button.svg', 'img/stop-button.svg']
let play = false;
botaoPlay.addEventListener('click', function() {

	if(play == true){
		timer.parar(curso.textContent);
		play = false;
    new Notification('TrackTimer', {
      body: `O projeto ${curso.textContent} foi parado!!`,
      icon: 'img/stop-button.png'
    });
	}else{
		timer.iniciar(tempo);
		play = true;
    new Notification('TrackTimer', {
      body: `O projeto ${curso.textContent} foi iniciado!!`,
      icon: 'img/play-button.png'
    });
	}
/* Alterar minhas imagens play/stop */
	imgs = imgs.reverse();
	botaoPlay.src = imgs[0];
});


ipcRenderer.on('curso-trocado', (event, nomeCurso) => {

  timer.parar(curso.textContent);

	data.pegaDados(nomeCurso)
	.then((dados) => {
		tempo.textContent = dados.tempo;
	}).catch((err) => {
	  console.log('O projeto ainda não possuí um JSON');
    tempo.textContent = '00:00:00';
	})
	curso.textContent = nomeCurso;
});

botaoAdicionar.addEventListener('click', function() {

    if(campoAdicionar.valuer == ''){
      console.log("Não pode adicionar um projeto vazio!");
      return;
    }

    let novoCurso = campoAdicionar.value;
    curso.textContent = novoCurso;
    tempo.textContent = '00:00:00';
    campoAdicionar.value = '';
    ipcRenderer.send('curso-adicionado', novoCurso);

});

ipcRenderer.on('atalho-iniciar-parar', () => {
    //disparando o evento de click para alguem
    let click = new MouseEvent('click');
    botaoPlay.dispatchEvent(click);
    // Usando a webApi para notificações!
    // new Notification('Notificação!!!');
});
