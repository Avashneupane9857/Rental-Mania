/* eslint-disable react/prop-types */
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
import { google_map_api } from "../../config";

function Map({ data }) {
  console.log(google_map_api);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: google_map_api,
    libraries: ["places"],
  });

  const center = useMemo(
    () => ({
      lat: parseFloat(data.latitude),
      lng: parseFloat(data.longitude),
    }),
    [data.latitude, data.longitude]
  );

  if (loadError) return <div>Error loading maps</div>;

  return (
    <div className="relative top-4 h-[500px] w-full">
      <h1 className="text-2xl mb-4">Where you will be</h1>
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <div className="h-[400px] w-full">
          <GoogleMap
            mapContainerClassName="h-full w-full rounded-lg"
            center={center}
            zoom={13}
            options={{
              disableDefaultUI: false,
              zoomControl: true,
              scrollwheel: true,
              fullscreenControl: true,
            }}
          >
            <MarkerF
              position={center}
              animation={2}
              visible={true}
              title={data.locationName}
            />
          </GoogleMap>
        </div>
      )}
      <h1 className="font-sans font-medium p-3 text-[20px]">
        {data.locationName}
      </h1>
    </div>
  );
}

export default Map;
