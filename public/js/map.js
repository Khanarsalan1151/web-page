    let mapToken = mapTokenTop;

	mapboxgl.accessToken = mapToken

    const map = new mapboxgl.Map({
        container: 'map', 
        center: listingStringify.geometry.coordinates, 
        zoom: 9 
    });
    
    const marker = new mapboxgl.Marker({color: "red"})
    .setLngLat(listingStringify.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset:2})
        .setHTML(`<h4>${listingStringify.location}</h4><p>Exact location after booking</p>`)
    )
    .addTo(map);