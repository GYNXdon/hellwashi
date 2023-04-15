import KuCoin from "kucoin-node-sdk";
import config from "./config";

const client = new KuCoin(config.apiKey, config.apiSecret, config.passPhrase);

const pricePrecision = {
  "BTC-USDT": 1,
  "ETH-USDT": 2,
  "XRP-USDT": 4,
  "LINK-USDT": 3,
  "GMT-USDT": 4,
  "DAR-USDT": 3,
  "REEF-USDT": 6,
  "DUSK-USDT": 5,
  "APE-USDT": 3,
  "MKR-USDT": 1,
};

const contractPrecision = {
  "BTC-USDT": 3,
  "ETH-USDT": 3,
  "XRP-USDT": 1,
  "LINK-USDT": 2,
  "DAR-USDT": 1,
  "REEF-USDT": 0,
  "DUSK-USDT": 0,
  "APE-USDT": 0,
  "GMT-USDT": 0,
  "MKR-USDT": 3,
};

export const handleWebhook = async (req, res) => {
  const alert = req.body;
  console.log("----RECEIVING order----");
  console.log("alert", alert);
  if (!alert?.symbol) {
    return res.json({ message: "ok" });
  }

  try {
    // Ignore TP/SL orders
    // TradingView is sending a TP/SL order
    // We ignore this alert because TP/SL is set at position entry
    if (
      alert.strategy.order_id.includes("TP") ||
      alert.strategy.order_id.includes("SL")
    ) {
      console.log("---TP/SL order ignore---");
      return res.json({ message: "ok" });
    }

    // When Tradingview sends alert, we will get the order contracts sent from Tradingview
    // We use this quantity to open position in KuCoin
    // we also need to change the contract precision because the one got from TV is different for KuCoin
    let quantity = Number(
      Number(alert.strategy.order_contracts).toFixed(
        contractPrecision[alert?.symbol]
      )
    );

    // Get the take profit price from Tradingview order
    const take_profit_price = Number(
      Number(alert.strategy.meta_data?.tp_price || 0).toFixed(
        pricePrecision[alert?.symbol]
      )
    );

    // Get the stop loss price from Tradingview order
    const stop_loss_price = Number(
      Number(alert.strategy.meta_data?.sl_price || 0).toFixed(
        pricePrecision[alert?.symbol]
      )
    );

    // Get order action from Tradingview. Either 'BUY' or 'SELL'
    const side = alert.strategy.order_action.toUpperCase();

    // Entry the position with MARKET PRICE
    if (alert.strategy.strategy_action === "entry") {
      let options = {
        symbol: alert?.symbol,
        side: side,
        type: "MARKET",
        quantity: quantity,
      };
      console.log("---ENTRY Order Starting---");
      console.log("options", options);
      let result = await client.futuresOrder(options);

      console.log("---ENTRY Order successful---");
      console.log("---ENTRY Order Result---", result);

      // Set a TP order when entering a position
      if (take_profit_price) {
        const tp_side = side === "BUY" ? "SELL" : "BUY";

        let tp_options = {};

        // Here we can use either LIMIT order or TAKE PROFIT MARKET order
        // I would recommend TAKE PROFIT MARKET order to prevent unexpected behavior
        if (alert?.strategy.take_profit_type === "market") {
            tp_options = {
              symbol: alert?.symbol,
              side: tp_side,
              type: "MARKET",
              quantity: quantity,
              reduceOnly: true,
            };
          } else {
            tp_options = {
              symbol: alert?.symbol,
              side: tp_side,
              type: "LIMIT",
              quantity: quantity,
              price: take_profit_price,
              reduceOnly: true,
            };
          }
    
          console.log("---TP Order Starting---");
          console.log("options", tp_options);
          let tp_result = await client.futuresOrder(tp_options);
    
          console.log("---TP Order successful---");
          console.log("---TP Order Result---", tp_result);
        }
      }
    
      // Exit the position with MARKET PRICE
      if (alert.strategy.strategy_action === "exit") {
        let options = {
          symbol: alert?.symbol,
          side: side === "BUY" ? "SELL" : "BUY",
          type: "MARKET",
          quantity: quantity,
          reduceOnly: true,
        };
        console.log("---EXIT Order Starting---");
        console.log("options", options);
        let result = await client.futuresOrder(options);
    
        console.log("---EXIT Order successful---");
        console.log("---EXIT Order Result---", result);
      }
    }
