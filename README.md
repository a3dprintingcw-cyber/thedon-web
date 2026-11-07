# The Don Street Restaurant · website (demo)

Demo website and ordering for The Don Street Restaurant, Curaçao. Static files on GitHub Pages, no backend yet.

| Page | Address | For |
| --- | --- | --- |
| Website | `/` | Customers |
| Ordering | `/order.html` | Customers: menu, options, cart, pickup or delivery, live order status |
| Kitchen board | `/kitchen/` | Staff: New, Cooking, Ready, paid toggles, wait time, pause, alarm |

Demo mode: orders are kept in the browser (`store.js`, localStorage). Placing an order on `/order.html` makes it appear on `/kitchen/` in the same browser, and status changes on the board show up on the customer's order screen. Nothing is sent anywhere. "Reset demo" on the board clears it.

When The Don signs on, this moves to the same setup as Volcano: a Cloudflare Worker with a D1 database, staff PINs and Sentoo payments.

Menu and prices: `MENU` array at the top of the script in `order.html` (XCG).
