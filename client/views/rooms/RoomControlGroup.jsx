import React from 'react';
import PropTypes from 'prop-types'
import T from 'i18n-react';
import {connect} from 'react-redux';

import TimeService from '../../services/TimeService';
import {ControlGroup} from './../utils/ControlGroup.jsx';
import {Button} from 'react-mdl';
import {RoomModel} from '../../../shared/models/RoomModel';

import {redirectTo} from '../../../shared/utils';
import {
  roomExitRequest,
  roomStartVotingRequest,
  roomJoinRequest,
  roomSpectateRequest
} from '../../../shared/actions/actions';
import {failsChecks} from '../../../shared/actions/checks';
import {checkCanJoinRoomToPlay} from '../../../shared/actions/rooms.checks';
import RouteRoom from '../RouteRoom.jsx'

/*
 * RoomControlGroup
 * */

export class RoomControlGroup extends React.Component {
  static propTypes = {
    room: PropTypes.instanceOf(RoomModel)
    , userId: PropTypes.string.isRequired
    , inRoom: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.$start = () => props.$start(props.roomId);
    this.$roomJoin = () => props.$roomJoin(props.roomId);
    this.$roomSpectate = () => props.$roomSpectate(props.roomId);
  }

  back() {
    const {room, userId, inRoom} = this.props;
    this.props.$redirectTo(inRoom ? '/' : RouteRoom.getRoutePath())
  }

  render() {
    const {room, userId, inRoom} = this.props;

    if (!room) return null;

    return <ControlGroup name={T.translate('App.Room.Room')}>
      <Button id="Room$Back" onClick={() => this.back()}>{T.translate('App.Room.$Back')}</Button>
      <Button id="Room$Exit" onClick={this.props.$exit}>{T.translate('App.Room.$Exit')}</Button>
      {inRoom && !!~room.spectators.indexOf(userId)
      && <Button id="Room$Play"
                 disabled={failsChecks(() => checkCanJoinRoomToPlay(room, userId))}
                 onClick={this.$roomJoin}>{T.translate('App.Room.$Play')}</Button>}
      {inRoom && !!~room.users.indexOf(userId)
      && <Button id="Room$Spectate"
                 onClick={this.$roomSpectate}>{T.translate('App.Room.$Spectate')}</Button>}
      <Button id="Room$Start"
              disabled={!room.checkCanStart(userId, TimeService.getServerTimestamp())}
              onClick={this.$start}>{T.translate('App.Room.$Start')}</Button>
    </ControlGroup>
  }
}

export const RoomControlGroupView = connect(
  (state) => {
    const roomId = state.get('room');
    return {
      roomId
      , room: state.getIn(['rooms', roomId])
      , userId: state.getIn(['user', 'id'])
      , lang: state.getIn(['app', 'lang'])
    }
  }
  , (dispatch) => ({
    $redirectTo: (location) => dispatch(redirectTo(location))
    , $exit: () => dispatch(roomExitRequest())
    , $start: (roomId) => dispatch(roomStartVotingRequest())
    , $roomJoin: (roomId) => dispatch(roomJoinRequest(roomId))
    , $roomSpectate: (roomId) => dispatch(roomSpectateRequest(roomId))
  })
)(RoomControlGroup);

export default RoomControlGroupView;