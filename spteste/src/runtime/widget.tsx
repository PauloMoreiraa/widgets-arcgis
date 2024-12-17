import { React, type AllWidgetProps } from 'jimu-core';
import { JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis';
import FeatureLayer from 'esri/layers/FeatureLayer';
import GraphicsLayer from 'esri/layers/GraphicsLayer';
import Graphic from 'esri/Graphic';
import Circle from 'esri/geometry/Circle';
import SimpleFillSymbol from 'esri/symbols/SimpleFillSymbol';

const { useState, useEffect } = React;

const Widget = (props: AllWidgetProps<any>) => {
  const [jimuMapView, setJimuMapView] = useState<JimuMapView>();
  const [pointLayer, setPointLayer] = useState<FeatureLayer | null>(null);
  const [circleLayer, setCircleLayer] = useState<GraphicsLayer | null>(null);
  const [points, setPoints] = useState<any[]>([]); 
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]); 

  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      setJimuMapView(jmv);
    }
  };

  const togglePointSelection = (pointId: string) => {
    setSelectedPoints((prevSelected) =>
      prevSelected.includes(pointId)
        ? prevSelected.filter((id) => id !== pointId) 
        : [...prevSelected, pointId] 
    );
  };

  const updateCircles = () => {
    if (circleLayer && points.length > 0) {
      circleLayer.removeAll();

      const graphics = points
        .filter((point) => selectedPoints.includes(point.attributes.OBJECTID))
        .map((point) => {
          const circle = new Circle({
            center: point.geometry,
            radius: 1.5,
            radiusUnit: 'kilometers',
          });

          const symbol = new SimpleFillSymbol({
            color: [0, 0, 255, 0.2],
            outline: {
              color: [0, 0, 255, 1],
              width: 2,
            },
          });

          return new Graphic({
            geometry: circle,
            symbol,
          });
        });

      circleLayer.addMany(graphics);
    }
  };

  useEffect(() => {
    if (jimuMapView) {
      if (!pointLayer) {
        const point = new FeatureLayer({
          url: 'https://services3.arcgis.com/cS4GcXNpyMgMVA4J/arcgis/rest/services/PontosSpTeste/FeatureServer/4',
          visible: true,
        });
        jimuMapView.view.map.add(point);
        setPointLayer(point);
      }

      if (!circleLayer) {
        const graphicsLayer = new GraphicsLayer();
        jimuMapView.view.map.add(graphicsLayer);
        setCircleLayer(graphicsLayer);
      }
    }
  }, [jimuMapView, pointLayer, circleLayer]);

  useEffect(() => {
    if (pointLayer) {
      const query = pointLayer.createQuery();
      query.returnGeometry = true;
      query.outFields = ['*'];

      pointLayer.queryFeatures(query).then((result) => {
        setPoints(result.features);
      });
    }
  }, [pointLayer]);

  useEffect(() => {
    updateCircles();
  }, [selectedPoints]);

  return (
    <div className="widget-starter jimu-widget">
      {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
        <JimuMapViewComponent
          useMapWidgetId={props.useMapWidgetIds?.[0]}
          onActiveViewChange={activeViewChangeHandler}
        />
      )}

      <div style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
        <h3>Áreas beneficiadas</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {points.map((point) => (
            <li key={point.attributes.OBJECTID} 
              style={{
                backgroundColor: "transparent",
                gap: "10px"
              }}>
              <label style={{
                backgroundColor: "transparent",
                gap: "8px",
                display: "flex",
                justifyContent: "flex-start",
              }}>
                <input
                  type="checkbox"
                  checked={selectedPoints.includes(point.attributes.OBJECTID)}
                  onChange={() => togglePointSelection(point.attributes.OBJECTID)}
                  style={{ borderRadius: "50%",  cursor: "pointer" }}
                />
                <span style={{
                  backgroundColor: "transparent", 
                  color: "#333",
                  cursor: "pointer"
              }}
              >{point.attributes.descricao || `Ponto ${point.attributes.OBJECTID}`}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Widget;
