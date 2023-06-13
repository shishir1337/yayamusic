const { EmbedBuilder, ApplicationCommandType, WebhookClient } = require("discord.js"); // packages
const { check_if_dj } = require("../../Util/functions");
const weblog = require('../../Config/webhook.json');
const wbc = new WebhookClient({
  id: weblog.cmdl.id,
  token: weblog.cmdl.token,
});

module.exports = {
  name: 'yaya-playskip', // name of the command
  description: 'Plays a Song/Playlist and skips!', // description of the command
  usage: '/playskip [song_name]', // usage of the cmd
  category: 'Queue', // cmd category
  developer: false, // false if the command is for public
  type: ApplicationCommandType.ChatInput, // chatinput
  cooldown: 3000, // cooldown of the commands
  default_member_permissions: 'SendMessages', // discord perms user to see the cmd 
  userPerms: ['SendMessages'], // user perms need to use the command
  botPerms: ['SendMessages', 'ReadMessageHistory', 'Speak', 'Connect', 'UseExternalEmojis', 'AddReactions', 'EmbedLinks', 'AttachFiles'], // bot permissions
  inVoiceChannel: true,
  sameVoice: true,
  options: [
    {
      name: "song",
      description: "Which Song do you want to play",
      type: 3,
      required: true,
      autocomplete: true
    },
  ], // options string
  execute: async (client, interaction) => {
    wbc.send(`[slashCommand] :: **Playskip used by ${interaction.user.tag} from ${interaction.guild.name}**`);
    try {
      const { member, channelId, guildId, options } = interaction;
      const { guild } = member;
      const { channel } = member.voice;
      try {
        if (!client.usernews.get(guild.id, "news").includes(interaction.user.id)) {
          if (interaction.options.getString("song")) {
            const Text = options.getString("song");
            await interaction.reply({
              content: `🔍 Searching... ${Text}`,
              ephemeral: true
            }).then(() => {
              interaction.followUp({ content: `<@${interaction.user.id}>`, embeds: [new EmbedBuilder().setColor(client.important.MAIN_COLOR).setTitle(client.config.alert.title).setDescription(client.config.alert.desc).setThumbnail(client.config.alert.thumb)] })
            });
            let queue = client.distube.getQueue(guildId)
            let options = {
              member: member,
              skip: true
            }
            if (!queue || !queue.songs || queue.songs.length == 0) return interaction.followUp({
              embeds: [
                new EmbedBuilder().setColor(client.important.ERR_COLOR).setTitle(`${client.emoji.blank} | Error`).setDescription(client.emoji.cross + " | No songs are playing at the moment")
              ],
              ephemeral: true
            }).then(() => {
              interaction.followUp({ content: `<@${interaction.user.id}>`, embeds: [new EmbedBuilder().setColor(client.important.MAIN_COLOR).setTitle(client.config.alert.title).setDescription(client.config.alert.desc).setThumbnail(client.config.alert.thumb)] })
            })
            if (check_if_dj(client, member, queue.songs[0])) {
              return interaction.followUp({
                embeds: [new EmbedBuilder()
                  .setColor(client.important.ERR_COLOR)
                  .setFooter({ text: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
                  .setTitle(client.emoji.blank + " Not DJ!")
                  .setDescription(`${client.emoji.cross} | **You are not a DJ and not the Song Requester!**\n**DJ-Roles:**\n> ${check_if_dj(client, member, queue.songs[0])}`)
                ],
                ephemeral: true
              }).then(() => {
                interaction.followUp({ content: `<@${interaction.user.id}>`, embeds: [new EmbedBuilder().setColor(client.important.MAIN_COLOR).setTitle(client.config.alert.title).setDescription(client.config.alert.desc).setThumbnail(client.config.alert.thumb)] })
              });
            }
            if (!queue) options.textChannel = guild.channels.cache.get(channelId)
            await client.distube.play(channel, Text, options)

            interaction.followUp({
              content: `${queue?.songs?.length > 0 ? "⏭ Skipping to" : "🎶 Now Playing"}: \`\`\`css\n${Text}\n\`\`\``,
              ephemeral: true
            }).then(() => {
              interaction.followUp({ content: `<@${interaction.user.id}>`, embeds: [new EmbedBuilder().setColor(client.important.MAIN_COLOR).setTitle(client.config.alert.title).setDescription(client.config.alert.desc).setThumbnail(client.config.alert.thumb)] })
            })
          }
        } else if (client.usernews.get(guild.id, "news").includes(interaction.user.id)) {
          if (interaction.options.getString("song")) {
            const Text = options.getString("song");
            await interaction.reply({
              content: `🔍 Searching... ${Text}`,
              ephemeral: true
            });
            let queue = client.distube.getQueue(guildId)
            let options = {
              member: member,
              skip: true
            }
            if (!queue || !queue.songs || queue.songs.length == 0) return interaction.followUp({
              embeds: [
                new EmbedBuilder().setColor(client.important.ERR_COLOR).setTitle(`${client.emoji.blank} | Error`).setDescription(client.emoji.cross + " | No songs are playing at the moment")
              ],
              ephemeral: true
            })
            if (check_if_dj(client, member, queue.songs[0])) {
              return interaction.followUp({
                embeds: [new EmbedBuilder()
                  .setColor(client.important.ERR_COLOR)
                  .setFooter({ text: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
                  .setTitle(client.emoji.blank + " Not DJ!")
                  .setDescription(`${client.emoji.cross} | **You are not a DJ and not the Song Requester!**\n**DJ-Roles:**\n> ${check_if_dj(client, member, queue.songs[0])}`)
                ],
                ephemeral: true
              });
            }
            if (!queue) options.textChannel = guild.channels.cache.get(channelId)
            await client.distube.play(channel, Text, options)

            interaction.followUp({
              content: `${queue?.songs?.length > 0 ? "⏭ Skipping to" : "🎶 Now Playing"}: \`\`\`css\n${Text}\n\`\`\``,
              ephemeral: true
            })
          }
        }
      } catch (e) {
        console.log(e)
        await interaction.reply({
            embeds:
                [
                    new EmbedBuilder()
                        .setTitle(client.emoji.warning + " Error!")
                        .setDescription("*n error occured!" + `${e}`)
                        .setColor(client.important.ERR_COLOR)
                ],
                ephemeral: true
        })
      }
    } catch (e) {
      console.log(e)
    }
  }
}