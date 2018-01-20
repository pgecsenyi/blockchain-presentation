require('../css/style.css');

import { AssistantBitcoinSupply } from './assistants/assistant-bitcoin-supply';
import { AssistantEcc } from './assistants/assistant-ecc';
import { AssistantIntroduction } from './assistants/assistant-introduction';
import { AssistantMiningReward } from './assistants/assistant-mining-reward';
import { AssistantGroup } from './framework/assistant-group';
import { initialize as initializeSlideshow } from './framework/slideshow';
import { FadeTransition } from './framework/transitions';

var assistantIntro = new AssistantIntroduction('intro-canvas');
var assistantEcc = new AssistantEcc('ecc-canvas');
var assistantMiningReward = new AssistantMiningReward('mining-reward-canvas');
var assistantBitcoinSupply = new AssistantBitcoinSupply('bitcoin-supply-canvas');

var assistantGroup = new AssistantGroup();
assistantGroup.add(assistantIntro, 1);
assistantGroup.add(assistantEcc, 3);
assistantGroup.add(assistantMiningReward, 8);
assistantGroup.add(assistantBitcoinSupply, 9);

initializeSlideshow(assistantGroup, new FadeTransition());
