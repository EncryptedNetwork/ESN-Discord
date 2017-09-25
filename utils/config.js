module.exports = {
  
  // BASE
    version: `1.1.4`, // BOT VERSION
    prefix: `!`, // GLOBAL COMMAND PREFIX
    devPrefix: `$`, // GLOBAL DEV COMMAND PREFIX
  
  // OPTIONS
    CON_STEAM: false,
    CON_DISCORD: true,
    CON_DB: true,
  
  // STATUS
    STATUS_DB: `offline`,
    STATUS_STEAM: `offline`,
    STATUS_DISCORD: `offline`,
  
  // COLORS
    COLOR_ERROR: 15158332, // GLOBAL ERROR COLOR
    COLOR_CRITICAL: 10038562, // GLOBAL CRITICAL COLOR
    COLOR_WARNING: 15844367, // GLOBAL WARNING COLOR
    COLOR_SUCCESS: 3066993, // GLOBAL SUCCESS COLOR

    ANNOUNCE_UPDATES: 3066993,
    ANNOUNCE_ERROR: 0x8e0000,
    ANNOUNCE_SCHEDULED: 0x47008e,
    ANNOUNCE_ALERTS: 0xcece00,

  // SETTINGS

    // MESSAGE CLEANUP
      MESSAGE_CLEANUP: false,
      MESSAGE_TIMER: 10,

    // COMMAND CLEANUP
      COMMAND_CLEANUP: true,

    // DB LOGGING
      LOG_COMMANDS: false,
      LOG_MODERATIONS: false
  
}