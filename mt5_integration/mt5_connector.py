import MetaTrader5 as mt5
import argparse
import json
from datetime import datetime, timedelta
import pytz
import sys

def connect_mt5(account, password, server):
    if not mt5.initialize(server=server, login=account, password=password):
        print(json.dumps({'error': f'Failed to initialize MT5: {mt5.last_error()}'}))
        sys.exit(1)

def get_market_data(symbol, timeframe, count):
    timeframe_map = {
        'M1': mt5.TIMEFRAME_M1,
        'M5': mt5.TIMEFRAME_M5,
        'M15': mt5.TIMEFRAME_M15,
        'M30': mt5.TIMEFRAME_M30,
        'H1': mt5.TIMEFRAME_H1,
        'H4': mt5.TIMEFRAME_H4,
        'D1': mt5.TIMEFRAME_D1,
        'W1': mt5.TIMEFRAME_W1,
        'MN1': mt5.TIMEFRAME_MN1
    }
    mt5_timeframe = timeframe_map.get(timeframe, mt5.TIMEFRAME_H1)
    rates = mt5.copy_rates_from_pos(symbol, mt5_timeframe, 0, count)
    if rates is None:
        return []
    data = []
    for rate in rates:
        data.append({
            'symbol': symbol,
            'timestamp': datetime.fromtimestamp(rate['time']).isoformat(),
            'open': float(rate['open']),
            'high': float(rate['high']),
            'low': float(rate['low']),
            'close': float(rate['close']),
            'volume': int(rate['tick_volume'])
        })
    return data

def get_tick_data(symbol):
    tick = mt5.symbol_info_tick(symbol)
    if tick is None:
        return None
    return {
        'symbol': symbol,
        'timestamp': datetime.fromtimestamp(tick.time).isoformat(),
        'bid': float(tick.bid),
        'ask': float(tick.ask),
        'last': float(tick.last),
        'volume': int(tick.volume)
    }

def get_trade_history(from_iso=None, to_iso=None):
    utc = pytz.utc
    now = datetime.now(utc)

    if from_iso:
        try:
            utc_from = datetime.fromisoformat(from_iso)
            if utc_from.tzinfo is None:
                utc_from = utc_from.replace(tzinfo=utc)
        except:
            utc_from = now - timedelta(days=30)
    else:
        utc_from = now - timedelta(days=30)

    if to_iso:
        try:
            utc_to = datetime.fromisoformat(to_iso)
            if utc_to.tzinfo is None:
                utc_to = utc_to.replace(tzinfo=utc)
        except:
            utc_to = now
    else:
        utc_to = now

    deals = mt5.history_deals_get(utc_from, utc_to)
    if deals is None:
        return []
    trades = []
    for deal in deals:
        trades.append({
            'deal_id': deal.ticket,
            'order_id': deal.order,
            'symbol': deal.symbol,
            'type': deal.type,
            'volume': deal.volume,
            'price': deal.price,
            'profit': deal.profit,
            'time': datetime.fromtimestamp(deal.time).isoformat()
        })
    return trades

def get_open_trades(symbol=None):
    positions = mt5.positions_get(symbol=symbol if symbol else None)
    results = []
    if positions:
        for pos in positions:
            results.append({
                'ticket': pos.ticket,
                'symbol': pos.symbol,
                'type': pos.type,
                'volume': pos.volume,
                'open_price': pos.price_open,
                'sl': pos.sl,
                'tp': pos.tp,
                'profit': pos.profit,
                'open_time': datetime.fromtimestamp(pos.time).isoformat()
            })
    return results

def handle_trade(args):
    # For manual trade entry
    type_map = {'BUY': mt5.ORDER_TYPE_BUY, 'SELL': mt5.ORDER_TYPE_SELL}
    if not args.symbol or not args.trade_type or not args.volume:
        print(json.dumps({'error': 'Missing trade params'}))
        sys.exit(1)
    symbol_info = mt5.symbol_info_tick(args.symbol)
    if not symbol_info:
        print(json.dumps({'error': f'Invalid symbol {args.symbol}'}))
        sys.exit(1)
    price = symbol_info.ask if args.trade_type.upper() == 'BUY' else symbol_info.bid

    order = {
        "action": mt5.TRADE_ACTION_DEAL,
        "symbol": args.symbol,
        "volume": args.volume,
        "type": type_map[args.trade_type.upper()],
        "price": price,
        "deviation": 20,
        "magic": 1000,
        "comment": "Manual trade from web",
        "type_time": mt5.ORDER_TIME_GTC,
        "type_filling": mt5.ORDER_FILLING_IOC,
    }
    if args.sl:
        order["sl"] = args.sl
    if args.tp:
        order["tp"] = args.tp

    result = mt5.order_send(order)
    output = {
        'order': order,
        'result': result._asdict() if hasattr(result, '_asdict') else str(result)
    }
    print(json.dumps(output))
    sys.stdout.flush()

def main():
    parser = argparse.ArgumentParser(description='MT5 Data Fetcher')
    parser.add_argument('--account', type=int, required=True)
    parser.add_argument('--password', type=str, required=True)
    parser.add_argument('--server', type=str, required=True)
    parser.add_argument('--symbol', type=str, required=False)
    parser.add_argument('--timeframe', type=str, default='H1')
    parser.add_argument('--count', type=int, default=100)
    parser.add_argument('--type', type=str, default='candle', choices=['candle', 'tick', 'connect', 'account', 'trade_history', 'trade', 'open_trades'])
    parser.add_argument('--from', dest='from_date', type=str, required=False)
    parser.add_argument('--to', dest='to_date', type=str, required=False)
    # For manual trade
    parser.add_argument('--trade_type', type=str, required=False) # BUY or SELL
    parser.add_argument('--volume', type=float, required=False)
    parser.add_argument('--sl', type=float, required=False)
    parser.add_argument('--tp', type=float, required=False)

    args = parser.parse_args()

    # Connect/Account logic (no trade)
    if args.type == 'connect':
        if not mt5.initialize(server=args.server, login=args.account, password=args.password):
            print(json.dumps({ "success": False, "error": str(mt5.last_error()) }))
        else:
            print(json.dumps({ "success": True }))
            mt5.shutdown()
        exit(0)

    if args.type == 'account':
        if not mt5.initialize(server=args.server, login=args.account, password=args.password):
            print(json.dumps({ "success": False, "error": str(mt5.last_error()) }))
        else:
            acc = mt5.account_info()
            if acc is None:
                print(json.dumps({ "success": False, "error": "Could not retrieve account info" }))
            else:
                print(json.dumps({
                    "success": True,
                    "balance": acc.balance,
                    "equity": acc.equity,
                    "margin": acc.margin,
                    "free_margin": acc.margin_free,
                    "margin_level": acc.margin_level,
                    "leverage": acc.leverage,
                    "name": acc.name,
                    "login": acc.login,
                    "currency": acc.currency
                }))
            mt5.shutdown()
        exit(0)

    connect_mt5(args.account, args.password, args.server)

    if args.type == 'candle':
        data = get_market_data(args.symbol, args.timeframe, args.count)
        print(json.dumps(data))
    elif args.type == 'tick':
        tick = get_tick_data(args.symbol)
        print(json.dumps(tick))
    elif args.type == 'trade_history':
        data = get_trade_history(args.from_date, args.to_date)
        print(json.dumps(data))
    elif args.type == 'trade':
        handle_trade(args)
    elif args.type == 'open_trades':
        data = get_open_trades(args.symbol)
        print(json.dumps(data))
    else:
        print(json.dumps({'error': 'Invalid type parameter'}))

    mt5.shutdown()

if __name__ == '__main__':
    main()
