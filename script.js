function alterarValor(novoValor){
    var display = document.getElementById("number_display");
    if(display.textContent == "0"){
        display.textContent = "";
    }
    display.textContent = document.getElementById("number_display").textContent.toString() + novoValor;
}

function removerUltimo(){
    var display = document.getElementById("number_display");
    display.textContent = document.getElementById("number_display").textContent.toString().slice(0,-1);
    if(display.textContent === ""){
        display.textContent = "0";
    }
}