function homePage() {
    console.log("HI THERE")
    document.getElementById('locationheader').innerHTML = "<h1>Burlington, VT</h1>";
    document.getElementById('restaurants').innerHTML = "";
    fetch('all.json')
        .then(response => response.json())
        .then(all => {
            document.getElementById('locationheader').innerHTML += `${all.length} Places` + "<br><br>";
            all.forEach(resto => {
                let filename = `${resto}.json`
                fetch(filename)
                    .then(response => { return response.json() })
                    .then(restaurant => {
                        addMarker({ restaurant })
                        document.getElementById("restaurants").innerHTML += `<a href="restaurant.html#${restaurant.id}"><div id='${restaurant.id}' class="resto-name"> ${restaurant.name} <p class="resto-italic">${restaurant.notes[0]}</p></div></a> <br>`;
                    })
            })
        });
        return true;
}

function getInfo(filename) {
    fetch(filename)
        .then(response => response.json())
        .then(restaurant => {
            document.getElementById('locationheader').innerHTML = `<h1 class="purpletext">${restaurant.name}</h1>`;
            document.getElementById('list').className = "infopage";
            document.getElementById('list').innerHTML = `<h2>Address:</h2> ${restaurant.address} <h2>Phone:</h2> ${restaurant.phone} <h2>Website:</h2> ${restaurant.website} <h2 class="purpletext">Notes:</h2><b> ${restaurant.notes.join(" <br><br> ")}</b> </div>`;
            console.log(restaurant.id)
        });
        return true;
}

function makeMap(address) {
    console.log("making map")
    let encodedAddress = encodeURIComponent(address)
    fetch(`https://nominatim.openstreetmap.org/search/?q=${encodedAddress}&format=json`)
        .then(response => { return response.json() })
        .then(result => {
            let coords = [result[0].lat, result[0].lon];
            mymap = L.map('map').setView(coords, 15);
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 22,
                id: 'mapbox.streets',
                accessToken: 'pk.eyJ1Ijoic2tpcG93ZDNyIiwiYSI6ImNqbm5hYnQ3cDAwZ3gzcXRhanllOGJ4MzEifQ.T1lUzD4Hs3pcOdKFlREpAg'
            }).addTo(mymap);
        })
}

function addMarker({ restaurant }) {
    if (!checkBTVAddress(restaurant.address)) {
        restaurant.address += " 05401";
    }
    let encodedAddress = encodeURIComponent(restaurant.address)

    fetch(`https://nominatim.openstreetmap.org/search/?q=${encodedAddress}&format=json`)
        .then(response => { return response.json() })
        .then(result => {
            let coords = [result[0].lat, result[0].lon];
            restaurant.coords = coords;
            let marker = L.marker(coords).addTo(mymap);
            marker.bindPopup(`<button class="popupButton"><a href="restaurant.html#${restaurant.id}"><b>${restaurant.name}</b></a></button><br> ${restaurant.address} <br>`);
            marker.on('mouseover', function (e) {
                this.openPopup();
            });
        })
}

function openMarker({ restaurant }){
    let marker = L.marker(restaurant.coords);
    marker.openPopup();
}


function checkBTVAddress(address) {
    if (address.includes("05401")) {
        return true;
    } else {
        return false;
    }
}
