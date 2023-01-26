const cardsWindow = document.querySelector('#cards-window');
const nomeUsuarioh2 = document.querySelector("#nome-usuario");

fetch('../../data/user-info', {method: 'GET'})
.then(response => response.json()).then((userData) => {
    
    if(userData.Credenciais == "Inválidas"){
        alert("Credenciais inválidas. Por favor, refaça o login.")
        document.cookie = "userID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "userps=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/login";
    } else {
        console.log(userData);

        const totalCartas = 8;
        const nomeUsuario = userData[0].nome;
        const nomeCartas = [];
        
        for(let i = 0; i < userData[1].length; i++){
            nomeCartas[userData[1][i].idCarta] = userData[1][i].nomeCarta
        }

        console.log(nomeCartas)

        let cartasUsuarios = []
        userData[1].map(item => cartasUsuarios.push(item.idCarta));
                
        
        nomeUsuarioh2.innerHTML = nomeUsuario;
        
        for(let i = 1; i <= totalCartas; i++){
            cardsWindow.innerHTML += `
                <div class='card' id='card-${i}'>
                    <h3 class='titulo-carta' id='titulo-carta-${i}'>?????</h3>
                </div>
            `;
            
            if(cartasUsuarios.includes(i)){
                const element = document.querySelector(`#card-${i}`);
                element.style.backgroundColor = 'green';
                document.querySelector(`#titulo-carta-${i}`).innerHTML = `${nomeCartas[i]}`
            }
        }
    }
})

function SorteiaCarta(){
    fetch('../../data/carta', {method: 'GET'})
    .then(response => response.json()).then((cartas) => {
        console.log(cartas)
        fetch('../../data/user-info', {method: 'GET'})
        .then(response => response.json()).then((userData) => {
            atualizaCartas(userData)
        })
    })
}

function atualizaCartas(userData){
    const totalCartas = 8;
    cardsWindow.innerHTML = ``;
    let cartasUsuarios = [];
    const nomeCartas = [];
    for(let i = 0; i < userData[1].length; i++){
        nomeCartas[userData[1][i].idCarta] = userData[1][i].nomeCarta
    }
    userData[1].map(item => cartasUsuarios.push(item.idCarta));

    for(let i = 1; i <= totalCartas; i++){
        cardsWindow.innerHTML += `
            <div class='card' id='card-${i}'>
                <h3 class='titulo-carta' id='titulo-carta-${i}'>?????</h3>
            </div>
        `;
        
        if(cartasUsuarios.includes(i)){
            const element = document.querySelector(`#card-${i}`);
            element.style.backgroundColor = 'green';
            document.querySelector(`#titulo-carta-${i}`).innerHTML = `${nomeCartas[i]}`
        }
    }
}