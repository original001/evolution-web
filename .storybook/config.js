import { configure } from '@storybook/react';
import '../client/components/game/global.scss'

function loadStories() {
  require('../stories/card.jsx');
  // You can require as many stories as you need.
}


configure(loadStories, module);