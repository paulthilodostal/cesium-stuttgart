import {
    Cartesian3,
    Math as CesiumMath,
    Terrain,
    Viewer,
    Cesium3DTileset,
    Cesium3DTileFeature,
    Ion,
    Color,
    defined,
    ScreenSpaceEventType,
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./style.css";

Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwNjY2OTJhYi02ZWU0LTQyYmYtYTNmYy05ZWI2NGFjY2VhYjgiLCJpZCI6NDQ2MTc1LCJzdWIiOiJwYXVsZWRvc3RhbCIsImlzcyI6Imh0dHBzOi8vYXBpLmNlc2l1bS5jb20iLCJhdWQiOiJwYXVsZWRvc3RhbF9kZWZhdWx0IiwiaWF0IjoxNzgxNzc5NTkxfQ.FMPTL0KPsYptM4qaIy24z2QCnhXtcf9WzeEzlR7QQCM';

const viewer = new Viewer("cesiumContainer", {
    terrain: Terrain.fromWorldTerrain(),
});

viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(9.1598, 48.7601, 2500),
    orientation: {
        heading: CesiumMath.toRadians(0.0),
        pitch: CesiumMath.toRadians(-90.0),
    },
});

Cesium3DTileset.fromIonAssetId(4957523).then((tileset) => {
    viewer.scene.primitives.add(tileset);
    viewer.zoomTo(tileset);
});

// Beleuchtung
viewer.scene.globe.enableLighting = true;
viewer.scene.atmosphere.dynamicLighting = true;

// Hover Highlight
let highlighted = {
    feature: undefined,
    originalColor: new Color(),
};

viewer.screenSpaceEventHandler.setInputAction((movement) => {
    if (highlighted.feature) {
        highlighted.feature.color = highlighted.originalColor;
        highlighted.feature = undefined;
    }
    const picked = viewer.scene.pick(movement.endPosition);
    if (picked instanceof Cesium3DTileFeature) {
        highlighted.feature = picked;
        Color.clone(picked.color, highlighted.originalColor);
        picked.color = Color.YELLOW.withAlpha(0.9);
    }
}, ScreenSpaceEventType.MOUSE_MOVE);