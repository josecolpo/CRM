console.log('carregou 2');

var _atividades = [{}];
var _posNegocios = {};
var _negocios = [{}];
var _posNegociosModificados = false;
var _novasPosNegocios = {};
var _clientes = [{}];

class TabelaNegocio{
    static addLinhas(negocios, opcao){
        var tabela = TabelaNegocio.getTabela();

        for(var i=0; i<negocios.length; i++){
            if(negocios[i].excluido != true){
                var formatar = new FormatarTexto().negocio(negocios[i]);
                var linha = this.getModelo(negocios[i].id, formatar.nome, formatar.etapa, formatar.fechamento, formatar.cliente, formatar.valor);
    
                if(opcao.origemCarregado == false){
                    var classeOrigemCarregado = 'tabela-linha-carregada';
    
                    linha = linha.replace(classeOrigemCarregado, '');
                }
    
                if(opcao.topo == true){
                    tabela.innerHTML = linha + tabela.innerHTML;
                }else{
                    tabela.innerHTML += linha;
                }
            }
        }
    }

    static carregarLinhas(){
        var qtdExibidos = document.getElementsByClassName('tabela-linha-carregada').length;
        var limite = 15;

        if(qtdExibidos >= _negocios.length){
            return;
        }

        TabelaNegocio.addLinhas(_negocios.slice(qtdExibidos, (qtdExibidos + limite)), {topo: false, origemCarregado: true});
    }

    static getModelo(id, nome, etapa, fechamento, cliente, valor){
        return `<p data-tabela_linha_id="${id}" onclick="new ModalNegocio(${id}, 'tabela');" class="linha tabela-linha-carregada"> <span class="celula-nome">${nome}</span> <span class="celula-etapa">${etapa}</span> <span class="${FormatarTexto.getCorFechamento(fechamento)} celula-fechamento">${fechamento}</span> <span class="celula-cliente">${cliente}</span> <span class="celula-valor">R$ ${valor}</span> </p>`;
    }

    static getTabela(){
        return document.getElementById('tabela_negocios');
    }

    static carregamento(){
        var elemento = document.getElementById('carregamento_tabela_negocios');

        if(elemento.dataset.ativo == 'true'){
            elemento.dataset.ativo = false;
        }else{
            elemento.dataset.ativo = true;
        }
    }

    static editarLinha(negocio){
        var elemento = document.querySelectorAll(`[data-tabela_linha_id="${negocio.id}"]`);

        if(elemento.length <= 0){
            return;
        }

        if(elemento[0].dataset.negocio_excluido == 'true'){
            return;
        }

        var classeOrigemCarregado = 'tabela-linha-carregada';
        var formatado = new FormatarTexto().negocio(negocio);
        var modelo = TabelaNegocio.getModelo(negocio.id, formatado.nome, formatado.etapa, formatado.fechamento, formatado.cliente, formatado.valor);

        if(elemento[0].classList.toString().indexOf(classeOrigemCarregado) == -1){
            modelo = modelo.replace(classeOrigemCarregado, '');
        }

        elemento[0].outerHTML = modelo;
    }

    static excluirLinha(id){
        var elemento = document.querySelector(`[data-tabela_linha_id="${id}"]`);

        if(elemento == null){
            return;
        }

        elemento.dataset.negocio_excluido = true;
    }

    static resetar(){
        TabelaNegocio.getTabela().innerHTML = '';
        TabelaNegocio.carregarLinhas();
    }
}

class QuadroNegocio{
    static addCartoes(negocio, insercaoTopo, origemCarregamento){
        var colunas = QuadroNegocio.getColunas();

        for(var i=0; i<negocio.length; i++){
            if(negocio[i].excluido != true){
                var formatado = new FormatarTexto().negocio(negocio[i]);
                var elementoCartao = QuadroNegocio.getModeloCartao(negocio[i].etapa, negocio[i].id, formatado.fechamento, formatado.nome, formatado.cliente, formatado.valor);
    
                if(origemCarregamento == false){
                    elementoCartao = elementoCartao.replace('cartao_carregado', '');
                }
    
                if(insercaoTopo == true){
                    colunas[`${negocio[i].etapa}`].innerHTML = elementoCartao + colunas[`${negocio[i].etapa}`].innerHTML;
                }else{
                    colunas[`${negocio[i].etapa}`].innerHTML = colunas[`${negocio[i].etapa}`].innerHTML + elementoCartao;
                }
            }
        }
    }

    static carregarCartoes(opcoes){
        var box = QuadroNegocio.getColunas()[`${opcoes.etapa}`];
        var qtdExibidos = document.querySelectorAll(`[data-cartao_carregado="${opcoes.etapa}"]`).length;
        var qtdCarregados = 0;
        var limite = 10;
        var negocios = new Array();

        if(qtdExibidos >= _posNegocios[`${opcoes.etapa}`].length){
            return;
        }

        if(_negocios.length < _posNegocios[`${opcoes.etapa}`].length){
            new ModalErro();
            return;
        }

        for(var i=qtdExibidos; i<_posNegocios[`${opcoes.etapa}`].length; i++){
            if(qtdCarregados >= limite){
                    break;
            }

            for(var j=0; j<_negocios.length; j++){
                if(_posNegocios[`${opcoes.etapa}`][i] == _negocios[j].id){
                    negocios.push(_negocios[j]);
                    qtdCarregados += 1;
                    break;
                }
            }
        }

        QuadroNegocio.addCartoes(negocios, false, true);
    }

    static modoCarregando(opcoes){
        var coluna = document.querySelectorAll(`.coluna-quadro-negocio[data-coluna_nome="${opcoes.etapa}"]`)[0];
        var elemento = document.querySelectorAll(`.carregamento-coluna-quadro[data-coluna_nome="${opcoes.etapa}"]`)[0];

        if(coluna.children.length < 7){
            elemento.style.opacity = '0';
        }else{
            elemento.style.opacity = '1';
        }

        if(elemento.dataset.ativo == 'true'){
            elemento.dataset.ativo = 'false';
        }else{
            elemento.dataset.ativo = 'true';
        }
    }

    static getModeloCartao(etapa, id, fechamento, nome, cliente, valor){
        return `<p data-cartao_carregado="${etapa}" onclick="new ModalNegocio(${id}, 'cartao');" ondragend="this.classList.remove('dragging');" ondragstart="this.classList.add('dragging');" data-quadro_negocio_id="${id}" class="draggable" draggable="true"> <span class="${FormatarTexto.getCorFechamento(fechamento)}">${fechamento}</span>${nome}<span>${cliente}</span> <span>R$ ${valor}</span> </p>`;
    }

    static getEtapaCartao(id){
        return document.querySelectorAll(`[data-quadro_negocio_id="${id}"]`)[0].parentNode.dataset.coluna_nome;
    }

    static getValorColunas(){
        var elementos = document.getElementsByClassName('coluna-quadro-negocio');
        var valores = {};

        for(var i=0; i<elementos.length; i++){
            valores[`${elementos[i].dataset.coluna_nome}`] = elementos[i].dataset.valor_conclusao;
        }

        return valores;
    }

    static getColunas(){
        var elementos = document.getElementsByClassName('coluna-quadro-negocio');
        var colunas = {};

        for(var i=0; i<elementos.length; i++){
            colunas[`${elementos[i].dataset.coluna_nome}`] = document.getElementById(elementos[i].id);
        }

        return colunas;
    }

    static editarCartao(negocioEditado){
        var elemento = document.querySelectorAll(`[data-quadro_negocio_id="${negocioEditado.id}"]`);

        if(elemento.length <= 0){
            return;
        }

        if(elemento[0].dataset.negocio_excluido == 'true'){
            return;
        }

        if(elemento[0].parentNode.dataset.coluna_nome != negocioEditado.etapa){
            elemento[0].dataset.negocio_excluido = true;
            elemento[0].dataset.quadro_negocio_id = '';

            QuadroNegocio.addCartoes([negocioEditado], true, false);
        }else{
            var formatado = new FormatarTexto().negocio(negocioEditado);

            elemento[0].outerHTML = QuadroNegocio.getModeloCartao(negocioEditado.etapa, negocioEditado.id, formatado.fechamento, formatado.nome, formatado.cliente, formatado.valor);
        }
    }

    static excluirCartao(id){
        var elemento = document.querySelector(`[data-quadro_negocio_id="${id}"]`);

        if(elemento == null){
            return;
        }

        elemento.dataset.negocio_excluido = true;
    }

    static carregamento(){
        var elemento = document.getElementById('quadro_negocios_carregando');

        if(elemento.style.display == 'none'){
            elemento.style.display = 'initial';
        }else{
            elemento.style.display = 'none';
        }
    }

    static resetar(){
        var colunas = QuadroNegocio.getColunas();

        for(var [nomeEtapa, elemento] of Object.entries(colunas)){
            elemento.innerHTML = '';
        }
    }
}

class PesquisarTabelaNegocio{
    constructor(textoPesquisa){
        var elementos = this.getElementos();

        this.displayElementos(elementos, 'none');
        this.displayFiltros('none');

        if(textoPesquisa == ''){
            elementos.tabela.style.display = 'block';
            elementos.observador.style.display = 'block';

            this.displayFiltros('block');

            return;
        }

        setTimeout(() => {
            var resultados = PesquisarQuadroNegocio.buscarResultados(textoPesquisa, 100);
            
            elementos.pesquisar.innerHTML = '';
            elementos.pesquisar.style.display = 'block';

            for(var i=0; i<resultados.length; i++){
                var formatado = new FormatarTexto().negocio(_negocios[resultados[i]]);
                var linha = TabelaNegocio.getModelo(_negocios[resultados[i]].id, formatado.nome, formatado.etapa, formatado.fechamento, formatado.cliente, formatado.valor);

                elementos.pesquisar.innerHTML += linha;
            }
        }, 99);
    }

    getElementos(){
        var elementos = {};

        elementos.tabela = TabelaNegocio.getTabela();
        elementos.pesquisar = document.getElementById('tabela_negocios_pesquisar');
        elementos.observador = document.getElementById('tabela_negocios_observador');
        
        return elementos;
    }

    displayElementos(elementos, opcao){
        for(var [nomeCaixa, elemento] of Object.entries(elementos)){
            elemento.style.display = opcao;
        }
    }

    displayFiltros(opcao){
        var elementos = document.getElementsByClassName('filtro-tabela');

        for(var i=0; i<elementos.length; i++){
            elementos[i].style.display = opcao;
        }
    }
}

class OrdenarTabelaNegocio{
    nomeAZ(){
        _negocios.sort(function(a, b){
            if (a.nome > b.nome) {
                return 1;
            }
            if (a.nome < b.nome) {
                return -1;
            }
            return 0;
        });
    }

    nomeZA(){
        _negocios.sort(function(a, b){
            if (a.nome < b.nome) {
                return 1;
            }
            if (a.nome > b.nome) {
                return -1;
            }
            return 0;
        });
    }

    etapaAZ(){
        _negocios.sort(function(a, b){
            if (a.etapa > b.etapa) {
                return 1;
            }
            if (a.etapa < b.etapa) {
                return -1;
            }
            return 0;
        });
    }

    etapaZA(){
        _negocios.sort(function(a, b){
            if (a.etapa < b.etapa) {
                return 1;
            }
            if (a.etapa > b.etapa) {
                return -1;
            }
            return 0;
        });
    }

    fechamentoAZ(){
        _negocios.sort(function(a, b){
            var aSeparado =  a.fechamento.split('/');
            var bSeparado = b.fechamento.split('/');

            if(new Date(`${aSeparado[1]}/${aSeparado[0]}/${aSeparado[2]} 00:00`) < new Date(`${bSeparado[1]}/${bSeparado[0]}/${bSeparado[2]} 00:00`)){
                return 1;
            }
            if(new Date(`${aSeparado[1]}/${aSeparado[0]}/${aSeparado[2]} 00:00`) > new Date(`${bSeparado[1]}/${bSeparado[0]}/${bSeparado[2]} 00:00`)){
                return -1;
            }
            return 0;
        });
    }

    fechamentoZA(){
        _negocios.sort(function(a, b){
            var aSeparado =  a.fechamento.split('/');
            var bSeparado = b.fechamento.split('/');

            if(new Date(`${aSeparado[1]}/${aSeparado[0]}/${aSeparado[2]} 00:00`) > new Date(`${bSeparado[1]}/${bSeparado[0]}/${bSeparado[2]} 00:00`)){
                return 1;
            }
            if(new Date(`${aSeparado[1]}/${aSeparado[0]}/${aSeparado[2]} 00:00`) < new Date(`${bSeparado[1]}/${bSeparado[0]}/${bSeparado[2]} 00:00`)){
                return -1;
            }
            return 0;
        });
    }

    clienteAZ(){
        _negocios.sort(function(a, b){
            if (a.cliente > b.cliente) {
                return 1;
            }
            if (a.cliente < b.cliente) {
                return -1;
            }
            return 0;
        });
    }

    clienteZA(){
        _negocios.sort(function(a, b){
            if (a.cliente < b.cliente) {
                return 1;
            }
            if (a.cliente > b.cliente) {
                return -1;
            }
            return 0;
        });
    }

    valorMaiorMenor(){
        _negocios.sort(function(a, b){
            if (a.valor > b.valor) {
                return 1;
            }
            if (a.valor < b.valor) {
                return -1;
            }
            return 0;
        });
    }

    valorMenorMaior(){
        _negocios.sort(function(a, b){
            if (a.valor < b.valor) {
                return 1;
            }
            if (a.valor > b.valor) {
                return -1;
            }
            return 0;
        });
    }
}

class PesquisarQuadroNegocio{
    constructor(textoPesquisa){
        var caixas = this.getCaixas();

        this.displayCaixas(caixas, 'none');
        this.displayResultado(caixas, 'block');

        if(textoPesquisa == ''){
            this.displayCaixas(caixas, 'block');
            this.displayResultado(caixas, 'none');
            
            return;
        }
    
        QuadroNegocio.carregamento();

        setTimeout(() => {
            var resultados = PesquisarQuadroNegocio.buscarResultados(textoPesquisa, 15);

            for(var i=0; i<resultados.length; i++){
                var formatado = new FormatarTexto().negocio(_negocios[resultados[i]]);
                var cartao = QuadroNegocio.getModeloCartao(formatado.etapa, _negocios[resultados[i]].id, formatado.fechamento, formatado.nome, formatado.cliente, formatado.valor);

                caixas[`${formatado.etapa}_pesquisar`].innerHTML += cartao;
            }

            QuadroNegocio.carregamento();
        }, 999);
    }

    getCaixas(){
        var colunas = QuadroNegocio.getColunas();

        for(var [nomeEtapa, elemento] of Object.entries(colunas)){
            colunas[`${nomeEtapa}_observador`] = document.getElementById(`${elemento.id}_observador`);
            colunas[`${nomeEtapa}_pesquisar`] = document.getElementById(`${elemento.id}_pesquisar`);
        }

        return colunas;
    }

    displayCaixas(caixas, opcao){
        for(var [nomeCaixa, elemento] of Object.entries(caixas)){
            elemento.style.display = opcao;
        }
    }

    displayResultado(caixas, opcao){
        for(var [nomeCaixa, elemento] of Object.entries(caixas)){
            if(nomeCaixa.indexOf('_pesquisar') > -1){
                elemento.innerHTML = '';
                elemento.style.display = opcao;
            }
        }
    }

    static buscarResultados(texto, limite){
        var indices = new Array();

        texto = Utilitarios.normalizarTexto(texto);

        for(var i=0; i<_negocios.length; i++){
            if(Utilitarios.normalizarTexto(JSON.stringify(_negocios[i])).indexOf(texto) > -1){
                indices.push(i);
            }
            if(indices.length >= limite){
                break;
            }
        }

        return indices;
    }
}

class AtualizarPosQuadro{
    constructor(){
        this.vincularEventos();
        this.temporizador();
    }

    vincularEventos(){
        var colunas = QuadroNegocio.getColunas();

        for(var [chave, valor] of Object.entries(colunas)){
            valor.addEventListener('DOMSubtreeModified', function(){
                _posNegociosModificados = true;
            }, false);
        }
    }

    temporizador(){
        setInterval(() => {
            if(_posNegociosModificados == false){
                return;
            }

            var colunas = QuadroNegocio.getColunas();

            for(var [nomeEtapa, elemento] of Object.entries(colunas)){
                _novasPosNegocios[nomeEtapa] = new Array();

                for(var i=0; i<elemento.children.length; i++){
                    _novasPosNegocios[nomeEtapa].push(elemento.children[i].dataset.quadro_negocio_id);
                }
            }

            this.unificarPosicoes();

            _posNegociosModificados = false;
        }, 2999);
    }

    unificarPosicoes(){
        var colunas = QuadroNegocio.getColunas();

        for(var [nomeEtapa, elemento] of Object.entries(colunas)){
            var qtdCarregada = document.querySelectorAll(`[data-cartao_carregado="${nomeEtapa}"]`).length;
            var posicoesNaoCarregas = _posNegocios[`${nomeEtapa}`].slice(qtdCarregada, _posNegocios[`${nomeEtapa}`].length);

            _novasPosNegocios[`${nomeEtapa}`] = _novasPosNegocios[`${nomeEtapa}`].concat(posicoesNaoCarregas);
        }


    }
}

class FormatarTexto{
    negocio(negocio){
        var formatar = {};

        formatar.nome = this.getNome(negocio.nome);
        formatar.fechamento = this.getFechamento(negocio.fechamento);
        formatar.cliente = this.getCliente(negocio.cliente);
        formatar.valor = this.getValor(negocio.valor);
        formatar.etapa = this.getEtapa(negocio.etapa);

        return formatar;
    }

    getNome(nome){
        var limite = 58;

        if(nome.length > limite){
            nome = nome.substring(0, (limite - 3)) + '...';
        }

        return nome;
    }

    getFechamento(data){
        return data;
    }

    static getCorFechamento(data){
        var atual = new Date();
        var separado = data.split('/');
        var classeAtrasado = 'fechamento-atrasado';

        if(new Date(`${separado[1]}/${separado[0]}/${separado[2]} 00:00`) > new Date(`${atual.getMonth() +1}/${atual.getDate()}/${atual.getFullYear()} 00:00`)){
            classeAtrasado = '';
        }

        return classeAtrasado;
    }

    getCliente(nome){
        var limite = 35;

        if(nome.length > limite){
            nome = nome.substring(0, (limite - 3)) + '...';
        }

        return nome;
    }

    getValor(valor){
        return Utilitarios.mascaraMoeda(valor);
    }

    getEtapa(etapa){
        return etapa;
    }
}

class ModalErro{
    constructor(){
        $('#modal_erro').modal('show');
    }
}

class ModalNegocio{
    constructor(idNegocio, origem){
        var negocio = '';

        for(var i=0; i<_negocios.length; i++){
            if(idNegocio == _negocios[i].id){
                negocio = _negocios[i];
                break;
            }
        }

        if(negocio == ''){
            new ModalErro();
            return;
        }
        
        $(ModalNegocio.getModal()).modal('show');

        var etapa = negocio.etapa;

        if(origem == 'cartao'){
            etapa = QuadroNegocio.getEtapaCartao(idNegocio);
        }

        ModalNegocio.setInputs(negocio.id, negocio.nome, negocio.cliente, negocio.fechamento, etapa, Utilitarios.mascaraMoeda(negocio.valor));
    }

    static setInputs(id, nome, cliente, fechamento, etapa, valor){
        var inputs = ModalNegocio.getInputs();

        document.getElementById(inputs.id).value = id;
        document.getElementById(inputs.nome).innerText = nome;
        document.getElementById(inputs.cliente).innerText = cliente;
        document.getElementById(inputs.fechamento).value = fechamento;
        document.getElementById(inputs.valor).value = valor;

        ModalNegocio.setEtapa(etapa);
    }

    static setEtapa(nome){
        var valorConclusao = QuadroNegocio.getValorColunas()[`${nome}`];
        var elemento = document.getElementById('modal_negocio_etapa');

        elemento.value = nome;

        $(elemento).selectpicker('refresh');

        document.getElementById('modal_negocio_barra_progresso').style.width = `${valorConclusao}%`;
    }

    static setDadosCliente(contato, informacao){
        var boxContatos = document.getElementById('box_negocio_cliente_contato');
        var boxInformacao = document.getElementById('box_negocio_cliente_informacao');
        var labelCNPJCPF = 'CNPJ';

        for(var i=0; i<contato.length; i++){
            if(contato[i].nome != ''){
                boxContatos.innerHTML += `<div class="blocoInformacaoCliente"> <label>Nome e Cargo</label> <p>${contato[i].email} - ${contato[i].cargo}</p> </div>`;
            }
            if(contato[i].email != ''){
                boxContatos.innerHTML += `<div class="blocoInformacaoCliente"> <label>E-mail</label> <p>${contato[i].email}</p> </div>`;
            }
            if(contato[i].telefone != ''){
                boxContatos.innerHTML += `<div class="blocoInformacaoCliente"> <label>Telefone</label> <p>${contato[i].telefone}</p> </div>`;
            }
        }

        if(informacao.cnpjcpf.length <= 11){
            labelCNPJCPF = 'CPF';
        }

        boxInformacao.innerHTML += `<div class="blocoInformacaoCliente"> <label>${labelCNPJCPF}</label> <p>${informacao.cnpjcpf}</p> </div>`;
        boxInformacao.innerHTML += `<div class="blocoInformacaoCliente"> <label>Endereço</label> <p>${informacao.endereco}</p> </div>`;
    }

    static setAtributoModal(nome, valor){
        ModalNegocio.getModal().dataset[nome] = valor;
    }

    static addAtividade(opcoes){
        var box = document.getElementById(ModalNegocio.getIdBoxAtividade(opcoes.tipo));
        var qtdExibidos = box.children.length;
        var limiteExibicao = 7;
        var qtdEnviados = 0;

        for(var i=0; i<_atividades.length; i++){
            if(opcoes.tipo == 'tudo'){
                if(qtdEnviados >= qtdExibidos){
                    box.innerHTML = box.innerHTML + new Atividade().getModelo(_atividades[i]);
                }
                qtdEnviados += 1;
            }else if(opcoes.tipo == _atividades[i].tipo){
                if(qtdEnviados >= qtdExibidos){
                    box.innerHTML = box.innerHTML + new Atividade().getModelo(_atividades[i]);
                }
                qtdEnviados += 1;
            }
            if(qtdExibidos + limiteExibicao == qtdEnviados){
                return;
            }
        }
    }

    static addRegistroAcao(atividade){
        var boxTudo = document.getElementById(ModalNegocio.getIdBoxAtividade('tudo'));
        var boxEspecifico = document.getElementById(ModalNegocio.getIdBoxAtividade(atividade.tipo));

        _atividades.unshift(atividade);
        
        boxTudo.innerHTML = new Atividade().getModelo(atividade) + boxTudo.innerHTML;
        boxEspecifico.innerHTML = new Atividade().getModelo(atividade) + boxEspecifico.innerHTML;
    }

    static getInputs(){
        return {id: 'modal_negocio_id',
                nome: 'modal_negocio_nome',
                cliente: 'modal_negocio_cliente',
                fechamento: 'modal_negocio_fechamento',
                etapa: 'modal_negocio_etapa',
                valor: 'modal_negocio_valor'};
    }

    static getIdBoxAtividade(tipo){
        switch(tipo){
            case 'tudo':
                return 'box_tab_atividades';
            case 'observacao':
                return 'box_tab_observacoes';
            case 'email':
                return 'box_tab_emails';
            case 'ligacao':
                return 'box_tab_ligacoes';
            case 'reuniao':
                return 'box_tab_reunioes';
            case 'anexo':
                return 'box_tab_anexos';
        }
    }

    static getModal(){
        return document.getElementById('modal_negocio');
    }

    static getAtributoModal(nome){
        return ModalNegocio.getModal().dataset[nome];
    }

    static getConteudoEmail(id){
        var elemento = document.getElementById(id);
        var idEmail = elemento.dataset.email_id;

        elemento.dataset.carregando = true;

        setTimeout(() => {
            var conteudo = JSON.stringify([{data: '10/04/2020', de: 'josecolpo@pap.com.br', corpo: 'texto do conteudo'},{data: '09/04/2020', de: 'josecolpo@pap.com.br', corpo: 'texto do conteudo 2'}]);

            conteudo = JSON.parse(conteudo);

            ModalNegocio.addConteudoEmail(id, conteudo, true);

            elemento.dataset.carregando = false;
        }, 999);
    }

    static addConteudoEmail(id, conteudo, limpar){
        var box = document.getElementById(`${id}_conteudo`);

        if(limpar == true){ box.innerHTML = ''; }

        for(var i=0; i<conteudo.length; i++){
            box.innerHTML += `<div class="blocoInformacaoCliente atividade"> <div class="row"> <div class="col-sm"> <label>${conteudo[i].de}</label> </div> <div class="col-sm"> <label>${conteudo[i].data}</label> </div> </div> <p>${conteudo[i].corpo}</p> </div>`;
        }
    }

    static eventoAtualizarDados(){
        $(ModalNegocio.getModal()).on('hidden.bs.modal', function(){
            var inputs = ModalNegocio.getInputs();
            var negocioEditado = {id: document.getElementById(inputs.id).value,
                                  nome: document.getElementById(inputs.nome).innerText,
                                  etapa: document.getElementById(inputs.etapa).value,
                                  fechamento: document.getElementById(inputs.fechamento).value,
                                  cliente: document.getElementById(inputs.cliente).innerText,
                                  valor: Utilitarios.removerMascaraMoeda(document.getElementById(inputs.valor).value)};

            QuadroNegocio.editarCartao(negocioEditado);
            TabelaNegocio.editarLinha(negocioEditado);

            for(var i=0; i<_negocios.length; i++){
                if(_negocios[i].id == negocioEditado.id){
                    if(_negocios[i].excluido == true){
                        return;
                    }
                    _negocios[i] = negocioEditado;
                }
            }
        });
    }

    static carregamento(opcoes){
        if(ModalNegocio.getAtributoModal(opcoes.atributo) == 'true'){
            ModalNegocio.setAtributoModal(opcoes.atributo, false);
        }else{
            ModalNegocio.setAtributoModal(opcoes.atributo, true);
        }
    }

    static excluirNegocio(id){
        TabelaNegocio.excluirLinha(id);
        QuadroNegocio.excluirCartao(id);

        for(var i=0; i<_negocios.length; i++){
            if(_negocios[i].id == id){
                _negocios[i].excluido = true;
                break;
            }
        }

        $(ModalNegocio.getModal()).modal('hide');
    }

    static excluirAtividade(id){
        var cardsExcluir = document.getElementsByClassName('negocio-atividade-id' + id);

        for(var i=0; i<cardsExcluir.length; i++){
            cardsExcluir[i].style.display = 'none';
        }

        for(var i=0; i<_atividades.length; i++){
            if(_atividades[i].id == id){
                _atividades.splice(i, 1);
            }
        }
    }
}

class Atividade{
    getModelo(atividade){
        switch(atividade.tipo){
            case 'observacao':
                return this.observacao(atividade);
            case 'email':
                return this.email(atividade);
            case 'ligacao':
                return this.ligacao(atividade);
            case 'reuniao':
                return this.reuniao(atividade);
            case 'anexo':
                return this.anexo(atividade);
        }
    }

    observacao(atividade){
        return `<div class="negocio-atividade-id${atividade.id} card atividades"> <div class="info info-horizontal"> <div class="icon"> <i class="material-icons">comment</i> </div> <div class="description"> <span class="cabecalho"> <a class="info"> Observação ● ${atividade.data}</a> <div class="dropdown"> <button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="material-icons">more_horiz</i> </button> <div class="dropdown-menu"> <a onclick="new ModalExcluirAtividade(${atividade.id});" class="dropdown-item">Excluir</a> </div> </div> </span> <p>${atividade.conteudo}</p> </div> </div> </div>`;
    }

    email(atividade){
        return `<div class="negocio-atividade-id${atividade.id} card atividades card-email"> <div class="info info-horizontal"> <div class="icon"> <i class="material-icons">mail</i> </div> <div class="description"> <span class="cabecalho"> <a class="info"> Email ● ${atividade.data}</a> <div class="dropdown"> <button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="material-icons">more_horiz</i> </button> <div class="dropdown-menu"> <a target="_blank" href="${atividade.id}" class="dropdown-item">Abrir</a> </div> </div> </span> <p><strong>${atividade.assunto}</strong><br/>De: ${atividade.de}</p> </div> <div role="tablist" aria-multiselectable="true" class="card-collapse"> <div class="card card-plain collapseSemMargem"> <div class="card-header collapse-atividade" role="tab"> <a onclick="ModalNegocio.getConteudoEmail('collapse_email_${atividade.id}');" data-toggle="collapse" data-parent="#collapse_email_${atividade.id}" href="#collapse_email_${atividade.id}" aria-expanded="false"> Exibir Mais <i class="material-icons">keyboard_arrow_down</i> </a> </div> <div id="collapse_email_${atividade.id}" data-carregando="false" data-email_id="${atividade.id}" class="exibir-mais-email collapse" role="tabpanel"> <img src="https://drive.google.com/uc?export=view&amp;id=1J9xvnsubnshIhXJru_eULWz02lsKH259"> <div class="card-body"> <div id="collapse_email_${atividade.id}_conteudo"> </div> <button onclick="new JanelaEmail().setResposta('${atividade.de}', 'Re: ${atividade.assunto} ${atividade.id}');" class="btn btn-primary btn-sm"> <i class="material-icons">reply</i> Responder </button> </div> </div> </div> </div> </div> </div>`;
    }

    ligacao(atividade){
        return `<div class="negocio-atividade-id${atividade.id} card card-ligacao atividades"> <div class="info info-horizontal"> <div class="icon"> <i class="material-icons">phone</i> </div> <div class="description"> <span class="cabecalho"> <a class="info"> Ligação ● ${atividade.data}</a> </span> <p> <audio src="${atividade.url}" controls=""></audio> </p> </div> </div> </div>`;
    }

    reuniao(atividade){
        return `<div class="negocio-atividade-id${atividade.id} card atividades"> <div class="info info-horizontal"> <div class="icon"> <i class="material-icons">event_note</i> </div> <div class="description"> <span class="cabecalho"> <a class="info"> Reunião ● ${atividade.data}</a> <div class="dropdown"> <button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="material-icons">more_horiz</i> </button> <div class="dropdown-menu"> <a target="_blank" href="https://calendar.google.com/calendar/u/0/r?pli=1#eventpage_6%7Ceid-${atividade.id}" class="dropdown-item">Abrir</a> </div> </div> </span> <p><strong>${atividade.nome}</strong><br/>Data: ${atividade.execucao}<br/>Participantes: ${atividade.participantes}</p> </div> </div> </div>`;
    }

    anexo(atividade){
        return `<div class="negocio-atividade-id${atividade.id} card atividades"> <div class="info info-horizontal"> <div class="icon"> <i class="material-icons">attach_file</i> </div> <div class="description"> <span class="cabecalho"> <a class="info"> Anexo ● ${atividade.data}</a> <div class="dropdown"> <button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="material-icons">more_horiz</i> </button> <div class="dropdown-menu"> <a href="${atividade.url}" target="_blank" class="dropdown-item">Abrir</a> <a onclick="new ModalExcluirAtividade(${atividade.id});" class="dropdown-item">Excluir</a> </div> </div> </span> <p><strong>${atividade.nome}</strong><br/><a target="_blank" href="${atividade.url}">${atividade.url}</a></p> </div> </div> </div>`;
    }
}

class PesquisarModalNegocio{
    constructor(textoPesquisa){
        if(textoPesquisa == ''){
            this.limpar();
            return;
        }

        this.exibir();
        this.modoCarregando();

        setTimeout(() => {
            var indices = this.buscar(textoPesquisa);
            var boxResultado = this.getBoxResultado();

            if(indices.length <= 0){
                boxResultado.innerHTML = '<p class="nenhum-resultado">Nenhum resultado encontrado para a pesquisa</p>';
            }else{
                for(var i=0; i<indices.length; i++){
                    boxResultado.innerHTML = boxResultado.innerHTML + new Atividade().getModelo(_atividades[indices[i]]);
                }
            }
        }, 999);
    }

    modoCarregando(){
        ModalNegocio.carregamento({atributo: 'carregamento_atividade'});

        setTimeout(function(){
            ModalNegocio.carregamento({atributo: 'carregamento_atividade'});
        }, 999);
    }

    getBoxResultado(){
        return document.getElementById('box_tab_atividades_pesquisar');
    }

    getBoxAtividades(){
        return document.getElementById(ModalNegocio.getIdBoxAtividade('tudo'));
    }

    getObservador(){
        return document.getElementById('observador_tab_atividades');
    }

    buscar(textoPesquisa){
        var indicesEncontrados = new Array();
        var limite = 15;

        textoPesquisa = Utilitarios.normalizarTexto(textoPesquisa);

        for(var i=0; i<_atividades.length; i++){
            if(Utilitarios.normalizarTexto(JSON.stringify(_atividades[i])).indexOf(textoPesquisa) > -1){
                indicesEncontrados.push(i);
            }
            if(indicesEncontrados.length >= limite){
                break;
            }
        }

        return indicesEncontrados;
    }

    exibir(){
        this.getObservador().style.display = 'none';
        this.getBoxResultado().style.display = 'block';
        this.getBoxResultado().innerHTML = '';
        this.getBoxAtividades().style.display = 'none';
    }

    limpar(){
        this.getBoxResultado().style.display = '';
        this.getBoxAtividades().style.display = '';
        this.getObservador().style.display = '';
    }
}

class ModalExcluirAtividade{
    constructor(id){
        document.getElementById('btn_excluir_atividade').dataset.id_atividade = id;
        $('#modal_confirmacao_excluir_atividade').modal('show');
    }
}

class ModalCriarNegocio{
    static getModal(){
        return document.getElementById('modal_criar_negocio');
    }

    static getAtributoModal(atributo){
        return ModalCriarNegocio.getModal().dataset[atributo];
    }

    static setAtributoModal(atributo, valor){
        ModalCriarNegocio.getModal().dataset[atributo] = valor;
    }

    getValorInputs(){
        var inputs = document.getElementsByClassName('input-criar-negocio');
        var valores = {contatos: new CriarNegocioBoxContato().getRegistros()};

        for(var i=0; i<inputs.length; i++){
            valores[`${inputs[i].dataset.nome}`] = inputs[i].value;
        }

        valores.clienteId = Cliente.getId(valores.cliente);

        return valores;
    }

    abrir(etapa){
        var elemento = document.querySelector('.input-criar-negocio[data-nome="etapa"]');

        elemento.value = etapa

        $(elemento).selectpicker('refresh');
        $(ModalCriarNegocio.getModal()).modal('show');
    }

    enviarFormulario(){
        ModalCriarNegocio.setAtributoModal('carregando', true);

        setTimeout(() => {
            this.registrarNovo(this.getValorInputs(), Math.random());
        }, 1999);
    }

    registrarNovo(negocio, id){
        negocio.id = id;
        negocio.valor = Utilitarios.removerMascaraMoeda(negocio.valor);

        QuadroNegocio.addCartoes([negocio], true, false);
        TabelaNegocio.addLinhas([negocio], {topo: true, origemCarregado: false});

        _negocios.unshift(negocio);

        ModalCriarNegocio.resetarInputs();
        ModalCriarNegocio.setAtributoModal('carregando', false);

        $(ModalCriarNegocio.getModal()).modal('hide');
    }

    exibirInfoContato(opcao){
        setTimeout(() => {
            ModalCriarNegocio.setAtributoModal('exibir_info_contato', opcao);
        }, 299);
    }

    verificarFormulario(){
        var contatos = document.getElementsByClassName('contato-nome');

        if(ModalCriarNegocio.getAtributoModal('cliente_novo') == 'true' && contatos.length == 0){
            $('#modal_confirmacao_sem_contato').modal('show');
        }else{
            this.enviarFormulario();
        }
    }

    verificaCadastro(nomeCliente){
        if(nomeCliente == ''){
            return;
        }

        var clientesCadastrados = document.getElementById('nome_todos_clientes').children;
        var statusCadastroNovo = true;
        var boxContato = new CriarNegocioBoxContato();

        for(var i=0; i<clientesCadastrados.length; i++){
            if(clientesCadastrados[i].value == nomeCliente){
                statusCadastroNovo = false;
                break;
            }
        }

        if(statusCadastroNovo == false){
            boxContato.limpar();

            ModalCriarNegocio.addContatos(JSON.stringify([{nome: 'Marieli Ritzel Machado', email: 'mmachado@kleyhertz.com.br', telefone: ''},{nome: 'Elisa Duarte Gonçalves', email: '', telefone: '(51) 99987-1269'}]));

            this.exibirInfoContato(false);
        }else{
            var atributoClienteNovo = ModalCriarNegocio.getAtributoModal('cliente_novo');

            if(atributoClienteNovo == 'false' || atributoClienteNovo == ''){
                boxContato.limpar();
                this.exibirInfoContato(true);
            }
        }

        ModalCriarNegocio.setAtributoModal('cliente_novo', statusCadastroNovo);
    }

    static addContatos(contatos){
        var boxContato = new CriarNegocioBoxContato();

        contatos = Cliente.getInformacoes(contatos);

        for(var i=0; i<contatos.nome.length; i++){
            boxContato.add(contatos[i].nome, contatos[i].email, contatos[i].telefone);
        }
    }

    static resetarInputs(){
        var inputs = document.getElementsByClassName('input-criar-negocio');

        for(var i=0; i<inputs.length; i++){
            inputs[i].value = '';
        }

        new CriarNegocioBoxContato().limpar();

        ModalCriarNegocio.setAtributoModal('cliente_novo', '');
        ModalCriarNegocio.setAtributoModal('exibir_info_contato', '');
    }
}

class CriarNegocioBoxContato{
    constructor(){
        this.id = 'box_novos_contatos';
    }

    limpar(){
        document.getElementById(this.id).innerHTML = '';
    }
    
    add(nome, email, telefone){
        var box = document.getElementById(this.id);

        ModalCriarNegocio.setAtributoModal('exibir_info_contato', false);
        
        box.innerHTML = '<div class="row"> <div class="col-sm"> <h5 class="contato-nome">' + nome + '</h5> <span class="contato-email">' + email + '</span> <span class="contato-telefone">' + telefone + '</span> </div> <div class="col-sm"> <i title="Excluir" onclick="this.parentElement.parentElement.remove();" class="material-icons">delete</i> </div> </div>' + box.innerHTML;
    }

    getRegistros(){
        var box = document.getElementById(this.id);
        var contatos = new Array();

        for(var i=0; i<box.children.length; i++){
            var contato = {};
            var nome = box.children[i].getElementsByClassName('contato-nome')[0].innerText;
            var email = box.children[i].getElementsByClassName('contato-email')[0].innerText;
            var telefone = box.children[i].getElementsByClassName('contato-telefone')[0].innerText;

            contatos.push({nome: nome, email: email, telefone: telefone});
        }

        return contatos;
    }
}

class ModalNovoContato{
    constructor(){
        this.idJanela = '#modal_novo_contato';
    }

    abrir(){
        $(this.idJanela).modal('show');
    }

    fechar(){
        $(this.idJanela).modal('hide');
    }

    add(){
        var inputNome = document.getElementById('novo_contato_nome');
        var inputEmail = document.getElementById('novo_contato_email');
        var inputTelefone = document.getElementById('novo_contato_telefone');

        new CriarNegocioBoxContato().add(inputNome.value, inputEmail.value, inputTelefone.value);

        inputNome.value = '';
        inputEmail.value = '';
        inputTelefone.value = '';

        this.fechar();
    }
}

class JanelaAnexo{
    static getJanela(){
        return document.getElementById('janela_anexo');
    }

    static getBoxAnexos(){
        return document.getElementById('janela_anexo_box_uploads');
    }

    async lerAnexos(input){
        var anexos = await new Anexo().ler(input);
        
        this.adicionarArquivos(anexos);
    }

    adicionarArquivos(anexos){
        var boxArquivos = JanelaAnexo.getBoxAnexos();

        for(var i=0; i<anexos.length; i++){
            var limiteCaracteres = false;

            if(anexos[i].nome.length >= 49){
                limiteCaracteres = true;
            }

            boxArquivos.innerHTML = `<div class="arquivo-upload"> <input class="janela_anexo_upload" data-anexo_url="${anexos[i].url}" data-anexo_nome="${anexos[i].nome}" value="${anexos[i].arquivo}" type="text" hidden=""> <div class="borda"> <div class="row"> <div class="col-sm nome" data-limite_caracteres="${limiteCaracteres}"> <a title="Abrir" target="_blank" href="${anexos[i].url}"> <span>${anexos[i].nome}</span> </a> </div> <div class="col-sm"> <i title="Excluir" onclick="this.parentElement.parentElement.parentElement.parentElement.remove();" class="material-icons">delete</i> </div> </div> </div> </div>` + boxArquivos.innerHTML;
        }
    }

    getArquivos(){

    }

    enviarFormulario(){
        var janela = JanelaAnexo.getJanela();
        var elementos = document.getElementsByClassName('janela_anexo_upload');

        if(elementos.length == 0){
            return;
        }

        janela.dataset.carregando = true;
        
        setTimeout(() => {
            for(var i=0; i<elementos.length; i++){
                var atividade = {id: Math.random(), 
                                 tipo: 'anexo',
                                 data: new Date().toLocaleDateString(),
                                 nome: elementos[i].dataset.anexo_nome,
                                 url: elementos[i].dataset.anexo_url};

                ModalNegocio.addRegistroAcao(atividade);
            }

            janela.dataset.carregando = false;
            janela.dataset.fechado = true;

            JanelaAnexo.getBoxAnexos().innerHTML = '';
        }, 999);
    }
}

class JanelaReuniao{
    getJanela(){
        return document.getElementById('janela_reuniao');
    }

    enviarFormulario(){
        var janela = this.getJanela();

        janela.dataset.carregando = true;
        
        setTimeout(() => {
            var elementos = {motivo: document.getElementById('janela_reuniao_motivo'),
                             participantes: document.getElementById('janela_reuniao_participantes'),
                             execucao: document.getElementById('janela_reuniao_data'),
                             horario: document.getElementById('reuniao_horario'),
                             duracao: document.getElementById('reuniao_duracao')};
            var atividade = {id: Math.random(), 
                             tipo: 'reuniao',
                             data: new Date().toLocaleDateString(),
                             nome: elementos.motivo.value,
                             execucao: `${elementos.execucao.value} ${elementos.horario.value}`,
                             participantes: elementos.participantes.value};

            ModalNegocio.addRegistroAcao(atividade);

            elementos.motivo.value = '';
            elementos.participantes.value = '';
            elementos.execucao.value = '';
            elementos.horario.value = '';
            elementos.duracao.value = '';

            janela.dataset.carregando = false;
            janela.dataset.fechado = true;
        }, 999);
    }
}

class JanelaEmail{
    getJanela(){
        return document.getElementById('janela_email');
    }

    getBoxAnexos(){
        return document.getElementById('janela_email_box_uploads');
    }

    setResposta(para, assunto){
        var janela = this.getJanela();

        janela.dataset.fechado = false;

        document.getElementById('janela_email_para').value = para,
        document.getElementById('janela_email_assunto').value = assunto;
    }

    async lerAnexos(input){
        var anexos = await new Anexo().ler(input);
        
        this.adicionarArquivos(anexos);
    }

    adicionarArquivos(anexos){
        var boxArquivos = this.getBoxAnexos();

        for(var i=0; i<anexos.length; i++){
            var limiteCaracteres = false;

            if(anexos[i].nome.length >= 49){
                limiteCaracteres = true;
            }

            boxArquivos.innerHTML = '<div class="arquivo-upload"> <input class="janela_email_anexo_upload" value="' + anexos[i].arquivo + '" type="text" hidden=""> <div class="borda"> <div class="row"> <div class="col-sm nome" data-limite_caracteres="' + limiteCaracteres + '"> <a title="Abrir" target="_blank" href="' + anexos[i].url + '"> <span>' + anexos[i].nome + '</span> </a> </div> <div class="col-sm"> <i title="Excluir" onclick="this.parentElement.parentElement.parentElement.parentElement.remove();" class="material-icons">delete</i> </div> </div> </div> </div>' + boxArquivos.innerHTML;
        }
    }

    enviarFormulario(){
        var janela = this.getJanela();

        janela.dataset.carregando = true;
        
        setTimeout(() => {
            var elementos = {para: document.getElementById('janela_email_para'),
                             assunto: document.getElementById('janela_email_assunto'),
                             corpo: document.getElementById('janela_email_corpo')};
            var atividade = {id: Math.random(), 
                             tipo: 'email',
                             data: new Date().toLocaleDateString(),
                             assunto: elementos.assunto.value,
                             de: elementos.para.value};

            ModalNegocio.addRegistroAcao(atividade);

            elementos.para.value = '';
            elementos.assunto.value = '';
            elementos.corpo.value = '';

            this.getBoxAnexos().innerHTML = '';

            janela.dataset.carregando = false;
            janela.dataset.fechado = true;
        }, 999);
    }
}

class JanelaObservacao{
    static getJanela(){
        return document.getElementById('janela_observacao');
    }

    enviarFormulario(){
        var janela = JanelaObservacao.getJanela();

        janela.dataset.carregando = true;
        
        setTimeout(() => {
            var elemento = document.getElementById('janela_observacao_conteudo');
            var atividade = {id: Math.random(), tipo: 'observacao', data: new Date().toLocaleDateString(), conteudo: elemento.value}

            ModalNegocio.addRegistroAcao(atividade);

            elemento.value = '';

            janela.dataset.carregando = false;
            janela.dataset.fechado = true;
        }, 999);
    }
}

class Anexo{
    async ler(input){
        try{
            var anexos = new Array();
            var leitor = new FileReader();
            var ultimoIndice = 0;

            function processar(indice){
                ultimoIndice = indice;

                if(indice >= input.files.length){
                    input.value = '';
                    ultimoIndice = indice;
                    return;
                }

                leitor.onload = function(){
                    anexos.push({arquivo: this.result,
                                nome: input.files[indice].name,
                                url: URL.createObjectURL(input.files[indice])});
                }

                leitor.onloadend = function(){
                    processar(indice + 1);
                }

                leitor.readAsDataURL(input.files[indice]);
            }

            processar(0);

            while(ultimoIndice <= input.files.length){
                await Utilitarios.aguardar(99);
            }

            return anexos;
        }catch(e){ }
    }
}

class Utilitarios{
    static aguardar(ms){
          return new Promise(resolve => setTimeout(resolve, ms));
    }

    static normalizarTexto(texto){
        var obj = {
            'a' : 'á|à|ã|â|À|Á|Ã|Â',
            'e' : 'é|è|ê|É|È|Ê',
            'i' : 'í|ì|î|Í|Ì|Î',
            'o' : 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
            'u' : 'ú|ù|û|ü|Ú|Ù|Û|Ü',
            'c' : 'ç|Ç',
            'n' : 'ñ|Ñ'
        };
        
        for (var padrao in obj) {
            texto = texto.replace(new RegExp(obj[padrao], 'g'), padrao);
        };
    
        return texto.toLowerCase();
    }

    static dataHoraAtual(){
        var data = new Date();

        return data.getDate()+'/'+(data.getMonth()+1)+'/'+data.getFullYear()+' '+data.getHours()+':'+data.getMinutes();
    }

    static mascaraMoeda(valor){
        valor = Number(valor);
        
        return valor.toLocaleString('pt-br', {minimumFractionDigits: 2});
    }

    static removerMascaraMoeda(valor){
        if(valor.length <= 6){
            return valor.replaceAll(',','.');
        }else{
            return valor.replaceAll('.','').replaceAll(',','.');
        }
    }

    static getXML(xml){
        return new DOMParser().parseFromString(xml, "text/xml");
    }
}

class JanelaControlador{
    init(){
        var elementosMinimizar = document.getElementsByClassName('icone-minimizar');
        var elementosMaximizar = document.getElementsByClassName('icone-maximizar');
        var elementosTelaCheia = document.getElementsByClassName('icone-tela-cheia');
        var elementosRestaurarTela = document.getElementsByClassName('icone-restaurar-tela');
        var elementosFechar = document.getElementsByClassName('icone-fechar');

        for(var i=0; i<elementosMinimizar.length; i++){
            elementosMinimizar[i].addEventListener('click', function(){
                JanelaControlador.minimizar(JanelaControlador.getNodoPai(this));
            });
        }

        for(var i=0; i<elementosMaximizar.length; i++){
            elementosMaximizar[i].addEventListener('click', function(){
                JanelaControlador.maximizar(JanelaControlador.getNodoPai(this));
            });
        }

        for(var i=0; i<elementosTelaCheia.length; i++){
            elementosTelaCheia[i].addEventListener('click', function(){
                JanelaControlador.telaCheia(JanelaControlador.getNodoPai(this));
            });
        }

        for(var i=0; i<elementosRestaurarTela.length; i++){
            elementosRestaurarTela[i].addEventListener('click', function(){
                JanelaControlador.restaurarTela(JanelaControlador.getNodoPai(this));
            });
        }

        for(var i=0; i<elementosFechar.length; i++){
            elementosFechar[i].addEventListener('click', function(){
                JanelaControlador.fechar(JanelaControlador.getNodoPai(this));
            });
        }
    }

    static minimizar(elemento){
        elemento.dataset.minimizado = true;
        elemento.dataset.tela_cheia = false;
    }

    static maximizar(elemento){
        elemento.dataset.minimizado = false;
    }

    static telaCheia(elemento){
        elemento.dataset.tela_cheia = true;
        elemento.dataset.minimizado = false;
    }

    static restaurarTela(elemento){
        elemento.dataset.tela_cheia = false;
    }

    static fechar(elemento){
        elemento.dataset.fechado = true;
        elemento.dataset.minimizado = false;
        elemento.dataset.tela_cheia = false;
    }

    fecharTodas(){
        var janelas = document.getElementsByClassName('janela-acao');

        for(var i=0; i<janelas.length; i++){
            JanelaControlador.fechar(janelas[i]);
        }
    }

    abrir(id){
        this.fecharTodas();

        document.getElementById(id).dataset.fechado = false;
    }

    static getNodoPai(elemento){
        return elemento.parentNode.parentNode.parentNode.parentNode.parentNode;
    }
}

class ArrastaveisQuadroNegocios{
    constructor(){
        const containers = document.querySelectorAll('.coluna-quadro-negocio');

        containers.forEach(container => {
            container.addEventListener('dragover', e => {
                e.preventDefault();

                const afterElement = ArrastaveisQuadroNegocios.getElementoProximo(container, e.clientY);
                const draggable = document.querySelector('.dragging');

                if(afterElement == null){
                    container.appendChild(draggable);
                }else{
                    container.insertBefore(draggable, afterElement);
                }
            });
        });
    }

    static getElementoProximo(container, y){
        const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if(offset < 0 && offset > closest.offset){
                return { offset: offset, element: child }
            }else{
                return closest
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
}

class ObservadorTela{
    constructor(idElemento, funcaoAdd, opcoesFuncao, funcaoCarregamento, opcoesCarregamento){
        var elemento = document.getElementById(idElemento);

        new IntersectionObserver(function(e){ ObservadorTela.evento(e, funcaoAdd, opcoesFuncao, funcaoCarregamento, opcoesCarregamento); }).observe(elemento);
    }

    static evento(e, addAtividade, opcoesFuncao, funcaoCarregamento, opcoesCarregamento){
        if(e[0].isIntersecting == true){
            funcaoCarregamento(opcoesCarregamento);

            setTimeout(function(){
                addAtividade(opcoesFuncao);
                funcaoCarregamento(opcoesCarregamento);
            }, 399);
        }
    }
}

class ModalLembrete{
    constructor(){
        var lembretes = new Array();
        var hoje = new Date();

        for(var i=0; i<_negocios.length; i++){
            var separado = _negocios[i].fechamento.split('/');

            if(new Date(`${Number(separado[1])}/${Number(separado[0])}/${Number(separado[2])} 00:00`) < new Date(`${hoje.getMonth() +1}/${hoje.getDate()}/${hoje.getFullYear()} 00:00`)){
                lembretes.push(_negocios[i]);
            }
        }

        this.addLinhas(this.ordenar(lembretes));
        this.eventoFechar();
    }

    getTabela(){
        return document.getElementById('modal_lembretes_tabela');
    }

    static setIcone(qtdLembretes){
        var icone = document.getElementById('btn_lembretes');
        var qtd = document.getElementById('btn_lembretes_qtd');

        if(qtdLembretes > 0){
            icone.dataset.lembretes = true;
            qtd.innerText = qtdLembretes;

            if(qtdLembretes > 9){
                qtd.innerText = '+9';
            }
        }else{
            icone.dataset.lembretes = false;
        }
    }

    addLinhas(negocios){
        var tabela = this.getTabela();

        ModalLembrete.setIcone(negocios.length);

        if(negocios.length == 0){
            tabela.innerHTML = '<tr style="text-align: center;"><td>Nenhum lembrete foi encontrado</td></tr>';
            return;
        }

        for(var i=0; i<negocios.length; i++){
            tabela.innerHTML = `<tr onclick="new ModalNegocio(${negocios[i].id}, 'tabela'); setTimeout(() => { this.remove(); }, 999);" class="linha" data-id_lembrete="${negocios[i].id}"> <td class="data">${negocios[i].fechamento}</td> <td title="${negocios[i].nome}">${this.formatar(negocios[i].nome)}</td> <td title="${negocios[i].cliente}">${this.formatar(negocios[i].cliente)}</td> <td class="valor">R$ ${Utilitarios.mascaraMoeda(negocios[i].valor)}</td> </tr>` + tabela.innerHTML;
        }
    }

    ordenar(lembretes){
        lembretes.sort(function(a, b){
            var aSeparado =  a.fechamento.split('/');
            var bSeparado = b.fechamento.split('/');

            if(new Date(`${Number(aSeparado[1])}/${Number(aSeparado[0])}/${Number(aSeparado[2])} 00:00`) < new Date(`${bSeparado[1]}/${bSeparado[0]}/${bSeparado[2]} 00:00`)){
                return 1;
            }
            if(new Date(`${Number(aSeparado[1])}/${Number(aSeparado[0])}/${Number(aSeparado[2])} 00:00`) > new Date(`${bSeparado[1]}/${bSeparado[0]}/${bSeparado[2]} 00:00`)){
                return -1;
            }
            return 0;
        });

        return lembretes;
    }

    eventoFechar(){
        $('#modal_lembretes').on('hidden.bs.modal', function(){
            ModalLembrete.setIcone(0);
        });
    }

    formatar(texto){
        var limite = 25;

        if(texto.length >= limite){
            texto = texto.trim().substring(0, limite) + '...';
        }

        return texto;
    }
}

class Cliente{
    init(post){
        post = JSON.parse(post);

        var xml = Utilitarios.getXML(post.apol);
        var apol = this.getApolIdNome(xml);
        var todos = post.cadastrados.concat(apol);
        console.log(xml);
        Cliente.addDataList(todos);

        _clientes = todos;
    }

    getApolIdNome(xml){
        var ids = xml.getElementsByTagName('ID');
        var nomes = xml.getElementsByTagName('RazaoSocial');
        var compilado = new Array();

        for(var i=0; i<ids.length; i++){
            compilado.push({id: ids[i].innerHTML, origem: 'APOL', nome: nomes[i].innerHTML});
        }

        return compilado;
    }

    static getId(nome){
        for(var i=0; i<_clientes.length; i++){
            if(_clientes[i].nome == nome){
                return _clientes[i].id;
            }
        }

        return '';
    }

    static getInformacoes(informacoes){
        //informacoes = JSON.stringify({origem: 'apol', dados: '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><soap:Body><ObterEnvolvidoPorIDResponse xmlns="http://ld2.ldsoft.com.br/"><ObterEnvolvidoPorIDResult><ID>1038537</ID><DescontoINPI>false</DescontoINPI><Apelido>Abel e Ryff</Apelido><RazaoSocial>Abel e Ryff Moreira Produtos Naturais Ltda - Me</RazaoSocial><CNPJCPF>21061887000106</CNPJCPF><Pasta>atendimento@pap.com.br</Pasta><InscricaoMunicipal /><InscricaoEstadual /><HomePage /><TipoPessoa>juridica</TipoPessoa><ObjetoSocial /><Observacao /><Email /><NumeroRegistro /><Qualificacao /><Sigla /><Idioma>pt</Idioma><Endereco><EnvolvidoEndereco><idEndereco>1543083</idEndereco><Logradouro>Av. Getúlio Vargas, 766</Logradouro><Bairro>Menino Deus</Bairro><Cidade>Porto Alegre</Cidade><Estado>RS</Estado><CEP>90150-000</CEP><Pais>BR</Pais><Telefone /><Fax /><Principal>true</Principal><Correspondencia>true</Correspondencia><Faturamento>true</Faturamento><INPI>false</INPI></EnvolvidoEndereco></Endereco><Contato><EnvolvidoContato><ID>667357</ID><Nome>Sra. Carmen</Nome><Email>carmengehrke@hotmail.com</Email><RecebeInfoDespacho>false</RecebeInfoDespacho><Cargo /><Departamento /><Telefone /><Celular /><DataCadastro>2014-11-25T08:06:00</DataCadastro><Principal>true</Principal><Observacao /><RecebeModulo>0</RecebeModulo></EnvolvidoContato><EnvolvidoContato><ID>993071</ID><Nome>Consultor</Nome><Email>atendimento@pap.com.br</Email><RecebeInfoDespacho>false</RecebeInfoDespacho><Cargo /><Departamento /><Telefone /><Celular /><DataCadastro>2021-02-12T10:32:00</DataCadastro><Principal>false</Principal><Observacao /><RecebeModulo>0</RecebeModulo></EnvolvidoContato></Contato><DataRegistro>0001-01-01T00:00:00</DataRegistro><DataCadastro>2014-11-25T08:04:00</DataCadastro><DataManutencao>0001-01-01T00:00:00</DataManutencao><statusEnvolvido>E</statusEnvolvido><TiposDoEnvolvido><TipoDoEnvolvido><Id>3419</Id><Nome>Prospecção</Nome></TipoDoEnvolvido></TiposDoEnvolvido><Campo1 /><Campo2 /><Campo3 /></ObterEnvolvidoPorIDResult></ObterEnvolvidoPorIDResponse></soap:Body></soap:Envelope>'});
        //informacoes = JSON.parse(informacoes);

        var resultado = {};
        var excluir = '@pap.com';

        if(informacoes.origem == 'apol'){
            var xml = Utilitarios.getXML(informacoes.dados);
            var envolvidos = xml.getElementsByTagName('EnvolvidoContato');
            var cnpjCpf = xml.getElementsByTagName('CNPJCPF')[0].innerHTML;
            var tagsEndereco = ['Logradouro', 'Bairro', 'Cidade', 'CEP', 'Estado', 'Pais'];
            var contatos = {nome: new Array(), email: new Array(), telefone: new Array()};
            var endereco = '';

           for(var i=0; i<tagsEndereco.length; i++){
                var valor = xml.getElementsByTagName(tagsEndereco[i])[0].innerHTML + ', ';

                if(valor != ', '){ endereco += valor; }
           }

           for(var i=0; i<envolvidos.length; i++){
                var nome = envolvidos[i].getElementsByTagName('Nome')[0].innerHTML;
                var cargo = envolvidos[i].getElementsByTagName('Cargo')[0].innerHTML;
                var email = envolvidos[i].getElementsByTagName('Email')[0].innerHTML;
                var telefone = envolvidos[i].getElementsByTagName('Telefone')[0].innerHTML;
                var celular = envolvidos[i].getElementsByTagName('Celular')[0].innerHTML;

                if(email.indexOf(excluir) == -1){
                    contatos.nome.push(nome + ' ' + cargo);
                    contatos.email.push(email);
                    contatos.telefone.push(telefone + ' ' + celular);
                }
           }

           resultado.contato = contatos;
           resultado.cnpjcpf = cnpjCpf;
           resultado.endereco = endereco.substring(0, endereco.length - 2);

           return resultado;
        }

        return informacoes.dados;
    }

    static addDataList(clientes){
        var elemento = document.getElementById('nome_todos_clientes');

        clientes = ordenar(clientes);

        for(var i=0; i<clientes.length; i++){
            if(clientes[i].origem != 'APOL'){
                clientes[i].origem = '';
            }

            elemento.innerHTML = `<option value="${clientes[i].nome}">${clientes[i].origem}</option>` + elemento.innerHTML;
        }

        function ordenar(clientes){
            return clientes.sort(function(a, b){
                if(a.nome > b.nome){
                    return 1;
                }
                if(a.nome < b.nome){
                    return -1;
                }
                return 0;
            });
        }
    }
}

class Usuario{
    constructor(){
        this.elemento = document.getElementById('usuario_informacoes');
    }

    get(){
        return {email: this.elemento.innerText,
                id: this.elemento.dataset.id};
    }

    set(id, email){
        this.elemento.innerText = email;
        this.elemento.dataset.id = id;
    }
}

//iniciar informações do usuário
google.script.run.withFailureHandler().withSuccessHandler(function(usuario){
    usuario = JSON.parse(usuario);

    new Usuario().set(usuario.id, usuario.email);
}).getUsuario();

//iniciar informações clientes
google.script.run.withFailureHandler().withSuccessHandler(function(clientes){
    new Cliente().init(clientes);
}).getTodosClientes();
