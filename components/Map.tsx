<GoogleMap
  mapContainerStyle={{ width: "100%", height: "100%" }}
  center={center}
  zoom={13}
  options={{
    styles: mapStyles,
    disableDefaultUI: true, // removes ALL default buttons
    zoomControl: true,     // keep zoom only (bottom right)
    fullscreenControl: false, // ❌ REMOVE fullscreen button
    mapTypeControl: false,    // ❌ remove map/satellite (already custom)
    streetViewControl: false,
  }}
></GoogleMap>