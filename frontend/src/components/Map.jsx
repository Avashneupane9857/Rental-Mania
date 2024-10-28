import GoogleMapReact from "google-map-react";
function Map() {
  const defaultProps = {
    center: {
      lat: 28.3949,
      lng: 84.124,
    },
    zoom: 11,
  };

  return (
    <div className="relative top-56">
      <h1 className="text-2xl">Where you will be</h1>
      <div style={{ height: "60vh", width: "100%" }} className="relative top-6">
        <GoogleMapReact
          bootstrapURLKeys={{ key: "" }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        ></GoogleMapReact>
        <h1 className="font-sans font-medium p-3 text-[20px]">
          Rome and Italy
        </h1>
      </div>
    </div>
  );
}

export default Map;
