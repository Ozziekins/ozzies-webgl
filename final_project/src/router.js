import Landing from './pages/landing.js';
import SceneSelector from './pages/sceneSelector.js';
import Bedroom from './pages/bedroom.js';
import Dungeon from './pages/dungeon.js';

const routes = {
  '': 'Landing',
  'select': 'SceneSelector',
  'bedroom': 'Bedroom',
  'dungeon': 'Dungeon',
};

export default function getRoute() {
  const currentHash = window.location.hash.replace('#', '');
  return routes[currentHash] || 'Landing';
}
