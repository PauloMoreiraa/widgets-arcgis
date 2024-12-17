import { React, type AllWidgetProps } from 'jimu-core';
import { JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis';
import FeatureLayer from 'esri/layers/FeatureLayer';

const { useState, useEffect } = React;

const Widget = (props: AllWidgetProps<any>) => {
  const [jimuMapView, setJimuMapView] = useState<JimuMapView>();
  const [lineLayer, setLineLayer] = useState<FeatureLayer | null>(null);
  const [polygonLayer, setPolygonLayer] = useState<FeatureLayer | null>(null);
  const [layersVisible, setLayersVisible] = useState(false);

  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      setJimuMapView(jmv);
    }
  };

  const toggleLayersVisibility = () => {
    if (lineLayer && polygonLayer) {
      const newVisibility = !layersVisible;

      lineLayer.visible = newVisibility;
      polygonLayer.visible = newVisibility;

      setLayersVisible(newVisibility);
    }
  };

  useEffect(() => {
    if (jimuMapView) {
      if (!lineLayer) {
        const line = new FeatureLayer({
          url: 'https://services3.arcgis.com/cS4GcXNpyMgMVA4J/arcgis/rest/services/Mapa_Teste/FeatureServer/0',
          visible: false,
        });
        jimuMapView.view.map.add(line);
        setLineLayer(line);
      }

      if (!polygonLayer) {
        const polygon = new FeatureLayer({
          url: 'https://services3.arcgis.com/cS4GcXNpyMgMVA4J/arcgis/rest/services/Mapa_Teste/FeatureServer/2',
          visible: false,
        });
        jimuMapView.view.map.add(polygon);
        setPolygonLayer(polygon);
      }
    }
  }, [jimuMapView, lineLayer, polygonLayer]);

  return (
    <div className="widget-starter jimu-widget">
      {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
        <JimuMapViewComponent
          useMapWidgetId={props.useMapWidgetIds?.[0]}
          onActiveViewChange={activeViewChangeHandler}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <button
          onClick={toggleLayersVisibility}
          style={{
            padding: '10px 20px',
            backgroundColor: layersVisible ? '#f44336' : '#3678f4',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {layersVisible ? 'Ocultar Camadas' : 'Mostrar Camadas'}
        </button>
      </div>
    </div>
  );
};

export default Widget;
