import React from 'react';
import PropTypes from 'prop-types'
import T from 'i18n-react';
import {Dialog} from '../../utils/Dialog.jsx';
import {Button, DialogTitle, DialogContent} from 'react-mdl';

import {Timer} from '../../utils/Timer.jsx';
import {Animal} from '../animals/Animal.jsx';
import {AnimalTrait} from '../animals/AnimalTrait.jsx';
import AnimalTraitIcon from '../animals/AnimalTraitIcon.jsx';

import {QuestionRecord} from '../../../../shared/models/game/GameModel.js';
import {TraitCarnivorous, TraitMimicry, TraitTailLoss} from '../../../../shared/models/game/evolution/traitsData/index';
import * as tt from '../../../../shared/models/game/evolution/traitTypes';
import {checkIfTraitDisabledByIntellect} from '../../../../shared/actions/trait.checks';

import './TraitDefenceDialog.scss';

export class TraitDefenceDialog extends React.Component {
  static propTypes = {
    $traitAnswer: PropTypes.func.isRequired
  };


  render() {
    const {game} = this.props;
    const show = game.question && game.question.id && game.question.type === QuestionRecord.DEFENSE;
    return (<Dialog show={show}>
      <DialogTitle>{T.translate('Game.UI.TraitDefenceDialog.Title')}</DialogTitle>
      {show && this.renderDialogContent()}
    </Dialog>);
  }

  renderDialogContent() {
    const {game, $traitAnswer} = this.props;
    const {sourceAid, sourcePid, targetAid, targetPid, time} = game.question;
    const attackAnimal = game.locateAnimal(sourceAid, sourcePid);
    const targetAnimal = game.locateAnimal(targetAid, targetPid);

    const traitTailLoss = targetAnimal.hasTrait(TraitTailLoss.type);
    const targetsTailLoss = traitTailLoss
      && !checkIfTraitDisabledByIntellect(attackAnimal, traitTailLoss)
      && TraitTailLoss.getTargets(game, attackAnimal, TraitCarnivorous, targetAnimal);

    const traitMimicry = targetAnimal.hasTrait(TraitMimicry.type);
    const targetsMimicry = traitMimicry
      && !traitMimicry.checkActionFails(game, targetAnimal)
      && !checkIfTraitDisabledByIntellect(attackAnimal, traitMimicry)
      && TraitMimicry.getTargets(game, attackAnimal, TraitCarnivorous, targetAnimal);

    const otherTraits = [
      targetAnimal.hasTrait(tt.TraitShell)
      , targetAnimal.hasTrait(tt.TraitInkCloud)
      , targetAnimal.hasTrait(tt.TraitRunning)
      , targetAnimal.hasTrait(tt.TraitCnidocytes)
    ].filter(t => !!t // Really has trait
      && !t.checkActionFails(game, targetAnimal) // And can activate it
      && !checkIfTraitDisabledByIntellect(attackAnimal, t) // And it's not blocked by attacking intellect
    );

    const allowNothing = otherTraits.every(t => t.getDataModel().optional)
      && !(traitTailLoss && targetsTailLoss.size > 0)
      && !(traitMimicry && targetsMimicry.size > 0);

    return (<DialogContent>
      <div className='TraitDefenceDialog'>
        {traitTailLoss && targetsTailLoss.size > 0
        && this.renderTailLoss(targetsTailLoss, $traitAnswer.bind(null, traitTailLoss.id))
        }
        {traitMimicry && targetsMimicry.size > 0
        && this.renderMimicry(targetsMimicry, $traitAnswer.bind(null, traitMimicry.id))
        }
        {otherTraits.length > 0
        && this.renderOther(otherTraits, $traitAnswer.bind(null))}

        {allowNothing && <div className="Row">
          <div className='Item'><Button raised onClick={() => $traitAnswer(true)}>
            {T.translate('Game.UI.TraitActivateDialog.Nothing')}
          </Button>
          </div>
        </div>}
        <h1>
          <T.span text='Game.UI.TraitDefenceDialog.Time'/>:&nbsp;
          <Timer start={time} duration={game.settings.timeTraitResponse}/>
        </h1>
      </div>
    </DialogContent>);
  }

  renderTailLoss(targets, onClick) {
    return (<div className='TailLoss'>
      <h1><T.span text='Game.UI.TraitDefenceDialog.TailLoss_Title'/></h1>
      <div className='Row'>
        {targets.map((trait, index) =>
          <div key={trait.id}
               className='Item'
               onClick={() => onClick(trait.id)}>
            <AnimalTraitIcon trait={trait}/>
          </div>
        )}
      </div>
    </div>);
  }

  renderMimicry(targets, onClick) {
    return (<div className='Mimicry' style={{minWidth: (80 * targets.size) + 'px'}}>
      <h1><T.span text='Game.UI.TraitDefenceDialog.Mimicry_Title'/></h1>
      <div className='Row'>
        {targets.map(animal =>
          <div key={animal.id}
               className='Item'
               onClick={() => onClick(animal.id)}>
            <Animal model={animal}/>
          </div>
        )}
      </div>
    </div>);
  }

  renderOther(traits, onClick) {
    return (<div className='Other'>
      <h1><T.span text='Game.UI.TraitDefenceDialog.Other_Title'/></h1>
      <div className='Row'>
        {traits
          .map((trait, index) =>
            <div key={trait.id}
                 className='Item'
                 onClick={() => onClick(trait.id)}>
              <AnimalTraitIcon trait={trait}/>
            </div>
          )}
      </div>
    </div>);
  }
}

export default TraitDefenceDialog;