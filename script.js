document.addEventListener("DOMContentLoaded", () => {
    const btoes = document.querySelectorAll(".grid button");
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

    let texto_padrao_historico = document.getElementById("texto_padrao_historico");
    let div_resultado = document.getElementById("resultados");

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

    document.addEventListener("eventoIgual", () => {

        texto_padrao_historico.classList.add("hidden");

        const historicoDiv = document.createElement("div");
        historicoDiv.className = "div_historico";
        
        const registro = document.createElement("p");
        registro.className = "texto_historico"
        registro.textContent = aux_bar.innerText+" "+resultado.innerText;

        const btao_deletar = document.createElement("button");
        btao_deletar.className = "btao_deletar_historico"
        btao_deletar.textContent = "deletar";
        btao_deletar.addEventListener("click", () => {
            div_resultado.removeChild(historicoDiv);
            if(div_resultado.children.length === 0){
                texto_padrao_historico.classList.remove("hidden");
            }
        });

        historicoDiv.appendChild(registro);
        historicoDiv.appendChild(btao_deletar);
        div_resultado.appendChild(historicoDiv);

    });

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

            aux_bar.innerText = numeroAtual+" "+novoOperador;
            primeirOperando = parseFloat(numeroAtual.replace(",","."));
            numeroAtual = ""
        }

        operador = novoOperador;
    }

    function calcular(){
        let segundoOperando;
        let valorResultado;
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

        if(valorResultado.toString().split(".")[1]?.length > 5){
            numeroAtual = parseFloat(valorResultado.toFixed(5)).toString();
        } else {
            numeroAtual = valorResultado.toString();
        }

        aux_bar.innerText = aux_bar.innerText+" "+segundoOperando+" ="

        operador = null;
        primeirOperando = null;
        resetar = true;
        atualizarResultado();
        document.dispatchEvent(evento_igual);
    }

    function limparCalculadora(){
        numeroAtual = "";
        primeirOperando = "";
        operador = null;
        aux_bar.innerText = "";
        atualizarResultado(true);
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

    btoes.forEach((btao) => {
        btao.addEventListener("click", () => {
            const textoBtao = btao.innerText;
            if(/^[0-9]+$/.test(textoBtao)){
                adicionarDigito(textoBtao);
            } else if(["+","-","×", "÷","x²","⅟ₓ","√x"].includes(textoBtao)){
                ehResultado = false;
                definirOperador(textoBtao);
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
});