import React from 'react';
import { Viewport } from '../../utils/interfaces';
import ReactMapGL, { Marker, Popup, NavigationControl, ScaleControl  } from 'react-map-gl';
import { mapToken } from '../../utils/config';
import { GymsState } from '../../reducers/gym';
import { Gym } from '../../models/Gym';
import { Card, Button, Spinner, Col } from 'react-bootstrap';

interface MProps {
  currentUserId?: number;
  saveGym: Function;
  unsaveGym: Function;
  gyms: GymsState;
}

interface MState {
  viewport: Viewport;
  popupInfo?: {
    id: number;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    latitude: string;
    longitude: string;
  }
}

const navStyle = {
  top: 36,
  left: 0,
  padding: '10px'
};

const scaleControlStyle = {
  bottom: 36,
  left: 0,
  padding: '10px'
};

// Start Pins

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

const SIZE = 20;

interface PProps {
  data: any;
  onClick: Function;
}

export const Pins: React.FC<PProps> = (props: PProps) => {
  return props?.data?.map((gym, index) => (
    <Marker key={`marker-${index}`} longitude={parseFloat(gym.longitude)} latitude={parseFloat(gym.latitude)}>
      <svg
        height={SIZE}
        viewBox="0 0 24 24"
        style={{
          cursor: 'pointer',
          fill: (gym.isSavedGym === '1') ? 'green' : '#d00',
          stroke: 'none',
          transform: `translate(${-SIZE / 2}px,${-SIZE}px)`
        }}
        onClick={() => props.onClick(gym)}
      >
        <path d={ICON} />
      </svg>
    </Marker>
  ));
}

// End Pins

// Start GymInfo

interface GProps {
  gym: Gym;
  userId: number;
  saveGym: Function;
  unsaveGym: Function;
}

export const GymInfo: React.FC<GProps> = (props: GProps) => {
  return (
    <Card style={{ border: 'none', backgroundColor: 'none' }}>
      <Card.Body>
        <Card.Title>{props.gym.name}</Card.Title>
        {props.gym.address}, {props.gym.city} {props.gym.state} {props.gym.zipCode}
      </Card.Body>
      {props.gym.isSavedGym === '1'
        ? <Button variant='secondary' onClick={() => { props.unsaveGym(props.gym.id, props.userId) }}>Unsave Gym</Button>
        : <Button variant='primary' onClick={() => { props.saveGym(props.gym.id, props.userId) }}>Save Gym</Button>
      }
    </Card>
  );
}

// End GymInfo

class Map extends React.Component<MProps, MState> {
  state = {
    viewport: {
      width: 1000,
      height: 600,
      latitude: 38.829946,
      longitude: -77.307361,
      zoom: 10,
    } as Viewport,
    popupInfo: {
      id: 0,
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      latitude: '00.0000',
      longitude: '00.0000',
    },
    gyms: {} as GymsState,
  };

  componentDidMount() {
    const viewport = this.state.viewport;
    this.setState({ viewport });
  }

  _updateViewport = viewport => {
    this.setState({viewport});
  };

  _onClickMarker = (gym: any) => {
    this.setState({popupInfo: gym});
  };

  handleSaveGame = (gymId: number, userId: number) => {
    this.props.saveGym(gymId, userId);
    this.setState({ popupInfo: undefined });
  }

  handleUnsaveGame = (gymId: number, userId: number) => {
    this.props.unsaveGym(gymId, userId);
    this.setState({ popupInfo: undefined });
  }

  _renderPopup() {
    const {popupInfo} = this.state;

    return (
      popupInfo && (
        <Popup
          tipSize={5}
          anchor="top"
          longitude={parseFloat(popupInfo.longitude)}
          latitude={parseFloat(popupInfo.latitude)}
          closeOnClick={false}
          onClose={() => this.setState({popupInfo: undefined})}
        >
          <GymInfo gym={popupInfo} userId={this.props?.currentUserId || 0} saveGym={this.handleSaveGame} unsaveGym={this.handleUnsaveGame} />
        </Popup>
      )
    );
  }

  render() {
    const gyms = this.props?.gyms?.gyms;
    const pending = this.props?.gyms?.pending;
    if (pending) {
      return <Col lg={10} style={{ textAlign: 'center', marginTop: 30 }}>
        <Spinner animation='border' />
      </Col>;
    }

    return (
      <ReactMapGL
        {...this.state.viewport}
        onViewportChange={(viewport) => this.setState({ viewport })}
        mapboxApiAccessToken={mapToken}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        <Pins data={gyms} onClick={this._onClickMarker} />

        {this._renderPopup()}

        <div style={{ ...navStyle, position: 'absolute' }}>
          <NavigationControl />
        </div>
        <div style={{ ...scaleControlStyle, position: 'absolute' }}>
          <ScaleControl />
        </div>
      </ReactMapGL>
    )
  }
}

export default Map;
