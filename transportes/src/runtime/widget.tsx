import { React, type AllWidgetProps } from 'jimu-core';
import { JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis';
import FeatureLayer from 'esri/layers/FeatureLayer';

const { useState, useEffect } = React;

const Widget = (props: AllWidgetProps<any>) => {
  const [jimuMapView, setJimuMapView] = useState<JimuMapView>();
  const [aeroportosLayer, setAeroportosLayer] = useState<FeatureLayer | null>(null);
  const [portosLayer, setPortosLayer] = useState<FeatureLayer | null>(null);
  const [aeroportosVisible, setAeroportosVisible] = useState(false);
  const [portosVisible, setPortosVisible] = useState(false);

  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      setJimuMapView(jmv);
    }
  };

  const toggleAeroportosVisibility = () => {
    if (aeroportosLayer) {
      aeroportosLayer.visible = !aeroportosLayer.visible;
      setAeroportosVisible(aeroportosLayer.visible);
    }
  };

  const togglePortosVisibility = () => {
    if (portosLayer) {
      portosLayer.visible = !portosLayer.visible;
      setPortosVisible(portosLayer.visible);
    }
  };

  useEffect(() => {
    if (jimuMapView && !aeroportosLayer && !portosLayer) {
      const aeroportos = new FeatureLayer({
        url: 'https://services3.arcgis.com/cS4GcXNpyMgMVA4J/arcgis/rest/services/Transportes/FeatureServer/0', 
        definitionExpression: "id_categoria = 1", 
        visible: false, 
      });
      jimuMapView.view.map.add(aeroportos);
      setAeroportosLayer(aeroportos);

      const portos = new FeatureLayer({
        url: 'https://services3.arcgis.com/cS4GcXNpyMgMVA4J/arcgis/rest/services/Transportes/FeatureServer/0',
        definitionExpression: "id_categoria = 2",
        visible: false, 
      });
      jimuMapView.view.map.add(portos);
      setPortosLayer(portos);
    }
  }, [jimuMapView, aeroportosLayer, portosLayer]);

  return (
    <div className="widget-starter jimu-widget">
      {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
        <JimuMapViewComponent
          useMapWidgetId={props.useMapWidgetIds?.[0]}
          onActiveViewChange={activeViewChangeHandler}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', backgroundColor: '#eee', padding: '10px' }}>
        <div>
          <label>
            <input 
              type="checkbox" 
              checked={aeroportosVisible} 
              onChange={toggleAeroportosVisibility}
            />
            Mostrar Aeroportos
          </label>
        </div>
        <div>
          <label>
            <input 
              type="checkbox" 
              checked={portosVisible} 
              onChange={togglePortosVisibility}
            />
            Mostrar Portos
          </label>
        </div>
      </div>
    </div>
  );
};

export default Widget;
