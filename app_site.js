//parte das despesas com 
class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for(let i in this){
           if(this[i] == undefined || this[i] == '' || this[i] == null){
               return false
           }
        }
        return true
    }
}

class Bd{

    constructor(){
        let id = localStorage.getItem('id')
        if(id === null){
            localStorage.setItem('id', 0)
        }
    }

    getProximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }
    gravar(d){
        //
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros(){
        //array de despesas
        let despesas = []

        let id = localStorage.getItem('id')
        //recyuperar despesas cadasdtradas em local stor
        for(let i = 1; i <= id; i++){
            //recuperar despesa
            let despesa = JSON.parse(localStorage.getItem(i))
            
            //se esxiste indices removidos
            if(despesa === null){
                continue
            }
            despesa.id = i
            despesas.push(despesa)  
        }
        return despesas
    }
    pesquisar(despesa){
        
        let despesasFiltradas = []
        despesasFiltradas =  this.recuperarTodosRegistros()
        if(despesa.ano != ''){
           despesasFiltradas = despesasFiltradas.filter(f => f.ano == despesa.ano)
        }
        if(despesa.mes != ''){
           despesasFiltradas = despesasFiltradas.filter(f => f.mes == despesa.mes)
        }
        if(despesa.dia != ''){
            despesasFiltradas = despesasFiltradas.filter(f => f.dia == despesa.dia)
        }
        if(despesa.tipo != ''){
            despesasFiltradas = despesasFiltradas.filter(f => f.tipo == despesa.tipo)
         }
         if(despesa.descricao != ''){
            despesasFiltradas = despesasFiltradas.filter(f => f.descricao == despesa.descricao)
         }
         if(despesa.valor != ''){
            despesasFiltradas = despesasFiltradas.filter(f => f.valor == despesa.valor)
        }else {
            carregaListaDespesas()
        }
        return despesasFiltradas
    }
    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrarDespesa(){

    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(ano.value, 
        mes.value, 
        dia.value, 
        tipo.value, 
        descricao.value, 
        valor.value
    )
    if(despesa.validarDados()){
        bd.gravar(despesa)
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
        modal(2)
        //sucesso
    } else{
        //erro
        modal(1)
    }

}

function carregaListaDespesas(despesas = [], filtro = false){
    let tableDespesas = document.getElementById('table-despesas')
    
        if(tableDespesas){
            if(despesas.length == 0 && filtro == false){
                despesas = bd.recuperarTodosRegistros()
            }
            tableDespesas.innerHTML = ''
            //percorrer o array despesa
            despesas.map((d) =>{
                //tr
            
                let linha = tableDespesas.insertRow()
                //td
                linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
                switch(d.tipo){
                    case '1': d.tipo = 'Alimentação'
                        break
                    case '2': d.tipo = 'Educação'
                        break
                    case '3': d.tipo = 'Lazer'
                        break
                    case '4': d.tipo = 'Saúde'
                        break
                    case '5': d.tipo = 'Transporte'
                        break
                }
                linha.insertCell(1).innerHTML = d.tipo
                linha.insertCell(2).innerHTML = d.descricao
                linha.insertCell(3).innerHTML = d.valor

                //botao de exclusao
                let btn = document.createElement('button')
                btn.innerHTML = '<i class="fas fa-times"></i>'
                btn.id = `id_despesa_${d.id}`
                btn.classList.add('btn-delete')
                btn.onclick = function(){
                    let id = this.id.replace('id_despesa_', '')
                    modal(3)
                    bd.remover(id)
                    carregaListaDespesas()
                }
                linha.insertCell(4).append(btn)
                console.log(d)

            })

        }
    

}

function pesquisarDespesa(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
    bd.pesquisar(despesa)


    let tableDespesas = document.getElementById('table-despesas')
    
    if(tableDespesas){
        let despesas = bd.pesquisar(despesa)
        
        carregaListaDespesas(despesas, true)
    }
}



/*
----------------
Modal 
---------------
*/

modal = (vec) =>{
    const fundo = document.querySelector('.fundo')
    const modal = document.querySelector('.modal')
    const tituloModal = document.querySelector('.modal .modal-titulo')
    const textoModal = document.querySelector('.modal .modal-desc')
    const btnModal = document.querySelector('.modal .modal-close')
    modal.classList.toggle('active1')
    fundo.classList.toggle('active1')
    if(vec == 1){
        tituloModal.innerHTML = 'Erro na gravação'
        tituloModal.style.borderBottom = '1px solid red'
        textoModal.innerHTML = 'Algum campo pode estar vazio'
        btnModal.innerHTML = 'Voltar e corrigir'
        tituloModal.style.color = 'red'
        btnModal.style.background = 'red'
        modal.style.border = '1px solid red'

    }else if(vec == 2){
        tituloModal.innerHTML = 'Registro inserido com sucesso'
        tituloModal.style.borderBottom = '1px solid #00ad15'
        textoModal.innerHTML = 'Despesa foi cadastrada com sucesso!'
        btnModal.innerHTML = 'Voltar'
        tituloModal.style.color = '#00ad15'
        btnModal.style.background = '#00ad15'
        modal.style.border = '1px solid #00ad15'
    }
    else if(vec == 3){
        tituloModal.innerHTML = 'Despesa Removida'
        tituloModal.style.borderBottom = '1px solid #007bff'
        textoModal.innerHTML = 'Despesa removida com sucesso'
        btnModal.innerHTML = 'Ok'
        tituloModal.style.color = '#007bff'
        btnModal.style.background = '#007bff'
        modal.style.border = '1px solid #007bff'
    }

}

/*
----------
-------------------------------------------
-------------PARTE-VISUAL------------------
-------------------------------------------
----------
*/
//ano no formulario
function formAno(){
    var date = new Date()
    var dAno = date.getFullYear()
    dAno = dAno + 5
    let formAno = document.getElementById('ano')
    for(let i = 2018; i < dAno; i++){
        formAno.innerHTML += `<option value="${i}">${i}</option>`
    }
}
formAno()

//menu mobile
function mobileMenu(){
    const nav = document.querySelector('.nav-mobile')
    nav.classList.toggle('active')
}
/*
<button id="voltar" onclick="carregaListaDespesas()">
    <i class="fas fa-undo-alt"></i>
</button>

*/
carregar = (num) =>{
    //const body = document.body
    const consulta = document.querySelector('.consulta')
    const texto = document.querySelector('#titulo .center h1')
    const i = document.querySelector('.form2 #pesquisar')
    const voltar = document.querySelector('.form2 .center')
    const nav = document.getElementById('_consulta')
    const nav2 = document.getElementById('_cadastro')
    const vecVoltar = document.getElementById('voltar')
    if(num == 1){
        mobileMenu()
        //icone de busca
        i.innerHTML = '<i class="fas fa-search"></i>'
        //titulo
        texto.innerHTML = `Consulta de despesas`
        //mudar cor nav menu
        
        nav.style.color = 'white'
        nav2.style.color = 'rgba(255, 255, 255, 0.589)'
        consulta.innerHTML = ``
        consulta.innerHTML += `
            <div class="center table-consulta">
                <table>
                    <thead>
                        <tr>
                        <th>Data</th>
                        <th>Tipo</th>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th class="delete"></th>
                        </tr>
                    </thead>
                    <tbody id='table-despesas'>
                        
                    </tbody>
                </table>
            </div>
        `
        //att do button
        i.setAttribute('onclick', 'pesquisarDespesa()')
        
        if(!vecVoltar){
            voltar.innerHTML += `
                <button id="voltar" onclick="carregaListaDespesas()">
                        <i class="fas fa-undo-alt"></i>
                </button>
                `
        }
        
    }
    const tableConsulta = document.querySelector('.table-consulta')
    if(num == 0){
        if(tableConsulta){
            tableConsulta.remove()
        }
        mobileMenu()
        i.innerHTML = '<i class="fas fa-plus"></i>'
        texto.innerHTML = 'Registro de despesa'
        nav2.style.color = 'white'
        nav.style.color = 'rgba(255, 255, 255, 0.589)'
        if(vecVoltar){
            vecVoltar.remove()
        }
        //att button
        i.setAttribute('onclick', 'cadastrarDespesa()')
       
    }
}


