import { React, type AllWidgetProps } from 'jimu-core';
import { JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis';
import FeatureLayer from 'esri/layers/FeatureLayer';

const { useState, useEffect } = React;

const Widget = (props: AllWidgetProps<any>) => {
  const [jimuMapView, setJimuMapView] = useState<JimuMapView>();
  const [featureLayer, setFeatureLayer] = useState<FeatureLayer | null>(null);
  const [layerVisible, setLayerVisible] = useState(false);

  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      setJimuMapView(jmv);
    }
  };

  const toggleLayerVisibility = () => {
    if (featureLayer) {
      featureLayer.visible = !featureLayer.visible;
      setLayerVisible(featureLayer.visible);
    }
  };

  useEffect(() => {
    if (jimuMapView && !featureLayer) {
      const layer = new FeatureLayer({
        url: 'https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads_Styled/FeatureServer/0',
        visible: false,
      });
      jimuMapView.view.map.add(layer);
      setFeatureLayer(layer);
    }
  }, [jimuMapView, featureLayer]);

  

  return (
    <div className="widget-starter jimu-widget">
      {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
        <JimuMapViewComponent
          useMapWidgetId={props.useMapWidgetIds?.[0]}
          onActiveViewChange={activeViewChangeHandler}
        />
      )}

      <div style={{ display: "flex", width: "100vw", backgroundColor: "#eee", padding: "10px" }}>
        <button
          onClick={toggleLayerVisibility}
          style={{
            padding: '10px 30px',
            color: layerVisible ? '#e47474' : '#333',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          {layerVisible ? 'Hide Layer' : 'Show Layer'}
        </button>
      </div>
    </div>
  );
};

export default Widget;