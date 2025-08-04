import "./style.css";
import { GameEvent } from "./control-flow/events";
import { ChoiceController } from "./controllers/choice/choice-controller";
import { Currency } from "./controllers/currency/currencies";
import { CurrencyController } from "./controllers/currency/currency-controller";
import { MachineController } from "./controllers/machine/machine-controller";
import { StoryController } from "./controllers/story/story-controller";
import { GameController } from "./game-controller";

// The game controller is the main entry point for the game
const game = new GameController();

// Ideally we dont do this
game.save.purge();

// Add game controllers
game.addController(new CurrencyController());
game.addController(new ChoiceController());
game.addController(new MachineController());
game.addController(new StoryController());

// Start the game
game.start();
