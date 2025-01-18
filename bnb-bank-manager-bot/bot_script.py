import os
from dotenv import load_dotenv
from telegram import Update, ParseMode
from telegram.ext import Updater, CommandHandler, CallbackContext

# Load environment variables from .env file
load_dotenv()

# Fetch the bot token and contract address from environment variables
BOT_TOKEN = os.getenv("BOT_TOKEN")
CONTRACT_ADDRESS = os.getenv("CMY_CONTRACT")
WEBSITE_ADDRESS = os.getenv("WEBSITE_ADDRESS")
TWITTER_ADDRESS = os.getenv("TWITTER_ADDRESS")
TOTAL_SUPPLY = os.getenv("TOTAL_SUPPLY")


# Define the function that handles the /ca command
def ca_command(update: Update, context: CallbackContext) -> None:
    contract_details = f"Here is your contract address:\n`{CONTRACT_ADDRESS}`"
    update.message.reply_text(contract_details, parse_mode=ParseMode.MARKDOWN),


def website_command(update: Update, context: CallbackContext) -> None:
    website_details = f"Here is our website address:\n`{WEBSITE_ADDRESS}`"
    update.message.reply_text(website_details, parse_mode=ParseMode.MARKDOWN)


def twitter_command(update: Update, context: CallbackContext) -> None:
    twitter_details = f"Here is our twitter address:\n`{TWITTER_ADDRESS}`"
    update.message.reply_text(twitter_details, parse_mode=ParseMode.MARKDOWN)


def supply_command(update: Update, context: CallbackContext) -> None:
    supply_details = TOTAL_SUPPLY
    update.message.reply_text(supply_details)


def tax_command(update: Update, context: CallbackContext) -> None:
    tax_details = (
        "Tax Details:\n"
        "Tax: 3% BUY & 3% SELL\n"
        "TAX ARE NOT MODIFICABLE, EVEN OWNER CANNOT CHANGE ITS VALUE\n"
        "🔥"
    )
    update.message.reply_text(tax_details, parse_mode=ParseMode.MARKDOWN)


# Main function to set up the bot
def main() -> None:
    # Create an Updater object with the bot token
    updater = Updater(BOT_TOKEN, use_context=True)

    dispatcher = updater.dispatcher

    # Add handler for /ca command
    dispatcher.add_handler(CommandHandler("ca", ca_command))
    dispatcher.add_handler(CommandHandler("website", website_command))
    dispatcher.add_handler(CommandHandler("twitter", twitter_command))
    dispatcher.add_handler(CommandHandler("supply", supply_command))
    dispatcher.add_handler(CommandHandler("tax", tax_command))

    # Start the bot
    updater.start_polling()

    # Run the bot until you press Ctrl-C
    updater.idle()


if __name__ == '__main__':
    main()
