"use strict";
function CreateDB(){
    //He leido que si no pones verisón, el navegador pone el que el tiene por defecto y así nunca de fallo.
    var request = indexedDB.open("vs");
    var db;
    //mensaje por si ha abido algún error al abrir
    request.onerror = function (e) {
        alert('Error cargando la base de datos');
    };
    
    request.onsuccess = function (event) {
        //request.result es una instancia de IDBDatabase
        db = request.result;
        db.onerror = function (event) {
            alert("Database error: " + event.target.errorCode);
        };
        //Si todo va bien en cargar la bbdd:
        db.onsuccess = function(event){
            console.log("cargada la bbdd");
        }

    };
    //Evento que se ejecuta la primera vez que se conecta ("como el constructor").
    request.onupgradeneeded = function (event) {
        db = event.target.result;
        //Para ver que no es undefined:
        console.log("Nombre de la base de datos: "+ db.name);
        //Creo los diferentes almacenes para almacenar (jajaja) la info y tenerla separada y ordenada.
        var objectStore = db.createObjectStore("categories");
        objectStore = db.createObjectStore("directors");
        objectStore = db.createObjectStore("actors");
        objectStore = db.createObjectStore("productions");
        objectStore.createObjectStore("users");
        //console.log("Hola, he creado los stores");
        //Si se crean bien meto la info que tengo en los arrays en la bbdd.
        objectStore.transaction.oncomplete = function (event) {
            //console.log("Hola, he metido los arrays");
            var categorias = vs.categorias;
            var categoria = categorias.next();
            //Este es el objeto donde le digo en que almacen meterlo
            var cObjectStore = db.transaction("categories", "readwrite").objectStore("categories");
            while (categoria.done !== true) {
                //Añado el objeto y la clave
                cObjectStore.add(categoria.value.getObject(), categoria.value.name);
                categoria = categorias.next();
            }

            var actors = vs.actors;
            var actor = actors.next();
            var aObjectStore = db.transaction("actors", "readwrite").objectStore("actors");
            while (actor.done !== true) {
                aObjectStore.add(actor.value.getObject(), actor.value.name + " " + actor.value.lastname1);
                //console.log("Nombre del actor en onup "+ actor.value.name);
                actor = actors.next();
            }

            var directores = vs.directores;
            var director = directores.next();
            var dObjectStore = db.transaction("directors", "readwrite").objectStore("directors");
            while (director.done !== true) {
                dObjectStore.add(director.value.getObject(), director.value.name + " " + director.value.lastname1);
                director = directores.next();
            }

            var productions = vs.productions;
            var production = productions.next();
            var pObjectStore = db.transaction("productions", "readwrite").objectStore("productions");
            while (production.done !== true) {
                pObjectStore.add(production.value.getObject(), production.value.title);
                production = productions.next();
            }
            console.log("ObjestStore creados y completado");
        }
        

    };
}
//He hecho un añadir generico porque siempre es igual, lo único que cambia es el nombre del almacen y si me lo pasan
//pues no tengo que hacer 4 diferentes.
function addDB(elemt, storeName, key) {
    var db;
    var request = indexedDB.open("vs");

    request.onerror = function (event) {
        alert("Fallo en el addDB");
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        db.onerror = function (event) {
            alert("Database error: " + event.target.error);
        };

        var objectStore = db.transaction([storeName], "readwrite").objectStore(storeName);
        var request2 = objectStore.add(elemt.getObject(), key);
        request2.onsuccess = function (event) {
            //Le digo al usuario que se ha añadido correctamente el elemento que me ha pasado.
            var div1 = document.getElementById("mostrarResult");
            removeChildren(div1);
            var p = document.createElement("h4");
            p.appendChild(document.createTextNode("Se ha añadido el elemento: "+ elemt));
            div1.appendChild(p);
            console.log("Se ha añadido correctamente: " + event.target.result);
        };
    };
}
//No necesito el elemento, porque con la clave (como el id), es único y así lo identifico y borro.
function deltDB(storeName, key) {
    var db;
    var request = indexedDB.open("vs");
    console.log(storeName);
    console.log(key);
    request.onerror = function (event) {
        alert("Fallo en deltDB");
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        db.onerror = function (event) {
            alert("Database error: " + event.target.error);
        };
        //objectStore es la operación que quiere hacer de que tipo y en que almacen.
        var objectStore = db.transaction([storeName], "readwrite").objectStore(storeName);
        //para borrar el elemento solo necesita la clave, como es única lo busca y elimina.
        var request2 = objectStore.delete(key);
        request2.onsuccess = function (event) {
            //Le digo al usuario que se ha eliminado correctamente el elemento que me ha pasado.
            var div1 = document.getElementById("mostrarResult");
            removeChildren(div1);
            var p = document.createElement("h4");
            p.appendChild(document.createTextNode("Se ha eliminado el elemento: "+ key));
            div1.appendChild(p);
            console.log("Se ha eliminado el elemento: "+ key);
        };
    };
}
function modDBPerson(storeName, key){
    var db;
    var request = indexedDB.open("vs");
    console.log(storeName);
    request.onerror = function (event) {
        alert("Fallo en modDBPerson");
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        db.onerror = function (event) {
            alert("Database error: " + event.target.error);
        };

        var objectStore = db.transaction([storeName], "readwrite").objectStore(storeName);
        //busco la persona con la clave y el resultado lo guardo en request2
        var request2 = objectStore.get(key);
        console.log(request2);
        request2.onerror = function (event) {
            alert("Error en modDBPerson request2");
        };
        request2.onsuccess = function (event) {
            // Cogemos el valor antiguo
            var data = request2.result;
            //console.log(data);
            // Actualizamos el valor 
            data.name = document.forms["dirForm"]["name"].value;
            data.lastname1 = document.forms["dirForm"]["lastname1"].value;
            data.born = new Date(document.forms["dirForm"]["born"].value);

            //con el add si ya existe la key no te deja hacer nada, así que modifico con el put
            var requestMo = objectStore.put(data, data.name + " " + data.lastname1);
            requestMo.onerror = function (event) {
                alert();
            };
            requestMo.onsuccess = function (event) {
                //Le digo al usuario que se ha modificado correctamente el elemento que me ha pasado.
                var div1 = document.getElementById("mostrarResult");
                removeChildren(div1);
                var p = document.createElement("h4");
                p.appendChild(document.createTextNode("Se ha modificado el elemento: "+ key +" por "+ data.name +" "+data.lastname1));
                div1.appendChild(p);
                console.log("Se ha modificado el elemento: "+ key);
            };
        };
    };

}

function modDBCategory(key) {
    var db;
    var request = indexedDB.open("vs");
    request.onerror = function (event) {
        alert("Fallo en modDBCategory");
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        db.onerror = function (event) {
            alert("Database error: " + event.target.error);
        };

        var objectStore = db.transaction(["categories"], "readwrite").objectStore("categories");
        var request2 = objectStore.get(key);
        console.log(request2);
        request2.onerror = function (event) {
            alert("Error en modDBCategory request2");
        };
        request2.onsuccess = function (event) {
            // Cogemos el valor antiguo
            var data = request2.result;
            //console.log(data);
            // Actualizamos el valor 
            data.name = document.forms["catForm"]["name"].value;
            data.description = document.forms["catForm"]["description"].value;


            var requestMo = objectStore.put(data, data.name);
            requestMo.onerror = function (event) {
                // Do something with the error
            };
            requestMo.onsuccess = function (event) {
                //Le digo al usuario que se ha modificado correctamente el elemento que me ha pasado.
                var div1 = document.getElementById("mostrarResult");
                removeChildren(div1);
                var p = document.createElement("h4");
                p.appendChild(document.createTextNode("Se ha modificado el elemento: "+ key +" por "+ data.name +" "+data.lastname1));
                div1.appendChild(p);
                console.log("Se ha modificado el elemento: "+ key);
            };
        };
    };
}



