const yt = require('ytdl-core');
const utils = require('../utils/config');

let queue = {};

const tokens = {
  "adminID" : "184873285304057856",
    "prefix" : utils.prefix,
  "passes" : 1 //can be increased to reduce packetloss at the expense of upload bandwidth, 4-5 should be lossless at the expense of 4-5x upload
}

module.exports = (esndb, params) => {
	const {author, args, channel, client, member, message: msg} = params;
	const {username, id} = author;

const commands = {
  'play': (msg) => {
    if (queue[msg.guild.id] === undefined) return channel.sendEmbed({ color: utils.COLOR_ERROR, title: "Error:", description: `Add some songs to the queue first with ${tokens.prefix}add (url).`});
    if (!msg.guild.voiceConnection) return commands.join(msg).then(() => commands.play(msg));
    if (queue[msg.guild.id].playing) return channel.sendEmbed({ color: utils.COLOR_ERROR, title: "Error:", description: `Player is already playing a song.`});
    let dispatcher;
    queue[msg.guild.id].playing = true;

    console.log(queue);
    (function play(song) {
      console.log(song);
      if (song === undefined) return channel.sendEmbed({ color: utils.COLOR_WARNING, title: "Warning", description: `Queue has been emptied or is empty.`}).then(() => {
        queue[msg.guild.id].playing = false;
      });
      channel.sendEmbed({ color: utils.COLOR_SUCCESS, title: `**${song.title}**`, description: `Is now being played as requested by: **${song.requester}**`});
      dispatcher = msg.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), { passes : tokens.passes });
      let collector = msg.channel.createCollector(m => m);
      collector.on('message', m => {
        if (m.content.startsWith(tokens.prefix + 'pause')) {
          channel.sendEmbed({ color: utils.COLOR_SUCCESS, title: "Player Paused", description: `Player has been paused.`}).then(() => {dispatcher.pause();});
        } else if (m.content.startsWith(tokens.prefix + 'resume')){
          channel.sendEmbed({ color: utils.COLOR_SUCCESS, title: "Player Resumed", description: `Player has been resumed.`}).then(() => {dispatcher.resume();});
        } else if (m.content.startsWith(tokens.prefix + 'skip')){
          channel.sendEmbed({ color: utils.COLOR_SUCCESS, title: "Skipping Current Song", description: `Player has skipped the current song.`}).then(() => {dispatcher.end();});
        } else if (m.content.startsWith(tokens.prefix + 'volume+')){
          if (Math.round(dispatcher.volume*50) >= 100) return msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
          dispatcher.setVolume(Math.min((dispatcher.volume*50 + (2*(m.content.split('+').length-1)))/50,2));
          channel.sendEmbed({ color: utils.COLOR_SUCCESS, title: "Volume", description: `${Math.round(dispatcher.volume*50)}%`});
        } else if (m.content.startsWith(tokens.prefix + 'volume-')){
          if (Math.round(dispatcher.volume*50) <= 0) return msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
          dispatcher.setVolume(Math.max((dispatcher.volume*50 - (2*(m.content.split('-').length-1)))/50,0));
          channel.sendEmbed({ color: utils.COLOR_SUCCESS, title: "Volume", description: `${Math.round(dispatcher.volume*50)}%`});
        } else if (m.content.startsWith(tokens.prefix + 'time')){
          channel.sendEmbed({ color: utils.COLOR_SUCCESS, title: "Time", description: `${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)}`});
        } else if (m.content.startsWith(tokens.prefix + 'stop' || tokens.prefix + 'leave')){
          channel.sendEmbed({ color: utils.COLOR_WARNING, title: "Player Stopped", description: `Player has been stopped.`}).then(() => {dispatcher.destroy();});
        }

      });
      dispatcher.on('end', () => {
        collector.stop();
        play(queue[msg.guild.id].songs.shift());
      });
      dispatcher.on('error', (err) => {
        return msg.channel.sendMessage('Error: ' + err).then(() => {
          collector.stop();
          play(queue[msg.guild.id].songs.shift());
        });
      });
    })(queue[msg.guild.id].songs.shift());;
  },
  'join': (msg) => {
    return new Promise((resolve, reject) => {
      const voiceChannel = msg.member.voiceChannel;
      if (!voiceChannel || voiceChannel.type !== 'voice') return channel.sendEmbed({ color: utils.COLOR_ERROR, title: "Error Connecting", description: `I couldn't connect to your channel...`});
      voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
    });
  },
  'add': (msg) => {
    let url = msg.content.split(' ')[1];
    if (url == '' || url === undefined) return channel.sendEmbed({ color: utils.COLOR_ERROR, title: "Error:", description: `You must enter a YouTube ID or a valid link/argument after ~add.`});
    yt.getInfo(url, (err, info) => {
      if(err) return channel.sendEmbed({ color: utils.COLOR_ERROR, title: "Error:", description: `Invalid YouTube link:` + err});
      if (!queue.hasOwnProperty(msg.guild.id)) queue[msg.guild.id] = {}, queue[msg.guild.id].playing = false, queue[msg.guild.id].songs = [];
      queue[msg.guild.id].songs.push({url: url, title: info.title, requester: msg.author.username});
      channel.sendEmbed({ color: utils.COLOR_SUCCESS, title: "Song added to Queue!", description: `Added **${info.title}** to the queue.`});
    });
  },
  'queue': (msg) => {
    if (queue[msg.guild.id] === undefined) return channel.sendEmbed({ color: utils.COLOR_ERROR, title: "Error:", description: `Please add a song to the Queue first by using ~add (url)`});
    let tosend = [];
    queue[msg.guild.id].songs.forEach((song, i) => { tosend.push(`${i+1}. ${song.title} - Requested by: ${song.requester}`);});
    msg.channel.sendMessage(`__**${msg.guild.name}'s Music Queue:**__ Currently **${tosend.length}** songs queued ${(tosend.length > 15 ? '*[Only next 15 shown]*' : '')}\n\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);
  },
  // 'help': (msg) => {
  //   let tosend = ['```xl', tokens.prefix + 'join : "Join Voice channel of msg sender"', tokens.prefix + 'add : "Add a valid youtube link to the queue"', tokens.prefix + 'queue : "Shows the current queue, up to 15 songs shown."', tokens.prefix + 'play : "Play the music queue if already joined to a voice channel"', '', 'the following commands only function while the play command is running:'.toUpperCase(), tokens.prefix + 'pause : "pauses the music"', tokens.prefix + 'resume : "resumes the music"', tokens.prefix + 'skip : "skips the playing song"', tokens.prefix + 'time : "Shows the playtime of the song."',  'volume+(+++) : "increases volume by 2%/+"',  'volume-(---) : "decreases volume by 2%/-"',  '```'];
  //   msg.channel.sendMessage(tosend.join('\n'));
  // },
  'reboot': (msg) => {
    if (msg.author.id == tokens.adminID) process.exit(); //Requires a node module like Forever to work.
  }
};

if (!msg.content.startsWith(tokens.prefix)) return;
  if (commands.hasOwnProperty(msg.content.toLowerCase().slice(tokens.prefix.length).split(' ')[0])) commands[msg.content.toLowerCase().slice(tokens.prefix.length).split(' ')[0]](msg);
}

