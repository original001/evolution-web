import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as MDL from 'react-mdl';
import {connect} from 'react-redux';
import {Map} from 'immutable';

import {
  roomExitRequest
  , gameEndTurnRequest
  , gameReadyRequest
  , gameDeployAnimalRequest
  , gameDeployTraitRequest
  , traitTakeFoodRequest
  , traitActivateRequest
} from '../../../shared/actions/actions';

import {GameUI} from './ui/GameUI.jsx';
import {Game} from './Game.jsx';
import {GameModelClient} from '../../../shared/models/game/GameModel';

import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import MouseBackend from './dnd/react-dnd-mouse-backend';
import TestBackend from 'react-dnd-test-backend';

import {AnimationServiceContext} from '../../services/AnimationService';

export class GameWrapper extends React.Component {
  static childContextTypes = {
    game: React.PropTypes.instanceOf(GameModelClient)
    , gameActions: React.PropTypes.object
  };

  getChildContext() {
    return {
      game: this.props.game
      , gameActions: {
        $endTurn: this.props.$endTurn
        , $exit: this.props.$exit
        , $ready: this.props.$ready
        , $deployAnimal: this.props.$deployAnimal
        , $deployTrait: this.props.$deployTrait
        , $traitTakeFood: this.props.$traitTakeFood
        , $traitActivate: this.props.$traitActivate
      }
    };
  }

  constructor(props) {
    super(props);
    //this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }

  componentDidMount() {
    if (!this.ready && this.props.game) {
      this.ready = true;
      this.props.$ready();
    }
  }

  render() {
    const {game, user, room} = this.props;

    if (!user || !game || game.status.phase === 0)
      return <div>Loading</div>;

    return (<div className='GameWrapper' style={{display: 'flex'}}>
      <GameUI/>
      <Game user={user}/>
    </div>);
  }
}

let GameWrapperHOC = GameWrapper;

//const backend = !process.env.TEST ? HTML5Backend : TestBackend;
const backend = !process.env.TEST ? MouseBackend : TestBackend;
GameWrapperHOC = DragDropContext(backend)(GameWrapperHOC);

import * as GameAnimations from './GameAnimations';

GameWrapperHOC = AnimationServiceContext({
  animations: ({getRef}) => ({
    gameGiveCards: (done, {game}, {cards}) => {
      GameAnimations.gameGiveCards(done, game, cards, getRef('Deck'), getRef('Cards'));
    }
//, gameNextPlayer: (done, component, {cards}) => {
    //  component.setState({
    //    toastYourTurn: true
    //  });
    //  setTimeout(() => {
    //    done();
    //  }, 5000);
    //}
    //onlineUpdate: (done, component) => {
    //  const {game} = component.props;
    //  GameAnimations.gameGiveCards(done, game, game.getPlayer().hand, component.Deck, component.Cards);
    //}
    //,
  })
})(GameWrapperHOC);


GameWrapperHOC = connect(
  (state) => {
    //console.log('state', state.toJS())
    const game = state.get('game');
    const user = state.get('user');
    const roomId = state.get('room');
    const room = state.getIn(['rooms', roomId]);
    return {game, user, room}
  }
  , (dispatch) => ({
    // GLOBAL
    $endTurn: () => dispatch(gameEndTurnRequest())
    , $exit: () => dispatch(roomExitRequest())
    // PHASE.PREPARE
    , $ready: () => dispatch(gameReadyRequest())
    // PHASE.DEPLOY
    , $deployAnimal: (...args) => dispatch(gameDeployAnimalRequest(...args))
    , $deployTrait: (...args) => dispatch(gameDeployTraitRequest(...args))
    // PHASE.FEEDING
    , $traitTakeFood: (...args) => dispatch(traitTakeFoodRequest(...args))
    , $traitActivate: (...args) => dispatch(traitActivateRequest(...args))
  })
)(GameWrapperHOC);

export const GameWrapperView = GameWrapperHOC