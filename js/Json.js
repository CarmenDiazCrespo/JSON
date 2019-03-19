var catArray = [];
var actArray = [];
var dirArray = [];
var proArray = [];
var usArray = [];

function createJSON(){
	//Se añaden a los correspondientes array los datos 
	var categorias = vs.categorias;
    var categoria = categorias.next();
    
    while (categoria.done !== true) {
		//Añado el objeto y la clave
		catArray.push(categoria.value);
		categoria = categorias.next();
    }

    var actors = vs.actors;
    var actor = actors.next();

    while (actor.done !== true) {
		actArray.push(actor.value);
		//console.log("Nombre del actor en onup "+ actor.value.name);
		actor = actors.next();
    }

    var directores = vs.directores;
    var director = directores.next();
    
    while (director.done !== true) {
    	dirArray.push(director.value);
        director = directores.next();
    }

    var productions = vs.productions;
    var production = productions.next();
    
    while (production.done !== true) {
		proArray.push(production.value)
        production = productions.next();
    }
	console.log("Metido en el json");

	var dataUp = {
		user: getCookie("userName"),
		categorias: catArray,
		producciones: proArray,
		actores: actArray,
		directores: dirArray
	}

	var xmlhttp = new XMLHttpRequest();
	data = JSON.stringify(dataUp);
			
	xmlhttp.onreadystatechange = function(){
	//Si esta correcto
	if ((this.readyState == 4) && (this.status == 200)){
			console.log("JSON generado");
		}
	};
	xmlhttp.open('GET', "file.php", true);
	xmlhttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xmlhttp.send('data=' + data);

}
function leerJson(){
	//Se leen los datos del JSON y se introduce
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
    
		if (this.readyState == 4 && this.status == 200) {
			
			var myObj = JSON.parse(this.responseText);
			
			//Para cada array del videosystem
			for(i in myObj.categorias){
				catArray.push(myObj.categorias[i]);
			}

			for(i in myObj.producciones){
				proArray.push(myObj.producciones[i]);
			}

			for(i in myObj.directores){
				dirArray.push(myObj.directores[i]);
			}

			for(i in myObj.actores){
				actArray.push(myObj.actores[i]);
			}

			//Se añaden los valores a la base de datos con los metodos previos
			loadDates("categorias",catArray);
			loadDates("producciones",proArray);
			loadDates("actores",actArray);
			loadDates("directores",dirArray);

		}
		xmlhttp.open("GET", "json/prueba.json", true);
		xmlhttp.send();
	}
}
