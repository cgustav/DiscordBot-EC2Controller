require("dotenv").config();
const AWSManager = require("./src/aws-manager");
const { Client, Intents, MessageEmbed } = require("discord.js");

const INSTANCE_STATUS = {
  PENDING: 0,
  RUNNING: 16,
  SHUTTING_DOWN: 32,
  TERMINATED: 48,
  STOPPING: 64,
  STOPPED: 80,
};

function getServerStatus(status) {
  switch (status) {
    case INSTANCE_STATUS.PENDING:
      return "Pendiente";
    case INSTANCE_STATUS.RUNNING:
      return "Disponible";
    case INSTANCE_STATUS.SHUTTING_DOWN:
      return "Apagado";
    case INSTANCE_STATUS.STOPPING:
      return "Apagando";
    case INSTANCE_STATUS.STOPPED:
      return "Apagado";
    case INSTANCE_STATUS.TERMINATED:
      return "No disponible";
    default:
      return "Desconocido";
  }
}

(async function main() {
  const manager = new AWSManager();

  const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  });

  const token = process.env.BOT_SECRET_TOKEN;

  try {
    client.on("Ready", () => {
      console.info("Bot is ready");
    });

    client.on("message", async (msg) => {
      const serverGame = "7 Days to Die";

      //   console.log("Message: ", msg);

      try {
        if (msg.content === "!soviet game status") {
          const status = await manager.checkInstanceStatus();
          const serverstatus = getServerStatus(status.instanceStatus);
          msg.channel.send(
            `Status Servidor: **${serverstatus}** - Juego Actual: **${serverGame}**.`
          );
        } else if (msg.content === "!soviet game play") {
          const serverstatus = await manager.checkInstanceStatus();
          const status = serverstatus.instanceStatus;
          console.log("STATUS: ", status);
          if (status === INSTANCE_STATUS.RUNNING) {
            msg.channel.send(
              `El servidor ya está **Disponible**! (**${serverGame}**).`
            );
          } else if (
            status === INSTANCE_STATUS.TERMINATED ||
            status === INSTANCE_STATUS.SHUTTING_DOWN ||
            status === INSTANCE_STATUS.STOPPING
          ) {
            msg.channel.send(`Ups! El servidor no está disponible mi helmano.`);
          } else {
            await manager.runInstance(serverstatus.instanceId);
            msg.channel.send(
              `Ejale! Iniciando servidor... pol favol espera unos minutos.`
            );
          }
        } else if (msg.content === "!soviet game ip") {
          const embed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Server Game IP")
            .addFields(
              { name: "Juego", value: "7 Days to Die (Steam)" },
              { name: "IP", value: "7days.zozlabs.io" },
              { name: "Puerto", value: "27900" },
              { name: "Contraseña", value: "Chuink123!" }
            );

          msg.channel.send({ embeds: [embed] });
        } else if (msg.content === "!soviet commands") {
          const embed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle("SovietBot Commands")
            .setURL("https://discord.js.org/")
            .setAuthor({
              name: "Some name",
              iconURL:
                "https://static.vecteezy.com/system/resources/previews/005/146/626/non_2x/soviet-union-russia-ex-country-flag-symbol-golden-gradient-free-vector.jpg",
              url: "https://discord.js.org",
            })
            .setDescription("Al servicio de todos los miembros del partido!")
            .setThumbnail(
              "https://c2.staticflickr.com/6/5491/30763550711_bf0e0b5cce_b.jpg"
            )
            .addFields(
              { name: "Comandos", value: "!soviet commands" },
              { name: "Status de servidor", value: "!soviet game status" },
              { name: "Conexion a servidor", value: "!soviet game ip" },
              { name: "Iniciar servidor", value: "!soviet game play" },

              { name: "\u200B", value: "\u200B" }
              //   {
              //     name: "Inline field title",
              //     value: "Some value here",
              //     inline: true,
              //   },
              //   {
              //     name: "Inline field title",
              //     value: "Some value here",
              //     inline: true,
              //   }
            )
            // .addField("Azies", "Some value here", true)
            .setImage("http://k17.eus/wp-content/uploads/2017/05/01-irudia.jpg")
            .setTimestamp()
            .setFooter({
              text: "да здравствует вечеринка",
              iconURL:
                "http://k17.eus/wp-content/uploads/2017/05/01-irudia.jpg",
            });
          //
          //   msg.channel.send({ data: embed });

          msg.channel.send({ embeds: [embed] });
        }

        // else {
        //   msg.channel.send("Hasta la proximaaa");
        // }
      } catch (error) {
        console.error("Excecution Error: ", error);
        msg.channel.send(`Ha ocurrido un error :((`);
      }
    });

    client.login(token.trim());
  } catch (error) {
    console.error("Fatal APP Error: ", error);
  }
})();
