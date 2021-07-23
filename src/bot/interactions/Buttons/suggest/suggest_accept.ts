/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  ButtonInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import Button from "../../../struct/Button";

abstract class ModsInteraction extends Button {
  constructor() {
    super({
      name: "suggest_accept",
    });
  }

  public async exec(interaction: ButtonInteraction) {
    return;
  }
}

export default ModsInteraction;
