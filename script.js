document.addEventListener("DOMContentLoaded", () => {
    const btoes = document.querySelectorAll(".grid button");
    const resultado = document.getElementById("number_display");

    let numeroAtual = "";
    let operador = null;
    let primeirOperando = null;
    let resetar = false;

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

            primeirOperando = parseFloat(numeroAtual.replace(",","."));
            numeroAtual = ""
        }

        operador = novoOperador;
    }

    function calcular(){
        if(operador === null || primeirOperando === null) return;
        let segundoOperando = parseFloat(numeroAtual.replace(",","."));
        let valorResultado;

        switch(operador){
            case "+":
                valorResultado = primeirOperando + segundoOperando;
                break;

            case "-":
                valorResultado = primeirOperando - segundoOperando;
                break;

            case "U+00D7":
                valorResultado = primeirOperando * segundoOperando;
                break;

            case "U+00F7":
                valorResultado = primeirOperando / segundoOperando;
                break;

            case "x²": 
                valorResultado = segundoOperando.toString()**2;
                break;

            case "U+216F"+"U+2083":
                valorResultado = 1 / segundoOperando;
                break;

            case "U+221A"+"x":
                valorResultado = Math.sqrt(segundoOperando);
                break;
            
            default:
                return;    
        }

        if(valorResultado.toString().split(".")[1]?.length > 5){
            numeroAtual = parseFloat(valorResultado.toFixed(5)).toString();
        } else {
            numeroAtual = valorResultado.toString();
        }

        operador = null;
        primeirOperando = null;
        resetar = true;
        atualizarResultado();
    }

    function limparCalculadora(){
        numeroAtual = "";
        primeirOperando = "";
        operador = null;
        atualizarResultado(true);
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
            } else if(["+","-","U+00D7","U+00F7","x²","U+216F"+"U+2083","U+221A"+"x"].includes(textoBtao)){
                definirOperador(textoBtao);
            } else if(textoBtao === "="){
                calcular();
            } else if(textoBtao === "C"){
                limparCalculadora();
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
