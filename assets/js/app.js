var films = [
  { name: "Deadpool", years: 2016, authors: "Tim Miller" },
  { name: "Spiderman", years: 2002, authors: "Sam Raimi" },
  { name: "Scream", years: 1996, authors: "Wes Craven" },
  { name: "It: chapter 1", years: 2019, authors: "Andy Muschietti" },
];
var detail = document.querySelector("#details");
var filmsTab = films; //on fait un nouveau tableau avec les données de films
var filmsTabClasse = [];
var filmsTabClasse2 = [];

const ajouter = document.querySelector("#ajouter");
const ajouterFilm = document.querySelector("#ajouterFilm");
const selectTri = document.querySelector("#filtre");

//on affiche les données du tableau filmsTab via la fonction afficherListe
afficherListe(filmsTab);
ajouter.addEventListener("click", (e) => {
  ajouterFilm.classList.remove("hidden");
  e.preventDefault();
  //on efface les messages d'erreurs
  effacerMssErr();
  // on efface les anciens inputs
  const inputs = document.querySelectorAll("input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = "";
  }
});

const enregistrer = document.querySelector("#enregistrer");
enregistrer.addEventListener("click", (e) => {
  e.preventDefault();

  ajouterFilm.classList.remove("add");
  const nomFilm = document.querySelector("#nomFilm").value;
  const annee = document.querySelector("#annee").value * 1;
  const nomReal = document.querySelector("#nomReal").value;
  const messageErrs1 = document.querySelector("#small1");
  const messageErrs2 = document.querySelector("#small2");
  const messageErrs3 = document.querySelector("#small3");
  // verification entrée film
  //si erreur, on affiche les small sous les input avec message
  //et selon l'erreur on met le message en gras et rouge
  if (motLenght(nomFilm) < 2) {
    afficherMssErr();
    messageErrs1.classList.add("erreur");
  }
  if (annee < 1900 || annee > anneeCourante()) {
    afficherMssErr();
    messageErrs2.classList.add("erreur");
  }
  if (motLenght(nomReal) < 5) {
    afficherMssErr();
    messageErrs3.classList.add("erreur");

    //sinon on ajoute le nouvel objet dans le tableau filmsTab
  } else {
    filmsTab.push({
      name: `${majuscPrem(nomFilm)}`,
      years: `${annee}`,
      authors: `${majuscPrem(nomReal)}`,
    });
    ajouterFilm.classList.add("hidden");
    //par défaut il s'affiche en bas du tableau
    //donc avant on remet la selection du tri à 0
    selectTri.value = 0;
    afficherListe(filmsTab);
  }
});

//fonction pour afficher les message d'erreur
function afficherMssErr() {
  const messageErrs = document.querySelectorAll("#ajouterFilm small");

  messageErrs.forEach((messageErr) => {
    messageErr.style.display = "block";
  });
}

//fonction pour effacer les message d'erreur
function effacerMssErr() {
  const messageErrs = document.querySelectorAll("#ajouterFilm small");

  messageErrs.forEach((messageErr) => {
    messageErr.style.display = "none";
  });
}
//fonction qui retourne la premiere lettre du nom en majuscule
function majuscPrem(nom) {
  return nom[0].toUpperCase() + nom.slice(1);
}

//fonction qui compte la longueur d'un input
function motLenght(mot) {
  return mot.length;
}
//fonction pour supprimer un objet du tableau grace a slice et a l'index du data-index-number
function supprimerFilm(index) {
  filmsTab.splice(index, 1);
  afficherListe(filmsTab);
}
//la fonction afficherListe prendra en parametre le tableau
//
function afficherListe(film) {
  // on efface tout dans la div détail pour éviter de dupliquer les données
  detail.innerHTML = "";
  //on fait une boucle dans le tableau de film
  for (i = 0; i < film.length; i++) {
    var information = "";
    //a chaque tour on affiche le html de l'objet i dans la variable information
    information = `<tr><td>${film[i].name}</td><td>${film[i].years}</td><td>${film[i].authors}</td>
        <td><button class="btn btn-danger" data-index-number="${i}">Supprimer</button></td></tr>`;
    //on ajoute chaque ligne de l'onjet i dans la div détail
    detail.innerHTML += information;
  }

  //pour supprimer un film du tableau on fait une boucle forEach sur les boutons supprimer

  const supButtons = document.querySelectorAll(".btn-danger");
  supButtons.forEach((supButton) => {
    supButton.addEventListener("click", function () {
      //on affiche une alerte pour confirmer via la librairie sweatAlert2
      Swal.fire({
        title: "Etes-vous sur de vouloir supprimer ce film?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Oui",
        denyButtonText: `Non`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire("Supprimé!", "", "success");
          //Si confirmé, on sauvergarde l'index de l'objet via le data-index-number du html
          const index = supButton.dataset.indexNumber;
          //on appelle la fonction supprimer() à l'index de l'objet en paramètre
          supprimerFilm(index);
        } else if (result.isDenied) {
          Swal.fire("Film non supprimé", "", "error");
        }
      });
    });
  });
}
//fonction qui renvoie l'année en cours
function anneeCourante() {
  var aujd = new Date();
  return aujd.getFullYear();
}

//gestion du select et du tri

selectTri.addEventListener("change", (event) => {
  // si on selctionne tri par titre
  if (event.target.value == 1) {
    var filmsTabClasse = films
      .sort((a, b) => {
        return a.name.localeCompare(b.name);
      })
      //grace a la methode map on copie l'objet "film" dans filmsTabClasse
      .map((film) => {
        return { ...film };
      });

    afficherListe(filmsTabClasse);
  } else if (event.target.value == 2) {
    filmsTabClasse2 = films.slice().sort((a, b) => b.years - a.years);
    afficherListe(filmsTabClasse2);
  }
});
