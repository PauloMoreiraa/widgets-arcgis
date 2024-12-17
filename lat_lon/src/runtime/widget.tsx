import { React, type AllWidgetProps } from 'jimu-core'
import { JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis'
import type Point from 'esri/geometry/Point'
import FeatureLayer from 'esri/layers/FeatureLayer'

const { useState } = React

const Widget = (props: AllWidgetProps<any>) => {

  const [latitude, setLatitude] = useState<string>('')
  const [longitude, setLongitude] = useState<string>('')

  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      jmv.view.on('pointer-move', (evt) => {
        const point: Point = jmv.view.toMap({
          x: evt.x,
          y: evt.y
        })
        setLatitude(point.latitude.toFixed(6))
        setLongitude(point.longitude.toFixed(6))
      })
    }
  }

  return <div className="widget-starter jimu-widget" style={{backgroundColor: "#f6f6f6", borderRadius: "8px", padding: "8px", textAlign: "left", height: "auto"}}>
    {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
      <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={activeViewChangeHandler} />
    )}
    <div>
      <span style={{color: "#222", fontWeight: "bolder", fontSize: "1rem"}}>
        Latitude: <span style={{fontWeight: "lighter"}}>{latitude}</span>
      </span>
    </div>
   
    <div>
      <span style={{color: "#222", fontWeight: "bolder", fontSize: "1rem"}}>
        Longitude: <span style={{fontWeight: "lighter"}}>{longitude}</span>
      </span>
    </div>
  </div>

}

export default Widget