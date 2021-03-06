import ReactDOM from 'react-dom';
import Velocity from 'velocity-animate'

import {gameGiveCards, gameGiveCardsOther} from './gameGiveCards';

import * as localTraits from './traits';

// [actionName]: (done, actionData, getState, componentProps)
export const createAnimationServiceConfig = () => ({
  animations: ({subscribe, getRef}) => {
    subscribe('gameGiveCards', ({userId, cards}, getState) => {
      const game = getState().get('game');
      if (game.userId === userId)
        return gameGiveCards(game, cards, getRef);
      else
        return gameGiveCardsOther(userId, game.deck.size, cards, getRef)
    });

    subscribe('traitNotify_Start', ((actionData, getState) => {
      const {sourceAid, traitId, traitType, targetId} = actionData;
      if (localTraits[traitType + '_Start']) {
        return localTraits[traitType + '_Start'](actionData);
      } else {
        return localTraits.pingTrait(traitId);
      }
    }));

    subscribe('traitNotify_End', (actionData, getState) => {
      // console.log('traitNotify_End', actionData);
      const {sourceAid, traitId, traitType, targetId} = actionData;
      if (localTraits[traitType + '_End']) {
        return localTraits[traitType + '_End'](actionData);
      }
    });

    subscribe('gameFoodTake_Start', (actionData, getState) =>
      localTraits.gameFoodTake_Start(actionData));

    subscribe('gameFoodTake_End', (actionData, getState) =>
      localTraits.gameFoodTake_End(actionData));

    // subscribe('animalDeath', (actionData, getState) => {
    //   const {animalId} = actionData;
    //   const AnimalHtml = document.getElementById('Animal' + animalId);
    //   if (AnimalHtml) AnimalHtml.classList.add('Death');
    //   else console.warn('No AnimalHtml for ', animalId);
    // });
  }
});