class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for(let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }
}

class Bd {
    constructor () {
        let id = localStorage.getItem('id')
            if (id === null) {
                localStorage.setItem('id', 0)
            }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravarDespesa(d) {
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify (d))
        localStorage.setItem('id', id)
    }

    getListaDespesas() {
        let regCount = localStorage.getItem('id')
        let resData = []
        for (let count = 0; count <= regCount; count++) {
            if (localStorage.getItem(count) === null) {
                continue
            }
            
            let dataParse = JSON.parse(localStorage.getItem(count))
            dataParse.id = count
            resData.push(dataParse)
            
        }
        console.log(resData);
        return resData
    }

    pesquisar(despesa) {
        let resData = []
        resData = this.getListaDespesas()
        
        if (despesa.ano != '') {
            resData = resData.filter(function(d) {return d.ano == despesa.ano})
        }
        if (despesa.mes != '') {
            resData = resData.filter(function(d) {return d.mes == despesa.mes})
        }
        if (despesa.dia != '') {
            resData = resData.filter(function(d) {return d.dia == despesa.dia})
        }
        if (despesa.tipo != '') {
            resData = resData.filter(function(d) {return d.tipo == despesa.tipo})
        }
        if (despesa.descricao != '') {
            resData = resData.filter(function(d) {return d.descricao == despesa.descricao})
        }
        if (despesa.valor != '') {
            resData = resData.filter(function(d) {return d.valor == despesa.valor})
        }

        return resData
        
    }
}

let bd = new Bd ()

//Disparada no onload de consultas
function carregarDadosConsulta(resData = []) {
    if (resData.length == 0) {
    resData = bd.getListaDespesas()
    }
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''
    resData.forEach(function(d) {
        let linhaDados = listaDespesas.insertRow()
        linhaDados.insertCell(0).innerHTML = d.dia + '/' + d.mes + '/' + d.ano
            switch(d.tipo) {
                case '1': 
                    d.tipo = 'Alimentação'
                        break;
                case '2': 
                    d.tipo = 'Educação' 
                        break;
                case '3': 
                    d.tipo = 'Lazer'
                        break;
                case '4': 
                    d.tipo = 'Saúde'
                        break;
                case '5': 
                    d.tipo = 'Transporte'
                        break;
                default:
                    alert('Erro')
            }
        linhaDados.insertCell(1).innerHTML = d.tipo
        linhaDados.insertCell(2).innerHTML = d.descricao
        linhaDados.insertCell(3).innerHTML = 'R$ '+ d.valor

        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.onclick = function () {
            alertModal ()
            localStorage.removeItem(d.id)
            }
            
        linhaDados.insertCell(4).append(btn)
        
    })
}

//Disparada no botão
function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let resData = bd.pesquisar(despesa)

    carregarDadosConsulta(resData)
}

function cadastrarDespesa () {
    
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value, 
        mes.value, 
        dia.value, 
        tipo.value, 
        descricao.value, 
        valor.value
    )

    function limparCampos () {
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
    }

    function successModal () {
        document.getElementById('modalLabel').innerHTML = 'Gravação efetuada com sucesso'
        document.getElementById('modalHeader').className = 'modal-header text-success'
        document.getElementById('modalBody').innerHTML = 'Dados preenchidos corretamente!'
        document.getElementById('btnModal').innerHTML = 'Voltar'
        document.getElementById('btnModal').className = 'btn btn-success'
        $('#processoGravacao').modal('show')
    }

    function errorModal () {
        document.getElementById('modalLabel').innerHTML = 'Erro de gravação'
        document.getElementById('modalHeader').className = 'modal-header text-danger'
        document.getElementById('modalBody').innerHTML = 'Todos os campos precisam ser preenchidos!'
        document.getElementById('btnModal').innerHTML = 'Voltar e corrigir!'
        document.getElementById('btnModal').className = 'btn btn-danger'
        $('#processoGravacao').modal('show')
    }

    if (despesa.validarDados()) {
        bd.gravarDespesa(despesa)
        successModal()
        limparCampos()
    } else {
        errorModal()
    }
}

function alertModal () {
    document.getElementById('modalLabel').innerHTML = 'Exclusão de dados'
    document.getElementById('modalHeader').className = 'modal-header text-warning'
    document.getElementById('modalBody').innerHTML = 'O registro selecionado foi deletado!'
    document.getElementById('btnModal').innerHTML = 'Voltar'
    document.getElementById('btnModal').className = 'btn btn-warning'
    $('#processoRemocao').modal('show')
}
