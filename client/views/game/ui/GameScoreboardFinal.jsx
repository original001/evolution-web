import React from 'react';
import PropTypes from 'prop-types'
import T from 'i18n-react';
import * as MDL from 'react-mdl';

import cn from 'classnames';

import {GameModelClient, PHASE} from '../../../../shared/models/game/GameModel';
import {Dialog, DialogActions} from '../../utils/Dialog.jsx';

import User from '../../utils/User.jsx'

export default class GameScoreboardFinal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {show: false};
    this.showedOnce = false;
  }

  static propTypes = {
    game: PropTypes.instanceOf(GameModelClient).isRequired
  };

  componentDidUpdate() {
    if (!this.showedOnce && this.props.game.status.phase === PHASE.FINAL) {
      this.showedOnce = true;
      this.setState({show: true});
    }
  }

  render() {
    const {game} = this.props;

    return <span>
      {game.status.phase === PHASE.FINAL
      && <MDL.Button className="ShowScoreboardFinal"
                     onClick={() => this.setState({show: true})}>
        {T.translate('Game.UI.Scores.Label')}
      </MDL.Button>
      }
      <Dialog show={this.state.show}>
        {this.state.show && <MDL.DialogTitle>
          {T.translate('Game.UI.Scores.Winner')}: <strong><User id={game.winnerId}/></strong>
        </MDL.DialogTitle>}
        <MDL.DialogContent>{this.renderDialogContent()}</MDL.DialogContent>
        <DialogActions>
          <MDL.Button type='button' raised primary onClick={() => this.setState({show: false})}>OK</MDL.Button>
        </DialogActions>
      </Dialog>
    </span>
  }

  renderDialogContent() {
    const {game} = this.props;

    return (
      game.scoreboardFinal && <table className='mdl-data-table'>
        <tbody>
        <tr>
          <th className='mdl-data-table__cell--non-numeric'>{T.translate('Game.UI.Scores.TablePlayer')}</th>
          <th>{T.translate('Game.UI.Scores.TableScoreNormal')}</th>
          <th>{T.translate('Game.UI.Scores.TableScoreDead')}</th>
        </tr>
        {game.scoreboardFinal.map(({playerId, playing, scoreNormal, scoreDead}) =>
          <tr key={playerId}
              className={cn({'bold': game.winnerId === playerId})}>
            <td className='mdl-data-table__cell--non-numeric'><User id={playerId}/></td>
            <td>{scoreNormal}</td>
            <td>{scoreDead}</td>
          </tr>)}
        </tbody>
      </table>
    )
  }
}