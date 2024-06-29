    let mapToken = mapTokentop;

	mapboxgl.accessToken = mapToken

    const map = new mapboxgl.Map({
        container: 'map', 
        center: listingstringify.geometry.coordinates, 
        zoom: 9 
    });
    
    const marker = new mapboxgl.Marker({color: "red"})
    .setLngLat(listingstringify.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset:2})
        .setHTML(`<h4>${listingstringify.location}</h4><p>Exact location after booking</p>`)
    )
    .addTo(map);