import Path from 'path';
import Fs   from 'fs';

export default class ScriptLoader {
  /**
   * コンストラクタ
   *
   * @param {Object} controller - Controller object
   * @param {Object} bot        - Bot object
   *
   * @returns {void}
   */
  constructor(controller, bot) {
    this.controller = controller;
    this.bot        = bot;
    this.logger     = controller.log;

    // チームIDの保存
    // Slash Command受付時にteam idが保存されていないとエラーになる
    // https://github.com/howdyai/botkit/issues/108
    bot.api.team.info({}, (_, res) => {
      controller.storage.teams.save({id: res.team.id}, err => {
        if (err) {
          this.logger.error(err);
        }
      });
    });
  }

  /**
   * Loads a file in path.
   *
   * @param {string} path - A String path on the filesystem.
   * @param {string} file - A String filename in path on the filesystem.
   *
   * @returns {void}
   */
  loadFile(path, file) {
    const ext  = Path.extname(file);
    const full = Path.join(path, Path.basename(file, ext));

    if (!require.extensions[ext]) {
      return;
    }

    try {
      const script = require(full);

      if (typeof script === 'function') {
        script(this.controller, this.bot);
      } else {
        this.logger.warning(
          `Expected ${full} to assign a function to module.exports, got ${typeof script}`
        );
      }
    } catch (error) {
      this.logger.error(`Unable to load ${full}: ${error.stack}`);
      process.exit(1);
    }
  }

  /**
   * Loads every script in the given path.
   *
   * @param {string} path - A String path on the filesystem.
   *
   * @returns {void}
   */
  load(path) {
    this.logger.debug(`Loading scripts from ${path}`);

    if (!Fs.existsSync(path)) {
      return;
    }

    Fs.readdirSync(path)
      .filter(file => !(/^\..*/).test(file))
      .sort()
      .forEach(file => this.loadFile(path, file));
  }
}
