import { RegisterLocationAtom, RegisterMapAtom } from "@/store/atoms";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

declare global {
  interface Window {
    kakao: any;
  }
}

const RegisterMap = () => {
  const getUserLocation = useRecoilValue(RegisterLocationAtom);
  const [missingSpot, setMissingSpot] = useRecoilState(RegisterMapAtom);
  useEffect(() => {
    const mapScript = document.createElement("script");

    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=34b875f3f1bb52af7bfb9963e4dbc291&autoload=false&libraries=services`;

    document.head.appendChild(mapScript);

    const onLoadKaKaoMap = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667),
          level: 3,
        };
        const map = new window.kakao.maps!.Map(container, options);
        if (getUserLocation.length !== 0) {
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.addressSearch(
            getUserLocation,
            function (result: any, status: any) {
              if (status === window.kakao.maps.services.Status.OK) {
                const coords = new window.kakao.maps.LatLng(
                  result[0].y,
                  result[0].x
                );
                setMissingSpot({ lat: result[0].y, lon: result[0].x });
                const marker = new window.kakao.maps.Marker({
                  map: map,
                  position: coords,
                });
                const infowindow = new window.kakao.maps.InfoWindow({
                  zIndex: 1,
                  content: `<div style="width:150px;text-align:center;padding:6px 0;">${getUserLocation}</div>`,
                });
                infowindow.open(map, marker);

                // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                map.setCenter(coords);
              } else {
                setMissingSpot({ lat: 0, lon: 0 });
              }
            }
          );
        }
      });
    };
    //잘 찍히는지 확인, 확인한 결과 잘 뜬다!
    console.log(missingSpot);
    mapScript.addEventListener("load", onLoadKaKaoMap);
  }, [getUserLocation]);
  return (
    <>
      <div id="map" className=" w-full h-full" />
    </>
  );
};

export default RegisterMap;