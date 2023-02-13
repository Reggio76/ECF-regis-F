var reponse = document.querySelector("#reponse");
var urlApi = "";
$("#rechercher").click(function (e) {
  titre = document.querySelector("#nomFilm").value;
  annee = document.querySelector("#annee").value;
  filtre = document.querySelector("#filtre").value;

  // on stoke l'url de la'api dans une variable avec la valeur du titre
  urlApi = `http://omdbapi.com/?i=tt3896198&apikey=9b79ab3c&s=${titre}`;
  // on stoke le numéro de la page, par défaut, il sera égal à 1
  //var page = 1;
  if (annee) {
    urlApi += `&y=${annee}`;
  }
  if (filtre) {
    switch (filtre) {
      case "1":
        urlApi += `&type="movie"`;
        break;
      case "2":
        urlApi += `&type="series"`;
        break;
      case "3":
        urlApi += `&type="episode"`;
        break;
      default:
        break;
    }
  }

  chercherApi(urlApi);
});

//fonction pour afficher les films contenu dans l'objet data
function afficherFilm(data) {
  for (i = 0; i < data.Search.length; i++) {
    //dans information on ecrit les lignes html a afficher
    var information = "";
    //on va stoker le poster dans la variable image
    var image;
    //si il existe, sinon on mets l'image imgND.jpg
    image =
      data.Search[i].Poster === "N/A"
        ? `<img src="assets/img/imgND.jpg">`
        : `<img src="${data.Search[i].Poster}">`;

    information = `
      <div class="posterFilm">
     
      ${image}
      <h5>${data.Search[i].Title}</h5>
      <p>Année : ${data.Search[i].Year}</p>
  
      </div>`;
    reponse.innerHTML += information;
  }
}
// PAGINATION
function creerPagination(pages) {
  $("#pagination").empty();
  let pagination = document.querySelector("#pagination");
  ulPage = document.createElement("ul");
  ulPage.classList.add("pagination");
  for (let j = 1; j < pages; j++) {
    let liPage = document.createElement("li");
    liPage.classList.add("page-item");
    let aPage = document.createElement("a");
    aPage.classList.add("page-link");
    aPage.href = j;
    aPage.textContent = j;
    aPage.addEventListener("click", function (e) {
      e.preventDefault();
      chercherApi(`${urlApi}&page=${this.textContent}`);
    });
    liPage.append(aPage);
    ulPage.append(liPage);
  }
  pagination.append(ulPage);
}
//fonction qui lance la requere Ajax vers l'url en paramètre
function chercherApi(urlApi) {
  // supprimer les résultats précédents pour ne pas avoir à rafraichir tout le temps si on modifie la recherche
  $("#reponse").empty();
  //on lance la requete sur l'API avec l'Url en variable
  $.ajax({
    method: "GET",

    url: urlApi,
    statusCode: {
      404: () => {
        alert("Cette page n'existe plus!");
      },
    },
    //si la requete marche
  }).then(function (data, textStatus, jqXHR) {
    //si le film est introuvable on affiche un message
    if (data.Response === "False") {
      reponse.innerHTML = `  <div class="posterFilm">Votre recherche n'a pas abouti </div>`;
    } else {
      //sinon on lance la fonction afficher(data) pour afficher les données des films trouvés
      console.log(data);
      afficherFilm(data);

      // calculer le nombre de pages dont on aura besoin => en parametre.

      creerPagination(Math.floor(data.totalResults / data.Search.length));
    }
  }),
    function (jqXHR, textStatus, errorThrown) {
      console.log("error");
    };
}
