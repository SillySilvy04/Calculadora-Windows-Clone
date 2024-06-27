document.addEventListener("DOMContentLoaded", () => {
    const btoes = document.querySelectorAll(".grid button");
    const btoes_memoria = document.querySelectorAll(".memoria button");
    const resultado = document.getElementById("number_display");
    const aux_bar = document.getElementById("aux_bar");

    let numeroAtual = "";
    let operador = null;
    let primeirOperando = null;
    let resetar = false;
    let ehResultado = false;

    let historico_btao = document.getElementById("historico");
    let memoria_btao = document.getElementById("memoria");
    let historico_painel = document.getElementById("historico_painel");
    let memoria_painel = document.getElementById("memoria_painel");
    let lixeira_historico = document.getElementById("resetar_historico");
    let lixeira_memoria = document.getElementById("resetar_memoria");
    let btoes_desativaveis = document.querySelectorAll(".desativavel");
    
    let texto_padrao_historico = document.getElementById("texto_padrao_historico");
    texto_padrao_memoria = document.getElementById("texto_padrao_memoria");
    let div_resultado = document.getElementById("resultados");
    let div_memoria = document.getElementById("memorias");

    historico_btao.addEventListener("click", () => {
        if(memoria_btao.classList.contains("selecionado-MH")){
            memoria_btao.classList.remove("selecionado-MH");
            historico_btao.classList.add("selecionado-MH");
            historico_painel.classList.remove("hidden");
            memoria_painel.classList.add("hidden")
        }
    });

    memoria_btao.addEventListener("click", () => {
        if(historico_btao.classList.contains("selecionado-MH")){
            historico_btao.classList.remove("selecionado-MH");
            memoria_btao.classList.add("selecionado-MH");
            memoria_painel.classList.remove("hidden");
            historico_painel.classList.add("hidden");
        }
    });

    const evento_igual = new Event("eventoIgual");

    lixeira_historico.addEventListener("click", () => {
        div_resultado.innerHTML = "";
        texto_padrao_historico.classList.remove("hidden");
        lixeira_historico.classList.add("hidden");
    });

    document.addEventListener("eventoIgual", () => {

        texto_padrao_historico.classList.add("hidden");
        lixeira_historico.classList.remove("hidden");

        const historicoDiv = document.createElement("div");
        historicoDiv.className = "div_historico";
        
        const registro = document.createElement("p");
        registro.className = "texto_historico"
        registro.textContent = aux_bar.innerText+" "+resultado.innerText;

        const btao_deletar = document.createElement("button");
        btao_deletar.className = "btao_deletar_historico"
        btao_deletar.textContent = "Excluir";
        btao_deletar.addEventListener("click", () => {
            div_resultado.removeChild(historicoDiv);
            if(div_resultado.children.length === 0){
                texto_padrao_historico.classList.remove("hidden");
                lixeira_historico.classList.add("hidden");
            }
        });

        historicoDiv.appendChild(registro);
        historicoDiv.appendChild(btao_deletar);
        div_resultado.appendChild(historicoDiv);

    });

    function disableButtons() {
        btoes_desativaveis.forEach((button) => {
            button.disabled = true;
        });
    }

    function enableButtons() {
        btoes_desativaveis.forEach((button) => {
            if(div_memoria.children.length === 0 && (button.innerText === "MC" || button.innerText === "MR")){
                button.disabled = true;
            }else{
                button.disabled = false;
            }
            
        });
    }

    function atualizarResultado(limpar = false){
        resultado.innerText = limpar ? 0 : numeroAtual.replace(".",",");
    }

    function adicionarDigito(digito){
        if (digito === "," && (numeroAtual.includes(",") || !numeroAtual)) return;

        if(resetar){
            numeroAtual = digito;
            resetar = false;
        } else {
            numeroAtual += digito;
        }

        atualizarResultado();
    }

    function definirOperador(novoOperador){
        if(numeroAtual){
            calcular();

            if(novoOperador === "-" || novoOperador === "+" || novoOperador === "×" || novoOperador === "÷"){
                aux_bar.innerText = numeroAtual+" "+novoOperador;
            } else if(novoOperador === "x²"){
                aux_bar.innerText = "sqr("+numeroAtual+")";
            } else if(novoOperador === "⅟ₓ"){
                aux_bar.innerText = "1/("+numeroAtual+")";
            } else if(novoOperador === "√x"){
                aux_bar.innerText = "sqrt("+numeroAtual+")";
            }
            primeirOperando = parseFloat(numeroAtual.replace(",","."));
            numeroAtual = ""
        }

        operador = novoOperador;
    }

    async function calcular(){
        let segundoOperando;
        let valorResultado;
        let disparoEvento = false;
        let atualizarResultado1 = false;
        if(operador === null || primeirOperando === null) return;
        if(numeroAtual){
            segundoOperando = parseFloat(numeroAtual.replace(",","."));
        }else{
            segundoOperando = primeirOperando;
        }
        

        switch(operador){
            case "+":
                valorResultado = primeirOperando + segundoOperando;
                break;

            case "-":
                valorResultado = primeirOperando - segundoOperando;
                break;

            case "×":
                valorResultado = primeirOperando * segundoOperando;
                break;

            case "÷":
                valorResultado = primeirOperando / segundoOperando;
                break;

            case "x²": 
                valorResultado = primeirOperando**2;
                break;

            case "⅟ₓ":
                valorResultado = 1 / primeirOperando;
                break;

            case "√x":
                valorResultado = Math.sqrt(primeirOperando);
                break;
            
            default:
                return;    
        }

        if(testarErro(primeirOperando,segundoOperando,operador)){
            if(valorResultado.toString().split(".")[1]?.length > 5){
                numeroAtual = parseFloat(valorResultado.toFixed(5)).toString();
            } else {
                numeroAtual = valorResultado.toString();
            }
        }

        if(!["x²", "⅟ₓ", "√x"].includes(operador)){
            aux_bar.innerText = aux_bar.innerText+" "+segundoOperando+" ="
            disparoEvento = true;
        }

        atualizarResultado1 = testarErro(primeirOperando,segundoOperando,operador);
        console.log(atualizarResultado)

        operador = null;
        primeirOperando = null;
        resetar = true;
        if(atualizarResultado1){
            atualizarResultado();
        }
        if(disparoEvento && atualizarResultado1){
            document.dispatchEvent(evento_igual);
        }
    }

    function limparCalculadora(){
        numeroAtual = "";
        primeirOperando = "";
        operador = null;
        aux_bar.innerText = "";
        enableButtons();
        atualizarResultado(true);
    }

    function testarErro(primeirOperando,segundoOperando,operador){
        if(segundoOperando === 0 && operador === "÷"){
            console.log("1")
            resultado.innerText = "Não é possível dividir por zero";
            aux_bar.innerText = "";
            console.log("1")
            console.log("1")
            disableButtons();
            return false;
        }else if(primeirOperando < 0 && operador === "√x"){
            resultado.innerText = "Entrada inválida";
            aux_bar.innerText = "";
            disableButtons();
            return false;
        }else if(primeirOperando === 0 && operador === "⅟ₓ"){
            resultado.innerText = "Não é possível dividir por zero";
            aux_bar.innerText = "";
            disableButtons();
            return false;
        }
        return true;
    }

    function limparDisplay(){
        if(!ehResultado){
            numeroAtual = "";
            atualizarResultado(true);
        }else{
            limparCalculadora()
        }
    }

    function definirPorcentagem(){
        let resultado = parseFloat(numeroAtual)/100;

        if(["+", "-"].includes(operador)){
            resultado = resultado * (primeirOperando || 1);
        }

        if(resultado.toString().split(".")[1]?.length < 5){
            resultado = resultado.toFixed(5).toString();
        }

        numeroAtual = resultado.toString();
        atualizarResultado();
    }

    function memorySave(){
        texto_padrao_memoria.classList.add("hidden");
        lixeira_memoria.classList.remove("hidden");

        const memoriaDiv = document.createElement("div");
        memoriaDiv.className = "div_memoria";

        const registro = document.createElement("p");
        registro.className = "texto_memoria";
        registro.textContent = resultado.innerText;

        const btao_deletar = document.createElement("button");
        btao_deletar.className = "btao_memoria";
        btao_deletar.textContent = "MC";
        btao_deletar.addEventListener("click", () => {
            div_memoria.removeChild(memoriaDiv);
            if(div_memoria.children.length === 0){
                texto_padrao_memoria.classList.remove("hidden");
                lixeira_memoria.classList.add("hidden");
            }
        });

        const btao_soma = document.createElement("button");
        btao_soma.className = "btao_memoria";
        btao_soma.textContent = "M+";
        btao_soma.addEventListener("click", () => {
            somarMemoria(memoriaDiv);
        });

        const btao_subtracao = document.createElement("button");
        btao_subtracao.className = "btao_memoria";
        btao_subtracao.textContent = "M-";
        btao_subtracao.addEventListener("click", () => {
            subtrairMemoria(memoriaDiv);
        });

        const div_botoes = document.createElement("div");
        div_botoes.className = "div_botoes_memoria";

        memoriaDiv.appendChild(registro);
        div_botoes.appendChild(btao_deletar);
        div_botoes.appendChild(btao_soma);
        div_botoes.appendChild(btao_subtracao);
        memoriaDiv.appendChild(div_botoes);
        div_memoria.appendChild(memoriaDiv);
        numeroAtual = "";
        primeirOperando = "";
        operador = null;
        aux_bar.innerText = "";
    }

    function memoryClear(){
        div_memoria.innerHTML = "";
        texto_padrao_memoria.classList.remove("hidden");
        lixeira_memoria.classList.add("hidden");
    }

    function memoryRecall(){
        const divs = div_memoria.querySelectorAll(".div_memoria");
        const ultimaDiv = divs[divs.length - 1];
        console.log(ultimaDiv);
        const texto = ultimaDiv.querySelector("p");
        console.log(texto);

        numeroAtual = texto.innerText;
        atualizarResultado(); 
    }

    function somarMemoria(elemento = false){
        var divs, ultimaDiv, texto, valor, resultado1;
        if(!elemento){
            divs = div_memoria.querySelectorAll(".div_memoria");
            ultimaDiv = divs[divs.length - 1];
        }else{
            ultimaDiv = elemento
        }
        texto = ultimaDiv.querySelector("p");
        valor = parseFloat(texto.innerText.replace(",","."));
        console.log(resultado.innerText)
        if(resultado.innerText){
            resultado1 = parseFloat(resultado.innerText.replace(",","."));
        }else{
            resultado1 = 0;
        }
        resultado1 = resultado1 + valor;
        texto.innerText = resultado1.toString().replace(".",",");

        numeroAtual = "";
        primeirOperando = "";
        operador = null;
        aux_bar.innerText = "";
    }

    function subtrairMemoria(elemento = false){
        var divs, ultimaDiv, texto, valor, resultado1;
        if(!elemento){
            divs = div_memoria.querySelectorAll(".div_memoria");
            ultimaDiv = divs[divs.length - 1];
        }else{
            ultimaDiv = elemento
        }
        texto = ultimaDiv.querySelector("p");
        valor = parseFloat(texto.innerText.replace(",","."));
        console.log(resultado.innerText)
        if(resultado.innerText){
            resultado1 = parseFloat(resultado.innerText.replace(",","."));
        }else{
            resultado1 = 0;
        }
        resultado1 = valor - resultado1;
        texto.innerText = resultado1.toString().replace(".",",");

        numeroAtual = "";
        primeirOperando = "";
        operador = null;
        aux_bar.innerText = "";
    }

    btoes.forEach((btao) => {
        btao.addEventListener("click", () => {
            const textoBtao = btao.innerText;
            if(/^[0-9]+$/.test(textoBtao)){
                adicionarDigito(textoBtao);
                enableButtons();
            } else if(["+","-","×", "÷"].includes(textoBtao)){
                ehResultado = false;
                definirOperador(textoBtao);
            }else if(["x²", "⅟ₓ", "√x"].includes(textoBtao)){
                ehResultado = false;
                definirOperador(textoBtao);
                calcular();
            } else if(textoBtao === "="){
                ehResultado = true;
                calcular();
            } else if(textoBtao === "C"){
                limparCalculadora();
            }else if(textoBtao === "CE"){
                limparDisplay();
            } else if(textoBtao === "+/-"){
                numeroAtual = (
                    parseFloat(numeroAtual || primeirOperando) * -1
                ).toString();
                atualizarResultado();
            } else if(textoBtao === "%"){
                definirPorcentagem();
            }
        });
    });
    btoes_memoria.forEach((btao) => {
        btao.addEventListener("click", () => {
            const textoBtao = btao.innerText;
            if(textoBtao === "MC"){
                memoryClear();
            } else if(textoBtao === "MR"){
                memoryRecall();
            } else if(textoBtao === "MS"){
                memorySave();
            } else if(textoBtao === "M+"){
                somarMemoria();
            } else if(textoBtao === "M-"){
                subtrairMemoria();
            }
            enableButtons();
        });
    });
});

