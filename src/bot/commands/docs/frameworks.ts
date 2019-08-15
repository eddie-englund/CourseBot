import { Command, Argument } from 'discord-akairo';
import DongClient from 'src/bot/client/CourseClient';
import { Message } from 'discord.js';
import { stripIndents } from 'common-tags';

export default class Frameworks extends Command {
  client: DongClient;
  constructor() {
    super('frameworks', {
      aliases: ['frameworks', 'docs'],
      category: 'docs',
      clientPermissions: ['SEND_MESSAGES'],
      args: [
        {
          id: 'framework',
          prompt: {
            optional: false,
            start: message =>
              `${message.author}, what framework would you like the docs for?`,
            retry: message => `${message.author}, comon now! I know you can do it!`
          }
        }
      ]
    });
  }

  public async exec(message: Message, { framework }) {
    // vue, react, electron, angular, svelete, discord.js, discord.js

    switch (framework) {
      case 'vue':
        message.util!.send('https://vuejs.org/v2/guide/');
        break;
      case 'react':
        message.util!.send('https://reactjs.org/docs/getting-started.html');
        break;
      case 'electron':
        message.util!.send('https://electronjs.org/docs');
        break;
      case 'angular':
        message.util!.send('https://angular.io/docs');
        break;
      case 'svelte':
        message.util!.send('https://svelte.dev/docs');
        break;
      case 'discord.js':
        message.util!.send('https://discord.js.org/#/docs/');
        break;
      case 'discord-akairo':
        message.util!.send('https://discord-akairo.github.io/#/docs/');
        break;
      default:
        message.util!.send(
          stripIndents`${message.author}, These are the avalible frameworks:
            • vue
            • react
            • angular
            • electron
            • svelte
            • discord.js
            • discord-akairo
            `
        );
    }
  }
}
